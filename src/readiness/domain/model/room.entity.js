import {RoomStatus} from './room-status.value-object.js';
import {RoomInspection} from './room-inspection.entity.js';
import {RoomBlock} from './room-block.entity.js';
import {DateTime} from '../../../shared/domain/model/date-time.js';
import {StringValidator} from '../../../shared/domain/model/string-validator.js';

/**
 * @class Room
 * @summary Aggregate root representing a 4D-equipped room. Owns its
 * inspection history and its scheduled blocks, and controls every state
 * transition the room may undergo through its lifecycle.
 *
 * The aggregate references its scheduled shows by identifier only — the
 * Show aggregate is owned by BC02 (Scheduling & Calendar).
 */
export class Room {

    /**
     * @param {Object} props
     * @param {number|null} [props.id] - Unique identifier. `null` for a room not yet persisted.
     * @param {string} [props.name] - Display name of the room.
     * @param {number} [props.capacity] - Seat capacity of the room.
     * @param {RoomStatus|string|null} [props.status] - A `RoomStatus`, or its string form. Defaults to AVAILABLE.
     * @param {RoomInspection[]} [props.inspections] - Owned inspections. Non-`RoomInspection` entries are ignored.
     * @param {RoomBlock[]} [props.blocks] - Owned blocks. Non-`RoomBlock` entries are ignored.
     * @param {DateTime|string|null} [props.createdAt] - A `DateTime`, or a value accepted by `new DateTime(...)`.
     * @param {DateTime|string|null} [props.updatedAt] - A `DateTime`, or a value accepted by `new DateTime(...)`.
     * @throws {Error} If `status` is a string that is not a valid room status.
     */
    constructor({
                    id = null,
                    name = '',
                    capacity = 0,
                    status = null,
                    inspections = [],
                    blocks = [],
                    createdAt = null,
                    updatedAt = null
                } = {}) {
        this._id = id;
        this._name = name;
        this._capacity = Number.isFinite(capacity) ? capacity : 0;
        this._status = status instanceof RoomStatus
            ? status
            : new RoomStatus(status ?? 'AVAILABLE');
        this._inspections = inspections.filter(i => i instanceof RoomInspection);
        this._blocks = blocks.filter(b => b instanceof RoomBlock);
        this._createdAt = createdAt instanceof DateTime ? createdAt : new DateTime(createdAt);
        this._updatedAt = updatedAt instanceof DateTime ? updatedAt : new DateTime(updatedAt);
    }

    // --------------------------------------------------------------------
    // Identity & scalar attributes
    // --------------------------------------------------------------------

    /** @returns {number|null} The room's unique identifier. */
    getId = () => this._id;

    /** @returns {string} The room's display name. */
    getName = () => this._name;

    /** @returns {number} The room's seat capacity. */
    getCapacity = () => this._capacity;

    /** @returns {RoomStatus} The current room status. */
    getStatus = () => this._status;

    /** @returns {string} The room status as a string. */
    getStatusAsString = () => this._status.toString();

    /** @returns {DateTime} When the room record was created. */
    getCreatedAt = () => this._createdAt;

    /** @returns {string} The creation timestamp as an ISO 8601 string. */
    getCreatedAtFormated = () => this._createdAt.toISOString();

    /** @returns {DateTime} When the room record was last updated. */
    getUpdatedAt = () => this._updatedAt;

    /** @returns {string} The last-update timestamp as an ISO 8601 string. */
    getUpdatedAtFormated = () => this._updatedAt.toISOString();

    // --------------------------------------------------------------------
    // Owned children — RoomInspection
    // --------------------------------------------------------------------

    /**
     * Returns a shallow copy of the owned inspections.
     *
     * @returns {RoomInspection[]} A copy of the inspections.
     */
    getInspections = () => [...this._inspections];

    /** @returns {number} The number of owned inspections. */
    getInspectionCount = () => this._inspections.length;

    /** @returns {boolean} True if the room has at least one inspection. */
    hasInspections = () => this._inspections.length > 0;

