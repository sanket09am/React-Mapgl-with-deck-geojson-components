## React-Mapgl-with-deck-geojson-components
This provides a simple implementation of [React-Map-GL](https://github.com/uber/react-map-gl) with a GeoJson layer created by [deck.gl](https://github.com/uber/deck.gl)

All the components use React Hooks.

### Note: 
You will need to add the follwing line to your index.html
`<link href="https://api.tiles.mapbox.com/mapbox-gl-js/v1.6.0/mapbox-gl.css" rel="stylesheet"/>`

### Props:
You can pass the follwing props to MapComponent.
```javascript 
    mapboxApiAccessToken: string
    mapStyle: string
    geojson?: FeatureCollection
    latitude?: number
    longitude?: number
    width?: number
    height?: number
```

###Example:
Only mapboxApiAccessToken and mapStyle is required to create a simple map. You can pass geojson linestring as a GeoJSON FeatureCollection to view the line.

```javascript
let map_comp_props = {
    mapboxApiAccessToken: YOUR_MAPBOX_API_KEY,
    mapStyle: "mapbox://styles/mapbox/light-v10" 
}
<MapComponent {...map_comp_props}/>
```

