import { createRouter, createWebHistory } from 'vue-router';

import CatalogRoutes
    from "./catalog/presentation/catalog-routes.js";

import SchedulingRoutes
    from "./scheduling/presentation/scheduling-routes.js";

import ReadinessRoutes
    from "./readiness/presentation/readiness-routes.js";

import SeatAllocationRoutes
    from "./seat-allocation/presentation/seat-allocation-routes.js";

import ExecutionRoutes
    from "./execution/presentation/execution-routes.js";

const HomeView = () =>
    import('./shared/presentation/views/home.vue');

const AboutView = () =>
    import('./shared/presentation/views/about.vue');

const ProfileView = () =>
    import('./shared/presentation/views/profile.vue');

const PageNotFoundView = () =>
    import('./shared/presentation/views/page-not-found.vue');

const CatalogLayout = () =>
    import('./catalog/presentation/views/catalog-layout.vue');

const SchedulingLayout = () =>
    import('./scheduling/presentation/views/scheduling-layout.vue');

const ReadinessLayout = () =>
    import('./readiness/presentation/views/readiness-layout.vue');

const SeatAllocationLayout = () =>
    import('./seat-allocation/presentation/views/seat-allocation-layout.vue');

const ExecutionLayout = () =>
    import('./execution/presentation/views/execution-layout.vue');

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/about',
        name: 'about',
        component: AboutView
    },
    {
        path: '/profile/:role',
        name: 'profile',
        component: ProfileView
    },
    {
        path: '/catalog',
        component: CatalogLayout,
        children: CatalogRoutes
    },
    {
        path: '/scheduling',
        component: SchedulingLayout,
        children: SchedulingRoutes
    },
    {
        path: '/room-readiness',
        component: ReadinessLayout,
        children: ReadinessRoutes
    },
    {
        path: '/seat-allocation',
        component: SeatAllocationLayout,
        children: SeatAllocationRoutes
    },
    {
        path: '/execution',
        component: ExecutionLayout,
        children: ExecutionRoutes
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: PageNotFoundView
    }
];

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});