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
    const id = utilService.makeId();
    const prmAddress = axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lalatlng.lat},${lalatlng.lng}&key=AIzaSyCayMkRnINh4Tf4OreuRwzjsIyKz9X1b_M`)
        .then(res => {
            return res.data.results[0].formatted_address;
        })
        .catch((err) => console.log(err));
    const prmWeather = axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lalatlng.lat}&lon=${lalatlng.lng}&units=metric&appid=21da4badb28db13dc72072bc45fb78d8`)
        .then(res => {
            return {
                temp: res.data.main.temp,
                feelsLike: res.data.main.feels_like,
                humidity: res.data.main.humidity,
                weather: res.data.weather[0].main
            };
        })
        .catch((err) => console.log(err));
    return Promise.all([prmAddress, prmWeather])
        .then(res => {
            return {
                lng: lalatlng.lng,
                lat: lalatlng.lat,
                id,
                address: res[0],
                weather: res[1]
            }
        })
}

function addLocToList() {
    console.log('currLoc:', currLoc)
    // var address=axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=AIzaSyCrriVsB6ciePOk-kQcaqIn-WBUxnKjpEQ`)
}

