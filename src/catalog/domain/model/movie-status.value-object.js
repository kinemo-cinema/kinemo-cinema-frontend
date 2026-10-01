/**
 * @class MovieStatus
 * @summary Value object representing the lifecycle state of a Movie.
 *
 * Valid statuses:
 * - ACTIVE:   The movie is available and can be scheduled.
 * - INACTIVE: The movie is retired and cannot be scheduled.
 */

const VALID_STATUSES = Object.freeze(['ACTIVE', 'INACTIVE']);

export class MovieStatus {

    /** @type {string} */
    #value;

    /**
     * Checks if a value is a valid movie status.
     *
     * @param {string} value - The status to validate.
     * @returns {boolean} True if the value is one of the accepted statuses.
     */
    static isValidStatus(value) {
        return typeof value === 'string' && VALID_STATUSES.includes(value.toUpperCase());
    }

    /**
     * Creates a new MovieStatus instance.
     *
     * @param {string} value - The status value ("ACTIVE" or "INACTIVE").
     * @throws {Error} If the provided value is not a valid status.
     */
    constructor(value) {
        if (!MovieStatus.isValidStatus(value)) {
            throw new Error(`Invalid movie status: ${value}`);
        }
        this.#value = value.toUpperCase();
        Object.freeze(this);
    }

    /**
     * Returns the primitive value of the status.
     * @returns {string}
     */
    valueOf() {
        return this.#value;
    }

    /**
     * Returns the string representation of the status.
     * @returns {string}
     */
    toString() {
        return this.#value;
    }

    /**
     * Checks if this status represents an active movie.
     * @returns {boolean}
     */
    isActive() {
        return this.#value === 'ACTIVE';
    }

    /**
     * Checks if this status represents an inactive movie.
     * @returns {boolean}
     */
    isInactive() {
        return this.#value === 'INACTIVE';
    }

    /**
     * Determines whether a movie with this status can be scheduled
     * in the Scheduling bounded context (BC03).
     *
     * @returns {boolean}
     */
    canBeScheduled() {
        return this.#value === 'ACTIVE';
    }

    /**
     * Checks for equality with another MovieStatus instance.
     *
     * @param {MovieStatus} other - The other status to compare.
     * @returns {boolean}
     */
    equals(other) {
        return other instanceof MovieStatus && this.#value === other.valueOf();
    }

    /**
     * Factory method to create an ACTIVE status.
     * @returns {MovieStatus}
     */
    static active() {
        return new MovieStatus('ACTIVE');
    }

    /**
     * Factory method to create an INACTIVE status.
     * @returns {MovieStatus}
     */
    static inactive() {
        return new MovieStatus('INACTIVE');
    }
}