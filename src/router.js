import { createRouter, createWebHistory } from 'vue-router';
import CatalogRoutes from "./catalog/presentation/catalog-routes.js";
import SchedulingRoutes from "./scheduling/presentation/scheduling-routes.js";
import ReadinessRoutes from "./readiness/presentation/readiness-routes.js";
import TicketingRoutes from "./ticketing/presentation/ticketing-routes.js";

const HomeView = () => import('./shared/presentation/views/home.vue');
const AboutView = () => import('./shared/presentation/views/about.vue');
const PageNotFoundView = () => import('./shared/presentation/views/page-not-found.vue');

const CatalogLayout = () => import('./catalog/presentation/views/catalog-layout.vue');
const SchedulingLayout = () => import('./scheduling/presentation/views/scheduling-layout.vue');
const ReadinessLayout = () => import('./readiness/presentation/views/readiness-layout.vue');
const TicketingLayout = () => import('./ticketing/presentation/views/ticketing-layout.vue');
const routes = [
    { path: '/', name: 'home', component: HomeView },
    { path: '/about', name: 'about', component: AboutView },
    {
        path: '/catalog',
        component: CatalogLayout,
        children: CatalogRoutes,
    },
    {
        path: '/scheduling',
        component: SchedulingLayout,
        children: SchedulingRoutes,
    },
    {
        path: '/room-readiness',   
        component: ReadinessLayout,
        children: ReadinessRoutes,
    },

    {
        path: '/ticketing',
        component: TicketingLayout,
        children: TicketingRoutes,
    },

    { path: '/:pathMatch(.*)*', name: 'not-found', component: PageNotFoundView },
];

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});