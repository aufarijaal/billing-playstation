/* eslint-disable no-undef */
import { homedir } from "os";
import { join } from "path";
import { knex } from "knex";
import type { Knex } from "knex";
import { logger } from "../../winston";
import { stat } from "fs";
import pkg from "../../../package.json";

export const appDirectory = join(homedir(), pkg.name);

stat(appDirectory, (err) => {
  if (err) logger.error("Folder " + pkg.name + "tidak ditemukan. membuat...");
  else logger.info("Folder " + pkg.name + "ditemukan");
});

const config: Knex.Config = {
  client: "sqlite3",
  connection: {
    filename: join(appDirectory, "storage.db"),
  },
  useNullAsDefault: true,
};

export const db = knex(config);

const defaultPs = (): Playstation[] => {
  const defaults: Playstation[] = [];
  for (let i = 0; i < 7; i++) {
    defaults.push({
      versi: i + 1,
      tarif_per_menit: 0,
    });
  }
  return defaults;
};

db.schema.hasTable("admins").then((exists) => {
  if (!exists) {
    logger.warn("Tabel admins tidak ada. membuat...");
    db.schema
      .createTable("admins", (table) => {
        table.increments();
        table.string("nama_admin").notNullable().unique();
        table.string("kata_sandi").notNullable();
        table.boolean("hak_akses").defaultTo("parsial");
      })
      .then(() => {
        logger.info("Berhasil membuat tabel admins.");
        db("admins")
          .insert([
            {
              nama_admin: "master",
              kata_sandi: "master",
              hak_akses: "penuh",
            },
          ])
          .then(() => logger.info("Berhasil membuat default admins"))
          .catch((err) => logger.error("Gagal membuat default admins. alasan : " + err.message));
      })
      .catch((err) => logger.error("Gagal membuat tabel admins. alasan : " + err.message));
  } else {
    logger.info("Tabel admins sudah dibuat. mengabaikan...");
  }
});

db.schema.hasTable("konfigurasi_ps").then((exists) => {
  if (!exists) {
    logger.warn("Tabel konfigurasi_ps tidak ada. membuat...");
    db.schema
      .createTable("konfigurasi_ps", (table) => {
        table.integer("versi").notNullable().unique();
        table.decimal("tarif_per_menit").notNullable().defaultTo(0);
      })
      .then(() => {
        logger.info("Berhasil membuat tabel konfigurasi_ps.");
        db("konfigurasi_ps")
          .insert(defaultPs())
          .then(() => logger.info("Berhasil membuat default konfigurasi_ps"))
          .catch((err) => logger.error("Gagal membuat default konfigurasi_ps. alasan : " + err.message));
      })
      .catch((err) => logger.error("Gagal membuat tabel konfigurasi_ps. alasan : " + err.message));
  } else {
    logger.info("Tabel konfigurasi_ps sudah dibuat. mengabaikan...");
  }
});

db.schema.hasTable("paket_sewa").then((exists) => {
  if (!exists) {
    logger.warn("Tabel paket_sewa tidak ada. membuat...");
    db.schema
      .createTable("paket_sewa", (table) => {
        table.increments();
        table.string("nama_paket").notNullable();
        table.decimal("harga_12_jam").notNullable().defaultTo(0);
      })
      .then(() => {
        logger.info("Berhasil membuat tabel paket_sewa.");
        // db("paket_sewa")
        //   .insert([{}])
        //   .then(() => logger.info("Berhasil membuat default paket_sewa"))
        //   .catch((err) => logger.error("Gagal membuat default paket_sewa. alasan : " + err.message));
      })
      .catch((err) => logger.error("Gagal membuat tabel paket_sewa. alasan : " + err.message));
  } else {
    logger.info("Tabel paket_sewa sudah dibuat. mengabaikan...");
  }
});

db.schema.hasTable("menu_konsumsi").then((exists) => {
  if (!exists) {
    logger.warn("Tabel menu_konsumsi tidak ada. membuat...");
    db.schema
      .createTable("menu_konsumsi", (table) => {
        table.increments();
        table.string("nama_barang").notNullable();
        table.decimal("harga").notNullable().defaultTo(0);
      })
      .then(() => {
        logger.info("Berhasil membuat tabel menu_konsumsi.");
        // db("menu_konsumsi")
        //   .insert([{}])
        //   .then(() => logger.info("Berhasil membuat default menu_konsumsi"))
        //   .catch((err) => logger.error("Gagal membuat default menu_konsumsi. alasan : " + err.message));
      })
      .catch((err) => logger.error("Gagal membuat tabel menu_konsumsi. alasan : " + err.message));
  } else {
    logger.info("Tabel menu_konsumsi sudah dibuat. mengabaikan...");
  }
});
