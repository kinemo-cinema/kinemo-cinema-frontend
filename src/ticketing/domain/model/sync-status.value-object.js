export class SyncStatus {

    static PENDING = 'PENDING';
    static IN_PROGRESS = 'IN_PROGRESS';
    static COMPLETED = 'COMPLETED';
    static FAILED = 'FAILED';

    #value;

    constructor(value = SyncStatus.PENDING) {
        const normalizedValue =
            String(value).toUpperCase();

        if (!SyncStatus.isValid(normalizedValue)) {
            throw new Error(
                `Invalid synchronization status: ${value}`
            );
        }

        this.#value = normalizedValue;
    }

    get value() {
        return this.#value;
    }

    isPending() {
        return this.#value === SyncStatus.PENDING;
    }

    isInProgress() {
        return this.#value === SyncStatus.IN_PROGRESS;
    }

    isCompleted() {
        return this.#value === SyncStatus.COMPLETED;
    }

    isFailed() {
        return this.#value === SyncStatus.FAILED;
    }

    static pending() {
        return new SyncStatus(
            SyncStatus.PENDING
        );
    }

    static inProgress() {
        return new SyncStatus(
            SyncStatus.IN_PROGRESS
        );
    }

    static completed() {
        return new SyncStatus(
            SyncStatus.COMPLETED
        );
    }

    static failed() {
        return new SyncStatus(
            SyncStatus.FAILED
        );
    }

    static isValid(value) {
        return [
            SyncStatus.PENDING,
            SyncStatus.IN_PROGRESS,
            SyncStatus.COMPLETED,
            SyncStatus.FAILED
        ].includes(value);
    }

    toString() {
        return this.#value;
    }
}