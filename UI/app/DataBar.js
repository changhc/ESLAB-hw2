import React from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, ReferenceLine,
      ReferenceDot, Tooltip, CartesianGrid, Legend, Brush, ErrorBar, AreaChart, Area } from 'recharts';

function genTimeString(timestamp) {
    let ts = new Date(timestamp);
    let str = "";

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
        return d;
    }

    handleButtonClick(bTurnedOn) {
        const targetMarker = this.props.currMarker;
        let headers = new Headers({
            'Content-Type':'application/json'
        });
        let init;
        if (bTurnedOn) {
            init = { method: 'PUT',
                headers: headers,
                mode: 'cors',
                cache: 'default',
                body: JSON.stringify({
                    deviceId: targetMarker.key,
                    type: 'servo',
                    value: 'off'
                })
            };
        }
        else {
            init = { method: 'PUT',
                headers: headers,
                mode: 'cors',
                cache: 'default',
                body: JSON.stringify({
                    deviceId: targetMarker.key,
                    type: 'servo',
                    value: 'on'
                })
            };
        }

        let req = new Request('http://localhost:3000/api/getDeviceData', init);

        fetch(req)
    }

    render() {
        let marker = null;
        let key = "Please choose a marker...", pos = "";
        if (this.props.currMarker !== null && this.props.histData !== []) {
            marker = this.props.currMarker;
            let histData = this.props.histData;
            key = "Device ID: " +  marker.key;
            pos = "(Lat, Lng) = (" + marker.position.lat.toFixed(3) + ", " + marker.position.lng.toFixed(3) + ")";

            // console.log(histData);
            let data = this.createDataArray(histData);

            let bTurnedOn = false;

            if (data[data.length-1].ServoSpeed > 0.0) {
                bTurnedOn = true;
            }



            return (
                <div className="activated-databar">
                    <div className="device-info">
                        <h2 id="device-name">{key}</h2>
                        <h3 id="coordinates">{pos}</h3>
                        <button onClick={this.handleButtonClick.bind(this, bTurnedOn)}>{bTurnedOn ? "Off" : "On"}</button>
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
