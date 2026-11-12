const ExecutionList =
    () => import("./views/connected-executions.vue");

const ExecutionDetail =
    () => import("./views/connected-executions.vue");

const ExecutionRoutes = [
    {
        path: "",
        redirect: {
            name: "execution-list"
        }
    },
    {
        path: "shows",
        name: "execution-list",
        component: ExecutionList
    },
    {
        path: "shows/:id",
        name: "execution-detail",
        component: ExecutionDetail
    }
];

export default ExecutionRoutes;