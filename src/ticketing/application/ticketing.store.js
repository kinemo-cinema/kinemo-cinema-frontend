/**
 * Application store for BC04 — Ticketing Integration.
 * Coordinates ticketing integrations, synchronization logs,
 * show occupancies, and keeps UI-facing state.
 *
 * @module useTicketingStore
 */

import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {TicketingApi} from "../infrastructure/ticketing-api.js";
import {TicketingIntegrationAssembler} from "../infrastructure/ticketing-integration.assembler.js";
import {SyncLogAssembler} from "../infrastructure/sync-log.assembler.js";
import {ShowOccupancyAssembler} from "../infrastructure/show-occupancy.assembler.js";

const ticketingApi = new TicketingApi();

/**
 * Pinia store for BC04 — Ticketing Integration.
 *
 * Manages ticketing integrations, synchronization logs and
 * synchronized show occupancy information.
 *
 * @returns {Object} Store state, computed properties and actions.
 */
const useTicketingStore = defineStore("ticketing", () => {

    // --------------------------------------------------------------------
    // State — ticketing integrations
    // --------------------------------------------------------------------

    /**
     * List of ticketing integrations.
     *
     * @type {import('vue').Ref<TicketingIntegration[]>}
     */
    const ticketingIntegrations = ref([]);

    /**
     * Indicates whether ticketing integrations have been loaded.
     *
     * @type {import('vue').Ref<boolean>}
     */
    const ticketingIntegrationsLoaded = ref(false);

    // --------------------------------------------------------------------
    // State — synchronization logs
    // --------------------------------------------------------------------

    /**
     * List of synchronization logs.
     *
     * @type {import('vue').Ref<SyncLog[]>}
     */
    const syncLogs = ref([]);

    /**
     * Indicates whether synchronization logs have been loaded.
     *
     * @type {import('vue').Ref<boolean>}
     */
    const syncLogsLoaded = ref(false);

    // --------------------------------------------------------------------
    // State — show occupancies
    // --------------------------------------------------------------------

    /**
     * List of synchronized show occupancies.
     *
     * @type {import('vue').Ref<ShowOccupancy[]>}
     */
    const showOccupancies = ref([]);

    /**
     * Indicates whether show occupancies have been loaded.
     *
     * @type {import('vue').Ref<boolean>}
     */
    const showOccupanciesLoaded = ref(false);

    // --------------------------------------------------------------------
    // State — cross-cutting
    // --------------------------------------------------------------------

    /**
     * Errors produced during API or domain operations.
     *
     * @type {import('vue').Ref<Error[]>}
     */
    const errors = ref([]);

    // --------------------------------------------------------------------
    // Computed counts
    // --------------------------------------------------------------------

    /**
     * Number of loaded ticketing integrations.
     *
     * @type {import('vue').ComputedRef<number>}
     */
    const ticketingIntegrationsCount = computed(() =>
        ticketingIntegrationsLoaded.value
            ? ticketingIntegrations.value.length
            : 0
    );

    /**
     * Number of connected ticketing integrations.
     *
     * @type {import('vue').ComputedRef<number>}
     */
    const connectedIntegrationsCount = computed(() =>
        ticketingIntegrations.value.filter(
            integration => integration.isConnected()
        ).length
    );

    /**
     * Number of loaded synchronization logs.
     *
     * @type {import('vue').ComputedRef<number>}
     */
    const syncLogsCount = computed(() =>
        syncLogsLoaded.value
            ? syncLogs.value.length
            : 0
    );

    /**
     * Number of loaded show occupancies.
     *
     * @type {import('vue').ComputedRef<number>}
     */
    const showOccupanciesCount = computed(() =>
        showOccupanciesLoaded.value
            ? showOccupancies.value.length
            : 0
    );

    // --------------------------------------------------------------------
    // Actions — ticketing integrations
    // --------------------------------------------------------------------

    /**
     * Loads all ticketing integrations from the API.
     *
     * @returns {void}
     */
    function fetchTicketingIntegrations() {
        errors.value = [];

        ticketingApi.getTicketingIntegrations()
            .then(response => {
                ticketingIntegrations.value =
                    TicketingIntegrationAssembler.toEntitiesFromResponse(response);

                ticketingIntegrationsLoaded.value = true;
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    /**
     * Finds a ticketing integration by identifier.
     *
     * @param {number|string} id - Integration identifier.
     * @returns {TicketingIntegration|undefined}
     */
    function getTicketingIntegrationById(id) {
        return ticketingIntegrations.value.find(
            integration =>
                String(integration.getId()) === String(id)
        );
    }

    /**
     * Returns ticketing integrations belonging to a cinema.
     *
     * @param {number|string} cinemaId - Cinema identifier.
     * @returns {TicketingIntegration[]}
     */
    function getTicketingIntegrationsByCinemaId(cinemaId) {
        return ticketingIntegrations.value.filter(
            integration =>
                String(integration.getCinemaId()) === String(cinemaId)
        );
    }

    /**
     * Returns currently connected integrations.
     *
     * @returns {TicketingIntegration[]}
     */
    function getConnectedIntegrations() {
        return ticketingIntegrations.value.filter(
            integration => integration.isConnected()
        );
    }

    /**
     * Creates a ticketing integration.
     *
     * @param {TicketingIntegration} integration - Integration to persist.
     * @returns {void}
     */
    function addTicketingIntegration(integration) {
        errors.value = [];

        const resource =
            TicketingIntegrationAssembler.toResourceFromEntity(integration);

        ticketingApi.createTicketingIntegration(resource)
            .then(response => {
                const newIntegration =
                    TicketingIntegrationAssembler.toEntityFromResource(
                        response.data
                    );

                ticketingIntegrations.value.push(newIntegration);
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    /**
     * Updates an existing ticketing integration.
     *
     * @param {TicketingIntegration} integration - Integration to update.
     * @returns {void}
     */
    function updateTicketingIntegration(integration) {
        errors.value = [];

        const resource =
            TicketingIntegrationAssembler.toResourceFromEntity(integration);

        ticketingApi.updateTicketingIntegration(resource)
            .then(response => {
                const updatedIntegration =
                    TicketingIntegrationAssembler.toEntityFromResource(
                        response.data
                    );

                const index = ticketingIntegrations.value.findIndex(
                    item =>
                        String(item.getId()) ===
                        String(updatedIntegration.getId())
                );

                if (index !== -1) {
                    ticketingIntegrations.value[index] =
                        updatedIntegration;
                }
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    /**
     * Deletes a ticketing integration.
     *
     * @param {TicketingIntegration} integration - Integration to delete.
     * @returns {void}
     */
    function deleteTicketingIntegration(integration) {
        errors.value = [];

        ticketingApi.deleteTicketingIntegration(
            integration.getId()
        )
            .then(() => {
                const index = ticketingIntegrations.value.findIndex(
                    item =>
                        String(item.getId()) ===
                        String(integration.getId())
                );

                if (index !== -1) {
                    ticketingIntegrations.value.splice(index, 1);
                }
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    // --------------------------------------------------------------------
    // Domain-mediated connection transitions
    // --------------------------------------------------------------------

    /**
     * Executes a domain transition and persists the resulting integration.
     *
     * @private
     * @param {TicketingIntegration} integration
     * @param {(integration: TicketingIntegration) => void} transition
     * @returns {void}
     */
    function _transitionIntegration(integration, transition) {
        errors.value = [];

        try {
            transition(integration);
        } catch (domainError) {
            errors.value.push(domainError);
            return;
        }

        updateTicketingIntegration(integration);
    }

    /**
     * Connects a ticketing integration.
     *
     * @param {TicketingIntegration} integration
     * @returns {void}
     */
    function connectIntegration(integration) {
        _transitionIntegration(
            integration,
            item => item.connect()
        );
    }

    /**
     * Disconnects a ticketing integration.
     *
     * @param {TicketingIntegration} integration
     * @returns {void}
     */
    function disconnectIntegration(integration) {
        _transitionIntegration(
            integration,
            item => item.disconnect()
        );
    }

    /**
     * Marks a ticketing integration as reconnecting.
     *
     * @param {TicketingIntegration} integration
     * @returns {void}
     */
    function reconnectIntegration(integration) {
        _transitionIntegration(
            integration,
            item => item.reconnect()
        );
    }

    // --------------------------------------------------------------------
    // Actions — synchronization logs
    // --------------------------------------------------------------------

    /**
     * Loads synchronization logs from the API.
     *
     * @returns {void}
     */
    function fetchSyncLogs() {
        errors.value = [];

        ticketingApi.getSyncLogs()
            .then(response => {
                syncLogs.value =
                    SyncLogAssembler.toEntitiesFromResponse(response);

                syncLogsLoaded.value = true;
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    /**
     * Finds a synchronization log by identifier.
     *
     * @param {number|string} id
     * @returns {SyncLog|undefined}
     */
    function getSyncLogById(id) {
        return syncLogs.value.find(
            log =>
                String(log.getId()) === String(id)
        );
    }

    /**
     * Returns synchronization logs associated with a show.
     *
     * @param {number|string} showId
     * @returns {SyncLog[]}
     */
    function getSyncLogsByShowId(showId) {
        return syncLogs.value.filter(
            log =>
                String(log.getShowId()) === String(showId)
        );
    }

    /**
     * Creates a synchronization log.
     *
     * @param {SyncLog} syncLog
     * @returns {void}
     */
    function addSyncLog(syncLog) {
        errors.value = [];

        const resource =
            SyncLogAssembler.toResourceFromEntity(syncLog);

        ticketingApi.createSyncLog(resource)
            .then(response => {
                const newSyncLog =
                    SyncLogAssembler.toEntityFromResource(
                        response.data
                    );

                syncLogs.value.push(newSyncLog);
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    /**
     * Updates a synchronization log.
     *
     * @param {SyncLog} syncLog
     * @returns {void}
     */
    function updateSyncLog(syncLog) {
        errors.value = [];

        const resource =
            SyncLogAssembler.toResourceFromEntity(syncLog);

        ticketingApi.updateSyncLog(resource)
            .then(response => {
                const updatedSyncLog =
                    SyncLogAssembler.toEntityFromResource(
                        response.data
                    );

                const index = syncLogs.value.findIndex(
                    log =>
                        String(log.getId()) ===
                        String(updatedSyncLog.getId())
                );

                if (index !== -1) {
                    syncLogs.value[index] = updatedSyncLog;
                }
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    /**
     * Deletes a synchronization log.
     *
     * @param {SyncLog} syncLog
     * @returns {void}
     */
    function deleteSyncLog(syncLog) {
        errors.value = [];

        ticketingApi.deleteSyncLog(syncLog.getId())
            .then(() => {
                const index = syncLogs.value.findIndex(
                    log =>
                        String(log.getId()) ===
                        String(syncLog.getId())
                );

                if (index !== -1) {
                    syncLogs.value.splice(index, 1);
                }
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    /**
     * Marks a synchronization as successful.
     *
     * @param {SyncLog} syncLog
     * @returns {void}
     */
    function markSyncSuccessful(syncLog) {
        errors.value = [];

        try {
            syncLog.markSuccessful();
        } catch (domainError) {
            errors.value.push(domainError);
            return;
        }

        updateSyncLog(syncLog);
    }

    /**
     * Marks a synchronization as incomplete.
     *
     * @param {SyncLog} syncLog
     * @returns {void}
     */
    function markSyncIncomplete(syncLog) {
        errors.value = [];

        try {
            syncLog.markIncomplete();
        } catch (domainError) {
            errors.value.push(domainError);
            return;
        }

        updateSyncLog(syncLog);
    }

    /**
     * Marks a synchronization as failed.
     *
     * @param {SyncLog} syncLog
     * @param {string} details
     * @returns {void}
     */
    function markSyncFailed(syncLog, details) {
        errors.value = [];

        try {
            syncLog.markFailed(details);
        } catch (domainError) {
            errors.value.push(domainError);
            return;
        }

        updateSyncLog(syncLog);
    }

    // --------------------------------------------------------------------
    // Actions — show occupancies
    // --------------------------------------------------------------------

    /**
     * Loads synchronized show occupancy information.
     *
     * @returns {void}
     */
    function fetchShowOccupancies() {
        errors.value = [];

        ticketingApi.getShowOccupancies()
            .then(response => {
                showOccupancies.value =
                    ShowOccupancyAssembler.toEntitiesFromResponse(
                        response
                    );

                showOccupanciesLoaded.value = true;
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    /**
     * Finds a show occupancy by identifier.
     *
     * @param {number|string} id
     * @returns {ShowOccupancy|undefined}
     */
    function getShowOccupancyById(id) {
        return showOccupancies.value.find(
            occupancy =>
                String(occupancy.getId()) === String(id)
        );
    }

    /**
     * Finds occupancy information for a show.
     *
     * @param {number|string} showId
     * @returns {ShowOccupancy|undefined}
     */
    function getShowOccupancyByShowId(showId) {
        return showOccupancies.value.find(
            occupancy =>
                String(occupancy.getShowId()) ===
                String(showId)
        );
    }

    /**
     * Creates show occupancy information.
     *
     * @param {ShowOccupancy} occupancy
     * @returns {void}
     */
    function addShowOccupancy(occupancy) {
        errors.value = [];

        const resource =
            ShowOccupancyAssembler.toResourceFromEntity(occupancy);

        ticketingApi.createShowOccupancy(resource)
            .then(response => {
                const newOccupancy =
                    ShowOccupancyAssembler.toEntityFromResource(
                        response.data
                    );

                showOccupancies.value.push(newOccupancy);
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    /**
     * Updates show occupancy information.
     *
     * @param {ShowOccupancy} occupancy
     * @returns {void}
     */
    function updateShowOccupancy(occupancy) {
        errors.value = [];

        const resource =
            ShowOccupancyAssembler.toResourceFromEntity(occupancy);

        ticketingApi.updateShowOccupancy(resource)
            .then(response => {
                const updatedOccupancy =
                    ShowOccupancyAssembler.toEntityFromResource(
                        response.data
                    );

                const index = showOccupancies.value.findIndex(
                    item =>
                        String(item.getId()) ===
                        String(updatedOccupancy.getId())
                );

                if (index !== -1) {
                    showOccupancies.value[index] =
                        updatedOccupancy;
                }
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    /**
     * Deletes show occupancy information.
     *
     * @param {ShowOccupancy} occupancy
     * @returns {void}
     */
    function deleteShowOccupancy(occupancy) {
        errors.value = [];

        ticketingApi.deleteShowOccupancy(
            occupancy.getId()
        )
            .then(() => {
                const index = showOccupancies.value.findIndex(
                    item =>
                        String(item.getId()) ===
                        String(occupancy.getId())
                );

                if (index !== -1) {
                    showOccupancies.value.splice(index, 1);
                }
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    /**
     * Updates the occupied seat count through the domain entity.
     *
     * @param {ShowOccupancy} occupancy
     * @param {number} occupiedSeats
     * @returns {void}
     */
    function updateOccupancy(occupancy, occupiedSeats) {
        errors.value = [];

        try {
            occupancy.updateOccupancy(occupiedSeats);
        } catch (domainError) {
            errors.value.push(domainError);
            return;
        }

        updateShowOccupancy(occupancy);
    }

    // --------------------------------------------------------------------
    // Return
    // --------------------------------------------------------------------

    return {
        // State
        ticketingIntegrations,
        syncLogs,
        showOccupancies,
        errors,

        // Load flags
        ticketingIntegrationsLoaded,
        syncLogsLoaded,
        showOccupanciesLoaded,

        // Computed
        ticketingIntegrationsCount,
        connectedIntegrationsCount,
        syncLogsCount,
        showOccupanciesCount,

        // Ticketing integrations
        fetchTicketingIntegrations,
        getTicketingIntegrationById,
        getTicketingIntegrationsByCinemaId,
        getConnectedIntegrations,
        addTicketingIntegration,
        updateTicketingIntegration,
        deleteTicketingIntegration,

        // Connection lifecycle
        connectIntegration,
        disconnectIntegration,
        reconnectIntegration,

        // Synchronization logs
        fetchSyncLogs,
        getSyncLogById,
        getSyncLogsByShowId,
        addSyncLog,
        updateSyncLog,
        deleteSyncLog,
        markSyncSuccessful,
        markSyncIncomplete,
        markSyncFailed,

        // Show occupancies
        fetchShowOccupancies,
        getShowOccupancyById,
        getShowOccupancyByShowId,
        addShowOccupancy,
        updateShowOccupancy,
        deleteShowOccupancy,
        updateOccupancy,
    };
});

export default useTicketingStore;