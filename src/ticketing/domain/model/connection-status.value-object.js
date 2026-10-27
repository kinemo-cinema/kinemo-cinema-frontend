/**
 * Represents the connection status of an external ticketing system.
 */
export class ConnectionStatus {

    static AVAILABLE = 'AVAILABLE';
    static RECONNECTING = 'RECONNECTING';
    static UNAVAILABLE = 'UNAVAILABLE';

    #value;

    constructor(value = ConnectionStatus.AVAILABLE) {
        const normalizedValue =
            String(value).toUpperCase();

        if (!ConnectionStatus.isValid(normalizedValue)) {
            throw new Error(
                `Invalid connection status: ${value}`
            );
        }

        this.#value = normalizedValue;
    }

    get value() {
        return this.#value;
    }

    isAvailable() {
        return this.#value === ConnectionStatus.AVAILABLE;
    }

    isReconnecting() {
        return this.#value === ConnectionStatus.RECONNECTING;
    }

    isUnavailable() {
        return this.#value === ConnectionStatus.UNAVAILABLE;
    }

    static available() {
        return new ConnectionStatus(
            ConnectionStatus.AVAILABLE
        );
    }

    static reconnecting() {
        return new ConnectionStatus(
            ConnectionStatus.RECONNECTING
        );
    }

    static unavailable() {
        return new ConnectionStatus(
            ConnectionStatus.UNAVAILABLE
        );
    }

    static isValid(value) {
        return [
            ConnectionStatus.AVAILABLE,
            ConnectionStatus.RECONNECTING,
            ConnectionStatus.UNAVAILABLE
        ].includes(value);
    }

    toString() {
        return this.#value;
    }
}