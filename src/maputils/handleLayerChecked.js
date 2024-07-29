import RemoveSourceAndLayerFromMap from "./RemoveSourceAndLayerFromMap";
import AddLayerAndSourceToMap from "./AddLayerAndSourceToMap";

// Here the editting part is done in the most of the section in the current development:

const handleLayerChecked = async (event, layer_name, map, popUpRef) => {
  console.log(layer_name, "layer_name");
  const sourceId = layer_name + "source";
  const layerId = layer_name + "layer";

  if (event.target.checked) {
    RemoveSourceAndLayerFromMap({
      map: map,
      layerId: layerId,
      sourceId: sourceId,
    });

    let fillType = "fill";

    const url = "geojson";
    AddLayerAndSourceToMap({
      map: map,
      layerId: layerId,
      sourceId: sourceId,
      url: url,
      source_layer: sourceId,
      popUpRef: popUpRef,
      showPopup: true,
      style: {
        fill_color: "red",
        fill_opacity: 0.5,
        stroke_color: "black",
      },
      zoomToLayer: false,
      extent: [],
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
