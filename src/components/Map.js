import React, {Component} from 'react';
import GoogleMapReact from 'google-map-react';
import Marker from './Marker';
import moment from 'moment';

class Map extends Component {
  static defaultProps = {
    center: {
      lat: 44.4268,
      lng: 26.1025
    },
    zoom: 5
  };

  constructor(props) {
    super(props);

    this.state = {
      lat: 44.4268,
      lng: 26.1025,
      dayOrNight: 'day',
      dataFetched: false
    };
  }

  handleApiLoaded(map, maps) {
    // load initial marker
    fetch(
      `http://api.geonames.org/timezoneJSON?lat=${this.state.lat}&lng=${this.state.lng}&username=dezi`
    )
      .then(res => res.json())
      .then(res => {
        let dayOrNight, localTime, sunriseTime, sunsetTime;

        // if current, sunrise or sunset times are not in the response, don't update marker
        if (res.time && res.sunrise && res.sunset) {
          localTime = moment(res.time, 'yyyy-mm-dd HH:mm');
          sunriseTime = moment(res.sunrise, 'yyyy-mm-dd HH:mm');
          sunsetTime = moment(res.sunset, 'yyyy-mm-dd HH:mm');
        } else {
          this.setState({
            lat: this.state.lat,
            lng: this.state.lng,
            dayOrNight: 'n/a',
            dataFetched: true
          });

          throw new Error('Data not available for this region');
        }

        // check if day or night
        if (
          localTime.isSameOrAfter(sunriseTime) &&
          localTime.isBefore(sunsetTime)
        ) {
          dayOrNight = 'day';
        } else {
          dayOrNight = 'night';
        }

        this.setState({
          dayOrNight,
          dataFetched: true
        });
      })
      .catch(err => console.error(err));

    // get user location
    navigator.geolocation.getCurrentPosition(position => {
      // center map
      map.panTo({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });

      this.setState({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    });

    // move marker when clicking on map
    map.addListener('click', e => {
      fetch(
        `http://api.geonames.org/timezoneJSON?lat=${e.latLng.lat()}&lng=${e.latLng.lng()}&username=dezi`
      )
        .then(res => res.json())
        .then(res => {
          let dayOrNight, localTime, sunriseTime, sunsetTime;

          // center map
          map.panTo(e.latLng);

          // if current, sunrise or sunset times are not in the response, don't update marker
          if (res.time && res.sunrise && res.sunset) {
            localTime = moment(res.time, 'yyyy-mm-dd HH:mm');
            sunriseTime = moment(res.sunrise, 'yyyy-mm-dd HH:mm');
            sunsetTime = moment(res.sunset, 'yyyy-mm-dd HH:mm');
          } else {
            this.setState({
              lat: e.latLng.lat(),
              lng: e.latLng.lng(),
              dayOrNight: 'n/a',
              dataFetched: true
            });

            throw new Error('Data not available for this region');
          }

          // check if day or night
          if (
            localTime.isSameOrAfter(sunriseTime) &&
            localTime.isBefore(sunsetTime)
          ) {
            dayOrNight = 'day';
          } else {
            dayOrNight = 'night';
          }

          this.setState({
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
            dayOrNight,
            dataFetched: true
          });
        })
        .catch(err => console.error(err));
    });
  }

  render() {
    return (
      <div className="map">
        <GoogleMapReact
          bootstrapURLKeys={{key: 'AIzaSyADcqeCjG5IqIPXc3ves0OaY3saz53-69U'}}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({map, maps}) => this.handleApiLoaded(map, maps)}
        >
          {this.state.dataFetched && (
            <Marker
              lat={this.state.lat}
              lng={this.state.lng}
              dayOrNight={this.state.dayOrNight}
            />
          )}
        </GoogleMapReact>
      </div>
    );
  }
}

export default Map;
