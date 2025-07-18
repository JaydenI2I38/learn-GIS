import {
	configDeps,
	DecodeType,
	ImageSource,
	LayerSourceType,
	MaskType,
	RenderFrom,
	RenderType,
	TileID,
	TileSource,
	TimelineSource,
} from "wind-gl-core";

export { default as Layer } from "./layer";
export {
	configDeps,
	DecodeType,
	ImageSource,
	LayerSourceType,
	MaskType,
	RenderFrom,
	RenderType,
	TileID,
	TileSource,
	TimelineSource,
};

// /**
//  * constrain n to the given range via min + max
//  *
//  * @param n - value
//  * @param min - the minimum value to be returned
//  * @param max - the maximum value to be returned
//  * @returns the clamped value
//  */
// export function clamp(n: number, min: number, max: number): number {
// 	return Math.min(max, Math.max(min, n));
// }

// const constrainedZoom = Math.min(Math.max(zoom, this.minZoom), this.maxZoom);

// this.scale = this.zoomScale(constrainedZoom);

// export function zoomScale(zoom: number) { return Math.pow(2, zoom); }

// export function get worldSize(): number {
// 	return this.tileSize * this.scale;
// }

// export const MAX_VALID_LATITUDE = 85.051129;
// /**
//  * Convert from LngLat to world coordinates (Mercator coordinates scaled by 512)
//  * @param lnglat - the lngLat
//  * @returns Point
//  */
// export function project(lnglat: any) {
// 	const lat = clamp(lnglat.lat, -MAX_VALID_LATITUDE, MAX_VALID_LATITUDE);
// 	return new Point(
// 		mercatorXfromLng(lnglat.lng) * this.worldSize,
// 		mercatorYfromLat(lat) * this.worldSize,
// 	);
// }
// export function mercatorXfromLng(lng: number) {
// 	return (180 + lng) / 360;
// }

// export function mercatorYfromLat(lat: number) {
// 	return (180 - (180 / Math.PI * Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360)))) / 360;
// }
