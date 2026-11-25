import { createRouter, createWebHistory } from 'vue-router'

import CatalogRoutes from './catalog/presentation/catalog-routes.js'
import SchedulingRoutes from './scheduling/presentation/scheduling-routes.js'
import ReadinessRoutes from './readiness/presentation/readiness-routes.js'
import TicketingRoutes from './ticketing/presentation/ticketing-routes.js'
import SeatAllocationRoutes from './seat-allocation/presentation/seat-allocation-routes.js'
import ExecutionRoutes from './execution/presentation/execution-routes.js'
import MaintenanceRoutes from './maintenance/presentation/maintenance-routes.js'
import SubscriptionRoutes from './subscription/presentation/subscription-routes.js'

const AppLayout = () =>
    import('./shared/presentation/components/layout.vue')

const SignInView = () =>
    import('./iam/presentation/views/sign-in.vue')

const HomeView = () =>
    import('./shared/presentation/views/home.vue')

const AboutView = () =>
    import('./shared/presentation/views/about.vue')

const ProfileView = () =>
    import('./shared/presentation/views/profile.vue')

const PageNotFoundView = () =>
    import('./shared/presentation/views/page-not-found.vue')

const CatalogLayout = () =>
    import('./catalog/presentation/views/catalog-layout.vue')

const SchedulingLayout = () =>
    import('./scheduling/presentation/views/scheduling-layout.vue')

const ReadinessLayout = () =>
    import('./readiness/presentation/views/readiness-layout.vue')

const TicketingLayout = () =>
    import('./ticketing/presentation/views/ticketing-layout.vue')

const SeatAllocationLayout = () =>
    import('./seat-allocation/presentation/views/seat-allocation-layout.vue')

const ExecutionLayout = () =>
    import('./execution/presentation/views/execution-layout.vue')

const MaintenanceLayout = () =>
    import('./maintenance/presentation/views/maintenance-layout.vue')

const SubscriptionLayout = () =>
    import('./subscription/presentation/views/subscription-layout.vue')

const AnalyticsView = () =>
    import('./shared/presentation/views/connected-analytics.vue')

const SubscriptionManagementView = () =>
    import('./subscription/presentation/views/connected-subscriptions.vue')

const routes = [
    {
        path: '/',
        name: 'sign-in',
        component: SignInView
    },
    {
        path: '/login',
        redirect: '/'
    },
    {
        path: '/home',
        redirect: '/dashboard'
    },
    {
        path: '/pricing',
        redirect: '/subscriptions'
    },
    {
        path: '/dashboard',
        component: AppLayout,
        children: [
            {
                path: '',
                name: 'dashboard',
                component: HomeView
            }
        ]
    },
    {
        path: '/about',
        component: AppLayout,
        children: [
            {
                path: '',
                name: 'about',
                component: AboutView
            }
        ]
    },
    {
        path: '/profile/:role',
        component: AppLayout,
        children: [
            {
                path: '',
                name: 'profile',
                component: ProfileView
            }
        ]
    },
    {
        path: '/catalog',
        component: AppLayout,
        children: [
            {
                path: '',
                component: CatalogLayout,
                children: CatalogRoutes
            }
        ]
    },
    {
        path: '/scheduling',
        component: AppLayout,
        children: [
            {
                path: '',
                component: SchedulingLayout,
                children: SchedulingRoutes
            }
        ]
    },
    {
        path: '/room-readiness',
        component: AppLayout,
        children: [
            {
                path: '',
                component: ReadinessLayout,
                children: ReadinessRoutes
            }
        ]
    },
    {
        path: '/ticketing',
        component: AppLayout,
        children: [
            {
                path: '',
                component: TicketingLayout,
                children: TicketingRoutes
            }
        ]
    },
    {
        path: '/seat-allocation',
        component: AppLayout,
        children: [
            {
                path: '',
                component: SeatAllocationLayout,
                children: SeatAllocationRoutes
            }
        ]
    },
    {
        path: '/execution',
        component: AppLayout,
        children: [
            {
                path: '',
                component: ExecutionLayout,
                children: ExecutionRoutes
            }
        ]
    },
    {
        path: '/maintenance',
        component: AppLayout,
        children: [
            {
                path: '',
                component: MaintenanceLayout,
                children: MaintenanceRoutes
            }
        ]
    },
    {
        path: '/analytics',
        component: AppLayout,
        children: [
            {
                path: '',
                component: AnalyticsView
            }
        ]
    },
    {
        path: '/subscriptions/manage',
        component: AppLayout,
        children: [
            {
                path: '',
                component: SubscriptionManagementView
            }
        ]
    },
    {
        path: '/subscriptions',
        component: SubscriptionLayout,
        children: SubscriptionRoutes
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: PageNotFoundView
    }
]

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior(to, from, savedPosition) {
        return savedPosition || {
            top: 0,
            left: 0
        }
    }
})