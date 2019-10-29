class Telescope {
    calcFRatio() {
        if (this.focalLength > 0.0 && this.aperture > 0.0) {
            return Math.round(this.focalLength / this.aperture * 100) / 100;
        } else {
            return null;
        }
    }

    calcMaximumMagnification() {
        if (this.aperture > 0.0) {
            return this.aperture * 2.0;
        }
    }

    calcDawesLimit() {
        return Math.round(11.6 / this.aperture * 1000) / 100;
    }

    constructor(name, focalLength, aperture) {
        this.name        = name;
        this.focalLength = focalLength || 0;
        this.aperture    = aperture    || 0;
        
        this.fRatio               = this.calcFRatio();
        this.maximumMagnification = this.calcMaximumMagnification();
        this.dawesLimit           = this.calcDawesLimit();
    }
}

export default Telescope;
