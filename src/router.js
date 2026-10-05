import { createRouter, createWebHistory } from 'vue-router';
import CatalogRoutes from "./catalog/presentation/catalog-routes.js";
import SchedulingRoutes from "./scheduling/presentation/scheduling-routes.js";
import SubscriptionRoutes from "./subscription/presentation/subscription-routes.js"; // <-- 1. Importa las rutas del BC09

const HomeView = () => import('./shared/presentation/views/home.vue');
const AboutView = () => import('./shared/presentation/views/about.vue');
const PageNotFoundView = () => import('./shared/presentation/views/page-not-found.vue');

const CatalogLayout = () => import('./catalog/presentation/views/catalog-layout.vue');
const SchedulingLayout = () => import('./scheduling/presentation/views/scheduling-layout.vue');
const SubscriptionLayout = () => import('./subscription/presentation/views/subscription-layout.vue'); // <-- 2. Importa el layout (o tu vista principal si no usas layout)

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
        path: '/subscriptions', // <-- 3. Añade la ruta del Bounded Context 09
        component: SubscriptionLayout,
        children: SubscriptionRoutes,
    },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: PageNotFoundView },
];

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});