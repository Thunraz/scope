<template lang="pug">
    .container
        b-modal#addCameraModal(title="Add new camera" size="lg")
            form
                fieldset
                    // Camera name
                    .form-group.row
                        label.col-sm-4.col-form-label(for="modal-camera-name") Name
                        .col-sm-8
                            .input-group
                                input#modal-camera-name.form-control(type="text" placeholder="Camera name" v-model="addCameraModal.name")
                    
                    // Camera resolution
                    .form-group.row
                        label.col-sm-4.col-form-label(for="camera-resolution-x") Camera resolution
                        .col-sm-8
                            .input-group
                                input#modal-camera-resolution-x.form-control(type="number" placeholder="X resolution" v-model="addCameraModal.resolution.x")
                                .input-group-append
                                    span.input-group-text pixels
                        .col-sm-8.offset-sm-4.my-2
                            .input-group
                                input#modal-camera-resolution-y.form-control(type="number" placeholder="Y resolution" v-model="addCameraModal.resolution.y")
                                .input-group-append
                                    span.input-group-text pixels

                    // Sensor dimensions
                    .form-group.row
                        label.col-sm-4.col-form-label(for="camera-resolution-x") Sensor dimensions
                        .col-sm-8
                            .input-group
                                input#modal-camera-resolution-x.form-control(type="number" placeholder="Sensor width" v-model="addCameraModal.sensor.width")
                                .input-group-append
                                    span.input-group-text mm
                        .col-sm-8.offset-sm-4.my-2
                            .input-group
                                input#modal-camera-resolution-y.form-control(type="number" placeholder="Sensor height" v-model="addCameraModal.sensor.height")
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
                        input#telescope-focal-length.form-control(type="number" placeholder="Telescope focal length" v-model="focalLength")
                        .input-group-append
                            span.input-group-text mm

                // Aperture
                .form-group.row
                    label.col-sm-4.col-form-label(for="telescope-aperture") Your telescope's aperture in mm
                    .col-sm-8.input-group
                        input#telescope-aperture.form-control(type="number" placeholder="Telescope aperture" v-model="aperture")
                        .input-group-append
                            span.input-group-text mm
            // Cameras
            table.table.table-striped
                thead
                    tr
                        th Camera name
                        th Resolution
                        th Sensor dimensions
                        th Pixel size
                        th
                            b-btn(v-b-modal="'addCameraModal'") +

            // Camera
                fieldset
                    .form-row
                        legend.form-label Camera
                    
                    // Camera resolution
                    .form-group.row
                        label.col-sm-4.col-form-label(for="camera-resolution-x") Camera resolution
                        .col-sm-4.input-group
                            input#camera-resolution-x.form-control(type="number" placeholder="Pixels X" v-model="resolutionX")
                            .input-group-append
                                span.input-group-text pixels
                        .col-sm-4.input-group
                            input#camera-resolution-y.form-control(type="number" placeholder="Pixels Y" v-model="resolutionY")
                            .input-group-append
                                span.input-group-text pixels
                            
                    
                    // Sensor dimensions
                    .form-group.row
                        label.col-sm-4.col-form-label(for="camera-sensor-width") Sensor dimensions in mm
                        .col-sm-4.input-group
                            input#camera-sensor-width.form-control(type="number" placeholder="Sensor width" v-model="sensorWidth")
                            .input-group-append
                                span.input-group-text mm
                        .col-sm-4.input-group
                            input#camera-sensor-height.form-control(type="number" placeholder="Sensor height" v-model="sensorHeight")
                            .input-group-append
                                span.input-group-text mm

                    // Pixel size
                    .form-group.row
                        label.col-sm-4.col-form-label(for="camera-pixel-size") Your camera's pixel size, calculated from resolution and sensor dimensions
                        .col-sm-8
                            .input-group
                                input#camera-pixel-size.form-control(type="number" readonly v-model="pixelSize" placeholder="Please enter both your camera's details to calculate the pixel size.")
                                .input-group-append
                                    span.input-group-text µm
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
        }
    }},

    computed: {
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
        },

        pixelSize: {
            get() {
                if(this.sensorWidth > 0.0 && this.sensorHeight > 0.0
                && this.resolutionX > 0.0 && this.resolutionY > 0.0) {
                    // Calculate pixel size
                    let pixelSizeX = this.sensorWidth  / this.resolutionX * 1000;
                    let pixelSizeY = this.sensorHeight / this.resolutionY * 1000;
                    let avgPixelSize = (pixelSizeX + pixelSizeY) / 2;
                    
                    return Math.round(avgPixelSize * 100) / 100;
                } else {
                    return null;
                }
            }
        },

        telescopeResolution: {
            get() {
                if(this.cameraPixelSize) {
                    // Calculate telescope resolution
                    if(this.focalLength > 0.0) {
                        return Math.round(this.cameraPixelSize / this.focalLength * 206.3 * 100) / 100;
                    }
                } else {
                    return null;
                }
            }
        }
    },
    methods: {

    }
}
</script>
<style lang="scss" scoped>

</style>
