import * as polyline from '@mapbox/polyline';
import * as jsts from 'jsts';
import { Utils } from './utils';

/**
 * @description A class containing various useful functions
 * @export
 * @class Utils
 */
export class Geo {

	/**
	 * @description This function takes in latitude and longitude of two location
	 * and returns the distance between them as the crow flies (in m)
	 * @param {Coordinates} pos1
	 * @param {Coordinates} pos2
	 * @returns {number} Distance between both points
	 */
	public static getDistanceBetween(pos1: Coordinates, pos2: Coordinates): number {
		return Geo.getDistanceLtLn(pos1.latitude, pos1.longitude, pos2.latitude, pos2.longitude);
	}

	/**
	 * @description This function takes two lattitudes and two longitudes and returns the distance between them in meters
	 * 
	 * @param {Coordinates} pos1
	 * @param {Coordinates} pos2
	 * @returns {number} Distance between both points
	 */
	public static getDistanceLtLn(lt1, ln1, lt2, ln2): number {
		const toRad = (val) => val * Math.PI / 180;
		const R = 6371000; // m

		const dLat = toRad(lt2 - lt1);
		const dLon = toRad(ln2 - ln1);
		const lat1 = toRad(lt1);
		const lat2 = toRad(lt2);

		const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		const d = R * c;
		return Math.round(d);
	}

	/**
	 * Converts a polyline string into an array of coordinates
	 *
	 * @param string
	 */
	public static decodePolyLineString(string: string) {
		return polyline.decode(string).map(p => p.reverse());
	}

	/**
	 * Generates a polygon around a given path acording to radius
	 *
	 * @param path
	 * @param distance
	 */
	public static polyLineToPolygon(path, radius = 1000) {
		const geoReader = new jsts.io.GeoJSONReader(),
			geoWriter = new jsts.io.GeoJSONWriter();

		const coef = {
			lat: { slope: 0.91398446883, intercept: 4.20172739495 },
			lng: { slope: 1.68398827088, intercept: -1.51733468295 },
		};

		const distance = (radius * 0.001 / 111.12); // why ? idk check later

		const geometry = geoReader.read({ type: 'LineString', coordinates: path }).buffer(distance, 8, 1);
		const polygon = geoWriter.write(geometry).coordinates[0];

		// for (let point of ) {
		// 	let lng = coef.lng.slope * point[0] + coef.lng.intercept;
		// 	let lat = coef.lat.slope * point[1] + coef.lat.intercept;
		// 	polygon.push([lng, lat]);
		// }

		return polygon;
	}

	/**
	 * Convert an array of arrars into an array of LngLat (gmaps)
	 *
	 * @param array
	 * @param inverted
	 */
	public static arrayToLngLat(array, inverted = false) {
		return array.map(p => {
			if (inverted) p.reverse();
			return { lng: p[0], lat: p[1] };
		});
	}

	/**
	 * Convert an array of LngLat (gmaps) into an array of arrays
	 *
	 * @param array
	 * @param inverted
	 */
	public static lngLatToArray(array, inverted = false) {
		return array.map(p => {
			if (inverted) return [p.lat, p.lng];
			else return [p.lng, p.lat];
		});
	}

	public static delta() {
		return 0.001 * Utils.randIndex(10) * (!!Utils.randIndex(1) ? -1 : 1);
	}

}
