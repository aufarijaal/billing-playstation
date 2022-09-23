/* eslint-disable no-unused-vars */
import { ipcMain } from "electron";
import { stat, writeFile } from "fs";
import { join } from "path";
import { logger } from "../winston";
import * as dbhelper from "./sqlite/dbhelper";
import { appDirectory } from "./sqlite/knexfile";

ipcMain.handle("do:save-settings", (event, stringifiedJson) => {
  logger.info("Menyimpan settings...");
  return new Promise((resolve, reject) => {
    stat(join(appDirectory, "settings.txt"), (err, stats) => {
      logger.warn("File settings tidak ada. sedang membuat...");
      writeFile(join(appDirectory, "settings.txt"), stringifiedJson, (err) => {
        if (err) {
          logger.error("Gagal membuat file settings. alasan: " + err.message);
          reject("Gagal membuat file settings. alasan: " + err.message);
        } else {
          logger.info("Berhasil menyimpan settings.");
        }
      });
    });
  });
});

ipcMain.handle("db:filesize", (event) => {
  return new Promise((resolve, reject) => {
    stat(join(appDirectory, "storage.db"), (err, stats) => {
      if (err) reject(err);
      else {
        resolve(stats.size);
      }
    });
  });
});

ipcMain.handle("db:row-count", (event, tableName, columnName) => {
  return new Promise((resolve, reject) => {
    dbhelper
      .rowCount(tableName, columnName)
      .then((count) => resolve(count))
      .catch((err) => reject(err));
  });
});

ipcMain.handle("db:truncate", (event, tableName: string) => {
  return new Promise((resolve, reject) => {
    dbhelper
      .truncate(tableName)
      .then((message) => resolve(message))
      .catch((err) => reject(err));
  });
});

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

ipcMain.handle("get:playstation", (event) => {
  return new Promise((resolve, reject) => {
    dbhelper
      .getPlaystation()
      .then((rows) => resolve(rows))
      .catch((err) => reject(err));
  });
});

ipcMain.handle("insert:playstation", (event, versi, tarif_per_menit) => {
  return new Promise((resolve, reject) => {
    dbhelper
      .insertPlaystation(versi, tarif_per_menit)
      .then((message) => resolve(message))
      .catch((err) => reject(err));
  });
});

ipcMain.handle("do:ubah-tarif-playstation", (event, versi, tarif_per_menit_baru) => {
  return new Promise((resolve, reject) => {
    dbhelper
      .ubahTarifPlaystation(versi, tarif_per_menit_baru)
      .then((message) => resolve(message))
      .catch((err) => reject(err));
  });
});

ipcMain.handle("delete:playstation", (event, versi) => {
  return new Promise((resolve, reject) => {
    dbhelper
      .deletePlaystation(versi)
      .then((message) => resolve(message))
      .catch((err) => reject(err));
  });
});

ipcMain.handle("insert:paket_sewa", (event, nama_paket, harga_12_jam) => {
  return new Promise((resolve, reject) => {
    dbhelper
      .insertPaketSewa(nama_paket, harga_12_jam)
      .then((message) => resolve(message))
      .catch((err) => reject(err));
  });
});

ipcMain.handle("get:paket_sewa", (event) => {
  return new Promise((resolve, reject) => {
    dbhelper
      .getPaketSewa()
      .then((rows) => resolve(rows))
      .catch((err) => reject(err));
  });
});

ipcMain.handle("update:nama-paket-sewa", (event, id, nama_paket_baru) => {
  return new Promise((resolve, reject) => {
    dbhelper
      .ubahNamaPaketSewa(id, nama_paket_baru)
      .then((message) => resolve(message))
      .catch((err) => reject(err));
  });
});

ipcMain.handle("update:harga-paket-sewa", (event, id, harga_baru) => {
  return new Promise((resolve, reject) => {
    dbhelper
      .ubahHargaPaketSewa(id, harga_baru)
      .then((message) => resolve(message))
      .catch((err) => reject(err));
  });
});

ipcMain.handle("delete:paket_sewa", (event, id) => {
  return new Promise((resolve, reject) => {
    dbhelper
      .deletePaketSewa(id)
      .then((message) => resolve(message))
      .catch((err) => reject(err));
  });
});

ipcMain.handle("insert:menu_konsumsi", (event, nama_barang, harga) => {
  return new Promise((resolve, reject) => {
    dbhelper
      .insertMenuKonsumsi(nama_barang, harga)
      .then((message) => resolve(message))
      .catch((err) => reject(err));
  });
});

ipcMain.handle("get:menu_konsumsi", (event) => {
  return new Promise((resolve, reject) => {
    dbhelper
      .getMenuKonsumsi()
      .then((rows) => resolve(rows))
      .catch((err) => reject(err));
  });
});

ipcMain.handle("update:nama-menu-konsumsi", (event, id, nama_barang_baru) => {
  return new Promise((resolve, reject) => {
    dbhelper
      .ubahNamaMenuKonsumsi(id, nama_barang_baru)
      .then((message) => resolve(message))
      .catch((err) => reject(err));
  });
});

ipcMain.handle("update:harga-menu-konsumsi", (event, id, harga_baru) => {
  return new Promise((resolve, reject) => {
    dbhelper
      .ubahHargaMenuKonsumsi(id, harga_baru)
      .then((message) => resolve(message))
      .catch((err) => reject(err));
  });
});

ipcMain.handle("delete:menu_konsumsi", (event, id) => {
  return new Promise((resolve, reject) => {
    dbhelper
      .deleteMenuKonsumsi(id)
      .then((message) => resolve(message))
      .catch((err) => reject(err));
  });
});
