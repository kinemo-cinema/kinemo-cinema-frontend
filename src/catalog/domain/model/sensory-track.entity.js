import {SensoryTrackType} from './sensory-track-type.value-object.js';
import {TrackStatus} from './track-status.value-object.js';
import {IntensityLevel} from './intensity-level.value-object.js';

/**
 * @class SensoryTrack
 * @summary Entity representing an individual sensory effect track within
 * a sensory file. Each track drives exactly one hardware effect type.
 */
export class SensoryTrack {

    /**
     * @param {Object} props
     * @param {number|null} [props.id] - Unique identifier. `null` for a track not yet persisted.
     * @param {number|null} [props.sensoryFileId] - Identifier of the parent sensory file.
     * @param {SensoryTrackType|string|null} [props.trackType] - A `SensoryTrackType`, or its string form.
     * @param {IntensityLevel|number|null} [props.intensityLevel] - An `IntensityLevel`, or a raw integer 0–100.
     * @param {TrackStatus|string|null} [props.trackStatus] - A `TrackStatus`, or its string form.
     * @throws {Error} If `trackType`, `intensityLevel`, or `trackStatus` is invalid.
     */
    constructor({
                    id = null,
                    sensoryFileId = null,
                    trackType = null,
                    intensityLevel = null,
                    trackStatus = null
                } = {}) {
        this._id = id;
        this._sensoryFileId = sensoryFileId;
        this._trackType = trackType instanceof SensoryTrackType
            ? trackType
            : new SensoryTrackType(trackType ?? 'MOTION');
        this._intensityLevel = intensityLevel instanceof IntensityLevel
            ? intensityLevel
            : new IntensityLevel(intensityLevel ?? 50);
        this._trackStatus = trackStatus instanceof TrackStatus
            ? trackStatus
            : new TrackStatus(trackStatus ?? 'PENDING');
    }

    /** @returns {number|null} The track's unique identifier. */
    getId = () => this._id;

    /** @returns {number|null} The identifier of the parent sensory file. */
    getSensoryFileId = () => this._sensoryFileId;

    /** @returns {SensoryTrackType} The physical effect type driven by this track. */
    getTrackType = () => this._trackType;

    /** @returns {IntensityLevel} The current intensity of the effect. */
    getIntensityLevel = () => this._intensityLevel;

    /** @returns {TrackStatus} The current operational status. */
    getTrackStatus = () => this._trackStatus;

    /** @returns {string} The track type as a string. */
    getTrackTypeAsString = () => this._trackType.toString();

    /** @returns {number} The intensity level as a raw integer. */
    getIntensityLevelAsNumber = () => this._intensityLevel.getValue();

    /** @returns {string} The track status as a string. */
    getTrackStatusAsString = () => this._trackStatus.toString();

    /**
     * Determines whether the track will fire during show execution.
     * Requires an ENABLED status and a non-muted intensity.
     *
     * @returns {boolean} True if the track should fire.
     */
    willExecute() {
        return this._trackStatus.isExecutable() && !this._intensityLevel.isMuted();
    }

    /**
     * Updates the track's intensity to a new numeric value.
     *
     * @param {IntensityLevel|number} newLevel - The new intensity.
     * @returns {void}
     */
    changeIntensityLevel(newLevel) {
        this._intensityLevel = newLevel instanceof IntensityLevel
            ? newLevel
            : new IntensityLevel(newLevel);
    }

    /**
     * Enables the track so it participates in show execution.
     *
     * @returns {void}
     */
    enable() {
        this._trackStatus = TrackStatus.enabled();
    }

    /**
     * Disables the track so it is skipped during show execution.
     *
     * @returns {void}
     */
    disable() {
        this._trackStatus = TrackStatus.disabled();
    }
}