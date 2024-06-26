import { useState, useEffect } from "react";
import "./Map.css";
import { useJsApiLoader, GoogleMap } from "@react-google-maps/api";

const libraries = ["places", "drawing", "geometry"];

// Custom map control to switch between basemap options

const Map = ({ zoom, center, onMap, onLoaded }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyA-LaWEor4ckZWutoufU3y6ou4Sww4EpdE",
    libraries,
  });

  useEffect(() => {
    if (isLoaded) {
      onLoaded(isLoaded);
    }
  }, [isLoaded, onLoaded]);

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
        onLoad={(map) => onMap(map)}
        tilt={0}
      ></GoogleMap>
    </>
  );
};

export default Map;
