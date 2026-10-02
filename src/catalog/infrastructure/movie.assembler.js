import {Movie} from "../domain/model/movie.entity.js";

/**
 * @class MovieAssembler
 * @summary Assembler for converting movie API responses to entities in the Catalog bounded context.
 */
export class MovieAssembler {

    /**
     * Converts a movie resource to a Movie entity.
     * @static
     * @param {Object} resource - The movie resource from the API.
     * @returns {Movie} The Movie entity.
     */
    static toEntityFromResource(resource) {
        return new Movie({
            id: resource.id ?? null,
            title: resource.title ?? '',
            durationMinutes: resource.durationMinutes ?? 0,
            genreId: resource.genreId ?? null,
            genre: resource.genre ?? null,
            status: resource.status ?? 'ACTIVE',
            originalMovieId: resource.originalMovieId ?? null,
            createdAt: resource.createdAt ?? null,
            updatedAt: resource.updatedAt ?? null,
        });
    }

    /**
     * Converts an API response to an array of Movie entities.
     * @static
     * @param {Object} response - The API response object.
     * @param {number} response.status - The HTTP status code.
     * @param {string} response.statusText - The status text.
     * @param {Array|Object} response.data - The response data.
     * @returns {Movie[]} Array of Movie entities.
     */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return [];
        }
        const resources = response.data instanceof Array ? response.data : response.data['movies'];
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}