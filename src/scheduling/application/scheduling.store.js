/**
 * Application service store for BC02 — Scheduling & Calendar.
 * Coordinates show scheduling use cases, owns a temporary read-only
 * room slice for dropdown population, and keeps UI-facing state.
 *
 * @module useSchedulingStore
 */

import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {SchedulingApi} from "../infrastructure/scheduling-api.js";
import {ShowAssembler} from "../infrastructure/show.assembler.js";
import {RoomAssembler} from "../infrastructure/room.assembler.js";
import {ScheduleConflictAssembler} from "../infrastructure/schedule-conflict.assembler.js";

const schedulingApi = new SchedulingApi();

/**
 * Pinia store for BC02 — Scheduling & Calendar.
 * Manages shows, schedule conflicts, and a borrowed room slice used by
 * the show form. Provides fetching, creation, update, deletion, and
 * client-side room availability checks.
 *
 * @returns {Object} The store object with state, computed, and actions.
 */
const useSchedulingStore = defineStore("scheduling", () => {

    // --------------------------------------------------------------------
    // State — shows & conflicts
    // --------------------------------------------------------------------

    /**
     * List of show entities.
     * @type {import('vue').Ref<Show[]>}
     */
    const shows = ref([]);

    /**
     * List of schedule conflict entities.
     * @type {import('vue').Ref<ScheduleConflict[]>}
     */
    const scheduleConflicts = ref([]);

    // --------------------------------------------------------------------
    // State — borrowed room slice
    // --------------------------------------------------------------------

    /**
     * List of room entities, borrowed from BC03 (Room & Resource
     * Readiness) to populate the show form's room dropdown.
     *
     * @remarks
     * This slice will be removed once BC03 exposes its own Room store.
     * The show form will then import useRoomStore instead of consuming
     * rooms from this store.
     *
     * @type {import('vue').Ref<Room[]>}
     */
    const rooms = ref([]);

    // --------------------------------------------------------------------
    // State — cross-cutting
    // --------------------------------------------------------------------

    /**
     * List of errors encountered during API operations.
     * @type {import('vue').Ref<Error[]>}
     */
    const errors = ref([]);

    /**
     * Whether shows have been loaded from the API.
     * @type {import('vue').Ref<boolean>}
     */
    const showsLoaded = ref(false);

    /**
     * Whether schedule conflicts have been loaded from the API.
     * @type {import('vue').Ref<boolean>}
     */
    const scheduleConflictsLoaded = ref(false);

    /**
     * Whether rooms have been loaded from the API.
     * @type {import('vue').Ref<boolean>}
     */
    const roomsLoaded = ref(false);

    // --------------------------------------------------------------------
    // Computed counts
    // --------------------------------------------------------------------

    /**
     * Number of loaded shows.
     * @type {import('vue').ComputedRef<number>}
     */
    const showsCount = computed(() => showsLoaded.value ? shows.value.length : 0);

    /**
     * Number of loaded schedule conflicts.
     * @type {import('vue').ComputedRef<number>}
     */
    const scheduleConflictsCount = computed(() => scheduleConflictsLoaded.value ? scheduleConflicts.value.length : 0);

    /**
     * Number of loaded rooms.
     * @type {import('vue').ComputedRef<number>}
     */
    const roomsCount = computed(() => roomsLoaded.value ? rooms.value.length : 0);

    // --------------------------------------------------------------------
    // Actions — shows
    // --------------------------------------------------------------------

    /**
     * Loads shows from infrastructure and updates the application state.
     * @returns {void}
     */
    function fetchShows() {
        errors.value = [];

        schedulingApi.getShows().then((response) => {
            shows.value = ShowAssembler.toEntitiesFromResponse(response);
            showsLoaded.value = true;
        }).catch((err) => {
            errors.value.push(err);
        });
    }

    /**
     * Finds a show entity by identifier.
     * @param {number|string} id - Show identifier.
     * @returns {Show|undefined} Matching show, if available.
     */
    function getShowById(id) {
        const idNum = parseInt(id);
        return shows.value.find(s => s.getId() === idNum);
    }

    /**
     * Returns all shows scheduled in a given room.
     * @param {number|string} roomId - Room identifier.
     * @returns {Show[]} Matching shows.
     */
    function getShowsByRoomId(roomId) {
        const idNum = parseInt(roomId);
        return shows.value.filter(s => s.getRoomId() === idNum);
    }

    /**
     * Returns all shows scheduled for a given movie.
     * @param {number|string} movieId - Movie identifier.
     * @returns {Show[]} Matching shows.
     */
    function getShowsByMovieId(movieId) {
        const idNum = parseInt(movieId);
        return shows.value.filter(s => s.getMovieId() === idNum);
    }

    /**
     * Returns all shows whose schedule intersects a given calendar day.
     * The day is interpreted in the browser's local time zone.
     *
     * @param {Date|string} date - The day to filter by.
     * @returns {Show[]} Matching shows, ordered by start time.
     */
    function getShowsByDate(date) {
        const target = date instanceof Date ? date : new Date(date);
        const dayStart = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();
        const dayEnd = dayStart + 24 * 60 * 60 * 1000;

        return shows.value
            .filter(show => {
                const start = show.getStartTime().valueOf();
                const end = show.getEndTime().valueOf();
                return start < dayEnd && end > dayStart;
            })
            .sort((a, b) => a.getStartTime().valueOf() - b.getStartTime().valueOf());
    }

    /**
     * Determines whether a room is free to host a show during a given
     * schedule window. Uses an in-memory scan over the loaded shows; no
     * extra API call is made.
     *
     * A room is available when no other active show in the same room
     * overlaps the requested window. When editing an existing show, its
     * own record must be excluded from the check by passing its identifier
     * as `excludeShowId`.
     *
     * @param {number|string} roomId - The room to inspect.
     * @param {import('../domain/model/show-schedule.value-object.js').ShowSchedule} schedule - The candidate window.
     * @param {number|string|null} [excludeShowId=null] - Identifier of the show being edited, if any.
     * @returns {boolean} True if the room is free during the window.
     * @throws {TypeError} If `schedule` is not a ShowSchedule instance.
     */
    function isRoomAvailable(roomId, schedule, excludeShowId = null) {
        if (!schedule || typeof schedule.overlaps !== 'function') {
            throw new TypeError('isRoomAvailable requires a ShowSchedule instance');
        }

        const targetRoomId = parseInt(roomId);
        const excludeId = excludeShowId !== null ? parseInt(excludeShowId) : null;

        return !shows.value.some(show => {
            if (show.getRoomId() !== targetRoomId) return false;
            if (excludeId !== null && show.getId() === excludeId) return false;
            if (!show.getStatus().isActive()) return false;
            return show.getSchedule().overlaps(schedule);
        });
    }

    /**
     * Returns the shows that overlap a candidate window in a given room.
     * Complements isRoomAvailable with the conflicting records themselves,
     * so the UI can name them.
     *
     * @param {number|string} roomId - The room to inspect.
     * @param {import('../domain/model/show-schedule.value-object.js').ShowSchedule} schedule - The candidate window.
     * @param {number|string|null} [excludeShowId=null] - Identifier of the show being edited, if any.
     * @returns {Show[]} The overlapping shows.
     */
    function getConflictingShows(roomId, schedule, excludeShowId = null) {
        const targetRoomId = parseInt(roomId);
        const excludeId = excludeShowId !== null ? parseInt(excludeShowId) : null;

        return shows.value.filter(show => {
            if (show.getRoomId() !== targetRoomId) return false;
            if (excludeId !== null && show.getId() === excludeId) return false;
            if (!show.getStatus().isActive()) return false;
            return show.getSchedule().overlaps(schedule);
        });
    }

    /**
     * Creates a show through infrastructure and appends it to local state.
     *
     * The entity is serialized through its assembler before reaching the
     * API, because entities encapsulate state in non-enumerable fields
     * that JSON.stringify would otherwise drop.
     *
     * @param {Show} show - Show entity to persist.
     * @returns {void}
     */
    function addShow(show) {
        errors.value = [];

        schedulingApi.createShow(ShowAssembler.toResourceFromEntity(show)).then(response => {
            const resource = response.data;
            const newShow = ShowAssembler.toEntityFromResource(resource);
            shows.value.push(newShow);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * Updates an existing show and synchronizes local state.
     *
     * The entity is serialized through its assembler before reaching the
     * API (see addShow).
     *
     * @param {Show} show - Show entity with updated data.
     * @returns {void}
     */
    function updateShow(show) {
        errors.value = [];

        schedulingApi.updateShow(ShowAssembler.toResourceFromEntity(show)).then(response => {
            const resource = response.data;
            const updatedShow = ShowAssembler.toEntityFromResource(resource);
            const index = shows.value.findIndex(s => s.getId() === updatedShow.getId());
            if (index !== -1) shows.value[index] = updatedShow;
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * Deletes a show and removes it from local state.
     * @param {Show} show - Show entity to remove.
     * @returns {void}
     */
    function deleteShow(show) {
        errors.value = [];

        schedulingApi.deleteShow(show.getId()).then(() => {
            const index = shows.value.findIndex(s => s.getId() === show.getId());
            if (index !== -1) shows.value.splice(index, 1);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * Cancels a show through the domain and persists the change.
     *
     * The entity enforces that only active shows can be cancelled and
     * that a non-empty reason is provided. The store then serializes
     * and posts the updated resource.
     *
     * @param {Show} show - The show to cancel.
     * @param {string} reason - A non-empty explanation for the cancellation.
     * @returns {void}
     */
    function cancelShow(show, reason) {
        errors.value = [];

        try {
            show.cancel(reason);
        } catch (domainError) {
            errors.value.push(domainError);
            return;
        }

        updateShow(show);
    }

    /**
     * Reschedules a show through the domain and persists the change.
     *
     * The entity enforces that only active shows can be rescheduled. The
     * store does not re-run availability checks here — callers should
     * verify with isRoomAvailable before invoking this method, so they
     * can present a proper error before mutating state.
     *
     * @param {Show} show - The show to reschedule.
     * @param {import('../domain/model/show-schedule.value-object.js').ShowSchedule} newSchedule - The new window.
     * @returns {void}
     */
    function rescheduleShow(show, newSchedule) {
        errors.value = [];

        try {
            show.reschedule(newSchedule);
        } catch (domainError) {
            errors.value.push(domainError);
            return;
        }

        updateShow(show);
    }

    // --------------------------------------------------------------------
    // Actions — schedule conflicts
    // --------------------------------------------------------------------

    /**
     * Loads schedule conflicts from infrastructure and updates the
     * application state.
     * @returns {void}
     */
    function fetchScheduleConflicts() {
        errors.value = [];

        schedulingApi.getScheduleConflicts().then((response) => {
            scheduleConflicts.value = ScheduleConflictAssembler.toEntitiesFromResponse(response);
            scheduleConflictsLoaded.value = true;
        }).catch((err) => {
            errors.value.push(err);
        });
    }

    /**
     * Finds a schedule conflict entity by identifier.
     * @param {number|string} id - Conflict identifier.
     * @returns {ScheduleConflict|undefined} Matching conflict, if available.
     */
    function getScheduleConflictById(id) {
        const idNum = parseInt(id);
        return scheduleConflicts.value.find(c => c.getId() === idNum);
    }

    /**
     * Returns all conflicts associated with a given show.
     * @param {number|string} showId - Show identifier.
     * @returns {ScheduleConflict[]} Matching conflicts.
     */
    function getScheduleConflictsByShowId(showId) {
        const idNum = parseInt(showId);
        return scheduleConflicts.value.filter(c => c.getShowId() === idNum);
    }

    /**
     * Creates a schedule conflict through infrastructure and appends it
     * to local state.
     *
     * The entity is serialized through its assembler before reaching the
     * API.
     *
     * @param {ScheduleConflict} conflict - Conflict entity to persist.
     * @returns {void}
     */
    function addScheduleConflict(conflict) {
        errors.value = [];

        schedulingApi.createScheduleConflict(ScheduleConflictAssembler.toResourceFromEntity(conflict)).then(response => {
            const resource = response.data;
            const newConflict = ScheduleConflictAssembler.toEntityFromResource(resource);
            scheduleConflicts.value.push(newConflict);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * Updates an existing schedule conflict and synchronizes local state.
     *
     * The entity is serialized through its assembler before reaching the
     * API.
     *
     * @param {ScheduleConflict} conflict - Conflict entity with updated data.
     * @returns {void}
     */
    function updateScheduleConflict(conflict) {
        errors.value = [];

        schedulingApi.updateScheduleConflict(ScheduleConflictAssembler.toResourceFromEntity(conflict)).then(response => {
            const resource = response.data;
            const updatedConflict = ScheduleConflictAssembler.toEntityFromResource(resource);
            const index = scheduleConflicts.value.findIndex(c => c.getId() === updatedConflict.getId());
            if (index !== -1) scheduleConflicts.value[index] = updatedConflict;
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * Deletes a schedule conflict and removes it from local state.
     * @param {ScheduleConflict} conflict - Conflict entity to remove.
     * @returns {void}
     */
    function deleteScheduleConflict(conflict) {
        errors.value = [];

        schedulingApi.deleteScheduleConflict(conflict.getId()).then(() => {
            const index = scheduleConflicts.value.findIndex(c => c.getId() === conflict.getId());
            if (index !== -1) scheduleConflicts.value.splice(index, 1);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    // --------------------------------------------------------------------
    // Actions — rooms (borrowed slice)
    // --------------------------------------------------------------------

    /**
     * Loads rooms from infrastructure and updates the application state.
     *
     * @remarks
     * Temporary. Will be removed when BC03 exposes its own Room store.
     * @returns {void}
     */
    function fetchRooms() {
        errors.value = [];

        schedulingApi.getRooms().then((response) => {
            rooms.value = RoomAssembler.toEntitiesFromResponse(response);
            roomsLoaded.value = true;
        }).catch((err) => {
            errors.value.push(err);
        });
    }

    /**
     * Finds a room entity by identifier.
     * @param {number|string} id - Room identifier.
     * @returns {Room|undefined} Matching room, if available.
     */
    function getRoomById(id) {
        const idNum = parseInt(id);
        return rooms.value.find(r => r.getId() === idNum);
    }

    /**
     * Returns all rooms available to host new shows.
     * @returns {Room[]} Rooms that are operationally ready.
     */
    function getAvailableRooms() {
        return rooms.value.filter(r => r.isAvailable());
    }

    return {
        // State
        shows,
        scheduleConflicts,
        rooms,
        errors,
        // Load flags
        showsLoaded,
        scheduleConflictsLoaded,
        roomsLoaded,
        // Computed
        showsCount,
        scheduleConflictsCount,
        roomsCount,
        // Actions — shows
        fetchShows,
        getShowById,
        getShowsByRoomId,
        getShowsByMovieId,
        getShowsByDate,
        isRoomAvailable,
        getConflictingShows,
        addShow,
        updateShow,
        deleteShow,
        cancelShow,
        rescheduleShow,
        // Actions — schedule conflicts
        fetchScheduleConflicts,
        getScheduleConflictById,
        getScheduleConflictsByShowId,
        addScheduleConflict,
        updateScheduleConflict,
        deleteScheduleConflict,
        // Actions — rooms (borrowed slice)
        fetchRooms,
        getRoomById,
        getAvailableRooms,
    };
});

export default useSchedulingStore;