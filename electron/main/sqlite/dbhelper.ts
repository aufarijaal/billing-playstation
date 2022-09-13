import { logger } from "../../winston";
import { db } from "./knexfile";

// Init database
db.queryBuilder();

export const getAdmins = () => {
  return new Promise((resolve, reject) => {
    db("admins")
      .select("*")
      .then((rows) => {
        resolve(rows);
        logger.info("Berhasil mengambil data user. banyak data: " + rows.length);
      })
      .catch((err) => {
        reject(err);
        logger.error("Gagal mengambil data user. alasan : " + err.message);
      });
  });
};

export const loginValidation = (nama_admin: string, kata_sandi: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    logger.info("Melakukan validasi login... nama admin: " + nama_admin);
    db("admins")
      .where("nama_admin", nama_admin)
      .andWhere("kata_sandi", kata_sandi)
      .first("hak_akses")
      .then((hak_akses) => {
        if (hak_akses === undefined) {
          reject(new Error("Admin tidak ditemukan."));
          logger.error("Gagal melakukan validasi login. alasan: Admin tidak ditemukan.");
        }
        resolve(hak_akses);
        logger.info("Berhasil melakukan validasi login.");
      })
      .catch((err) => {
        reject(err);
        logger.error("Gagal melakukan validasi login. alasan: " + err.message);
      });
  });
};
