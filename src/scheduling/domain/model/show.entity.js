import {ShowStatus} from './show-status.value-object.js';
import {ShowSchedule} from './show-schedule.value-object.js';
import {ScheduleConflict} from './schedule-conflict.entity.js';
import {DateTime} from '../../../shared/domain/model/date-time.js';
import {StringValidator} from '../../../shared/domain/model/string-validator.js';

/**
 * @class Show
 * @summary Aggregate root representing a scheduled 4D show. Owns its
 * `ScheduleConflict` children and controls every state transition that
 * a show may undergo through its lifecycle.
 *
 * The aggregate references its movie and room by identifier only — the
 * referenced aggregates are owned by other bounded contexts.
 */
export class Show {

    /**
     * @param {Object} props
     * @param {number|null} [props.id] - Unique identifier. `null` for a show not yet persisted.
     * @param {number|null} [props.movieId] - Identifier of the scheduled movie.
     * @param {number|null} [props.roomId] - Identifier of the room hosting the show.
     * @param {number|null} [props.assignedProfessionalId] - Identifier of the staff member assigned to operate the show.
     * @param {ShowSchedule|{start: (DateTime|string), end: (DateTime|string)}|null} [props.schedule] - A `ShowSchedule`, or a `{start, end}` pair.
     * @param {DateTime|string|null} [props.startTime] - Raw start date-time, used when `schedule` is not provided.
     * @param {DateTime|string|null} [props.endTime] - Raw end date-time, used when `schedule` is not provided.
     * @param {ShowStatus|string|null} [props.status] - A `ShowStatus`, or its string form. Defaults to SCHEDULED.
     * @param {string|null} [props.cancellationReason] - Reason for cancellation, if cancelled.
     * @param {ScheduleConflict[]} [props.conflicts] - Owned schedule conflicts. Non-`ScheduleConflict` entries are ignored.
     * @param {DateTime|string|null} [props.createdAt] - A `DateTime`, or a value accepted by `new DateTime(...)`.
     * @param {DateTime|string|null} [props.updatedAt] - A `DateTime`, or a value accepted by `new DateTime(...)`.
     * @throws {Error} If neither `schedule` nor a `{startTime, endTime}` pair is provided.
     * @throws {Error} If `status` is a string that is not a valid show status.
     */
    constructor({
                    id = null,
                    movieId = null,
                    roomId = null,
                    assignedProfessionalId = null,
                    schedule = null,
                    startTime = null,
                    endTime = null,
                    status = null,
                    cancellationReason = null,
                    conflicts = [],
                    createdAt = null,
                    updatedAt = null
                } = {}) {
        this._id = id;
        this._movieId = movieId;
        this._roomId = roomId;
        this._assignedProfessionalId = assignedProfessionalId;
        this._schedule = Show.#resolveSchedule(schedule, startTime, endTime);
        this._status = status instanceof ShowStatus
            ? status
            : new ShowStatus(status ?? 'SCHEDULED');
        this._cancellationReason = cancellationReason;
        this._conflicts = conflicts.filter(c => c instanceof ScheduleConflict);
        this._createdAt = createdAt instanceof DateTime ? createdAt : new DateTime(createdAt);
        this._updatedAt = updatedAt instanceof DateTime ? updatedAt : new DateTime(updatedAt);
    }

    // --------------------------------------------------------------------
    // Identity & scalar attributes
    // --------------------------------------------------------------------

    /** @returns {number|null} The show's unique identifier. */
    getId = () => this._id;

    /** @returns {number|null} The identifier of the scheduled movie. */
    getMovieId = () => this._movieId;

    /** @returns {number|null} The identifier of the hosting room. */
    getRoomId = () => this._roomId;

    /** @returns {number|null} The identifier of the assigned staff member, if any. */
    getAssignedProfessionalId = () => this._assignedProfessionalId;

    /** @returns {ShowStatus} The current lifecycle status. */
    getStatus = () => this._status;

    /** @returns {string} The status as a string. */
    getStatusAsString = () => this._status.toString();

    /** @returns {string|null} The cancellation reason, if cancelled. */
    getCancellationReason = () => this._cancellationReason;

