import {
    createRouter,
    createWebHistory
} from "vue-router";


import CatalogRoutes
    from "./catalog/presentation/catalog-routes.js";

import SchedulingRoutes
    from "./scheduling/presentation/scheduling-routes.js";

import ReadinessRoutes
    from "./readiness/presentation/readiness-routes.js";

import TicketingRoutes
    from "./ticketing/presentation/ticketing-routes.js";

import SeatAllocationRoutes
    from "./seat-allocation/presentation/seat-allocation-routes.js";

import ExecutionRoutes
    from "./execution/presentation/execution-routes.js";

import MaintenanceRoutes
    from "./maintenance/presentation/maintenance-routes.js";

import SubscriptionRoutes
    from "./subscription/presentation/subscription-routes.js";


/* =========================================================
   GLOBAL LAYOUT
========================================================= */

const AppLayout = () =>
    import(
        "./shared/presentation/components/layout.vue"
        );


/* =========================================================
   AUTHENTICATION
========================================================= */

const SignInView = () =>
    import(
        "./iam/presentation/views/sign-in.vue"
        );


/* =========================================================
   SHARED
========================================================= */

const HomeView = () =>
    import(
        "./shared/presentation/views/home.vue"
        );

const AboutView = () =>
    import(
        "./shared/presentation/views/about.vue"
        );

const ProfileView = () =>
    import(
        "./shared/presentation/views/profile.vue"
        );

const PageNotFoundView = () =>
    import(
        "./shared/presentation/views/page-not-found.vue"
        );


/* =========================================================
   BOUNDED CONTEXT LAYOUTS
========================================================= */

const CatalogLayout = () =>
    import(
        "./catalog/presentation/views/catalog-layout.vue"
        );

const SchedulingLayout = () =>
    import(
        "./scheduling/presentation/views/scheduling-layout.vue"
        );

const ReadinessLayout = () =>
    import(
        "./readiness/presentation/views/readiness-layout.vue"
        );

const TicketingLayout = () =>
    import(
        "./ticketing/presentation/views/ticketing-layout.vue"
        );

const SeatAllocationLayout = () =>
    import(
        "./seat-allocation/presentation/views/seat-allocation-layout.vue"
        );

const ExecutionLayout = () =>
    import(
        "./execution/presentation/views/execution-layout.vue"
        );

const MaintenanceLayout = () =>
    import(
        "./maintenance/presentation/views/maintenance-layout.vue"
        );

const SubscriptionLayout = () =>
    import(
        "./subscription/presentation/views/subscription-layout.vue"
        );


/* =========================================================
   ROUTES
========================================================= */

const routes = [

    /* =====================================================
       LOGIN
    ===================================================== */

    {
        path: "/",
        name: "sign-in",
        component: SignInView
    },


    /* =====================================================
       DASHBOARD
    ===================================================== */

    {
        path: "/dashboard",
        component: AppLayout,

        children: [

            {
                path: "",
                name: "dashboard",
                component: HomeView
            }

        ]
    },


    /* =====================================================
       ABOUT
    ===================================================== */

    {
        path: "/about",
        component: AppLayout,

        children: [

            {
                path: "",
                name: "about",
                component: AboutView
            }

        ]
    },


    /* =====================================================
       PROFILE
    ===================================================== */

    {
        path: "/profile/:role",
        component: AppLayout,

        children: [

            {
                path: "",
                name: "profile",
                component: ProfileView
            }

        ]
    },


    /* =====================================================
       BC01
       MOVIE & SENSORY CONTENT MANAGEMENT
    ===================================================== */

    {
        path: "/catalog",
        component: AppLayout,

        children: [

            {
                path: "",
                component: CatalogLayout,
                children: CatalogRoutes
            }

        ]
    },


    /* =====================================================
       BC02
       SCHEDULING & CALENDAR
    ===================================================== */

    {
        path: "/scheduling",
        component: AppLayout,

        children: [

            {
                path: "",
                component: SchedulingLayout,
                children: SchedulingRoutes
            }

        ]
    },


    /* =====================================================
       BC03
       ROOM & RESOURCE READINESS
    ===================================================== */

    {
        path: "/room-readiness",
        component: AppLayout,

        children: [

            {
                path: "",
                component: ReadinessLayout,
                children: ReadinessRoutes
            }

        ]
    },


    /* =====================================================
       BC04
       TICKETING INTEGRATION
    ===================================================== */

    {
        path: "/ticketing",
        component: AppLayout,

        children: [

            {
                path: "",
                component: TicketingLayout,
                children: TicketingRoutes
            }

        ]
    },


    /* =====================================================
       BC05
       SEAT ALLOCATION & CONTROL
    ===================================================== */

    {
        path: "/seat-allocation",
        component: AppLayout,

        children: [

            {
                path: "",
                component: SeatAllocationLayout,
                children: SeatAllocationRoutes
            }

        ]
    },


    /* =====================================================
       BC06
       4D EXECUTION & SYNCHRONIZATION
    ===================================================== */

    {
        path: "/execution",
        component: AppLayout,

        children: [

            {
                path: "",
                component: ExecutionLayout,
                children: ExecutionRoutes
            }

        ]
    },


    /* =====================================================
       BC07
       RESOURCE TESTING & MAINTENANCE
    ===================================================== */

    {
        path: "/maintenance",
        component: AppLayout,

        children: [

            {
                path: "",
                component: MaintenanceLayout,
                children: MaintenanceRoutes
            }

        ]
    },


    /* =====================================================
       BC09
       SUBSCRIPTION

       Se mantiene sin AppLayout porque tiene su propio
       diseño de página.
    ===================================================== */

    {
        path: "/subscriptions",
        component: SubscriptionLayout,
        children: SubscriptionRoutes
    },


    /* =====================================================
       NOT FOUND
    ===================================================== */

    {
        path: "/:pathMatch(.*)*",
        name: "not-found",
        component: PageNotFoundView
    }

];


/* =========================================================
   ROUTER INSTANCE
========================================================= */

export const router =
    createRouter({

        history:
            createWebHistory(
                import.meta.env.BASE_URL
            ),

        routes

    });