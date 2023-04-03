import React, { useEffect, useRef, useState } from 'react';
import * as ol from 'ol';
import { transform } from 'ol/proj';
import MapContext from './MapContext';

export default function Map({ children, zoom, center, callback }) {
    const mapRef = useRef();
    const [map, setMap] = useState(null);

    useEffect(() => {
        let options = {
            view: new ol.View({ zoom, center }),
            layers: [],
            controls: [],
            overlays: []
        };
        let mapObject = new ol.Map(options);
        mapObject.setTarget(mapRef.current);
        setMap(mapObject);
        return () => mapObject.setTarget(undefined);
    }, [center, zoom])

    useEffect(() => {
        if (!map) return;
        map.getView().setZoom(zoom);
    }, [zoom, map])

    useEffect(() => {
        if (!map) return;
        map.getView().setCenter(center);
    }, [center, map]);

    useEffect(() => {
        if (map !== null) {
            map.on('click', (evt) => callback([
                transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326'),
                map.getView().getZoom()
            ]))
            // map.on('movestart', start)
            // map.on('moveend', end)
        }
    }, [map])

    return (
        <MapContext.Provider value={{ map }}>
            <div ref={mapRef} className="ol-map">
                {children}
            </div>
        </MapContext.Provider>
    )
}
