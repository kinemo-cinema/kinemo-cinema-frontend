const VALID_STATUSES = Object.freeze([
    "ACTIVATED",
    "CONFIRMED",
    "ATTENDED",
    "RESOLVED"
]);

export class EmergencyStatus {

    #value;

    constructor(value) {
        const normalized = String(value ?? "").toUpperCase();

        if (!VALID_STATUSES.includes(normalized)) {
            throw new Error(`Invalid emergency status: ${value}`);
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

    isActivated() {
        return this.#value === "ACTIVATED";
    }

    isConfirmed() {
        return this.#value === "CONFIRMED";
    }

    isAttended() {
        return this.#value === "ATTENDED";
    }

    isResolved() {
        return this.#value === "RESOLVED";
    }

    static activated() {
        return new EmergencyStatus("ACTIVATED");
    }

    static confirmed() {
        return new EmergencyStatus("CONFIRMED");
    }

    static attended() {
        return new EmergencyStatus("ATTENDED");
    }

    static resolved() {
        return new EmergencyStatus("RESOLVED");
    }
}