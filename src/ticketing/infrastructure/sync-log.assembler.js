import {SyncLog} from "../domain/model/sync-log.entity.js";

/**
 * @class SyncLogAssembler
 * @summary Converts synchronization log API resources to entities and back.
 */
export class SyncLogAssembler {

    static toEntityFromResource(resource) {
        return new SyncLog({
            id: resource.id ?? null,
            connectionId: resource.connectionId ?? null,
            operatorId: resource.operatorId ?? null,
            syncStatus: resource.syncStatus ?? 'PENDING',
            recordsProcessed: resource.recordsProcessed ?? 0,
            startedAt: resource.startedAt ?? null,
            completedAt: resource.completedAt ?? null,
            errorDetails: resource.errorDetails ?? null,
        });
    }

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

    static toResourceFromEntity(syncLog) {
        return {
            id: syncLog.getId(),
            connectionId: syncLog.getConnectionId(),
            operatorId: syncLog.getOperatorId(),
            syncStatus: syncLog.getStatusAsString(),
            recordsProcessed: syncLog.getRecordsProcessed(),
            startedAt:
                syncLog.getStartedAt()?.toISOString() ?? null,
            completedAt:
                syncLog.getCompletedAt()?.toISOString() ?? null,
            errorDetails: syncLog.getErrorDetails(),
        };
    }
}