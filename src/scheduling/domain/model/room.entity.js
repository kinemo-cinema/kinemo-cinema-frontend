/**
 * @class Room
 * @summary Minimal entity representing a cinema room, used by the
 * Scheduling bounded context to populate the show form's room dropdown.
 *
 * @remarks
 * This is a temporary slice. The full Room aggregate — with inspections,
 * blocks, resource calculations, and readiness operations — belongs to
 * BC03 (Room & Resource Readiness). When BC03 is implemented, delete this
 * file and consume the Room aggregate from there instead.
 */
export class Room {

    /**
     * @param {Object} props
     * @param {number|null} [props.id] - Unique identifier.
     * @param {string} [props.name] - Display name of the room.
     * @param {string} [props.status] - Room status ("AVAILABLE", "MAINTENANCE").
     * @param {string} [props.operationalStatus] - Operational status ("READY", "MAINTENANCE").
     */
    constructor({
                    id = null,
                    name = '',
                    status = 'AVAILABLE',
                    operationalStatus = 'READY'
                } = {}) {
        this._id = id;
        this._name = name;
        this._status = status;
        this._operationalStatus = operationalStatus;
    }

    /** @returns {number|null} The room's unique identifier. */
    getId = () => this._id;

    /** @returns {string} The room's display name. */
    getName = () => this._name;

    /** @returns {string} The room's administrative status. */
    getStatus = () => this._status;

    /** @returns {string} The room's operational status. */
    getOperationalStatus = () => this._operationalStatus;

    /**
     * Determines whether the room is available to host new shows.
     * A room must be both administratively AVAILABLE and operationally READY.
     *
     * @returns {boolean} True if the room can accept new shows.
     */
    isAvailable() {
        return this._status === 'AVAILABLE' && this._operationalStatus === 'READY';
    }
}