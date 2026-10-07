import {RoomInspection} from "../domain/model/room-inspection.entity.js";

/**
 * @class RoomInspectionAssembler
 * @summary Converts room inspection API resources to entities and back.
 */
export class RoomInspectionAssembler {

    /**
     * Converts a room inspection resource to a RoomInspection entity.
     * @static
     * @param {Object} resource - The inspection resource from the API.
     * @returns {RoomInspection} The RoomInspection entity.
     */
    static toEntityFromResource(resource) {
        return new RoomInspection({
            id: resource.id ?? null,
            roomId: resource.roomId ?? null,
            inspectorId: resource.inspectorId ?? null,
            inspectionStatus: resource.inspectionStatus ?? 'PENDING',
            technicalReviewRequired: resource.technicalReviewRequired ?? false,
            inspectedAt: resource.inspectedAt ?? null,
        });
    }

    /**
     * Converts an API response to an array of RoomInspection entities.
     * @static
     * @param {Object} response - The API response object.
     * @returns {RoomInspection[]} Array of RoomInspection entities.
     */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return [];
        }
        const resources = response.data instanceof Array
            ? response.data
            : response.data['roomInspections'];
        return resources.map(resource => this.toEntityFromResource(resource));
    }

    /**
     * Converts a RoomInspection entity to a resource for API submission.
     * @static
     * @param {RoomInspection} inspection - The RoomInspection entity.
     * @returns {Object} The room inspection resource.
     */
    static toResourceFromEntity(inspection) {
        return {
            id: inspection.getId(),
            roomId: inspection.getRoomId(),
            inspectorId: inspection.getInspectorId(),
            inspectionStatus: inspection.getStatusAsString(),
            technicalReviewRequired: inspection.requiresTechnicalReview(),
            inspectedAt: inspection.getInspectedAtFormated(),
        };
    }
}