    /** @returns {DateTime} When the show record was created. */
    getCreatedAt = () => this._createdAt;

    /** @returns {string} The creation timestamp as an ISO 8601 string. */
    getCreatedAtFormated = () => this._createdAt.toISOString();

    /** @returns {DateTime} When the show record was last updated. */
    getUpdatedAt = () => this._updatedAt;

    /** @returns {string} The last-update timestamp as an ISO 8601 string. */
    getUpdatedAtFormated = () => this._updatedAt.toISOString();

    // --------------------------------------------------------------------
    // Schedule
    // --------------------------------------------------------------------

    /** @returns {ShowSchedule} The current schedule window. */
    getSchedule = () => this._schedule;

    /** @returns {DateTime} The schedule start date-time. */
    getStartTime = () => this._schedule.getStart();

    /** @returns {DateTime} The schedule end date-time. */
    getEndTime = () => this._schedule.getEnd();

    /** @returns {string} The schedule start as an ISO 8601 string. */
    getStartTimeAsISO = () => this._schedule.getStartAsISO();

    /** @returns {string} The schedule end as an ISO 8601 string. */
    getEndTimeAsISO = () => this._schedule.getEndAsISO();

    /** @returns {import('../../../shared/domain/model/duration.js').Duration} The length of the show. */
    getDuration = () => this._schedule.getDuration();

    /**
     * Determines whether this show's schedule overlaps with another's.
     *
     * @param {Show} other - The other show to compare against.
     * @returns {boolean} True if the two show windows overlap.
     * @throws {TypeError} If `other` is not a Show instance.
     */
    overlaps(other) {
        if (!(other instanceof Show)) {
            throw new TypeError('Expected a Show instance');
        }
        return this._schedule.overlaps(other.getSchedule());
    }

    // --------------------------------------------------------------------
    // Owned children — ScheduleConflict
    // --------------------------------------------------------------------

    /**
     * Returns a shallow copy of the owned conflicts.
     *
     * @returns {ScheduleConflict[]} A copy of the conflicts.
     */
    getConflicts = () => [...this._conflicts];

    /** @returns {number} The number of owned conflicts. */
    getConflictCount = () => this._conflicts.length;

    /** @returns {boolean} True if the show has at least one conflict. */
    hasConflicts = () => this._conflicts.length > 0;

    /**
     * Returns the subset of conflicts that remain unresolved.
     *
     * @returns {ScheduleConflict[]} The open conflicts.
     */
    getUnresolvedConflicts = () => this._conflicts.filter(c => !c.isResolved());

    /**
     * Adds a schedule conflict to this show. Duplicates (same identifier)
     * are rejected silently.
     *
     * @param {ScheduleConflict} conflict - The conflict to add.
     * @returns {void}
     * @throws {TypeError} If `conflict` is not a ScheduleConflict instance.
     */
    addConflict(conflict) {
        if (!(conflict instanceof ScheduleConflict)) {
            throw new TypeError('Expected a ScheduleConflict instance');
        }
        if (conflict.getId() !== null && this._conflicts.some(c => c.getId() === conflict.getId())) {
            return;
        }
        this._conflicts.push(conflict);
    }

    /**
     * Marks every unresolved conflict on this show as resolved.
     *
     * @returns {number} The number of conflicts resolved.
     */
    resolveAllConflicts() {
        const open = this.getUnresolvedConflicts();
        open.forEach(c => c.resolve());
        return open.length;
    }

    // --------------------------------------------------------------------
    // Lifecycle transitions
    // --------------------------------------------------------------------

    /**
     * Confirms the show, committing it to the calendar. Only scheduled or
     * rescheduled shows can be confirmed.
     *
     * @returns {void}
     * @throws {Error} If the show's status does not allow confirmation.
     */
    confirm() {
        if (!(this._status.isScheduled() || this._status.isRescheduled())) {
            throw new Error(`Cannot confirm a show in status ${this._status.toString()}`);
        }
        this._status = ShowStatus.confirmed();
        this.#touch();
    }

