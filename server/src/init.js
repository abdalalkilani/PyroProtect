const e = React.createElement;
// require('dotenv').config()
// const HOST = process.env.HOST
const HOST = 'http://13.41.188.158:8080'

function templateConcat(n, str){
    res = str
    for(i=0; i<n-1; i++){
        res+= " " + str
    }
    return res;
}

function hiddenOrVisible(data, i, j){
    Object.values(data).forEach(element => {
        if((element.x_pos==i)&&(element.y_pos==j)){
            return 'visible';
        }
    });
    return 'hidden';
}

class Map_ extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            initData: [],
            cachedData: [],
            grid: [],
            gridSize: 1,
            heatMap: []
        };
    }
    fetchHeatMap()
    {
        fetch(HOST + '/api/heatMap').then((res) => {
            return res.json();
        }).then((data)=>{
            this.setState({ heatMap : data});
            data.forEach((row) =>{
                row.forEach((element)=>{
                    this.setState(({grid}, props) =>{
                        grid[element.y][element.x].color = element.color;
                        grid[element.y][element.x].probability = element.probability;
                        return {grid}
                });
                
                });
            });
        }).catch((err)=>{
            console.log(err);
        });
    }
    fetchCachedData(){
        fetch(HOST + '/api/cachedData').then((res) => {
            return res.json();
        }).then((data) => {
            this.setState({ cachedData: data });
            (Object.values(data)).forEach((element) => {
                this.setState(({grid}, props) => {
                    grid[element.y_pos][element.x_pos].visibility = 'visible';
                    grid[element.y_pos][element.x_pos].deviceId = element.deviceId;
                    return {grid}
                });
            });
        }).catch((err) => {
            console.error(err);
        });
    }

    componentDidMount() {
        this.timer = setInterval(() => {
            this.fetchCachedData()
        }, 5000);
        this.timer2 = setInterval(() => {
            this.fetchHeatMap()
        }, 5000);


        fetch(HOST + '/api/initData').then((res) => {
            return res.json()
        }).then(({gridSize, grid}) => {
            this.setState({ gridSize, grid });
        }).catch((err) => {
            console.error(err);
        });
       
        
        
    }

    render() {
        const { gridSize, grid } = this.state;
        const el1 = document.getElementById('grid');
        el1.style.display = 'grid';
        el1.style.gridTemplateColumns = templateConcat(gridSize, '40px');
        el1.style.gridTemplateRows = templateConcat(gridSize, '40px');
        const result = [];

        grid.forEach((row) => {
            row.forEach(({deviceId, x, y, visibility, color, probability}) => {
                result.push(
                    e(
                        'div',
                        { 
                            key: `grid-${x}-${y}`,
                            className: "inside-grid",
                            style: {
                                border: "2px solid #FFFFFF",
                                justifyContent: "center", // DO NOT TOUCH
                                display: "flex", // DO NOT TOUCH
                                backgroundColor: color
                            },
                            

                        },
                        e(
                            'span',
                            {},
                            `${probability}`
                        )
                        
                        
                    )
                );

            })
        });

        return result;
    }
}


const domContainer = document.querySelector('#grid');
if (domContainer) {
    const root = ReactDOM.createRoot(domContainer);
    root.render(e(Map_));
} else {
    console.error("Element with id 'test' not found in the HTML");
}

