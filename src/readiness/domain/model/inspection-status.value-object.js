/**
 * @class InspectionStatus
 * @summary Value object representing the outcome of a room inspection.
 *
 * Valid statuses:
 * - PENDING:  The inspection has been recorded but not yet reviewed.
 * - APPROVED: The room passed inspection and is clear to operate.
 * - REJECTED: The room failed inspection and needs intervention.
 */

const VALID_STATUSES = Object.freeze(['PENDING', 'APPROVED', 'REJECTED']);

export class InspectionStatus {

    /** @type {string} */
    #value;

    /**
     * Checks if a value is a valid inspection status.
     *
     * @param {string} value - The status to validate.
     * @returns {boolean} True if the value is one of the accepted statuses.
     */
    static isValidStatus(value) {
        return typeof value === 'string' && VALID_STATUSES.includes(value.toUpperCase());
    }

    /**
     * Creates a new InspectionStatus instance.
     *
     * @param {string} value - The status value.
     * @throws {Error} If the provided value is not a valid status.
     */
    constructor(value) {
        if (!InspectionStatus.isValidStatus(value)) {
            throw new Error(`Invalid inspection status: ${value}`);
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

    /** @returns {boolean} True if the inspection is pending. */
    isPending() {
        return this.#value === 'PENDING';
    }

    /** @returns {boolean} True if the inspection was approved. */
    isApproved() {
        return this.#value === 'APPROVED';
    }

    /** @returns {boolean} True if the inspection was rejected. */
    isRejected() {
        return this.#value === 'REJECTED';
    }

    /**
     * Determines whether an inspection in this state clears the room for
     * show execution.
     *
     * @returns {boolean} True if the room can be considered ready.
     */
    clearsRoom() {
        return this.isApproved();
    }

    /**
     * Checks for equality with another InspectionStatus instance.
     *
     * @param {InspectionStatus} other - The other status to compare.
     * @returns {boolean}
     */
    equals(other) {
        return other instanceof InspectionStatus && this.#value === other.valueOf();
    }

    /** @returns {InspectionStatus} Factory for PENDING. */
    static pending() {
        return new InspectionStatus('PENDING');
    }

    /** @returns {InspectionStatus} Factory for APPROVED. */
    static approved() {
        return new InspectionStatus('APPROVED');
    }

    /** @returns {InspectionStatus} Factory for REJECTED. */
    static rejected() {
        return new InspectionStatus('REJECTED');
    }
}