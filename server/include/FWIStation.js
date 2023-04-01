"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FWIStation = void 0;
const Station_1 = require("./Station");
const mail_1 = require("../src/mail");
var EffeciveDayLength;
(function (EffeciveDayLength) {
    EffeciveDayLength[EffeciveDayLength["January"] = 6.5] = "January";
    EffeciveDayLength[EffeciveDayLength["February"] = 7.5] = "February";
    EffeciveDayLength[EffeciveDayLength["March"] = 9] = "March";
    EffeciveDayLength[EffeciveDayLength["April"] = 12.8] = "April";
    EffeciveDayLength[EffeciveDayLength["May"] = 13.9] = "May";
    EffeciveDayLength[EffeciveDayLength["June"] = 13.9] = "June";
    EffeciveDayLength[EffeciveDayLength["July"] = 12.4] = "July";
    EffeciveDayLength[EffeciveDayLength["August"] = 10.9] = "August";
    EffeciveDayLength[EffeciveDayLength["September"] = 9.4] = "September";
    EffeciveDayLength[EffeciveDayLength["October"] = 8] = "October";
    EffeciveDayLength[EffeciveDayLength["November"] = 7] = "November";
    EffeciveDayLength[EffeciveDayLength["December"] = 6] = "December";
})(EffeciveDayLength || (EffeciveDayLength = {}));
var EffeciveDayLengthFactor;
(function (EffeciveDayLengthFactor) {
    EffeciveDayLengthFactor[EffeciveDayLengthFactor["January"] = -1.6] = "January";
    EffeciveDayLengthFactor[EffeciveDayLengthFactor["February"] = -1.6] = "February";
    EffeciveDayLengthFactor[EffeciveDayLengthFactor["March"] = -1.6] = "March";
    EffeciveDayLengthFactor[EffeciveDayLengthFactor["April"] = 0.9] = "April";
    EffeciveDayLengthFactor[EffeciveDayLengthFactor["May"] = 3.8] = "May";
    EffeciveDayLengthFactor[EffeciveDayLengthFactor["June"] = 5.8] = "June";
    EffeciveDayLengthFactor[EffeciveDayLengthFactor["July"] = 6.4] = "July";
    EffeciveDayLengthFactor[EffeciveDayLengthFactor["August"] = 5] = "August";
    EffeciveDayLengthFactor[EffeciveDayLengthFactor["September"] = 2.4] = "September";
    EffeciveDayLengthFactor[EffeciveDayLengthFactor["October"] = 0.4] = "October";
    EffeciveDayLengthFactor[EffeciveDayLengthFactor["November"] = -1.6] = "November";
    EffeciveDayLengthFactor[EffeciveDayLengthFactor["December"] = -1.6] = "December";
})(EffeciveDayLengthFactor || (EffeciveDayLengthFactor = {}));
class FWIStation extends Station_1.Station {
    currentFWI;
    currentFFMC;
    currentDMC;
    currentDC;
    currentBUI;
    currentISI;
    effectiveDayLength;
    effectiveDayLengthFactor;
    constructor(name) {
        super(name);
        this.effectiveDayLength = EffeciveDayLength.February;
        this.effectiveDayLengthFactor = EffeciveDayLengthFactor.February;
        this.currentFFMC = 85;
        this.currentDMC = 6;
        this.currentDC = 15;
    }
    get fireIndex() {
        return this.currentFWI;
    }
    calculateFFMC() {
        let prevMT = 147.2 * (101 - this.currentFFMC) / (59.5 + this.currentFFMC);
        if (this.precipitation > 0.5) {
            let pf = this.precipitation - 0.5;
            let mrt = prevMT + (42.5 * pf * Math.exp((-100) / (251 - prevMT)) * (1 - Math.exp(-6.93 / pf)));
            if (prevMT > 150) {
                mrt += 0.0015 * Math.pow(prevMT - 150, 2) * Math.pow(pf, 0.5);
            }
            if (mrt > 250) {
                mrt = 250;
            }
            prevMT = mrt;
        }
        const ed = 0.942 * Math.pow(this.relativeHumidity, 0.679) + 11 * Math.exp((this.relativeHumidity - 100) / 10) + 0.18 * (21.1 - this.temperature) * (1 - Math.exp(-0.115 * this.relativeHumidity));
        let mt;
        if (ed < prevMT) {
            let ko = 0.424 * (1 - Math.pow(this.relativeHumidity / 100, 1.7)) + 0.0694 * this.windSpeed * (1 - Math.pow(this.relativeHumidity / 100, 8));
            let kd = ko * 0.581 * Math.exp(0.0365 * this.temperature);
            mt = ed + (prevMT - ed) * Math.pow(10, -kd);
        }
        else {
            let ew = 0.618 * Math.pow(this.relativeHumidity, 0.753) + 10 * Math.exp((this.relativeHumidity - 100) / 10) + 0.18 * (21.1 - this.temperature) * (1 - Math.exp(-0.115 * this.relativeHumidity));
            if (ew > prevMT) {
                let k1 = 0.424 * (1 - Math.pow((100 - this.relativeHumidity) / 100, 1.7)) + 0.0694 * (1 - Math.pow((100 - this.relativeHumidity) / 100, 8));
                let kw = k1 * 0.581 * Math.exp(0.0365 * this.temperature);
                mt = ew - (ew - prevMT) * Math.pow(10, -kw);
            }
            else {
                mt = prevMT;
            }
        }
        this.currentFFMC = 59.5 * ((250 - mt) / (147.2 + mt));
        return this;
    }
    calculateDMC() {
        let L_e = this.effectiveDayLength;
        const tmp = Math.max(this.temperature, -1.1);
        let K = 1.894 * (tmp + 1.1) * (100 - this.relativeHumidity) * L_e * 0.000001;
        if (this.precipitation < 1.5) {
            this.currentDMC = this.currentDMC + (100 * K);
            return this;
        }
        let P_e = 0.92 * this.precipitation - 1.27;
        let prev_M = 20 + Math.exp(5.6348 - (this.currentDMC) / 43.43);
        let b;
        if (this.currentDMC <= 33) {
            b = 100 / (0.5 + 0.3 * this.currentDMC);
        }
        else if (this.currentDMC <= 65) {
            b = 14 - 1.3 * Math.log(this.currentDMC);
        }
        else {
            b = 6.2 * Math.log(this.currentDMC) - 17.2;
        }
        let M_r_t = prev_M + ((1000 * P_e) / (48.77 + b * P_e));
        let DMC_r_t = Math.max(244.72 - 43.43 * Math.log(M_r_t - 20), 0);
        this.currentDMC = DMC_r_t + 100 * K;
        return this;
    }
    calculateDC() {
        const L_f = this.effectiveDayLengthFactor;
        const tmp = Math.max(this.temperature, -2.8);
        const V = Math.max(0.36 * (tmp + 2.8) + L_f, 0);
        if (this.precipitation <= 2.8) {
            this.currentDC = this.currentDC + 0.5 * V;
            return this;
        }
        const P_d = 0.83 * this.precipitation - 1.27;
        const prevQ = 800 * Math.exp(-this.currentDC / 400);
        const Q_r_t = prevQ + 3.937 * P_d;
        const DC_r_t = Math.max(400 * Math.log(800 / Q_r_t), 0);
        this.currentDC = DC_r_t + 0.5 * V;
        return this;
    }
    calculateISI() {
        const m = 147.2 * ((101 - this.currentFFMC) / (59.5 + this.currentFFMC));
        this.currentISI = 0.208 * Math.exp(0.05039 * this.windSpeed) * (91.9 * Math.exp(-0.1386 * m)) * (1 + Math.pow(m, 5.31) / 49300000);
        return this;
    }
    calculateBUI() {
        if (this.currentDMC <= 0.4 * this.currentDC) {
            this.currentBUI = 0.8 * ((this.currentDMC * this.currentDC) / (this.currentDMC + 0.4 * this.currentDC));
        }
        else {
            this.currentBUI = this.currentDMC - (1 - ((0.8 * this.currentDC) / (this.currentDMC + 0.4 * this.currentDC))) * (0.92 + Math.pow((0.0114 * this.currentDMC), 1.7));
        }
        return this;
    }
    calculateFWI() {
        var b = 0.1 * this.currentISI;
        if (this.currentBUI <= 80) {
            b *= (0.626 * Math.pow(this.currentBUI, 0.809) + 2);
        }
        else {
            b *= (1000 / (25 + 108.64 * Math.exp(-0.023 * this.currentBUI)));
        }
        if (b > 1) {
            this.currentFWI = Math.exp(2.72 * Math.pow(0.434 * Math.log(b), 0.647));
            return this;
        }
        this.currentFWI = b;
        return this;
    }
    updateFWI() {
        this.calculateFFMC()
            .calculateDMC()
            .calculateDC()
            .calculateISI()
            .calculateBUI()
            .calculateFWI();
        if (this.currentFWI > 5)
            (0, mail_1.sendEmail)();
        return this;
    }
    update() {
        return this.updateFWI();
    }
}
exports.FWIStation = FWIStation;
