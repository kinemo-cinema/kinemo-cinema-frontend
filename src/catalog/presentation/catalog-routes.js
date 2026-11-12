// Lazy-loaded views for the Movie Catalog bounded context (BC01)
const genreList = () => import('./views/genre-list.vue');
const genreForm = () => import('./views/genre-form.vue');
const movieList = () => import('./views/movie-list.vue');
const movieForm = () => import('./views/movie-form.vue');
const sensoryFileList = () => import('./views/connected-sensory.vue');
const sensoryFileForm = () => import('./views/connected-sensory.vue');
const sensoryTrackList = () => import('./views/connected-sensory.vue');
const sensoryTrackForm = () => import('./views/connected-sensory.vue');
const configurationHistoryList = () => import('./views/connected-sensory.vue');

const catalogRoutes = [
    {   path: '',  redirect: { name: 'catalog-movies' } },
    // Genres
    {   path: 'genres',             name: 'catalog-genres',        component: genreList,  meta: { title: 'Genres' } },
    {   path: 'genres/new',         name: 'catalog-genre-new',     redirect: { name: 'catalog-genres' } },
    {   path: 'genres/:id/edit',    name: 'catalog-genre-edit',    redirect: { name: 'catalog-genres' } },

    // Movies
    {   path: 'movies',             name: 'catalog-movies',        component: movieList,  meta: { title: 'Movies' } },
    {   path: 'movies/new',         name: 'catalog-movie-new',     component: movieForm,  meta: { title: 'New Movie' } },
    {   path: 'movies/:id/edit',    name: 'catalog-movie-edit',    component: movieForm,  meta: { title: 'Edit Movie' } },

    // ... inside catalogRoutes:
    { path: 'sensory-files',                name: 'catalog-sensory-files',        component: sensoryFileList },
    { path: 'sensory-files/new',            name: 'catalog-sensory-file-new',     component: sensoryFileForm },
    { path: 'sensory-files/:id/edit',       name: 'catalog-sensory-file-edit',    component: sensoryFileForm },

    { path: 'sensory-tracks',               name: 'catalog-sensory-tracks',       component: sensoryTrackList },
    { path: 'sensory-tracks/new',           name: 'catalog-sensory-track-new',    component: sensoryTrackForm },
    { path: 'sensory-tracks/:id/edit',      name: 'catalog-sensory-track-edit',   component: sensoryTrackForm },

    { path: 'configuration-history',        name: 'catalog-configuration-history', component: configurationHistoryList },

];

export default catalogRoutes;