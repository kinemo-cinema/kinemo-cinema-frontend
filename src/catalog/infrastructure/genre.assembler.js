import {Genre} from "../domain/model/genre.entity.js";

/**
 * @class GenreAssembler
 * @summary Assembler for converting genre API responses to entities in the Catalog bounded context.
 */
export class GenreAssembler {
    /**
     * Converts a genre resource to a Genre entity.
     * @static
     * @param {Object} resource - The genre resource from the API.
     * @returns {Genre} The Genre entity.
     */
    static toEntityFromResource(resource) {
        return new Genre({
            id: resource.id ?? null,
            name: resource.name ?? '',
            description: resource.description ?? '',
        });
    }

    /**
     * Converts an API response to an array of Genre entities.
     * @static
     * @param {Object} response - The API response object.
     * @param {number} response.status - The HTTP status code.
     * @param {string} response.statusText - The status text.
     * @param {Array|Object} response.data - The response data.
     * @returns {Genre[]} Array of Genre entities.
     */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return [];
        }
        const resources = response.data instanceof Array ? response.data : response.data['genres'];
        return resources.map(resource => this.toEntityFromResource(resource));
    }

    /**
     * Converts a Genre entity to a resource for API submission.
     * @static
     * @param {Genre} genre - The Genre entity.
     * @returns {Object} The genre resource.
     */
    static toResourceFromEntity(genre) {
        return {
            id: genre.id,
            name: genre.name,
            description: genre.description,
        };
    }
}