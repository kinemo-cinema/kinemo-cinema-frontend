/**
 * @class ValidationStatus
 * @summary Value object representing the validation state of an uploaded
 * sensory file.
 *
 * Valid statuses:
 * - PENDING:   The file has been uploaded but not yet validated.
 * - VALIDATED: The file passed validation and can be used in show execution.
 * - REJECTED:  The file failed validation and cannot be used.
 */

const VALID_STATUSES = Object.freeze(['PENDING', 'VALIDATED', 'REJECTED']);

export class ValidationStatus {

    /** @type {string} */
    #value;

    /**
     * Checks if a value is a valid validation status.
     *
     * @param {string} value - The status to validate.
     * @returns {boolean} True if the value is one of the accepted statuses.
     */
    static isValidStatus(value) {
        return typeof value === 'string' && VALID_STATUSES.includes(value.toUpperCase());
    }

    /**
     * Creates a new ValidationStatus instance.
     *
     * @param {string} value - The status value.
     * @throws {Error} If the provided value is not a valid status.
     */
    constructor(value) {
        if (!ValidationStatus.isValidStatus(value)) {
            throw new Error(`Invalid validation status: ${value}`);
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

    /** @returns {boolean} True if the file is pending validation. */
    isPending() {
        return this.#value === 'PENDING';
    }

    /** @returns {boolean} True if the file passed validation. */
    isValidated() {
        return this.#value === 'VALIDATED';
    }

    /** @returns {boolean} True if the file failed validation. */
    isRejected() {
        return this.#value === 'REJECTED';
    }

    /** @returns {boolean} True if the file may be used in a show. */
    canBeUsedInShow() {
        return this.#value === 'VALIDATED';
    }

    /**
     * Checks for equality with another ValidationStatus instance.
     *
     * @param {ValidationStatus} other - The other status to compare.
     * @returns {boolean}
     */
    equals(other) {
        return other instanceof ValidationStatus && this.#value === other.valueOf();
    }

    /** @returns {ValidationStatus} Factory for PENDING. */
    static pending() {
        return new ValidationStatus('PENDING');
    }

    /** @returns {ValidationStatus} Factory for VALIDATED. */
    static validated() {
        return new ValidationStatus('VALIDATED');
    }

    /** @returns {ValidationStatus} Factory for REJECTED. */
    static rejected() {
        return new ValidationStatus('REJECTED');
    }
}