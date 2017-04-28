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
            key = marker.key;
            pos = "x: " + marker.position.lat.toFixed(3) + " y: " + marker.position.lng.toFixed(3);

            //console.log(histData);
            let data = this.createDataArray(histData);



            return (
                <div>
                    <h1>{key}</h1>
                    <p>{pos}</p>

                    <LineChart
                        width={500}
                        height={100}
                        data={data}
                        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                    >
                        <XAxis dataKey="Time" />
                        <Tooltip />
                        <CartesianGrid stroke="#f5f5f5" />
                        <Line type="monotone" dataKey="Temperature" stroke="#387908" yAxisId={1} />
                    </LineChart>

                    <LineChart
                        width={500}
                        height={100}
                        data={data}
                        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                    >
                        <XAxis dataKey="Time" />
                        <Tooltip />
                        <CartesianGrid stroke="#f5f5f5" />
                        <Line type="monotone" dataKey="Humidity" stroke="#0594F7" yAxisId={1} />
                    </LineChart>

                    <LineChart
                        width={500}
                        height={100}
                        data={data}
                        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                    >
                        <XAxis dataKey="Time" />
                        <Tooltip />
                        <CartesianGrid stroke="#f5f5f5" />
                        <Line type="monotone" dataKey="ServoSpeed" stroke="#F76505" yAxisId={1} />
                    </LineChart>

                </div>
            );
        }
        else if (this.props.currMarker !== null && this.props.histData === []) {
            return (
                <div>
                    <h1>Can't retrieve data from server</h1>
                </div>
            );
        }
        return (
            <div>
                <h1>{key}</h1>
            </div>
        );
    }
}
