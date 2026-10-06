import {ShowOccupancy} from "../domain/model/show-occupancy.entity.js";

/**
 * @class ShowOccupancyAssembler
 * @summary Converts show occupancy API resources to entities and back.
 */
export class ShowOccupancyAssembler {

    /**
     * Converts a show occupancy resource to a ShowOccupancy entity.
     *
     * @static
     * @param {Object} resource - The show occupancy resource from the API.
     * @returns {ShowOccupancy} The ShowOccupancy entity.
     */
    static toEntityFromResource(resource) {
        return new ShowOccupancy({
            occupancyId: resource.id ?? null,
            showId: resource.showId ?? null,
            totalSeats: resource.totalSeats ?? 0,
            occupiedSeats: resource.occupiedSeats ?? 0,
            lastUpdatedAt: resource.lastUpdatedAt ?? null,
        });
    }

    /**
     * Converts an API response to an array of ShowOccupancy entities.
     *
     * @static
     * @param {Object} response - The API response object.
     * @returns {ShowOccupancy[]} Array of ShowOccupancy entities.
     */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return [];
        }

        const resources = response.data instanceof Array
            ? response.data
            : response.data['showOccupancies'];

        return resources.map(resource =>
            this.toEntityFromResource(resource)
        );
    }

    /**
     * Converts a ShowOccupancy entity to a resource for API submission.
     *
     * @static
     * @param {ShowOccupancy} occupancy - The ShowOccupancy entity.
     * @returns {Object} The show occupancy resource.
     */
    static toResourceFromEntity(occupancy) {
        return {
            id: occupancy.getId(),
            showId: occupancy.getShowId(),
            totalSeats: occupancy.getTotalSeats(),
            occupiedSeats: occupancy.getOccupiedSeats(),
            lastUpdatedAt: occupancy.getLastUpdatedAt()?.toISOString() ?? null,
        };
    }
}