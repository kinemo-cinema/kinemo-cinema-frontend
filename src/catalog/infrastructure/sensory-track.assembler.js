import {SensoryTrack} from '../domain/model/sensory-track.entity.js';

/**
 * @class SensoryTrackAssembler
 * @summary Converts sensory track API resources to entities and back.
 */
export class SensoryTrackAssembler {

    /**
     * Converts a sensory track resource to a SensoryTrack entity.
     * @static
     * @param {Object} resource - The sensory track resource from the API.
     * @returns {SensoryTrack} The SensoryTrack entity.
     */
    static toEntityFromResource(resource) {
        return new SensoryTrack({
            id: resource.id ?? null,
            sensoryFileId: resource.sensoryFileId ?? null,
            trackType: resource.trackType ?? 'MOTION',
            intensityLevel: resource.intensityLevel ?? 50,
            trackStatus: resource.trackStatus ?? 'PENDING',
        });
    }

    /**
     * Converts an API response to an array of SensoryTrack entities.
     * @static
     * @param {Object} response - The API response object.
     * @returns {SensoryTrack[]} Array of SensoryTrack entities.
     */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return [];
        }
        const resources = response.data instanceof Array
            ? response.data
            : response.data['sensoryTracks'];
        return resources.map(resource => this.toEntityFromResource(resource));
    }

    /**
     * Converts a SensoryTrack entity to a resource for API submission.
     * @static
     * @param {SensoryTrack} track - The SensoryTrack entity.
     * @returns {Object} The sensory track resource.
     */
    static toResourceFromEntity(track) {
        return {
            id: track.getId(),
            sensoryFileId: track.getSensoryFileId(),
            trackType: track.getTrackTypeAsString(),
            intensityLevel: track.getIntensityLevelAsNumber(),
            trackStatus: track.getTrackStatusAsString(),
        };
    }
}