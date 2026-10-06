const VALID_SEVERITIES = Object.freeze([
    "INFO",
    "WARNING",
    "ERROR",
    "CRITICAL"
]);

export class LogSeverity {

    #value;

    constructor(value) {
        const normalized = String(value ?? "").toUpperCase();

        if (!VALID_SEVERITIES.includes(normalized)) {
            throw new Error(`Invalid log severity: ${value}`);
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

    static info() {
        return new LogSeverity("INFO");
    }

    static warning() {
        return new LogSeverity("WARNING");
    }

    static error() {
        return new LogSeverity("ERROR");
    }

    static critical() {
        return new LogSeverity("CRITICAL");
    }
}