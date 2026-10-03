/**
 * Application service store for BC01 — Movie & Sensory Content Management.
 * Coordinates genre, movie, and  sensory-content use cases,
 * and keeps UI-facing state.
 *
 * @module useCatalogStore
 */

import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {CatalogApi} from "../infrastructure/catalog-api.js";
import {GenreAssembler} from "../infrastructure/genre.assembler.js";
import {MovieAssembler} from "../infrastructure/movie.assembler.js";

const catalogApi = new CatalogApi();

/**
 * Pinia store for the Movie Catalog bounded context (BC01).
 * Manages genres and movies state, including fetching, creation,
 * update, and deletion.
 *
 * @returns {Object} The store object with state, computed, and actions.
 */

const useCatalogStore = defineStore("catalog", () => {
    /**
     * List of genre entities.
     * @type {import('vue').Ref<Genre[]>}
     */

    const genres = ref([]);

    /**
     * List of movie entities.
     * @type {import('vue').Ref<Movie[]>}
     */

    const movies = ref([]);

    /**
     * List of errors encountered during API operations.
     * @type {import('vue').Ref<Error[]>}
     */
    const errors = ref([]);

    /**
     * Whether genres have been loaded from the API.
     * @type {import('vue').Ref<boolean>}
     */
    const genresLoaded = ref(false);

    /**
     * Whether movies have been loaded from the API.
     * @type {import('vue').Ref<boolean>}
     */
    const moviesLoaded = ref(false);

    /**
     * Number of loaded genres.
     * @type {import('vue').ComputedRef<number>}
     */

    const genresCount = computed(() => {
        return genresLoaded ? genres.value.length : 0;
    });

    /**
     * Number of loaded movies.
     * @type {import('vue').ComputedRef<number>}
     */

    const moviesCount = computed(() => {
        return moviesLoaded ? movies.value.length : 0;
    });

    /**
     * Loads genres from infrastructure and updates the application state.
     * @returns {void}
     */
    function fetchGenres() {
        catalogApi.getGenres().then((response) => {
            genres.value = GenreAssembler.toEntitiesFromResponse(response);
            genresLoaded.value = true;
            console.log(genresLoaded.value);
            console.log(genres.value);
        }).catch((err) => {
            errors.value.push(err);
        })
    }

    /**
     * Loads movies from infrastructure and updates the application state.
     * @returns {void}
     */

    function fetchMovies() {
        catalogApi.getMovies().then((response) => {
            movies.value = MovieAssembler.toEntitiesFromResponse(response);
            moviesLoaded.value = true;
            console.log(moviesLoaded.value);
            console.log(movies.value);
        }).catch((err) => {
            errors.value.push(err);
        })
    }

    /**
     * Finds a genre entity by identifier.
     * @param {number|string} id - Genre identifier.
     * @returns {Genre|undefined} Matching genre, if available.
     */

    function getGenreById(id) {
        let idNum = parseInt(id);
        return genres.value.find(genre => genre.id === idNum);
    }

    /**
     * Finds a genre entity by identifier.
     * @param {number|string} id - movie identifier.
     * @returns {Movie|undefined} Matching movie, if available.
     */

    function getMovieById(id) {
        let idNum = parseInt(id);
        return movies.value.find(m => m.getId() === idNum);
    }

    /**
     * Creates a genre through infrastructure and appends it to local state.
     * @param {Genre} genre - Genre entity to persist.
     * @returns {void}
     */

    function addGenre(genre) {
        catalogApi.createGenre(genre).then(response => {
            const resource = response.data;
            const newGenre = GenreAssembler.toEntityFromResource(resource);
            genres.value.push(newGenre);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * Creates a genre through infrastructure and appends it to local state.
     * @param {Movie} movie - Genre entity to persist.
     * @returns {void}
     */

    function addMovie(movie) {
        catalogApi.createMovie(movie).then(response => {
            const resource = response.data;
            const newMovie = MovieAssembler.toEntityFromResource(resource);
            movies.value.push(newMovie);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * Updates an existing genre and synchronizes local state.
     * @param {Genre} genre - Genre entity with updated data.
     * @returns {void}
     */
    function updateGenre(genre) {
        catalogApi.updateGenre(genre).then(response => {
            const resource = response.data;
            const updatedGenre = GenreAssembler.toEntityFromResource(resource);
            const index = genres.value.findIndex(g => g["id"] === updatedGenre.id);
            if (index !== -1) genres.value[index] = updatedGenre;
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * Updates an existing movie and synchronizes local state.
     * @param {Movie} movie - Movie entity with updated data.
     * @returns {void}
     */
    function updateMovie(movie) {
        catalogApi.updateMovie(movie).then(response => {
            const resource = response.data;
            const updatedMovie = MovieAssembler.toEntityFromResource(resource);
            const index = movies.value.findIndex(m => m["id"] === updatedMovie.getId());
            if (index !== -1) movies.value[index] = updatedMovie;
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * Deletes a genre and removes it from local state.
     * @param {Genre} genre - Genre entity to remove.
     * @returns {void}
     */
    function deleteGenre(genre) {
        catalogApi.deleteGenre(genre.id).then(() => {
            const index = genres.value.findIndex(g => g["id"] === genre.id);
            if (index !== -1) genres.value.splice(index, 1);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * Deletes a movie and removes it from local state.
     * @param {Movie} movie - Movie entity to remove.
     * @returns {void}
     */
    function deleteMovie(movie) {
        catalogApi.deleteMovie(movie.getId()).then(() => {
            const index = movies.value.findIndex(m => m["id"] === movie.getId());
            if (index !== -1) movies.value.splice(index, 1);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    return {
        genres,
        movies,
        errors,
        genresLoaded,
        moviesLoaded,
        genresCount,
        moviesCount,
        fetchGenres,
        fetchMovies,
        getGenreById,
        getMovieById,
        addGenre,
        addMovie,
        updateMovie,
        updateGenre,
        deleteGenre,
        deleteMovie,
    }

});

export default useCatalogStore;