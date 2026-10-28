const maintenanceDashboard=()=>import('./views/maintenance-dashboard.vue');
export default [{path:'',redirect:{name:'maintenance-dashboard'}},{path:'dashboard',name:'maintenance-dashboard',component:maintenanceDashboard,meta:{title:'Resource Testing & Maintenance'}}];
