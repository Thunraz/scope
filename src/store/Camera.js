class Camera {
    constructor(name, resolution, sensor) {
        this.name       = name;
        this.resolution = Object.assign({}, resolution);
        this.sensor     = Object.assign({}, sensor);
    }

    pixelSize() {
        if(!this.sensor)     return;
        if(!this.resolution) return;

        let pixelSizeX = this.sensor.width  / this.resolution.x * 1000;
        let pixelSizeY = this.sensor.height / this.resolution.y * 1000;
        let avgPixelSize = (pixelSizeX + pixelSizeY) / 2;
        
        return Math.round(avgPixelSize * 100) / 100;
    }
}

export default Camera;