const ExecutionList =
    () => import("./views/execution-list.vue");

const ExecutionDetail =
    () => import("./views/execution-detail.vue");

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