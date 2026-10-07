// Lazy-loaded views for BC04 — Ticketing Integration
const ticketingIntegrationList =
    () => import('./views/ticketing-integration-list.vue');

const ticketingIntegrationForm =
    () => import('./views/ticketing-integration-form.vue');

const ticketingIntegrationDetail =
    () => import('./views/ticketing-integration-detail.vue');

const ticketingRoutes = [
    {
        path: '',
        redirect: {
            name: 'ticketing-integrations'
        }
    },

    {
        path: 'integrations',
        name: 'ticketing-integrations',
        component: ticketingIntegrationList,
        meta: {
            title: 'Ticketing Integrations'
        }
    },

    {
        path: 'integrations/new',
        name: 'ticketing-integration-new',
        component: ticketingIntegrationForm,
        meta: {
            title: 'New Ticketing Integration'
        }
    },

    {
        path: 'integrations/:id/edit',
        name: 'ticketing-integration-edit',
        component: ticketingIntegrationForm,
        meta: {
            title: 'Edit Ticketing Integration'
        }
    },

    {
        path: 'integrations/:id',
        name: 'ticketing-integration-detail',
        component: ticketingIntegrationDetail,
        meta: {
            title: 'Ticketing Integration Detail'
        }
    }
];

export default ticketingRoutes;