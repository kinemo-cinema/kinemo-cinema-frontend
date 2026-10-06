import {DateTime}
    from "../../../shared/domain/model/date-time.js";

import {ExecutionStatus}
    from "./execution-status.value-object.js";

import {SensorySequenceExecution}
    from "./sensory-sequence-execution.entity.js";

import {SynchronizationEvent}
    from "./synchronization-event.entity.js";

import {HardwareExecutionLog}
    from "./hardware-execution-log.entity.js";

import {EmergencyEvent}
    from "./emergency-event.entity.js";

export class ShowExecution {

    constructor({
                    id = null,
                    showId = null,
                    sensoryContentId = null,
                    status = null,
                    startedAt = null,
                    finishedAt = null,
                    sequences = [],
                    synchronizationEvents = [],
                    hardwareLogs = [],
                    emergencyEvents = []
                } = {}) {

        this._id = id;
        this._showId = showId;
        this._sensoryContentId = sensoryContentId;

        this._status = status instanceof ExecutionStatus
            ? status
            : new ExecutionStatus(status ?? "READY");

        this._startedAt = startedAt
            ? (
                startedAt instanceof DateTime
                    ? startedAt
                    : new DateTime(startedAt)
            )
            : null;

        this._finishedAt = finishedAt
            ? (
                finishedAt instanceof DateTime
                    ? finishedAt
                    : new DateTime(finishedAt)
            )
            : null;

        this._sequences = sequences.filter(
            item => item instanceof SensorySequenceExecution
        );

        this._synchronizationEvents =
            synchronizationEvents.filter(
                item => item instanceof SynchronizationEvent
            );

        this._hardwareLogs = hardwareLogs.filter(
            item => item instanceof HardwareExecutionLog
        );

        this._emergencyEvents = emergencyEvents.filter(
            item => item instanceof EmergencyEvent
        );
    }

    getId = () => this._id;

    getShowId = () => this._showId;

    getSensoryContentId = () =>
        this._sensoryContentId;

    getStatus = () => this._status;

    getStatusAsString = () =>
        this._status.toString();

    getStartedAt = () => this._startedAt;

    getFinishedAt = () => this._finishedAt;

    getStartedAtFormatted = () =>
        this._startedAt?.toISOString() ?? null;

    getFinishedAtFormatted = () =>
        this._finishedAt?.toISOString() ?? null;

    getSequences = () => [...this._sequences];

    getSynchronizationEvents = () =>
        [...this._synchronizationEvents];

    getHardwareLogs = () =>
        [...this._hardwareLogs];

    getEmergencyEvents = () =>
        [...this._emergencyEvents];

    start() {
        if (!this._status.isReady()) {
            throw new Error(
                "Only a ready execution can be started"
            );
        }

        this._status = ExecutionStatus.running();
        this._startedAt = DateTime.now();

        this._sequences.forEach(sequence => {
            sequence.start();
        });
    }

    pause() {
        if (!this._status.isRunning()) {
            throw new Error(
                "Only a running execution can be paused"
            );
        }

        this._status = ExecutionStatus.paused();

        this._sequences
            .filter(sequence =>
                sequence.getStatus().isExecuting()
            )
            .forEach(sequence => sequence.pause());
    }

    resume() {
        if (!this._status.isPaused()) {
            throw new Error(
                "Only a paused execution can be resumed"
            );
        }

        this._status = ExecutionStatus.running();

        this._sequences
            .filter(sequence =>
                sequence.getStatus().isPaused()
            )
            .forEach(sequence => sequence.resume());
    }

    finish() {
        if (
            this._status.isCompleted() ||
            this._status.isEmergencyStopped()
        ) {
            throw new Error(
                "Execution cannot be completed in its current state"
            );
        }

        this._status = ExecutionStatus.completed();
        this._finishedAt = DateTime.now();

        this._sequences.forEach(sequence => {
            if (!sequence.getStatus().isCompleted()) {
                sequence.complete();
            }
        });
    }

    emergencyStop(reason) {
        if (this._status.isCompleted()) {
            throw new Error(
                "A completed execution cannot be emergency stopped"
            );
        }

        const emergency = new EmergencyEvent({
            reason
        });

        emergency.trigger();

        this._emergencyEvents.push(emergency);

        this._status =
            ExecutionStatus.emergencyStopped();

        this._sequences.forEach(sequence => {
            sequence.stop();
        });

        return emergency;
    }

    restore() {
        if (!this._status.isEmergencyStopped()) {
            throw new Error(
                "Execution is not emergency stopped"
            );
        }

        const activeEmergency =
            [...this._emergencyEvents]
                .reverse()
                .find(event =>
                    !event.getStatus().isResolved()
                );

        if (activeEmergency) {
            activeEmergency.resolve();
        }

        this._status = ExecutionStatus.paused();
    }

    addSequence(sequence) {
        if (!(sequence instanceof SensorySequenceExecution)) {
            throw new TypeError(
                "Expected a SensorySequenceExecution instance"
            );
        }

        this._sequences.push(sequence);
    }

    addSynchronizationEvent(event) {
        if (!(event instanceof SynchronizationEvent)) {
            throw new TypeError(
                "Expected a SynchronizationEvent instance"
            );
        }

        this._synchronizationEvents.push(event);
    }

    addHardwareLog(log) {
        if (!(log instanceof HardwareExecutionLog)) {
            throw new TypeError(
                "Expected a HardwareExecutionLog instance"
            );
        }

        this._hardwareLogs.push(log);
    }
}