import {SyncStatus} from './sync-status.value-object.js';

/**
 * Represents a synchronization process executed between Kinemo
 * and an external ticketing connection.
 */
export class SyncLog {

    constructor({
                    id = null,
                    connectionId = null,
                    operatorId = null,
                    syncStatus = 'PENDING',
                    recordsProcessed = 0,
                    startedAt = null,
                    completedAt = null,
                    errorDetails = null
                } = {}) {

        this._id =
            id !== null ? Number(id) : null;

        this._connectionId =
            connectionId !== null
                ? Number(connectionId)
                : null;

        this._operatorId =
            operatorId !== null
                ? Number(operatorId)
                : null;

        this._syncStatus =
            syncStatus instanceof SyncStatus
                ? syncStatus
                : new SyncStatus(syncStatus);

        this._recordsProcessed =
            Number(recordsProcessed);

        if (
            !Number.isInteger(this._recordsProcessed) ||
            this._recordsProcessed < 0
        ) {
            throw new Error(
                'Records processed must be a non-negative integer.'
            );
        }

        this._startedAt =
            startedAt instanceof Date
                ? startedAt
                : startedAt
                    ? new Date(startedAt)
                    : null;

        this._completedAt =
            completedAt instanceof Date
                ? completedAt
                : completedAt
                    ? new Date(completedAt)
                    : null;

        this._errorDetails =
            errorDetails;
    }

    getId() {
        return this._id;
    }

    getConnectionId() {
        return this._connectionId;
    }

    getOperatorId() {
        return this._operatorId;
    }

    getSyncStatus() {
        return this._syncStatus;
    }

    getStatusAsString() {
        return this._syncStatus.toString();
    }

    getRecordsProcessed() {
        return this._recordsProcessed;
    }

    getStartedAt() {
        return this._startedAt;
    }

    getCompletedAt() {
        return this._completedAt;
    }

    getErrorDetails() {
        return this._errorDetails;
    }

    markCompleted(recordsProcessed = 0) {
        const normalizedRecords =
            Number(recordsProcessed);

        if (
            !Number.isInteger(normalizedRecords) ||
            normalizedRecords < 0
        ) {
            throw new Error(
                'Records processed must be a non-negative integer.'
            );
        }

        this._syncStatus =
            SyncStatus.completed();

        this._recordsProcessed =
            normalizedRecords;

        this._completedAt =
            new Date();

        this._errorDetails =
            null;
    }

    markFailed(errorDetails) {
        if (
            !errorDetails ||
            !String(errorDetails).trim()
        ) {
            throw new Error(
                'Error details are required when synchronization fails.'
            );
        }

        this._syncStatus =
            SyncStatus.failed();

        this._completedAt =
            new Date();

        this._errorDetails =
            String(errorDetails).trim();
    }

    markInProgress() {
        this._syncStatus =
            SyncStatus.inProgress();

        this._startedAt =
            new Date();

        this._completedAt =
            null;

        this._errorDetails =
            null;
    }
}