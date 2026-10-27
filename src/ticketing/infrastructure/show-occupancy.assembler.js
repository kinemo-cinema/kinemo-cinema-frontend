import {ShowOccupancy} from "../domain/model/show-occupancy.entity.js";

/**
 * @class ShowOccupancyAssembler
 * @summary Converts show occupancy API resources to entities and back.
 */
export class ShowOccupancyAssembler {

    static toEntityFromResource(resource) {
        return new ShowOccupancy({
            id: resource.id ?? null,
            showId: resource.showId ?? null,
            lastSyncLogId: resource.lastSyncLogId ?? null,
            totalCapacity: resource.totalCapacity ?? 0,
            occupiedSeats: resource.occupiedSeats ?? 0,
            lastUpdatedAt: resource.lastUpdatedAt ?? null,
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
                : response.data?.showOccupancies ?? [];

        return resources.map(resource =>
            this.toEntityFromResource(resource)
        );
    }

    static toResourceFromEntity(occupancy) {
        return {
            id: occupancy.getId(),
            showId: occupancy.getShowId(),
            lastSyncLogId: occupancy.getLastSyncLogId(),
            totalCapacity: occupancy.getTotalCapacity(),
            occupiedSeats: occupancy.getOccupiedSeats(),
            lastUpdatedAt:
                occupancy
                    .getLastUpdatedAt()
                    ?.toISOString() ?? null,
        };
    }
}