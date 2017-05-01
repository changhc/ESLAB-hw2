import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";

import DataBar from './DataBar.js';


const SimpleMapExampleGoogleMap = withGoogleMap(props => (
    <GoogleMap

        defaultZoom={12}
        defaultCenter={{ lat: 25.044, lng: 121.526 }}
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

const arrayToMarkers = (arr) => {
    let markers = [];
    arr.forEach((e) => {
        markers.push({
            position: {
                lat: e.coordN,
                lng: e.coordE,
            },
            defaultAnimation: 2,
            temp: e.temp,
            humidity: e.humidity,
            servoSpeed: e.servoSpeed,
            key: e.deviceId
        })
    });
    //console.log(markers);
    return markers;
}

/*
 * Add <script src="https://maps.googleapis.com/maps/api/js"></script> to your HTML to provide google.maps reference
 */
export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            markers: [
            /*
            {
                  position: {
                    lat: 25.0112183,
                    lng: 121.52067570000001,
                  },
                  defaultAnimation: 2,
                  temp: 23,
                  humidity: 32,
                  servoSpeed: 1,
                  key: 2,
            }
            */
            ],
            currMarker: null,
            timestamp: null,
            histData: []
        };
    }

    componentDidMount() {
        let getDeviceHeaders = new Headers({
            'Access-Control-Allow-Origin':'localhost:8000',
            'Access-Control-Allow-Methods':'GET, OPTIONS',
            'Content-Type':'application/json'
        });
        let getDeviceInit = { method: 'GET',
                              headers: getDeviceHeaders,
                              mode: 'cors',
                              cache: 'default' };
        let getDeviceRequest = new Request('http://localhost:3000/api/getRealTime', getDeviceInit);
        fetch(getDeviceRequest)
            .then(res => res.json())
            .then(res => JSON.parse(res))
            .then(res => {
                //console.log(res);
                this.setState({timestamp: res.timestamp});
                return res;
            })
            .then(res => arrayToMarkers(res.data))
            .then(markers => this.setState({
                markers: markers
            }))
    }


    handleMarkerClick(targetMarker) {
        //console.log(targetMarker);

        let headers = new Headers({
            'Access-Control-Allow-Origin':'localhost:8000',
            'Access-Control-Allow-Methods':'POST, OPTIONS',
            'Content-Type':'application/json'
        });
        let init = { method: 'POST',
                              headers: headers,
                              mode: 'cors',
                              cache: 'default',
                              body: JSON.stringify({deviceId: targetMarker.key})
        };
        let req = new Request('http://localhost:3000/api/getDeviceData', init);

        var data = null;

        fetch(req)
            .then(res => res.json())
            .then(res => JSON.parse(res))
            .then((res) => {
                this.setState({
                    currMarker: targetMarker,
                    histData: res.histData
                });
            })
        /*.catch(function(err) {
                console.log("Can't connect to server!");
            })*/

    }

    render() {
        return (
                <div>
                    <SimpleMapExampleGoogleMap
                        containerElement={
                        <div className="map-container" />
                        }
                        mapElement={
                        <div className="map-element" />
                        }
                        markers={this.state.markers}
                        onMarkerClick={this.handleMarkerClick.bind(this)}
                    />
                    <div className="data-container">
                        <DataBar
                            currMarker={this.state.currMarker}
                            histData={this.state.histData}
                        />
                    </div>
                </div>
               );
    }
}

