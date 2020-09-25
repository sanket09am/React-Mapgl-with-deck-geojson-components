import React, {useState} from "react"
import DeckGL from "@deck.gl/react"
import {GeoJsonLayer} from "@deck.gl/layers"
import {FeatureCollection} from "geojson"


interface Props {
    viewport: {
        width: number | string
        height: number | string
        latitude: number
        longitude: number
        zoom: number
        pitch: number
        bearing: number
    }
    geojson?: FeatureCollection
}


const tooltip_style: React.CSSProperties = {
	position: "absolute",                                                                                  
	padding: 4,  
	margin: 4,                                                                                    
	background: "rgba(0, 0, 0, 0.8)",                                                                    
	color: "#fff",                                                                                       
	maxWidth: 700,                                                                              
	fontSize: 15,                                                                                    
	zIndex: 9
}


export const DeckGLComponent: React.FC<Props> = (props) => {
    const {geojson, viewport} = props 
	const [coords, updateCoords] = useState({x: 0, y: 0})
	const [hovered, updateHovered] = useState()

	const renderLayers = () => {
		return [
			new GeoJsonLayer({
				id: "geojson",
				autoHighlight: true,
				data: geojson!.features,
				pickable: true,
				stroked: false,
				filled: true,
				extruded: true,
				lineWidthScale: 2,
				lineWidthMinPixels: 2,
				getFillColor: (d) => d.properties!.color || [255, 0, 0, 255] ,
				getLineColor: (d) => d.properties!.color || [0, 0, 255, 255],
				getRadius: 10,
				pointRadiusScale: 1.5,
				pointRadiusMinPixels: 2,
				getLineWidth: 5,
				onHover: onHover,
				highlightColor: [255, 3, 255, 255]
			})
		]
	}


	const onHover = ({x, y, object}: {x: number, y: number, object: any}) => {
		updateCoords({x, y})
		updateHovered(object)
	}


	const renderTooltip = () => {
		if (!hovered) {
			return null
		}
		let properties = Object.keys(hovered.properties)
		let tooltip = properties.map((property, index) => {
			return <div key={index}>{property}: {JSON.stringify(hovered.properties && hovered.properties[property])}</div>
		})
		return (
			<div style={{...tooltip_style,left: coords.x, top: coords.y}} >
				{tooltip}
			</div>
		)
	}


	if (geojson) {
		return (
            <DeckGL 
                effects={[]}
				layers={renderLayers()}
				pickingRadius={5}
				viewState={viewport}
				{...viewport} >
				    {renderTooltip}
			</DeckGL>
		)
	} else {
		return null
	}
}