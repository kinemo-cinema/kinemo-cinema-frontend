const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LENGTH = 254;

/**
 * Value object representing a normalized email address.
 *
 * @remarks
 * This value object ensures that email addresses are well-formed and
 * normalizes them to lowercase with surrounding whitespace trimmed. It is
 * immutable and provides equality checks based on the normalized value.
 */
export class Email {
    /** @type {string} */
    #value;

    /**
     * Validates if a string is a well-formed email address.
     *
     * @param {string} email - The email string to validate.
     * @returns {boolean} True if the email is valid, false otherwise.
     */
    static isValidEmail(email) {
        if (typeof email !== 'string') return false;
        const normalized = email.trim().toLowerCase();
        return normalized.length > 0
            && normalized.length <= MAX_LENGTH
            && EMAIL_REGEX.test(normalized);
    }

    /**
     * Creates a new Email instance.
     *
     * @param {string} value - The email address.
     */
    constructor(value) {
        this.#value = Email.isValidEmail(value) ? value.trim().toLowerCase() : '';
        Object.freeze(this);
    }

    /**
     * Returns the string representation of the Email.
     * @returns {string}
     */
    toString() {
        return this.#value;
    }

    /**
     * Returns the local part of the email (before the @).
     * @returns {string}
     */
    getLocalPart() {
        return this.#value.split('@')[0] || '';
    }

    /**
     * Returns the domain part of the email (after the @).
     * @returns {string}
     */
    getDomain() {
        return this.#value.split('@')[1] || '';
    }

    /**
     * Checks if the email is empty.
     * @returns {boolean}
     */
    isEmpty() {
        return this.#value === '';
    }

    /**
     * Checks for equality with another Email instance.
     *
     * @param {Email} other - The other Email to compare.
     * @returns {boolean}
     */
    equals(other) {
        return other instanceof Email && this.#value === other.toString();
    }
}