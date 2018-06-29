import Router from 'vue-router';
import Vue from 'vue';

import Sampling from '@/components/Sampling';
import Gear from '@/components/Gear';

Vue.use(Router);

export default new Router({
    linkActiveClass: 'active',
    routes: [
        {
            path: '/',
            alias: '/gear',
            name: 'Gear',
            component: Gear
        },
        {
            path: '/sampling',
            name: 'Sampling',
            component: Sampling
        }
    ]
})
