/* eslint-disable no-unused-labels */
import { contextBridge, ipcRenderer } from "electron";

const minimize = () => ipcRenderer.invoke("window:minimize");
const toggleMaxmimize = () => ipcRenderer.invoke("window:toggle-maximize");
const closeApp = () => ipcRenderer.invoke("window:close-app");

const getAdmins = () => ipcRenderer.invoke("get:admins");
const doLogin = (nama_admin: string, kata_sandi: string) => ipcRenderer.invoke("do:login", nama_admin, kata_sandi);
const doUbahHakAkses = (id: number, hak_akses: "penuh" | "parsial") => ipcRenderer.invoke("do:ubah-hak-akses", id, hak_akses);
const doResetKataSandi = (id: number, kata_sandi_baru: string) => ipcRenderer.invoke("do:reset-kata-sandi", id, kata_sandi_baru);
const ubahNamaAdmin = (id: number, nama_admin_baru: string) => ipcRenderer.invoke("do:ubah-nama-admin", id, nama_admin_baru);
const insertAdmin = (nama_admin: string, kata_sandi: string, hak_akses: "penuh" | "parsial") => ipcRenderer.invoke("insert:admins", nama_admin, kata_sandi, hak_akses);
const deleteAdmin = (id: number) => ipcRenderer.invoke("delete:admins", id);

const API = {
  minimize,
  toggleMaxmimize,
  closeApp,

  getAdmins,
  doLogin,
  doUbahHakAkses,
  doResetKataSandi,
  ubahNamaAdmin,
  insertAdmin,
  deleteAdmin,
};

contextBridge.exposeInMainWorld("api", API);

export default API;
