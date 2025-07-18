<script setup lang="ts">
// import * as maplibreWind from "@sakitam-gis/maplibre-wind";
import maplibregl from "maplibre-gl";
import { onMounted } from "vue";

import mapjson from "@/assets/map_without.json";
import * as maplibreWind from "@/components/windLayer";

let map: maplibregl.Map | null = null;

function addWindLayer() {
	const tileSource = new maplibreWind.TileSource("wind", {
		tileSize: 256,
		minZoom: 0,
		maxZoom: 6,
		roundZoom: true,
		decodeType: maplibreWind.DecodeType.image,
		// decodeType: maplibreWind.DecodeType.imageWithExif,
		// wrapX: true,
		dataRange: [[-20, 20], [-20, 20]],
		// url: "https://blog.sakitam.com/wind-layer/data/tiles/2023111700/2023111703/{z}/{x}/{y}/wind-surface.jpeg",
		url: "/geoserver/gwc/service/wmts?layer=tutorial%3Auv&style=&tilematrixset=WebMercatorQuad&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix={z}&TileCol={x}&TileRow={y}",
	});

	const layer = new maplibreWind.Layer("wind", tileSource, {
		styleSpec: {
			"fill-color": ["interpolate", ["step", 1], ["get", "value"], 0, "#fff", 104, "#fff"],
			"opacity": 0.7,
			// "space": 20,
			// "size": [12, 10],
			"numParticles": [
				"interpolate",
				["exponential", 0.5],
				["zoom"],
				0,
				65535 / 8,
				1,
				65535 / 16,
			],
			"speedFactor": ["interpolate", ["exponential", 0.5], ["zoom"], 0, 1, 15, 0],
			"fadeOpacity": 0.93,
			"dropRate": 0.003,
			"dropRateBump": 0.002,
		},
		renderFrom: maplibreWind.RenderFrom.rg,
		displayRange: [-15, 25],
		renderType: maplibreWind.RenderType.particles,
		// mask: {
		// 	data: clip,
		// 	// type: maplibreWind.MaskType.outside,
		// 	type: maplibreWind.MaskType.inside, // 默认是 inside，即只显示范围内的
		// },
	});

	console.log("wind layer", layer);

	map?.addLayer(layer);
}

function addWMTSLayer() {
	map?.addSource(`wmts-source`, {
		type: "raster",
		tiles: [
			`/geoserver/gwc/service/wmts?layer=tutorial%3Agfs.tz.pgrb2.0p25.20240714000000.t2m&style=&tilematrixset=WebMercatorQuad&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix={z}&TileCol={x}&TileRow={y}`,
			// `https://layer.yunyaoyun.cn:20124/gfs_t2m/wmts/?layer=layer&style=default&tilematrixset=ms_14&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix={z}&TileCol={x}&TileRow={y}&styleid=t2m&datetime=20250715120000&sdui=%7B%22extra%22%3A%2220250715120000%22%7D`,
		],
		tileSize: 256,
	});
	map?.addLayer({
		id: `wmts-layer`,
		type: "raster",
		source: `wmts-source`,
		paint: {
			"raster-opacity": 0.7,
		},
	});
}

function createBlankStyle() {
	return {
		version: 8,
		name: "Blank Style",
		sources: {},
		layers: [
			{
				id: "background",
				type: "background",
				paint: {
					"background-color": "rgb(151, 151, 151)", // 浅灰色背景
				},
			},
		],
	};
}

function addBaseLayer() {
	map?.addSource("base", {
		type: "geojson",
		data: mapjson,
	});

	// 直接添加到最后
	map?.addLayer({
		id: "base",
		type: "fill",
		source: "base",
		paint: {
			"fill-color": "rgb(184, 184, 184)",
			"fill-opacity": 0.8,
		},
	});

	map?.addLayer({
		id: "base-border",
		type: "line",
		source: "base",
		paint: {
			"line-color": "rgb(255, 255, 255)",
			"line-width": 1,
		},
	});

	const layers = map?.getStyle().layers;
	if (layers && layers.length > 3) {
		// 确保有足够的图层进行重排序
		// 将我们的图层移到第一个图层之前
		const firstLayerId = layers[0].id;
		map?.moveLayer("base", firstLayerId);
		map?.moveLayer("base-border", firstLayerId);
	}
}

onMounted(() => {
	map = new maplibregl.Map({
		container: "map", // container id
		style: createBlankStyle(), // style URL
		center: [0, 0], // starting position [lng, lat]
		zoom: 1, // starting zoom
		maxZoom: 12,
		minZoom: 1,
	});

	map?.setCenter([116.397428, 39.90923]);
	map?.setZoom(1);

	map?.on("load", () => {
		console.log("map loaded", map);

		addBaseLayer();
		addWMTSLayer();
		addWindLayer();
	});

	// map.on("style.load", () => {
	// 	map.setProjection({
	// 		type: "globe", // Set projection to globe
	// 	});
	// });
});
</script>

<template>
	<div class="app-container">
		<div id="map" />
	</div>
</template>

<style lang="scss" scoped>
@import "maplibre-gl/dist/maplibre-gl.css";

.app-container {
	width: 100vw;
	height: 100vh;

	#map {
		width: 100%;
		height: 100%;
	}
}
</style>
