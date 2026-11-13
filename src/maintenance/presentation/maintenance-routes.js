const dashboard = () => import('./views/connected-maintenance.vue');
export default [{ path: '', redirect: { name: 'maintenance-dashboard' } }, { path: 'dashboard', name: 'maintenance-dashboard', component: dashboard }];
