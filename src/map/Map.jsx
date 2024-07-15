import { useEffect } from "react";
import "./Map.css";
import { useJsApiLoader, GoogleMap } from "@react-google-maps/api";
import PropTypes from "prop-types";

const libraries = ["places", "drawing", "geometry"];

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const Map = ({ zoom, center, onMap, onLoaded }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
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

Map.propTypes = {
  zoom: PropTypes.number.isRequired,
  center: PropTypes.object.isRequired,
  onMap: PropTypes.func.isRequired,
  onLoaded: PropTypes.func.isRequired,
};
