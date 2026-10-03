import {IntensityLevel} from './intensity-level.value-object.js';
import {DateTime} from '../../../shared/domain/model/date-time.js';

/**
 * @class ConfigurationHistory
 * @summary Entity representing a single recorded change to a sensory
 * track's intensity level. Used for audit and rollback of configurations.
 */
export class ConfigurationHistory {

    /**
     * @param {Object} props
     * @param {number|null} [props.id] - Unique identifier. `null` for an entry not yet persisted.
     * @param {number|null} [props.sensoryTrackId] - Identifier of the affected sensory track.
     * @param {IntensityLevel|number|null} [props.previousIntensityLevel] - The intensity before the change.
     * @param {DateTime|string|null} [props.changedAt] - A `DateTime`, or a value accepted by `new DateTime(...)`.
     * @param {boolean} [props.restored] - Whether the previous intensity was later restored.
     * @throws {Error} If `previousIntensityLevel` is invalid.
     * @throws {Error} If `changedAt` is `undefined` or not a valid date-time.
     */
    constructor({
                    id = null,
                    sensoryTrackId = null,
                    previousIntensityLevel = null,
                    changedAt = null,
                    restored = false
                } = {}) {
        this._id = id;
        this._sensoryTrackId = sensoryTrackId;
        this._previousIntensityLevel = previousIntensityLevel instanceof IntensityLevel
            ? previousIntensityLevel
            : new IntensityLevel(previousIntensityLevel ?? 0);
        this._changedAt = changedAt instanceof DateTime ? changedAt : new DateTime(changedAt);
        this._restored = Boolean(restored);
    }

    /** @returns {number|null} The history entry's unique identifier. */
    getId = () => this._id;

    /** @returns {number|null} The identifier of the affected sensory track. */
    getSensoryTrackId = () => this._sensoryTrackId;

    /** @returns {IntensityLevel} The intensity value prior to the change. */
    getPreviousIntensityLevel = () => this._previousIntensityLevel;

    /** @returns {number} The previous intensity as a raw integer. */
    getPreviousIntensityLevelAsNumber = () => this._previousIntensityLevel.getValue();

    /** @returns {DateTime} When the change was recorded. */
    getChangedAt = () => this._changedAt;

    /** @returns {string} The change timestamp as an ISO 8601 string. */
    getChangedAtFormated = () => this._changedAt.toISOString();

    /** @returns {boolean} Whether the previous intensity was restored. */
    isRestored = () => this._restored;

    /**
     * Marks this history entry as restored, indicating that the previous
     * intensity value has been re-applied to the affected track.
     *
     * @returns {void}
     */
    markAsRestored() {
        this._restored = true;
    }
}