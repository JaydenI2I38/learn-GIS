<script setup lang="ts">
import { getTopLeft, getWidth } from "ol/extent.js";
import GeoJSON from "ol/format/GeoJSON";
import TileLayer from "ol/layer/Tile";

import VectorLayer from "ol/layer/Vector";
import { bbox as bboxStrategy } from "ol/loadingstrategy";
import Map from "ol/Map";
import { fromLonLat, get as getProjection } from "ol/proj.js";
import TileWMS from "ol/source/TileWMS";
import VectorSource from "ol/source/Vector";

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

	map.setView(new View({
		center: fromLonLat([116.40742, 39.90421]), // 转换！
		zoom: 12,
	}));

	// addBoundaryLinesLayer();
	addCoastlinesLayer();
	addWMTSLayer();
	addBJLayer();
	addWFSLayer();
}

/**
 * 边界线
 * 数据来源：https://www.naturalearthdata.com/downloads/110m-cultural-vectors/
 * 数据格式：Shapefile
 * service: WMS
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
 * service: WMS
 */
function addCoastlinesLayer() {
	const wmsLayer = new TileLayer({
		source: new TileWMS({
			url: "/geoserver/ne/wms",
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
 * service: WMTS
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

/**
 * 北京
 * service: WMTS
 */
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
		resolutions: [...resolutions],
		matrixIds: [...matrixIds],
	});

	const wmtsSource = new WMTS({
		url: `/geoserver/tutorial/gwc/service/wmts`,
		layer: "tutorial:beijing_18",
		format: "image/png",
		matrixSet: "WebMercatorQuad",
		tileGrid,
		style: "",
	});

	const wmtsLayer = new TileLayer({
		opacity: 0.5,
		source: wmtsSource,
		minZoom: 11,
		maxZoom: 19,
	});

	map.addLayer(wmtsLayer);
}

/**
 * 边界线
 * 数据来源：https://www.naturalearthdata.com/downloads/110m-cultural-vectors/
 * 数据格式：Shapefile
 * service: WFS
 */
function addWFSLayer() {
	// http://localhost:8080/geoserver/tutorial-boundarylines/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tutorial-boundarylines%3Ane_110m_admin_0_boundary_lines_land&outputFormat=application%2Fjson&maxFeatures=50

	// const wfsLayer = new TileLayer({
	// 	source: new TileWMS({
	// 		url: "http://localhost:8080/geoserver/tutorial-boundarylines/ows",
	// 		params: {
	// 			layers: "tutorial-boundarylines:ne_110m_admin_0_boundary_lines_land",
	// 		},
	// 	}),
	// });

	// map.addLayer(wfsLayer);

	const wfsSource = new VectorSource({
		url: "/geoserver/tutorial-boundarylines/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tutorial-boundarylines%3Ane_110m_admin_0_boundary_lines_land&outputFormat=application%2Fjson",
		format: new GeoJSON(),
		strategy: bboxStrategy,
	});

	const wfsLayer = new VectorLayer({
		source: wfsSource,
	});

	map.addLayer(wfsLayer);
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
