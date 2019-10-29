<template lang="pug">
#gear
    // Telescopes
    gear-telescopes
    
    // Cameras
    gear-cameras
</template>

<script>
import GearTelescopes from '@/components/GearTelescopes';
import GearCameras   from '@/components/GearCameras';

export default {
    name: 'Gear',
    components: {
        GearTelescopes,
        GearCameras
    }
}
</script>
