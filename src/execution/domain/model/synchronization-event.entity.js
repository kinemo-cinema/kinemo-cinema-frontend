import {DateTime}
    from "../../../shared/domain/model/date-time.js";

export class SynchronizationEvent {

    constructor({
                    id = null,
                    expectedTimeCode = 0,
                    actualTimeCode = 0,
                    driftMilliseconds = null,
                    occurredAt = null
                } = {}) {

        this._id = id;
        this._expectedTimeCode = Number(expectedTimeCode);
        this._actualTimeCode = Number(actualTimeCode);

        this._driftMilliseconds =
            driftMilliseconds !== null
                ? Number(driftMilliseconds)
                : this.calculateDrift();

        this._occurredAt = occurredAt instanceof DateTime
            ? occurredAt
            : new DateTime(occurredAt ?? new Date());
    }

    getId = () => this._id;

    getExpectedTimeCode = () => this._expectedTimeCode;

    getActualTimeCode = () => this._actualTimeCode;

    getDriftMilliseconds = () =>
        this._driftMilliseconds;

    getOccurredAt = () => this._occurredAt;

    getOccurredAtFormatted = () =>
        this._occurredAt.toISOString();

    calculateDrift() {
        return Math.abs(
            this._actualTimeCode -
            this._expectedTimeCode
        );
    }

    isWithinTolerance(tolerance = 100) {
        return this._driftMilliseconds <= tolerance;
    }
}