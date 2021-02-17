import { utilService } from './utils-service.js';
import { storageService } from './storage-service.js';

export const mapService = {
    getLocs,
    addLocToLocs,
    updateCurrLoc,
};

var locs = storageService.loadFromStorage('saved locations') || [];
var currLoc;

function getLocs() {
    return locs;
}

function updateCurrLoc(lalatlng) {
    const id = utilService.makeId();
    const prmAddress = axios
        .get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lalatlng.lat},${lalatlng.lng}&key=AIzaSyCayMkRnINh4Tf4OreuRwzjsIyKz9X1b_M`
        )
        .then((res) => {
            return res.data.results[0].formatted_address;
        })
        .catch((err) => console.log(err));
    const prmWeather = axios
        .get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lalatlng.lat}&lon=${lalatlng.lng}&units=metric&appid=21da4badb28db13dc72072bc45fb78d8`
        )
        .then((res) => {
            return {
                temp: res.data.main.temp,
                feelsLike: res.data.main.feels_like,
                humidity: res.data.main.humidity,
                weather: res.data.weather[0].main,
                city: res.data.name,
            };
        })
        .catch((err) => console.log(err));
    return Promise.all([prmAddress, prmWeather]).then((res) => {
        currLoc = {
            lng: lalatlng.lng,
            lat: lalatlng.lat,
            id,
            address: res[0],
            weather: res[1],
        };
        return currLoc;
    });
}

function addLocToLocs() {
    currLoc['createdAt'] = Date.now();
    locs.push(currLoc);
    storageService.saveToStorage('saved locations', locs);
}

function renderLocationTable(locs){
    document.querySelector('.saved-locations-list tbody').innerHTML=locs.map((loc,idx)=>{
        return `<tr>
        <td>${idx+1}</td>
        <td>${loc.address}</td>
        <td>${loc.createdAt}</td>
        <td>${loc.weather.temp}</td>
        </tr>`
    }).join('');
  }