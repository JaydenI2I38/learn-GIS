<script setup lang="ts">
import { getTopLeft, getWidth } from "ol/extent.js";
import TileLayer from "ol/layer/Tile";
import Map from "ol/Map";

import { get as getProjection } from "ol/proj.js";
import TileWMS from "ol/source/TileWMS";
import WMTS from "ol/source/WMTS.js";
import XYZ from "ol/source/XYZ";
import WMTSTileGrid from "ol/tilegrid/WMTS.js";
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
	addWMTSLayer();
	addBJLayer();
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

/**
 * 代码参考、数据来源：https://openlayers.org/en/latest/examples/wmts-dimensions.html
 */
function addWMTSLayer() {
	const projection = getProjection("EPSG:3857");

	if (!projection) {
		console.error("无法获取 EPSG:3857 投影");
		return;
	}

	const tileSizePixels = 256;
	const tileSizeMtrs = getWidth(projection.getExtent()) / tileSizePixels;
	const matrixIds = [];
	const resolutions = [];
	for (let i = 0; i <= 14; i++) {
		matrixIds[i] = String(i);
		resolutions[i] = tileSizeMtrs / 2 ** i;
	}
	const tileGrid = new WMTSTileGrid({
		origin: getTopLeft(projection.getExtent()),
		resolutions,
		matrixIds,
	});

	const scalgoToken = "CC5BF28A7D96B320C7DFBFD1236B5BEB";

	const wmtsSource = new WMTS({
		url: `https://ts2.scalgo.com/olpatch/wmts?token=${scalgoToken}`,
		layer: "SRTM_4_1:SRTM_4_1_flooded_sealevels",
		format: "image/png",
		matrixSet: "EPSG:3857",
		attributions: [
			"<a href=\"https://scalgo.com\" target=\"_blank\">SCALGO</a>",
			"<a href=\"https://cgiarcsi.community/data/"
			+ "srtm-90m-digital-elevation-database-v4-1\""
			+ " target=\"_blank\">CGIAR-CSI SRTM</a>",
		],
		tileGrid,
		style: "default",
		dimensions: {
			threshold: 100,
		},
	});

	const wmtsLayer = new TileLayer({
		opacity: 0.5,
		source: wmtsSource,
	});

	map.addLayer(wmtsLayer);
}

// http://localhost:8080/geoserver/gwc/service/wmts?layer=tutorial%3Abeijing_18&style=&tilematrixset=WebMercatorQuad&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=15&TileCol=26981&TileRow=12407

function addBJLayer() {
	const projection = getProjection("EPSG:3857");

	if (!projection) {
		console.error("无法获取 EPSG:3857 投影");
		return;
	}

	const tileSizePixels = 256;
	const tileSizeMtrs = getWidth(projection.getExtent()) / tileSizePixels;
	const matrixIds = [];
	const resolutions = [];
	for (let i = 1; i <= 19; i++) {
		matrixIds[i] = String(i);
		resolutions[i] = tileSizeMtrs / 2 ** i;
	}
	const tileGrid = new WMTSTileGrid({
		origin: getTopLeft(projection.getExtent()),
		resolutions,
		matrixIds,
	});

	const wmtsSource = new WMTS({
		url: `http://localhost:8080/geoserver/tutorial/gwc/service/wmts`,
		layer: "tutorial:beijing_18",
		format: "image/png",
		matrixSet: "WebMercatorQuad",
		tileGrid,
		style: "",
	});

	const wmtsLayer = new TileLayer({
		opacity: 0.5,
		source: wmtsSource,
	});

	map.addLayer(wmtsLayer);
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
