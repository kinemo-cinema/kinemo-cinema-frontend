/**
 * Represents the occupancy information synchronized for a show.
 */
export class ShowOccupancy {

    constructor({
                    id = null,
                    showId = null,
                    lastSyncLogId = null,
                    totalCapacity = 0,
                    occupiedSeats = 0,
                    lastUpdatedAt = null
                } = {}) {

        this._id =
            id !== null ? Number(id) : null;

        this._showId =
            showId !== null ? Number(showId) : null;

        this._lastSyncLogId =
            lastSyncLogId !== null
                ? Number(lastSyncLogId)
                : null;

        this._totalCapacity =
            Number(totalCapacity);

        this._occupiedSeats =
            Number(occupiedSeats);

        this._lastUpdatedAt =
            lastUpdatedAt instanceof Date
                ? lastUpdatedAt
                : lastUpdatedAt
                    ? new Date(lastUpdatedAt)
                    : null;

        this._validateOccupancy();
    }

    getId() {
        return this._id;
    }

    getShowId() {
        return this._showId;
    }

    getLastSyncLogId() {
        return this._lastSyncLogId;
    }

    getTotalCapacity() {
        return this._totalCapacity;
    }

    getOccupiedSeats() {
        return this._occupiedSeats;
    }

    getAvailableSeats() {
        return (
            this._totalCapacity -
            this._occupiedSeats
        );
    }

    getLastUpdatedAt() {
        return this._lastUpdatedAt;
    }

    getOccupancyPercentage() {
        if (this._totalCapacity === 0) {
            return 0;
        }

        return (
            this._occupiedSeats /
            this._totalCapacity
        ) * 100;
    }

    updateOccupancy(
        occupiedSeats,
        lastSyncLogId = null
    ) {
        const normalizedOccupiedSeats =
            Number(occupiedSeats);

        if (
            !Number.isInteger(
                normalizedOccupiedSeats
            ) ||
            normalizedOccupiedSeats < 0
        ) {
            throw new Error(
                'Occupied seats must be a non-negative integer.'
            );
        }

        if (
            normalizedOccupiedSeats >
            this._totalCapacity
        ) {
            throw new Error(
                'Occupied seats cannot exceed total capacity.'
            );
        }

        this._occupiedSeats =
            normalizedOccupiedSeats;

        if (lastSyncLogId !== null) {
            this._lastSyncLogId =
                Number(lastSyncLogId);
        }

        this._lastUpdatedAt =
            new Date();
    }

    updateTotalCapacity(totalCapacity) {
        const normalizedCapacity =
            Number(totalCapacity);

        if (
            !Number.isInteger(
                normalizedCapacity
            ) ||
            normalizedCapacity < 0
        ) {
            throw new Error(
                'Total capacity must be a non-negative integer.'
            );
        }

        if (
            normalizedCapacity <
            this._occupiedSeats
        ) {
            throw new Error(
                'Total capacity cannot be lower than occupied seats.'
            );
        }

        this._totalCapacity =
            normalizedCapacity;

        this._lastUpdatedAt =
            new Date();
    }

    _validateOccupancy() {
        if (
            !Number.isInteger(
                this._totalCapacity
            ) ||
            this._totalCapacity < 0
        ) {
            throw new Error(
                'Total capacity must be a non-negative integer.'
            );
        }

        if (
            !Number.isInteger(
                this._occupiedSeats
            ) ||
            this._occupiedSeats < 0
        ) {
            throw new Error(
                'Occupied seats must be a non-negative integer.'
            );
        }

        if (
            this._occupiedSeats >
            this._totalCapacity
        ) {
            throw new Error(
                'Occupied seats cannot exceed total capacity.'
            );
        }
    }
}