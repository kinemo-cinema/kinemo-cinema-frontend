import {defineStore} from "pinia";
import {computed, ref} from "vue";

import {ExecutionApi}
    from "../infrastructure/execution-api.js";

import {ShowExecutionAssembler}
    from "../infrastructure/show-execution.assembler.js";

import {SensorySequenceExecutionAssembler}
    from "../infrastructure/sensory-sequence-execution.assembler.js";

import {SynchronizationEventAssembler}
    from "../infrastructure/synchronization-event.assembler.js";

import {HardwareExecutionLogAssembler}
    from "../infrastructure/hardware-execution-log.assembler.js";

import {EmergencyEventAssembler}
    from "../infrastructure/emergency-event.assembler.js";

const executionApi = new ExecutionApi();

const useExecutionStore = defineStore("execution", () => {

    const showExecutions = ref([]);
    const sensorySequences = ref([]);
    const synchronizationEvents = ref([]);
    const hardwareLogs = ref([]);
    const emergencyEvents = ref([]);

    const errors = ref([]);

    const showExecutionsLoaded = ref(false);
    const sensorySequencesLoaded = ref(false);
    const synchronizationEventsLoaded = ref(false);
    const hardwareLogsLoaded = ref(false);
    const emergencyEventsLoaded = ref(false);

    const showExecutionsCount = computed(() =>
        showExecutionsLoaded.value
            ? showExecutions.value.length
            : 0
    );

    function fetchShowExecutions() {
        errors.value = [];

        executionApi.getShowExecutions()
            .then(response => {
                showExecutions.value =
                    ShowExecutionAssembler
                        .toEntitiesFromResponse(response);

                showExecutionsLoaded.value = true;
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    function getShowExecutionById(id) {
        const idNum = parseInt(id);

        return showExecutions.value.find(
            execution => execution.getId() === idNum
        );
    }

    function addShowExecution(execution) {
        errors.value = [];

        const resource =
            ShowExecutionAssembler
                .toResourceFromEntity(execution);

        executionApi.createShowExecution(resource)
            .then(response => {
                showExecutions.value.push(
                    ShowExecutionAssembler
                        .toEntityFromResource(response.data)
                );
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    function updateShowExecution(execution) {
        errors.value = [];

        const resource =
            ShowExecutionAssembler
                .toResourceFromEntity(execution);

        return executionApi.updateShowExecution(resource)
            .then(response => {
                const updated =
                    ShowExecutionAssembler
                        .toEntityFromResource(response.data);

                const index =
                    showExecutions.value.findIndex(
                        current =>
                            current.getId() === updated.getId()
                    );

                if (index !== -1) {
                    showExecutions.value[index] = updated;
                }

                return updated;
            })
            .catch(error => {
                errors.value.push(error);
                throw error;
            });
    }

    function startExecution(execution) {
        try {
            execution.start();
            return updateShowExecution(execution);
        } catch (error) {
            errors.value.push(error);
        }
    }

    function pauseExecution(execution) {
        try {
            execution.pause();
            return updateShowExecution(execution);
        } catch (error) {
            errors.value.push(error);
        }
    }

    function resumeExecution(execution) {
        try {
            execution.resume();
            return updateShowExecution(execution);
        } catch (error) {
            errors.value.push(error);
        }
    }

    function finishExecution(execution) {
        try {
            execution.finish();
            return updateShowExecution(execution);
        } catch (error) {
            errors.value.push(error);
        }
    }

    function emergencyStop(execution, reason) {
        try {
            execution.emergencyStop(reason);
            return updateShowExecution(execution);
        } catch (error) {
            errors.value.push(error);
        }
    }

    function restoreExecution(execution) {
        try {
            execution.restore();
            return updateShowExecution(execution);
        } catch (error) {
            errors.value.push(error);
        }
    }

    function fetchSensorySequences() {
        executionApi.getSensorySequenceExecutions()
            .then(response => {
                sensorySequences.value =
                    SensorySequenceExecutionAssembler
                        .toEntitiesFromResponse(response);

                sensorySequencesLoaded.value = true;
            })
            .catch(error => errors.value.push(error));
    }

    function fetchSynchronizationEvents() {
        executionApi.getSynchronizationEvents()
            .then(response => {
                synchronizationEvents.value =
                    SynchronizationEventAssembler
                        .toEntitiesFromResponse(response);

                synchronizationEventsLoaded.value = true;
            })
            .catch(error => errors.value.push(error));
    }

    function fetchHardwareLogs() {
        executionApi.getHardwareExecutionLogs()
            .then(response => {
                hardwareLogs.value =
                    HardwareExecutionLogAssembler
                        .toEntitiesFromResponse(response);

                hardwareLogsLoaded.value = true;
            })
            .catch(error => errors.value.push(error));
    }

    function fetchEmergencyEvents() {
        executionApi.getEmergencyEvents()
            .then(response => {
                emergencyEvents.value =
                    EmergencyEventAssembler
                        .toEntitiesFromResponse(response);

                emergencyEventsLoaded.value = true;
            })
            .catch(error => errors.value.push(error));
    }

    return {
        showExecutions,
        sensorySequences,
        synchronizationEvents,
        hardwareLogs,
        emergencyEvents,

        errors,

        showExecutionsLoaded,
        sensorySequencesLoaded,
        synchronizationEventsLoaded,
        hardwareLogsLoaded,
        emergencyEventsLoaded,

        showExecutionsCount,

        fetchShowExecutions,
        getShowExecutionById,
        addShowExecution,
        updateShowExecution,

        startExecution,
        pauseExecution,
        resumeExecution,
        finishExecution,
        emergencyStop,
        restoreExecution,

        fetchSensorySequences,
        fetchSynchronizationEvents,
        fetchHardwareLogs,
        fetchEmergencyEvents
    };
});

export {useExecutionStore};