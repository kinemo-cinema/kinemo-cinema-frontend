import {ManualIntervention}
    from "../domain/model/manual-intervention.entity.js";

/**
 * @class ManualInterventionAssembler
 * @summary Converts manual intervention API resources to entities and back.
 */
export class ManualInterventionAssembler {

    static toEntityFromResource(resource) {
        return new ManualIntervention({
            id: resource.id ?? null,
            seatId: resource.seatId ?? null,
            operatorId: resource.operatorId ?? null,
            reason: resource.reason ?? "",
            interventionDate: resource.interventionDate ?? null
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
            : response.data["manualInterventions"];

        return resources.map(
            resource => this.toEntityFromResource(resource)
        );
    }

    static toResourceFromEntity(intervention) {
        return {
            id: intervention.getId(),
            seatId: intervention.getSeatId(),
            operatorId: intervention.getOperatorId(),
            reason: intervention.getReason(),
            interventionDate:
                intervention.getInterventionDateFormatted()
        };
    }
}