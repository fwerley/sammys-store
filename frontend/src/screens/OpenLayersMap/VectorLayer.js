import { useContext, useEffect } from 'react'
import MapContext from './MapContext';
import OLVectorLayer from "ol/layer/Vector";

export default function VectorLayer({ source, style, zIndex = 0 }) {
    const { map } = useContext(MapContext);
    useEffect(() => {
        if (!map) return;
        let vectorLayer = new OLVectorLayer({
            source,
            style
        });
        map.addLayer(vectorLayer);
        vectorLayer.setZIndex(zIndex);
        return () => {
            if (map) {
                map.removeLayer(vectorLayer);
            }
        }
    }, [map, source, style, zIndex])
    return null;
}
