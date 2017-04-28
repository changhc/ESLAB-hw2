import React from 'react'

export default class DataBar extends React.Component {
    render() {
        let marker = null;
        let key = "Please choose a marker...", pos = "";
        if (this.props.currMarker !== null && this.props.histData !== []) {
            marker = this.props.currMarker;
            let histData = this.props.histData;
            key = marker.key;
            pos = "x: " + marker.position.lat.toFixed(3) + " y: " + marker.position.lng.toFixed(3);
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
