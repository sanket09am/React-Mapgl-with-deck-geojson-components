import React, {useState, useEffect, CSSProperties} from "react"
import ReacTMapGL, {FullscreenControl, NavigationControl, ViewportProps, InteractiveMapProps, ScaleControl} from "react-map-gl"
import WebMercatorViewport, {Bounds} from "viewport-mercator-project"
import {FeatureCollection} from "geojson"
import bbox from "@turf/bbox"

import {DeckGLComponent} from "./deck-gl-component/deck-gl-component"


export interface MapProps {
    mapboxApiAccessToken: string
    mapStyle: string
    geojson?: FeatureCollection
    latitude?: number
    longitude?: number
    width?: number
    height?: number
}


const control: CSSProperties = {
	position: "absolute",
	right: 0,
	margin:10,
	zIndex: 9
}


const full_screen_control: CSSProperties = {
	...control,
	top: 0
}


const navigation__control: CSSProperties = {
	...control,
	top: 36
}


const scale_control: CSSProperties = {
	...control,
	bottom: 16
}


const recenter_control: CSSProperties = {
	...control,
	top: 140
}


const useWindowEvent = (event: string, callback: () => void) => {
	useEffect(() => {
		window.addEventListener(event, callback)
		return () => window.removeEventListener(event, callback)
	}, [event, callback])
}


export const MapComponent: React.FC<MapProps> = (props) => {
    const {mapboxApiAccessToken, geojson, mapStyle, width, height, latitude, longitude, children} = props

	let initial_viewport = {
		width:  width! || window.innerWidth,
		height: height! || window.innerHeight,
		latitude: latitude ||  37.3541,
		longitude: longitude || -121.9552,
		zoom: 7,
		pitch: 0,
		bearing: 0
	}
    
	const [viewport, updateViewport] = useState(initial_viewport)

	useEffect(() => {
		if (geojson) {
            const [minLng, minLat, maxLng, maxLat] = bbox(geojson)
            let bounds: Bounds = [[minLng, minLat], [maxLng, maxLat]] 
			let view = new WebMercatorViewport({height: viewport.height, width: viewport.width})
				.fitBounds(bounds, {
					padding: 20,
				})
			updateViewport(view)
		}
	}, [geojson, viewport.height, viewport.width])


	const resize = () => {
		let view = {
			...viewport,
			width: width || window.innerWidth,
			height: height || window.innerHeight,
		}
		updateViewport(view)
	}


	useWindowEvent("resize", resize)


	const onViewportChange = (viewState: ViewportProps) => {
		updateViewport(viewState)
	}


	const reCenter = () => {
		let width =  viewport.width
		let height = viewport.height
		if (geojson) {
            const [minLng, minLat, maxLng, maxLat] = bbox(geojson)
            let bounds: Bounds = [[minLng, minLat], [maxLng, maxLat]] 
			let viewport = new WebMercatorViewport({height, width})
				.fitBounds(bounds, {
					padding: 20,
				})
			updateViewport(viewport)
		}
	}


	const renderControls = () => {
		return (
			<>  
				<div style={full_screen_control}><FullscreenControl/></div>
				<div style={navigation__control}><NavigationControl /></div>
                <div style={scale_control}><ScaleControl /></div>
				{geojson ? <div style={recenter_control}>
					<button onClick={reCenter}>Recenter</button>
				</div>: null}
			</>         
		)
	}

	let map_gl_props: InteractiveMapProps = {
		...viewport,
		dragPan: true,
		dragRotate: true,
		reuseMaps: true,
		mapboxApiAccessToken,
		mapStyle,
        onViewportChange: onViewportChange
	}

	return (
        <ReacTMapGL {...map_gl_props}>   
            {renderControls()}
            {children}
			<DeckGLComponent geojson={geojson} viewport={viewport} />
		</ReacTMapGL>
	)
}