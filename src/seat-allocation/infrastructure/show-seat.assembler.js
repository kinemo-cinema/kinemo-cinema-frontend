import {ShowSeat} from "../domain/model/show-seat.entity.js";

/**
 * @class ShowSeatAssembler
 * @summary Converts show seat API resources to entities and back.
 */
export class ShowSeatAssembler {

    static toEntityFromResource(resource) {
        return new ShowSeat({
            id: resource.id ?? null,
            seatId: resource.seatId ?? null,
            sold: resource.sold ?? false,
            enabled: resource.enabled ?? false,
            status: resource.status ?? "AVAILABLE"
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
            : response.data["showSeats"];

        return resources.map(
            resource => this.toEntityFromResource(resource)
        );
    }

    static toResourceFromEntity(showSeat) {
        return {
            id: showSeat.getId(),
            seatId: showSeat.getSeatId(),
            sold: showSeat.isSold(),
            enabled: showSeat.isEnabled(),
            status: showSeat.getStatusAsString()
        };
    }
}