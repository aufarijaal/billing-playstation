import { logger } from "../../winston";
import { db } from "./knexfile";

// Init database
db.queryBuilder();

export const truncate = (tableName: string) => {
  logger.info("Melakukan reset pada tabel " + tableName);
  return new Promise((resolve, reject) => {
    db(tableName)
      .truncate()
      .then(() => {
        resolve("Berhasil mereset / menghapus semua data.");
        logger.info("Berhasil mereset semua data pada tabel " + tableName);
      })
      .catch((err) => {
        reject("Gagal mereset / menghapus semua data. alasan: " + err.message);
        logger.info(`Gagal mereset / menghapus semua data pada tabel ${tableName}. alasan: ${err.message}`);
      });
  });
};

export const rowCount = (tableName: string, columnName: string) => {
  logger.info("Mengambil jumlah data pada database...");
  return new Promise((resolve, reject) => {
    db(tableName)
      .count(columnName)
      .then((counts) => {
        logger.info(`Berhasil mengambil jumlah data pada tabel ${tableName}, jumlah data ${counts}`);
        resolve(counts);
      })
      .catch((err) => {
        logger.error(`Gagal mengambil jumlah data pada tabel ${tableName}. alasan: ${err.message}`);
        reject(`Gagal mengambil jumlah data pada tabel ${tableName}. alasan: ${err.message}`);
      });
  });
};

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
  logger.info("Melakukan penghapusan data admin...");
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

export const getPlaystation = () => {
  logger.info("Mengambil data Playstation...");
  return new Promise((resolve, reject) => {
    db("konfigurasi_ps")
      .select()
      .orderBy("versi")
      .then((rows) => {
        resolve(rows);
        logger.info("Berhasil mengambil data Playstation. banyak data: " + rows.length);
      })
      .catch((err) => {
        reject("Gagal mengambil data Playstation. Alasan: " + err.message);
        logger.error("Gagal mengambil data Playstation. Alasan: " + err.message);
      });
  });
};

export const insertPlaystation = (versi: number, tarif_per_menit: number) => {
  logger.info("Melakukan penambahan data playstation baru...");
  return new Promise((resolve, reject) => {
    db("konfigurasi_ps")
      .insert(
        {
          versi,
          tarif_per_menit,
        },
        "versi",
      )
      .then((versi) => {
        resolve("Berhasil melakukan penambahan data playstation baru. versi: " + versi);
        logger.info("Berhasil melakukan penambahan data playstation baru. versi: " + versi);
      })
      .catch((err) => {
        reject("Gagal menambahkan data playstation baru. alasan: " + err.message);
        logger.error("Gagal menambahkan data playstation baru. alasan: " + err.message);
      });
  });
};

export const ubahTarifPlaystation = (versi: number, tarif_per_menit_baru: number) => {
  logger.info("Melakukan perubahan tarif Playstation...");
  return new Promise((resolve, reject) => {
    db("konfigurasi_ps")
      .where("versi", versi)
      .update(
        {
          tarif_per_menit: tarif_per_menit_baru,
        },
        "versi",
      )
      .then((versi) => {
        resolve("Berhasil merubah tarif PS versi: " + versi);
        logger.info("Berhasil merubah tarif PS versi: " + versi);
      })
      .catch((err) => {
        reject(`Gagal merubah tarif PS versi: ${versi}. Alasan: ${err.message}`);
        logger.error(`Gagal merubah tarif PS versi: ${versi}. Alasan: ${err.message}`);
      });
  });
};
export const deletePlaystation = (versi: number) => {
  logger.info("Melakukan penghapusan data Playstation...");
  return new Promise((resolve, reject) => {
    db("konfigurasi_ps")
      .where("versi", versi)
      .del()
      .then(() => {
        logger.info("Berhasil menghapus data Playstation.");
        resolve("Berhasil menghapus data Playstation.");
      })
      .catch((err) => {
        reject("Gagal menghapus data Playstation. Alasan: " + err.message);
        logger.error("Gagal menghapus data Playstation. Alasan: " + err.message);
      });
  });
};

export const insertPaketSewa = (nama_paket: string, harga_12_jam: number) => {
  logger.info("Melakukan penambahan data paket sewa...");
  return new Promise((resolve, reject) => {
    db("paket_sewa")
      .insert(
        {
          nama_paket,
          harga_12_jam,
        },
        "nama_paket",
      )
      .then((nama_paket) => {
        logger.info("Berhasil menambahkan data paket sewa baru. nama paket: " + nama_paket);
        resolve("Berhasil menambahkan data paket sewa baru. nama paket: " + nama_paket);
      })
      .catch((err) => {
        logger.error("Gagal menambahkan data paket sewa baru. alasan: " + err.message);
        reject("Gagal menambahkan data paket sewa baru. alasan: " + err.message);
      });
  });
};

export const getPaketSewa = () => {
  logger.info("Mengambil data paket sewa...");
  return new Promise((resolve, reject) => {
    db("paket_sewa")
      .select()
      .then((rows) => {
        logger.info("Berhasil mengambil data paket sewa. banyak data: " + rows.length);
        resolve(rows);
      })
      .catch((err) => {
        logger.error("Gagal mengambil data paket sewa. alasan: " + err.mesage);
        reject("Gagal mengambil data paket sewa. alasan: " + err.mesage);
      });
  });
};

