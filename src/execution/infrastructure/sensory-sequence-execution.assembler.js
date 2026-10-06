import {SensorySequenceExecution}
    from "../domain/model/sensory-sequence-execution.entity.js";

export class SensorySequenceExecutionAssembler {

    static toEntityFromResource(resource) {
        return new SensorySequenceExecution({
            id: resource.id ?? null,
            sensoryTrackId: resource.sensoryTrackId ?? null,
            currentTimeCode: resource.currentTimeCode ?? 0,
            status:
                resource.status ??
                resource.playbackStatus ??
                "PENDING"
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
            : response.data["sensorySequenceExecutions"];

        return resources.map(
            resource => this.toEntityFromResource(resource)
        );
    }

    static toResourceFromEntity(sequence) {
        return {
            id: sequence.getId(),
            sensoryTrackId: sequence.getSensoryTrackId(),
            currentTimeCode: sequence.getCurrentTimeCode(),
            status: sequence.getStatusAsString()
        };
    }
}