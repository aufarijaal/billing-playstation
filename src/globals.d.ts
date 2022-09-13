/* eslint-disable no-unused-vars */
import API from "../electron/preload/index";

declare global {
  interface Window {
    api: typeof API;
  }
}
