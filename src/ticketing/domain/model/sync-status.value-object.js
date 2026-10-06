/**
 * Represents the status of a ticketing synchronization process.
 */
export class SyncStatus {

    static PENDING = 'PENDING';
    static SUCCESSFUL = 'SUCCESSFUL';
    static INCOMPLETE = 'INCOMPLETE';
    static FAILED = 'FAILED';

    #value;

    /**
     * Creates a new SyncStatus value object.
     *
     * @param {string} value - Synchronization status value.
     */
    constructor(value = SyncStatus.PENDING) {
        const normalizedValue = String(value).toUpperCase();

        if (!SyncStatus.isValid(normalizedValue)) {
            throw new Error(`Invalid synchronization status: ${value}`);
        }

        this.#value = normalizedValue;
    }

    /**
     * Gets the synchronization status value.
     *
     * @returns {string}
     */
    get value() {
        return this.#value;
    }

    /**
     * Determines whether the synchronization is pending.
     *
     * @returns {boolean}
     */
    isPending() {
        return this.#value === SyncStatus.PENDING;
    }

    /**
     * Determines whether the synchronization was successful.
     *
     * @returns {boolean}
     */
    isSuccessful() {
        return this.#value === SyncStatus.SUCCESSFUL;
    }

    /**
     * Determines whether the synchronization was incomplete.
     *
     * @returns {boolean}
     */
    isIncomplete() {
        return this.#value === SyncStatus.INCOMPLETE;
    }

    /**
     * Determines whether the synchronization failed.
     *
     * @returns {boolean}
     */
    isFailed() {
        return this.#value === SyncStatus.FAILED;
    }

    /**
     * Returns a pending synchronization status.
     *
     * @returns {SyncStatus}
     */
    static pending() {
        return new SyncStatus(SyncStatus.PENDING);
    }

    /**
     * Returns a successful synchronization status.
     *
     * @returns {SyncStatus}
     */
    static successful() {
        return new SyncStatus(SyncStatus.SUCCESSFUL);
    }

    /**
     * Returns an incomplete synchronization status.
     *
     * @returns {SyncStatus}
     */
    static incomplete() {
        return new SyncStatus(SyncStatus.INCOMPLETE);
    }

    /**
     * Returns a failed synchronization status.
     *
     * @returns {SyncStatus}
     */
    static failed() {
        return new SyncStatus(SyncStatus.FAILED);
    }

    /**
     * Determines whether a synchronization status value is valid.
     *
     * @param {string} value - Value to validate.
     * @returns {boolean}
     */
    static isValid(value) {
        return [
            SyncStatus.PENDING,
            SyncStatus.SUCCESSFUL,
            SyncStatus.INCOMPLETE,
            SyncStatus.FAILED
        ].includes(value);
    }

    /**
     * Returns the synchronization status as a string.
     *
     * @returns {string}
     */
    toString() {
        return this.#value;
    }
}