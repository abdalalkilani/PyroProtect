
type SensorReadings = {
    temperature: number;
    relativeHumidity: number;
    windSpeed: number;
    precipitation: number;
}


// a station represents a pi
abstract class Station {
    private _stationId: string; // unique id for each station
    private _temperature: number; // Celsius
    private _relativeHumidity: number; // percentage
    private _windSpeed:number; // km/h
    private _precipitation: number; // mm
    private _updated: boolean;
    private _samplingRate: number = 5; // s

    constructor(name: string){
        this._stationId = name;
    }

    public abstract get fireIndex(): number;

    public set temperature(temp: number){
        this._temperature = temp;
    }

    public get temperature(): number{
        return this._temperature;
    }

    public set relativeHumidity(val: number){
        this._relativeHumidity = val;
    }

    public get relativeHumidity(): number{
        return this._relativeHumidity;
    }

    public set windSpeed(val: number){
        this._windSpeed = val;
    }
    
    public get windSpeed(): number{
        return this._windSpeed;
    }

    public set precipitation(val: number){
        this._precipitation = val;
    }

    public get precipitation(): number{
        return this._precipitation;
    }

    public set readings(params: SensorReadings){
        this._temperature = params.temperature;
        this._relativeHumidity = params.relativeHumidity;
        this._windSpeed = params.windSpeed;
        this._precipitation = params.precipitation;
        this._updated = true;
    }

    public get updated(): boolean{
        return this._updated;
    }

    public set updated(b: boolean){
        this._updated = b;
    }

    public get samplingRate(): number{
        return this._samplingRate;
    }

    public set sampingRate(s: number){
        this._samplingRate = s;
    }

    public abstract update(): any;

}

export { Station, SensorReadings }