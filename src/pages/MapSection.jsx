import Map from "../map/Map";
import Loader from "../components/common/Loader";
import SliderSizes from "../components/common/SliderSizes";
import GooglePlacesAutoComplete from "../components/GooglePlacesAutoComplete";
import PropTypes from "prop-types";

const zoom = 21;
const center = {
  lat: 37.7749,
  lng: -122.4194,
};

export default function MapSection({ loaded, map, onLoaded, onMap }) {
  return (
    <div>
      {loaded ? (
        <Map center={center} zoom={zoom} onMap={onMap} onLoaded={onLoaded} />
      ) : (
        <Loader />
      )}
      {map && (
        <GooglePlacesAutoComplete
          map={map}
          component={"MapSection"}
          onLoaded={onLoaded}
        />
      )}

      <div
        style={{
          display: "flex",
          position: "absolute",
          bottom: "10px",
          left: "45%",
          backgroundColor: "white",
          borderRadius: "5px",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1>Panel Count:</h1>
        </div>
        <SliderSizes max={50} />
      </div>
      <div
        style={{
          display: "flex",
          position: "absolute",
          backgroundColor: "white",
          borderRadius: "5px",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      ></div>
    </div>
  );
}

MapSection.propTypes = {
  loaded: PropTypes.bool.isRequired,
  map: PropTypes.object,
  onLoaded: PropTypes.func.isRequired,
  onMap: PropTypes.func.isRequired,
};
