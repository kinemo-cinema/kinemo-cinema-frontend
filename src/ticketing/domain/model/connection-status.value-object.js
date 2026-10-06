/**
 * Represents the connection status of a ticketing integration.
 */
export class ConnectionStatus {

    static CONNECTED = 'CONNECTED';
    static DISCONNECTED = 'DISCONNECTED';
    static RECONNECTING = 'RECONNECTING';

    #value;

    /**
     * Creates a new ConnectionStatus value object.
     *
     * @param {string} value - Connection status value.
     */
    constructor(value = ConnectionStatus.DISCONNECTED) {
        const normalizedValue = String(value).toUpperCase();

        if (!ConnectionStatus.isValid(normalizedValue)) {
            throw new Error(`Invalid connection status: ${value}`);
        }

        this.#value = normalizedValue;
    }

    /**
     * Gets the connection status value.
     *
     * @returns {string}
     */
    get value() {
        return this.#value;
    }

    /**
     * Determines whether the status is CONNECTED.
     *
     * @returns {boolean}
     */
    isConnected() {
        return this.#value === ConnectionStatus.CONNECTED;
    }

    /**
     * Determines whether the status is DISCONNECTED.
     *
     * @returns {boolean}
     */
    isDisconnected() {
        return this.#value === ConnectionStatus.DISCONNECTED;
    }

    /**
     * Determines whether the status is RECONNECTING.
     *
     * @returns {boolean}
     */
    isReconnecting() {
        return this.#value === ConnectionStatus.RECONNECTING;
    }

    /**
     * Returns a connected status instance.
     *
     * @returns {ConnectionStatus}
     */
    static connected() {
        return new ConnectionStatus(ConnectionStatus.CONNECTED);
    }

    /**
     * Returns a disconnected status instance.
     *
     * @returns {ConnectionStatus}
     */
    static disconnected() {
        return new ConnectionStatus(ConnectionStatus.DISCONNECTED);
    }

    /**
     * Returns a reconnecting status instance.
     *
     * @returns {ConnectionStatus}
     */
    static reconnecting() {
        return new ConnectionStatus(ConnectionStatus.RECONNECTING);
    }

    /**
     * Determines whether a status value is valid.
     *
     * @param {string} value - Value to validate.
     * @returns {boolean}
     */
    static isValid(value) {
        return [
            ConnectionStatus.CONNECTED,
            ConnectionStatus.DISCONNECTED,
            ConnectionStatus.RECONNECTING
        ].includes(value);
    }

    /**
     * Returns the connection status as a string.
     *
     * @returns {string}
     */
    toString() {
        return this.#value;
    }
}