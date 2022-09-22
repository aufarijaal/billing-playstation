/* eslint-disable no-unused-labels */
import { contextBridge, ipcRenderer } from "electron";

const minimize = () => ipcRenderer.invoke("window:minimize");
const toggleMaxmimize = () => ipcRenderer.invoke("window:toggle-maximize");
const closeApp = () => ipcRenderer.invoke("window:close-app");

const dbFileSize = () => ipcRenderer.invoke("db:filesize");
const dbDataCount = (tableName: string, columnName: string) => ipcRenderer.invoke("db:row-count", tableName, columnName);

const truncate = (tableName: string) => ipcRenderer.invoke("db:truncate", tableName);

const getAdmins = () => ipcRenderer.invoke("get:admins");
const doLogin = (nama_admin: string, kata_sandi: string) => ipcRenderer.invoke("do:login", nama_admin, kata_sandi);
const doUbahHakAkses = (id: number, hak_akses: "penuh" | "parsial") => ipcRenderer.invoke("do:ubah-hak-akses", id, hak_akses);
const doResetKataSandi = (id: number, kata_sandi_baru: string) => ipcRenderer.invoke("do:reset-kata-sandi", id, kata_sandi_baru);
const doUbahNamaAdmin = (id: number, nama_admin_baru: string) => ipcRenderer.invoke("do:ubah-nama-admin", id, nama_admin_baru);
const insertAdmin = (nama_admin: string, kata_sandi: string, hak_akses: "penuh" | "parsial") => ipcRenderer.invoke("insert:admins", nama_admin, kata_sandi, hak_akses);
const deleteAdmin = (id: number) => ipcRenderer.invoke("delete:admins", id);

const getPlaystation = () => ipcRenderer.invoke("get:playstation");
const insertPlaystation = (versi: number, tarif_per_menit: number) => ipcRenderer.invoke("insert:playstation", versi, tarif_per_menit);
const ubahTarifPlaystation = (versi: number, tarif_per_menit_baru: number) => ipcRenderer.invoke("do:ubah-tarif-playstation", versi, tarif_per_menit_baru);
const deletePlaystation = (versi: number) => ipcRenderer.invoke("delete:playstation", versi);

const getPaketSewa = () => ipcRenderer.invoke("get:paket_sewa");
const insertPaketSewa = (nama_paket: string, harga_12_jam: string) => ipcRenderer.invoke("insert:paket_sewa", nama_paket, harga_12_jam);
const ubahHargaPaketSewa = (id: number, harga_baru: number) => ipcRenderer.invoke("update:harga-paket-sewa", id, harga_baru);
const ubahNamaPaketSewa = (id: number, nama_paket_baru: string) => ipcRenderer.invoke("update:nama-paket-sewa", id, nama_paket_baru);
const deletePaketSewa = (id: number) => ipcRenderer.invoke("delete:paket_sewa", id);

const getMenuKonsumsi = () => ipcRenderer.invoke("get:menu_konsumsi");
const insertMenuKonsumsi = (nama_barang: string, harga: string) => ipcRenderer.invoke("insert:menu_konsumsi", nama_barang, harga);
const ubahHargaMenuKonsumsi = (id: number, harga_baru: number) => ipcRenderer.invoke("update:harga-menu-konsumsi", id, harga_baru);
const ubahNamaMenuKonsumsi = (id: number, nama_barang_baru: string) => ipcRenderer.invoke("update:nama-menu-konsumsi", id, nama_barang_baru);
const deleteMenuKonsumsi = (id: number) => ipcRenderer.invoke("delete:menu_konsumsi", id);

const API = {
  minimize,
  toggleMaxmimize,
  closeApp,

  dbFileSize,
  dbDataCount,

  truncate,

  getAdmins,
  doLogin,
  doUbahHakAkses,
  doResetKataSandi,
  doUbahNamaAdmin,
  insertAdmin,
  deleteAdmin,

  getPlaystation,
  insertPlaystation,
  ubahTarifPlaystation,
  deletePlaystation,

  getPaketSewa,
  insertPaketSewa,
  ubahHargaPaketSewa,
  ubahNamaPaketSewa,
  deletePaketSewa,

  getMenuKonsumsi,
  insertMenuKonsumsi,
  ubahHargaMenuKonsumsi,
  ubahNamaMenuKonsumsi,
  deleteMenuKonsumsi,
};

contextBridge.exposeInMainWorld("api", API);

export default API;
