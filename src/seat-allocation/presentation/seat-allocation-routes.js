const seatAllocationList = () => import('./views/seat-allocation-list.vue');
const seatAllocationDetail = () => import('./views/seat-allocation-detail.vue');

const seatAllocationRoutes = [
    {
        path: '',
        redirect: {name: 'seat-allocation-list'}
    },

    {
        path: 'allocations',
        name: 'seat-allocation-list',
        component: seatAllocationList,
        meta: {title: 'Seat Allocation'}
    },

    {
        path: 'allocations/:id',
        name: 'seat-allocation-detail',
        component: seatAllocationDetail,
        meta: {title: 'Seat Allocation Detail'}
    }
];

export default seatAllocationRoutes;