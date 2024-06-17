import { useEffect, useState, useRef } from 'react';

export default function Map() {

  const [destination, setDestination] = useState({ lat: null, lng: null });
  const [myLocation, setMyLocation] = useState({ lat: null, lng: null });
  const [map, setMap] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [travelMode, setTravelMode] = useState('DRIVING');
  const dropdownRef = useRef(null);

  /* --- API --- */

  const [basicInfo, setBasicInfo] = useState({address: "miami, USA"});

  useEffect(() => {
      const getBasicInfo = async () => {
          let response = await fetch("https://seoul-sky-hope-church-api.vercel.app/api/basicinfo", { method: "get" });
          let data = await response.json();
          console.log("map:", data);
          setBasicInfo(data);
      }
      getBasicInfo();
  }, [])

  /* --- API --- */

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setMyLocation({ lat: pos.lat, lng: pos.lng });
        },
        () => {
          alert("Error: The Geolocation service failed")
        },
      );
    } else {
      alert("Error: The Geolocation service failed")
    }
  }, [basicInfo]);

  useEffect(() => {
    if (window.google && window.google.maps && basicInfo.address !== "miami, USA") {
      initMap();
    } 
  }, [basicInfo]);

  useEffect(() => {
    if (map && destination.lat !== null && destination.lng !== null && myLocation.lat !== null && myLocation.lng !== null) {
      calculateAndDisplayRoute();
    }
  }, [basicInfo, map, destination, myLocation]);

  useEffect(() => {
    const dropdown = dropdownRef.current;
    if (dropdown) {
      dropdown.onchange = travelModeChange;
    }
  }, [basicInfo, dropdownRef.current]);

  function travelModeChange(event) {
    setTravelMode(event.target.value);

    const geocoder = new google.maps.Geocoder();
    geocodeAddress(geocoder);
  }

  function initMap() {
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();

    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 7,
    });

    directionsRenderer.setMap(map);
    setMap(map);
    setDirectionsRenderer(directionsRenderer);

    const geocoder = new google.maps.Geocoder();
    geocodeAddress(geocoder);
  }

  function geocodeAddress(geocoder) {
    geocoder
      .geocode({ address: basicInfo.address })
      .then((result) => {
        const { results } = result;
        if (results.length > 0) {
          const location = results[0].geometry.location;
          const lat = location.lat();
          const lng = location.lng();
          setDestination({ lat, lng });

        } else {
          alert('No se encontraron resultados para la dirección dada.');
        }
      })
      .catch((e) => {
        alert('Geocode was not successful for the following reason: ' + e);
      });
  }

  function calculateAndDisplayRoute() {
    const directionsService = new google.maps.DirectionsService();
    directionsService
      .route({
        origin: { lat: myLocation.lat, lng: myLocation.lng },
        destination: { lat: destination.lat, lng: destination.lng },
        travelMode: google.maps.TravelMode[travelMode],
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
      })
      .catch((e) => window.alert('Directions request failed due to ' + e));
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 pb-12">
      <div className='travel-mode'>
        <b>Mode of Travel: </b>
        <select id="mode" ref={dropdownRef} className='rounded-[10px] text-black border-[1px] border-black'>
          <option value="DRIVING">Driving</option>
          <option value="WALKING">Walking</option>
          <option value="BICYCLING">Bicycling</option>
          <option value="TRANSIT">Transit</option>
        </select>
      </div>
      <div id="map"></div>
    </div>
  );
}


/* import React, { useEffect } from 'react';

export default function Map() {
  let map;
  let marker;
  let geocoder;
  let responseDiv;
  let response;

  function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
      zoom: 8,
      center: { lat: -34.397, lng: 150.644 },
      mapTypeControl: false,
    });
    geocoder = new google.maps.Geocoder();

    geocode({ address: "31 Boake St, North York, ON M3J 0B8" });
  }

  function geocode(request) {
    geocoder
      .geocode(request)
      .then((result) => {
        const { results } = result;
        if (results.length > 0) {
          const location = results[0].geometry.location;
          const lat = location.lat();
          const lng = location.lng();
          console.log("Latitud:", lat, "Longitud:", lng);
        } else {
          alert("No se encontraron resultados para la dirección dada.");
        }
      })
      .catch((e) => {
        alert("Geocode was not successful for the following reason: " + e);
      });
  }

  useEffect(() => {
    window.initMap = initMap;
    // Asegúrate de que el script de Google Maps esté cargado antes de llamar a initMap
    if (window.google && window.google.maps) {
      initMap();
    } else {
      // Si el script no está cargado, puedes agregarlo dinámicamente
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCyOnLFTH1r1tnjUbFAhHGnOgTE8fK-p4A&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <>
      <div id="floating-panel">
        <b>Mode of Travel: </b>
        <select id="mode">
          <option value="DRIVING">Driving</option>
          <option value="WALKING">Walking</option>
          <option value="BICYCLING">Bicycling</option>
          <option value="TRANSIT">Transit</option>
        </select>
      </div>
      <div id="map" style={{ height: '500px', width: '100%' }}></div>
    </>
  );
} */
