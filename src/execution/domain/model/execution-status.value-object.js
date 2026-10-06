const VALID_STATUSES = Object.freeze([
    "READY",
    "RUNNING",
    "PAUSED",
    "EMERGENCY_STOPPED",
    "COMPLETED"
]);

export class ExecutionStatus {

    #value;

    constructor(value) {
        const normalized = String(value ?? "").toUpperCase();

        if (!VALID_STATUSES.includes(normalized)) {
            throw new Error(`Invalid execution status: ${value}`);
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

    isReady() {
        return this.#value === "READY";
    }

    isRunning() {
        return this.#value === "RUNNING";
    }

    isPaused() {
        return this.#value === "PAUSED";
    }

    isEmergencyStopped() {
        return this.#value === "EMERGENCY_STOPPED";
    }

    isCompleted() {
        return this.#value === "COMPLETED";
    }

    static ready() {
        return new ExecutionStatus("READY");
    }

    static running() {
        return new ExecutionStatus("RUNNING");
    }

    static paused() {
        return new ExecutionStatus("PAUSED");
    }

    static emergencyStopped() {
        return new ExecutionStatus("EMERGENCY_STOPPED");
    }

    static completed() {
        return new ExecutionStatus("COMPLETED");
    }
}