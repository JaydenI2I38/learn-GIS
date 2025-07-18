<script setup lang="ts">
import L from "leaflet";
import { onMounted } from "vue";
import mapJson from "@/assets/map_without.json";
// import "@mladen/leaflet.tilelayer.wmts";
import "@/components/wmts";
import "leaflet/dist/leaflet.css";

// http://localhost:8080/geoserver/tutorial-boundarylines/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&STYLES&LAYERS=tutorial-boundarylines%3Ane_110m_admin_0_boundary_lines_land&EXCEPTIONS=application%2Fvnd.ogc.se_inimage&SRS=EPSG%3A4326&WIDTH=769&HEIGHT=385&BBOX=-66.8671875%2C-12.70458984375%2C-49.9833984375%2C-4.25830078125

let map: L.Map;

function initMap() {
	map = L.map("map").setView([36.90872, 102.39749], 5);

	L.geoJSON(mapJson, {
		style: () => {
			return {
				color: `rgb(181, 181, 181)`,
				weight: 1,
				opacity: 1,
				fillColor: "rgb(181, 181, 181)",
			};
		},
	}).addTo(map);

	// addBoundaryLinesLayer();
	// addCoastlinesLayer();
	addBeijingLayer();
}

// /**
//  * 边界线
//  * 数据来源：https://www.naturalearthdata.com/downloads/110m-cultural-vectors/
//  * 数据格式：Shapefile
//  */
// function addBoundaryLinesLayer() {
// 	const wmsLayer = L.tileLayer.wms("http://localhost:8080/geoserver/tutorial-boundarylines/wms", {
// 		layers: "tutorial-boundarylines:ne_110m_admin_0_boundary_lines_land",
// 		format: "image/png",
// 		transparent: true,
// 		attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
// 	});
// 	wmsLayer.addTo(map);
// }

// /**
//  * 海岸线
//  * 数据来源：geoserver预设数据
//  */
// function addCoastlinesLayer() {
// 	const wmsLayer = L.tileLayer.wms("http://localhost:8080/geoserver/ne/wms", {
// 		layers: "ne:coastlines",
// 		format: "image/png",
// 		transparent: true,
// 		attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
// 	});
// 	wmsLayer.addTo(map);
// }

// http:// localhost:8080/geoserver/gwc/service/wmts?layer=tutorial%3Agfs.tz.pgrb2.0p25.20240714000000.t2m&style=&tilematrixset=WebMercatorQuad&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=0&TileCol=0&TileRow=0
function addBeijingLayer() {
	const wmtsUrl = "/geoserver/gwc/service/wmts";

	const wmtsLayer = L.tileLayer.wmts(wmtsUrl, {
		layer: "tutorial:gfs.tz.pgrb2.0p25.20240714000000.t2m", // 注意：如果服务中图层名带前缀（如 tutorial:xxx），需补全
		style: "",
		tilematrixset: "WebMercatorQuad",
		format: "image/png",
		version: "1.0.0",
		crs: L.CRS.EPSG3857,
		tileSize: 256,
	});

	wmtsLayer.addTo(map);
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
