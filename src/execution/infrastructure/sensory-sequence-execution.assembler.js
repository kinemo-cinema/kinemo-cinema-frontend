import {SensorySequenceExecution}
    from "../domain/model/sensory-sequence-execution.entity.js";

export class SensorySequenceExecutionAssembler {

    static toEntityFromResource(resource) {

        const rawStatus =
            resource.status ??
            resource.playbackStatus ??
            "PENDING";

        const normalizedStatus = {
            RUNNING: "EXECUTING",
            CONCLUDED: "COMPLETED"
        }[rawStatus] ?? rawStatus;

        return new SensorySequenceExecution({
            id: resource.id ?? null,

            sensoryTrackId:
                resource.sensoryTrackId ?? null,

            currentTimeCode:
                resource.currentTimeCode ?? 0,

            status: normalizedStatus
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
                : response.data["sensorySequenceExecutions"] ?? [];

        return resources.map(
            resource =>
                this.toEntityFromResource(resource)
        );
    }

    static toResourceFromEntity(sequence) {
        return {
            id: sequence.getId(),

            sensoryTrackId:
                sequence.getSensoryTrackId(),

            currentTimeCode:
                sequence.getCurrentTimeCode(),

            status:
                sequence.getStatusAsString()
        };
    }
}