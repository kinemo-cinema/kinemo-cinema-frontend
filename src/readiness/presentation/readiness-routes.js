// Lazy-loaded views for BC03 — Room & Resource Readiness
const roomList   = () => import('./views/connected-rooms.vue');
const roomForm   = () => import('./views/connected-rooms.vue');
const roomDetail = () => import('./views/connected-room-detail.vue');

const readinessRoutes = [
    {   path: '',                 redirect: { name: 'readiness-rooms' } },

    // Static child routes must come before dynamic `:id` routes
    {   path: 'rooms',            name: 'readiness-rooms',        component: roomList,   meta: { title: 'Rooms' } },
    {   path: 'rooms/new',        name: 'readiness-room-new',     component: roomForm,   meta: { title: 'New Room' } },
    {   path: 'rooms/:id/edit',   name: 'readiness-room-edit',    redirect: to => ({ name: 'readiness-room-detail', params: { id: to.params.id } }) },
    {   path: 'rooms/:id',        name: 'readiness-room-detail',  component: roomDetail, meta: { title: 'Room Detail' } },
];

export default readinessRoutes;