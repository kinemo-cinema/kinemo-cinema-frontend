import { createRouter, createWebHistory } from 'vue-router';

import CatalogRoutes from './catalog/presentation/catalog-routes.js';
import SchedulingRoutes from './scheduling/presentation/scheduling-routes.js';
import ReadinessRoutes from './readiness/presentation/readiness-routes.js';

import MaintenanceRoutes from './maintence/presentation/maintenance-routes.js';
import SubscriptionRoutes from './subscription/presentation/subscription-routes.js';


// Authentication
const SignInView = () =>
    import('./iam/presentation/views/sign-in.vue');


// Shared
const HomeView = () =>
    import('./shared/presentation/views/home.vue');

const AboutView = () =>
    import('./shared/presentation/views/about.vue');

const ProfileView = () =>
    import('./shared/presentation/views/profile.vue');

const PageNotFoundView = () =>
    import('./shared/presentation/views/page-not-found.vue');


// Layouts
const CatalogLayout = () =>
    import('./catalog/presentation/views/catalog-layout.vue');

const SchedulingLayout = () =>
    import('./scheduling/presentation/views/scheduling-layout.vue');

const ReadinessLayout = () =>
    import('./readiness/presentation/views/readiness-layout.vue');

const MaintenanceLayout = () =>
    import('./maintence/presentation/views/maintenance-layout.vue');

const SubscriptionLayout = () =>
    import('./subscription/presentation/views/subscription-layout.vue');


const routes = [

    // LOGIN
    {
        path: '/',
        name: 'sign-in',
        component: SignInView,
        meta: {
            layout: false,
            public: true
        }
    },

    // DASHBOARD
    {
        path: '/dashboard',
        name: 'dashboard',
        component: HomeView
    },

    // ABOUT
    {
        path: '/about',
        name: 'about',
        component: AboutView
    },

    // PROFILE
    {
        path: '/profile/:role',
        name: 'profile',
        component: ProfileView
    },

    // BC01 - CATALOG
    {
        path: '/catalog',
        component: CatalogLayout,
        children: CatalogRoutes
    },

    // BC02 - SCHEDULING
    {
        path: '/scheduling',
        component: SchedulingLayout,
        children: SchedulingRoutes
    },

    // READINESS
    {
        path: '/room-readiness',
        component: ReadinessLayout,
        children: ReadinessRoutes
    },

    // BC07 - MAINTENANCE
    {
        path: '/maintenance',
        component: MaintenanceLayout,
        children: MaintenanceRoutes
    },

    // BC09 - SUBSCRIPTION
    {
        path: '/subscriptions',
        component: SubscriptionLayout,
        children: SubscriptionRoutes,
        meta: {
            layout: false,
            public: true
        }
    },

    // NOT FOUND
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