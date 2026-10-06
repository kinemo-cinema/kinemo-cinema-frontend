import { SyncStatus } from './sync-status.value-object.js';

/**
 * Represents a synchronization attempt performed between Kinemo
 * and an external ticketing provider.
 */
export class SyncLog {

    /**
     * Creates a new SyncLog entity.
     *
     * @param {Object} props
     * @param {string|null} [props.syncLogId] - Unique identifier of the synchronization log.
     * @param {string|null} [props.showId] - Identifier of the synchronized show.
     * @param {Date|string|null} [props.executedAt] - Date and time when synchronization was executed.
     * @param {SyncStatus|string|null} [props.status] - Current synchronization status.
     * @param {string} [props.errorDetails] - Details of the synchronization error.
     */
    constructor({
                    syncLogId = null,
                    showId = null,
                    executedAt = null,
                    status = null,
                    errorDetails = ''
                } = {}) {
        this._syncLogId = syncLogId;
        this._showId = showId;

        this._executedAt = executedAt instanceof Date
            ? executedAt
            : executedAt
                ? new Date(executedAt)
                : new Date();

        this._status = status instanceof SyncStatus
            ? status
            : new SyncStatus(status ?? 'PENDING');

        this._errorDetails = errorDetails;
    }

    // --------------------------------------------------------------------
    // Identity & attributes
    // --------------------------------------------------------------------

    /**
     * Returns the synchronization log identifier.
     *
     * @returns {string|null}
     */
    getId() {
        return this._syncLogId;
    }

    /**
     * Returns the show identifier.
     *
     * @returns {string|null}
     */
    getShowId() {
        return this._showId;
    }

    /**
     * Returns the date and time when synchronization was executed.
     *
     * @returns {Date}
     */
    getExecutedAt() {
        return this._executedAt;
    }

    /**
     * Returns the synchronization status.
     *
     * @returns {SyncStatus}
     */
    getStatus() {
        return this._status;
    }

    /**
     * Returns the synchronization status as a string.
     *
     * @returns {string}
     */
    getStatusAsString() {
        return this._status.toString();
    }

    /**
     * Returns synchronization error details.
     *
     * @returns {string}
     */
    getErrorDetails() {
        return this._errorDetails;
    }

    // --------------------------------------------------------------------
    // Synchronization lifecycle
    // --------------------------------------------------------------------

    /**
     * Marks the synchronization as successful.
     *
     * @returns {void}
     */
    markSuccessful() {
        this._status = SyncStatus.successful();
        this._errorDetails = '';
    }

    /**
     * Marks the synchronization as incomplete.
     *
     * @returns {void}
     */
    markIncomplete() {
        this._status = SyncStatus.incomplete();
    }

    /**
     * Marks the synchronization as failed.
     *
     * @param {string} details - Details describing the synchronization failure.
     * @returns {void}
     */
    markFailed(details) {
        if (!details || !String(details).trim()) {
            throw new Error(
                'Error details are required when synchronization fails.'
            );
        }

        this._status = SyncStatus.failed();
        this._errorDetails = String(details).trim();
    }
}