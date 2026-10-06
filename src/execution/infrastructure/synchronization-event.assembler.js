import {SynchronizationEvent}
    from "../domain/model/synchronization-event.entity.js";

export class SynchronizationEventAssembler {

    static toEntityFromResource(resource) {
        return new SynchronizationEvent({
            id: resource.id ?? null,

            expectedTimeCode:
                resource.expectedTimeCode ?? 0,

            actualTimeCode:
                resource.actualTimeCode ?? 0,

            driftMilliseconds:
                resource.driftMilliseconds ?? null,

            occurredAt:
                resource.occurredAt ??
                resource.loggedAt ??
                new Date()
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
            : response.data["synchronizationEvents"];

        return resources.map(
            resource => this.toEntityFromResource(resource)
        );
    }

    static toResourceFromEntity(event) {
        return {
            id: event.getId(),
            expectedTimeCode: event.getExpectedTimeCode(),
            actualTimeCode: event.getActualTimeCode(),
            driftMilliseconds: event.getDriftMilliseconds(),
            occurredAt: event.getOccurredAtFormatted()
        };
    }
}