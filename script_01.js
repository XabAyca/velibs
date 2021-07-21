const url = 'https://opendata.paris.fr/api/records/1.0/search/?dataset=velib-disponibilite-en-temps-reel&q=&rows=100&facet=name&facet=is_installed&facet=is_renting&facet=is_returning&facet=nom_arrondissement_communes';
const body = document.getElementById('stations')

//////////////// MAP ///////////////////
///////////////////////////////////////

// Map initialize
let mymap = L.map('mapid').setView([48.855, 2.35],12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

// Add marker & popup to the map
marker = (station) => {
  let marker = L.marker([station.coordonnees_geo[0],station.coordonnees_geo[1]]).addTo(mymap);
  marker.bindPopup(`${station.name} : ${station.ebike} ebike - ${station.mechanical} bike`)
}

// Make user position on the map
navigator.geolocation.getCurrentPosition( (position)=> {
  const circle = L.circle([position.coords.latitude,position.coords.longitude], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 100
  }).addTo(mymap);
  circle.bindPopup('Your position').openPopup();
});

//////////////// Velibs API ///////////////////
//////////////////////////////////////////////

// view by station
const showVelibStation = (selector, name, numberClassicalVelibs, numberElectricVelibs) => {
  selector.innerHTML += `
      <div class='block-station'>
          <h2 class='station-title'>Station : ${name}</h2>
          <p>${numberClassicalVelibs} classical Velibs</p>
          <p>${numberElectricVelibs} electric Velibs</p>
      </div>
  `
}

// for 10 stations use API
const stationsInfo = (response) =>{
  body.innerHTML = ""
  for (let i=0; i<100; i++){
    let station = response.records[i].fields;
    marker(station,i);
    showVelibStation(body,station.name,station.ebike,station.mechanical)
  }
}

// Fetch the API
setInterval( () =>{
  fetch(url)
    .then((response) => response.json() )
    .then((response) => stationsInfo(response))
    .catch((error) => console.error(`ERROR: ${error}`))
}, 10000)