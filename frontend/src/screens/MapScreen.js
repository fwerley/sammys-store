import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import Map from './OpenLayersMap/Map';
import { saveShippingAddress, selectUser, setFullBoxOn } from '../slice/userSlice';
import Layers from './OpenLayersMap/Layers';
import TileLayer from './OpenLayersMap/TileLayer';
import { nomination, osm, vector } from './OpenLayersMap/Source';
import { fromLonLat } from 'ol/proj';
import mapConfig from './OpenLayersMap/config.json';
import VectorLayer from './OpenLayersMap/VectorLayer';
import { Style, Icon } from 'ol/style';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';

const defalutLocation = mapConfig.center;

export default function MapScreen() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [zoom, setZoom] = useState(15.5);
  const [center, setCenter] = useState(defalutLocation);
  const [location, setLocation] = useState(center);
  const [features, setFeatures] = useState(addMarkers([location]));


  const callback = payload => {
    // dispatch(saveShippingAddressMapLocation({
    //   lat: payload[1],
    //   lng: payload[0],
    // }))
    setFeatures(addMarkers([payload[0]]))
    setCenter(payload[0])
    setLocation(payload[0])
    setZoom(payload[1])
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Recurso de geolocalização não suportado');
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        setCenter([
          position.coords.longitude,
          position.coords.latitude,
        ]);
        setLocation([
          position.coords.longitude,
          position.coords.latitude,
        ]);
        setFeatures(addMarkers([
          [position.coords.longitude,
          position.coords.latitude,]
        ]))
      })
    }
  }

  useEffect(() => {
    getCurrentLocation();
    dispatch(setFullBoxOn())
  }, [dispatch]);

  function addMarkers(lonLatArray) {
    var iconStyle = new Style({
      image: new Icon({
        anchor: [0.5, 31],
        anchorXUnits: "fraction",
        anchorYUnits: "pixels",
        src: mapConfig.markerImage32,
      }),
    });
    let features = lonLatArray.map((item) => {
      let feature = new Feature({
        geometry: new Point(fromLonLat(item)),
      });
      feature.setStyle(iconStyle);
      return feature;
    });
    return features;
  }

  const onConfirm = () => {
    // const places = placeRef.current.getPlaces() || [{}];
    const getData = async () => {
      const { data } = await nomination.get(
        `reverse?format=jsonv2&lat=${location[1]}&lon=${location[0]}&addressdetails=1`)
      dispatch(
        saveShippingAddress({
          number: data.address.house_number || '',
          address: data.address.road || '',
          neighborhood: data.address.residential || '',
          city: data.address.city || '',
          postalCode: data.address.postcode || '',
          federativeUnity: [{
            label: data.address.state,
            sigla: data.address['ISO3166-2-lvl4'].split('-')[1]
          }] || [],
          location: {
            lat: location[1],
            lng: location[0],
          } || {}
        })
      );
      // dispatch(saveShippingAddressMapLocation({
      //   lat: location[1],
      //   lng: location[0],
      // }));
    }
    getData();
    toast.success('Localização selecionada');
    navigate('/shipping');
  }
  return (
    <div className='full-box mt-n1'>
      <div className='map-input-box d-flex justify-content-center'>
        <input type='text' placeholder='Pesquisar endereço' />
        <Button type='button' onClick={onConfirm}>
          Confirmar
        </Button>
      </div>
      {/* <div className='marker'></div> */}
      <Map center={fromLonLat(center)} zoom={zoom} callback={callback}>
        <Layers>
          <TileLayer
            source={osm()}
            zIndex={0}
          />
          <VectorLayer source={vector({ features })} />
        </Layers>
      </Map>
    </div>
  )
}
