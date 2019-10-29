import Vue       from 'vue';
import Vuex      from 'vuex';

import Camera    from './Camera';
import Telescope from './Telescope';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        telescopes: [],
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

        addTelescope(state, telescopeData) {
            let telescope = new Telescope(
                telescopeData.name,
                telescopeData.focalLength,
                telescopeData.aperture,
            );
            state.telescopes.push(telescope);
        },

        updateTelescope(state, obj) {
            state.telescopes[obj.index] = obj.data;
        },

        addCamera(state, cameraData) {
            let camera = new Camera(
                cameraData.name,
                cameraData.resolution,
                cameraData.sensor,
                cameraData.qe / 100,
                cameraData.readNoise
            );
            state.cameras.push(camera);
        },

        updateCamera(state, obj) {
            state.cameras[obj.index] = obj.data;
        },

        removeCamera(state, camera) {
            let arrIndex = state.cameras.findIndex((x) => {
                return x == camera;
            });

            state.cameras.splice(arrIndex, 1);
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