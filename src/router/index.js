import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'share1',
        component: () => import(/* webpackChunkName: "share1" */ '../views/share1.vue')
    },
    {
        path: '/share2',
        name: 'share2',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "new" */ '../views/share2.vue')
    }
];

const router = new VueRouter({
    routes
});
router.afterEach((to) => {
    if (to.name === 'share1') {
        document.title = '前';
    } else if (to.name === 'share2') {
        document.title = '后';
    }
});

export default router;
