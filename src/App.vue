<script setup lang="ts">
import * as maplibreWind from "@sakitam-gis/maplibre-wind";
import maplibregl from "maplibre-gl";
import { onMounted } from "vue";

import mapjson from "@/assets/map_without.json";

let map: maplibregl.Map | null = null;

function addWindLayer() {
	const tileSource = new maplibreWind.TileSource("wind", {
		tileSize: 256,
		minZoom: 0,
		maxZoom: 4,
		roundZoom: true,
		decodeType: maplibreWind.DecodeType.imageWithExif,
		wrapX: true,
		// tileBounds: [-78.120282611, -75.191804486, 132.453327310, 68.846393966],
		url: "https://blog.sakitam.com/wind-layer/data/tiles/2023111700/2023111703/{z}/{x}/{y}/wind-surface.jpeg",
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
				65535 / 4,
				1,
				65535 / 8,
			],
			"speedFactor": [
				"interpolate",
				["exponential", 0.5],
				["zoom"],
				0,
				1,
				17,
				0.0,
			],
		},
		renderFrom: maplibreWind.RenderFrom.rg,
		displayRange: [0, 104],
		renderType: maplibreWind.RenderType.particles,
		// mask: {
		// 	data: clip,
		// 	// type: maplibreWind.MaskType.outside,
		// 	type: maplibreWind.MaskType.inside, // 默认是 inside，即只显示范围内的
		// },
	});

	map?.addLayer(layer);
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
		minZoom: 3,
	});

	map?.setCenter([116.397428, 39.90923]);
	map?.setZoom(3);

	map?.on("load", () => {
		console.log("map loaded", map);

		addBaseLayer();

		addWindLayer();
	});
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
