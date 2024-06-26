import React from "react";
import Autocompleteplaces from "../components/Autocompleteplaces";

export default function Home() {
  return (
    <div
      className="bg-cover bg-center h-screen flex justify-center items-center"
      style={{ backgroundImage: `url('vite.svg')` }}
    >
      <form className="flex">
        <Autocompleteplaces />
        <button className="bg-[#3d3880] hover:bg-[#3d3880] text-white font-bold py-2 px-4 ml-2 rounded-sm">
          Continue
        </button>
      </form>
    </div>
  );
}
