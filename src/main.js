import App from './App.vue';
import Vue from 'vue/dist/vue.esm';
import router from './router';
import store from './store/store'

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    router,
    components: { App },
    template: '<App/>',

    beforeCreate() {
        this.$store.commit('initialiseStore');
    }
});
