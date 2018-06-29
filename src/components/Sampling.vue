<template lang="pug">
form
    // Barlow lens
    .form-group
        label(for="telescope-barlow") Barlow lens/reducer
        .input-group.col-sm-12.col-md-6.col-lg-4.col-xl-2
            b-form-radio-group#telescope-barlow(buttons, v-model="barlowLens", :options="availableBarlows", name="radiosBtnDefault")
    
    // Binning
    .form-group
        label(for="telescope-barlow") Binning
        .input-group.col-sm-12.col-md-6.col-lg-4.col-xl-2
            b-select(:options="binningOptions", v-model="binning")

    sampling-cameras
</template>
<script>
import SamplingCameras from '@/components/SamplingCameras';

export default {
    name: 'Sampling',
    components: {
        SamplingCameras
    },

    data: () => { return {
        oversampling:  'There are too many pixels for the level of details your telescope is capable of. Slight oversampling might be okay for exceptionally good seeing conditions.',
        goodSampling:  'You have a good sampling. Your telescope provides a good resolution for this camera.',
        undersampling: 'Your telescope provides a higher resolution than your camera is capable of. Stars might look blocky as light they only hit one or few pixels.',

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
