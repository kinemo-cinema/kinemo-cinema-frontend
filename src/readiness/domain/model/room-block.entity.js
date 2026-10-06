import {BlockStatus} from './block-status.value-object.js';
import {DateTime} from '../../../shared/domain/model/date-time.js';
import {StringValidator} from '../../../shared/domain/model/string-validator.js';

/**
 * @class RoomBlock
 * @summary Entity representing a period of unavailability for a room,
 * owned by the Room aggregate root. Blocks are used for maintenance,
 * inspections that require the room to be closed, or ad-hoc incidents.
 */
export class RoomBlock {

    /**
     * @param {Object} props
     * @param {number|null} [props.id] - Unique identifier. `null` for a block not yet persisted.
     * @param {number|null} [props.roomId] - Identifier of the blocked room.
     * @param {string} [props.reason] - Human-readable reason for the block.
     * @param {DateTime|string|null} [props.startTime] - When the block begins.
     * @param {DateTime|string|null} [props.endTime] - When the block is scheduled to end.
     * @param {BlockStatus|string|null} [props.status] - A `BlockStatus`, or its string form. Defaults to SCHEDULED.
     * @throws {Error} If `startTime` or `endTime` are invalid date-times.
     * @throws {Error} If `status` is an invalid string.
     */
    constructor({
                    id = null,
                    roomId = null,
                    reason = '',
                    startTime = null,
                    endTime = null,
                    status = null
                } = {}) {
        this._id = id;
        this._roomId = roomId;
        this._reason = reason;
        this._startTime = startTime instanceof DateTime ? startTime : new DateTime(startTime);
        this._endTime = endTime instanceof DateTime ? endTime : new DateTime(endTime);
        this._status = status instanceof BlockStatus
            ? status
            : new BlockStatus(status ?? 'SCHEDULED');
    }

    /** @returns {number|null} The block's unique identifier. */
    getId = () => this._id;

    /** @returns {number|null} The identifier of the blocked room. */
    getRoomId = () => this._roomId;

    /** @returns {string} The block reason. */
    getReason = () => this._reason;

    /** @returns {DateTime} The block start date-time. */
    getStartTime = () => this._startTime;

    /** @returns {DateTime} The block end date-time. */
    getEndTime = () => this._endTime;

    /** @returns {string} The block start as an ISO 8601 string. */
    getStartTimeAsISO = () => this._startTime.toISOString();

    /** @returns {string} The block end as an ISO 8601 string. */
    getEndTimeAsISO = () => this._endTime.toISOString();

    /** @returns {BlockStatus} The current block status. */
    getStatus = () => this._status;

    /** @returns {string} The block status as a string. */
    getStatusAsString = () => this._status.toString();

    /**
     * Determines whether the block is currently preventing the room from
     * being used, based on its status.
     *
     * @returns {boolean} True if the block is scheduled or active.
     */
    isBlocking() {
        return this._status.isBlocking();
    }

    /**
     * Determines whether the block has reached a terminal state.
     *
     * @returns {boolean} True if the block was released or expired.
     */
    isFinal() {
        return this._status.isFinal();
    }

    /**
     * Determines whether the current time falls within the block window
     * AND the block has not been released.
     *
     * @returns {boolean} True if the block is currently in effect.
     */
    isCurrentlyActive() {
        if (!this._status.isBlocking()) return false;
        const now = Date.now();
        return this._startTime.valueOf() <= now && now < this._endTime.valueOf();
    }

    /**
     * Determines whether this block's window overlaps a given time range.
     * Touching boundaries (block ends exactly when the range starts) do
     * not count as overlapping.
     *
     * @param {DateTime|string} start - The start of the range.
     * @param {DateTime|string} end - The end of the range.
     * @returns {boolean} True if the windows overlap.
     */
    overlaps(start, end) {
        const rangeStart = start instanceof DateTime ? start : new DateTime(start);
        const rangeEnd = end instanceof DateTime ? end : new DateTime(end);
        return this._startTime.valueOf() < rangeEnd.valueOf()
            && rangeStart.valueOf() < this._endTime.valueOf();
    }

    /**
     * Determines whether the block has enough descriptive content.
     *
     * @returns {boolean} True if the reason is non-empty.
     */
    hasReason() {
        return StringValidator.isNotEmptyString(this._reason);
    }

    /**
     * Marks the block as active. Called when the block's start time has
     * been reached.
     *
     * @returns {void}
     */
    activate() {
        this._status = BlockStatus.active();
    }

    /**
     * Releases the block early, freeing the room before the scheduled end.
     *
     * @returns {void}
     */
    release() {
        this._status = BlockStatus.released();
    }

    /**
     * Marks the block as naturally expired at its scheduled end time.
     *
     * @returns {void}
     */
    expire() {
        this._status = BlockStatus.expired();
    }

    /**
     * Attaches this block to a room. Called by the aggregate root when
     * the block is added to a Room's collection.
     *
     * @param {number} roomId - The identifier of the owning room.
     * @returns {void}
     */
    assignToRoom(roomId) {
        this._roomId = roomId;
    }
}