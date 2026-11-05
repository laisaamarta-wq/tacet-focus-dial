"use client";

import { useSyncExternalStore } from "react";
import Scene from "./Scene";

const subscribe = () => () => {};

/** The 3D scene mounts only in the browser (it needs WebGL and the DOM). */
export function SceneLoader() {
  const client = useSyncExternalStore(subscribe, () => true, () => false);
  return client ? <Scene /> : null;
}
