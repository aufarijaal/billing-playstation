import { logger } from "../../winston";
import { db } from "./knexfile";

// Init database
db.queryBuilder();

export const getAdmins = () => {
  return new Promise((resolve, reject) => {
    db("admins")
      .select("*")
      .then((rows) => {
        logger.info("Berhasil mengambil data user. banyak data: " + rows.length);
        resolve(rows);
      })
      .catch((err) => {
        logger.error("Gagal mengambil data user. alasan : " + err.message);
        reject(err);
      });
  });
};

export const loginValidation = (nama_admin: string, kata_sandi: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    logger.info("Melakukan validasi login... nama admin: " + nama_admin);
    db("admins")
      .select("hak_akses")
      .where("nama_admin", nama_admin)
      .where("kata_sandi", kata_sandi)
      .first()
      .then((response) => {
        resolve(response);
        logger.info("Berhasil melakukan validasi");
      })
      .catch((err) => {
        reject(err);
        logger.error("Gagal memvalidasi login. alasan: " + err.message);
      });
  });
};
