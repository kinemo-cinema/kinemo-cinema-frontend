import {DateTime}
    from "../../../shared/domain/model/date-time.js";

import {LogSeverity}
    from "./log-severity.value-object.js";

export class HardwareExecutionLog {

    constructor({
                    id = null,
                    occurredAt = null,
                    message = "",
                    severity = null
                } = {}) {

        this._id = id;
        this._occurredAt = occurredAt instanceof DateTime
            ? occurredAt
            : new DateTime(occurredAt ?? new Date());

        this._message = message;

        this._severity = severity instanceof LogSeverity
            ? severity
            : new LogSeverity(severity ?? "INFO");
    }

    getId = () => this._id;

    getOccurredAt = () => this._occurredAt;

    getOccurredAtFormatted = () =>
        this._occurredAt.toISOString();

    getMessage = () => this._message;

    getSeverity = () => this._severity;

    getSeverityAsString = () =>
        this._severity.toString();

    register() {
        if (!this._message.trim()) {
            throw new Error(
                "Hardware execution log requires a message"
            );
        }

        return true;
    }
}