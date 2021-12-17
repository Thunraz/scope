<template lang="pug">
form#sampling
    // Barlow lens
    .form-group
        label(for="telescope-barlow") Barlow lens/reducer
        .input-group.col-sm-12.col-md-6.col-lg-4.col-xl-4
            b-form-radio-group#telescope-barlow(buttons, v-model="barlowLens", :options="availableBarlows", name="radiosBtnDefault")
    
    // Binning
    .form-group
        label(for="telescope-barlow") Binning
        .input-group.col-sm-12.col-md-6.col-lg-4.col-xl-4
            b-select(:options="binningOptions", v-model="binning")

    sampling-cameras(:binning="binning", :barlowLens="barlowLens")
</template>
<script>
import SamplingCameras from '../components/SamplingCameras.vue';

export default {
    name: 'Sampling',
    components: {
        SamplingCameras
    },

    data: () => { return {
        binning: 1,
        barlowLens: 1,

        availableBarlows: [
            { text: '0.5\u00d7', value: 0.5 },
            { text: 'None', value: 1 },
            { text: '2\u00d7', value: 2 },
            { text: '3\u00d7', value: 3 },
            { text: '5\u00d7', value: 5 }
        ],

        binningOptions: [
            { text: '1\u00d71', value: 1 },
            { text: '2\u00d72', value: 2 },
            { text: '3\u00d73', value: 3 },
            { text: '4\u00d74', value: 4 }
        ]
    }}
}
</script>
<style scoped>
span.frac {
    display: inline-block;
    font-size: .75em;
    text-align: center;
}

span.frac > sup {
    display: block;
    border-bottom: 1px solid;
    font: inherit;
}

span.frac > span {
    display: none;
}

span.frac > sub {
    display: block;
    margin-top: -0.75em;
    font: inherit;
}
</style>
