import {ConnectionStatus} from './connection-status.value-object.js';

/**
 * Represents the connection between Kinemo and an external
 * ticketing system.
 */
export class TicketingIntegration {

    constructor({
                    id = null,
                    systemName = '',
                    endpointUrl = '',
                    connectionStatus = 'AVAILABLE',
                    lastVerifiedAt = null
                } = {}) {

        this._id =
            id !== null ? Number(id) : null;

        this._systemName =
            String(systemName).trim();

        this._endpointUrl =
            String(endpointUrl).trim();

        this._connectionStatus =
            connectionStatus instanceof ConnectionStatus
                ? connectionStatus
                : new ConnectionStatus(connectionStatus);

        this._lastVerifiedAt =
            lastVerifiedAt instanceof Date
                ? lastVerifiedAt
                : lastVerifiedAt
                    ? new Date(lastVerifiedAt)
                    : null;
    }

    getId() {
        return this._id;
    }

    getSystemName() {
        return this._systemName;
    }

    getEndpointUrl() {
        return this._endpointUrl;
    }

    getConnectionStatus() {
        return this._connectionStatus;
    }

    getConnectionStatusAsString() {
        return this._connectionStatus.toString();
    }

    getLastVerifiedAt() {
        return this._lastVerifiedAt;
    }

    isAvailable() {
        return this._connectionStatus.isAvailable();
    }

    isReconnecting() {
        return this._connectionStatus.isReconnecting();
    }

    isUnavailable() {
        return this._connectionStatus.isUnavailable();
    }

    markAvailable() {
        this._connectionStatus =
            ConnectionStatus.available();

        this._lastVerifiedAt =
            new Date();
    }

    markReconnecting() {
        this._connectionStatus =
            ConnectionStatus.reconnecting();
    }

    markUnavailable() {
        this._connectionStatus =
            ConnectionStatus.unavailable();
    }
}