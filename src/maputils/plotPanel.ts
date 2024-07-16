import { createPalette, rgbToColor, normalize } from "../maputils/visualize";
import { panelsPalette } from "../maputils/colors";
import { setshowToast, settoastMessage, settoastType } from "../reducers/DisplaySettings";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;


const plotPanel =(
    lat: number,
    lng: number,
    map: google.maps.Map,
    dispatch: any,
    onShowDetails: any,
    onLoader: any
)=>{
    const args = {
        "location.latitude": lat.toFixed(5),
        "location.longitude": lng.toFixed(5),
      };
    const params = new URLSearchParams({ ...args, key: apiKey });
    onLoader(true);
    fetch(
        `https://solar.googleapis.com/v1/buildingInsights:findClosest?${params}`
      ).then(async (response) => {
        const content = await response.json();
        if (response.status != 200) {
          console.error("findClosestBuilding\n", content);
          dispatch(setshowToast(true));
          dispatch(settoastType("error"));
          dispatch(
            settoastMessage(
              "No building found near the location. Please try again."
            )
          );
          onShowDetails(false);
          onLoader(false);
          return;
        }
        let polygons_: google.maps.Polygon[] = [];
        window.polygons?.forEach((polygon:any) => {
          polygon.setMap(null);
        }
        );
        const solarPotential = content.solarPotential;
        const palette = createPalette(panelsPalette).map(rgbToColor);
        const minEnergy =
          solarPotential.solarPanels.slice(-1)[0].yearlyEnergyDcKwh;
        const maxEnergy = solarPotential.solarPanels[0].yearlyEnergyDcKwh;
        const size = solarPotential.solarPanels.length;
        solarPotential.solarPanels.slice(0, 70).map((panel, index) => {
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
            solarPotential.roofSegmentStats[panel.segmentIndex]
              .azimuthDegrees;
          const colorIndex = Math.round(
            normalize(panel.yearlyEnergyDcKwh, maxEnergy, minEnergy) * 255
          );
          const polygon = new window.google.maps.Polygon({
            paths: points.map(({ x, y }) =>
              window?.google?.maps?.geometry?.spherical.computeOffset(
                {
                  lat: panel.center.latitude,
                  lng: panel.center.longitude,
                },
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
          polygon.setMap(map);
          polygons_.push(polygon);
        
          
          return polygon;
        });
        window.polygons = polygons_;
        onShowDetails(true);
        onLoader(false);
      });


   
}
export default plotPanel;