import {BaseApi} from "../../shared/infrastructure/base-api.js";
import {BaseEndpoint} from "../../shared/infrastructure/base-endpoint.js";

const moviesEndpointPath               = import.meta.env.VITE_MOVIES_ENDPOINT_PATH;
const genresEndpointPath               = import.meta.env.VITE_GENRES_ENDPOINT_PATH;
const sensoryFilesEndpointPath         = import.meta.env.VITE_SENSORY_FILES_ENDPOINT_PATH;
const sensoryTracksEndpointPath        = import.meta.env.VITE_SENSORY_TRACKS_ENDPOINT_PATH;
const configurationHistoryEndpointPath = import.meta.env.VITE_CONFIGURATION_HISTORY_ENDPOINT_PATH;

/**
 * Infrastructure gateway for BC01 — Movie & Sensory Content Management.
 * Exposes endpoints for movies, genres, sensory files, sensory tracks,
 * and configuration history.
 *
 * @class CatalogApi
 * @extends BaseApi
 */
export class CatalogApi extends BaseApi {
    /**
     * @type {BaseEndpoint}
     * @private
     */
    #moviesEndpoint;
    /**
     * @type {BaseEndpoint}
     * @private
     */
    #genresEndpoint;
    /**
     * @type {BaseEndpoint}
     * @private
     */
    #sensoryFilesEndpoint;
    /**
     * @type {BaseEndpoint}
     * @private
     */
    #sensoryTracksEndpoint;
    /**
     * @type {BaseEndpoint}
     * @private
     */
    #configurationHistoryEndpoint;

    /** Creates endpoint clients for every resource in BC01. */
    constructor() {
        super();
        this.#moviesEndpoint               = new BaseEndpoint(this, moviesEndpointPath);
        this.#genresEndpoint               = new BaseEndpoint(this, genresEndpointPath);
        this.#sensoryFilesEndpoint         = new BaseEndpoint(this, sensoryFilesEndpointPath);
        this.#sensoryTracksEndpoint        = new BaseEndpoint(this, sensoryTracksEndpointPath);
        this.#configurationHistoryEndpoint = new BaseEndpoint(this, configurationHistoryEndpointPath);
    }

    // --------------------------------------------------------------------
    // Genres
    // --------------------------------------------------------------------

    /**
     * Fetches all genres.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the genres' response.
     */
    getGenres() {
        return this.#genresEndpoint.getAll();
    }

    /**
     * Fetches a genre by its ID.
     * @param {number|string} id - The ID of the genre.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the genre response.
     */
    getGenreById(id) {
        return this.#genresEndpoint.getById(id);
    }

    /**
     * Creates a genre resource.
     * @param {Object} resource - Genre resource payload.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the created genre response.
     */
    createGenre(resource) {
        return this.#genresEndpoint.create(resource);
    }

    /**
     * Updates a genre resource.
     * @param {Object} resource - Genre resource payload (must include id).
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the updated genre response.
     */
    updateGenre(resource) {
        return this.#genresEndpoint.update(resource.id, resource);
    }

    /**
     * Deletes a genre by its ID.
     * @param {number|string} id - The ID of the genre to delete.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the delete response.
     */
    deleteGenre(id) {
        return this.#genresEndpoint.delete(id);
    }

    // --------------------------------------------------------------------
    // Movies
    // --------------------------------------------------------------------

    /**
     * Fetches all movies.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the movies' response.
     */
    getMovies() {
        return this.#moviesEndpoint.getAll();
    }

    /**
     * Fetches a movie by its ID.
     * @param {number|string} id - The ID of the movie.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the movie response.
     */
    getMovieById(id) {
        return this.#moviesEndpoint.getById(id);
    }

    /**
     * Creates a movie resource.
     * @param {Object} resource - Movie resource payload.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the created movie response.
     */
    createMovie(resource) {
        return this.#moviesEndpoint.create(resource);
    }

    /**
     * Updates a movie resource.
     * @param {Object} resource - Movie resource payload (must include id).
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the updated movie response.
     */
    updateMovie(resource) {
        return this.#moviesEndpoint.update(resource.id, resource);
    }

