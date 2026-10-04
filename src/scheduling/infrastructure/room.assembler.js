import {Room} from "../domain/model/room.entity.js";

/**
 * @class RoomAssembler
 * @summary Converts room API resources to entities and back.
 *
 * @remarks
 * Part of the temporary minimal room slice. Will move to BC03 when the
 * full Room aggregate is implemented.
 */
export class RoomAssembler {

    /**
     * Converts a room resource to a Room entity.
     * @static
     * @param {Object} resource - The room resource from the API.
     * @returns {Room} The Room entity.
     */
    static toEntityFromResource(resource) {
        return new Room({
            id: resource.id ?? null,
            name: resource.name ?? '',
            status: resource.status ?? 'AVAILABLE',
            operationalStatus: resource.operationalStatus ?? 'READY',
        });
    }

    /**
     * Converts an API response to an array of Room entities.
     * @static
     * @param {Object} response - The API response object.
     * @returns {Room[]} Array of Room entities.
     */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return [];
        }
        const resources = response.data instanceof Array ? response.data : response.data['rooms'];
        return resources.map(resource => this.toEntityFromResource(resource));
    }

    /**
     * Converts a Room entity to a resource for API submission.
     * @static
     * @param {Room} room - The Room entity.
     * @returns {Object} The room resource.
     */
    static toResourceFromEntity(room) {
        return {
            id: room.getId(),
            name: room.getName(),
            status: room.getStatus(),
            operationalStatus: room.getOperationalStatus(),
        };
    }
}