<template lang="pug">
form.gear-telescopes
    b-modal#addTelescopeModal(title="Add new telescope", size="lg", @shown="onTelescopeModalShow", ok-title="Add", v-bind:ok-disabled="addTelescopeModalDisableOk", @show="clearModal", @ok="addTelescope")
        form
            fieldset
                // Telescope name
                .form-group.row
                    label.col-sm-4.col-form-label(for="modal-telescope-name") Name
                    .col-sm-8
                        .input-group
                            input#modal-telescope-name.form-control(type="text", placeholder="Telescopes name", v-model="addTelescopeModal.name")
                
                // Telescope focal length
                .form-group.row
                    label.col-sm-4.col-form-label(for="telescope-focal-length") Focal length
                    .col-sm-8
                        .input-group
                            input#modal-telescope-focal-length.form-control(type="number", placeholder="Focal length", v-model="addTelescopeModal.focalLength")
                            .input-group-append
                                span.input-group-text mm

                // Telescope aperture
                .form-group.row
                    label.col-sm-4.col-form-label(for="telescope-aperture") Aperture
                    .col-sm-8
                        .input-group
                            input#modal-camera-resolution-x.form-control(type="number", placeholder="Aperture", v-model="addTelescopeModal.aperture")
                            .input-group-append
                                span.input-group-text mm

    .form-row
        legend.form-label Telescope
            span(v-if="telescopeList.length != 1") s
            b-button.ml-2(size="sm", variant="success", v-b-modal="'addTelescopeModal'") Add new
    
    b-table(striped, hover, outlined, :items="telescopeList", :fields="telescopeFields")
        template(slot="HEAD_fRatio", slot-scope="data")
            span &fnof; Ratio
        
        template(slot="focalLength", slot-scope="data")
            |{{data.value}}&thinsp;mm
        
        template(slot="aperture", slot-scope="data")
            |{{data.value}}&thinsp;mm

        template(slot="maximumMagnification", slot-scope="data")
            |{{data.value}}&thinsp;&times;

        template(slot="dawesLimit", slot-scope="data")
            |{{data.value}}&thinsp;arcseconds
        
        template(slot="actions", slot-scope="row")
            b-button(size="sm", @click.stop="showRemoveCameraModal(row.item)", variant="danger") Remove
</template>

<script>
import Telescope from '../store/Telescope';

export default {
    name: 'GearTelescopes',

    data: () => { return {
        addTelescopeModal: {
            name: '',
            focalLength: 0,
            aperture: 0,
        },

        removeTelescopeModal: {
            telescope: null
        },

        telescopeFields: {
            name:                 { label: 'Name', sortable: true },
            focalLength:          { label: 'Focal Length' },
            aperture:             { label: 'Aperture' },
            fRatio:               { },
            maximumMagnification: { label: 'Maximum Magnification' },
            dawesLimit:           { label: 'Dawes\' Limit' },
        }
    }},

    computed: {
        telescopeList: {
            get() {
                const scopes = [];
                const stateTelescopes = this.$store.state.telescopes;

                for(let i = 0; i < stateTelescopes.length; i++) {
                    scopes.push(new Telescope(
                        stateTelescopes[i].name,
                        stateTelescopes[i].focalLength,
                        stateTelescopes[i].aperture,
                    ));
                }

                return scopes;
            }
        },

        addTelescopeModalDisableOk: {
            get() {
                let modalData = this.$data.addTelescopeModal;

                let validName        = modalData.name != '';
                let validFocalLength = modalData.focalLength > 0.0;
                let validAperture    = modalData.aperture > 0.0;

                return !(validName && validFocalLength && validAperture);
            }
        },
    },

    methods: {
        onTelescopeModalShow(e) {
            e.target.querySelector('input').focus();
        },

        showRemoveTelescopeModal(item) {
            this.$data.removeTelescopeModal.telescope = item;
            this.$refs.removeTelescopeModal.show();
        },

        clearModal() {
            this.$data.addTelescopeModal = {
                name: '',
                focalLength: 0,
                aperture: 0,
            };
        },

        addTelescope() {
            let telescopeData = Object.assign({}, this.$data.addTelescopeModal);
            this.$store.commit('addTelescope', telescopeData);

            this.clearModal();
        },

        removeTelescope() {
            this.$store.commit('removeCamera', this.$data.removeCameraModal.camera);
        }
    }
}
</script>

<style scoped>
.spacer {
    margin: 0 1em;
}
</style>