    /**
     * Deletes a movie by its ID.
     * @param {number|string} id - The ID of the movie to delete.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the delete response.
     */
    deleteMovie(id) {
        return this.#moviesEndpoint.delete(id);
    }

    // --------------------------------------------------------------------
    // Sensory files
    // --------------------------------------------------------------------

    /**
     * Fetches all sensory files.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the sensory files' response.
     */
    getSensoryFiles() {
        return this.#sensoryFilesEndpoint.getAll();
    }

    /**
     * Fetches a sensory file by its ID.
     * @param {number|string} id - The ID of the sensory file.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the sensory file response.
     */
    getSensoryFileById(id) {
        return this.#sensoryFilesEndpoint.getById(id);
    }

    /**
     * Creates a sensory file resource.
     * @param {Object} resource - Sensory file resource payload.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the created sensory file response.
     */
    createSensoryFile(resource) {
        return this.#sensoryFilesEndpoint.create(resource);
    }

    /**
     * Updates a sensory file resource.
     * @param {Object} resource - Sensory file resource payload (must include id).
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the updated sensory file response.
     */
    updateSensoryFile(resource) {
        return this.#sensoryFilesEndpoint.update(resource.id, resource);
    }

    /**
     * Deletes a sensory file by its ID.
     * @param {number|string} id - The ID of the sensory file to delete.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the delete response.
     */
    deleteSensoryFile(id) {
        return this.#sensoryFilesEndpoint.delete(id);
    }

    // --------------------------------------------------------------------
    // Sensory tracks
    // --------------------------------------------------------------------

    /**
     * Fetches all sensory tracks.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the sensory tracks' response.
     */
    getSensoryTracks() {
        return this.#sensoryTracksEndpoint.getAll();
    }

    /**
     * Fetches a sensory track by its ID.
     * @param {number|string} id - The ID of the sensory track.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the sensory track response.
     */
    getSensoryTrackById(id) {
        return this.#sensoryTracksEndpoint.getById(id);
    }

    /**
     * Creates a sensory track resource.
     * @param {Object} resource - Sensory track resource payload.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the created sensory track response.
     */
    createSensoryTrack(resource) {
        return this.#sensoryTracksEndpoint.create(resource);
    }

    /**
     * Updates a sensory track resource.
     * @param {Object} resource - Sensory track resource payload (must include id).
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the updated sensory track response.
     */
    updateSensoryTrack(resource) {
        return this.#sensoryTracksEndpoint.update(resource.id, resource);
    }

    /**
     * Deletes a sensory track by its ID.
     * @param {number|string} id - The ID of the sensory track to delete.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the delete response.
     */
    deleteSensoryTrack(id) {
        return this.#sensoryTracksEndpoint.delete(id);
    }

    // --------------------------------------------------------------------
    // Configuration history
    // --------------------------------------------------------------------

    /**
     * Fetches all configuration history entries.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the configuration history response.
     */
    getConfigurationHistory() {
        return this.#configurationHistoryEndpoint.getAll();
    }

    /**
     * Fetches a configuration history entry by its ID.
     * @param {number|string} id - The ID of the configuration history entry.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the configuration history response.
     */
    getConfigurationHistoryById(id) {
        return this.#configurationHistoryEndpoint.getById(id);
    }

    /**
     * Creates a configuration history resource.
     * @param {Object} resource - Configuration history resource payload.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the created configuration history response.
     */
    createConfigurationHistory(resource) {
        return this.#configurationHistoryEndpoint.create(resource);
    }

    /**
     * Updates a configuration history resource.
     * @param {Object} resource - Configuration history resource payload (must include id).
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the updated configuration history response.
     */
    updateConfigurationHistory(resource) {
        return this.#configurationHistoryEndpoint.update(resource.id, resource);
    }

    /**
     * Deletes a configuration history entry by its ID.
     * @param {number|string} id - The ID of the configuration history entry to delete.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the delete response.
     */
    deleteConfigurationHistory(id) {
        return this.#configurationHistoryEndpoint.delete(id);
    }
}