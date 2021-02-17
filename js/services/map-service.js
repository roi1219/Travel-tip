export const mapService = {
    getLocs,
    addLocToList,
    updateCurrLoc,
    currLoc
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

function updateCurrLoc(lalatlng){
    currLoc=lalatlng;
}

function addLocToList(){
    // var address=axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=AIzaSyCrriVsB6ciePOk-kQcaqIn-WBUxnKjpEQ`)
    var address=axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${currLoc.lat},${currLoc.lng}&key=AIzaSyCayMkRnINh4Tf4OreuRwzjsIyKz9X1b_M`)
    .then(res=>{
        console.log('res:', res)
    })
    .catch(err=> console.log(err))
}
