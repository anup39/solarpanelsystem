import { useState } from "react";
import Map from "../map/Map";
import { useSelector } from "react-redux";
import Loader from "../components/common/Loader";

const zoom = 20;

export default function MapSection() {
  const [map, setMap] = useState();
  const center = useSelector((state) => state.map.coordinates);

  const onMap = (evMap) => {
    if (evMap) {
      setMap(evMap);
    }
  };
  return (
    <div>
      {center ? <Map center={center} zoom={zoom} onMap={onMap} /> : <Loader />}
    </div>
  );
}
