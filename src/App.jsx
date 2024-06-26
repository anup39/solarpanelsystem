import Routers from "./routes/Routers";
import Toast from "./components/common/Toast";
import { useState } from "react";

function App() {
  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [loaded, setLoaded] = useState(true);

  const onMap = (evMap) => {
    if (evMap) {
      setMap(evMap);
    }
  };

  const onLoaded = (evLoaded) => {
    setLoaded(evLoaded);
  };
  return (
    <>
      <Toast />
      <Routers loaded={loaded} map={map} onLoaded={onLoaded} onMap={onMap} />
    </>
  );
}

export default App;
