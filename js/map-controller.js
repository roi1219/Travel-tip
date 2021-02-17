import { mapService } from './services/map-service.js';

var gMap;
var gInfoPopup;
console.log('Main!');

mapService.getLocs().then((locs) => console.log('locs', locs));

window.onload = () => {
  document.querySelector('.btn').addEventListener('click', (ev) => {
    console.log('Aha!', ev.target);
    panTo({ lat: 35.6895, lng: 139.6917 });
    addMarker({ lat: 35.6895, lng: 139.6917 });
  });

  initMap()
    .then(() => {
      addMarker({ lat: 32.0749831, lng: 34.9120554 });
    })
    .catch(() => console.log('INIT MAP ERROR'));

  getPosition()
    .then((pos) => {
      console.log('User position is:', pos.coords);
    })
    .catch((err) => {
      console.log('err!!!', err);
    });
};

function initMap(laLatLng = { lat: 32.0749831, lng: 34.9120554 }) {
  console.log('InitMap');
  return _connectGoogleApi().then(() => {
    console.log('google available');
    gMap = new google.maps.Map(document.querySelector('#map'), {
      center: laLatLng,
      zoom: 15,
    });

    const defaultLatLng = { lat: 32.0749831, lng: 34.9120554 };
    // Create the initial Info popup.
    gInfoPopup = new google.maps.InfoWindow({
      content: 'Click the map to get Lat/Lng!',
      position: defaultLatLng,
    });
    gInfoPopup.open(gMap);

    // Configure the click listener.
    gMap.addListener('click', onMapClick);

    console.log('Map!', gMap);
  });
}

function addMarker(laLatLng) {
  var marker = new google.maps.Marker({
    position: laLatLng,
    map: gMap,
    title: 'Hello World!',
  });
  return marker;
}

function panTo(laLatLng) {
  gMap.panTo(laLatLng);
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
  console.log('Getting Pos');
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

function _connectGoogleApi() {
  if (window.google) return Promise.resolve();
  const API_KEY = 'AIzaSyCrriVsB6ciePOk-kQcaqIn-WBUxnKjpEQ';

  var elGoogleApi = document.createElement('script');
  elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
  elGoogleApi.async = true;
  document.body.append(elGoogleApi);

  return new Promise((resolve, reject) => {
    elGoogleApi.onload = resolve;
    elGoogleApi.onerror = () => reject('Google script failed to load');
  });
}

function onMapClick(mapsMouseEvent) {
    let laLatLng = mapsMouseEvent.latLng;
    updateCurrLoc(laLatLng);
    
    // update gInfoPopup:
    renderInfoPopup(laLatLng);
}

function renderInfoPopup(laLatLng) {
    gInfoPopup.close();
    gInfoPopup = new google.maps.InfoWindow({
        position: laLatLng,
    });
    gInfoPopup.setContent(JSON.stringify(laLatLng.toJSON(), null, 2));
    gInfoPopup.open(gMap);
}

document.querySelector('.add').addEventListener('click',mapService.addLocToList)