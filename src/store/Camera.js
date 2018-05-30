class Camera {
    constructor(name, sensor, resolution) {
        this.name = name;
        Object.assign(this.sensor, sensor);
        Object.assign(this.resolution, resolution);
    }
}

export default Camera;