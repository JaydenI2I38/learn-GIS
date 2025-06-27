<script setup lang="ts">
import TileLayer from "ol/layer/Tile";
import Map from "ol/Map";
import TileWMS from "ol/source/TileWMS";
import XYZ from "ol/source/XYZ";
import View from "ol/View";

import { onMounted } from "vue";
import "ol/ol.css";

let map: Map;

function initMap() {
	map = new Map({
		target: "map",
		layers: [
			new TileLayer({
				source: new XYZ({
					url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
				}),
			}),
		],
		view: new View({
			center: [0, 0],
			zoom: 2,
		}),
	});

	addBoundaryLinesLayer();
	addCoastlinesLayer();
}

/**
 * 边界线
 * 数据来源：https://www.naturalearthdata.com/downloads/110m-cultural-vectors/
 * 数据格式：Shapefile
 */
function addBoundaryLinesLayer() {
	// ol 的 wms 图层
	const wmsLayer = new TileLayer({
		source: new TileWMS({
			url: "http://localhost:8080/geoserver/tutorial-boundarylines/wms",
			params: {
				layers: "tutorial-boundarylines:ne_110m_admin_0_boundary_lines_land",
				format: "image/png",
				transparent: true,
			},
		}),
	});

	map.addLayer(wmsLayer);
}

/**
 * 海岸线
 * 数据来源：geoserver预设数据
 */
function addCoastlinesLayer() {
	const wmsLayer = new TileLayer({
		source: new TileWMS({
			url: "http://localhost:8080/geoserver/ne/wms",
			params: {
				layers: "ne:coastlines",
				format: "image/png",
				transparent: true,
			},
		}),
	});
	map.addLayer(wmsLayer);
}

onMounted(() => {
	initMap();
});
</script>

<template>
	<div class="map-container">
		<div id="map" />
	</div>
</template>

<style lang="scss" scoped>
.map-container {
    width: 100%;
    height: 100%;
    #map {
        width: 100%;
        height: 100%;
    }
}
</style>
