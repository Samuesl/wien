/* Vienna Sightseeing Beispiel */

// Stephansdom Objekt
let stephansdom = {
    lat: 48.208493,
    lng: 16.373118,
    zoom: 12,
    title: "Domkirche St. Stephan",
};

// Karte initialisieren
let map = L.map("map").setView([stephansdom.lat, stephansdom.lng], stephansdom.zoom);


/* Marker mit Popup beim Stephansdom
let marker = L.marker([stephansdom.lat, stephansdom.lng]).addTo(map);
marker.bindPopup(stephansdom.title).openPopup();
*/

//Overlays definieren
let overlays = {
    sights: L.featureGroup().addTo(map),
    lines: L.featureGroup().addTo(map),
    stops: L.featureGroup().addTo(map),
    zones: L.featureGroup().addTo(map),
}

//Layercontrol
L.control.layers({
    "basemap.at ": L.tileLayer.provider('BasemapAT.basemap'),
    "basemap.at grau": L.tileLayer.provider('BasemapAT.grau').addTo(map),
    "basemap.at.overlay": L.tileLayer.provider('BasemapAT.overlay'),
    "basemap.at terrain": L.tileLayer.provider('BasemapAT.terrain'),
    "basemap.at surface": L.tileLayer.provider('BasemapAT.surface'),
    "basemap.at highdpi": L.tileLayer.provider('BasemapAT.highdpi'),
    "basemap.at ortho": L.tileLayer.provider('BasemapAT.orthofoto'),

}, {
    "Sehenswürdigkeiten": overlays.sights,
    "Vienna Sightseeing Linien": overlays.lines,
    "Vienna Sightseeing Haltestellen": overlays.stops,
    "Fußgäbgerzonen": overlays.zones,
}).addTo(map);


//Massstab
L.control.scale({
    imperial: false,
}).addTo(map);

//Sehenswürdigkeiten Standorte Wien
async function loadSights(url) {
    //console.log(url);
    let response = await fetch(url);
    let jsondata = await response.json();
    // console.log(jsondata);
    L.geoJSON(jsondata, {
        attribution: "Datenquelle: <a href='https://data.wien.gv.at'> Stadt Wien</a>"
    }).addTo(overlays.sights);

}

//Sehenswürdigkeiten Linien
async function loadLines(url) {
    console.log(url);
    let response = await fetch(url);
    let jsondata = await response.json();
    console.log(jsondata);
    L.geoJSON(jsondata, {
        attribution: "Datenquelle: <a href='https://data.wien.gv.at'> Stadt Wien</a>"
    }).addTo(overlays.lines);

}

//Sehenswürdigkeiten Linien Stops
async function loadStops(url) {
    console.log(url);
    let response = await fetch(url);
    let jsondata = await response.json();
    console.log(jsondata);
    L.geoJSON(jsondata, {
        attribution: "Datenquelle: <a href='https://data.wien.gv.at'> Stadt Wien</a>"
    }).addTo(overlays.stops);

}

//Sehenswürdigkeiten Fußgängerzonen
async function loadZones(url) {
    console.log(url);
    let response = await fetch(url);
    let jsondata = await response.json();
    console.log(jsondata);
    L.geoJSON(jsondata, {
        attribution: "Datenquelle: <a href='https://data.wien.gv.at'> Stadt Wien</a>"
    }).addTo(overlays.zones);

}

//GeoJson laden und visualisieren
loadLines("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKLINIEVSLOGD&srsName=EPSG:4326&outputFormat=json");
loadStops("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKHTSVSLOGD&srsName=EPSG:4326&outputFormat=json");
loadSights("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SEHENSWUERDIGOGD&srsName=EPSG:4326&outputFormat=json");
loadZones("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:FUSSGEHERZONEOGD&srsName=EPSG:4326&outputFormat=json");