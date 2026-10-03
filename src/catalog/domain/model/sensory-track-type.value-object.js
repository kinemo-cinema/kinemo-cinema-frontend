/**
 * @class SensoryTrackType
 * @summary Value object representing the type of physical effect a sensory
 * track drives on a 4D-equipped seat.
 *
 * Valid types:
 * - MOTION:    Seat motion (tilt, pitch, roll).
 * - WIND:      Air blower / wind effect.
 * - WATER:     Water spray / mist effect.
 * - VIBRATION: Seat vibration effect.
 */

const VALID_TYPES = Object.freeze(['MOTION', 'WIND', 'WATER', 'VIBRATION']);

export class SensoryTrackType {

    /** @type {string} */
    #value;

    /**
     * Checks if a value is a valid sensory track type.
     *
     * @param {string} value - The type to validate.
     * @returns {boolean} True if the value is one of the accepted types.
     */
    static isValidType(value) {
        return typeof value === 'string' && VALID_TYPES.includes(value.toUpperCase());
    }

    /**
     * Creates a new SensoryTrackType instance.
     *
     * @param {string} value - The type ("MOTION", "WIND", "WATER", or "VIBRATION").
     * @throws {Error} If the provided value is not a valid type.
     */
    constructor(value) {
        if (!SensoryTrackType.isValidType(value)) {
            throw new Error(`Invalid sensory track type: ${value}`);
        }
        this.#value = value.toUpperCase();
        Object.freeze(this);
    }

    /** @returns {string} The primitive value of the type. */
    valueOf() {
        return this.#value;
    }

    /** @returns {string} The string representation of the type. */
    toString() {
        return this.#value;
    }

    /** @returns {boolean} True if the track drives seat motion. */
    isMotion() {
        return this.#value === 'MOTION';
    }

    /** @returns {boolean} True if the track drives a wind effect. */
    isWind() {
        return this.#value === 'WIND';
    }

    /** @returns {boolean} True if the track drives a water effect. */
    isWater() {
        return this.#value === 'WATER';
    }

    /** @returns {boolean} True if the track drives a vibration effect. */
    isVibration() {
        return this.#value === 'VIBRATION';
    }

    /**
     * Checks for equality with another SensoryTrackType instance.
     *
     * @param {SensoryTrackType} other - The other type to compare.
     * @returns {boolean}
     */
    equals(other) {
        return other instanceof SensoryTrackType && this.#value === other.valueOf();
    }

    /** @returns {SensoryTrackType} Factory for MOTION. */
    static motion() {
        return new SensoryTrackType('MOTION');
    }

    /** @returns {SensoryTrackType} Factory for WIND. */
    static wind() {
        return new SensoryTrackType('WIND');
    }

    /** @returns {SensoryTrackType} Factory for WATER. */
    static water() {
        return new SensoryTrackType('WATER');
    }

    /** @returns {SensoryTrackType} Factory for VIBRATION. */
    static vibration() {
        return new SensoryTrackType('VIBRATION');
    }
}