import {BaseApi} from "../../shared/infrastructure/base-api.js";
import {BaseEndpoint} from "../../shared/infrastructure/base-endpoint.js";

const integrationsEndpointPath = import.meta.env.VITE_TICKETING_CONNECTIONS_ENDPOINT_PATH;
const syncLogsEndpointPath = import.meta.env.VITE_SYNC_LOGS_ENDPOINT_PATH;
const occupanciesEndpointPath = import.meta.env.VITE_SHOW_OCCUPANCIES_ENDPOINT_PATH;

/**
 * Infrastructure gateway for BC04 — Ticketing Integration.
 * Exposes endpoints for ticketing integrations, synchronization logs,
 * and show occupancy information.
 *
 * @class TicketingApi
 * @extends BaseApi
 */
export class TicketingApi extends BaseApi {

    /**
     * @type {BaseEndpoint}
     * @private
     */
    #integrationsEndpoint;

    /**
     * @type {BaseEndpoint}
     * @private
     */
    #syncLogsEndpoint;

    /**
     * @type {BaseEndpoint}
     * @private
     */
    #occupanciesEndpoint;

    /**
     * Creates endpoint clients for every resource in BC04.
     */
    constructor() {
        super();

        this.#integrationsEndpoint =
            new BaseEndpoint(this, integrationsEndpointPath);

        this.#syncLogsEndpoint =
            new BaseEndpoint(this, syncLogsEndpointPath);

        this.#occupanciesEndpoint =
            new BaseEndpoint(this, occupanciesEndpointPath);
    }

    // --------------------------------------------------------------------
    // Ticketing integrations
    // --------------------------------------------------------------------

    /**
     * Fetches all ticketing integrations.
     *
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    getTicketingIntegrations() {
        return this.#integrationsEndpoint.getAll();
    }

    /**
     * Fetches a ticketing integration by its ID.
     *
     * @param {number|string} id - Integration identifier.
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    getTicketingIntegrationById(id) {
        return this.#integrationsEndpoint.getById(id);
    }

    /**
     * Creates a ticketing integration resource.
     *
     * @param {Object} resource - Ticketing integration resource.
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    createTicketingIntegration(resource) {
        return this.#integrationsEndpoint.create(resource);
    }

    /**
     * Updates a ticketing integration resource.
     *
     * @param {Object} resource - Ticketing integration resource.
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    updateTicketingIntegration(resource) {
        return this.#integrationsEndpoint.update(
            resource.id,
            resource
        );
    }

    /**
     * Deletes a ticketing integration by its ID.
     *
     * @param {number|string} id - Integration identifier.
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    deleteTicketingIntegration(id) {
        return this.#integrationsEndpoint.delete(id);
    }

    // --------------------------------------------------------------------
    // Synchronization logs
    // --------------------------------------------------------------------

    /**
     * Fetches all synchronization logs.
     *
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    getSyncLogs() {
        return this.#syncLogsEndpoint.getAll();
    }

    /**
     * Fetches a synchronization log by its ID.
     *
     * @param {number|string} id - Synchronization log identifier.
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    getSyncLogById(id) {
        return this.#syncLogsEndpoint.getById(id);
    }

    /**
     * Creates a synchronization log resource.
     *
     * @param {Object} resource - Synchronization log resource.
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    createSyncLog(resource) {
        return this.#syncLogsEndpoint.create(resource);
    }

    /**
     * Updates a synchronization log resource.
     *
     * @param {Object} resource - Synchronization log resource.
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    updateSyncLog(resource) {
        return this.#syncLogsEndpoint.update(
            resource.id,
            resource
        );
    }

    /**
     * Deletes a synchronization log by its ID.
     *
     * @param {number|string} id - Synchronization log identifier.
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    deleteSyncLog(id) {
        return this.#syncLogsEndpoint.delete(id);
    }

    // --------------------------------------------------------------------
    // Show occupancies
    // --------------------------------------------------------------------

    /**
     * Fetches all show occupancies.
     *
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    getShowOccupancies() {
        return this.#occupanciesEndpoint.getAll();
    }

    /**
     * Fetches a show occupancy by its ID.
     *
     * @param {number|string} id - Occupancy identifier.
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    getShowOccupancyById(id) {
        return this.#occupanciesEndpoint.getById(id);
    }

    /**
     * Creates a show occupancy resource.
     *
     * @param {Object} resource - Show occupancy resource.
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    createShowOccupancy(resource) {
        return this.#occupanciesEndpoint.create(resource);
    }

    /**
     * Updates a show occupancy resource.
     *
     * @param {Object} resource - Show occupancy resource.
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    updateShowOccupancy(resource) {
        return this.#occupanciesEndpoint.update(
            resource.id,
            resource
        );
    }

    /**
     * Deletes a show occupancy by its ID.
     *
     * @param {number|string} id - Occupancy identifier.
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    deleteShowOccupancy(id) {
        return this.#occupanciesEndpoint.delete(id);
    }
}