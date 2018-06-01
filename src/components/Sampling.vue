<template lang="pug">
    .container
        b-modal#addCameraModal(title="Add new camera", size="lg", ok-title="Add", v-bind:ok-disabled="addCameraModalDisableOk", @show="clearModal", @ok="addCamera")
            form
                fieldset
                    // Camera name
                    .form-group.row
                        label.col-sm-4.col-form-label(for="modal-camera-name") Name
                        .col-sm-8
                            .input-group
                                input#modal-camera-name.form-control(type="text", placeholder="Camera name", v-model="addCameraModal.name")
                    
                    // Camera resolution
                    .form-group.row
                        label.col-sm-4.col-form-label(for="camera-resolution-x") Camera resolution
                        .col-sm-8
                            .input-group
                                input#modal-camera-resolution-x.form-control(type="number", placeholder="X resolution", v-model="addCameraModal.resolution.x")
                                .input-group-append
                                    span.input-group-text pixels
                        .col-sm-8.offset-sm-4.my-2
                            .input-group
                                input#modal-camera-resolution-y.form-control(type="number", placeholder="Y resolution", v-model="addCameraModal.resolution.y")
                                .input-group-append
                                    span.input-group-text pixels

                    // Sensor dimensions
                    .form-group.row
                        label.col-sm-4.col-form-label(for="camera-resolution-x") Sensor dimensions
                        .col-sm-8
                            .input-group
                                input#modal-camera-resolution-x.form-control(type="number", placeholder="Sensor width", v-model="addCameraModal.sensor.width")
                                .input-group-append
                                    span.input-group-text mm
                        .col-sm-8.offset-sm-4.my-2
                            .input-group
                                input#modal-camera-resolution-y.form-control(type="number", placeholder="Sensor height", v-model="addCameraModal.sensor.height")
                                .input-group-append
                                    span.input-group-text mm
        form
            // Telescope
            fieldset
                .form-row
                    legend.form-label Telescope

                // Focal length
                .form-group.row
                    label.col-sm-4.col-form-label(for="telescope-focal-length") Your telescope's focal length in mm
                    .col-sm-8.input-group
                        input#telescope-focal-length.form-control(type="number", placeholder="Telescope focal length", v-model="focalLength")
                        .input-group-append
                            span.input-group-text mm

                // Aperture
                .form-group.row
                    label.col-sm-4.col-form-label(for="telescope-aperture") Your telescope's aperture in mm
                    .col-sm-8.input-group
                        input#telescope-aperture.form-control(type="number", placeholder="Telescope aperture", v-model="aperture")
                        .input-group-append
                            span.input-group-text mm

            fieldset
                .form-row
                    legend.form-label Cameras
                        b-button.ml-2(size="sm", variant="success", v-b-modal="'addCameraModal'") Add new
                // Cameras
                b-table(striped, hover, :items="cameraList", :fields="cameraFields")
                    template(slot="sensor", slot-scope="data")
                        |{{data.value.width}}&times;{{data.value.height}}&thinsp;mm
                    template(slot="resolution", slot-scope="data")
                        |{{data.value.x}}&times;{{data.value.y}}&thinsp;px
                    template(slot="pixelSize", slot-scope="data")
                        |{{data.value}}&thinsp;µm
                    template(slot="actions", slot-scope="row")
                        b-button(size="sm", @click.stop="removeCamera(row.item)", variant="danger") Remove
            
        //table.table
            tbody
                tr(v-if="fRatio")
                    td &fnof; Ratio
                    td {{fRatio}}
                tr
                    td Maximum magnification
                    td {{maxMagnification}}&times;
                tr
                    td Ideal Resolution
                    td 0.67-2.00 arcseconds
                tr(v-if="telescopeResolution")
                    td Telescope resolution
                    td {{telescopeResolution}} arcseconds per pixel
</template>
<script>

export default {
    name: 'Sampling',

    data: () => { return {
        addCameraModal: {
            name: '',
            resolution: { x: null, y: null },
            sensor: { width: null, height: null }
        },

        cameraFields: {
            name: { label: 'Name', sortable: true },
            sensor: {  },
            resolution: {  },
            pixelSize: { sortable: true },
            telescopeResolution: { formatter: 'calcTelescopeResolution', sortable: true },
            actions: {}
        }
    }},

    computed: {
        addCameraModalDisableOk: {
            get() {
                let modalData = this.$data.addCameraModal;

                let validName = modalData.name != '';
                let validResolution = modalData.resolution.x > 0.0 && modalData.resolution.y > 0.0;
                let validDimensions = modalData.sensor.width > 0.0 && modalData.sensor.height > 0.0;

                return !(validName && validResolution && validDimensions);
            }
        },

        cameraList: {
            get() { return this.$store.state.cameras; }
        },

        focalLength: {
            get() { return this.$store.state.telescope.focalLength; },
            set(value) {
                this.$store.commit('updateTelescopeFocalLength', value)
            }
        },

        aperture: {
            get() { return this.$store.state.telescope.aperture; },
            set(value) {
                this.$store.commit('updateTelescopeAperture', value)
            }
        },

        fRatio: {
            get() {
                let focalLength = this.$store.state.telescope.focalLength;
                let aperture = this.$store.state.telescope.aperture;

                if(focalLength > 0.0 && aperture > 0.0) {
                    return Math.round(focalLength / aperture * 100) / 100;
                } else {
                    return null;
                }
            }
        },

        maxMagnification: {
            get() {
                return this.$store.state.telescope.aperture * 2;
            }
        },

        resolutionX: {
            get() { return this.$store.state.camera.resolutionX; },
            set(value) {
                this.$store.commit('updateCameraResolutionX', value)
            }
        },

        resolutionY: {
            get() { return this.$store.state.camera.resolutionY },
            set(value) {
                this.$store.commit('updateCameraResolutionY', value)
            }
        },

        sensorWidth: {
            get() { return this.$store.state.camera.sensorWidth; },
            set(value) {
                this.$store.commit('updateCameraSensorWidth', value)
            }
        },

        sensorHeight: {
            get() { return this.$store.state.camera.sensorHeight },
            set(value) {
                this.$store.commit('updateCameraSensorHeight', value)
            }
        }
    },

    methods: {
        clearModal() {
            this.$data.addCameraModal = {
                name: '',
                resolution: { x: null, y: null },
                sensor: { width: null, height: null }
            };
        },

        removeCamera(camera) {
            this.$store.commit('removeCamera', camera);
        },

        /*calcPixelSize(value, key, item) {
            // Calculate pixel size
            let pixelSizeX = item.sensor.width  / item.resolution.x * 1000;
            let pixelSizeY = item.sensor.height / item.resolution.y * 1000;
            let avgPixelSize = (pixelSizeX + pixelSizeY) / 2;
            
            return Math.round(avgPixelSize * 100) / 100;
        },*/

        calcTelescopeResolution(value, key, item) {
            //debugger;
            return Math.round(item.pixelSize / this.focalLength * 206.3 * 100) / 100;
        },

        addCamera() {
            let cameraData = Object.assign({}, this.$data.addCameraModal);
            this.$store.commit('addCamera', cameraData);

            this.clearModal();
        }
    }
}
</script>
<style lang="scss" scoped>

</style>
