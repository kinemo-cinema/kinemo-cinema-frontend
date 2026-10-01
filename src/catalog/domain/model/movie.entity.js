import {Genre} from './genre.entity.js';
import {MovieStatus} from "./movie-status.value-object.js";
import {Duration} from "../../../shared/domain/model/duration.js";
import {DateTime} from "../../../shared/domain/model/date-time.js";

/**
 * @class Movie
 * @summary Entity representing a movie in the Catalog bounded context.
 */
export class Movie {
    /**
     * @param {Object} props
     * @param {number|null} [props.id] - Unique identifier. `null` for a movie not yet persisted.
     * @param {string} [props.title] - Display title of the movie.
     * @param {Duration|number|null} [props.durationMinutes] - A `Duration`, or the length in minutes.
     * @param {number|null} [props.genreId] - Identifier of the movie's genre.
     * @param {Genre|null} [props.genre] - Resolved genre entity. Ignored (set to `null`) if not a `Genre` instance.
     * @param {MovieStatus|string|null} [props.status] - A `MovieStatus`, or "ACTIVE" / "INACTIVE". Defaults to ACTIVE.
     * @param {number|null} [props.originalMovieId] - Identifier of the movie this one derives from, if any.
     * @param {DateTime|string|null} [props.createdAt] - A `DateTime`, or a value accepted by `new DateTime(...)`.
     * @param {DateTime|string|null} [props.updatedAt] - A `DateTime`, or a value accepted by `new DateTime(...)`.
     * @throws {Error} If `status` is a string that is not a valid movie status.
     * @throws {Error} If `createdAt` or `updatedAt` is `undefined` or not a valid date-time.
     */
    constructor({
                    id = null,
                    title = "",
                    durationMinutes = null,
                    genreId = null,
                    genre = null,
                    status = null,
                    originalMovieId = null,
                    createdAt = null,
                    updatedAt = null
                } = {}) {
        this._id = id;
        this._title = title;
        this._durationMinutes = durationMinutes instanceof Duration
            ? durationMinutes
            : Duration.fromMinutes(durationMinutes ?? 0);
        this._genreId = genreId;
        this._genre = genre instanceof Genre ? genre : null;
        this._status = status instanceof MovieStatus
            ? status
            : new MovieStatus(status ?? 'ACTIVE');
        this._originalMovieId = originalMovieId;
        this._createdAt = createdAt instanceof DateTime ? createdAt : new DateTime(createdAt);
        this._updatedAt = updatedAt instanceof DateTime ? updatedAt : new DateTime(updatedAt);
    }

    /** @returns {number|null} The movie's unique identifier. */
    getId = () => this._id;

    /** @returns {string} The movie's title. */
    getTitle = () => this._title;

    /** @returns {Duration} The movie's running time. */
    getDuration = () => this._durationMinutes;

    /** @returns {Genre|null} The resolved genre entity, if one was provided. */
    getGenre = () => this._genre;

    /** @returns {number|null} The identifier of the movie's genre. */
    geGenreId = () => this._genreId;

    /** @returns {MovieStatus} The current lifecycle status. */
    getStatus = () => this._status;

    /** @returns {number|null} The identifier of the original movie, if this one derives from another. */
    getOriginalMovieId = () => this._originalMovieId;

    /** @returns {DateTime} When the movie was created. */
    getCreatedAt = () => this._createdAt;

    /** @returns {DateTime} When the movie was last updated. */
    getUpdatedAt = () => this._updatedAt;

    /** @returns {string} The status as a string ("ACTIVE" or "INACTIVE"). */
    getStatusAsString = () => this._status.toString();

    /** @returns {string} The creation timestamp as an ISO 8601 string. */
    getCreatedAtFormated = () => this._createdAt.toISOString();

    /** @returns {string} The last-update timestamp as an ISO 8601 string. */
    getUpdatedAtFormated = () => this._updatedAt.toISOString();

    /**
     * Determines whether this movie can be scheduled in the Scheduling
     * bounded context. Delegates to the movie's status.
     *
     * @returns {boolean} True if the movie is ACTIVE.
     */
    canBeScheduled() {
        return this._status.canBeScheduled();
    }

    /**
     * Marks the movie as ACTIVE, making it available for scheduling.
     * Refreshes `updatedAt`.
     *
     * @returns {void}
     */
    activate() {
        this._status = MovieStatus.active();
        this.#touch();
    }

    /**
     * Marks the movie as INACTIVE (retired), so it can no longer be scheduled.
     * Refreshes `updatedAt`.
     *
     * @returns {void}
     */
    deactivate() {
        this._status = MovieStatus.inactive();
        this.#touch();
    }

    /**
     * Sets `updatedAt` to the current time. Called after every state change.
     *
     * @private
     * @returns {void}
     */
    #touch() {
        this._updatedAt = DateTime.now();
    }
}