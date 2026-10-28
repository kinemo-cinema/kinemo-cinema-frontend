export class LifecycleStatus {
    static WITHIN_LIMIT = 'WITHIN_LIMIT';
    static NEAR_LIMIT = 'NEAR_LIMIT';
    static EXCEEDED = 'EXCEEDED';
    static REPLACE_SUGGESTED = 'REPLACE_SUGGESTED';

    #value;

    constructor(value = LifecycleStatus.WITHIN_LIMIT) {
        const normalized = String(value).toUpperCase();

        if (!LifecycleStatus.isValid(normalized)) {
            throw new Error(`Invalid lifecycle status: ${value}`);
        }

        this.#value = normalized;
    }

    toString() {
        return this.#value;
    }

    static isValid(value) {
        return [
            LifecycleStatus.WITHIN_LIMIT,
            LifecycleStatus.NEAR_LIMIT,
            LifecycleStatus.EXCEEDED,
            LifecycleStatus.REPLACE_SUGGESTED
        ].includes(value);
    }
}