    /**
     * Reschedules the show to a new time window. The new schedule must
     * differ from the current one.
     *
     * @param {ShowSchedule} newSchedule - The new schedule window.
     * @returns {void}
     * @throws {TypeError} If `newSchedule` is not a ShowSchedule instance.
     * @throws {Error} If the show cannot be edited in its current status.
     */
    reschedule(newSchedule) {
        if (!(newSchedule instanceof ShowSchedule)) {
            throw new TypeError('Expected a ShowSchedule instance');
        }
        if (!this._status.canBeEdited()) {
            throw new Error(`Cannot reschedule a show in status ${this._status.toString()}`);
        }
        this._schedule = newSchedule;
        this._status = ShowStatus.rescheduled();
        this.#touch();
    }

    /**
     * Starts the show. Only confirmed shows can start.
     *
     * @returns {void}
     * @throws {Error} If the show's status does not allow starting.
     */
    start() {
        if (!this._status.isConfirmed()) {
            throw new Error(`Cannot start a show in status ${this._status.toString()}`);
        }
        this._status = ShowStatus.inProgress();
        this.#touch();
    }

    /**
     * Completes the show. Only in-progress shows can be completed.
     *
     * @returns {void}
     * @throws {Error} If the show's status does not allow completion.
     */
    complete() {
        if (!this._status.isInProgress()) {
            throw new Error(`Cannot complete a show in status ${this._status.toString()}`);
        }
        this._status = ShowStatus.completed();
        this.#touch();
    }

    /**
     * Cancels the show, recording a reason. Only active shows can be cancelled.
     *
     * @param {string} reason - A non-empty explanation for the cancellation.
     * @returns {void}
     * @throws {Error} If the show's status does not allow cancellation.
     * @throws {Error} If the reason is empty.
     */
    cancel(reason) {
        if (!this._status.canBeCancelled()) {
            throw new Error(`Cannot cancel a show in status ${this._status.toString()}`);
        }
        if (!StringValidator.isNotEmptyString(reason)) {
            throw new Error('Cancellation reason must be a non-empty string');
        }
        this._status = ShowStatus.cancelled();
        this._cancellationReason = reason;
        this.#touch();
    }

    // --------------------------------------------------------------------
    // Query helpers
    // --------------------------------------------------------------------

    /** @returns {boolean} True if the show's schedule is entirely in the future. */
    isUpcoming() {
        return this._schedule.isInTheFuture();
    }

    /** @returns {boolean} True if the show's schedule is currently running. */
    isCurrentlyRunning() {
        return this._schedule.isCurrentlyActive();
    }

    /** @returns {boolean} True if the show's schedule is entirely in the past. */
    hasEnded() {
        return this._schedule.isInThePast();
    }

    /** @returns {boolean} True if the show can be edited in its current status. */
    canBeEdited() {
        return this._status.canBeEdited();
    }

    /** @returns {boolean} True if the show can be cancelled in its current status. */
    canBeCancelled() {
        return this._status.canBeCancelled();
    }

    // --------------------------------------------------------------------
    // Private helpers
    // --------------------------------------------------------------------

    /**
     * Resolves a `ShowSchedule` instance from the provided constructor
     * arguments. Prefers the `schedule` prop; falls back to the
     * `startTime`/`endTime` pair.
     *
     * @private
     * @static
     * @param {ShowSchedule|{start: (DateTime|string), end: (DateTime|string)}|null} schedule
     * @param {DateTime|string|null} startTime
     * @param {DateTime|string|null} endTime
     * @returns {ShowSchedule}
     * @throws {Error} If neither a schedule nor a start/end pair is provided.
     */
    static #resolveSchedule(schedule, startTime, endTime) {
        if (schedule instanceof ShowSchedule) {
            return schedule;
        }
        if (schedule && typeof schedule === 'object' && 'start' in schedule && 'end' in schedule) {
            return new ShowSchedule(schedule.start, schedule.end);
        }
        if (startTime !== null && endTime !== null) {
            return new ShowSchedule(startTime, endTime);
        }
        throw new Error('A Show requires either a ShowSchedule or a startTime/endTime pair');
    }

    /**
     * Sets `updatedAt` to the current time. Called after every state change.
     *
     * @private
     * @returns {void}
     */
    #touch() {
        this._updatedAt = DateTime.now();
    }
}