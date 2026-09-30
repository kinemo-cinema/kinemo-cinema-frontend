const CURRENCY_REGEX = /^[A-Z]{3}$/;

/**
 * Value object representing a monetary amount in a specific currency.
 *
 * @remarks
 * This value object pairs a non-negative numeric amount with an ISO 4217
 * three-letter currency code. It is immutable and enforces currency
 * consistency during arithmetic operations. Operations between Money
 * instances require the same currency; otherwise an error is thrown.
 */
export class Money {
    /** @type {number} */
    #amount;

    /** @type {string} */
    #currency;

    /**
     * Validates if a value is a valid monetary amount.
     *
     * @param {number} amount - The amount to validate.
     * @returns {boolean} True if the amount is a non-negative finite number, false otherwise.
     */
    static isValidAmount(amount) {
        return typeof amount === 'number' && Number.isFinite(amount) && amount >= 0;
    }

    /**
     * Validates if a value is a valid ISO 4217 currency code.
     *
     * @param {string} currency - The currency code to validate.
     * @returns {boolean} True if the currency is a 3-letter uppercase code, false otherwise.
     */
    static isValidCurrency(currency) {
        return typeof currency === 'string' && CURRENCY_REGEX.test(currency);
    }

    /**
     * Creates a new Money instance.
     *
     * @param {number} amount - The monetary amount.
     * @param {string} currency - The ISO 4217 currency code.
     */
    constructor(amount, currency) {
        this.#amount = Money.isValidAmount(amount) ? Number(amount) : 0;
        this.#currency = Money.isValidCurrency(currency) ? currency : '';
        Object.freeze(this);
    }

    /**
     * Returns the string representation of the Money.
     * @returns {string}
     */
    toString() {
        return `${this.#amount} ${this.#currency}`;
    }

    /**
     * Returns the currency code of the Money.
     * @returns {string}
     */
    getCurrency() {
        return this.#currency;
    }

    /**
     * Returns the numeric amount of the Money.
     * @returns {number}
     */
    getAmount() {
        return this.#amount;
    }

    /**
     * Adds another Money instance to this one.
     *
     * @param {Money} other - The Money to add.
     * @returns {Money} A new Money instance with the summed amount.
     * @throws {ReferenceError} If the two instances have different currencies.
     */
    add(other) {


        if (other.getCurrency() !== this.#currency) {
            throw new ReferenceError('Both amounts must be in the same currency');
        }

        const newAmount = other.getAmount() + this.#amount;

        return new Money(newAmount, this.#currency);
    }

    /**
     * Asserts that a value is a Money instance.
     *
     * @param {*} value - The value to check.
     * @throws {TypeError} If the value is not a Money instance.
     */
    #assertMoney(value) {
        if (!(value instanceof Money)) {
            throw new TypeError('Expected a Money instance');
        }
    }
}