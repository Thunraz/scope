import Router from 'vue-router';
import Vue from 'vue';

import HelloWorld from '@/components/HelloWorld';
import Sampling from '@/components/Sampling';

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'HelloWorld',
            component: HelloWorld
        },
        {
            path: '/sampling',
            name: 'Sampling',
            component: Sampling
        }
    ]
})
