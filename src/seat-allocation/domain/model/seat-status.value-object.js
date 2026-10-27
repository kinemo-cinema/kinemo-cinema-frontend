const VALID_STATUSES = Object.freeze([
    "AVAILABLE",
    "SOLD",
    "ENABLED",
    "DISABLED",
    "OUT_OF_SERVICE"
]);

export class SeatStatus {

    #value;

    constructor(value) {
        const normalized = String(value ?? "").toUpperCase();

        if (!VALID_STATUSES.includes(normalized)) {
            throw new Error(`Invalid seat status: ${value}`);
        }

        this.#value = normalized;
        Object.freeze(this);
    }

    valueOf() {
        return this.#value;
    }

    toString() {
        return this.#value;
    }

    equals(other) {
        return other instanceof SeatStatus
            && this.#value === other.valueOf();
    }

    isAvailable() {
        return this.#value === "AVAILABLE";
    }

    isSold() {
        return this.#value === "SOLD";
    }

    isEnabled() {
        return this.#value === "ENABLED";
    }

    isDisabled() {
        return this.#value === "DISABLED";
    }

    isOutOfService() {
        return this.#value === "OUT_OF_SERVICE";
    }

    static available() {
        return new SeatStatus("AVAILABLE");
    }

    static sold() {
        return new SeatStatus("SOLD");
    }

    static enabled() {
        return new SeatStatus("ENABLED");
    }

    static disabled() {
        return new SeatStatus("DISABLED");
    }

    static outOfService() {
        return new SeatStatus("OUT_OF_SERVICE");
    }
}