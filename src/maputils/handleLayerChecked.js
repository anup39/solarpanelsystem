import RemoveSourceAndLayerFromMap from "./RemoveSourceAndLayerFromMap";
import AddLayerAndSourceToMap from "./AddLayerAndSourceToMap";
import * as turf from "@turf/turf";

// Here the editting part is done in the most of the section in the current development:

const handleLayerChecked = async (
  event,
  layer_name,
  map,
  popUpRef,
  geojson
) => {
  console.log(event.target.checked, "event.target.checked");
  console.log(layer_name, "layer_name");
  console.log(map, "map");
  console.log(popUpRef, "popUpRef");
  console.log(geojson, "geojson");
  const sourceId = layer_name + "source";
  const layerId = layer_name + "layer";

  if (event.target.checked) {
    RemoveSourceAndLayerFromMap({
      map: map,
      layerId: layerId,
      sourceId: sourceId,
    });

    let fillType = "fill";

    const url = geojson;
    let bbox = [-180, -90, 180, 90];
    if (geojson.features.length > 0) {
      bbox = turf.bbox(geojson);
    }

    AddLayerAndSourceToMap({
      map: map,
      layerId: layerId,
      sourceId: sourceId,
      url: url,
      source_layer: sourceId,
      popUpRef: popUpRef,
      showPopup: true,
      style: {
        fill_color: layer_name === "Main" ? "red" : "yellow",
        fill_opacity: 0.2,
        stroke_color: "black",
      },
      zoomToLayer: geojson.features.length > 0 ? true : false,
      extent: bbox,
      geomType: "geojson",
      fillType: fillType,
      trace: false,
      component: "map",
    });
  } else {
    RemoveSourceAndLayerFromMap({
      map: map,
      layerId: layerId,
      sourceId: sourceId,
    });
  }
};

export default handleLayerChecked;
