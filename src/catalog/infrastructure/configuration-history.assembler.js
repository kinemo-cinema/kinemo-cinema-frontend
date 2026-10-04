import {ConfigurationHistory} from '../domain/model/configuration-history.entity.js';

/**
 * @class ConfigurationHistoryAssembler
 * @summary Converts configuration history API resources to entities and back.
 */
export class ConfigurationHistoryAssembler {

    /**
     * Converts a configuration history resource to a ConfigurationHistory entity.
     * @static
     * @param {Object} resource - The resource from the API.
     * @returns {ConfigurationHistory} The ConfigurationHistory entity.
     */
    static toEntityFromResource(resource) {
        return new ConfigurationHistory({
            id: resource.id ?? null,
            sensoryTrackId: resource.sensoryTrackId ?? null,
            previousIntensityLevel: resource.previousIntensityLevel ?? 0,
            changedAt: resource.changedAt ?? null,
            restored: resource.restored ?? false,
        });
    }

    /**
     * Converts an API response to an array of ConfigurationHistory entities.
     * @static
     * @param {Object} response - The API response object.
     * @returns {ConfigurationHistory[]} Array of ConfigurationHistory entities.
     */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return [];
        }
        const resources = response.data instanceof Array
            ? response.data
            : response.data['configurationHistory'];
        return resources.map(resource => this.toEntityFromResource(resource));
    }

    /**
     * Converts a ConfigurationHistory entity to a resource for API submission.
     * @static
     * @param {ConfigurationHistory} history - The ConfigurationHistory entity.
     * @returns {Object} The configuration history resource.
     */
    static toResourceFromEntity(history) {
        return {
            id: history.getId(),
            sensoryTrackId: history.getSensoryTrackId(),
            previousIntensityLevel: history.getPreviousIntensityLevelAsNumber(),
            changedAt: history.getChangedAtFormated(),
            restored: history.isRestored(),
        };
    }
}