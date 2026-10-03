/**
 * @class IntensityLevel
 * @summary Value object representing the intensity of a sensory effect,
 * expressed as an integer percentage between 0 and 100.
 *
 * The numeric representation matches the value stored by the mock API.
 * The `category()` method derives a qualitative band (LOW, MEDIUM, HIGH)
 * for display and reporting purposes.
 */

const MIN = 0;
const MAX = 100;

export class IntensityLevel {

    /** @type {number} */
    #value;

    /**
     * Checks if a value is a valid intensity level.
     *
     * @param {number} value - The intensity to validate.
     * @returns {boolean} True if the value is an integer within [0, 100].
     */
    static isValidLevel(value) {
        return typeof value === 'number'
            && Number.isInteger(value)
            && value >= MIN
            && value <= MAX;
    }

    /**
     * Creates a new IntensityLevel instance.
     *
     * @param {number} value - The intensity percentage (0–100).
     * @throws {Error} If the provided value is not a valid intensity level.
     */
    constructor(value) {
        if (!IntensityLevel.isValidLevel(value)) {
            throw new Error(`Invalid intensity level: ${value}`);
        }
        this.#value = value;
        Object.freeze(this);
    }

    /** @returns {number} The numeric intensity percentage. */
    getValue() {
        return this.#value;
    }

    /** @returns {number} The primitive value of the intensity. */
    valueOf() {
        return this.#value;
    }

    /** @returns {string} The string representation of the intensity. */
    toString() {
        return `${this.#value}%`;
    }

    /** @returns {boolean} True if the intensity is 0. */
    isMuted() {
        return this.#value === 0;
    }

    /** @returns {boolean} True if the intensity is 100. */
    isMax() {
        return this.#value === MAX;
    }

    /**
     * Derives a qualitative band from the numeric intensity.
     * LOW    → 0–33
     * MEDIUM → 34–66
     * HIGH   → 67–100
     *
     * @returns {'LOW'|'MEDIUM'|'HIGH'} The qualitative category.
     */
    category() {
        if (this.#value <= 33) return 'LOW';
        if (this.#value <= 66) return 'MEDIUM';
        return 'HIGH';
    }

    /**
     * Checks for equality with another IntensityLevel instance.
     *
     * @param {IntensityLevel} other - The other intensity to compare.
     * @returns {boolean}
     */
    equals(other) {
        return other instanceof IntensityLevel && this.#value === other.getValue();
    }

    /** @returns {IntensityLevel} Factory for the minimum intensity (0). */
    static low() {
        return new IntensityLevel(0);
    }

    /** @returns {IntensityLevel} Factory for a mid-range intensity (50). */
    static medium() {
        return new IntensityLevel(50);
    }

    /** @returns {IntensityLevel} Factory for the maximum intensity (100). */
    static high() {
        return new IntensityLevel(100);
    }
}