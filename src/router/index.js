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
            path: '/Gear',
            name: 'Gear',
            component: Gear
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
})
