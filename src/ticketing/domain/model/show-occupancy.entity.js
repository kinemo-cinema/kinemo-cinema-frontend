/**
 * Represents the synchronized occupancy information of a cinema show.
 */
export class ShowOccupancy {

    /**
     * Creates a new ShowOccupancy entity.
     *
     * @param {Object} props
     * @param {string|null} [props.occupancyId] - Unique identifier of the occupancy record.
     * @param {string|null} [props.showId] - Identifier of the show.
     * @param {number} [props.totalSeats] - Total number of seats for the show.
     * @param {number} [props.occupiedSeats] - Number of occupied seats.
     * @param {Date|string|null} [props.lastUpdatedAt] - Last synchronization date and time.
     */
    constructor({
                    occupancyId = null,
                    showId = null,
                    totalSeats = 0,
                    occupiedSeats = 0,
                    lastUpdatedAt = null
                } = {}) {
        this._occupancyId = occupancyId;
        this._showId = showId;
        this._totalSeats = Number(totalSeats);
        this._occupiedSeats = Number(occupiedSeats);

        this._lastUpdatedAt = lastUpdatedAt instanceof Date
            ? lastUpdatedAt
            : lastUpdatedAt
                ? new Date(lastUpdatedAt)
                : new Date();

        this.validateOccupancy();
    }

    // --------------------------------------------------------------------
    // Identity & attributes
    // --------------------------------------------------------------------

    /**
     * Returns the occupancy identifier.
     *
     * @returns {string|null}
     */
    getId() {
        return this._occupancyId;
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
     * Returns the total number of seats.
     *
     * @returns {number}
     */
    getTotalSeats() {
        return this._totalSeats;
    }

    /**
     * Returns the number of occupied seats.
     *
     * @returns {number}
     */
    getOccupiedSeats() {
        return this._occupiedSeats;
    }

    /**
     * Returns the number of available seats.
     *
     * @returns {number}
     */
    getAvailableSeats() {
        return this._totalSeats - this._occupiedSeats;
    }

    /**
     * Returns the last update date and time.
     *
     * @returns {Date}
     */
    getLastUpdatedAt() {
        return this._lastUpdatedAt;
    }

    /**
     * Returns the occupancy percentage.
     *
     * @returns {number}
     */
    getOccupancyPercentage() {
        if (this._totalSeats === 0) {
            return 0;
        }

        return (this._occupiedSeats / this._totalSeats) * 100;
    }

    // --------------------------------------------------------------------
    // Occupancy behavior
    // --------------------------------------------------------------------

    /**
     * Updates the number of occupied seats.
     *
     * @param {number} occupiedSeats - New number of occupied seats.
     * @returns {void}
     */
    updateOccupancy(occupiedSeats) {
        const newOccupiedSeats = Number(occupiedSeats);

        if (!Number.isInteger(newOccupiedSeats) || newOccupiedSeats < 0) {
            throw new Error(
                'Occupied seats must be a non-negative integer.'
            );
        }

        if (newOccupiedSeats > this._totalSeats) {
            throw new Error(
                'Occupied seats cannot exceed total seats.'
            );
        }

        this._occupiedSeats = newOccupiedSeats;
        this._lastUpdatedAt = new Date();
    }

    /**
     * Updates the total number of seats.
     *
     * @param {number} totalSeats - New total number of seats.
     * @returns {void}
     */
    updateTotalSeats(totalSeats) {
        const newTotalSeats = Number(totalSeats);

        if (!Number.isInteger(newTotalSeats) || newTotalSeats < 0) {
            throw new Error(
                'Total seats must be a non-negative integer.'
            );
        }

        if (newTotalSeats < this._occupiedSeats) {
            throw new Error(
                'Total seats cannot be lower than occupied seats.'
            );
        }

        this._totalSeats = newTotalSeats;
        this._lastUpdatedAt = new Date();
    }

    // --------------------------------------------------------------------
    // Validation
    // --------------------------------------------------------------------

    /**
     * Validates occupancy values.
     *
     * @private
     * @returns {void}
     */
    validateOccupancy() {
        if (!Number.isInteger(this._totalSeats) || this._totalSeats < 0) {
            throw new Error(
                'Total seats must be a non-negative integer.'
            );
        }

        if (
            !Number.isInteger(this._occupiedSeats) ||
            this._occupiedSeats < 0
        ) {
            throw new Error(
                'Occupied seats must be a non-negative integer.'
            );
        }

        if (this._occupiedSeats > this._totalSeats) {
            throw new Error(
                'Occupied seats cannot exceed total seats.'
            );
        }
    }
}