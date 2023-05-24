import { useContext, useEffect } from 'react'
import MapContext from './MapContext';
import { FullScreen } from 'ol/control'

export default function FullScreenControl() {
    const { map } = useContext(MapContext);
    useEffect(() => {
        if (!map) return;
        let fullScreenControl = new FullScreen({});
        map.controls.push(fullScreenControl);
        return () => map.controls.remove(fullScreenControl)
    }, [map])
    return null;
}
