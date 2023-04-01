import { Station } from "./Station";
import {sendEmail} from "../src/mail"

enum EffeciveDayLength {
    January = 6.5,
    February = 7.5,
    March = 9.0,
    April = 12.8,
    May = 13.9,
    June = 13.9,
    July = 12.4,
    August = 10.9,
    September = 9.4,
    October = 8.0,
    November = 7.0,
    December = 6.0,
}
enum EffeciveDayLengthFactor {
    January = -1.6,
    February = -1.6,
    March = -1.6,
    April = 0.9,
    May = 3.8,
    June = 5.8,
    July = 6.4,
    August = 5.0,
    September = 2.4,
    October = 0.4,
    November = -1.6,
    December = -1.6,
}

class FWIStation extends Station{
    private currentFWI: number;
    private currentFFMC: number;
    private currentDMC: number;
    private currentDC: number;
    private currentBUI: number;
    private currentISI: number;

    private effectiveDayLength: number;
    private effectiveDayLengthFactor: number;

    constructor(name: string){
        super(name);
        this.effectiveDayLength = EffeciveDayLength.February;
        this.effectiveDayLengthFactor = EffeciveDayLengthFactor.February;

        // previous day's FWI
        this.currentFFMC = 85;
        this.currentDMC = 6;
        this.currentDC = 15;
    }

    get fireIndex(){
        return this.currentFWI;
    }

    // Fine Fuel Moisture Code
    private calculateFFMC(): FWIStation {
        // previous day's fine fuel moisture content: prevMT
        let prevMT = 147.2 * (101 - this.currentFFMC) / (59.5 + this.currentFFMC);
        
        // if there is rain
        if (this.precipitation > 0.5) {
            let pf = this.precipitation - 0.5;

            // fine fuel moisture content of current day: mrt
            let mrt = prevMT + (42.5 * pf * Math.exp((-100) / (251 - prevMT)) * (1 - Math.exp(-6.93 / pf)));
          
            if (prevMT > 150) {
                mrt += 0.0015 * Math.pow(prevMT - 150, 2) * Math.pow(pf, 0.5);
            }
            if (mrt > 250) {
                mrt = 250;
            }
            prevMT = mrt;
        }
        
        // fine fuel moisture content for drying phases: ed
        const ed = 0.942 * Math.pow(this.relativeHumidity, 0.679) + 11 * Math.exp((this.relativeHumidity - 100) / 10) + 0.18 * (21.1 - this.temperature) * (1 - Math.exp(-0.115 * this.relativeHumidity));
        
        let mt: number;
        if (ed < prevMT) {
            // log drying rate: kd
            let ko = 0.424 * (1 - Math.pow(this.relativeHumidity / 100, 1.7)) + 0.0694 * this.windSpeed * (1 - Math.pow(this.relativeHumidity / 100, 8));
            let kd = ko * 0.581 * Math.exp(0.0365 * this.temperature);
            mt = ed + (prevMT - ed) * Math.pow(10, -kd);
        } 
        else{
            // fine fuel equilibrium moisture content for wetting phases: ew
            let ew = 0.618 * Math.pow(this.relativeHumidity, 0.753) + 10 * Math.exp((this.relativeHumidity - 100) / 10) + 0.18 * (21.1 - this.temperature) * (1 - Math.exp(-0.115 * this.relativeHumidity));
            if (ew > prevMT) {
                let k1 = 0.424 * (1 - Math.pow((100 - this.relativeHumidity) / 100, 1.7)) + 0.0694 * (1 - Math.pow((100 - this.relativeHumidity) / 100, 8));
                let kw = k1 * 0.581 * Math.exp(0.0365 * this.temperature);
                mt = ew - (ew - prevMT) * Math.pow(10, -kw);
            } else {
                mt = prevMT;
            }
        }
        
        this.currentFFMC = 59.5 * ((250 - mt) / (147.2 + mt));
        return this;
    }

