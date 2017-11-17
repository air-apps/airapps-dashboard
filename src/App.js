import qs from 'query-string';
import React, {Component} from 'react';
import './App.css';

import {
	withScriptjs,
	withGoogleMap,
	GoogleMap,
	Marker,
  Circle,
  InfoWindow
} from 'react-google-maps';

const MapComponent = withScriptjs(
	withGoogleMap(props => (
		<div>
			<GoogleMap
				defaultZoom={15}
				defaultCenter={{lat: 37.485204, lng: -122.147843}}>
				{props.isMarkerShown && (
					<Marker position={{lat: 37.485204, lng: -122.147843}} />
				)}
        {
          props.markers.map(({lat, lng, icon}, index) => (
            <Marker position={{lat, lng}} key={index} icon={icon} onClick={props.onToggleOpen}>
              {props.isOpen && <InfoWindow onCloseClick={props.onToggleOpen}>
                x
              </InfoWindow>}
            </Marker>
          ))
        }
        {/*
				<Circle
					defaultCenter={{lat: 37.485204, lng: -122.147843}}
					defaultRadius={1000}
					defaultVisible={true}
					options={{
						center: {lat: 37.485204, lng: -122.147843},
						fillColor: '#576DE0',
            fillOpacity: 0.3
					}}
          */}
				/>
			</GoogleMap>
		</div>
	))
);

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			apps: []
		};
	}

	async componentWillMount() {
		const latitude = 37.485204;
		const longitude = -122.147843;
		const radius = 1; // km
		const api = 'https://airapps-api.now.sh/apps/nearby';

		const response = await fetch(`${api}?${qs.stringify({longitude, latitude, radius})}`);

		let json = await response.json();

    this.setState({json});
	}

  getMarkers() {
    if (this.state.json) {
      return this.state.json.data.map(app => {
        return {
          lat: app.coordinates.latitude, 
          lng: app.coordinates.longitude,
          label: app.name
        }
      });
    }

    return []
  }

	render() {
    const markers = this.getMarkers();

    const onToggleOpen = ({isOpen}) => () => ({
      isOpen: !isOpen
    });

		return (
			<div>
				<MapComponent
					isMarkerShown
					googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
					loadingElement={<div style={{height: `100%`}} />}
					containerElement={<div style={{height: `1000px`}} />}
					mapElement={<div style={{height: `100%`}} />}
          markers={markers}
          onToggleOpen={onToggleOpen}
          isOpen={false}
				/>
			</div>
		);
	}
}

export default App;