export const ubahNamaPaketSewa = (id: number, nama_paket: string) => {
  logger.info("Mengubah nama paket sewa...");
  return new Promise((resolve, reject) => {
    db("paket_sewa")
      .where("id", id)
      .update(
        {
          nama_paket,
        },
        "nama_paket",
      )
      .then(() => {
        logger.info("Berhasil mengubah nama paket sewa");
        resolve("Berhasil mengubah nama paket sewa");
      })
      .catch((err) => {
        logger.error("Gagal mengubah nama paket sewa. alasan: " + err.message);
        reject("Gagal mengubah nama paket sewa. alasan: " + err.message);
      });
  });
};

export const ubahHargaPaketSewa = (id: number, harga_12_jam?: number) => {
  logger.info("Mengubah harga paket sewa...");
  return new Promise((resolve, reject) => {
    db("paket_sewa")
      .where("id", id)
      .update(
        {
          harga_12_jam,
        },
        "nama_paket",
      )
      .then((nama_paket) => {
        logger.info("Berhasil mengubah harga paket sewa");
        resolve("Berhasil mengubah harga paket sewa");
      })
      .catch((err) => {
        logger.error("Gagal mengubah harga paket sewa. alasan: " + err.message);
        reject("Gagal mengubah harga paket sewa. alasan: " + err.message);
      });
  });
};

export const deletePaketSewa = (id: number) => {
  logger.info("Melakukan penghapusan data paket sewa");
  return new Promise((resolve, reject) => {
    db("paket_sewa")
      .where("id", id)
      .del()
      .then((affected_rows) => {
        logger.info("Berhasil menghapus data paket sewa. data terhapus: " + affected_rows);
        resolve("Berhasil menghapus data paket sewa. data terhapus: " + affected_rows);
      })
      .catch((err) => {
        logger.error("Gagal menghapus data paket sewa. alasan: " + err.message);
        reject("Gagal menghapus data paket sewa. alasan: " + err.message);
      });
  });
};

export const insertMenuKonsumsi = (nama_barang: string, harga: number) => {
  logger.info("Melakukan penambahan data menu konsumsi...");
  return new Promise((resolve, reject) => {
    db("menu_konsumsi")
      .insert(
        {
          nama_barang,
          harga,
        },
        "nama_barang",
      )
      .then((nama_barang) => {
        logger.info("Berhasil menambahkan data menu konsumsi baru. nama paket: " + nama_barang);
        resolve("Berhasil menambahkan data menu konsumsi baru. nama paket: " + nama_barang);
      })
      .catch((err) => {
        logger.error("Gagal menambahkan data menu konsumsi baru. alasan: " + err.message);
        reject("Gagal menambahkan data menu konsumsi baru. alasan: " + err.message);
      });
  });
};

export const getMenuKonsumsi = () => {
  logger.info("Mengambil data menu konsumsi...");
  return new Promise((resolve, reject) => {
    db("menu_konsumsi")
      .select()
      .then((rows) => {
        logger.info("Berhasil mengambil data menu konsumsi. banyak data: " + rows.length);
        resolve(rows);
      })
      .catch((err) => {
        logger.error("Gagal mengambil data menu konsumsi. alasan: " + err.mesage);
        reject("Gagal mengambil data menu konsumsi. alasan: " + err.mesage);
      });
  });
};

export const ubahNamaMenuKonsumsi = (id: number, nama_barang: string) => {
  logger.info("Mengubah nama menu konsumsi...");
  return new Promise((resolve, reject) => {
    db("menu_konsumsi")
      .where("id", id)
      .update(
        {
          nama_barang,
        },
        "nama_barang",
      )
      .then(() => {
        logger.info("Berhasil mengubah nama menu konsumsi");
        resolve("Berhasil mengubah nama menu konsumsi");
      })
      .catch((err) => {
        logger.error("Gagal mengubah nama menu konsumsi. alasan: " + err.message);
        reject("Gagal mengubah nama menu konsumsi. alasan: " + err.message);
      });
  });
};

export const ubahHargaMenuKonsumsi = (id: number, harga: number) => {
  logger.info("Mengubah harga menu konsumsi...");
  return new Promise((resolve, reject) => {
    db("menu_konsumsi")
      .where("id", id)
      .update(
        {
          harga,
        },
        "nama_barang",
      )
      .then((nama_barang) => {
        logger.info("Berhasil mengubah harga menu konsumsi");
        resolve("Berhasil mengubah harga menu konsumsi");
      })
      .catch((err) => {
        logger.error("Gagal mengubah harga menu konsumsi. alasan: " + err.message);
        reject("Gagal mengubah harga menu konsumsi. alasan: " + err.message);
      });
  });
};

export const deleteMenuKonsumsi = (id: number) => {
  logger.info("Melakukan penghapusan data menu konsumsi");
  return new Promise((resolve, reject) => {
    db("menu_konsumsi")
      .where("id", id)
      .del()
      .then((affected_rows) => {
        logger.info("Berhasil menghapus data menu konsumsi. data terhapus: " + affected_rows);
        resolve("Berhasil menghapus data menu konsumsi. data terhapus: " + affected_rows);
      })
      .catch((err) => {
        logger.error("Gagal menghapus data menu konsumsi. alasan: " + err.message);
        reject("Gagal menghapus data menu konsumsi. alasan: " + err.message);
      });
  });
};
