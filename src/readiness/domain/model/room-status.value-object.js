/**
 * @class RoomStatus
 * @summary Value object representing the operational lifecycle state of a Room.
 *
 * Valid statuses:
 * - AVAILABLE:   The room is free and can accept new bookings.
 * - PREPARING:   The room is being readied for a scheduled show.
 * - READY:       The room has been inspected and is ready to run.
 * - BLOCKED:     The room is temporarily unavailable (maintenance, incident).
 * - MAINTENANCE: The room is under scheduled maintenance and not usable.
 */

const VALID_STATUSES = Object.freeze([
    'AVAILABLE',
    'PREPARING',
    'READY',
    'BLOCKED',
    'MAINTENANCE',
]);

export class RoomStatus {

    /** @type {string} */
    #value;

    /**
     * Checks if a value is a valid room status.
     *
     * @param {string} value - The status to validate.
     * @returns {boolean} True if the value is one of the accepted statuses.
     */
    static isValidStatus(value) {
        return typeof value === 'string' && VALID_STATUSES.includes(value.toUpperCase());
    }

    /**
     * Creates a new RoomStatus instance.
     *
     * @param {string} value - The status value.
     * @throws {Error} If the provided value is not a valid status.
     */
    constructor(value) {
        if (!RoomStatus.isValidStatus(value)) {
            throw new Error(`Invalid room status: ${value}`);
        }
        this.#value = value.toUpperCase();
        Object.freeze(this);
    }

    /** @returns {string} The primitive value of the status. */
    valueOf() {
        return this.#value;
    }

    /** @returns {string} The string representation of the status. */
    toString() {
        return this.#value;
    }

    /** @returns {boolean} True if the room is available. */
    isAvailable() {
        return this.#value === 'AVAILABLE';
    }

    /** @returns {boolean} True if the room is being prepared. */
    isPreparing() {
        return this.#value === 'PREPARING';
    }

    /** @returns {boolean} True if the room is ready to run. */
    isReady() {
        return this.#value === 'READY';
    }

    /** @returns {boolean} True if the room is blocked. */
    isBlocked() {
        return this.#value === 'BLOCKED';
    }

    /** @returns {boolean} True if the room is under maintenance. */
    isInMaintenance() {
        return this.#value === 'MAINTENANCE';
    }

    /**
     * Determines whether the room can accept new bookings. Both AVAILABLE
     * and READY rooms can host shows.
     *
     * @returns {boolean} True if the room can accept new bookings.
     */
    canAcceptBookings() {
        return this.isAvailable() || this.isReady();
    }

    /**
     * Determines whether the room is operationally usable right now.
     *
     * @returns {boolean} True if the room can run a show.
     */
    isOperational() {
        return this.isReady();
    }

    /**
     * Determines whether the room requires operator attention (blocked
     * or in maintenance).
     *
     * @returns {boolean} True if the room needs intervention.
     */
    needsAttention() {
        return this.isBlocked() || this.isInMaintenance();
    }

    /**
     * Checks for equality with another RoomStatus instance.
     *
     * @param {RoomStatus} other - The other status to compare.
     * @returns {boolean}
     */
    equals(other) {
        return other instanceof RoomStatus && this.#value === other.valueOf();
    }

    /** @returns {RoomStatus} Factory for AVAILABLE. */
    static available() {
        return new RoomStatus('AVAILABLE');
    }

    /** @returns {RoomStatus} Factory for PREPARING. */
    static preparing() {
        return new RoomStatus('PREPARING');
    }

    /** @returns {RoomStatus} Factory for READY. */
    static ready() {
        return new RoomStatus('READY');
    }

    /** @returns {RoomStatus} Factory for BLOCKED. */
    static blocked() {
        return new RoomStatus('BLOCKED');
    }

    /** @returns {RoomStatus} Factory for MAINTENANCE. */
    static maintenance() {
        return new RoomStatus('MAINTENANCE');
    }
}