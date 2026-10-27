import {SeatAllocation}
    from "../domain/model/seat-allocation.entity.js";

import {ShowSeatAssembler}
    from "./show-seat.assembler.js";

import {ManualInterventionAssembler}
    from "./manual-intervention.assembler.js";

/**
 * @class SeatAllocationAssembler
 * @summary Converts seat allocation API resources to entities and back.
 */
export class SeatAllocationAssembler {

    static toEntityFromResource(resource) {
        return new SeatAllocation({
            id: resource.id ?? null,
            showId: resource.showId ?? null,
            status: resource.status ?? "PENDING",

            seats: Array.isArray(resource.seats)
                ? resource.seats.map(
                    ShowSeatAssembler.toEntityFromResource
                )
                : [],

            interventions: Array.isArray(resource.interventions)
                ? resource.interventions.map(
                    ManualInterventionAssembler.toEntityFromResource
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
            : response.data["seatAllocations"];

        return resources.map(
            resource => this.toEntityFromResource(resource)
        );
    }

    static toResourceFromEntity(allocation) {
        const resource = {
            id: allocation.getId(),
            showId: allocation.getShowId(),
            status: allocation.getStatusAsString()
        };

        if (allocation.getSeats().length > 0) {
            resource.seats = allocation
                .getSeats()
                .map(ShowSeatAssembler.toResourceFromEntity);
        }

        if (allocation.getInterventions().length > 0) {
            resource.interventions = allocation
                .getInterventions()
                .map(
                    ManualInterventionAssembler
                        .toResourceFromEntity
                );
        }

        return resource;
    }
}