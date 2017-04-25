import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";

import DataBar from './DataBar.js'

const SimpleMapExampleGoogleMap = withGoogleMap(props => (
    <GoogleMap

        defaultZoom={8}
        defaultCenter={{ lat: 23.397, lng: 120.644 }}
    >
        {props.markers.map((marker, index) => (
            <Marker
                key={index}
                position={marker.position}
                onClick={() => props.onMarkerClick(marker)}
            />
        ))}
    </GoogleMap>
));

/*
 * Add <script src="https://maps.googleapis.com/maps/api/js"></script> to your HTML to provide google.maps reference
 */
export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            markers: [{
                  position: {
                    lat: 25.0112183,
                    lng: 121.52067570000001,
                  },
                  key: "Tessel 2",
                  defaultAnimation: 2,
            }],
            currMarker: null
        };
    }

    handleMarkerClick(targetMarker) {
        console.log(targetMarker);
        this.setState({
            currMarker: targetMarker
        });
    }

    render() {
        return (
                <div>
                    <SimpleMapExampleGoogleMap
                        containerElement={
                        <div style={{ height: '78vh' }} />
                        }
                        mapElement={
                        <div style={{ height: '100%' }} />
                        }
                        markers={this.state.markers}
                        onMarkerClick={this.handleMarkerClick.bind(this)}
                    />
                    <div style={{ height: '15vh' }}>
                        <DataBar
                            currMarker={this.state.currMarker}
                        />
                    </div>
                </div>
               );
    }
}

