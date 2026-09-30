import { createRouter, createWebHistory } from 'vue-router';

const HomeView = () => import('./shared/presentation/views/home.vue');

const AboutView = () => import('./shared/presentation/views/about.vue');

const PageNotFoundView = () => import('./shared/presentation/views/page-not-found.vue');

const routes = [
    { path: '/', name: 'home', component: HomeView },
    { path: '/about', name: 'about', component: AboutView },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: PageNotFoundView },
];

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});