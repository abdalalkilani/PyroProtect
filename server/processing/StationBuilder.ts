import { FWIStation } from "./FWIStation";
import { Station, SensorReadings } from "./Station";
import { Circle, Point, findProbabilities, radiusFromFWI, findColouredAreas } from "./CircleFunctions";

type StationInfo = {
    id: string;
    station: Station | FWIStation;
    circle: Circle;
};

class StationBuilder {
    readonly defaultIndex: string = 'FWI';
    private uniqueId: number = 0; 
    private chosenIndex: string;
    private _stationList: StationInfo[];

    constructor(_chosenIndex: string){
        this.chosenIndex = _chosenIndex;
        this._stationList = [];
    }

    public build(x: number, y: number){
        switch(this.chosenIndex){
            case this.defaultIndex: {
                const res = new FWIStation(`station-${this.uniqueId}`);
                const info: StationInfo = {
                    id: `station-${this.uniqueId}`,
                    station: res,
                    circle: {
                        x: x,
                        y: y,
                        r: -1
                    }
                }
                this.uniqueId += 1;
                this._stationList.push(info);
                // res.readings = params;
                // res.temperature = params.temperature;
                // res.relativeHumidity = params.relativeHumidity;
                // res.windSpeed = params.windSpeed;
                // res.precipitation = params.precipitation;
                return res;
            }
            default: {
                throw new Error("NO INDEX CHOSEN");
            }
        }
    }

    public get stationList(): StationInfo[]{
        return this._stationList;
    }

    public getProbabilities():number[][]{
        if(this.stationList.length < 3){
            throw new Error("not enough stations");
        }
        if(this.stationList.length > 3){
            throw new Error("too many stations");
        }
        this.stationList.forEach((stationInfo) => {
            stationInfo.station.update();
            stationInfo.circle.r = radiusFromFWI(stationInfo.station.fireIndex);
        });
        const tmp: number[][] = findColouredAreas(this.stationList.map((val) => {return val.circle}));
        return findProbabilities(tmp);
    }

    public getRadius():number[]{
        return this.stationList.map((val) => {
            return val.circle.r;
        })
    }
    public setPosition(name, x, y):number{
        var counter = 0;
        this.stationList.forEach((element) =>{
            if(element.id == name)
            {
                element.circle.x = x;
                element.circle.y = y;
                return counter;
            }
            counter++;
        });
        return -1;
    }
}

export { StationBuilder }