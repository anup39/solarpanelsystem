import { useState, useEffect } from "react";
import "./Map.css";
import { useJsApiLoader, GoogleMap } from "@react-google-maps/api";

const libraries = ["places", "drawing"];

// Custom map control to switch between basemap options

const Map = ({ zoom, center, onMap }) => {
  const [map, setMap] = useState(/** @type google.maps.Map */ (null));

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyA-LaWEor4ckZWutoufU3y6ou4Sww4EpdE",
    libraries,
  });

  //map instance passing to the parent
  useEffect(() => {
    if (!map) return;

    if (onMap) {
      onMap(map);
    }
  }, [map, onMap]);

  if (!isLoaded) {
    return null;
  }

  return (
    <>
      {" "}
      <GoogleMap
        center={center}
        mapContainerClassName="google-map"
        zoom={zoom}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          mapTypeId: "satellite",
          //   draggableCursor: "crosshair",
        }}
        onLoad={(map) => setMap(map)}
        tilt={0}
      ></GoogleMap>
    </>
  );
};

export default Map;
