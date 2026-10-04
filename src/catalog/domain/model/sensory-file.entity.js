import {FileFormat} from './file-format.value-object.js';
import {ValidationStatus} from './validation-status.value-object.js';
import {SensoryTrack} from './sensory-track.entity.js';
import {ConfigurationHistory} from './configuration-history.entity.js';
import {DateTime} from '../../../shared/domain/model/date-time.js';
import {StringValidator} from '../../../shared/domain/model/string-validator.js';

/**
 * @class SensoryFile
 * @summary Aggregate root representing a sensory effects file associated
 * with a 4D movie.
 *
 * As the aggregate root of the sensory-content cluster, a `SensoryFile`
 * owns its collection of `SensoryTrack` entities and the
 * `ConfigurationHistory` entries recorded against those tracks. All
 * operations that add, remove, or query owned children must go through
 * this class so that aggregate invariants are preserved.
 */
export class SensoryFile {

    /**
     * @param {Object} props
     * @param {number|null} [props.id] - Unique identifier. `null` for a file not yet persisted.
     * @param {number|null} [props.movieId] - Identifier of the associated movie.
     * @param {string} [props.fileName] - Display name of the uploaded file.
     * @param {FileFormat|string|null} [props.fileFormat] - A `FileFormat`, or "TRACK".
     * @param {string} [props.filePath] - Storage path or URL of the file.
     * @param {ValidationStatus|string|null} [props.validationStatus] - A `ValidationStatus`, or its string form.
     * @param {SensoryTrack[]} [props.tracks] - Owned sensory tracks. Non-`SensoryTrack` entries are ignored.
     * @param {ConfigurationHistory[]} [props.configurationHistory] - Owned history entries. Non-`ConfigurationHistory` entries are ignored.
     * @param {DateTime|string|null} [props.uploadedAt] - A `DateTime`, or a value accepted by `new DateTime(...)`.
     * @throws {Error} If `fileFormat` or `validationStatus` is an invalid string.
     * @throws {Error} If `uploadedAt` is `undefined` or not a valid date-time.
     */
    constructor({
                    id = null,
                    movieId = null,
                    fileName = '',
                    fileFormat = null,
                    filePath = '',
                    validationStatus = null,
                    tracks = [],
                    configurationHistory = [],
                    uploadedAt = null
                } = {}) {
        this._id = id;
        this._movieId = movieId;
        this._fileName = fileName;
        this._fileFormat = fileFormat instanceof FileFormat
            ? fileFormat
            : new FileFormat(fileFormat ?? 'TRACK');
        this._filePath = filePath;
        this._validationStatus = validationStatus instanceof ValidationStatus
            ? validationStatus
            : new ValidationStatus(validationStatus ?? 'PENDING');
        this._tracks = tracks.filter(t => t instanceof SensoryTrack);
        this._configurationHistory = configurationHistory.filter(h => h instanceof ConfigurationHistory);
        this._uploadedAt = uploadedAt instanceof DateTime ? uploadedAt : new DateTime(uploadedAt);
    }

    // --------------------------------------------------------------------
    // Identity & scalar attributes
    // --------------------------------------------------------------------

    /** @returns {number|null} The file's unique identifier. */
    getId = () => this._id;

    /** @returns {number|null} The identifier of the associated movie. */
    getMovieId = () => this._movieId;

    /** @returns {string} The display name of the file. */
    getFileName = () => this._fileName;

    /** @returns {FileFormat} The file format. */
    getFileFormat = () => this._fileFormat;

    /** @returns {string} The storage path or URL of the file. */
    getFilePath = () => this._filePath;

    /** @returns {ValidationStatus} The current validation status. */
    getValidationStatus = () => this._validationStatus;

    /** @returns {DateTime} When the file was uploaded. */
    getUploadedAt = () => this._uploadedAt;

    /** @returns {string} The validation status as a string. */
    getValidationStatusAsString = () => this._validationStatus.toString();

    /** @returns {string} The upload timestamp as an ISO 8601 string. */
    getUploadedAtFormated = () => this._uploadedAt.toISOString();

    // --------------------------------------------------------------------
    // Owned children — SensoryTrack
    // --------------------------------------------------------------------

    /**
     * Returns a shallow copy of the owned sensory tracks, so callers
     * cannot mutate the internal collection directly.
     *
     * @returns {SensoryTrack[]} A copy of the owned tracks.
     */
    getTracks = () => [...this._tracks];

    /**
     * Returns the number of sensory tracks currently owned by this file.
     *
     * @returns {number} The track count.
     */
    getTrackCount = () => this._tracks.length;

    /**
     * Checks whether this file owns at least one sensory track.
     *
     * @returns {boolean} True if the file has tracks.
     */
    hasTracks = () => this._tracks.length > 0;

