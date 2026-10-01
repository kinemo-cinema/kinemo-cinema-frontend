import {BaseApi} from "../../shared/infrastructure/base-api.js";
import {BaseEndpoint} from "../../shared/infrastructure/base-endpoint.js";

const catalogBasePath = import.meta.env.VITE_API_BC01_CATALOG;
const moviesEndpointPath = `${catalogBasePath}/movies`;
const genresEndpointPath = `${catalogBasePath}/genres`;

/**
 * Infrastructure gateway for Catalog bounded-context endpoints.
 *
 * @class CatalogApi
 * @extends BaseApi
 */

export class CatalogApi extends BaseApi {
    #moviesEndpoint
    #genresEndpoint

    /**
     * @constructor
     */
    constructor() {
        super();
        this.#moviesEndpoint = new BaseEndpoint(this, moviesEndpointPath);
        this.#genresEndpoint = new BaseEndpoint(this, genresEndpointPath);
    }

    /**
     * Fetches all genres.
     * @returns {Promise} A promise that resolves with the genres response.
     */

    getGenres(){
        return this.#genresEndpoint.getAll();
    }

    /**
     * Fetches a genre by ID.
     * @param {number} id - The category ID.
     * @returns {Promise} A promise that resolves with the category response.
     */

    getGenreById(id){
        return this.#genresEndpoint.getById(id);
    }

    /**
     * Creates a new genre.
     * @param {Object} resource - The genre resource to create.
     * @returns {Promise} A promise that resolves with the creation response.
     */

    createGenre(resource){
        return this.#genresEndpoint.create(resource);
    }

    /**
     * Updates an existing genre.
     * @param {Object} resource - The genre resource to update.
     * @returns {Promise} A promise that resolves with the update response.
     */

    updateGenre(resource){
        return this.#genresEndpoint.update(resource.id, resource);
    }

    /**
     * Deletes a genre by ID.
     * @param {number} id - The genre ID to delete.
     * @returns {Promise} A promise that resolves with the deletion response.
     */

    deleteGenre(id){
        return this.#genresEndpoint.delete(id);
    }

    /**
     * Fetches all Movies.
     * @returns {Promise} A promise that resolves with the movies response.
     */

    getMovies(){
        return this.#moviesEndpoint.getAll();
    }

    /**
     * Creates a new Movie.
     * @param {Object} resource - The movie resource to create.
     * @returns {Promise} A promise that resolves with the creation response.
     */
    createMovie(resource) {
        return this.#moviesEndpoint.create(resource);
    }

    /**
     * Fetches a Movie by ID.
     * @param {number} id - The movie ID.
     * @returns {Promise} A promise that resolves with the movie response.
     */
    getMovieById(id) {
        return this.#moviesEndpoint.getById(id);
    }

    /**
     * Updates an existing Movie.
     * @param {Object} resource - The movie resource to update.
     * @returns {Promise} A promise that resolves with the update response.
     */



    updateMovie(resource){
        return this.#moviesEndpoint.update(resource.id, resource);
    }

    /**
     *  Deletes a Movie by ID.
     *  @param {number} id - The movie ID to delete.
     *  @returns {Promise} A promise that resolves with the deletion response.
     */

    deleteMovie(id){
        return this.#moviesEndpoint.delete(id);
    }
}