import React from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, ReferenceLine,
      ReferenceDot, Tooltip, CartesianGrid, Legend, Brush, ErrorBar, AreaChart, Area } from 'recharts';

function genTimeString(timestamp) {
    let ts = new Date(timestamp);
    let str = "";
    //str = ts.getFullYear() + "." + ts.getMonth() + "." + ts.getDate() + "." + ts.getHours();

    let min = "";
    if (ts.getMinutes() < 10) {
        min = "0" + ts.getMinutes();
    }
    else {
        min = min + ts.getMinutes();
    }
    str = ts.getHours() + ":" + min;

    return str;

}

export default class DataBar extends React.Component {


    createDataArray(histData) {

        var d = [];

        // Sort the array before printing
        histData.sort(function(a, b) {
            return new Date(a.timestamp) - new Date(b.timestamp);
        });

        histData.forEach((x) => {
            d.push({
                Time: genTimeString(x.timestamp),
                Temperature: x.temp.toFixed(3)/1,
                Humidity: x.humidity.toFixed(3)/1,
                ServoSpeed: x.servoSpeed.toFixed(3)/1,
            });
        })
        console.log(d);
        return d;
    }

    render() {
        let marker = null;
        let key = "Please choose a marker...", pos = "";
        if (this.props.currMarker !== null && this.props.histData !== []) {
            marker = this.props.currMarker;
            let histData = this.props.histData;
            key = "Device ID: " +  marker.key;
            pos = "(Lat, Lng) = (" + marker.position.lat.toFixed(3) + ", " + marker.position.lng.toFixed(3) + ")";

            //console.log(histData);
            let data = this.createDataArray(histData);



            return (
                <div className="activated-databar">
                    <div className="device-info">
                        <h2 id="device-name">{key}</h2>
                        <h3 id="coordinates">{pos}</h3>
                    </div>

                    <div className="device-chart">
                        <h3 id="device-info">Temperature</h3>
                        <LineChart
                            width={450}
                            height={100}
                            data={data}
                            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                        >
                            <XAxis dataKey="Time" />
                            <YAxis domain={['auto', 'auto']} />
                            <Tooltip />
                            <CartesianGrid stroke="#f5f5f5" />
                            <Line type="monotone" dataKey="Temperature" stroke="#387908" />
                        </LineChart>
                    </div>

                    <div className="device-chart">
                        <h3 id="device-info">Humidity</h3>
                        <LineChart
                            width={450}
                            height={100}
                            data={data}
                            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                        >
                            <XAxis dataKey="Time" />
                            <YAxis domain={['auto', 'auto']} />
                            <Tooltip />
                            <CartesianGrid stroke="#f5f5f5" />
                            <Line type="monotone" dataKey="Humidity" stroke="#0594F7" />
                        </LineChart>
                    </div>

                    <div className="device-chart">
                        <h3 id="device-info">Servo Speed</h3>
                        <LineChart
                            width={450}
                            height={100}
                            data={data}
                            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                        >
                            <XAxis dataKey="Time" />
                            <YAxis domain={['auto', 'auto']} />
                            <Tooltip />
                            <CartesianGrid stroke="#f5f5f5" />
                            <Line type="monotone" dataKey="ServoSpeed" stroke="#F76505" />
                        </LineChart>
                    </div>

                </div>
            );
        }
        else if (this.props.currMarker !== null && this.props.histData === []) {
            return (
                <div className="error-databar">
                    <h1>Can't retrieve data from server</h1>
                </div>
            );
        }
        return (
            <div className="default-databar">
                <h1>{key}</h1>
            </div>
        );
    }
}
