import {RoomBlock} from "../domain/model/room-block.entity.js";

/**
 * @class RoomBlockAssembler
 * @summary Converts room block API resources to entities and back.
 *
 * @remarks
 * The mock API stores room blocks under the key `maintenanceBlocks` and
 * uses the field name `description` where the domain uses `reason`. The
 * assembler bridges that naming mismatch so the domain stays consistent
 * and the persistence layer stays untouched.
 */
export class RoomBlockAssembler {

    /**
     * Converts a room block resource to a RoomBlock entity.
     * @static
     * @param {Object} resource - The block resource from the API.
     * @returns {RoomBlock} The RoomBlock entity.
     */
    static toEntityFromResource(resource) {
        return new RoomBlock({
            id: resource.id ?? null,
            roomId: resource.roomId ?? null,
            reason: resource.description ?? resource.reason ?? '',
            startTime: resource.startTime ?? null,
            endTime: resource.endTime ?? null,
            status: resource.status ?? 'SCHEDULED',
        });
    }

    /**
     * Converts an API response to an array of RoomBlock entities.
     * @static
     * @param {Object} response - The API response object.
     * @returns {RoomBlock[]} Array of RoomBlock entities.
     */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return [];
        }
        const resources = response.data instanceof Array
            ? response.data
            : response.data['maintenanceBlocks'];
        return resources.map(resource => this.toEntityFromResource(resource));
    }

    /**
     * Converts a RoomBlock entity to a resource for API submission.
     *
     * The domain's `reason` field is written to the resource's
     * `description` field, matching the mock API's schema.
     *
     * @static
     * @param {RoomBlock} block - The RoomBlock entity.
     * @returns {Object} The room block resource.
     */
    static toResourceFromEntity(block) {
        return {
            id: block.getId(),
            roomId: block.getRoomId(),
            startTime: block.getStartTimeAsISO(),
            endTime: block.getEndTimeAsISO(),
            description: block.getReason(),
            status: block.getStatusAsString(),
        };
    }
}