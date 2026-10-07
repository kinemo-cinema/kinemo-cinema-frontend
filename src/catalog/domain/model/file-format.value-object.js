/**
 * @class FileFormat
 * @summary Value object representing the file format of an uploaded
 * sensory effects file.
 *
 * Valid formats:
 * - TRACK: Kinemo's proprietary sensory track format.
 */

const VALID_FORMATS = Object.freeze(['TRACK']);

export class FileFormat {

    /** @type {string} */
    #value;

    /**
     * Checks if a value is a valid file format.
     *
     * @param {string} value - The format to validate.
     * @returns {boolean} True if the value is one of the accepted formats.
     */
    static isValidFormat(value) {
        return typeof value === 'string' && VALID_FORMATS.includes(value.toUpperCase());
    }

    /**
     * Creates a new FileFormat instance.
     *
     * @param {string} value - The format value.
     * @throws {Error} If the provided value is not a valid format.
     */
    constructor(value) {
        if (!FileFormat.isValidFormat(value)) {
            throw new Error(`Invalid file format: ${value}`);
        }
        this.#value = value.toUpperCase();
        Object.freeze(this);
    }

    /** @returns {string} The primitive value of the format. */
    valueOf() {
        return this.#value;
    }

    /** @returns {string} The string representation of the format. */
    toString() {
        return this.#value;
    }

    /** @returns {boolean} True if the format is TRACK. */
    isTrack() {
        return this.#value === 'TRACK';
    }

    /**
     * Checks for equality with another FileFormat instance.
     *
     * @param {FileFormat} other - The other format to compare.
     * @returns {boolean}
     */
    equals(other) {
        return other instanceof FileFormat && this.#value === other.valueOf();
    }

    /** @returns {FileFormat} Factory for TRACK. */
    static track() {
        return new FileFormat('TRACK');
    }
}