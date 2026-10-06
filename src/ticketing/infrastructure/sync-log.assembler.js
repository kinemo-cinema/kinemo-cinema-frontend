import {SyncLog} from "../domain/model/sync-log.entity.js";

/**
 * @class SyncLogAssembler
 * @summary Converts synchronization log API resources to entities and back.
 */
export class SyncLogAssembler {

    /**
     * Converts a synchronization log resource to a SyncLog entity.
     *
     * @static
     * @param {Object} resource - The synchronization log resource from the API.
     * @returns {SyncLog} The SyncLog entity.
     */
    static toEntityFromResource(resource) {
        return new SyncLog({
            syncLogId: resource.id ?? null,
            showId: resource.showId ?? null,
            executedAt: resource.executedAt ?? null,
            status: resource.status ?? 'PENDING',
            errorDetails: resource.errorDetails ?? '',
        });
    }

    /**
     * Converts an API response to an array of SyncLog entities.
     *
     * @static
     * @param {Object} response - The API response object.
     * @returns {SyncLog[]} Array of SyncLog entities.
     */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return [];
        }

        const resources = response.data instanceof Array
            ? response.data
            : response.data['syncLogs'];

        return resources.map(resource =>
            this.toEntityFromResource(resource)
        );
    }

    /**
     * Converts a SyncLog entity to a resource for API submission.
     *
     * @static
     * @param {SyncLog} syncLog - The SyncLog entity.
     * @returns {Object} The synchronization log resource.
     */
    static toResourceFromEntity(syncLog) {
        return {
            id: syncLog.getId(),
            showId: syncLog.getShowId(),
            executedAt: syncLog.getExecutedAt()?.toISOString() ?? null,
            status: syncLog.getStatusAsString(),
            errorDetails: syncLog.getErrorDetails(),
        };
    }
}