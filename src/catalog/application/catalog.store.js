/**
 * Application service store for BC01 — Movie & Sensory Content Management.
 * Coordinates genre, movie, and sensory-content use cases,
 * and keeps UI-facing state.
 *
 * @module useCatalogStore
 */

import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {CatalogApi} from "../infrastructure/catalog-api.js";
import {GenreAssembler} from "../infrastructure/genre.assembler.js";
import {MovieAssembler} from "../infrastructure/movie.assembler.js";
import {SensoryFileAssembler} from "../infrastructure/sensory-file.assembler.js";
import {SensoryTrackAssembler} from "../infrastructure/sensory-track.assembler.js";
import {ConfigurationHistoryAssembler} from "../infrastructure/configuration-history.assembler.js";

const catalogApi = new CatalogApi();

/**
 * Pinia store for BC01 — Movie & Sensory Content Management.
 * Manages genres, movies, sensory files, sensory tracks, and
 * configuration history, including fetching, creation, update,
 * and deletion.
 *
 * @returns {Object} The store object with state, computed, and actions.
 */
const useCatalogStore = defineStore("catalog", () => {

    // --------------------------------------------------------------------
    // State — genres & movies
    // --------------------------------------------------------------------

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

    // --------------------------------------------------------------------
    // State — sensory content
    // --------------------------------------------------------------------

    /**
     * List of sensory file entities.
     * @type {import('vue').Ref<SensoryFile[]>}
     */
    const sensoryFiles = ref([]);

    /**
     * List of sensory track entities.
     * @type {import('vue').Ref<SensoryTrack[]>}
     */
    const sensoryTracks = ref([]);

    /**
     * List of configuration history entries.
     * @type {import('vue').Ref<ConfigurationHistory[]>}
     */
    const configurationHistory = ref([]);

    // --------------------------------------------------------------------
    // State — cross-cutting
    // --------------------------------------------------------------------

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
     * Whether sensory files have been loaded from the API.
     * @type {import('vue').Ref<boolean>}
     */
    const sensoryFilesLoaded = ref(false);

    /**
     * Whether sensory tracks have been loaded from the API.
     * @type {import('vue').Ref<boolean>}
     */
    const sensoryTracksLoaded = ref(false);

    /**
     * Whether configuration history has been loaded from the API.
     * @type {import('vue').Ref<boolean>}
     */
    const configurationHistoryLoaded = ref(false);

    // --------------------------------------------------------------------
    // Computed counts
    // --------------------------------------------------------------------

    /**
     * Number of loaded genres.
     * @type {import('vue').ComputedRef<number>}
     */
    const genresCount = computed(() => genresLoaded.value ? genres.value.length : 0);

    /**
     * Number of loaded movies.
     * @type {import('vue').ComputedRef<number>}
     */
    const moviesCount = computed(() => moviesLoaded.value ? movies.value.length : 0);

    /**
     * Number of loaded sensory files.
     * @type {import('vue').ComputedRef<number>}
     */
    const sensoryFilesCount = computed(() => sensoryFilesLoaded.value ? sensoryFiles.value.length : 0);

    /**
     * Number of loaded sensory tracks.
     * @type {import('vue').ComputedRef<number>}
     */
    const sensoryTracksCount = computed(() => sensoryTracksLoaded.value ? sensoryTracks.value.length : 0);

    /**
     * Number of loaded configuration history entries.
     * @type {import('vue').ComputedRef<number>}
     */
    const configurationHistoryCount = computed(() => configurationHistoryLoaded.value ? configurationHistory.value.length : 0);

    // --------------------------------------------------------------------
    // Actions — genres
    // --------------------------------------------------------------------

    /**
     * Loads genres from infrastructure and updates the application state.
     * @returns {void}
     */
    function fetchGenres() {
        errors.value = [];

        catalogApi.getGenres().then((response) => {
            genres.value = GenreAssembler.toEntitiesFromResponse(response);
            genresLoaded.value = true;
        }).catch((err) => {
            errors.value.push(err);
        });
    }

    /**
     * Finds a genre entity by identifier.
     * @param {number|string} id - Genre identifier.
     * @returns {Genre|undefined} Matching genre, if available.
     */
    function getGenreById(id) {
        const idNum = parseInt(id);
        return genres.value.find(genre => genre.id === idNum);
    }

    /**
     * Creates a genre through infrastructure and appends it to local state.
     *
     * The entity is serialized through its assembler before reaching the
     * API, because entities encapsulate state in non-enumerable fields
     * that JSON.stringify would otherwise drop.
     *
     * @param {Genre} genre - Genre entity to persist.
     * @returns {void}
     */
    function addGenre(genre) {
        errors.value = [];

        catalogApi.createGenre(GenreAssembler.toResourceFromEntity(genre)).then(response => {
            const resource = response.data;
            const newGenre = GenreAssembler.toEntityFromResource(resource);
            genres.value.push(newGenre);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * Updates an existing genre and synchronizes local state.
     *
     * The entity is serialized through its assembler before reaching the
     * API (see addGenre).
     *
     * @param {Genre} genre - Genre entity with updated data.
     * @returns {void}
     */
    function updateGenre(genre) {
        errors.value = [];

        catalogApi.updateGenre(GenreAssembler.toResourceFromEntity(genre)).then(response => {
            const resource = response.data;
            const updatedGenre = GenreAssembler.toEntityFromResource(resource);
            const index = genres.value.findIndex(g => g.id === updatedGenre.id);
            if (index !== -1) genres.value[index] = updatedGenre;
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
        errors.value = [];

        catalogApi.deleteGenre(genre.id).then(() => {
            const index = genres.value.findIndex(g => g.id === genre.id);
            if (index !== -1) genres.value.splice(index, 1);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    // --------------------------------------------------------------------
    // Actions — movies
    // --------------------------------------------------------------------

    /**
     * Loads movies from infrastructure and updates the application state.
     * @returns {void}
     */
    function fetchMovies() {
        errors.value = [];

        catalogApi.getMovies().then((response) => {
            movies.value = MovieAssembler.toEntitiesFromResponse(response);
            moviesLoaded.value = true;
        }).catch((err) => {
            errors.value.push(err);
        });
    }

    /**
     * Finds a movie entity by identifier.
     * @param {number|string} id - Movie identifier.
     * @returns {Movie|undefined} Matching movie, if available.
     */
    function getMovieById(id) {
        const idNum = parseInt(id);
        return movies.value.find(m => m.getId() === idNum);
    }

    /**
     * Creates a movie through infrastructure and appends it to local state.
     *
     * The entity is serialized through its assembler before reaching the
     * API, because entities encapsulate state in non-enumerable fields
     * that JSON.stringify would otherwise drop.
     *
     * @param {Movie} movie - Movie entity to persist.
     * @returns {void}
     */
    function addMovie(movie) {
        errors.value = [];

        catalogApi.createMovie(MovieAssembler.toResourceFromEntity(movie)).then(response => {
            const resource = response.data;
            const newMovie = MovieAssembler.toEntityFromResource(resource);
            movies.value.push(newMovie);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * Updates an existing movie and synchronizes local state.
     *
     * The entity is serialized through its assembler before reaching the
     * API (see addMovie).
     *
     * @param {Movie} movie - Movie entity with updated data.
     * @returns {void}
     */
    function updateMovie(movie) {
        errors.value = [];

        catalogApi.updateMovie(MovieAssembler.toResourceFromEntity(movie)).then(response => {
            const resource = response.data;
            const updatedMovie = MovieAssembler.toEntityFromResource(resource);
            const index = movies.value.findIndex(m => m.getId() === updatedMovie.getId());
            if (index !== -1) movies.value[index] = updatedMovie;
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
        errors.value = [];

        catalogApi.deleteMovie(movie.getId()).then(() => {
            const index = movies.value.findIndex(m => m.getId() === movie.getId());
            if (index !== -1) movies.value.splice(index, 1);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    // --------------------------------------------------------------------
    // Actions — sensory files
    // --------------------------------------------------------------------

    /**
     * Loads sensory files from infrastructure and updates the application state.
     * @returns {void}
     */
    function fetchSensoryFiles() {
        errors.value = [];

        catalogApi.getSensoryFiles().then((response) => {
            sensoryFiles.value = SensoryFileAssembler.toEntitiesFromResponse(response);
            sensoryFilesLoaded.value = true;
        }).catch((err) => {
            errors.value.push(err);
        });
    }

    /**
     * Finds a sensory file entity by identifier.
     * @param {number|string} id - Sensory file identifier.
     * @returns {SensoryFile|undefined} Matching sensory file, if available.
     */
    function getSensoryFileById(id) {
        const idNum = parseInt(id);
        return sensoryFiles.value.find(f => f.getId() === idNum);
    }

    /**
     * Returns all sensory files that belong to a given movie.
     * @param {number|string} movieId - Movie identifier.
     * @returns {SensoryFile[]} Matching sensory files.
     */
    function getSensoryFilesByMovieId(movieId) {
        const idNum = parseInt(movieId);
        return sensoryFiles.value.filter(f => f.getMovieId() === idNum);
    }

    /**
     * Creates a sensory file through infrastructure and appends it to local state.
     *
     * The entity is serialized through its assembler before reaching the
     * API, because entities encapsulate state in non-enumerable fields
     * that JSON.stringify would otherwise drop.
     *
     * @param {SensoryFile} sensoryFile - Sensory file entity to persist.
     * @returns {void}
     */
    function addSensoryFile(sensoryFile) {
        errors.value = [];

        catalogApi.createSensoryFile(SensoryFileAssembler.toResourceFromEntity(sensoryFile)).then(response => {
            const resource = response.data;
            const newFile = SensoryFileAssembler.toEntityFromResource(resource);
            sensoryFiles.value.push(newFile);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * Updates an existing sensory file and synchronizes local state.
     *
     * The entity is serialized through its assembler before reaching the
     * API (see addSensoryFile).
     *
     * @param {SensoryFile} sensoryFile - Sensory file entity with updated data.
     * @returns {void}
     */
    function updateSensoryFile(sensoryFile) {
        errors.value = [];

        catalogApi.updateSensoryFile(SensoryFileAssembler.toResourceFromEntity(sensoryFile)).then(response => {
            const resource = response.data;
            const updatedFile = SensoryFileAssembler.toEntityFromResource(resource);
            const index = sensoryFiles.value.findIndex(f => f.getId() === updatedFile.getId());
            if (index !== -1) sensoryFiles.value[index] = updatedFile;
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * Deletes a sensory file and removes it from local state.
     * @param {SensoryFile} sensoryFile - Sensory file entity to remove.
     * @returns {void}
     */
    function deleteSensoryFile(sensoryFile) {
        errors.value = [];

        catalogApi.deleteSensoryFile(sensoryFile.getId()).then(() => {
            const index = sensoryFiles.value.findIndex(f => f.getId() === sensoryFile.getId());
            if (index !== -1) sensoryFiles.value.splice(index, 1);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    // --------------------------------------------------------------------
    // Actions — sensory tracks
    // --------------------------------------------------------------------

    /**
     * Loads sensory tracks from infrastructure and updates the application state.
     * @returns {void}
     */
    function fetchSensoryTracks() {
        errors.value = [];

        catalogApi.getSensoryTracks().then((response) => {
            sensoryTracks.value = SensoryTrackAssembler.toEntitiesFromResponse(response);
            sensoryTracksLoaded.value = true;
        }).catch((err) => {
            errors.value.push(err);
        });
    }

    /**
     * Finds a sensory track entity by identifier.
     * @param {number|string} id - Sensory track identifier.
     * @returns {SensoryTrack|undefined} Matching sensory track, if available.
     */
    function getSensoryTrackById(id) {
        const idNum = parseInt(id);
        return sensoryTracks.value.find(t => t.getId() === idNum);
    }

    /**
     * Returns all sensory tracks that belong to a given sensory file.
     * @param {number|string} sensoryFileId - Sensory file identifier.
     * @returns {SensoryTrack[]} Matching sensory tracks.
     */
    function getSensoryTracksByFileId(sensoryFileId) {
        const idNum = parseInt(sensoryFileId);
        return sensoryTracks.value.filter(t => t.getSensoryFileId() === idNum);
    }

    /**
     * Creates a sensory track through infrastructure and appends it to local state.
     *
     * The entity is serialized through its assembler before reaching the
     * API, because entities encapsulate state in non-enumerable fields
     * that JSON.stringify would otherwise drop.
     *
     * @param {SensoryTrack} sensoryTrack - Sensory track entity to persist.
     * @returns {void}
     */
    function addSensoryTrack(sensoryTrack) {
        errors.value = [];

        catalogApi.createSensoryTrack(SensoryTrackAssembler.toResourceFromEntity(sensoryTrack)).then(response => {
            const resource = response.data;
            const newTrack = SensoryTrackAssembler.toEntityFromResource(resource);
            sensoryTracks.value.push(newTrack);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * Updates an existing sensory track and synchronizes local state.
     *
     * The entity is serialized through its assembler before reaching the
     * API (see addSensoryTrack).
     *
     * @param {SensoryTrack} sensoryTrack - Sensory track entity with updated data.
     * @returns {void}
     */
    function updateSensoryTrack(sensoryTrack) {
        errors.value = [];

        catalogApi.updateSensoryTrack(SensoryTrackAssembler.toResourceFromEntity(sensoryTrack)).then(response => {
            const resource = response.data;
            const updatedTrack = SensoryTrackAssembler.toEntityFromResource(resource);
            const index = sensoryTracks.value.findIndex(t => t.getId() === updatedTrack.getId());
            if (index !== -1) sensoryTracks.value[index] = updatedTrack;
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * Deletes a sensory track and removes it from local state.
     * @param {SensoryTrack} sensoryTrack - Sensory track entity to remove.
     * @returns {void}
     */
    function deleteSensoryTrack(sensoryTrack) {
        errors.value = [];

        catalogApi.deleteSensoryTrack(sensoryTrack.getId()).then(() => {
            const index = sensoryTracks.value.findIndex(t => t.getId() === sensoryTrack.getId());
            if (index !== -1) sensoryTracks.value.splice(index, 1);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    // --------------------------------------------------------------------
    // Actions — configuration history
    // --------------------------------------------------------------------

    /**
     * Loads configuration history from infrastructure and updates the application state.
     * @returns {void}
     */
    function fetchConfigurationHistory() {
        errors.value = [];

        catalogApi.getConfigurationHistory().then((response) => {
            configurationHistory.value = ConfigurationHistoryAssembler.toEntitiesFromResponse(response);
            configurationHistoryLoaded.value = true;
        }).catch((err) => {
            errors.value.push(err);
        });
    }

    /**
     * Finds a configuration history entry by identifier.
     * @param {number|string} id - Configuration history identifier.
     * @returns {ConfigurationHistory|undefined} Matching entry, if available.
     */
    function getConfigurationHistoryById(id) {
        const idNum = parseInt(id);
        return configurationHistory.value.find(h => h.getId() === idNum);
    }

    /**
     * Returns all configuration history entries recorded for a given track.
     * @param {number|string} sensoryTrackId - Sensory track identifier.
     * @returns {ConfigurationHistory[]} Matching history entries.
     */
    function getConfigurationHistoryByTrackId(sensoryTrackId) {
        const idNum = parseInt(sensoryTrackId);
        return configurationHistory.value.filter(h => h.getSensoryTrackId() === idNum);
    }

    /**
     * Creates a configuration history entry through infrastructure and appends it to local state.
     *
     * The entity is serialized through its assembler before reaching the
     * API, because entities encapsulate state in non-enumerable fields
     * that JSON.stringify would otherwise drop.
     *
     * @param {ConfigurationHistory} entry - Configuration history entity to persist.
     * @returns {void}
     */
    function addConfigurationHistory(entry) {
        errors.value = [];

        catalogApi.createConfigurationHistory(ConfigurationHistoryAssembler.toResourceFromEntity(entry)).then(response => {
            const resource = response.data;
            const newEntry = ConfigurationHistoryAssembler.toEntityFromResource(resource);
            configurationHistory.value.push(newEntry);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * Updates an existing configuration history entry and synchronizes local state.
     *
     * The entity is serialized through its assembler before reaching the
     * API (see addConfigurationHistory).
     *
     * @param {ConfigurationHistory} entry - Configuration history entity with updated data.
     * @returns {void}
     */
    function updateConfigurationHistory(entry) {
        errors.value = [];

        catalogApi.updateConfigurationHistory(ConfigurationHistoryAssembler.toResourceFromEntity(entry)).then(response => {
            const resource = response.data;
            const updatedEntry = ConfigurationHistoryAssembler.toEntityFromResource(resource);
            const index = configurationHistory.value.findIndex(h => h.getId() === updatedEntry.getId());
            if (index !== -1) configurationHistory.value[index] = updatedEntry;
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * Deletes a configuration history entry and removes it from local state.
     * @param {ConfigurationHistory} entry - Configuration history entity to remove.
     * @returns {void}
     */
    function deleteConfigurationHistory(entry) {
        errors.value = [];

        catalogApi.deleteConfigurationHistory(entry.getId()).then(() => {
            const index = configurationHistory.value.findIndex(h => h.getId() === entry.getId());
            if (index !== -1) configurationHistory.value.splice(index, 1);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    return {
        // State
        genres,
        movies,
        sensoryFiles,
        sensoryTracks,
        configurationHistory,
        errors,
        // Load flags
        genresLoaded,
        moviesLoaded,
        sensoryFilesLoaded,
        sensoryTracksLoaded,
        configurationHistoryLoaded,
        // Computed
        genresCount,
        moviesCount,
        sensoryFilesCount,
        sensoryTracksCount,
        configurationHistoryCount,
        // Actions — genres
        fetchGenres,
        getGenreById,
        addGenre,
        updateGenre,
        deleteGenre,
        // Actions — movies
        fetchMovies,
        getMovieById,
        addMovie,
        updateMovie,
        deleteMovie,
        // Actions — sensory files
        fetchSensoryFiles,
        getSensoryFileById,
        getSensoryFilesByMovieId,
        addSensoryFile,
        updateSensoryFile,
        deleteSensoryFile,
        // Actions — sensory tracks
        fetchSensoryTracks,
        getSensoryTrackById,
        getSensoryTracksByFileId,
        addSensoryTrack,
        updateSensoryTrack,
        deleteSensoryTrack,
        // Actions — configuration history
        fetchConfigurationHistory,
        getConfigurationHistoryById,
        getConfigurationHistoryByTrackId,
        addConfigurationHistory,
        updateConfigurationHistory,
        deleteConfigurationHistory,
    };
});

export default useCatalogStore;