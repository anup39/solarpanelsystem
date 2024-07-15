import GooglePlacesAutoComplete from "../components/GooglePlacesAutoComplete";
import Map from "../map/Map";
import Loader from "../components/common/Loader";
import PropTypes from "prop-types";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const zoom = 21;
const center = {
  lat: 37.7749,
  lng: -122.4194,
};

export default function Home({ loaded, map, onLoaded, onMap }) {
  const navigate = useNavigate();
  return (
    <div>
      <div className="flex flex-row items-center justify-stretch">
        <div className="flex flex-col mt-5">
          <Typography variant="h4" sx={{ color: "#3d3880", marginLeft: "25%" }}>
            Kicreate
          </Typography>
          <img src="bannerai.png" alt="Logo"></img>
        </div>

        <div className="flex gap-5">
          <Typography variant="h5" sx={{ color: "#3d3880" }}>
            Click here to continue
          </Typography>
          <Button
            onClick={() => navigate("/map")}
            sx={{
              color: "white",
              backgroundColor: "#3d3880",
              "&:hover": {
                backgroundColor: "#369881",
              },
            }}
          >
            Continue
          </Button>
        </div>

        {loaded ? (
          <div style={{ display: "none" }}>
            <Map
              center={center}
              zoom={zoom}
              onMap={onMap}
              onLoaded={onLoaded}
            />
          </div>
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
}

Home.propTypes = {
  loaded: PropTypes.bool.isRequired,
  map: PropTypes.object,
  onLoaded: PropTypes.func.isRequired,
  onMap: PropTypes.func.isRequired,
};
