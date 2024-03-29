import { useContext, useEffect } from 'react'
import MapContext from './MapContext';
import OLTileLayer from 'ol/layer/Tile';

export default function TileLayer({ source, zIndex = 0 }) {
    const { map } = useContext(MapContext);
    useEffect(() => {
        if (!map) return;
        let tileLayer = new OLTileLayer({
            source,
            zIndex
        });
        map.addLayer(tileLayer);
        tileLayer.setZIndex(zIndex);
        return () => {
            if (map) {
                map.removeLayer(tileLayer);
            }
        }
    }, [map, source, zIndex])
    return null;
}
