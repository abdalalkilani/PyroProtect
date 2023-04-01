"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StationBuilder = void 0;
const FWIStation_1 = require("./FWIStation");
const CircleFunctions_1 = require("./CircleFunctions");
class StationBuilder {
    defaultIndex = 'FWI';
    uniqueId = 0;
    chosenIndex;
    _stationList;
    constructor(_chosenIndex) {
        this.chosenIndex = _chosenIndex;
        this._stationList = [];
    }
    build(x, y) {
        switch (this.chosenIndex) {
            case this.defaultIndex: {
                const res = new FWIStation_1.FWIStation(`station-${this.uniqueId}`);
                const info = {
                    id: `station-${this.uniqueId}`,
                    station: res,
                    circle: {
                        x: x,
                        y: y,
                        r: -1
                    }
                };
                this.uniqueId += 1;
                this._stationList.push(info);
                return res;
            }
            default: {
                throw new Error("NO INDEX CHOSEN");
            }
        }
    }
    get stationList() {
        return this._stationList;
    }
    getProbabilities() {
        if (this.stationList.length < 3) {
            throw new Error("not enough stations");
        }
        if (this.stationList.length > 3) {
            throw new Error("too many stations");
        }
        this.stationList.forEach((stationInfo) => {
            stationInfo.station.update();
            stationInfo.circle.r = (0, CircleFunctions_1.radiusFromFWI)(stationInfo.station.fireIndex);
        });
        const tmp = (0, CircleFunctions_1.findColouredAreas)(this.stationList.map((val) => { return val.circle; }));
        return (0, CircleFunctions_1.findProbabilities)(tmp);
    }
    getRadius() {
        return this.stationList.map((val) => {
            return val.circle.r;
        });
    }
    setPosition(name, x, y) {
        var counter = 0;
        this.stationList.forEach((element) => {
            if (element.id == name) {
                element.circle.x = x;
                element.circle.y = y;
                return counter;
            }
            counter++;
        });
        return -1;
    }
}
exports.StationBuilder = StationBuilder;
