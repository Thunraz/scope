<template lang="pug">
form.gear-telescope
    .form-row
        legend.form-label Telescope
    
    // Focal length
    .form-group
        label(for="telescope-focal-length") Focal length in mm
        .input-group.col-sm-12.col-md-6.col-lg-4.col-xl-4
            input#telescope-focal-length.form-control(type="number", placeholder="Telescope focal length", v-model="focalLength")
            .input-group-append
                span.input-group-text mm
                
    // Aperture
    .form-group
        label(for="telescope-aperture") Aperture in mm
        .input-group.col-sm-12.col-md-6.col-lg-4.col-xl-4
            input#telescope-aperture.form-control(type="number", placeholder="Telescope aperture", v-model="aperture")
            .input-group-append
                span.input-group-text mm
        
    .form-group
        // f ratio
        strong &fnof; Ratio:&nbsp;
        span(v-if="!fRatio") Please fill in focal length and aperture
        span(v-else) {{fRatio}}

        span.spacer /

        // Maximum magnification
        strong Maximum magnification:&nbsp;
        span(v-if="!maxMagnification") Please fill in aperture
        span(v-else) {{maxMagnification}}

        span.spacer /

        // Dawes' limit
        strong Dawes' limit:&nbsp;
        span(v-if="!dawesLimit") Please fill in aperture
        span(v-else) {{dawesLimit}}
</template>

<script>
export default {
    name: 'GearTelescope',
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
                return (this.$store.state.telescope.aperture * 2) + '\u2009\u00d7';
            }
        },

        dawesLimit: {
            get() {
                return Math.round(11.6 / this.$store.state.telescope.aperture * 1000) / 1000 + '\u2009arcseconds';
            }
        }
    }
}
</script>

<style scoped>
.spacer {
    margin: 0 1em;
}
</style>
