const VALID_STATUSES = Object.freeze([
    "PENDING",
    "EXECUTING",
    "PAUSED",
    "STOPPED",
    "COMPLETED"
]);

export class SequenceStatus {

    #value;

    constructor(value) {
        const normalized = String(value ?? "").toUpperCase();

        if (!VALID_STATUSES.includes(normalized)) {
            throw new Error(`Invalid sequence status: ${value}`);
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

    isPending() {
        return this.#value === "PENDING";
    }

    isExecuting() {
        return this.#value === "EXECUTING";
    }

    isPaused() {
        return this.#value === "PAUSED";
    }

    isStopped() {
        return this.#value === "STOPPED";
    }

    isCompleted() {
        return this.#value === "COMPLETED";
    }

    static pending() {
        return new SequenceStatus("PENDING");
    }

    static executing() {
        return new SequenceStatus("EXECUTING");
    }

    static paused() {
        return new SequenceStatus("PAUSED");
    }

    static stopped() {
        return new SequenceStatus("STOPPED");
    }

    static completed() {
        return new SequenceStatus("COMPLETED");
    }
}