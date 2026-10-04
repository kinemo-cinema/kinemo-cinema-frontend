import {BaseApi} from "../../shared/infrastructure/base-api.js";
import {BaseEndpoint} from "../../shared/infrastructure/base-endpoint.js";

const showsEndpointPath             = import.meta.env.VITE_SHOWS_ENDPOINT_PATH;
const roomsEndpointPath             = import.meta.env.VITE_ROOMS_ENDPOINT_PATH;
const scheduleConflictsEndpointPath = import.meta.env.VITE_SCHEDULE_CONFLICTS_ENDPOINT_PATH;

/**
 * Infrastructure gateway for BC02 — Scheduling & Calendar.
 * Exposes endpoints for shows and their conflicts, plus a read-only
 * access point to rooms while the minimal room slice is in place.
 *
 * @class SchedulingApi
 * @extends BaseApi
 */
export class SchedulingApi extends BaseApi {
    /**
     * @type {BaseEndpoint}
     * @private
     */
    #showsEndpoint;
    /**
     * @type {BaseEndpoint}
     * @private
     */
    #roomsEndpoint;
    /**
     * @type {BaseEndpoint}
     * @private
     */
    #scheduleConflictsEndpoint;

    /** Creates endpoint clients for every resource in BC02. */
    constructor() {
        super();
        this.#showsEndpoint             = new BaseEndpoint(this, showsEndpointPath);
        this.#roomsEndpoint             = new BaseEndpoint(this, roomsEndpointPath);
        this.#scheduleConflictsEndpoint = new BaseEndpoint(this, scheduleConflictsEndpointPath);
    }

    // --------------------------------------------------------------------
    // Shows
    // --------------------------------------------------------------------

    /**
     * Fetches all shows.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the shows' response.
     */
    getShows() {
        return this.#showsEndpoint.getAll();
    }

    /**
     * Fetches a show by its ID.
     * @param {number|string} id - The ID of the show.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the show response.
     */
    getShowById(id) {
        return this.#showsEndpoint.getById(id);
    }

    /**
     * Creates a show resource.
     * @param {Object} resource - Show resource payload.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the created show response.
     */
    createShow(resource) {
        return this.#showsEndpoint.create(resource);
    }

    /**
     * Updates a show resource.
     * @param {Object} resource - Show resource payload (must include id).
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the updated show response.
     */
    updateShow(resource) {
        return this.#showsEndpoint.update(resource.id, resource);
    }

    /**
     * Deletes a show by its ID.
     * @param {number|string} id - The ID of the show to delete.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the delete response.
     */
    deleteShow(id) {
        return this.#showsEndpoint.delete(id);
    }

    // --------------------------------------------------------------------
    // Rooms — minimal slice
    // --------------------------------------------------------------------

    /**
     * Fetches all rooms.
     *
     * @remarks
     * Temporary access point. Rooms are owned by BC03 (Room & Resource
     * Readiness) and are only read here to populate the show form's
     * dropdown. Remove this method once BC03 exposes its own Room store.
     *
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the rooms' response.
     */
    getRooms() {
        return this.#roomsEndpoint.getAll();
    }

    // --------------------------------------------------------------------
    // Schedule conflicts
    // --------------------------------------------------------------------

    /**
     * Fetches all schedule conflicts.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the conflicts response.
     */
    getScheduleConflicts() {
        return this.#scheduleConflictsEndpoint.getAll();
    }

    /**
     * Fetches a schedule conflict by its ID.
     * @param {number|string} id - The ID of the conflict.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the conflict response.
     */
    getScheduleConflictById(id) {
        return this.#scheduleConflictsEndpoint.getById(id);
    }

    /**
     * Creates a schedule conflict resource.
     * @param {Object} resource - Conflict resource payload.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the created conflict response.
     */
    createScheduleConflict(resource) {
        return this.#scheduleConflictsEndpoint.create(resource);
    }

    /**
     * Updates a schedule conflict resource.
     * @param {Object} resource - Conflict resource payload (must include id).
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the updated conflict response.
     */
    updateScheduleConflict(resource) {
        return this.#scheduleConflictsEndpoint.update(resource.id, resource);
    }

    /**
     * Deletes a schedule conflict by its ID.
     * @param {number|string} id - The ID of the conflict to delete.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the delete response.
     */
    deleteScheduleConflict(id) {
        return this.#scheduleConflictsEndpoint.delete(id);
    }
}