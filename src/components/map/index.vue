<script setup>
import { Ion, Terrain, Viewer } from "cesium";
import { onMounted, ref } from "vue";
import "cesium/Build/Cesium/Widgets/widgets.css";

Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkZWY3N2UwOS01ZGI5LTQ3OTEtYjM4MS1mZTcyMjVlNDQzYzciLCJpZCI6MzE3MTMxLCJpYXQiOjE3NTEyOTM3NzR9.WjX3hOrWcZwp28TH0RoEd1EbL6VyMPFLM9t-4S_45I4";

const map = ref(null);

function initMap() {
	map.value = new Viewer("map", {
		terrain: Terrain.fromWorldTerrain(),
	});
}

onMounted(() => {
	initMap();
});
</script>

<template>
	<div class="map-container">
		<div id="map" class="map-content" />
	</div>
</template>
