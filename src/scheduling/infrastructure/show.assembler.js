import {Show} from "../domain/model/show.entity.js";
import {ShowSchedule} from "../domain/model/show-schedule.value-object.js";
import {ScheduleConflictAssembler} from "./schedule-conflict.assembler.js";

/**
 * @class ShowAssembler
 * @summary Converts show API resources to entities and back.
 */
export class ShowAssembler {

    /**
     * Converts a show resource to a Show entity.
     *
     * The API persists start and end times as two separate ISO 8601
     * strings. They are combined into a single `ShowSchedule` value object
     * so the aggregate can enforce start-before-end and expose overlap
     * queries.
     *
     * @static
     * @param {Object} resource - The show resource from the API.
     * @returns {Show} The Show entity.
     */
    static toEntityFromResource(resource) {
        return new Show({
            id: resource.id ?? null,
            movieId: resource.movieId ?? null,
            roomId: resource.roomId ?? null,
            assignedProfessionalId: resource.assignedProfessionalId ?? null,
            schedule: new ShowSchedule(resource.startTime, resource.endTime),
            status: resource.status ?? 'SCHEDULED',
            cancellationReason: resource.cancellationReason ?? null,
            conflicts: Array.isArray(resource.conflicts)
                ? resource.conflicts.map(ScheduleConflictAssembler.toEntityFromResource)
                : [],
            createdAt: resource.createdAt ?? null,
            updatedAt: resource.updatedAt ?? null,
        });
    }

    /**
     * Converts an API response to an array of Show entities.
     * @static
     * @param {Object} response - The API response object.
     * @returns {Show[]} Array of Show entities.
     */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return [];
        }
        const resources = response.data instanceof Array ? response.data : response.data['shows'];
        return resources.map(resource => this.toEntityFromResource(resource));
    }

    /**
     * Converts a Show entity to a resource for API submission.
     *
     * The schedule is flattened into `startTime` and `endTime` fields to
     * match the shape the mock API stores. Conflicts are only serialized
     * when the show actually owns them, so an empty collection sends
     * nothing extra.
     *
     * @static
     * @param {Show} show - The Show entity.
     * @returns {Object} The show resource.
     */
    static toResourceFromEntity(show) {
        const resource = {
            id: show.getId(),
            movieId: show.getMovieId(),
            roomId: show.getRoomId(),
            assignedProfessionalId: show.getAssignedProfessionalId(),
            startTime: show.getStartTimeAsISO(),
            endTime: show.getEndTimeAsISO(),
            status: show.getStatusAsString(),
            cancellationReason: show.getCancellationReason(),
            createdAt: show.getCreatedAtFormated(),
            updatedAt: show.getUpdatedAtFormated(),
        };

        if (show.hasConflicts()) {
            resource.conflicts = show.getConflicts()
                .map(ScheduleConflictAssembler.toResourceFromEntity);
        }

        return resource;
    }
}