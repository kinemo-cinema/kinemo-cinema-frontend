/**
 * @class ShowStatus
 * @summary Value object representing the lifecycle state of a Show.
 *
 * Valid statuses:
 * - SCHEDULED:    The show is programmed and awaiting confirmation.
 * - CONFIRMED:    The show has been confirmed and will proceed.
 * - RESCHEDULED:  The show's schedule was changed after initial programming.
 * - IN_PROGRESS:  The show is currently running.
 * - COMPLETED:    The show has ended normally.
 * - CANCELLED:    The show was cancelled and will not run.
 */

const VALID_STATUSES = Object.freeze([
    'SCHEDULED',
    'CONFIRMED',
    'RESCHEDULED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED',
]);

export class ShowStatus {

    /** @type {string} */
    #value;

    /**
     * Checks if a value is a valid show status.
     *
     * @param {string} value - The status to validate.
     * @returns {boolean} True if the value is one of the accepted statuses.
     */
    static isValidStatus(value) {
        return typeof value === 'string' && VALID_STATUSES.includes(value.toUpperCase());
    }

    /**
     * Creates a new ShowStatus instance.
     *
     * @param {string} value - The status value.
     * @throws {Error} If the provided value is not a valid status.
     */
    constructor(value) {
        if (!ShowStatus.isValidStatus(value)) {
            throw new Error(`Invalid show status: ${value}`);
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

    /** @returns {boolean} True if the show is scheduled. */
    isScheduled() {
        return this.#value === 'SCHEDULED';
    }

    /** @returns {boolean} True if the show is confirmed. */
    isConfirmed() {
        return this.#value === 'CONFIRMED';
    }

    /** @returns {boolean} True if the show was rescheduled. */
    isRescheduled() {
        return this.#value === 'RESCHEDULED';
    }

    /** @returns {boolean} True if the show is currently running. */
    isInProgress() {
        return this.#value === 'IN_PROGRESS';
    }

    /** @returns {boolean} True if the show has completed. */
    isCompleted() {
        return this.#value === 'COMPLETED';
    }

    /** @returns {boolean} True if the show was cancelled. */
    isCancelled() {
        return this.#value === 'CANCELLED';
    }

    /**
     * Determines whether the show is still active — that is, neither
     * completed nor cancelled.
     *
     * @returns {boolean} True if the show can still be operated on.
     */
    isActive() {
        return this.#value !== 'COMPLETED' && this.#value !== 'CANCELLED';
    }

    /**
     * Determines whether a show in this state can be edited.
     *
     * @returns {boolean} True if the show can be edited.
     */
    canBeEdited() {
        return this.isActive();
    }

    /**
     * Determines whether a show in this state can be cancelled.
     *
     * @returns {boolean} True if the show can be cancelled.
     */
    canBeCancelled() {
        return this.isActive();
    }

    /**
     * Checks for equality with another ShowStatus instance.
     *
     * @param {ShowStatus} other - The other status to compare.
     * @returns {boolean}
     */
    equals(other) {
        return other instanceof ShowStatus && this.#value === other.valueOf();
    }

    /** @returns {ShowStatus} Factory for SCHEDULED. */
    static scheduled() {
        return new ShowStatus('SCHEDULED');
    }

    /** @returns {ShowStatus} Factory for CONFIRMED. */
    static confirmed() {
        return new ShowStatus('CONFIRMED');
    }

    /** @returns {ShowStatus} Factory for RESCHEDULED. */
    static rescheduled() {
        return new ShowStatus('RESCHEDULED');
    }

    /** @returns {ShowStatus} Factory for IN_PROGRESS. */
    static inProgress() {
        return new ShowStatus('IN_PROGRESS');
    }

    /** @returns {ShowStatus} Factory for COMPLETED. */
    static completed() {
        return new ShowStatus('COMPLETED');
    }

    /** @returns {ShowStatus} Factory for CANCELLED. */
    static cancelled() {
        return new ShowStatus('CANCELLED');
    }
}