/* eslint-disable no-unused-vars */
interface Admin {
  id: number;
  nama_admin: string;
  kata_sandi: string;
  hak_akses: "penuh" | "parsial";
}
interface Playstation {
  versi: number;
  tarif_per_menit: number;
}
