import { defineStore } from "pinia";
import { ref } from "vue";

import { TicketingApi } from "../infrastructure/ticketing-api.js";
import { TicketingIntegrationAssembler } from "../infrastructure/ticketing-integration.assembler.js";
import { SyncLogAssembler } from "../infrastructure/sync-log.assembler.js";
import { ShowOccupancyAssembler } from "../infrastructure/show-occupancy.assembler.js";

const ticketingApi = new TicketingApi();

const useTicketingStore = defineStore("ticketing", () => {

    /* =========================================================
       STATE
    ========================================================= */

    const ticketingIntegrations = ref([]);
    const syncLogs = ref([]);
    const showOccupancies = ref([]);

    const errors = ref([]);

    const ticketingIntegrationsLoaded = ref(false);
    const syncLogsLoaded = ref(false);
    const showOccupanciesLoaded = ref(false);

    const ticketingIntegrationsLoading = ref(false);
    const syncLogsLoading = ref(false);
    const showOccupanciesLoading = ref(false);


    /* =========================================================
       TICKETING INTEGRATIONS
    ========================================================= */

    async function fetchTicketingIntegrations() {

        errors.value = [];
        ticketingIntegrationsLoading.value = true;

        try {

            const response =
                await ticketingApi.getTicketingIntegrations();

            ticketingIntegrations.value =
                TicketingIntegrationAssembler
                    .toEntitiesFromResponse(response);

            ticketingIntegrationsLoaded.value = true;

            return true;

        } catch (error) {

            console.error(
                "Unable to load ticketing integrations:",
                error
            );

            ticketingIntegrations.value = [];

            errors.value.push(
                error instanceof Error
                    ? error
                    : new Error("Unable to load ticketing integrations.")
            );

            /*
             * La petición terminó, aunque haya fallado.
             * Esto evita que el spinner quede infinito.
             */
            ticketingIntegrationsLoaded.value = true;

            return false;

        } finally {

            ticketingIntegrationsLoading.value = false;

        }
    }


    function getTicketingIntegrationById(id) {

        const idNum = Number(id);

        return ticketingIntegrations.value.find(
            integration =>
                integration.getId() === idNum
        );
    }


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

            return true;

        } catch (error) {

            console.error(
                "Unable to create ticketing integration:",
                error
            );

            errors.value.push(
                error instanceof Error
                    ? error
                    : new Error("Unable to create ticketing integration.")
            );

            return false;
        }
    }


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

            return true;

        } catch (error) {

            console.error(
                "Unable to update ticketing integration:",
                error
            );

            errors.value.push(
                error instanceof Error
                    ? error
                    : new Error("Unable to update ticketing integration.")
            );

            return false;
        }
    }


    /* =========================================================
       SYNC LOGS
    ========================================================= */

    async function fetchSyncLogs() {

        errors.value = [];
        syncLogsLoading.value = true;

        try {

            const response =
                await ticketingApi.getSyncLogs();

            syncLogs.value =
                SyncLogAssembler
                    .toEntitiesFromResponse(response);

            syncLogsLoaded.value = true;

            return true;

        } catch (error) {

            console.error(
                "Unable to load synchronization logs:",
                error
            );

            syncLogs.value = [];

            errors.value.push(
                error instanceof Error
                    ? error
                    : new Error("Unable to load synchronization logs.")
            );

            syncLogsLoaded.value = true;

            return false;

        } finally {

            syncLogsLoading.value = false;

        }
    }


    function getSyncLogsByConnectionId(connectionId) {

        const idNum = Number(connectionId);

        return syncLogs.value.filter(
            log =>
                log.getConnectionId() === idNum
        );
    }


    /* =========================================================
       SHOW OCCUPANCIES
    ========================================================= */

    async function fetchShowOccupancies() {

        errors.value = [];
        showOccupanciesLoading.value = true;

        try {

            const response =
                await ticketingApi.getShowOccupancies();

            showOccupancies.value =
                ShowOccupancyAssembler
                    .toEntitiesFromResponse(response);

            showOccupanciesLoaded.value = true;

            return true;

        } catch (error) {

            console.error(
                "Unable to load show occupancies:",
                error
            );

            showOccupancies.value = [];

            errors.value.push(
                error instanceof Error
                    ? error
                    : new Error("Unable to load show occupancies.")
            );

            showOccupanciesLoaded.value = true;

            return false;

        } finally {

            showOccupanciesLoading.value = false;

        }
    }


    function getShowOccupanciesByConnectionId(connectionId) {

        const logs =
            getSyncLogsByConnectionId(connectionId);

        const syncLogIds =
            logs.map(
                log => log.getId()
            );

        return showOccupancies.value.filter(
            occupancy =>
                syncLogIds.includes(
                    occupancy.getLastSyncLogId()
                )
        );
    }


    /* =========================================================
       RETURN
    ========================================================= */

    return {

        ticketingIntegrations,
        syncLogs,
        showOccupancies,

        errors,

        ticketingIntegrationsLoaded,
        syncLogsLoaded,
        showOccupanciesLoaded,

        ticketingIntegrationsLoading,
        syncLogsLoading,
        showOccupanciesLoading,

        fetchTicketingIntegrations,
        getTicketingIntegrationById,
        addTicketingIntegration,
        updateTicketingIntegration,

        fetchSyncLogs,
        getSyncLogsByConnectionId,

        fetchShowOccupancies,
        getShowOccupanciesByConnectionId
    };
});

export default useTicketingStore;