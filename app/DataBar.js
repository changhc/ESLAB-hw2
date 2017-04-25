import React from 'react'

export default class DataBar extends React.Component {
    render() {
        let marker = null;
        let key, pos = "None";
        if (this.props.currMarker !== null) {
            marker = this.props.currMarker;
            key = marker.key;
            pos = "x: " + marker.position.lat.toFixed(3) + " y: " + marker.position.lng.toFixed(3);
        }
        return (
            <div>
                <h1>{key}</h1>
                <p>{pos}</p>
            </div>
        );
    }
}
