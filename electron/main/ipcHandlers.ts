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
      .then(() => resolve(true))
      .catch((err) => reject(err));
  });
});
