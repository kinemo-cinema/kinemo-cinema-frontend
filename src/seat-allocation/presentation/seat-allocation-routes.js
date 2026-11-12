const seatAllocationList = () => import('../../shared/presentation/views/backend-unavailable.vue');
const seatAllocationDetail = () => import('../../shared/presentation/views/backend-unavailable.vue');

const seatAllocationRoutes = [
    {
        path: '',
        redirect: {name: 'seat-allocation-list'}
    },

    {
        path: 'allocations',
        name: 'seat-allocation-list',
        component: seatAllocationList,
        props: { title: 'Asignación de asientos' },
        meta: {title: 'Seat Allocation'}
    },

    {
        path: 'allocations/:id',
        name: 'seat-allocation-detail',
        component: seatAllocationDetail,
        props: { title: 'Asignación de asientos' },
        meta: {title: 'Seat Allocation Detail'}
    }
];

export default seatAllocationRoutes;