    /**
     * Returns the most recent inspection, based on `inspectedAt`.
     *
     * @returns {RoomInspection|undefined} The latest inspection, if any.
     */
    getLatestInspection = () => {
        if (this._inspections.length === 0) return undefined;
        return [...this._inspections].sort(
            (a, b) => b.getInspectedAt().valueOf() - a.getInspectedAt().valueOf()
        )[0];
    };

    /**
     * Adds an inspection to this room. Duplicates (same identifier) are
     * rejected silently.
     *
     * @param {RoomInspection} inspection - The inspection to add.
     * @returns {void}
     * @throws {TypeError} If `inspection` is not a RoomInspection instance.
     */
    addInspection(inspection) {
        if (!(inspection instanceof RoomInspection)) {
            throw new TypeError('Expected a RoomInspection instance');
        }
        if (inspection.getId() !== null && this._inspections.some(i => i.getId() === inspection.getId())) {
            return;
        }
        this._inspections.push(inspection);
    }

    /**
     * Removes an inspection by its identifier.
     *
     * @param {number} inspectionId - The identifier of the inspection to remove.
     * @returns {boolean} True if an inspection was removed.
     */
    removeInspection(inspectionId) {
        const index = this._inspections.findIndex(i => i.getId() === inspectionId);
        if (index === -1) return false;
        this._inspections.splice(index, 1);
        return true;
    }

    // --------------------------------------------------------------------
    // Owned children — RoomBlock
    // --------------------------------------------------------------------

    /**
     * Returns a shallow copy of the owned blocks.
     *
     * @returns {RoomBlock[]} A copy of the blocks.
     */
    getBlocks = () => [...this._blocks];

    /** @returns {number} The number of owned blocks. */
    getBlockCount = () => this._blocks.length;

    /**
     * Returns the subset of blocks that are still preventing the room
     * from being used.
     *
     * @returns {RoomBlock[]} The active or scheduled blocks.
     */
    getBlockingBlocks = () => this._blocks.filter(b => b.isBlocking());

    /**
     * Returns the block that is currently in effect, if any.
     *
     * @returns {RoomBlock|undefined} The current block.
     */
    getCurrentBlock = () => this._blocks.find(b => b.isCurrentlyActive());

    /**
     * Adds a block to this room. Duplicates (same identifier) are rejected
     * silently.
     *
     * @param {RoomBlock} block - The block to add.
     * @returns {void}
     * @throws {TypeError} If `block` is not a RoomBlock instance.
     */
    addBlock(block) {
        if (!(block instanceof RoomBlock)) {
            throw new TypeError('Expected a RoomBlock instance');
        }
        if (block.getId() !== null && this._blocks.some(b => b.getId() === block.getId())) {
            return;
        }
        this._blocks.push(block);
    }

    /**
     * Removes a block by its identifier.
     *
     * @param {number} blockId - The identifier of the block to remove.
     * @returns {boolean} True if a block was removed.
     */
    removeBlock(blockId) {
        const index = this._blocks.findIndex(b => b.getId() === blockId);
        if (index === -1) return false;
        this._blocks.splice(index, 1);
        return true;
    }

    /**
     * Determines whether the room's block collection would overlap a
     * given time window. Useful for pre-validating new blocks.
     *
     * @param {DateTime|string} start - The start of the candidate window.
     * @param {DateTime|string} end - The end of the candidate window.
     * @returns {boolean} True if any blocking block overlaps the window.
     */
    hasBlockOverlapping(start, end) {
        return this._blocks.some(b => b.isBlocking() && b.overlaps(start, end));
    }

    // --------------------------------------------------------------------
    // State queries
    // --------------------------------------------------------------------

    /**
     * Determines whether the room is administratively available. This
     * does not consider inspections or blocks — use `canHostShow` for a
     * complete readiness check.
     *
     * @returns {boolean} True if the status permits bookings.
     */
    isAvailable() {
        return this._status.canAcceptBookings();
    }

    /**
     * Determines whether the room is operationally ready to run a show.
     *
     * @returns {boolean} True if the status is READY.
     */
    isOperationallyReady() {
        return this._status.isOperational();
    }

