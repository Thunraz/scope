import Vue from 'vue';
import Vuex from 'vuex';
//import Camera from './Camera';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        telescope: {
            focalLength: null,
            aperture: null
        },
        cameras: []
    },
    mutations: {
        initialiseStore(state) {
            // Check if the ID exists
            if(localStorage.getItem('store')) {
                // Replace the state with the stored item
                this.replaceState(
                    Object.assign(state, JSON.parse(localStorage.getItem('store')))
                );
            }
        },

        addCamera(state, camera) {
            state.cameras.push(camera);
        },

        updateTelescopeFocalLength(state, focalLength) {
            state.telescope.focalLength = focalLength;
        },

        updateTelescopeAperture(state, aperture) {
            state.telescope.aperture = aperture;
        },

        updateCameraSensorWidth(state, width) {
            state.camera.sensorWidth = width;
        },

        updateCameraSensorHeight(state, height) {
            state.camera.sensorHeight = height;
        },

        updateCameraResolutionX(state, pixels) {
            state.camera.resolutionX = pixels;
        },

        updateCameraResolutionY(state, pixels) {
            state.camera.resolutionY = pixels;
        }
    },
    getters: {}
});

// Subscribe to store updates
store.subscribe((mutation, state) => {
    // Store the state object as a JSON string
    localStorage.setItem('store', JSON.stringify(state));
});

export default store;