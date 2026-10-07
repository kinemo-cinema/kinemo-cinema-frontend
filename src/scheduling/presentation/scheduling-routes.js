// Lazy-loaded views for BC02 — Scheduling & Calendar
const showList = () => import('./views/show-list.vue');
const showForm = () => import('./views/show-form.vue');

const schedulingRoutes = [
    {   path: '',                 redirect: { name: 'scheduling-shows' } },

    // Shows
    {   path: 'shows',            name: 'scheduling-shows',       component: showList,  meta: { title: 'Shows' } },
    {   path: 'shows/new',        name: 'scheduling-show-new',    component: showForm,  meta: { title: 'New Show' } },
    {   path: 'shows/:id/edit',   name: 'scheduling-show-edit',   component: showForm,  meta: { title: 'Edit Show' } },
];

export default schedulingRoutes;