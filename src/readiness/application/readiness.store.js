/**
 * Application service store for BC03 — Room & Resource Readiness.
 * Coordinates room readiness use cases, joins inspections and blocks
 * into their owning Room aggregates, and keeps UI-facing state.
 *
 * @module useReadinessStore
 */

import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {ReadinessApi} from "../infrastructure/readiness-api.js";
import {RoomAssembler} from "../infrastructure/room.assembler.js";
import {RoomInspectionAssembler} from "../infrastructure/room-inspection.assembler.js";
import {RoomBlockAssembler} from "../infrastructure/room-block.assembler.js";
import {ResourceCalculationAssembler} from "../infrastructure/resource-calculation.assembler.js";

const readinessApi = new ReadinessApi();

/**
 * Pinia store for BC03 — Room & Resource Readiness.
 * Manages rooms, room inspections, room blocks, and resource
 * calculations, including fetching, creation, update, deletion, and
 * domain-mediated state transitions.
 *
 * @returns {Object} The store object with state, computed, and actions.
 */
const useReadinessStore = defineStore("readiness", () => {

    // --------------------------------------------------------------------
    // State — aggregate root & owned children
    // --------------------------------------------------------------------

    /**
     * List of Room entities with their inspections and blocks already
     * joined in. The store treats this as the canonical in-memory
     * representation of each room's full state.
     *
     * @type {import('vue').Ref<Room[]>}
     */
    const rooms = ref([]);

    /**
     * Flat list of room inspections, kept in sync with the collections
     * owned by each Room. Used by list views that need to enumerate
     * inspections across rooms.
     *
     * @type {import('vue').Ref<RoomInspection[]>}
     */
    const roomInspections = ref([]);

    /**
     * Flat list of room blocks, kept in sync with the collections owned
     * by each Room.
     *
     * @type {import('vue').Ref<RoomBlock[]>}
     */
    const roomBlocks = ref([]);

    // --------------------------------------------------------------------
    // State — resource calculations
    // --------------------------------------------------------------------

    /**
     * List of resource calculation entities.
     *
     * @type {import('vue').Ref<ResourceCalculation[]>}
     */
    const resourceCalculations = ref([]);

    // --------------------------------------------------------------------
    // State — cross-cutting
    // --------------------------------------------------------------------

    /**
     * List of errors encountered during API operations.
     * @type {import('vue').Ref<Error[]>}
     */
    const errors = ref([]);

    /**
     * Whether rooms have been loaded from the API.
     * @type {import('vue').Ref<boolean>}
     */
    const roomsLoaded = ref(false);

    /**
     * Whether room inspections have been loaded from the API.
     * @type {import('vue').Ref<boolean>}
     */
    const roomInspectionsLoaded = ref(false);

    /**
     * Whether room blocks have been loaded from the API.
     * @type {import('vue').Ref<boolean>}
     */
    const roomBlocksLoaded = ref(false);

    /**
     * Whether resource calculations have been loaded from the API.
     * @type {import('vue').Ref<boolean>}
     */
    const resourceCalculationsLoaded = ref(false);

    // --------------------------------------------------------------------
    // Computed counts
    // --------------------------------------------------------------------

    /**
     * Number of loaded rooms.
     * @type {import('vue').ComputedRef<number>}
     */
    const roomsCount = computed(() => roomsLoaded.value ? rooms.value.length : 0);

    /**
     * Number of loaded room inspections.
     * @type {import('vue').ComputedRef<number>}
     */
    const roomInspectionsCount = computed(() => roomInspectionsLoaded.value ? roomInspections.value.length : 0);

    /**
     * Number of loaded room blocks.
     * @type {import('vue').ComputedRef<number>}
     */
    const roomBlocksCount = computed(() => roomBlocksLoaded.value ? roomBlocks.value.length : 0);

    /**
     * Number of loaded resource calculations.
     * @type {import('vue').ComputedRef<number>}
     */
    const resourceCalculationsCount = computed(() => resourceCalculationsLoaded.value ? resourceCalculations.value.length : 0);

    // --------------------------------------------------------------------
    // Actions — rooms
    // --------------------------------------------------------------------

    /**
     * Loads rooms, inspections, and blocks in parallel, then joins the
     * child collections into their owning rooms.
     *
     * The three collections are fetched concurrently to minimize latency,
     * and the Room aggregate is only marked as loaded once the join has
     * completed. Use this action when the UI needs the full room state —
     * for example, the room list and the room detail view.
     *
     * @returns {Promise<void>} Resolves when the join has completed.
     */
    async function fetchRooms() {
        errors.value = [];

        try {
            const [roomsResponse, inspectionsResponse, blocksResponse] = await Promise.all([
                readinessApi.getRooms(),
                readinessApi.getRoomInspections(),
                readinessApi.getRoomBlocks(),
            ]);

            const inspections = RoomInspectionAssembler.toEntitiesFromResponse(inspectionsResponse);
            const blocks = RoomBlockAssembler.toEntitiesFromResponse(blocksResponse);

            const inspectionsByRoomId = groupBy(inspections, i => i.getRoomId());
            const blocksByRoomId = groupBy(blocks, b => b.getRoomId());

            rooms.value = RoomAssembler.toEntitiesFromResponse(roomsResponse, {
                inspectionsByRoomId,
                blocksByRoomId,
            });
            roomInspections.value = inspections;
            roomBlocks.value = blocks;

            roomsLoaded.value = true;
            roomInspectionsLoaded.value = true;
            roomBlocksLoaded.value = true;
        } catch (err) {
            errors.value.push(err);
        }
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
     * Returns all rooms that can accept new bookings.
     * @returns {Room[]} Rooms in an available or ready state.
     */
    function getAvailableRooms() {
        return rooms.value.filter(r => r.isAvailable());
    }

    /**
     * Returns all rooms whose status matches the given value.
     * @param {string} status - The status to filter by.
     * @returns {Room[]} Matching rooms.
     */
    function getRoomsByStatus(status) {
        const normalized = String(status).toUpperCase();
        return rooms.value.filter(r => r.getStatusAsString() === normalized);
    }

    /**
     * Returns all rooms that are fully ready to host a show — status
     * permits bookings, no active block, and the latest inspection
     * cleared the room.
     *
     * @returns {Room[]} Rooms that can accept a show right now.
     */
    function getOperationallyReadyRooms() {
        return rooms.value.filter(r => r.canHostShow());
    }

    /**
     * Creates a room through infrastructure and appends it to local state.
     *
     * The entity is serialized through its assembler before reaching the
     * API, because entities encapsulate state in non-enumerable fields
     * that JSON.stringify would otherwise drop.
     *
     * @param {Room} room - Room entity to persist.
     * @returns {void}
     */
    function addRoom(room) {
        errors.value = [];

        readinessApi.createRoom(RoomAssembler.toResourceFromEntity(room)).then(response => {
            const resource = response.data;
            const newRoom = RoomAssembler.toEntityFromResource(resource);
            rooms.value.push(newRoom);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * Updates an existing room and synchronizes local state.
     *
     * The entity is serialized through its assembler before reaching the
     * API (see addRoom).
     *
     * @param {Room} room - Room entity with updated data.
     * @returns {void}
     */
    function updateRoom(room) {
        errors.value = [];

        readinessApi.updateRoom(RoomAssembler.toResourceFromEntity(room)).then(response => {
            const resource = response.data;
            const updatedRoom = RoomAssembler.toEntityFromResource(resource);
            const index = rooms.value.findIndex(r => r.getId() === updatedRoom.getId());
            if (index !== -1) rooms.value[index] = updatedRoom;
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * Deletes a room and removes it from local state.
     * @param {Room} room - Room entity to remove.
     * @returns {void}
     */
    function deleteRoom(room) {
        errors.value = [];

        readinessApi.deleteRoom(room.getId()).then(() => {
            const index = rooms.value.findIndex(r => r.getId() === room.getId());
            if (index !== -1) rooms.value.splice(index, 1);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    // --------------------------------------------------------------------
    // Domain-mediated room transitions
    // --------------------------------------------------------------------

    /**
     * Runs a domain transition on the given room and persists the result.
     * The transition is delegated to a callback so the caller decides
     * which lifecycle method to invoke.
     *
     * If the transition throws a domain error, it is captured in
     * `errors` and no API call is issued.
     *
     * @private
     * @param {Room} room - The room to transition.
     * @param {(room: Room) => void} transition - The domain method to invoke.
     * @returns {void}
     */
    function _transitionRoom(room, transition) {
        errors.value = [];

        try {
            transition(room);
        } catch (domainError) {
            errors.value.push(domainError);
            return;
        }

        updateRoom(room);
    }

    /**
     * Marks the room as PREPARING for an upcoming show.
     * @param {Room} room - The room to transition.
     * @returns {void}
     */
    function startRoomPreparation(room) {
        _transitionRoom(room, r => r.startPreparation());
    }

    /**
     * Marks the room as READY to run a show.
     * @param {Room} room - The room to transition.
     * @returns {void}
     */
    function markRoomReady(room) {
        _transitionRoom(room, r => r.markReady());
    }

    /**
     * Blocks the room for a given period.
     * @param {Room} room - The room to block.
     * @param {RoomBlock} block - The block being applied.
     * @returns {void}
     */
    function blockRoom(room, block) {
        errors.value = [];

        try {
            room.block(block);
        } catch (domainError) {
            errors.value.push(domainError);
            return;
        }

        readinessApi.updateRoom(RoomAssembler.toResourceFromEntity(room))
            .then(() => readinessApi.createRoomBlock(RoomBlockAssembler.toResourceFromEntity(block)))
            .then(response => {
                const newBlock = RoomBlockAssembler.toEntityFromResource(response.data);
                roomBlocks.value.push(newBlock);
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    /**
     * Releases the room from its current block.
     * @param {Room} room - The room to release.
     * @returns {void}
     */
    function releaseRoom(room) {
        errors.value = [];

        const current = room.getCurrentBlock();

        try {
            room.release();
        } catch (domainError) {
            errors.value.push(domainError);
            return;
        }

        const persistedRelease = current
            ? readinessApi.updateRoomBlock(RoomBlockAssembler.toResourceFromEntity(current))
            : Promise.resolve();

        persistedRelease
            .then(() => readinessApi.updateRoom(RoomAssembler.toResourceFromEntity(room)))
            .then(() => {
                if (current) {
                    const index = roomBlocks.value.findIndex(b => b.getId() === current.getId());
                    if (index !== -1) roomBlocks.value[index] = current;
                }
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    /**
     * Sends the room to scheduled maintenance.
     * @param {Room} room - The room to transition.
     * @returns {void}
     */
    function sendRoomToMaintenance(room) {
        _transitionRoom(room, r => r.sendToMaintenance());
    }

    /**
     * Completes maintenance and returns the room to AVAILABLE.
     * @param {Room} room - The room to transition.
     * @returns {void}
     */
    function completeRoomMaintenance(room) {
        _transitionRoom(room, r => r.completeMaintenance());
    }

    // --------------------------------------------------------------------
    // Actions — room inspections
    // --------------------------------------------------------------------

    /**
     * Loads room inspections from infrastructure. In normal operation
     * `fetchRooms` already populates this collection as part of its join;
     * call this directly only when you need a standalone refresh.
     * @returns {void}
     */
    function fetchRoomInspections() {
        errors.value = [];

        readinessApi.getRoomInspections().then((response) => {
            roomInspections.value = RoomInspectionAssembler.toEntitiesFromResponse(response);
            roomInspectionsLoaded.value = true;
        }).catch((err) => {
            errors.value.push(err);
        });
    }

    /**
     * Finds a room inspection entity by identifier.
     * @param {number|string} id - Inspection identifier.
     * @returns {RoomInspection|undefined} Matching inspection, if available.
     */
    function getRoomInspectionById(id) {
        const idNum = parseInt(id);
        return roomInspections.value.find(i => i.getId() === idNum);
    }

    /**
     * Returns all inspections recorded for a given room.
     * @param {number|string} roomId - Room identifier.
     * @returns {RoomInspection[]} Matching inspections.
     */
    function getRoomInspectionsByRoomId(roomId) {
        const idNum = parseInt(roomId);
        return roomInspections.value.filter(i => i.getRoomId() === idNum);
    }

    /**
     * Creates a room inspection through infrastructure, attaches it to
     * its owning room in memory, and appends it to the flat collection.
     *
     * The entity is serialized through its assembler before reaching the
     * API.
     *
     * @param {RoomInspection} inspection - Inspection entity to persist.
     * @returns {void}
     */
    function addRoomInspection(inspection) {
        errors.value = [];

        readinessApi.createRoomInspection(RoomInspectionAssembler.toResourceFromEntity(inspection)).then(response => {
            const resource = response.data;
            const newInspection = RoomInspectionAssembler.toEntityFromResource(resource);
            roomInspections.value.push(newInspection);

            const room = rooms.value.find(r => r.getId() === newInspection.getRoomId());
            if (room) room.addInspection(newInspection);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * Updates an existing inspection and synchronizes both the flat
     * collection and the owning room's child collection.
     *
     * The entity is serialized through its assembler before reaching the
     * API.
     *
     * @param {RoomInspection} inspection - Inspection entity with updated data.
     * @returns {void}
     */
    function updateRoomInspection(inspection) {
        errors.value = [];

        readinessApi.updateRoomInspection(RoomInspectionAssembler.toResourceFromEntity(inspection)).then(response => {
            const resource = response.data;
            const updatedInspection = RoomInspectionAssembler.toEntityFromResource(resource);

            const flatIndex = roomInspections.value.findIndex(i => i.getId() === updatedInspection.getId());
            if (flatIndex !== -1) roomInspections.value[flatIndex] = updatedInspection;

            const room = rooms.value.find(r => r.getId() === updatedInspection.getRoomId());
            if (room) {
                room.removeInspection(updatedInspection.getId());
                room.addInspection(updatedInspection);
            }
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * Deletes a room inspection and removes it from both collections.
     * @param {RoomInspection} inspection - Inspection entity to remove.
     * @returns {void}
     */
    function deleteRoomInspection(inspection) {
        errors.value = [];

        readinessApi.deleteRoomInspection(inspection.getId()).then(() => {
            const flatIndex = roomInspections.value.findIndex(i => i.getId() === inspection.getId());
            if (flatIndex !== -1) roomInspections.value.splice(flatIndex, 1);

            const room = rooms.value.find(r => r.getId() === inspection.getRoomId());
            if (room) room.removeInspection(inspection.getId());
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * Approves an inspection through the domain and persists the result.
     * @param {RoomInspection} inspection - The inspection to approve.
     * @returns {void}
     */
    function approveInspection(inspection) {
        errors.value = [];

        try {
            inspection.approve();
        } catch (domainError) {
            errors.value.push(domainError);
            return;
        }

        updateRoomInspection(inspection);
    }

    /**
     * Rejects an inspection through the domain and persists the result.
     * @param {RoomInspection} inspection - The inspection to reject.
     * @returns {void}
     */
    function rejectInspection(inspection) {
        errors.value = [];

        try {
            inspection.reject();
        } catch (domainError) {
            errors.value.push(domainError);
            return;
        }

        updateRoomInspection(inspection);
    }

    // --------------------------------------------------------------------
    // Actions — room blocks
    // --------------------------------------------------------------------

    /**
     * Loads room blocks from infrastructure. In normal operation
     * `fetchRooms` already populates this collection as part of its join.
     * @returns {void}
     */
    function fetchRoomBlocks() {
        errors.value = [];

        readinessApi.getRoomBlocks().then((response) => {
            roomBlocks.value = RoomBlockAssembler.toEntitiesFromResponse(response);
            roomBlocksLoaded.value = true;
        }).catch((err) => {
            errors.value.push(err);
        });
    }

    /**
     * Finds a room block entity by identifier.
     * @param {number|string} id - Block identifier.
     * @returns {RoomBlock|undefined} Matching block, if available.
     */
    function getRoomBlockById(id) {
        const idNum = parseInt(id);
        return roomBlocks.value.find(b => b.getId() === idNum);
    }

    /**
     * Returns all blocks recorded for a given room.
     * @param {number|string} roomId - Room identifier.
     * @returns {RoomBlock[]} Matching blocks.
     */
    function getRoomBlocksByRoomId(roomId) {
        const idNum = parseInt(roomId);
        return roomBlocks.value.filter(b => b.getRoomId() === idNum);
    }

    /**
     * Updates an existing block and synchronizes both the flat collection
     * and the owning room's child collection.
     *
     * @param {RoomBlock} block - Block entity with updated data.
     * @returns {void}
     */
    function updateRoomBlock(block) {
        errors.value = [];

        readinessApi.updateRoomBlock(RoomBlockAssembler.toResourceFromEntity(block)).then(response => {
            const resource = response.data;
            const updatedBlock = RoomBlockAssembler.toEntityFromResource(resource);

            const flatIndex = roomBlocks.value.findIndex(b => b.getId() === updatedBlock.getId());
            if (flatIndex !== -1) roomBlocks.value[flatIndex] = updatedBlock;

            const room = rooms.value.find(r => r.getId() === updatedBlock.getRoomId());
            if (room) {
                room.removeBlock(updatedBlock.getId());
                room.addBlock(updatedBlock);
            }
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * Deletes a room block and removes it from both collections.
     * @param {RoomBlock} block - Block entity to remove.
     * @returns {void}
     */
    function deleteRoomBlock(block) {
        errors.value = [];

        readinessApi.deleteRoomBlock(block.getId()).then(() => {
            const flatIndex = roomBlocks.value.findIndex(b => b.getId() === block.getId());
            if (flatIndex !== -1) roomBlocks.value.splice(flatIndex, 1);

            const room = rooms.value.find(r => r.getId() === block.getRoomId());
            if (room) room.removeBlock(block.getId());
        }).catch(error => {
            errors.value.push(error);
        });
    }

    // --------------------------------------------------------------------
    // Actions — resource calculations
    // --------------------------------------------------------------------

    /**
     * Loads resource calculations from infrastructure.
     * @returns {void}
     */
    function fetchResourceCalculations() {
        errors.value = [];

        readinessApi.getResourceCalculations().then((response) => {
            resourceCalculations.value = ResourceCalculationAssembler.toEntitiesFromResponse(response);
            resourceCalculationsLoaded.value = true;
        }).catch((err) => {
            errors.value.push(err);
        });
    }

    /**
     * Finds a resource calculation entity by identifier.
     * @param {number|string} id - Calculation identifier.
     * @returns {ResourceCalculation|undefined} Matching calculation, if available.
     */
    function getResourceCalculationById(id) {
        const idNum = parseInt(id);
        return resourceCalculations.value.find(c => c.getId() === idNum);
    }

    /**
     * Returns the resource calculation tied to a given show, if any.
     * @param {number|string} showId - Show identifier.
     * @returns {ResourceCalculation|undefined} Matching calculation.
     */
    function getResourceCalculationByShowId(showId) {
        const idNum = parseInt(showId);
        return resourceCalculations.value.find(c => c.getShowId() === idNum);
    }

    /**
     * Creates a resource calculation through infrastructure and appends
     * it to local state.
     *
     * The entity is serialized through its assembler before reaching the
     * API.
     *
     * @param {ResourceCalculation} calculation - Calculation entity to persist.
     * @returns {void}
     */
    function addResourceCalculation(calculation) {
        errors.value = [];

        readinessApi.createResourceCalculation(ResourceCalculationAssembler.toResourceFromEntity(calculation)).then(response => {
            const resource = response.data;
            const newCalculation = ResourceCalculationAssembler.toEntityFromResource(resource);
            resourceCalculations.value.push(newCalculation);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * Updates an existing resource calculation and synchronizes local state.
     *
     * The entity is serialized through its assembler before reaching the
     * API.
     *
     * @param {ResourceCalculation} calculation - Calculation entity with updated data.
     * @returns {void}
     */
    function updateResourceCalculation(calculation) {
        errors.value = [];

        readinessApi.updateResourceCalculation(ResourceCalculationAssembler.toResourceFromEntity(calculation)).then(response => {
            const resource = response.data;
            const updatedCalculation = ResourceCalculationAssembler.toEntityFromResource(resource);
            const index = resourceCalculations.value.findIndex(c => c.getId() === updatedCalculation.getId());
            if (index !== -1) resourceCalculations.value[index] = updatedCalculation;
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * Deletes a resource calculation and removes it from local state.
     * @param {ResourceCalculation} calculation - Calculation entity to remove.
     * @returns {void}
     */
    function deleteResourceCalculation(calculation) {
        errors.value = [];

        readinessApi.deleteResourceCalculation(calculation.getId()).then(() => {
            const index = resourceCalculations.value.findIndex(c => c.getId() === calculation.getId());
            if (index !== -1) resourceCalculations.value.splice(index, 1);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    // --------------------------------------------------------------------
    // Helpers
    // --------------------------------------------------------------------

    /**
     * Groups an array of entities by a key derived from each element.
     *
     * @private
     * @template T
     * @param {T[]} items - The items to group.
     * @param {(item: T) => (number|string|null)} keyFn - The key selector.
     * @returns {Map<number|string, T[]>} A map from key to the matching items.
     */
    function groupBy(items, keyFn) {
        const map = new Map();
        for (const item of items) {
            const key = keyFn(item);
            if (key === null || key === undefined) continue;
            const bucket = map.get(key) ?? [];
            bucket.push(item);
            map.set(key, bucket);
        }
        return map;
    }

    return {
        // State
        rooms,
        roomInspections,
        roomBlocks,
        resourceCalculations,
        errors,
        // Load flags
        roomsLoaded,
        roomInspectionsLoaded,
        roomBlocksLoaded,
        resourceCalculationsLoaded,
        // Computed
        roomsCount,
        roomInspectionsCount,
        roomBlocksCount,
        resourceCalculationsCount,
        // Actions — rooms
        fetchRooms,
        getRoomById,
        getAvailableRooms,
        getRoomsByStatus,
        getOperationallyReadyRooms,
        addRoom,
        updateRoom,
        deleteRoom,
        // Domain-mediated transitions
        startRoomPreparation,
        markRoomReady,
        blockRoom,
        releaseRoom,
        sendRoomToMaintenance,
        completeRoomMaintenance,
        // Actions — room inspections
        fetchRoomInspections,
        getRoomInspectionById,
        getRoomInspectionsByRoomId,
        addRoomInspection,
        updateRoomInspection,
        deleteRoomInspection,
        approveInspection,
        rejectInspection,
        // Actions — room blocks
        fetchRoomBlocks,
        getRoomBlockById,
        getRoomBlocksByRoomId,
        updateRoomBlock,
        deleteRoomBlock,
        // Actions — resource calculations
        fetchResourceCalculations,
        getResourceCalculationById,
        getResourceCalculationByShowId,
        addResourceCalculation,
        updateResourceCalculation,
        deleteResourceCalculation,
    };
});

export default useReadinessStore;