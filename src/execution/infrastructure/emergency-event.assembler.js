import {EmergencyEvent}
    from "../domain/model/emergency-event.entity.js";

export class EmergencyEventAssembler {

    static toEntityFromResource(resource) {
        return new EmergencyEvent({
            id: resource.id ?? null,
            reason: resource.reason ?? "",

            triggeredAt:
                resource.triggeredAt ??
                resource.activatedAt ??
                null,

            resolvedAt:
                resource.resolvedAt ?? null,

            status:
                resource.status ??
                resource.emergencyStatus ??
                "ACTIVATED"
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
            : response.data["emergencyEvents"];

        return resources.map(
            resource => this.toEntityFromResource(resource)
        );
    }

    static toResourceFromEntity(event) {
        return {
            id: event.getId(),
            reason: event.getReason(),
            triggeredAt: event.getTriggeredAtFormatted(),
            resolvedAt: event.getResolvedAtFormatted(),
            status: event.getStatusAsString()
        };
    }
}