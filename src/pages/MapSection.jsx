import { useEffect, useState } from "react";
import Map from "../map/Map";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../components/common/Loader";
import { panelsPalette } from "../maputils/colors";
import { createPalette, rgbToColor, normalize } from "../maputils/visualize";
import SliderSizes from "../components/common/SliderSizes";
import Autocompleteplaces from "../components/Autocompleteplaces";
import axios from "axios";
import { setCoordinates, setBuildingInsights } from "../reducers/Map";
import {
  setshowToast,
  settoastMessage,
  settoastType,
} from "../reducers/DisplaySettings";

const zoom = 21;

export default function MapSection({ loaded, map, onLoaded, onMap }) {
  const dispatch = useDispatch();
  const place = useSelector((state) => state.map.place);
  const [loadedData, setLoadedData] = useState(false);
  const [size, setSize] = useState(0);
  // const [map, setMap] = useState();
  const center = useSelector((state) => state.map.coordinates);
  const buildingInsights = useSelector((state) => state.map.buildingInsights);

  useEffect(() => {
    if (buildingInsights && loaded && map) {
      // Create the solar panels on the map.
      const solarPotential = buildingInsights.solarPotential;
      const palette = createPalette(panelsPalette).map(rgbToColor);
      const minEnergy =
        solarPotential.solarPanels.slice(-1)[0].yearlyEnergyDcKwh;
      const maxEnergy = solarPotential.solarPanels[0].yearlyEnergyDcKwh;
      const size = solarPotential.solarPanels.length;
      setSize(size);
      const solarPanels = solarPotential.solarPanels
        .slice(0, 70)
        .map((panel, index) => {
          const [w, h] = [
            solarPotential.panelWidthMeters / 2,
            solarPotential.panelHeightMeters / 2,
          ];
          const points = [
            { x: +w, y: +h }, // top right
            { x: +w, y: -h }, // bottom right
            { x: -w, y: -h }, // bottom left
            { x: -w, y: +h }, // top left
            { x: +w, y: +h }, //  top right
          ];
          const orientation = panel.orientation == "PORTRAIT" ? 90 : 0;
          const azimuth =
            solarPotential.roofSegmentStats[panel.segmentIndex].azimuthDegrees;
          const colorIndex = Math.round(
            normalize(panel.yearlyEnergyDcKwh, maxEnergy, minEnergy) * 255
          );
          const polygon = new window.google.maps.Polygon({
            paths: points.map(({ x, y }) =>
              window?.google?.maps?.geometry?.spherical.computeOffset(
                { lat: panel.center.latitude, lng: panel.center.longitude },
                Math.sqrt(x * x + y * y),
                Math.atan2(y, x) * (180 / Math.PI) + orientation + azimuth
              )
            ),
            strokeColor: "#8B0000",
            strokeOpacity: 0.9,
            strokeWeight: 1,
            fillColor: palette[colorIndex],
            fillOpacity: 0.9,
          });
          setTimeout(() => {
            polygon.setMap(map);
          }, index * 100);
          console.log(index, "index");
          return polygon;
        });
    }
  }, [buildingInsights, loaded, map]);

  return (
    <div>
      {loaded ? (
        <Map center={center} zoom={zoom} onMap={onMap} onLoaded={onLoaded} />
      ) : (
        <Loader />
      )}

      {/* {loaded ? (
        <form
          onSubmit={handleContinue}
          className="flex absolute top-2 left-2 py-2 px-2 rounded-md bg-white"
        >
          <Autocompleteplaces />
          <button
            type="submit"
            className="bg-[#3d3880] hover:bg-[#3d3880] text-white font-bold py-2 px-4 ml-2 rounded-sm"
          >
            Continue
          </button>
        </form>
      ) : null} */}

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
        <SliderSizes max={size} />
      </div>
    </div>
  );
}