    /**
     * Determines whether the room currently has an active block.
     *
     * @returns {boolean} True if a blocking block is in effect.
     */
    hasActiveBlock() {
        return this._blocks.some(b => b.isCurrentlyActive());
    }

    /**
     * Determines whether the room's most recent inspection cleared it
     * for operation.
     *
     * @returns {boolean} True if the latest inspection passed.
     */
    hasPassedLatestInspection() {
        const latest = this.getLatestInspection();
        return latest ? latest.clearsRoom() : false;
    }

    /**
     * Determines whether the room can host a show right now. Combines
     * administrative availability, an active block check, and a passed
     * inspection.
     *
     * @returns {boolean} True if the room is completely ready.
     */
    canHostShow() {
        return this.isAvailable() && !this.hasActiveBlock() && this.hasPassedLatestInspection();
    }

    // --------------------------------------------------------------------
    // Lifecycle transitions
    // --------------------------------------------------------------------

    /**
     * Marks the room as PREPARING, indicating it is being readied for an
     * upcoming show. Only AVAILABLE or READY rooms can transition into
     * PREPARING.
     *
     * @returns {void}
     * @throws {Error} If the current status does not allow this transition.
     */
    startPreparation() {
        if (!(this._status.isAvailable() || this._status.isReady())) {
            throw new Error(`Cannot prepare a room in status ${this._status.toString()}`);
        }
        this._status = RoomStatus.preparing();
        this._updatedAt = DateTime.now();
    }

    /**
     * Marks the room as READY, confirming it can run a show. Only
     * PREPARING rooms can transition to READY.
     *
     * @returns {void}
     * @throws {Error} If the current status does not allow this transition.
     */
    markReady() {
        if (!this._status.isPreparing()) {
            throw new Error(`Cannot mark a room ready from status ${this._status.toString()}`);
        }
        this._status = RoomStatus.ready();
        this._updatedAt = DateTime.now();
    }

    /**
     * Blocks the room, making it unavailable for shows. Records the block
     * in the room's collection and updates the status.
     *
     * @param {RoomBlock} block - The block being applied. Must be a RoomBlock
     *                             with a non-empty reason.
     * @returns {void}
     * @throws {TypeError} If `block` is not a RoomBlock instance.
     * @throws {Error} If the block has no reason.
     */
    block(block) {
        if (!(block instanceof RoomBlock)) {
            throw new TypeError('Expected a RoomBlock instance');
        }
        if (!block.hasReason()) {
            throw new Error('A room block requires a non-empty reason');
        }
        this.addBlock(block);
        this._status = RoomStatus.blocked();
        this._updatedAt = DateTime.now();
    }

    /**
     * Releases the room from a block, freeing it for new bookings. The
     * most recent blocking block is marked as released.
     *
     * @returns {void}
     * @throws {Error} If the room is not currently blocked.
     */
    release() {
        if (!this._status.isBlocked()) {
            throw new Error(`Cannot release a room in status ${this._status.toString()}`);
        }
        const blocking = this.getBlockingBlocks();
        if (blocking.length > 0) {
            blocking[blocking.length - 1].release();
        }
        this._status = RoomStatus.available();
        this._updatedAt = DateTime.now();
    }

    /**
     * Sends the room to scheduled maintenance. Only AVAILABLE or BLOCKED
     * rooms can transition to MAINTENANCE.
     *
     * @returns {void}
     * @throws {Error} If the current status does not allow this transition.
     */
    sendToMaintenance() {
        if (!(this._status.isAvailable() || this._status.isBlocked())) {
            throw new Error(`Cannot send a room to maintenance from status ${this._status.toString()}`);
        }
        this._status = RoomStatus.maintenance();
        this._updatedAt = DateTime.now();
    }

    /**
     * Returns the room to AVAILABLE after maintenance completes.
     *
     * @returns {void}
     * @throws {Error} If the room is not currently in maintenance.
     */
    completeMaintenance() {
        if (!this._status.isInMaintenance()) {
            throw new Error(`Cannot complete maintenance from status ${this._status.toString()}`);
        }
        this._status = RoomStatus.available();
        this._updatedAt = DateTime.now();
    }
}