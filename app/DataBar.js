import React from 'react'

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
                x_value: genTimeString(x.timestamp),
                y_value: x.temp,
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


            let config = {
                theme: 'blue',
                width: 50,
                height: 10,
                box_size: 20,
                box_radius: 8,
                line: false,
                line_only: false,
                bordered: false,
                blink: false
            };


            return (
                <div>
                    <h1>{key}</h1>
                    <p>{pos}</p>
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
