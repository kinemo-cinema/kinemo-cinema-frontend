import {DateTime}
    from "../../../shared/domain/model/date-time.js";

import {EmergencyStatus}
    from "./emergency-status.value-object.js";

export class EmergencyEvent {

    constructor({
                    id = null,
                    reason = "",
                    triggeredAt = null,
                    resolvedAt = null,
                    status = null
                } = {}) {

        this._id = id;
        this._reason = reason;

        this._triggeredAt = triggeredAt
            ? (
                triggeredAt instanceof DateTime
                    ? triggeredAt
                    : new DateTime(triggeredAt)
            )
            : null;

        this._resolvedAt = resolvedAt
            ? (
                resolvedAt instanceof DateTime
                    ? resolvedAt
                    : new DateTime(resolvedAt)
            )
            : null;

        this._status = status instanceof EmergencyStatus
            ? status
            : new EmergencyStatus(
                status ?? "ACTIVATED"
            );
    }

    getId = () => this._id;

    getReason = () => this._reason;

    getTriggeredAt = () => this._triggeredAt;

    getResolvedAt = () => this._resolvedAt;

    getStatus = () => this._status;

    getStatusAsString = () =>
        this._status.toString();

    getTriggeredAtFormatted = () =>
        this._triggeredAt?.toISOString() ?? null;

    getResolvedAtFormatted = () =>
        this._resolvedAt?.toISOString() ?? null;

    trigger() {
        if (!this._reason.trim()) {
            throw new Error(
                "Emergency event requires a reason"
            );
        }

        this._triggeredAt = DateTime.now();
        this._status = EmergencyStatus.activated();
    }

    confirm() {
        if (!this._status.isActivated()) {
            throw new Error(
                "Only an activated emergency can be confirmed"
            );
        }

        this._status = EmergencyStatus.confirmed();
    }

    attend() {
        if (
            !this._status.isActivated() &&
            !this._status.isConfirmed()
        ) {
            throw new Error(
                "Emergency cannot be attended"
            );
        }

        this._status = EmergencyStatus.attended();
    }

    resolve() {
        if (this._status.isResolved()) {
            throw new Error(
                "Emergency is already resolved"
            );
        }

        this._resolvedAt = DateTime.now();
        this._status = EmergencyStatus.resolved();
    }
}