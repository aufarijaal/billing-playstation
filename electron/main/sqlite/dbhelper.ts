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

export const ubahHakAkses = (id: number, hak_akses: "penuh" | "parsial"): Promise<"penuh" | "parsial"> => {
  return new Promise((resolve, reject) => {
    logger.info("Melakukan perubahan hak akses... id: " + id);
    if (hak_akses !== "penuh" && hak_akses !== "parsial") {
      reject("Hanya menerima nilai 'penuh' atau 'parsial'");
      logger.error("Parameter perubahan hak akses berisi selain 'penuh' atau 'parsial'");
    } else {
      db("admins")
        .where("id", id)
        .update(
          {
            hak_akses,
          },
          "hak_akses",
        )
        .then((hak_akses_sekarang) => {
          if (hak_akses_sekarang[0] === undefined) {
            reject("Admin tidak ditemukan");
            logger.error("Id admin yang dikirimkan kemungkinan tidak ada didatabase.");
          } else {
            resolve(hak_akses_sekarang[0]);
            logger.info("Berhasil merubah hak akses. id: " + id + " diubah ke: " + hak_akses_sekarang);
          }
        })
        .catch((err) => {
          reject(err);
          logger.error("Gagal merubah hak akses. id: " + id + " | alasan: " + err.message);
        });
    }
  });
};

export const resetKataSandi = (id: number, kata_sandi_baru: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    logger.info("Melakukan reset kata sandi... id: " + id);
    db("admins")
      .where("id", id)
      .update(
        {
          kata_sandi: kata_sandi_baru,
        },
        "nama_admin",
      )
      .then((data) => {
        if (data[0] === undefined) {
          reject("Admin tidak ditemukan");
          logger.error("Id admin yang dikirimkan kemungkinan tidak ada didatabase.");
        } else {
          resolve(data[0].nama_admin);
          logger.info("Berhasil melakukan reset kata sandi admin bernama: " + data[0].nama_admin);
        }
      })
      .catch((err) => {
        reject(err);
        logger.error("Gagal melakukan reset kata sandi. alasan: " + err.message);
      });
  });
};

export const ubahNamaAdmin = (id: number, nama_admin_baru: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    logger.info("Melakukan perubaha nama admin... id: " + id);
    db("admins")
      .where("id", id)
      .update(
        {
          nama_admin: nama_admin_baru,
        },
        "nama_admin",
      )
      .then((data) => {
        if (data[0] === undefined) {
          reject("Admin tidak ditemukan");
          logger.error("Id admin yang dikirimkan kemungkinan tidak ada didatabase.");
        } else {
          // kembalikan nama admin yang baru
          resolve(data[0].nama_admin);
          logger.info("Berhasil melakukan perubahan nama admin ke: " + data[0].nama_admin);
        }
      })
      .catch((err) => {
        reject(err);
        logger.error("Gagal melakukan perubahan nama admin. alasan: " + err.message);
      });
  });
};

export const insertAdmin = (nama_admin: string, kata_sandi: string, hak_akses: "penuh" | "parsial"): Promise<string> => {
  return new Promise((resolve, reject) => {
    logger.info("Melakukan penambahan data admin baru... nama admin yang diinputkan: " + nama_admin);
    db("admins")
      .insert(
        {
          nama_admin,
          kata_sandi,
          hak_akses,
        },
        "nama_admin",
      )
      .then((data) => {
        if (data[0].nama_admin === undefined) {
          reject("Gagal menambahkan data admin baru(?)");
          logger.error("Gagal menambahkan data admin baru(?)");
        } else {
          resolve(data[0].nama_admin);
        }
      })
      .catch((err) => {
        reject(err);
        logger.error("Gagal melakukan penambahan data admin baru. alasan: " + err.message);
      });
  });
};

export const deleteAdmin = (id: number): Promise<number> => {
  return new Promise((resolve, reject) => {
    db("admins")
      .where("id", id)
      .del()
      .then((affected_rows: number) => {
        if (affected_rows === 0) {
          resolve(affected_rows);
          logger.error("Gagal melakukan penghapusan data admin. data berubah: " + affected_rows);
        } else {
          resolve(affected_rows);
          logger.info("Berhasil melakukan penghapusan data admin. data berubah: " + affected_rows);
        }
      })
      .catch((err) => {
        reject(err);
        logger.error("Gagal melakukan penghapusan data admin. alasan: " + err.message);
      });
  });
};
