import {DateTime} from '../../../shared/domain/model/date-time.js';
import {Duration} from '../../../shared/domain/model/duration.js';

/**
 * @class ShowSchedule
 * @summary Value object representing the time window of a show. Wraps a
 * start and end `DateTime`, guarantees start-before-end ordering, and
 * exposes overlap and duration queries.
 */
export class ShowSchedule {

    /** @type {DateTime} */
    #startDateTime;

    /** @type {DateTime} */
    #endDateTime;

    /**
     * Checks if two DateTime values form a valid schedule window.
     * A schedule is valid when both values parse as dates and the
     * start strictly precedes the end.
     *
     * @param {DateTime|string} start - The start date-time.
     * @param {DateTime|string} end - The end date-time.
     * @returns {boolean} True if the pair forms a valid window.
     */
    static isValidWindow(start, end) {
        try {
            const startDate = start instanceof DateTime ? start : new DateTime(start);
            const endDate = end instanceof DateTime ? end : new DateTime(end);
            return startDate.valueOf() < endDate.valueOf();
        } catch (_) {
            return false;
        }
    }

    /**
     * Creates a new ShowSchedule instance.
     *
     * @param {DateTime|string} startDateTime - The start date-time.
     * @param {DateTime|string} endDateTime - The end date-time.
     * @throws {Error} If the pair does not form a valid schedule window.
     */
    constructor(startDateTime, endDateTime) {
        if (!ShowSchedule.isValidWindow(startDateTime, endDateTime)) {
            throw new Error('Invalid schedule: start must precede end');
        }
        this.#startDateTime = startDateTime instanceof DateTime
            ? startDateTime
            : new DateTime(startDateTime);
        this.#endDateTime = endDateTime instanceof DateTime
            ? endDateTime
            : new DateTime(endDateTime);
        Object.freeze(this);
    }

    /** @returns {DateTime} The start date-time. */
    getStart() {
        return this.#startDateTime;
    }

    /** @returns {DateTime} The end date-time. */
    getEnd() {
        return this.#endDateTime;
    }

    /** @returns {string} The start date-time as an ISO 8601 string. */
    getStartAsISO() {
        return this.#startDateTime.toISOString();
    }

    /** @returns {string} The end date-time as an ISO 8601 string. */
    getEndAsISO() {
        return this.#endDateTime.toISOString();
    }

    /**
     * Returns the length of the show window.
     *
     * @returns {Duration} The duration between start and end.
     */
    getDuration() {
        const seconds = (this.#endDateTime.valueOf() - this.#startDateTime.valueOf()) / 1000;
        return new Duration(seconds);
    }

    /**
     * Determines whether this schedule overlaps with another.
     * Two schedules overlap when each one starts before the other ends.
     * Touching windows (one ends exactly when the other starts) do not
     * count as overlapping, matching back-to-back scheduling.
     *
     * @param {ShowSchedule} other - The other schedule to compare.
     * @returns {boolean} True if the two windows overlap.
     * @throws {TypeError} If `other` is not a ShowSchedule instance.
     */
    overlaps(other) {
        if (!(other instanceof ShowSchedule)) {
            throw new TypeError('Expected a ShowSchedule instance');
        }
        return this.#startDateTime.valueOf() < other.getEnd().valueOf()
            && other.getStart().valueOf() < this.#endDateTime.valueOf();
    }

    /**
     * Determines whether the schedule window is entirely in the future.
     *
     * @returns {boolean} True if the start is in the future.
     */
    isInTheFuture() {
        return this.#startDateTime.isFuture();
    }

    /**
     * Determines whether the schedule window is entirely in the past.
     *
     * @returns {boolean} True if the end is in the past.
     */
    isInThePast() {
        return this.#endDateTime.valueOf() < Date.now();
    }

    /**
     * Determines whether the current time falls within the schedule.
     *
     * @returns {boolean} True if the schedule is currently active.
     */
    isCurrentlyActive() {
        const now = Date.now();
        return this.#startDateTime.valueOf() <= now && now < this.#endDateTime.valueOf();
    }

    /**
     * Checks for equality with another ShowSchedule instance.
     *
     * @param {ShowSchedule} other - The other schedule to compare.
     * @returns {boolean}
     */
    equals(other) {
        return other instanceof ShowSchedule
            && this.#startDateTime.valueOf() === other.getStart().valueOf()
            && this.#endDateTime.valueOf() === other.getEnd().valueOf();
    }

    /** @returns {string} A readable string representation. */
    toString() {
        return `${this.getStartAsISO()} → ${this.getEndAsISO()}`;
    }
}