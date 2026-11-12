const unavailable = () => import('../../shared/presentation/views/backend-unavailable.vue');
export default [{ path: '', redirect: { name: 'maintenance-dashboard' } }, { path: 'dashboard', name: 'maintenance-dashboard', component: unavailable, props: { title: 'Mantenimiento' } }];
