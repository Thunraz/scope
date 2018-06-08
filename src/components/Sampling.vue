<template lang="pug">
    .container-fluid
        b-modal#addCameraModal(title="Add new camera", size="lg", @shown="onCameraModalShow", ok-title="Add", v-bind:ok-disabled="addCameraModalDisableOk", @show="clearModal", @ok="addCamera")
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
        
        b-modal(title="Remove camera", ref="removeCameraModal", lazy, ok-title="Remove", @ok="removeCamera")
            span(v-if="removeCameraModal.camera") Really remove camera "{{removeCameraModal.camera.name}}"?
        
        form
            // Telescope
            fieldset.container
                .form-row
                    legend.form-label Telescope

                // Focal length
                .form-group.row
                    label.col-sm-4.col-form-label.text-right(for="telescope-focal-length") Focal length in mm
                    .col-sm-8.input-group
                        input#telescope-focal-length.form-control(type="number", placeholder="Telescope focal length", v-model="focalLength")
                        .input-group-append
                            span.input-group-text mm

                // Aperture
                .form-group.row
                    label.col-sm-4.col-form-label.text-right(for="telescope-aperture") Aperture in mm
                    .col-sm-8.input-group
                        input#telescope-aperture.form-control(type="number", placeholder="Telescope aperture", v-model="aperture")
                        .input-group-append
                            span.input-group-text mm
                
                // Barlow lens
                .form-group.row
                    label.col-sm-4.col-form-label.text-right(for="telescope-barlow") Barlow lens/reducer
                    .col-sm-8.input-group
                        b-form-radio-group#telescope-barlow(buttons, v-model="barlowLens", :options="availableBarlows", name="radiosBtnDefault")
                
                // f ratio
                .form-group.row
                    label.col-sm-4.col-form-label.text-right(for="telescope-f-ratio") &fnof; Ratio
                    .col-sm-8.input-group
                        input#telescope-f-ratio.form-control-plaintext(type="text", placeholder="Please fill in focal length and aperture", readonly, v-model="fRatio")
                
                // Maximum magnification
                .form-group.row
                    label.col-sm-4.col-form-label.text-right(for="telescope-maximum-magnification") Maximum magnification
                    .col-sm-8.input-group
                        input#telescope-maximum-magnification.form-control-plaintext(type="text", placeholder="Please fill in aperture", readonly, v-model="maxMagnification")
            
            // Cameras
            fieldset
                .form-row
                    legend.form-label Camera
                        span(v-if="cameraList.length != 1") s
                        b-button.ml-2(size="sm", variant="success", v-b-modal="'addCameraModal'") Add new
                b-table(striped, hover, outlined, :items="cameraList", :fields="cameraFields")
                    template(slot="resolution", slot-scope="data")
                        //|{{data.value.x}}&times;{{data.value.y}}&thinsp;px
                        span(v-b-tooltip.hover="", :title="data.value.x + '\u00d7' + data.value.y + '\u2009px native'") {{calcBinnedResolution(data.item)}}&thinsp;px
                    
                    template(slot="sensor", slot-scope="data")
                        |{{data.value.width}}&times;{{data.value.height}}&thinsp;mm
                    
                    template(slot="pixelSize", slot-scope="data")
                        span(v-b-tooltip.hover="", :title="data.value + '\u2009µm native'") {{calcBinnedPixelSize(data.item)}}&thinsp;µm

                    template(slot="visibleResolution", slot-scope="data")
                        span(v-if="data.item.visibleResolution != Infinity")
                            |{{calcVisibleResolution(data.item)}}&thinsp;
                            span.frac
                                sup arcseconds
                                span /
                                sub pixel

                    template(slot="fieldOfView", slot-scope="data")
                        span(v-if="data.item.visibleResolution != Infinity") {{calcFieldOfView(data.item)}}

                    template(slot="binning", slot-scope="data")
                        b-select(:options="binningOptions", v-model="data.item.binning", @change="updateBinning(data.index, data.item, $event)")

                    template(slot="HEAD_sampling", slot-scope="data")
                        span(v-b-tooltip.hover="", title="Ideal resolution 0.67-2.00 pixels per arcsecond") {{data.label}}

                    template(slot="sampling", slot-scope="data")
                        b-badge(variant="danger"  v-if="calcVisibleResolution(data.item) < 0.33",                                              v-b-popover.hover="oversampling" title="Slight Oversampling") Significant Oversampling
                        b-badge(variant="warning" v-if="calcVisibleResolution(data.item) >= 0.33 && calcVisibleResolution(data.item) < 0.67",  v-b-popover.hover="oversampling" title="Slight Oversampling") Slight Oversampling
                        b-badge(variant="success" v-if="calcVisibleResolution(data.item) >= 0.67 && calcVisibleResolution(data.item) <= 2.00", v-b-popover.hover="goodSampling" title="Good Sampling") Good
                        b-badge(variant="warning" v-if="calcVisibleResolution(data.item) > 2.00 && calcVisibleResolution(data.item) < 3.00",   v-b-popover.hover="undersampling" title="Slight Undersampling") Slight Undersampling
                        b-badge(variant="danger"  v-if="calcVisibleResolution(data.item) >= 3.00",                                             v-b-popover.hover="undersampling" title="Significant Undersampling") Significant Undersampling
                    
                    template(slot="actions", slot-scope="row")
                        b-button(size="sm", @click.stop="showRemoveCameraModal(row.item)", variant="danger") Remove
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

        removeCameraModal: {
            camera: null
        },

        oversampling:  'There are too many pixels for the level of details your telescope is capable of. Slight oversampling might be okay for exceptionally good seeing conditions.',
        goodSampling:  'You have a good sampling. Your telescope provides a good resolution for this camera.',
        undersampling: 'Your telescope provides a higher resolution than your camera is capable of. Stars might look blocky as light they only hit one or few pixels.',

        availableBarlows: [
            { text: '0.5&times;', value: 0.5 },
            { text: 'None', value: 1 },
            { text: '2&times;', value: 2 },
            { text: '3&times;', value: 3 },
            { text: '5&times;', value: 5 }
        ],

        binningOptions: [
            { text: '1&times;1', value: 1 },
            { text: '2&times;2', value: 2 },
            { text: '3&times;3', value: 3 },
            { text: '4&times;4', value: 4 }
        ],

        cameraFields: {
            name:       { label: 'Name', sortable: true },
            resolution: { label: 'Resolution<br>(binned)' },
            sensor:     { },
            pixelSize:  { sortable: true, label: 'Pixel Size<br>(binned)' },
            visibleResolution: { sortable: true },
            fieldOfView: { label: 'FOV in arcmin' },
            binning:    { },
            sampling:   { sortable: true },
            actions:    { }
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

        barlowLens: {
            get() { return this.$store.state.telescope.barlowLens; },
            set(value) {
                this.$store.commit('updateTelescopeBarlowLens', value)
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
                return (this.$store.state.telescope.aperture * 2) + '\u2009\u00d7';
            }
        }
    },

    methods: {
        onCameraModalShow(e) {
            e.target.querySelector('input').focus();
        },

        showRemoveCameraModal(item) {
            this.$data.removeCameraModal.camera = item;
            this.$refs.removeCameraModal.show();
        },

        clearModal() {
            this.$data.addCameraModal = {
                name: '',
                resolution: { x: null, y: null },
                sensor: { width: null, height: null }
            };
        },

        updateBinning(index, data, binning) {
            data.binning = binning;
            this.$store.commit('updateCamera', { index, data })
        },

        addCamera() {
            let cameraData = Object.assign({}, this.$data.addCameraModal);
            this.$store.commit('addCamera', cameraData);

            this.clearModal();
        },

        removeCamera() {
            this.$store.commit('removeCamera', this.$data.removeCameraModal.camera);
        },

        calcVisibleResolution(item) {
            let visibleResolution =  Math.round(item.pixelSize / this.focalLength * this.barlowLens * 206.3 * 100) / 100 * item.binning;
            item.visibleResolution = visibleResolution;
            return visibleResolution;
        },

        calcFieldOfView(item) {
            let xFov = Math.round(item.visibleResolution * item.resolution.x / item.binning / 6) / 10;
            let yFov = Math.round(item.visibleResolution * item.resolution.y / item.binning / 6) / 10;

            return xFov + '\u2032\u2009\u00d7\u2009' + yFov + '\u2032';
        },

        calcBinnedPixelSize(item) {
            return Math.round(item.pixelSize * item.binning * 100) / 100;
        },

        calcBinnedResolution(item) {
            let xRes = item.resolution.x / item.binning;
            let yRes = item.resolution.y / item.binning;
            return xRes + '\u00d7' + yRes;
        }
    }
}
</script>
<style lang="scss" scoped>
span.frac {
    display: inline-block;
    font-size: .75em;
    text-align: center;

    & > sup {
        display: block;
        border-bottom: 1px solid;
        font: inherit;
    }

    & > span {
        display: none;
    }

    & > sub {
        display: block;
        margin-top: -0.75em;
        font: inherit;
    }
}
</style>
