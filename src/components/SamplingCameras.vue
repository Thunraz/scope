<template lang="pug">
form.sampling-cameras
    .form-row
        legend.form-label Camera
            span(v-if="cameraList.length != 1") s
    
    b-table(striped, hover, outlined, :items="cameraList", :fields="cameraFields")
        template(slot="resolution", slot-scope="data")
            //|{{data.value.x}}&times;{{data.value.y}}&thinsp;px
            span(v-b-tooltip.hover="", :title="data.value.x + '\u00d7' + data.value.y + '\u2009px native'") {{calcBinnedResolution(data.item)}}&thinsp;px
        
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

        template(slot="HEAD_sampling", slot-scope="data")
            span(v-b-tooltip.hover="", title="Ideal resolution 0.67-2.00 pixels per arcsecond") {{data.label}}

        template(slot="sampling", slot-scope="data")
            b-badge(variant="danger"  v-if="calcVisibleResolution(data.item) < 0.33",                                              v-b-popover.hover="oversampling" title="Slight Oversampling") Significant Oversampling
            b-badge(variant="warning" v-if="calcVisibleResolution(data.item) >= 0.33 && calcVisibleResolution(data.item) < 0.67",  v-b-popover.hover="oversampling" title="Slight Oversampling") Slight Oversampling
            b-badge(variant="success" v-if="calcVisibleResolution(data.item) >= 0.67 && calcVisibleResolution(data.item) <= 2.00", v-b-popover.hover="goodSampling" title="Good Sampling") Good
            b-badge(variant="warning" v-if="calcVisibleResolution(data.item) >  2.00 && calcVisibleResolution(data.item) < 3.00",  v-b-popover.hover="undersampling" title="Slight Undersampling") Slight Undersampling
            b-badge(variant="danger"  v-if="calcVisibleResolution(data.item) >= 3.00",                                             v-b-popover.hover="undersampling" title="Significant Undersampling") Significant Undersampling
</template>

<script>
export default {
    name: 'SamplingCameras',

    props: ['binning', 'barlowLens'],

    data: () => { return {
        oversampling:  'There are too many pixels for the level of details your telescope is capable of. Slight oversampling might be okay for exceptionally good seeing conditions.',
        goodSampling:  'You have a good sampling. Your telescope provides a good resolution for this camera.',
        undersampling: 'Your telescope provides a higher resolution than your camera is capable of. Stars might look blocky as light they only hit one or few pixels.',

        cameraFields: {
            name:       { label: 'Name', sortable: true },
            resolution: { label: 'Resolution (binned)' },
            pixelSize:  { sortable: true, label: 'Pixel Size (binned)' },
            visibleResolution: { sortable: true },
            fieldOfView: { label: 'FOV in arcmin' },
            sampling:   { sortable: true, label: 'Sampling rating' }
        }
    }},

    computed: {
        cameraList: {
            get() { return this.$store.state.cameras; }
        }
    },

    methods: {
        calcBinnedResolution(item) {
            let xRes = item.resolution.x / this.binning;
            let yRes = item.resolution.y / this.binning;
            return xRes + '\u00d7' + yRes;
        },

        calcBinnedPixelSize(item) {
            return Math.round(item.pixelSize * this.binning * 100) / 100;
        },

        calcVisibleResolution(item) {
            let focalLength = this.$store.state.telescope.focalLength;

            let visibleResolution =  Math.round(item.pixelSize / focalLength * this.barlowLens * 206.3 * 100) / 100 * this.binning;
            item.visibleResolution = visibleResolution;
            return visibleResolution;
        },

        calcFieldOfView(item) {
            let xFov = Math.round(item.visibleResolution * item.resolution.x / this.binning / 6) / 10;
            let yFov = Math.round(item.visibleResolution * item.resolution.y / this.binning / 6) / 10;

            return xFov + '\u2032\u2009\u00d7\u2009' + yFov + '\u2032';
        }
    }
}
</script>

