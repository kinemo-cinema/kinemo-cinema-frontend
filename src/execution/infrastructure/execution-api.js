import {BaseApi} from "../../shared/infrastructure/base-api.js";
import {BaseEndpoint} from "../../shared/infrastructure/base-endpoint.js";

const showExecutionsEndpointPath =
    import.meta.env.VITE_SHOW_EXECUTIONS_ENDPOINT_PATH;

const sensorySequencesEndpointPath =
    import.meta.env.VITE_SENSORY_SEQUENCE_EXECUTIONS_ENDPOINT_PATH;

const synchronizationEventsEndpointPath =
    import.meta.env.VITE_SYNCHRONIZATION_EVENTS_ENDPOINT_PATH;

const hardwareLogsEndpointPath =
    import.meta.env.VITE_HARDWARE_EXECUTION_LOGS_ENDPOINT_PATH;

const emergencyEventsEndpointPath =
    import.meta.env.VITE_EMERGENCY_EVENTS_ENDPOINT_PATH;

export class ExecutionApi extends BaseApi {

    #showExecutionsEndpoint;
    #sensorySequencesEndpoint;
    #synchronizationEventsEndpoint;
    #hardwareLogsEndpoint;
    #emergencyEventsEndpoint;

    constructor() {
        super();

        this.#showExecutionsEndpoint =
            new BaseEndpoint(this, showExecutionsEndpointPath);

        this.#sensorySequencesEndpoint =
            new BaseEndpoint(this, sensorySequencesEndpointPath);

        this.#synchronizationEventsEndpoint =
            new BaseEndpoint(this, synchronizationEventsEndpointPath);

        this.#hardwareLogsEndpoint =
            new BaseEndpoint(this, hardwareLogsEndpointPath);

        this.#emergencyEventsEndpoint =
            new BaseEndpoint(this, emergencyEventsEndpointPath);
    }

    getShowExecutions() {
        return this.#showExecutionsEndpoint.getAll();
    }

    getShowExecutionById(id) {
        return this.#showExecutionsEndpoint.getById(id);
    }

    createShowExecution(resource) {
        return this.#showExecutionsEndpoint.create(resource);
    }

    updateShowExecution(resource) {
        return this.#showExecutionsEndpoint.update(
            resource.id,
            resource
        );
    }

    deleteShowExecution(id) {
        return this.#showExecutionsEndpoint.delete(id);
    }

    getSensorySequenceExecutions() {
        return this.#sensorySequencesEndpoint.getAll();
    }

    getSynchronizationEvents() {
        return this.#synchronizationEventsEndpoint.getAll();
    }

    createSynchronizationEvent(resource) {
        return this.#synchronizationEventsEndpoint.create(resource);
    }

    getHardwareExecutionLogs() {
        return this.#hardwareLogsEndpoint.getAll();
    }

    createHardwareExecutionLog(resource) {
        return this.#hardwareLogsEndpoint.create(resource);
    }

    getEmergencyEvents() {
        return this.#emergencyEventsEndpoint.getAll();
    }

    createEmergencyEvent(resource) {
        return this.#emergencyEventsEndpoint.create(resource);
    }

    updateEmergencyEvent(resource) {
        return this.#emergencyEventsEndpoint.update(
            resource.id,
            resource
        );
    }
}