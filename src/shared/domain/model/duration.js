const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 3600;

/**
 * Value object representing a span of time in seconds.
 *
 * @remarks
 * This value object stores the duration canonically in seconds and exposes
 * convenient conversions to minutes and hours. It is immutable and supports
 * addition and equality checks with other Duration instances.
 */
export class Duration {
    /** @type {number} */
    #value;

    /**
     * Validates if a value is a valid duration in seconds.
     *
     * @param {number} value - The duration in seconds to validate.
     * @returns {boolean} True if the value is a non-negative finite number, false otherwise.
     */
    static isValidDuration(value) {
        return typeof value === 'number' && Number.isFinite(value) && value >= 0;
    }

    /**
     * Creates a new Duration instance.
     *
     * @param {number} value - The duration in seconds.
     */
    constructor(value) {
        this.#value = Duration.isValidDuration(value) ? Math.floor(value) : 0;
        Object.freeze(this);
    }

    /**
     * Creates a Duration from a number of minutes.
     *
     * @param {number} minutes - The number of minutes.
     * @returns {Duration} A new Duration instance.
     */
    static fromMinutes(minutes) {
        return new Duration(minutes * SECONDS_PER_MINUTE);
    }

    /**
     * Creates a Duration from a number of hours.
     *
     * @param {number} hours - The number of hours.
     * @returns {Duration} A new Duration instance.
     */
    static fromHours(hours) {
        return new Duration(hours * SECONDS_PER_HOUR);
    }

    /**
     * Returns the duration in seconds.
     * @returns {number}
     */
    getSeconds() {
        return this.#value;
    }

    /**
     * Returns the duration in whole minutes.
     * @returns {number}
     */
    getMinutes() {
        return Math.floor(this.#value / SECONDS_PER_MINUTE);
    }

    /**
     * Returns the duration in whole hours.
     * @returns {number}
     */
    getHours() {
        return Math.floor(this.#value / SECONDS_PER_HOUR);
    }

    /**
     * Adds another Duration instance to this one.
     *
     * @param {Duration} other - The Duration to add.
     * @returns {Duration} A new Duration instance with the summed value.
     * @throws {TypeError} If the provided value is not a Duration instance.
     */
    add(other) {
        this.#assertDuration(other);
        return new Duration(this.#value + other.getSeconds());
    }

    /**
     * Checks for equality with another Duration instance.
     *
     * @param {Duration} other - The other Duration to compare.
     * @returns {boolean}
     */
    equals(other) {
        return other instanceof Duration && this.#value === other.getSeconds();
    }

    /**
     * Returns the string representation of the Duration.
     * @returns {string}
     */
    toString() {
        return `${this.#value}s`;
    }

    /**
     * Asserts that a value is a Duration instance.
     *
     * @param {*} value - The value to check.
     * @throws {TypeError} If the value is not a Duration instance.
     */
    #assertDuration(value) {
        if (!(value instanceof Duration)) {
            throw new TypeError('Expected a Duration instance');
        }
    }
}