/**
 * Application service store for BC04 — Ticketing Integration.
 * Coordinates ticketing connections, synchronization logs,
 * and show occupancy information.
 *
 * @module useTicketingStore
 */

import {defineStore} from "pinia";
import {ref} from "vue";

import {TicketingApi} from "../infrastructure/ticketing-api.js";
import {TicketingIntegrationAssembler} from "../infrastructure/ticketing-integration.assembler.js";
import {SyncLogAssembler} from "../infrastructure/sync-log.assembler.js";
import {ShowOccupancyAssembler} from "../infrastructure/show-occupancy.assembler.js";

const ticketingApi = new TicketingApi();

/**
 * Pinia store for BC04 — Ticketing Integration.
 *
 * @returns {Object} The store state and actions.
 */
const useTicketingStore = defineStore("ticketing", () => {

    // --------------------------------------------------------------------
    // State
    // --------------------------------------------------------------------

    /**
     * Ticketing connection entities.
     *
     * @type {import('vue').Ref<TicketingIntegration[]>}
     */
    const ticketingIntegrations = ref([]);

    /**
     * Synchronization log entities.
     *
     * @type {import('vue').Ref<SyncLog[]>}
     */
    const syncLogs = ref([]);

    /**
     * Show occupancy entities.
     *
     * @type {import('vue').Ref<ShowOccupancy[]>}
     */
    const showOccupancies = ref([]);

    /**
     * Errors produced by infrastructure operations.
     *
     * @type {import('vue').Ref<Error[]>}
     */
    const errors = ref([]);

    /**
     * Whether ticketing integrations have already been loaded.
     */
    const ticketingIntegrationsLoaded = ref(false);

    /**
     * Whether synchronization logs have already been loaded.
     */
    const syncLogsLoaded = ref(false);

    /**
     * Whether show occupancies have already been loaded.
     */
    const showOccupanciesLoaded = ref(false);

    // --------------------------------------------------------------------
    // Ticketing integrations
    // --------------------------------------------------------------------

    /**
     * Loads ticketing integrations.
     *
     * @returns {Promise<void>}
     */
    async function fetchTicketingIntegrations() {
        errors.value = [];

        try {
            const response =
                await ticketingApi.getTicketingIntegrations();

            ticketingIntegrations.value =
                TicketingIntegrationAssembler
                    .toEntitiesFromResponse(response);

            ticketingIntegrationsLoaded.value = true;
        } catch (error) {
            errors.value.push(error);
        }
    }

    /**
     * Finds a ticketing integration by identifier.
     *
     * @param {number|string} id
     * @returns {TicketingIntegration|undefined}
     */
    function getTicketingIntegrationById(id) {
        const idNum = parseInt(id);

        return ticketingIntegrations.value.find(
            integration =>
                integration.getId() === idNum
        );
    }

    /**
     * Creates a ticketing integration.
     *
     * @param {TicketingIntegration} integration
     * @returns {Promise<void>}
     */
    async function addTicketingIntegration(integration) {
        errors.value = [];

        try {
            const response =
                await ticketingApi.createTicketingIntegration(
                    TicketingIntegrationAssembler
                        .toResourceFromEntity(integration)
                );

            const newIntegration =
                TicketingIntegrationAssembler
                    .toEntityFromResource(response.data);

            ticketingIntegrations.value.push(
                newIntegration
            );
        } catch (error) {
            errors.value.push(error);
        }
    }

    /**
     * Updates a ticketing integration.
     *
     * @param {TicketingIntegration} integration
     * @returns {Promise<void>}
     */
    async function updateTicketingIntegration(integration) {
        errors.value = [];

        try {
            const response =
                await ticketingApi.updateTicketingIntegration(
                    TicketingIntegrationAssembler
                        .toResourceFromEntity(integration)
                );

            const updatedIntegration =
                TicketingIntegrationAssembler
                    .toEntityFromResource(response.data);

            const index =
                ticketingIntegrations.value.findIndex(
                    item =>
                        item.getId() ===
                        updatedIntegration.getId()
                );

            if (index !== -1) {
                ticketingIntegrations.value[index] =
                    updatedIntegration;
            }
        } catch (error) {
            errors.value.push(error);
        }
    }

    // --------------------------------------------------------------------
    // Synchronization logs
    // --------------------------------------------------------------------

    /**
     * Loads synchronization logs.
     *
     * @returns {Promise<void>}
     */
    async function fetchSyncLogs() {
        errors.value = [];

        try {
            const response =
                await ticketingApi.getSyncLogs();

            syncLogs.value =
                SyncLogAssembler
                    .toEntitiesFromResponse(response);

            syncLogsLoaded.value = true;
        } catch (error) {
            errors.value.push(error);
        }
    }

    /**
     * Returns synchronization logs for a ticketing connection.
     *
     * @param {number|string} connectionId
     * @returns {SyncLog[]}
     */
    function getSyncLogsByConnectionId(connectionId) {
        const idNum = parseInt(connectionId);

        return syncLogs.value.filter(
            log =>
                log.getConnectionId() === idNum
        );
    }

    // --------------------------------------------------------------------
    // Show occupancies
    // --------------------------------------------------------------------

    /**
     * Loads show occupancy information.
     *
     * @returns {Promise<void>}
     */
    async function fetchShowOccupancies() {
        errors.value = [];

        try {
            const response =
                await ticketingApi.getShowOccupancies();

            showOccupancies.value =
                ShowOccupancyAssembler
                    .toEntitiesFromResponse(response);

            showOccupanciesLoaded.value = true;
        } catch (error) {
            errors.value.push(error);
        }
    }

    /**
     * Returns occupancy information related to a ticketing connection.
     *
     * The relationship is resolved through the latest synchronization log:
     *
     * TicketingConnection -> SyncLog -> ShowOccupancy
     *
     * @param {number|string} connectionId
     * @returns {ShowOccupancy[]}
     */
    function getShowOccupanciesByConnectionId(connectionId) {
        const logs =
            getSyncLogsByConnectionId(connectionId);

        const syncLogIds = logs.map(
            log => log.getId()
        );

        return showOccupancies.value.filter(
            occupancy =>
                syncLogIds.includes(
                    occupancy.getLastSyncLogId()
                )
        );
    }

    // --------------------------------------------------------------------
    // Return
    // --------------------------------------------------------------------

    return {
        ticketingIntegrations,
        syncLogs,
        showOccupancies,

        ticketingIntegrationsLoaded,
        syncLogsLoaded,
        showOccupanciesLoaded,

        fetchTicketingIntegrations,
        getTicketingIntegrationById,
        addTicketingIntegration,
        updateTicketingIntegration,

        fetchSyncLogs,
        getSyncLogsByConnectionId,

        fetchShowOccupancies,
        getShowOccupanciesByConnectionId,
    };
});

export default useTicketingStore;