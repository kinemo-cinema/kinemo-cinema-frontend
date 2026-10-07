import {DateTime} from '../../../shared/domain/model/date-time.js';
import {StringValidator} from '../../../shared/domain/model/string-validator.js';

/**
 * @class ScheduleConflict
 * @summary Entity representing a detected overlap between two shows
 * scheduled in the same room. Owned by the Show aggregate root that
 * detects the conflict; references the other show by identifier.
 */
export class ScheduleConflict {

    /**
     * @param {Object} props
     * @param {number|null} [props.id] - Unique identifier. `null` for a conflict not yet persisted.
     * @param {number|null} [props.showId] - Identifier of the show that owns this conflict.
     * @param {number|null} [props.conflictingShowId] - Identifier of the other show involved.
     * @param {DateTime|string|null} [props.detectedAt] - When the conflict was detected.
     * @param {string} [props.description] - Human-readable explanation of the overlap.
     * @param {boolean} [props.resolved] - Whether the conflict has been resolved.
     * @param {DateTime|string|null} [props.resolvedAt] - When the conflict was resolved, if applicable.
     * @throws {Error} If `detectedAt` is `undefined` or not a valid date-time.
     * @throws {Error} If `resolvedAt` is provided but not a valid date-time.
     */
    constructor({
                    id = null,
                    showId = null,
                    conflictingShowId = null,
                    detectedAt = null,
                    description = '',
                    resolved = false,
                    resolvedAt = null
                } = {}) {
        this._id = id;
        this._showId = showId;
        this._conflictingShowId = conflictingShowId;
        this._detectedAt = detectedAt instanceof DateTime ? detectedAt : new DateTime(detectedAt);
        this._description = description;
        this._resolved = Boolean(resolved);
        this._resolvedAt = resolvedAt instanceof DateTime
            ? resolvedAt
            : (resolvedAt ? new DateTime(resolvedAt) : null);
    }

    /** @returns {number|null} The conflict's unique identifier. */
    getId = () => this._id;

    /** @returns {number|null} The identifier of the show that owns this conflict. */
    getShowId = () => this._showId;

    /** @returns {number|null} The identifier of the other show involved. */
    getConflictingShowId = () => this._conflictingShowId;

    /** @returns {DateTime} When the conflict was detected. */
    getDetectedAt = () => this._detectedAt;

    /** @returns {string} The detection timestamp as an ISO 8601 string. */
    getDetectedAtFormated = () => this._detectedAt.toISOString();

    /** @returns {string} A human-readable description of the overlap. */
    getDescription = () => this._description;

    /** @returns {boolean} Whether the conflict has been resolved. */
    isResolved = () => this._resolved;

    /** @returns {DateTime|null} When the conflict was resolved, if applicable. */
    getResolvedAt = () => this._resolvedAt;

    /** @returns {string|null} The resolution timestamp as an ISO 8601 string, if resolved. */
    getResolvedAtFormated = () => this._resolvedAt ? this._resolvedAt.toISOString() : null;

    /**
     * Determines whether the conflict has enough descriptive content to
     * be presented to the user.
     *
     * @returns {boolean} True if the description is non-empty.
     */
    hasDescription() {
        return StringValidator.isNotEmptyString(this._description);
    }

    /**
     * Marks the conflict as resolved and records the resolution timestamp.
     *
     * @returns {void}
     */
    resolve() {
        this._resolved = true;
        this._resolvedAt = DateTime.now();
    }

    /**
     * Attaches this conflict to its owning show. Called by the aggregate
     * root when the conflict is added to a Show's collection.
     *
     * @param {number} showId - The identifier of the owning show.
     * @returns {void}
     */
    assignToShow(showId) {
        this._showId = showId;
    }
}