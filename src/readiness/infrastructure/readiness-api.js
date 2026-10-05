import {BaseApi} from "../../shared/infrastructure/base-api.js";
import {BaseEndpoint} from "../../shared/infrastructure/base-endpoint.js";

const roomsEndpointPath            = import.meta.env.VITE_ROOMS_ENDPOINT_PATH;
const inspectionsEndpointPath      = import.meta.env.VITE_ROOM_INSPECTIONS_ENDPOINT_PATH;
const blocksEndpointPath           = import.meta.env.VITE_ROOM_BLOCKS_ENDPOINT_PATH;
const calculationsEndpointPath     = import.meta.env.VITE_RESOURCE_CALCULATIONS_ENDPOINT_PATH;

/**
 * Infrastructure gateway for BC03 — Room & Resource Readiness.
 * Exposes endpoints for rooms, their inspections and blocks, and the
 * resource calculations tied to scheduled shows.
 *
 * @class ReadinessApi
 * @extends BaseApi
 */
export class ReadinessApi extends BaseApi {
    /**
     * @type {BaseEndpoint}
     * @private
     */
    #roomsEndpoint;
    /**
     * @type {BaseEndpoint}
     * @private
     */
    #inspectionsEndpoint;
    /**
     * @type {BaseEndpoint}
     * @private
     */
    #blocksEndpoint;
    /**
     * @type {BaseEndpoint}
     * @private
     */
    #calculationsEndpoint;

    /** Creates endpoint clients for every resource in BC03. */
    constructor() {
        super();
        this.#roomsEndpoint        = new BaseEndpoint(this, roomsEndpointPath);
        this.#inspectionsEndpoint  = new BaseEndpoint(this, inspectionsEndpointPath);
        this.#blocksEndpoint       = new BaseEndpoint(this, blocksEndpointPath);
        this.#calculationsEndpoint = new BaseEndpoint(this, calculationsEndpointPath);
    }

    // --------------------------------------------------------------------
    // Rooms
    // --------------------------------------------------------------------

    /**
     * Fetches all rooms.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the rooms' response.
     */
    getRooms() {
        return this.#roomsEndpoint.getAll();
    }

    /**
     * Fetches a room by its ID.
     * @param {number|string} id - The ID of the room.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the room response.
     */
    getRoomById(id) {
        return this.#roomsEndpoint.getById(id);
    }

    /**
     * Creates a room resource.
     * @param {Object} resource - Room resource payload.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the created room response.
     */
    createRoom(resource) {
        return this.#roomsEndpoint.create(resource);
    }

    /**
     * Updates a room resource.
     * @param {Object} resource - Room resource payload (must include id).
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the updated room response.
     */
    updateRoom(resource) {
        return this.#roomsEndpoint.update(resource.id, resource);
    }

    /**
     * Deletes a room by its ID.
     * @param {number|string} id - The ID of the room to delete.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the delete response.
     */
    deleteRoom(id) {
        return this.#roomsEndpoint.delete(id);
    }

    // --------------------------------------------------------------------
    // Room inspections
    // --------------------------------------------------------------------

    /**
     * Fetches all room inspections.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the inspections' response.
     */
    getRoomInspections() {
        return this.#inspectionsEndpoint.getAll();
    }

    /**
     * Fetches a room inspection by its ID.
     * @param {number|string} id - The ID of the inspection.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the inspection response.
     */
    getRoomInspectionById(id) {
        return this.#inspectionsEndpoint.getById(id);
    }

    /**
     * Creates a room inspection resource.
     * @param {Object} resource - Inspection resource payload.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the created inspection response.
     */
    createRoomInspection(resource) {
        return this.#inspectionsEndpoint.create(resource);
    }

    /**
     * Updates a room inspection resource.
     * @param {Object} resource - Inspection resource payload (must include id).
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the updated inspection response.
     */
    updateRoomInspection(resource) {
        return this.#inspectionsEndpoint.update(resource.id, resource);
    }

    /**
     * Deletes a room inspection by its ID.
     * @param {number|string} id - The ID of the inspection to delete.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the delete response.
     */
    deleteRoomInspection(id) {
        return this.#inspectionsEndpoint.delete(id);
    }

    // --------------------------------------------------------------------
    // Room blocks
    // --------------------------------------------------------------------

    /**
     * Fetches all room blocks.
     *
     * @remarks
     * The mock API stores this collection under the key `maintenanceBlocks`
     * for historical reasons. The semantic name used in the domain and in
     * the client is `roomBlocks`; the URL is resolved through the
     * VITE_ROOM_BLOCKS_ENDPOINT_PATH environment variable.
     *
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the blocks' response.
     */
    getRoomBlocks() {
        return this.#blocksEndpoint.getAll();
    }

    /**
     * Fetches a room block by its ID.
     * @param {number|string} id - The ID of the block.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the block response.
     */
    getRoomBlockById(id) {
        return this.#blocksEndpoint.getById(id);
    }

    /**
     * Creates a room block resource.
     * @param {Object} resource - Block resource payload.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the created block response.
     */
    createRoomBlock(resource) {
        return this.#blocksEndpoint.create(resource);
    }

    /**
     * Updates a room block resource.
     * @param {Object} resource - Block resource payload (must include id).
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the updated block response.
     */
    updateRoomBlock(resource) {
        return this.#blocksEndpoint.update(resource.id, resource);
    }

    /**
     * Deletes a room block by its ID.
     * @param {number|string} id - The ID of the block to delete.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the delete response.
     */
    deleteRoomBlock(id) {
        return this.#blocksEndpoint.delete(id);
    }

    // --------------------------------------------------------------------
    // Resource calculations
    // --------------------------------------------------------------------

    /**
     * Fetches all resource calculations.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the calculations' response.
     */
    getResourceCalculations() {
        return this.#calculationsEndpoint.getAll();
    }

    /**
     * Fetches a resource calculation by its ID.
     * @param {number|string} id - The ID of the calculation.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the calculation response.
     */
    getResourceCalculationById(id) {
        return this.#calculationsEndpoint.getById(id);
    }

    /**
     * Creates a resource calculation resource.
     * @param {Object} resource - Calculation resource payload.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the created calculation response.
     */
    createResourceCalculation(resource) {
        return this.#calculationsEndpoint.create(resource);
    }

    /**
     * Updates a resource calculation resource.
     * @param {Object} resource - Calculation resource payload (must include id).
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the updated calculation response.
     */
    updateResourceCalculation(resource) {
        return this.#calculationsEndpoint.update(resource.id, resource);
    }

    /**
     * Deletes a resource calculation by its ID.
     * @param {number|string} id - The ID of the calculation to delete.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the delete response.
     */
    deleteResourceCalculation(id) {
        return this.#calculationsEndpoint.delete(id);
    }
}