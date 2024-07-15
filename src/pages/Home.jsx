import GooglePlacesAutoComplete from "../components/GooglePlacesAutoComplete";
import Map from "../map/Map";
import Loader from "../components/common/Loader";
import PropTypes from "prop-types";

const zoom = 21;
const center = {
  lat: 37.7749,
  lng: -122.4194,
};

export default function Home({ loaded, map, onLoaded, onMap }) {
  return (
    <div
      className="bg-cover bg-center h-screen  bg-no-repeat"
      style={{
        backgroundImage: `url('bannerai.png')`,
        backgroundSize: "contain",
      }}
    >
      {loaded ? (
        <div style={{ display: "none" }}>
          <Map center={center} zoom={zoom} onMap={onMap} onLoaded={onLoaded} />
        </div>
      ) : (
        <Loader />
      )}
      <GooglePlacesAutoComplete map={map} component={"Map"} />
    </div>
  );
}

Home.propTypes = {
  loaded: PropTypes.bool.isRequired,
  map: PropTypes.object.isRequired,
  onLoaded: PropTypes.func.isRequired,
  onMap: PropTypes.func.isRequired,
};
