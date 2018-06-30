<template lang="pug">
form.exposure-cameras
    .form-row
        legend.form-label Camera
            span(v-if="cameraList.length != 1") s
    
    b-table(striped, hover, outlined, :items="cameraList", :fields="cameraFields")
        template(slot="HEAD_qe", slot-scope="data")
            span(v-b-tooltip.hover="", title="Quantum efficiency") {{data.label}}

        template(slot="readNoise", slot-scope="data")
            span(v-if="data.value") {{data.value}}&thinsp;e&minus;

        template(slot="HEAD_singleExp", slot-scope="data")
            span(v-b-tooltip.hover="", :title="hover.singleExp") {{data.label}}

        template(slot="singleExp", slot-scope="data")
            span(v-if="calcSingleExp(data.item)") {{round(calcSingleExp(data.item), 0)}}&thinsp;s

        template(slot="HEAD_numberOfExps", slot-scope="data")
            span(v-b-tooltip.hover="", :title="hover.numberOfExps") {{data.label}}

        template(slot="numberOfExps", slot-scope="data")
            span(v-if="calcSingleExp(data.item)") {{round(calcNumberOfExps(data.item), 1)}}

</template>

<script>
export default {
    name: 'ExposureCameras',

    props: ['targetExposure', 'lightPollution', 'extraNoise'],

    data: () => { return {
        hover: {
            singleExp: 'Optimal exposure time for a single exposure',
            numberOfExps: 'Number of exposures you have to take to match the target exposure time as close as possible'
        },

        cameraFields: {
            name:         { label: 'Name', sortable: true },
            qe:           { label: 'QE', sortable: true, formatter: 'formatQE' },
            readNoise:    { sortable: true },
            singleExp:    { label: 't', formatter: 'formatSingleExp' },
            numberOfExps: { label: 'n' }
        }
    }},
    
    computed: {
        cameraList: {
            get() { return this.$store.state.cameras; }
        }
    },

    methods: {
        formatQE: function(qe) {
            return qe * 100 + '\u2009%';
        },

        round(number, digits) {
            let factor = Math.pow(10, digits);
            return Math.round(number * factor) / factor;
        },

        calcSingleExp(item) {
            let extraNoiseFactor = 1 / (Math.pow(1 + this.extraNoise / 100, 2) - 1);
            let noiseFactor = Math.pow(item.readNoise, 2) / (item.qe * this.lightPollution);
            return extraNoiseFactor * noiseFactor;
        },

        calcNumberOfExps(item) {
            return this.targetExposure * 60 / this.calcSingleExp(item);
        }
    }
}
</script>
