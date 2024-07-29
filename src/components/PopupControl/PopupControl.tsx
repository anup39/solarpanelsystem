import React from "react";
import ReactDOM, { Root } from "react-dom/client";
import { store } from "../../store";
import { Provider } from "react-redux";
import Popup from "./Popup";
import { Map } from "maplibre-gl";

export default class PopupControl {
  // @ts-ignore
  private _map: Map | undefined;
  private _container: HTMLDivElement | null = null;
  private _properties!: {
    [key: string]: string | number;
    id: number;
  };
  private _root: Root | undefined;

  onAdd(map: Map) {
    this._map = map;
    this._container = document.createElement("div");
    this._container.className = "maplibregl-ctrl maplibregl-ctrl-group";
    this._root = ReactDOM.createRoot(this._container);
    this._root.render(
      <Provider store={store}>
        <Popup properties={this._properties} />
      </Provider>
    );

    return this._container;
  }

  updatePopup(
    properties: {
      [key: string]: string | number;
      id: number;
    },
    trace: boolean
  ) {
    this._properties = properties;

    if (this._root) {
      const updatedPopup = (
        <Provider store={store}>
          <Popup properties={this._properties} />
        </Provider>
      );
      this._root.render(updatedPopup);
    }
  }
  onRemove() {
    if (this._container && this._container.parentNode) {
      this._container.parentNode.removeChild(this._container);
    }
    this._map = undefined;
  }
}
