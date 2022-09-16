/* eslint-disable no-unused-labels */
import { contextBridge, ipcRenderer } from "electron";

const minimize = () => ipcRenderer.invoke("window:minimize");
const toggleMaxmimize = () => ipcRenderer.invoke("window:toggle-maximize");
const closeApp = () => ipcRenderer.invoke("window:close-app");

const getAdmins = () => ipcRenderer.invoke("get:admins");
const doLogin = (nama_admin: string, kata_sandi: string) => ipcRenderer.invoke("do:login", nama_admin, kata_sandi);
const doUbahHakAkses = (id: number, hak_akses: "penuh" | "parsial") => ipcRenderer.invoke("do:ubah-hak-akses", id, hak_akses);
const doResetKataSandi = (id: number, kata_sandi_baru: string) => ipcRenderer.invoke("do:reset-kata-sandi", id, kata_sandi_baru);

const API = {
  minimize,
  toggleMaxmimize,
  closeApp,

  getAdmins,
  doLogin,
  doUbahHakAkses,
  doResetKataSandi,
};

contextBridge.exposeInMainWorld("api", API);

export default API;
