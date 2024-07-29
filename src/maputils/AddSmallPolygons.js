import * as turf from "@turf/turf";

const createSmallPolygons = ({ map, mainPolygon, width, height }) => {
  print("test");
  // Calculate the bounding box of the main polygon
  const bbox = turf.bbox(mainPolygon);
  print("bbox", bbox);

  // Generate grid points within the bounding box
  const grid = turf.pointGrid(bbox, width, { units: "meters" });

  print(grid, "gird");

  const smallPolygons = [];

  grid.features.forEach((point) => {
    const [lng, lat] = point.geometry.coordinates;

    // Create a small polygon of the specified width and height
    const smallPolygon = turf.polygon([
      [
        [lng, lat],
        [lng + width, lat],
        [lng + width, lat + height],
        [lng, lat + height],
        [lng, lat],
      ],
    ]);

    // Check if the small polygon fits inside the main polygon
    if (turf.booleanContains(mainPolygon, smallPolygon)) {
      smallPolygons.push(smallPolygon);
    }
  });

  console.log(smallPolygons, "smallPolygons");

  // Add the small polygons to the map
  map.addSource("small-polygons", {
    type: "geojson",
    data: turf.featureCollection(smallPolygons),
  });

  map.addLayer({
    id: "small-polygons-layer",
    type: "fill",
    source: "small-polygons",
    paint: {
      "fill-color": "#888888",
      "fill-opacity": 0.5,
    },
  });
};

export default createSmallPolygons;