    /**
     * Finds an owned track by its identifier.
     *
     * @param {number} trackId - The identifier of the track to find.
     * @returns {SensoryTrack|undefined} The matching track, if any.
     */
    getTrackById = (trackId) => this._tracks.find(t => t.getId() === trackId);

    /**
     * Returns only those tracks that are enabled and would fire during
     * show execution.
     *
     * @returns {SensoryTrack[]} The subset of executable tracks.
     */
    getActiveTracks = () => this._tracks.filter(t => t.willExecute());

    /**
     * Adds a sensory track to this file. Duplicate tracks (same identifier)
     * are rejected silently.
     *
     * @param {SensoryTrack} track - The track to add.
     * @returns {void}
     * @throws {TypeError} If `track` is not a SensoryTrack instance.
     */
    addTrack(track) {
        if (!(track instanceof SensoryTrack)) {
            throw new TypeError('Expected a SensoryTrack instance');
        }
        if (track.getId() !== null && this.getTrackById(track.getId())) {
            return;
        }
        this._tracks.push(track);
    }

    /**
     * Removes a sensory track from this file by its identifier.
     *
     * @param {number} trackId - The identifier of the track to remove.
     * @returns {boolean} True if a track was removed, false otherwise.
     */
    removeTrack(trackId) {
        const index = this._tracks.findIndex(t => t.getId() === trackId);
        if (index === -1) return false;
        this._tracks.splice(index, 1);
        return true;
    }

    /**
     * Removes every owned sensory track.
     *
     * @returns {void}
     */
    clearTracks() {
        this._tracks = [];
    }

    // --------------------------------------------------------------------
    // Owned children — ConfigurationHistory
    // --------------------------------------------------------------------

    /**
     * Returns a shallow copy of the owned configuration history entries.
     *
     * @returns {ConfigurationHistory[]} A copy of the history entries.
     */
    getConfigurationHistory = () => [...this._configurationHistory];

    /**
     * Returns the number of configuration history entries owned by this file.
     *
     * @returns {number} The history entry count.
     */
    getConfigurationHistoryCount = () => this._configurationHistory.length;

    /**
     * Adds a configuration history entry to this file.
     *
     * @param {ConfigurationHistory} entry - The history entry to add.
     * @returns {void}
     * @throws {TypeError} If `entry` is not a ConfigurationHistory instance.
     */
    addHistory(entry) {
        if (!(entry instanceof ConfigurationHistory)) {
            throw new TypeError('Expected a ConfigurationHistory instance');
        }
        this._configurationHistory.push(entry);
    }

    /**
     * Returns all configuration history entries recorded for a given track.
     *
     * @param {number} trackId - The identifier of the track.
     * @returns {ConfigurationHistory[]} The matching history entries.
     */
    getConfigurationHistoryFor(trackId) {
        return this._configurationHistory.filter(h => h.getSensoryTrackId() === trackId);
    }

    /**
     * Removes every configuration history entry recorded for a given track.
     * Intended for explicit cleanup, since `removeTrack` does not cascade.
     *
     * @param {number} trackId - The identifier of the track.
     * @returns {number} The number of entries removed.
     */
    removeConfigurationHistoryFor(trackId) {
        const before = this._configurationHistory.length;
        this._configurationHistory = this._configurationHistory
            .filter(h => h.getSensoryTrackId() !== trackId);
        return before - this._configurationHistory.length;
    }

    // --------------------------------------------------------------------
    // Lifecycle & domain rules
    // --------------------------------------------------------------------

    /**
     * Determines whether the file has a valid, non-empty storage path
     * and can therefore be referenced during show execution.
     *
     * @returns {boolean} True if the file path is present and non-empty.
     */
    hasValidPath() {
        return StringValidator.isNotEmptyString(this._filePath);
    }

    /**
     * Determines whether the file is ready to be used in a show.
     * Requires a validated status, a valid path, and at least one
     * sensory track to be present.
     *
     * @returns {boolean} True if the file can be used.
     */
    canBeUsedInShow() {
        return this._validationStatus.canBeUsedInShow()
            && this.hasValidPath()
            && this.hasTracks();
    }

    /**
     * Marks the file as validated. Called after a successful validation pass.
     *
     * @returns {void}
     */
    validate() {
        this._validationStatus = ValidationStatus.validated();
    }

    /**
     * Marks the file as rejected. Called after a failed validation pass.
     *
     * @returns {void}
     */
    reject() {
        this._validationStatus = ValidationStatus.rejected();
    }

    /**
     * Attaches the file to a movie. Used when the file is uploaded before
     * the parent movie is confirmed.
     *
     * @param {number} movieId - The identifier of the target movie.
     * @returns {void}
     */
    assignToMovie(movieId) {
        this._movieId = movieId;
    }
}