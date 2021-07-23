mapboxgl.accessToken = 'pk.eyJ1IjoicmJ0MSIsImEiOiJja3I0ejFsdmUxeW02Mm9tbnVxZTdmaW51In0.e4atSVv6Dn07K8LjVX0SrA';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/satellite-v9', // style URL
    center: boxCoordinates, // starting position [lng, lat]
    zoom: 13 // starting zoom
});

const marker = new mapboxgl.Marker()
.setLngLat(boxCoordinates)
.setPopup(
    new mapboxgl.Popup({offset: 25})
    .setHTML(`<h3>${camp}</h3><p>${campLocation}</p>`)
)
.addTo(map);

const nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'bottom-left');

