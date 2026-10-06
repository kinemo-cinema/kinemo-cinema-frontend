import {ConnectionStatus} from './connection-status.value-object.js';

/**
 * @class TicketingIntegration
 * @summary Aggregate root representing the connection between Kinemo
 * and an external ticketing provider.
 *
 * The aggregate controls the lifecycle of the external ticketing
 * connection and coordinates synchronization requests for cinema shows.
 */
export class TicketingIntegration {

    /**
     * Creates a new TicketingIntegration aggregate.
     *
     * @param {Object} props
     * @param {string|null} [props.integrationId] - Unique identifier of the integration.
     * @param {string|null} [props.cinemaId] - Identifier of the cinema that owns the integration.
     * @param {string} [props.providerName] - Name of the external ticketing provider.
     * @param {ConnectionStatus|string|null} [props.status] - Current connection status.
     */
    constructor({
                    integrationId = null,
                    cinemaId = null,
                    providerName = '',
                    status = null
                } = {}) {
        this._integrationId = integrationId;
        this._cinemaId = cinemaId;
        this._providerName = providerName;

        this._status = status instanceof ConnectionStatus
            ? status
            : new ConnectionStatus(status ?? 'DISCONNECTED');
    }

    // --------------------------------------------------------------------
    // Identity & scalar attributes
    // --------------------------------------------------------------------

    /**
     * Returns the integration identifier.
     *
     * @returns {string|null}
     */
    getId = () => this._integrationId;

    /**
     * Returns the cinema identifier.
     *
     * @returns {string|null}
     */
    getCinemaId = () => this._cinemaId;

    /**
     * Returns the external ticketing provider name.
     *
     * @returns {string}
     */
    getProviderName = () => this._providerName;

    /**
     * Returns the current connection status.
     *
     * @returns {ConnectionStatus}
     */
    getStatus = () => this._status;

    /**
     * Returns the connection status as a string.
     *
     * @returns {string}
     */
    getStatusAsString = () => this._status.toString();

    // --------------------------------------------------------------------
    // Connection lifecycle
    // --------------------------------------------------------------------

    /**
     * Establishes the connection with the external ticketing provider.
     *
     * @returns {void}
     * @throws {Error} If the integration is already connected.
     */
    connect() {
        if (this.isConnected()) {
            throw new Error('Ticketing integration is already connected.');
        }

        this._status = ConnectionStatus.connected();
    }

    /**
     * Disconnects the external ticketing provider.
     *
     * @returns {void}
     * @throws {Error} If the integration is already disconnected.
     */
    disconnect() {
        if (this._status.isDisconnected()) {
            throw new Error('Ticketing integration is already disconnected.');
        }

        this._status = ConnectionStatus.disconnected();
    }

    /**
     * Starts a reconnection attempt.
     *
     * @returns {void}
     */
    reconnect() {
        this._status = ConnectionStatus.reconnecting();
    }

    /**
     * Determines whether the integration is currently connected.
     *
     * @returns {boolean}
     */
    isConnected() {
        return this._status.isConnected();
    }

    // --------------------------------------------------------------------
    // Synchronization
    // --------------------------------------------------------------------

    /**
     * Validates whether synchronization can be performed for a show.
     *
     * The actual communication with the external provider belongs to
     * infrastructure. The aggregate only enforces the domain rule that
     * synchronization requires an active connection.
     *
     * @param {string} showId - Identifier of the show to synchronize.
     * @returns {void}
     * @throws {Error} If no show identifier is provided or the provider
     * is not connected.
     */
    synchronize(showId) {
        if (!showId) {
            throw new Error('A show identifier is required.');
        }

        if (!this.isConnected()) {
            throw new Error(
                'Ticketing integration must be connected before synchronization.'
            );
        }
    }
}