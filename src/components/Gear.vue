<template lang="pug">
#gear
    // Telescope
    gear-telescope
    
    // Cameras
    gear-cameras
</template>

<script>
import GearTelescope from '@/components/GearTelescope';
import GearCameras   from '@/components/GearCameras';

export default {
    name: 'Gear',
    components: {
        GearTelescope,
        GearCameras
    }
}
</script>
