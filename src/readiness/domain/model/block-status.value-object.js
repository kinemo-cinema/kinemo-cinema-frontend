/**
 * @class BlockStatus
 * @summary Value object representing the lifecycle of a room block.
 *
 * Valid statuses:
 * - SCHEDULED: The block is planned but has not started.
 * - ACTIVE:    The block is currently in effect.
 * - RELEASED:  The block ended early and the room is free again.
 * - EXPIRED:   The block reached its scheduled end naturally.
 */

const VALID_STATUSES = Object.freeze(['SCHEDULED', 'ACTIVE', 'RELEASED', 'EXPIRED']);

export class BlockStatus {

    /** @type {string} */
    #value;

    /**
     * Checks if a value is a valid block status.
     *
     * @param {string} value - The status to validate.
     * @returns {boolean} True if the value is one of the accepted statuses.
     */
    static isValidStatus(value) {
        return typeof value === 'string' && VALID_STATUSES.includes(value.toUpperCase());
    }

    /**
     * Creates a new BlockStatus instance.
     *
     * @param {string} value - The status value.
     * @throws {Error} If the provided value is not a valid status.
     */
    constructor(value) {
        if (!BlockStatus.isValidStatus(value)) {
            throw new Error(`Invalid block status: ${value}`);
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

    /** @returns {boolean} True if the block is scheduled. */
    isScheduled() {
        return this.#value === 'SCHEDULED';
    }

    /** @returns {boolean} True if the block is active. */
    isActive() {
        return this.#value === 'ACTIVE';
    }

    /** @returns {boolean} True if the block was released. */
    isReleased() {
        return this.#value === 'RELEASED';
    }

    /** @returns {boolean} True if the block expired. */
    isExpired() {
        return this.#value === 'EXPIRED';
    }

    /**
     * Determines whether the block is still preventing the room from
     * being used. Scheduled and active blocks are both blocking.
     *
     * @returns {boolean} True if the block is still in effect or pending.
     */
    isBlocking() {
        return this.isScheduled() || this.isActive();
    }

    /**
     * Determines whether the block has reached a terminal state.
     *
     * @returns {boolean} True if the block can no longer change.
     */
    isFinal() {
        return this.isReleased() || this.isExpired();
    }

    /**
     * Checks for equality with another BlockStatus instance.
     *
     * @param {BlockStatus} other - The other status to compare.
     * @returns {boolean}
     */
    equals(other) {
        return other instanceof BlockStatus && this.#value === other.valueOf();
    }

    /** @returns {BlockStatus} Factory for SCHEDULED. */
    static scheduled() {
        return new BlockStatus('SCHEDULED');
    }

    /** @returns {BlockStatus} Factory for ACTIVE. */
    static active() {
        return new BlockStatus('ACTIVE');
    }

    /** @returns {BlockStatus} Factory for RELEASED. */
    static released() {
        return new BlockStatus('RELEASED');
    }

    /** @returns {BlockStatus} Factory for EXPIRED. */
    static expired() {
        return new BlockStatus('EXPIRED');
    }
}