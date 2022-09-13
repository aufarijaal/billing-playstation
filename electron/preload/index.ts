/* eslint-disable no-unused-labels */
import { contextBridge, ipcRenderer } from "electron";

const minimize = () => ipcRenderer.invoke("window:minimize");
const toggleMaxmimize = () => ipcRenderer.invoke("window:toggle-maximize");
const closeApp = () => ipcRenderer.invoke("window:close-app");

const getAdmins = () => ipcRenderer.invoke("get:admins");
const doLogin = (nama_admin: string, kata_sandi: string) => ipcRenderer.invoke("do:login", nama_admin, kata_sandi);

const API = {
  minimize,
  toggleMaxmimize,
  closeApp,

  getAdmins,
  doLogin,
};

contextBridge.exposeInMainWorld("api", API);

export default API;
