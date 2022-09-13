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
