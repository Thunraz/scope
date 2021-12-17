<template lang="pug">
#gear
    // Telescope
    gear-telescope
    
    // Cameras
    gear-cameras
</template>

<script>
import GearTelescope from '../components/GearTelescope.vue';
import GearCameras   from '../components/GearCameras.vue';

export default {
    name: 'Gear',
    components: {
        GearTelescope,
        GearCameras
    }
}
</script>