    // Duff Moisture Code
    private calculateDMC(): FWIStation{
        // effective day-length: L_e
        let L_e: number = this.effectiveDayLength;

        const tmp:number = Math.max(this.temperature, -1.1); // if temperature < -1.1 then temp = -1.1

        // log drying rate in DMC: K
        let K = 1.894 * (tmp + 1.1) * (100- this.relativeHumidity) * L_e * 0.000001;
        
        if(this.precipitation < 1.5){
            this.currentDMC = this.currentDMC + (100*K);
            return this
        }

        // effective rainfall (mm): P_e
        let P_e: number = 0.92 * this.precipitation - 1.27;

        // duff moisture content from previous day: prev_M
        let prev_M : number= 20 + Math.exp(5.6348 - (this.currentDMC)/43.43);

        // slope variable in DMC rain effect: b
        let b: number;
        if(this.currentDMC <= 33){
            b = 100 / (0.5 + 0.3 * this.currentDMC);
        }
        else if(this.currentDMC <= 65){
            b = 14 - 1.3 * Math.log(this.currentDMC);
        }
        else{
            b = 6.2 * Math.log(this.currentDMC) - 17.2;
        }

        // duff moisture rain content after rain: M_r_t
        let M_r_t: number = prev_M + ((1000*P_e)/(48.77 + b*P_e));

        // DMC after rain: DMC_r_t
        let DMC_r_t: number = Math.max(244.72 - 43.43 * Math.log(M_r_t - 20), 0);

        this.currentDMC = DMC_r_t + 100*K;


        return this;
    }

    // Drought Code
    private calculateDC(): FWIStation{
        const L_f = this.effectiveDayLengthFactor;

        const tmp = Math.max(this.temperature, -2.8); // if temperature < -2.8 then tmp = -2.8

        // potential evapotranspiration: V
        const V = Math.max( 0.36 * (tmp+ 2.8) + L_f, 0); // if V < 0 then V = 0

        if(this.precipitation <= 2.8){
            this.currentDC = this.currentDC + 0.5 * V;
            return this;
        }

        // effective rainfall (mm): P_d
        const P_d = 0.83 * this.precipitation - 1.27;

        // moisture equivalent of previous day's DC: prevQ
        const prevQ = 800 * Math.exp(-this.currentDC/400);

        // moisture equivalent after rain: Q_r_t
        const Q_r_t = prevQ + 3.937 * P_d

        // DC after rain: DC_r_t
        const DC_r_t = Math.max(400 * Math.log(800/Q_r_t), 0) // if DC_r_t < 0 then DC_r_t = 0

        this.currentDC = DC_r_t + 0.5 * V;
        return this;
    }
    
    // Initial Spread Index
    private calculateISI(): FWIStation{
        // fuel moisture content (%): m
        const m = 147.2 * ((101-this.currentFFMC)/(59.5 + this.currentFFMC));
        this.currentISI = 0.208 * Math.exp(0.05039*this.windSpeed) * (91.9 * Math.exp(-0.1386*m)) * (1 + Math.pow(m, 5.31)/49300000);
        return this;
    }

    // Buildup Index
    private calculateBUI(): FWIStation{
        if(this.currentDMC <= 0.4 * this.currentDC){
            this.currentBUI = 0.8 * ((this.currentDMC * this.currentDC)/(this.currentDMC + 0.4*this.currentDC));
        }
        else{
            this.currentBUI = this.currentDMC - (1- ((0.8*this.currentDC)/(this.currentDMC + 0.4*this.currentDC))) * (0.92 + Math.pow((0.0114*this.currentDMC), 1.7));
        }
        return this;
    }

    // Fire Weather Index
    private calculateFWI(): FWIStation{
        var b : number = 0.1 * this.currentISI;
        
        if(this.currentBUI <= 80){
            b *= (0.626 * Math.pow(this.currentBUI, 0.809) + 2); 
            // this.currentFWI = b * (0.626 * Math.pow(this.currentBUI, 0.809) + 2);
        }
        else{
            b *= (1000/(25 + 108.64 * Math.exp(-0.023 * this.currentBUI)));
        }
        
        if(b > 1){
            // console.log(Math.exp(2.72 * Math.pow(0.434 * Math.log(b), 0.647)));
            this.currentFWI = Math.exp(2.72 * Math.pow(0.434 * Math.log(b), 0.647));
            return this;
        }
        this.currentFWI = b;
        return this;
    }

    public updateFWI(): FWIStation{
        // console.log(this.temperature);
        // console.log(this.currentFWI);
        this.calculateFFMC()
            .calculateDMC()
            .calculateDC()
            .calculateISI()
            .calculateBUI()
            .calculateFWI();
        if(this.currentFWI > 5)
            sendEmail();
        return this;
    }

    public update(): any {
        return this.updateFWI();
    }

}

export { FWIStation };