import {SensoryFile} from '../domain/model/sensory-file.entity.js';
import {SensoryTrackAssembler} from "./sensory-track.assembler.js";
import {ConfigurationHistoryAssembler} from "./configuration-history.assembler.js";

/**
 * @class SensoryFileAssembler
 * @summary Converts sensory file API resources to entities and back.
 */
export class SensoryFileAssembler {

    /**
     * Converts a sensory file resource to a SensoryFile entity.
     * @static
     * @param {Object} resource - The sensory file resource from the API.
     * @returns {SensoryFile} The SensoryFile entity.
     */
    static toEntityFromResource(resource) {
        return new SensoryFile({
            id: resource.id ?? null,
            movieId: resource.movieId ?? null,
            fileName: resource.fileName ?? '',
            fileFormat: resource.fileFormat ?? 'TRACK',
            filePath: resource.filePath ?? '',
            validationStatus: resource.validationStatus ?? 'PENDING',
            uploadedAt: resource.uploadedAt ?? null,
        });
    }

    /**
     * Converts an API response to an array of SensoryFile entities.
     * @static
     * @param {Object} response - The API response object.
     * @returns {SensoryFile[]} Array of SensoryFile entities.
     */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return [];
        }
        const resources = response.data instanceof Array
            ? response.data
            : response.data['sensoryFiles'];
        return resources.map(resource => this.toEntityFromResource(resource));
    }

    static toResourceFromEntity(file) {
        const fileId = file.getId();

        const tracks = file.getTracks().map(track => ({
            ...SensoryTrackAssembler.toResourceFromEntity(track),
            sensoryFileId: fileId,
        }));

        const history = file.getConfigurationHistory().map(entry => ({
            ...ConfigurationHistoryAssembler.toResourceFromEntity(entry),
            // Optional: history entries are keyed to tracks, not files, so
            // no parent FK is needed unless your schema requires one.
        }));

        return {
            id: fileId,
            movieId: file.getMovieId(),
            fileName: file.getFileName(),
            fileFormat: file.getFileFormat().toString(),
            filePath: file.getFilePath(),
            validationStatus: file.getValidationStatusAsString(),
            uploadedAt: file.getUploadedAtFormated(),
            sensoryTracks: tracks,
            configurationHistory: history,
        };
    }
}