/* eslint-disable no-unused-vars */
import { ipcMain } from "electron";
import * as dbhelper from "./sqlite/dbhelper";

ipcMain.handle("get:admins", (event, args) => {
  return new Promise((resolve, reject) => {
    dbhelper
      .getAdmins()
      .then((data) => {
        resolve(data);
      })
      .catch((err) => reject(err));
  });
});

ipcMain.handle("do:login", (event, nama_admin: string, kata_sandi: string) => {
  return new Promise((resolve, reject) => {
    dbhelper
      .loginValidation(nama_admin, kata_sandi)
      .then((hak_akses) => resolve(hak_akses))
      .catch((err) => reject(err));
  });
});

ipcMain.handle("do:ubah-hak-akses", (event, id, hak_akses) => {
  return new Promise((resolve, reject) => {
    dbhelper
      .ubahHakAkses(id, hak_akses)
      .then((hak_akses_sekarang) => resolve(hak_akses_sekarang))
      .catch((err) => reject(err));
  });
});

ipcMain.handle("do:reset-kata-sandi", (event, id, kata_sandi_baru) => {
  return new Promise((resolve, reject) => {
    dbhelper
      .resetKataSandi(id, kata_sandi_baru)
      .then((nama_admin) => resolve(nama_admin))
      .catch((err) => reject(err));
  });
});
ipcMain.handle("do:ubah-nama-admin", (event, id, nama_admin_baru) => {
  return new Promise((resolve, reject) => {
    dbhelper
      .ubahNamaAdmin(id, nama_admin_baru)
      .then((nama_admin) => resolve(nama_admin))
      .catch((err) => reject(err));
  });
});
ipcMain.handle("insert:admins", (event, nama_admin, kata_sandi, hak_akses) => {
  return new Promise((resolve, reject) => {
    dbhelper
      .insertAdmin(nama_admin, kata_sandi, hak_akses)
      .then((nama_admin) => resolve(nama_admin))
      .catch((err) => reject(err));
  });
});
ipcMain.handle("delete:admins", (event, id) => {
  return new Promise((resolve, reject) => {
    dbhelper
      .deleteAdmin(id)
      .then((nama_admin) => resolve(nama_admin))
      .catch((err) => reject(err));
  });
});
