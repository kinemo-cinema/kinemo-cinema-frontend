import {ScheduleConflict} from "../domain/model/schedule-conflict.entity.js";

/**
 * @class ScheduleConflictAssembler
 * @summary Converts schedule conflict API resources to entities and back.
 */
export class ScheduleConflictAssembler {

    /**
     * Converts a schedule conflict resource to a ScheduleConflict entity.
     * @static
     * @param {Object} resource - The conflict resource from the API.
     * @returns {ScheduleConflict} The ScheduleConflict entity.
     */
    static toEntityFromResource(resource) {
        return new ScheduleConflict({
            id: resource.id ?? null,
            showId: resource.showId ?? null,
            conflictingShowId: resource.conflictingShowId ?? null,
            detectedAt: resource.detectedAt ?? null,
            description: resource.description ?? '',
            resolved: resource.resolved ?? false,
            resolvedAt: resource.resolvedAt ?? null,
        });
    }

    /**
     * Converts an API response to an array of ScheduleConflict entities.
     * @static
     * @param {Object} response - The API response object.
     * @returns {ScheduleConflict[]} Array of ScheduleConflict entities.
     */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return [];
        }
        const resources = response.data instanceof Array
            ? response.data
            : response.data['scheduleConflicts'];
        return resources.map(resource => this.toEntityFromResource(resource));
    }

    /**
     * Converts a ScheduleConflict entity to a resource for API submission.
     * @static
     * @param {ScheduleConflict} conflict - The ScheduleConflict entity.
     * @returns {Object} The schedule conflict resource.
     */
    static toResourceFromEntity(conflict) {
        return {
            id: conflict.getId(),
            showId: conflict.getShowId(),
            conflictingShowId: conflict.getConflictingShowId(),
            detectedAt: conflict.getDetectedAtFormated(),
            description: conflict.getDescription(),
            resolved: conflict.isResolved(),
            resolvedAt: conflict.getResolvedAtFormated(),
        };
    }
}