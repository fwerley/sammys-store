import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import Map from './OpenLayersMap/Map';
import { saveShippingAddress, setFullBoxOn } from '../slice/userSlice';
import Layers from './OpenLayersMap/Layers';
import TileLayer from './OpenLayersMap/TileLayer';
import { nomination, osm, vector } from './OpenLayersMap/Source';
import { fromLonLat } from 'ol/proj';
import mapConfig from './OpenLayersMap/config.json';
import VectorLayer from './OpenLayersMap/VectorLayer';
import { Style, Icon } from 'ol/style';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import ListAdress from '../components/ListAdress';

const defalutLocation = mapConfig.center;
let tag = '';
export default function MapScreen() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [address, setAddress] = useState([]);
  const [zoom, setZoom] = useState(18);
  const [center, setCenter] = useState(defalutLocation);
  const [location, setLocation] = useState(center);
  const [features, setFeatures] = useState(addMarkers([location]));

  const viewMarker = (dataCoords) => {
    setFeatures(addMarkers([dataCoords]))
    setCenter(dataCoords)
    setLocation(dataCoords)
  }

  const selectAddress = (values) => {
    viewMarker(values);
    setAddress([]);
    tag = '';
  }

  const callback = payload => {
    // dispatch(saveShippingAddressMapLocation({
    //   lat: payload[1],
    //   lng: payload[0],
    // }))
    viewMarker(payload[0])
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
      const { data } = await nomination.get(`reverse?format=jsonv2&lat=${location[1]}&lon=${location[0]}&addressdetails=1`)

      dispatch(
        saveShippingAddress({
          number: data.address.house_number || '',
          address: data.address.road || '',
          neighborhood: data.address.suburb || data.address.village || '',
          city: data.address.city || data.address.city_district || data.address.town || '',
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

  let timeout = null;
  const searchMap = (e) => {
    const getData = async () => {
      try {
        const { data } = await nomination.get(`search/${e.target.value}?format=json&addressdetails=1`)
        tag = e.target.value;
        console.log(data)
        setAddress(data.map(address => {
          return {
            name: address.display_name,
            place_id: address.place_id,
            lat: address.lat,
            lon: address.lon,
          }
        }))
      } catch (error) {
        console.warn(error)
      }
    }
    clearTimeout(timeout);
    timeout = setTimeout(() => getData(), 1000)
  }

  return (
    <div className='full-box mt-n1'>
      <div className="search-area-map d-flex align-items-center position-absolute flex-column">
        <div className='map-input-box d-flex justify-content-center'>
          <input type='text' placeholder='Pesquisar endereço' onChange={searchMap} />
          <Button type='button' onClick={onConfirm}>
            Confirmar
          </Button>
        </div>
        <ListAdress
          arrayAdrees={address}
          onChangeView={selectAddress}
          searching={tag !== ''}
        />
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
