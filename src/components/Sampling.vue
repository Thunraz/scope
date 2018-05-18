<template lang="pug">
    .container
        form
            // Telescope
            fieldset
                .form-row
                    legend.form-label Telescope

                // Focal length
                .form-group.row
                    label.col-sm-4.col-form-label(for="telescope-focal-length") Your telescope's focal length in mm
                    .col-sm-8.input-group
                        input#telescope-focal-length.form-control(type="number", placeholder="Telescope focal length", v-model="telescopeFocalLength", v-on:keyup="doCalculations", v-on:change="save")
                        .input-group-append
                            span.input-group-text mm

                // Aperture
                .form-group.row
                    label.col-sm-4.col-form-label(for="telescope-aperture") Your telescope's aperture in mm
                    .col-sm-8.input-group
                        input#telescope-aperture.form-control(type="number", placeholder="Telescope aperture", v-model="telescopeAperture", v-on:keyup="doCalculations", v-on:change="save")
                        .input-group-append
                            span.input-group-text mm

                // f ratio
                .form-group.row
                    label.col-sm-4.col-form-label(for="telescope-aperture") Your telescope's f ratio, calculated from focal length and aperture
                    .col-sm-8
                        input#telescope-f-number.form-control(type="number", readonly, v-model="telescopeFRatio", placeholder="Please enter both your telescope's focal length and aperture to calculate the f ratio.")
</template>
<script>

function saveData(data) {
    if(localStorage) {
        localStorage.setItem('data', data);
    }
}

function getData() {
    if(localStorage) {
        let allData = localStorage.getItem('data');
        allData = JSON.parse(allData);
        for(let data in allData) {
            this.$data[data] = allData[data];
        }

        //this.doCalculations();
    }
}

getData();

export default {
    name: 'Sampling',
    data() {
        return {
            telescopeFocalLength: null,
            telescopeAperture: null,
            telescopeFRatio: null
        }
    },
    methods: {
        save: () => {
            
            //saveData(JSON.stringify(this.$data));
        },

        doCalculations: () => {
            if(this.telescopeFocalLength > 0.0 && this.telescopeAperture > 0.0) {
                this.telescopeFocalLength = this.telescopeFocalLength;
                this.telescopeAperture    = this.telescopeAperture;
                this.telescopeFRatio      = Math.round(this.telescopeFocalLength / this.telescopeAperture * 100) / 100;

                this.maxMagnification = this.telescopeAperture * 2;
            }

            if(this.cameraSensorWidth > 0.0 && this.cameraSensorHeight > 0.0
            && this.cameraResolutionX > 0.0 && this.cameraResolutionY > 0.0) {
                let pixelSizeX = this.cameraSensorWidth  / this.cameraResolutionX * 1000;
                let pixelSizeY = this.cameraSensorHeight / this.cameraResolutionY * 1000;
                let avgPixelSize = (pixelSizeX + pixelSizeY) / 2;
                this.cameraPixelSize = Math.round(avgPixelSize * 100) / 100;

                if(this.telescopeFocalLength > 0.0) {
                    this.telescopeResolution = Math.round(this.cameraPixelSize / this.telescopeFocalLength * 206.3 * 100) / 100;
                }
            }
        }
    }
}
</script>
<style lang="scss" scoped>

</style>
