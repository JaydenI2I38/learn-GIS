L.TileLayer.WMTS = L.TileLayer.extend({
	defaultWmtsParams: {
		service: "WMTS",
		request: "GetTile",
		version: "1.0.0",
		layer: "",
		style: "",
		tilematrixset: "",
		format: "image/jpeg",
	},

	initialize(url, options) { // (String, Object)
		this._url = url;
		let lOptions = {};
		let cOptions = Object.keys(options);
		cOptions.forEach((element) => {
			lOptions[element.toLowerCase()] = options[element];
		});
		let wmtsParams = L.extend({}, this.defaultWmtsParams);
		let tileSize = lOptions.tileSize || this.options.tileSize;
		if (lOptions.detectRetina && L.Browser.retina) {
			wmtsParams.width = wmtsParams.height = tileSize * 2;
		}
		else {
			wmtsParams.width = wmtsParams.height = tileSize;
		}
		for (let i in lOptions) {
			// all keys that are in defaultWmtsParams options go to WMTS params
			if (wmtsParams.hasOwnProperty(i) && i != "matrixIds") {
				wmtsParams[i] = lOptions[i];
			}
		}
		this.wmtsParams = wmtsParams;
		this.matrixIds = options.matrixIds || this.getDefaultMatrix();
		L.setOptions(this, options);
	},

	onAdd(map) {
		this._crs = this.options.crs || map.options.crs;
		L.TileLayer.prototype.onAdd.call(this, map);
	},

	getTileUrl(coords) { // (Point, Number) -> String
		let tileSize = this.options.tileSize;
		let nwPoint = coords.multiplyBy(tileSize);
		nwPoint.x += 1;
		nwPoint.y -= 1;
		let sePoint = nwPoint.add(new L.Point(tileSize, tileSize));
		let zoom = this._tileZoom;
		let nw = this._crs.project(this._map.unproject(nwPoint, zoom));
		let se = this._crs.project(this._map.unproject(sePoint, zoom));
		let tilewidth = se.x - nw.x;
		let ident = this.matrixIds[zoom].identifier;
		let tilematrix = `${ident}`;
		let X0 = this.matrixIds[zoom].topLeftCorner.lng;
		let Y0 = this.matrixIds[zoom].topLeftCorner.lat;
		let tilecol = Math.floor((nw.x - X0) / tilewidth);
		let tilerow = -Math.floor((nw.y - Y0) / tilewidth);
		let url = L.Util.template(this._url, { s: this._getSubdomain(coords) });
		return `${url + L.Util.getParamString(this.wmtsParams, url)}&tilematrix=${tilematrix}&tilerow=${tilerow}&tilecol=${tilecol}`;
	},

	setParams(params, noRedraw) {
		L.extend(this.wmtsParams, params);
		if (!noRedraw) {
			this.redraw();
		}
		return this;
	},

	getDefaultMatrix() {
		/**
		 * the matrix3857 represents the projection
		 * for in the IGN WMTS for the google coordinates.
		 */
		let matrixIds3857 = Array.from({ length: 22 });
		for (let i = 0; i < 22; i++) {
			matrixIds3857[i] = {
				identifier: `${i}`,
				topLeftCorner: new L.LatLng(20037508.3428, -20037508.3428),
			};
		}
		return matrixIds3857;
	},
});

L.tileLayer.wmts = function (url, options) {
	return new L.TileLayer.WMTS(url, options);
};
