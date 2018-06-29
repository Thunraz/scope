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
import SamplingCameras from '@/components/SamplingCameras';

export default {
    name: 'Sampling',
    components: {
        SamplingCameras
    },

    data: () => { return {
        binning: 1,
        barlowLens: 1,

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
        ]
    }}
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
