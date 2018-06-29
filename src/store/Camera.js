function calcPixelSize(sensor, resolution) {
    if(!sensor)     return;
    if(!resolution) return;

    let pixelSizeX = sensor.width  / resolution.x * 1000;
    let pixelSizeY = sensor.height / resolution.y * 1000;
    let avgPixelSize = (pixelSizeX + pixelSizeY) / 2;

    return Math.round(avgPixelSize * 100) / 100;
}

class Camera {
    constructor(name, resolution, sensor, qe, readNoise) {
        this.name       = name;
        this.resolution = Object.assign({}, resolution);
        this.sensor     = Object.assign({}, sensor);
        this.qe         = qe || 0;
        this.readNoise  = readNoise || 0;
        
        this.pixelSize  = calcPixelSize(this.sensor, this.resolution);
        this.visibleResolution = 0.0;
        this.binning    = 1;
    }
}

export default Camera;