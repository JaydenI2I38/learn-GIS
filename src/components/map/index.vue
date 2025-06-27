<script setup lang="ts">
import L from "leaflet";
import { onMounted } from "vue";
import "leaflet/dist/leaflet.css";

function initMap() {
	const map = L.map("map").setView([36.90872, 102.39749], 5);
	L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
		attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
	}).addTo(map);
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
