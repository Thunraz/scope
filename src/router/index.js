import Router from 'vue-router';
import Vue from 'vue';

import ExposureTime from '@/components/ExposureTime';
import Gear from '@/components/Gear';
import Sampling from '@/components/Sampling';

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
        },
        {
            path: '/exposure',
            name: 'Exposure Time',
            component: ExposureTime
        }
    ]
})
