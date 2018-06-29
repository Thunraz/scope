<template lang="pug">
form.gear-cameras
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

                // Sensor QE
                .form-group.row
                    label.col-sm-4.col-form-label(for="camera-qe") Sensor quantum efficiency
                    .col-sm-8
                        .input-group
                            input#modal-qe.form-control(type="number", min="0", max="100", step="1" placeholder="Quantum efficiency", v-model="addCameraModal.qe")
                            .input-group-append
                                span.input-group-text %

                // Sensor read noise
                .form-group.row
                    label.col-sm-4.col-form-label(for="camera-read-noise") Sensor read noise
                    .col-sm-8
                        .input-group
                            input#modal-qe.form-control(type="number", min="0", max="100", step=".1" placeholder="Sensor read noise", v-model="addCameraModal.readNoise")
                            .input-group-append
                                span.input-group-text e-
    
    b-modal(title="Remove camera", ref="removeCameraModal", lazy, ok-title="Remove", @ok="removeCamera")
        span(v-if="removeCameraModal.camera") Really remove camera "{{removeCameraModal.camera.name}}"?

    .form-row
        legend.form-label Camera
            span(v-if="cameraList.length != 1") s
            b-button.ml-2(size="sm", variant="success", v-b-modal="'addCameraModal'") Add new
    
    b-table(striped, hover, outlined, :items="cameraList", :fields="cameraFields")
        template(slot="resolution", slot-scope="data")
            //|{{data.value.x}}&times;{{data.value.y}}&thinsp;px
            span(v-b-tooltip.hover="", :title="data.value.x + '\u00d7' + data.value.y + '\u2009px native'") {{calcResolution(data.item)}}&thinsp;px
        
        template(slot="sensor", slot-scope="data")
            |{{data.value.width}}&times;{{data.value.height}}&thinsp;mm
        
        template(slot="sensorDiag", slot-scope="data")
            |{{calcSensorDiag(data.item)}}&thinsp;mm
        
        template(slot="sensorArea", slot-scope="data")
            |{{calcSensorArea(data.item)}}&thinsp;mm
            sup 2
        
        template(slot="pixelSize", slot-scope="data")
            span(v-b-tooltip.hover="", :title="data.value + '\u2009µm native'") {{calcPixelSize(data.item)}}&thinsp;µm
        
        template(slot="actions", slot-scope="row")
            b-button(size="sm", @click.stop="showRemoveCameraModal(row.item)", variant="danger") Remove
</template>

<script>
export default {
    name: 'GearCameras',

    data: () => { return {
        addCameraModal: {
            name: '',
            resolution: { x: null, y: null },
            sensor: { width: null, height: null },
            qe: 0,
            readNoise: 0
        },

        removeCameraModal: {
            camera: null
        },

        cameraFields: {
            name:       { label: 'Name', sortable: true },
            resolution: { label: 'Resolution' },
            sensor:     { },
            sensorDiag: { label: 'Sensor diagonal' },
            sensorArea: { },
            pixelSize:  { sortable: true, label: 'Pixel Size' },
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

                let validQE = modalData.qe >= 0 && modalData.qe <= 100;
                let validReadNoise = modalData.readNoise >= 0 && modalData.readNoise <= 100;

                return !(validName && validResolution && validDimensions && validQE && validReadNoise);
            }
        },

        cameraList: {
            get() { return this.$store.state.cameras; }
        }
    },

    methods: {
        calcResolution(item) {
            return item.resolution.x + '\u00d7' + item.resolution.y;
        },

        calcPixelSize(item) {
            return Math.round(item.pixelSize * 100) / 100;
        },

        calcSensorDiag(item) {
            let height = item.sensor.height;
            let width  = item.sensor.width;
            let diag = Math.sqrt(height * height + width * width);

            return Math.round(diag * 100) / 100;
        },

        calcSensorArea(item) {
            let height = item.sensor.height;
            let width  = item.sensor.width;

            return Math.round(height * width * 100) / 100;
        },
        
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

        addCamera() {
            let cameraData = Object.assign({}, this.$data.addCameraModal);
            this.$store.commit('addCamera', cameraData);

            this.clearModal();
        },

        removeCamera() {
            this.$store.commit('removeCamera', this.$data.removeCameraModal.camera);
        }
    }
}
</script>

