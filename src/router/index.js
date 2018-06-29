import Router from 'vue-router';
import Vue from 'vue';

import ExposureTime from '@/components/ExposureTime';
import Gear from '@/components/Gear';
import Sampling from '@/components/Sampling';

Vue.use(Router);

let router = new Router({
    linkActiveClass: 'active',
    routes: [
        {
            path: '/Gear',
            name: 'Gear',
            component: Gear,
        },
        {
            path: '/Sampling',
            name: 'Sampling',
            component: Sampling
        },
        {
            path: '/Exposure',
            name: 'Exposure Time',
            component: ExposureTime
        }
    ]
});

router.beforeEach((to, from, next) => {
    let title = to.name ? to.name + ' - ' : '';
    document.title = title + 'Telescope Tools';
    next()
});

export default router;
