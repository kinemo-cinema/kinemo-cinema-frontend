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

        const rawStatus =
            resource.status ??
            resource.executionStatus ??
            "READY";

        const normalizedStatus = {
            CONCLUDED: "COMPLETED",
            STARTED: "RUNNING",
            IN_PROGRESS: "RUNNING",
            EMERGENCY: "EMERGENCY_STOPPED"
        }[rawStatus] ?? rawStatus;

        return new ShowExecution({
            id: resource.id ?? null,

            showId: resource.showId ?? null,

            sensoryContentId:
                resource.sensoryContentId ?? null,

            status: normalizedStatus,

            startedAt:
                resource.startedAt ?? null,

            finishedAt:
                resource.finishedAt ??
                resource.concludedAt ??
                null,

            sequences:
                Array.isArray(resource.sequences)
                    ? resource.sequences.map(
                        resourceItem =>
                            SensorySequenceExecutionAssembler
                                .toEntityFromResource(resourceItem)
                    )
                    : [],

            synchronizationEvents:
                Array.isArray(resource.synchronizationEvents)
                    ? resource.synchronizationEvents.map(
                        resourceItem =>
                            SynchronizationEventAssembler
                                .toEntityFromResource(resourceItem)
                    )
                    : [],

            hardwareLogs:
                Array.isArray(resource.hardwareLogs)
                    ? resource.hardwareLogs.map(
                        resourceItem =>
                            HardwareExecutionLogAssembler
                                .toEntityFromResource(resourceItem)
                    )
                    : [],

            emergencyEvents:
                Array.isArray(resource.emergencyEvents)
                    ? resource.emergencyEvents.map(
                        resourceItem =>
                            EmergencyEventAssembler
                                .toEntityFromResource(resourceItem)
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

        const resources =
            response.data instanceof Array
                ? response.data
                : response.data["showExecutions"] ?? [];

        return resources.map(
            resource =>
                this.toEntityFromResource(resource)
        );
    }

    static toResourceFromEntity(execution) {

        const resource = {
            id: execution.getId(),

            showId:
                execution.getShowId(),

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
                    sequence =>
                        SensorySequenceExecutionAssembler
                            .toResourceFromEntity(sequence)
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
                        event =>
                            SynchronizationEventAssembler
                                .toResourceFromEntity(event)
                    );
        }

        if (execution.getHardwareLogs().length > 0) {
            resource.hardwareLogs =
                execution.getHardwareLogs().map(
                    log =>
                        HardwareExecutionLogAssembler
                            .toResourceFromEntity(log)
                );
        }

        if (execution.getEmergencyEvents().length > 0) {
            resource.emergencyEvents =
                execution.getEmergencyEvents().map(
                    event =>
                        EmergencyEventAssembler
                            .toResourceFromEntity(event)
                );
        }

        return resource;
    }
}