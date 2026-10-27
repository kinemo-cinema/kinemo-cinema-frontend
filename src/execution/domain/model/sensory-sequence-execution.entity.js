import {SequenceStatus}
    from "./sequence-status.value-object.js";

export class SensorySequenceExecution {

    constructor({
                    id = null,
                    sensoryTrackId = null,
                    currentTimeCode = 0,
                    status = null
                } = {}) {

        this._id = id;
        this._sensoryTrackId = sensoryTrackId;
        this._currentTimeCode = Number(currentTimeCode);

        this._status = status instanceof SequenceStatus
            ? status
            : new SequenceStatus(status ?? "PENDING");
    }

    getId = () => this._id;

    getSensoryTrackId = () => this._sensoryTrackId;

    getCurrentTimeCode = () => this._currentTimeCode;

    getStatus = () => this._status;

    getStatusAsString = () => this._status.toString();

    start() {
        this._status = SequenceStatus.executing();
    }

    pause() {
        if (!this._status.isExecuting()) {
            throw new Error(
                "Only an executing sequence can be paused"
            );
        }

        this._status = SequenceStatus.paused();
    }

    resume() {
        if (!this._status.isPaused()) {
            throw new Error(
                "Only a paused sequence can be resumed"
            );
        }

        this._status = SequenceStatus.executing();
    }

    stop() {
        this._status = SequenceStatus.stopped();
    }

    complete() {
        this._status = SequenceStatus.completed();
    }

    synchronize(timeCode) {
        const value = Number(timeCode);

        if (!Number.isFinite(value) || value < 0) {
            throw new Error("Invalid time code");
        }

        this._currentTimeCode = value;
    }
}