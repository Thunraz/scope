<template lang="pug">
form#exposure-time
    p
        |Use this tool to calculate the optimal exposure time for your camera(s).
        |Based on #[a(href="https://forums.sharpcap.co.uk/viewtopic.php?f=35&t=456") these calculations] from
        |the #[a(href="https://www.sharpcap.co.uk/") SharpCap] developer.
        
    // Target exposure time T
    .form-group
        label(for="target-exposure") Target exposure time in minutes
        .input-group.col-sm-12.col-md-6.col-lg-4.col-xl-4
            input#target-exposure.form-control(type="number", placeholder="Target exposure time", v-model="targetExposure")
            .input-group-append
                span.input-group-text min

    // Light pollution background signal
    .form-group
        label(for="light-pollution")
            |Light pollution background signal in photons (&gamma;) per pixel per second.
            |5 &gamma;/pixel/s is a fairly strong background signal.
        .input-group.col-sm-12.col-md-6.col-lg-4.col-xl-4
            input#light-pollution.form-control(type="number", placeholder="Light pollution background signal", v-model="lightPollution")
            .input-group-append
                span.input-group-text &gamma; per pixel per second
    
    // Max allowed extra noise
    .form-group
        label(for="extra-noise")
            |The amount of extra noise we are prepared to accept. 5-10% is a reasonable range.
        .input-group.col-sm-12.col-md-6.col-lg-4.col-xl-4
            input#extra-noise.form-control(type="number", min="1", max="100", step="1" placeholder="Allowed extra noise", v-model="extraNoise")
            .input-group-append
                span.input-group-text %

    exposure-cameras(:targetExposure="targetExposure", :lightPollution="lightPollution", :extraNoise="extraNoise")
</template>

<script>
import ExposureCameras from '../components/ExposureCameras.vue';

export default {
    name: 'ExposureTime',

    components: {
        ExposureCameras
    },
    
    data: () => { return {
        targetExposure: 60,
        lightPollution: 5,
        extraNoise: 5
    }},

    computed: {
        cameraList: {
            get() {
                return this.$store.state.cameras;
            }
        }
    }

}
</script>
