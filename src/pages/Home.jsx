import React, { useEffect } from "react";
import Autocompleteplaces from "../components/Autocompleteplaces";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setCoordinates } from "../reducers/Map";
import {
  setshowToast,
  settoastMessage,
  settoastType,
} from "../reducers/DisplaySettings";

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const place = useSelector((state) => state.map.place);
  const handleContinue = (e) => {
    e.preventDefault();
    console.log(place, "place");
    if (place.description) {
      const address = place.description;
      const apiKey = "AIzaSyDBU5pn5aaEXcYXqpIjFDV7jQsTk2uMyy0";
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${apiKey}`;

      axios
        .get(url)
        .then((response) => {
          const { lat, lng } = response.data.results[0].geometry.location;
          console.log(lat, lng, "lat long");
          dispatch(setCoordinates({ lat, lng }));
          localStorage.setItem("coordinates", JSON.stringify({ lat, lng }));
          //   navigate("/map", { state: { lat, lng } });
          const args = {
            "location.latitude": lat.toFixed(5),
            "location.longitude": lng.toFixed(5),
          };
          console.log("GET buildingInsights\n", args);
          const params = new URLSearchParams({ ...args, key: apiKey });
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
              throw content;
            }
            navigate("/map", { state: { lat, lng, building: content } });
            console.log("buildingInsightsResponse", content);
          });
        })
        .catch((error) => console.error("Geocoding error:", error));
    }
  };

  return (
    <div
      className="bg-cover bg-center h-screen  bg-no-repeat"
      style={{
        backgroundImage: `url('bannerai.png')`,
        backgroundSize: "contain",
      }}
    >
      <form onSubmit={handleContinue} className="flex absolute top-96 right-52">
        <Autocompleteplaces />
        <button
          type="submit"
          className="bg-[#3d3880] hover:bg-[#3d3880] text-white font-bold py-2 px-4 ml-2 rounded-sm"
        >
          Continue
        </button>
      </form>
    </div>
  );
}
