/**
 * @class TrackStatus
 * @summary Value object representing the operational status of a sensory track.
 *
 * Valid statuses:
 * - ENABLED:  The track is active and participates in show execution.
 * - DISABLED: The track is turned off and will not fire during a show.
 * - PENDING:  The track has been uploaded but not yet enabled for use.
 */

const VALID_STATUSES = Object.freeze(['ENABLED', 'DISABLED', 'PENDING']);

export class TrackStatus {

    /** @type {string} */
    #value;

    /**
     * Checks if a value is a valid track status.
     *
     * @param {string} value - The status to validate.
     * @returns {boolean} True if the value is one of the accepted statuses.
     */
    static isValidStatus(value) {
        return typeof value === 'string' && VALID_STATUSES.includes(value.toUpperCase());
    }

    /**
     * Creates a new TrackStatus instance.
     *
     * @param {string} value - The status value.
     * @throws {Error} If the provided value is not a valid status.
     */
    constructor(value) {
        if (!TrackStatus.isValidStatus(value)) {
            throw new Error(`Invalid track status: ${value}`);
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

    /** @returns {boolean} True if the track is enabled. */
    isEnabled() {
        return this.#value === 'ENABLED';
    }

    /** @returns {boolean} True if the track is disabled. */
    isDisabled() {
        return this.#value === 'DISABLED';
    }

    /** @returns {boolean} True if the track is pending activation. */
    isPending() {
        return this.#value === 'PENDING';
    }

    /** @returns {boolean} True if the track can currently execute effects. */
    isExecutable() {
        return this.#value === 'ENABLED';
    }

    /**
     * Checks for equality with another TrackStatus instance.
     *
     * @param {TrackStatus} other - The other status to compare.
     * @returns {boolean}
     */
    equals(other) {
        return other instanceof TrackStatus && this.#value === other.valueOf();
    }

    /** @returns {TrackStatus} Factory for ENABLED. */
    static enabled() {
        return new TrackStatus('ENABLED');
    }

    /** @returns {TrackStatus} Factory for DISABLED. */
    static disabled() {
        return new TrackStatus('DISABLED');
    }

    /** @returns {TrackStatus} Factory for PENDING. */
    static pending() {
        return new TrackStatus('PENDING');
    }
}