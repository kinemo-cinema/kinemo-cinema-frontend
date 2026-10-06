import {ShowExecution}
    from "../domain/model/show-execution.entity.js";

import {SensorySequenceExecutionAssembler}
    from "./sensory-sequence-execution.assembler.js";

import {SynchronizationEventAssembler}
    from "./synchronization-event.assembler.js";

import {HardwareExecutionLogAssembler}
    from "./hardware-execution-log.assembler.js";

import {EmergencyEventAssembler}
    from "./emergency-event.assembler.js";

export class ShowExecutionAssembler {

    static toEntityFromResource(resource) {
        return new ShowExecution({
            id: resource.id ?? null,

            showId: resource.showId ?? null,

            sensoryContentId:
                resource.sensoryContentId ?? null,

            status:
                resource.status ??
                resource.executionStatus ??
                "READY",

            startedAt:
                resource.startedAt ?? null,

            finishedAt:
                resource.finishedAt ??
                resource.concludedAt ??
                null,

            sequences:
                Array.isArray(resource.sequences)
                    ? resource.sequences.map(
                        SensorySequenceExecutionAssembler
                            .toEntityFromResource
                    )
                    : [],

            synchronizationEvents:
                Array.isArray(resource.synchronizationEvents)
                    ? resource.synchronizationEvents.map(
                        SynchronizationEventAssembler
                            .toEntityFromResource
                    )
                    : [],

            hardwareLogs:
                Array.isArray(resource.hardwareLogs)
                    ? resource.hardwareLogs.map(
                        HardwareExecutionLogAssembler
                            .toEntityFromResource
                    )
                    : [],

            emergencyEvents:
                Array.isArray(resource.emergencyEvents)
                    ? resource.emergencyEvents.map(
                        EmergencyEventAssembler
                            .toEntityFromResource
                    )
                    : []
        });
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(
                `${response.status}: ${response.statusText}`
            );
            return [];
        }

        const resources = response.data instanceof Array
            ? response.data
            : response.data["showExecutions"];

        return resources.map(
            resource => this.toEntityFromResource(resource)
        );
    }

    static toResourceFromEntity(execution) {
        const resource = {
            id: execution.getId(),
            showId: execution.getShowId(),
            sensoryContentId:
                execution.getSensoryContentId(),
            status:
                execution.getStatusAsString(),
            startedAt:
                execution.getStartedAtFormatted(),
            finishedAt:
                execution.getFinishedAtFormatted()
        };

        if (execution.getSequences().length > 0) {
            resource.sequences =
                execution.getSequences().map(
                    SensorySequenceExecutionAssembler
                        .toResourceFromEntity
                );
        }

        if (
            execution
                .getSynchronizationEvents()
                .length > 0
        ) {
            resource.synchronizationEvents =
                execution
                    .getSynchronizationEvents()
                    .map(
                        SynchronizationEventAssembler
                            .toResourceFromEntity
                    );
        }

        if (execution.getHardwareLogs().length > 0) {
            resource.hardwareLogs =
                execution.getHardwareLogs().map(
                    HardwareExecutionLogAssembler
                        .toResourceFromEntity
                );
        }

        if (execution.getEmergencyEvents().length > 0) {
            resource.emergencyEvents =
                execution.getEmergencyEvents().map(
                    EmergencyEventAssembler
                        .toResourceFromEntity
                );
        }

        return resource;
    }
}