/* Vienna Sightseeing Beispiel */
/*bus_1.png RED
bus_2.png Yellow
bus_3.png Blue
bus_4.png Green
bus_5.png Grey
bus_6.png Orange
*/

// Stephansdom Objekt
let stephansdom = {
    lat: 48.208493,
    lng: 16.373118,
    zoom: 12,
    title: "Domkirche St. Stephan",
};

// Karte initialisieren
let map = L.map("map", {
    maxZoom: 19
}).setView([stephansdom.lat, stephansdom.lng], stephansdom.zoom);


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
    hotels: L.markerClusterGroup({
        disableClusteringAtZoom: 15
    }).addTo(map),
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
    "Hotels": overlays.hotels,
}).addTo(map);


//Massstab
L.control.scale({
    imperial: false,
}).addTo(map);

//Sehenswürdigkeiten
async function loadSights(url) {
    //console.log(url);
    let response = await fetch(url);
    let jsondata = await response.json();
    // console.log(jsondata);
    L.geoJSON(jsondata, {
        attribution: "Datenquelle: <a href='https://data.wien.gv.at'> Stadt Wien</a>",
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: "icons/photo.png",
                    iconAnchor: [16, 37],
                    popupAnchor: [0, -37]
                })
            });
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup("Hallo");
            //console.log(feature.properties);
            layer.bindPopup(`
                <img src="${feature.properties.THUMBNAIL}" alt="*">
                <h4>${feature.properties.NAME}</h4>
                <adress>${feature.properties.ADRESSE}</adress>
                <a href="${feature.properties.WEITERE_INF}" target="wien">Website</a>
             `);
        }
    }).addTo(overlays.sights);
}

//Linien
async function loadLines(url) {
    console.log(url);
    let response = await fetch(url);
    let jsondata = await response.json();
    console.log(jsondata);
    L.geoJSON(jsondata, {
        attribution: "Datenquelle: <a href='https://data.wien.gv.at'> Stadt Wien</a>",
        style: function (feature) {
            console.log(feature.properties);
            let lineColor;

            if (feature.properties.LINE_NAME == "Yellow Line") {
                lineColor = "#FFDC00";
            } else if (feature.properties.LINE_NAME == "Blue Line") {
                lineColor = "#0074D9";
            } else if (feature.properties.LINE_NAME == "Red Line") {
                lineColor = "#FF4136";
            } else if (feature.properties.LINE_NAME == "Green Line") {
                lineColor = "#2ECC40";
            } else if (feature.properties.LINE_NAME == "Grey Line") {
                lineColor = "#AAAAAA";
            } else if (feature.properties.LINE_NAME == "Orange Line") {
                lineColor = "#FF851B";
            }
            else {
                lineColor = "#111111";
            }
            return {
                color: lineColor
            }

        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup("Hallo");
            console.log(feature.properties);
            layer.bindPopup(`
                    <h4><i class="fa-solid fa-bus"> </i>${feature.properties.LINE_NAME}</h4>
                <div><i class="fa-regular fa-circle-stop"></i> ${feature.properties.FROM_NAME} </div>
                <div><i class="fa-solid fa-down-long"></i></div>
                <div><i class="fa-regular fa-circle-stop"></i> ${feature.properties.TO_NAME}</div>
                 `);
        }
    }).addTo(overlays.lines);

}

//Linien Stops
async function loadStops(url) {
    console.log(url);
    let response = await fetch(url);
    let jsondata = await response.json();
    console.log(jsondata);
    L.geoJSON(jsondata, {
        attribution: "Datenquelle: <a href='https://data.wien.gv.at'> Stadt Wien</a>",
        pointToLayer: function (feature, latlng) {
            console.log(feature.properties);
            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: `icons/bus_${feature.properties.LINE_ID}.png`,
                    iconAnchor: [16, 37],
                    popupAnchor: [0, -37]
                })
            });
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup("Hallo");
            console.log(feature.properties);
            layer.bindPopup(`
                <h4><i class="fa-solid fa-bus"> </i>${feature.properties.LINE_NAME}</h4>
            <adress>${feature.properties.LINE_ID} ${feature.properties.STAT_NAME}</adress>
            
             `);
        }
    }).addTo(overlays.stops);

}

//Fußgängerzonen
async function loadZones(url) {
    console.log(url);
    let response = await fetch(url);
    let jsondata = await response.json();
    //console.log(jsondata);
    L.geoJSON(jsondata, {
        attribution: "Datenquelle: <a href='https://data.wien.gv.at'> Stadt Wien</a>",
        style: function (feature) {
            console.log(feature);
            return {
                color: "#F012BE",
                weight: 1,
                opacity: 0.4,
                fillOpacity: 0.1,
            }
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup("Hallo");
            console.log(feature.properties);
            layer.bindPopup(`
                    <h4>Fußgängerzone </i>${feature.properties.ADRESSE}</h4>
                <div><i class="fa-regular fa-clock"></i> ${feature.properties.ZEITRAUM} </div>
                <div><i class="fa-solid fa-circle-info"></i> ${feature.properties.AUSN_TEXT}</div>
                 `);
        }
    }).addTo(overlays.zones);
}

//Hotels
async function loadHotels(url) {
    console.log(url);
    let response = await fetch(url);
    let jsondata = await response.json();
    console.log(jsondata);
    L.geoJSON(jsondata, {
        attribution: "Datenquelle: <a href='https://data.wien.gv.at'> Stadt Wien</a>",
        pointToLayer: function (feature, latlng) {
            console.log(feature.properties)
            let iconName;

            if (feature.properties.KATEGORIE_TXT == "1*") {
                iconName = "hotel_1stars.png";
            } else if (feature.properties.KATEGORIE_TXT == "2*") {
                iconName = "hotel_2stars.png";
            } else if (feature.properties.KATEGORIE_TXT == "3*") {
                iconName = "hotel_3stars.png";
            } else if (feature.properties.KATEGORIE_TXT == "4*") {
                iconName = "hotel_4stars.png";
            } else if (feature.properties.KATEGORIE_TXT == "5*") {
                iconName = "hotel_5stars.png";
            } else {
                iconName = "hotel_0stars.png";
            }
            //console.log(iconName);

            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: `icons/${iconName}`,
                    iconAnchor: [16, 37],
                    popupAnchor: [0, -37]
                })
            })
        }
    }).addTo(overlays.hotels);

}

//GeoJson laden und visualisieren
loadLines("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKLINIEVSLOGD&srsName=EPSG:4326&outputFormat=json");
loadStops("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKHTSVSLOGD&srsName=EPSG:4326&outputFormat=json");
loadSights("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SEHENSWUERDIGOGD&srsName=EPSG:4326&outputFormat=json");
loadZones("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:FUSSGEHERZONEOGD&srsName=EPSG:4326&outputFormat=json");
loadHotels("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:UNTERKUNFTOGD&srsName=EPSG:4326&outputFormat=json");