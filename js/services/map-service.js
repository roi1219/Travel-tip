import { utilService } from './utils-service.js';

export const mapService = {
    getLocs,
    addLocToList,
    updateCurrLoc,
    currLoc,
};

var locs = [{ lat: 11.22, lng: 22.11 }];
var currLoc;

function getLocs() {
    return Promise.resolve(locs);
    //   return new Promise((resolve, reject) => {
    // setTimeout(() => {
    // }, 2000);
    //   });
}

function updateCurrLoc(lalatlng) {
    console.log('lalatlng:', lalatlng)
    currLoc = {
        lng: lalatlng.lng,
        lat: lalatlng.lat,
    };
}

function addLocToList() {
    console.log('currLoc:', currLoc)
    // var address=axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=AIzaSyCrriVsB6ciePOk-kQcaqIn-WBUxnKjpEQ`)
    var address = axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${currLoc.lat},${currLoc.lng}&key=AIzaSyCayMkRnINh4Tf4OreuRwzjsIyKz9X1b_M`)
        .then(res => res.data.results[0].formatted_address)
        .catch((err) => console.log(err));
    var id=utilService.makeId();
}
