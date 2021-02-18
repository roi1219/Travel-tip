import { storageService } from './services/storage-service.js';

import { mapService } from './services/map-service.js';

var gMap;
var gInfoPopup;
var gMarkers = [];

// mapService.getLocs().then((locs) => console.log('locs', locs));

window.onload = () => {
  renderLocsTable(mapService.getLocs());

  initMap()
    .then(() => {
      addMarker({ lat: 32.0749831, lng: 34.9120554 });
    })
    .catch(() => console.log('INIT MAP ERROR'));

};

function addListeners() {
  console.log('listnersssss');
  document.querySelector('.go-button').addEventListener('click', (ev) => {
    console.log('Aha!', ev.target);
    panTo({ lat: 35.6895, lng: 139.6917 });
  });

  document.querySelector('.add').addEventListener('click', onAddLoc);
  document.querySelector('.my-location-button').addEventListener('click', panToMyLocation);
  var btns = document.querySelectorAll('.btn-go');
  console.log('btns:', btns)
  btns.forEach(el => {
    console.log('el:', el)
    el.addEventListener('click', panToSelectedLocation, this);
  })
  document.querySelectorAll('.btn-delete').forEach(el => {
    el.addEventListener('click', deleteSelectedLocation, this);
  })
}

function panToMyLocation() {
  getPosition()
    .then(pos => pos.coords)
    .then(coords => {
      return { lat: coords.latitude, lng: coords.longitude }
    })
    .then(lalatlng => {
      panTo(lalatlng);
    })
    .catch((err) => {
      console.log('err!!!', err);
    });
}

function panToSelectedLocation(el) {
  console.log('el:', el)
  const idx = el.srcElement.dataset.idx;
  var loc = mapService.getLocs()[idx];
  var coords = {
    lat: loc.lat,
    lng: loc.lng
  }
  panTo(coords);
  renderLocInfo(loc);
}

function deleteSelectedLocation(el) {
  const idx = el.srcElement.dataset.idx;
  console.log('idx:', idx)
  mapService.deleteLocation(idx);
  renderLocsTable(mapService.getLocs());
}

function onAddLoc() {
  mapService.addLocToLocs();
  renderLocsTable(mapService.getLocs());
}

function initMap(laLatLng = { lat: 32.0749831, lng: 34.9120554 }) {
  console.log('InitMap');
  return _connectGoogleApi().then(() => {
    console.log('google available');
    gMap = new google.maps.Map(document.querySelector('#map'), {
      center: laLatLng,
      zoom: 15,
    });

    // const defaultLatLng = { lat: 32.0749831, lng: 34.9120554 };
    // // Create the initial Info popup.
    // gInfoPopup = new google.maps.InfoWindow({
    //   content: 'Click the map to get Lat/Lng!',
    //   position: defaultLatLng,
    // });
    // gInfoPopup.open(gMap);

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
  gMarkers.push(marker);

  //   setTimeout(clearMarker, 3000, marker);

  return marker;
}

function clearMarker(marker) {
  marker.setMap(null);
}

function clearMarkers() {
  gMarkers.forEach((marker) => {
    marker.setMap(null);
  });
}

function panTo(laLatLng) {
  gMap.panTo(laLatLng);
  addMarker(laLatLng);

}

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
  let laLatLng = {
    lat: mapsMouseEvent.latLng.lat(),
    lng: mapsMouseEvent.latLng.lng(),
  };

  mapService.updateCurrLoc(laLatLng).then(renderLocInfo);

  // render new location on map:
  renderLocOnMap(laLatLng);

  // render gInfoPopup:
  // renderInfoPopup(laLatLng);
}

function renderLocInfo(locInfo) {
  console.log(locInfo);

  let elLocation = document.querySelector('.location-text-box span');
  elLocation.innerText = locInfo.address;

  renderWeather(locInfo.weather);
}

function renderWeather(weather) {

  let elTitle = document.querySelector('.weather-details-location');
  elTitle.innerText = weather.city;

  let elweather = document.querySelector('.weather-details-weather');
  elweather.innerText = weather.weather;

  let elTemp = document.querySelector('.weather-details-temp');
  elTemp.innerText = `${weather.temp}℃`;

  let elMinMax = document.querySelector('.weather-details-minmax');
  elMinMax.innerText = `feels like ${weather.feelsLike}`;
}

function renderLocOnMap(lalatlng) {
  clearMarkers();
  panTo(lalatlng);
}

function renderInfoPopup(laLatLng) {
  gInfoPopup.close();
  gInfoPopup = new google.maps.InfoWindow({
    position: laLatLng,
  });
  gInfoPopup.setContent(JSON.stringify(laLatLng));
  gInfoPopup.open(gMap);
}

function renderLocsTable(locs) {
  console.log('locs:', locs)
  document.querySelector('.saved-locations-list tbody').innerHTML = locs
    .map((loc, idx) => {
      return `<tr>
        <td>${idx + 1}</td>
        <td>${loc.address}</td>
        <td>${loc.createdAt}</td>
        <td>${loc.weather.temp}</td>
        <td><button class="btn-go" data-idx="${idx}">go</button></td>
        <td><button class="btn-delete" data-idx="${idx}">delete</button></td>
        </tr>`;
    })
    .join('');
    addListeners();
}

// function getLOC(lalatlng) {
//   const prm = axius('api-address')
//     .then((data) => data.data.address)
//     .then((address) => {
//       return {
//         id: 'id',
//         laLatLng: lalatlng,
//         address,
//       };
//     });

//   return prm;
// }
