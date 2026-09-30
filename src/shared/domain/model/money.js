const CURRENCY_REGEX = /^[A-Z]{3}$/;

export class Money{
    #amount;
    #currency;

    static isValidAmount(amount) {
        return typeof amount === 'number' && Number.isFinite(amount) && amount >= 0;
    }

    static isValidCurrency(currency) {
        return typeof currency === 'string' && CURRENCY_REGEX.test(currency);
    }

    constructor(amount, currency) {
        this.#amount = Money.isValidAmount(amount) ? Number(amount) : 0;
        this.#currency = Money.isValidCurrency(currency) ? currency : '';
        Object.freeze(this);
    }

    toString(){
        return `${this.#amount} ${this.#currency}`;
    }

    getCurrency(){
        return this.#currency;
    }

    getAmount(){
        return this.#amount;
    }

    add(other){
        if(other.getCurrency() !== this.#currency){
            throw new ReferenceError('Both amounts must be in the same currency');
        }

        const newAmount = other.getAmount() + this.#amount;

        return new Money(newAmount,this.#currency);
    }

    #assertMoney(value) {
        if (!(value instanceof Money)) {
            throw new TypeError('Expected a Money instance');
        }
    }

}