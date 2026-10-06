const VALID_STATUSES = Object.freeze([
    "PENDING",
    "SYNCHRONIZED",
    "READY",
    "CLOSED"
]);

export class AllocationStatus {

    #value;

    constructor(value) {
        const normalized = String(value ?? "").toUpperCase();

        if (!VALID_STATUSES.includes(normalized)) {
            throw new Error(`Invalid allocation status: ${value}`);
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
        return other instanceof AllocationStatus
            && this.#value === other.valueOf();
    }

    isPending() {
        return this.#value === "PENDING";
    }

    isSynchronized() {
        return this.#value === "SYNCHRONIZED";
    }

    isReady() {
        return this.#value === "READY";
    }

    isClosed() {
        return this.#value === "CLOSED";
    }

    static pending() {
        return new AllocationStatus("PENDING");
    }

    static synchronized() {
        return new AllocationStatus("SYNCHRONIZED");
    }

    static ready() {
        return new AllocationStatus("READY");
    }

    static closed() {
        return new AllocationStatus("CLOSED");
    }
}