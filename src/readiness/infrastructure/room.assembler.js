import {Room} from "../domain/model/room.entity.js";
import {RoomInspectionAssembler} from "./room-inspection.assembler.js";
import {RoomBlockAssembler} from "./room-block.assembler.js";

/**
 * @class RoomAssembler
 * @summary Converts room API resources to entities and back.
 *
 * @remarks
 * A room owns its inspections and blocks. Because the mock API stores
 * each collection flat, the assembler accepts optional child arrays so
 * the store can join them client-side before building the aggregate.
 * When a caller provides neither, the room is built with empty child
 * collections.
 */
export class RoomAssembler {

    /**
     * Converts a room resource to a Room entity.
     *
     * @static
     * @param {Object} resource - The room resource from the API.
     * @param {Object} [extras] - Optional child collections.
     * @param {Array<Object>} [extras.inspections] - Raw inspection resources for this room.
     * @param {Array<Object>} [extras.blocks] - Raw block resources for this room.
     * @returns {Room} The Room entity.
     */
    static toEntityFromResource(resource, { inspections = [], blocks = [] } = {}) {
        return new Room({
            id: resource.id ?? null,
            name: resource.name ?? '',
            capacity: resource.capacity ?? 0,
            status: resource.status ?? 'AVAILABLE',
            inspections: inspections.map(RoomInspectionAssembler.toEntityFromResource),
            blocks: blocks.map(RoomBlockAssembler.toEntityFromResource),
            createdAt: resource.createdAt ?? null,
            updatedAt: resource.updatedAt ?? null,
        });
    }

    /**
     * Converts an API response to an array of Room entities.
     *
     * @static
     * @param {Object} response - The API response object.
     * @param {Object} [extras] - Optional child collections keyed by room ID.
     * @param {Map<number, Array>} [extras.inspectionsByRoomId] - Inspections indexed by room.
     * @param {Map<number, Array>} [extras.blocksByRoomId] - Blocks indexed by room.
     * @returns {Room[]} Array of Room entities.
     */
    static toEntitiesFromResponse(response, extras = {}) {
        if (response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return [];
        }
        const resources = response.data instanceof Array
            ? response.data
            : response.data['rooms'];

        const { inspectionsByRoomId = new Map(), blocksByRoomId = new Map() } = extras;

        return resources.map(resource => {
            const roomId = resource.id;
            return this.toEntityFromResource(resource, {
                inspections: inspectionsByRoomId.get(roomId) ?? [],
                blocks: blocksByRoomId.get(roomId) ?? [],
            });
        });
    }

    /**
     * Converts a Room entity to a resource for API submission.
     *
     * Child collections are intentionally omitted — the mock API stores
     * inspections and blocks in their own collections, and the store is
     * responsible for persisting them separately through the dedicated
     * endpoints.
     *
     * @static
     * @param {Room} room - The Room entity.
     * @returns {Object} The room resource.
     */
    static toResourceFromEntity(room) {
        return {
            id: room.getId(),
            name: room.getName(),
            capacity: room.getCapacity(),
            status: room.getStatusAsString(),
            createdAt: room.getCreatedAtFormated(),
            updatedAt: room.getUpdatedAtFormated(),
        };
    }
}