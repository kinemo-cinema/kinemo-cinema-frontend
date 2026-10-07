/**
 * @class CalculationStatus
 * @summary Value object representing the state of a resource calculation
 * tied to a scheduled show.
 *
 * Valid statuses:
 * - PENDING:      The calculation has not been performed yet.
 * - CALCULATED:   The resource requirements have been computed.
 * - NOT_REQUIRED: The show does not consume water or air effects.
 */

const VALID_STATUSES = Object.freeze(['PENDING', 'CALCULATED', 'NOT_REQUIRED']);

export class CalculationStatus {

    /** @type {string} */
    #value;

    /**
     * Checks if a value is a valid calculation status.
     *
     * @param {string} value - The status to validate.
     * @returns {boolean} True if the value is one of the accepted statuses.
     */
    static isValidStatus(value) {
        return typeof value === 'string' && VALID_STATUSES.includes(value.toUpperCase());
    }

    /**
     * Creates a new CalculationStatus instance.
     *
     * @param {string} value - The status value.
     * @throws {Error} If the provided value is not a valid status.
     */
    constructor(value) {
        if (!CalculationStatus.isValidStatus(value)) {
            throw new Error(`Invalid calculation status: ${value}`);
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

    /** @returns {boolean} True if the calculation is pending. */
    isPending() {
        return this.#value === 'PENDING';
    }

    /** @returns {boolean} True if the calculation has been performed. */
    isCalculated() {
        return this.#value === 'CALCULATED';
    }

    /** @returns {boolean} True if the calculation is not required. */
    isNotRequired() {
        return this.#value === 'NOT_REQUIRED';
    }

    /**
     * Determines whether the calculation has reached a final state.
     *
     * @returns {boolean} True if no further work is needed.
     */
    isFinalized() {
        return this.isCalculated() || this.isNotRequired();
    }

    /**
     * Checks for equality with another CalculationStatus instance.
     *
     * @param {CalculationStatus} other - The other status to compare.
     * @returns {boolean}
     */
    equals(other) {
        return other instanceof CalculationStatus && this.#value === other.valueOf();
    }

    /** @returns {CalculationStatus} Factory for PENDING. */
    static pending() {
        return new CalculationStatus('PENDING');
    }

    /** @returns {CalculationStatus} Factory for CALCULATED. */
    static calculated() {
        return new CalculationStatus('CALCULATED');
    }

    /** @returns {CalculationStatus} Factory for NOT_REQUIRED. */
    static notRequired() {
        return new CalculationStatus('NOT_REQUIRED');
    }
}