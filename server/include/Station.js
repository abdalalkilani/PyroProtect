"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Station = void 0;
class Station {
    _stationId;
    _temperature;
    _relativeHumidity;
    _windSpeed;
    _precipitation;
    _updated;
    _samplingRate = 5;
    constructor(name) {
        this._stationId = name;
    }
    set temperature(temp) {
        this._temperature = temp;
    }
    get temperature() {
        return this._temperature;
    }
    set relativeHumidity(val) {
        this._relativeHumidity = val;
    }
    get relativeHumidity() {
        return this._relativeHumidity;
    }
    set windSpeed(val) {
        this._windSpeed = val;
    }
    get windSpeed() {
        return this._windSpeed;
    }
    set precipitation(val) {
        this._precipitation = val;
    }
    get precipitation() {
        return this._precipitation;
    }
    set readings(params) {
        this._temperature = params.temperature;
        this._relativeHumidity = params.relativeHumidity;
        this._windSpeed = params.windSpeed;
        this._precipitation = params.precipitation;
        this._updated = true;
    }
    get updated() {
        return this._updated;
    }
    set updated(b) {
        this._updated = b;
    }
    get samplingRate() {
        return this._samplingRate;
    }
    set sampingRate(s) {
        this._samplingRate = s;
    }
}
exports.Station = Station;
