<!-- eslint-disable no-undef -->
<script setup lang="ts">
import { useAppStore } from "../../store";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { ref, reactive } from "vue";

const store = useAppStore();
const form = reactive<Omit<Admin, "id">>({
  nama_admin: "",
  kata_sandi: "",
  hak_akses: "parsial",
});
const tableData = reactive<Admin[]>([]);
const getTableData = () => {
  tableData.length = 0;
  window.api
    .getAdmins()
    .then((datas: Admin[]) => {
      datas.forEach((each) => tableData.push(each));
    })
    .catch((err: Error) => {
      return [];
    });
};
const formRef = ref<FormInstance>();
const cekDuplikatNamaAdmin = (rule: any, value: string, callback: CallableFunction) => {
  if (tableData.some((each) => each.nama_admin === value)) {
    callback(new Error("Nama admin itu sudah ada."));
  } else {
    callback();
  }
};
const rules = reactive<FormRules>({
  nama_admin: [
    { required: true, message: "Nama admin tidak boleh kosong.", trigger: "blur" },
    { validator: cekDuplikatNamaAdmin, message: "Nama admin itu sudah ada.", trigger: "blur" },
  ],
  kata_sandi: [{ required: true, message: "Kata sandi tidak boleh kosong.", trigger: "blur" }],
  hak_akses: [{ required: true, message: "Pilih antara Parsial atau Penuh", trigger: "change" }],
});

const resetForm = () => {
  formRef.value?.resetFields();
};

const resetKataSandiValue = ref("");
const ubahNamaAdminValue = ref("");
const insertAdmin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      window.api
        .insertAdmin(form.nama_admin, form.kata_sandi, form.hak_akses)
        .then((nama_admin: string) => ElMessage.success(`Berhasil menambahkan data admin baru bernama: ${nama_admin}`))
        .catch((err: Error) => ElMessage.error("Gagal menambahkan data admin baru. alasan: " + err.message))
        .finally(() => {
          resetForm();
          getTableData();
        });
    } else {
      ElMessage.warning("Isi semua input dengan benar!");
    }
  });
};

const doResetKataSandi = (id: number) => {
  if (resetKataSandiValue.value === "") ElMessage.error("Kata sandi baru tidak boleh kosong!");
  else {
    window.api
      .doResetKataSandi(id, resetKataSandiValue.value)
      .then((nama_admin: string) => {
        ElMessage.success("Berhasil mereset kata sandi dari " + nama_admin);
      })
      .catch((err: Error) => {
        ElMessage.error("Gagal mereset kata sandi. alasan: " + err.message);
      });
  }
};
const doUbahHakAkses = (id: number, hak_akses: "parsial" | "penuh") => {
  if (id === 1) {
    ElMessage.warning("Admin ini tidak boleh diubah hak aksesnya.");
    return;
  } else {
    window.api
      .doUbahHakAkses(id, hak_akses === "penuh" ? "parsial" : "penuh")
      .then((data: any) => {
        ElMessage.success("Berhasil merubah hak akses ke " + data.hak_akses);
      })
      .catch((err: Error) => {
        ElMessage.error("Gagal merubah hak akses. alasan: " + err.message);
      })
      .finally(getTableData());
  }
};
const doUbahNamaAdmin = (id: number) => {
  if (ubahNamaAdminValue.value === "") {
    ElMessage.error("Nama admin baru tidak boleh kosong");
  } else if (tableData.some((each) => each.nama_admin === ubahNamaAdminValue.value)) {
    ElMessage.error(`Nama admin ${ubahNamaAdminValue.value} sudah ada!`);
  } else {
    window.api
      .doUbahNamaAdmin(id, ubahNamaAdminValue.value)
      .then((nama_admin_baru: any) => ElMessage.success(`Berhasil mengubah nama admin menjadi ${nama_admin_baru}`))
      .catch((err: Error) => ElMessage.error(err.message))
      .finally(getTableData());
  }
};
const doHapusAdmin = (id: number) => {
  if (id === 1) {
    ElMessage.warning("Admin ini tidak boleh dihapus");
  } else {
    window.api
      .deleteAdmin(id)
      .then((response: any) => ElMessage.success("Berhasil menghapus data admin."))
      .catch((err: Error) => ElMessage.error(err.message))
      .finally(getTableData());
  }
};
</script>

<template>
  <el-drawer v-model="store.showDrawerPengaturanAdmin" title="Pengaturan Admin" direction="btt" custom-class="drawer-pengaturan-admin-container" size="calc(100vh - 23px)" @opened="getTableData" @close="tableData.length = 0">
    <div class="pengaturan-admin-container">
      <div class="form-container">
        <el-form inline label-position="top" :model="form" :rules="rules" ref="formRef" hide-required-asterisk>
          <el-form-item label="Nama admin" prop="nama_admin">
            <el-input v-model="form.nama_admin" />
          </el-form-item>
          <el-form-item label="Kata sandi" prop="kata_sandi">
            <el-input type="password" show-password v-model="form.kata_sandi" />
          </el-form-item>
          <el-form-item label="Hak akses" prop="hak_akses">
            <el-radio-group v-model="form.hak_akses" style="margin: 0 auto 0 auto">
              <el-radio-button label="parsial">Parsial</el-radio-button>
              <el-radio-button label="penuh">Penuh</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div>
          <el-button type="primary" plain @click="insertAdmin(formRef)">Tambah</el-button>
          <el-button @click="getTableData" type="success" plain>Refresh</el-button>
        </div>
      </div>
      <div class="table-admin-container">
        <div class="petunjuk-tabel-admin">
          <div class="secondary-text">Petunjuk:</div>
          <div class="petunjuk-tabel-admin-item">
            <el-icon color="var(--el-color-warning)">
              <Star />
            </el-icon>
            <div class="secondary-text">Ubah Hak akses,</div>
          </div>
          <div class="petunjuk-tabel-admin-item">
            <el-icon color="var(--el-color-primary)">
              <Edit />
            </el-icon>
            <div class="secondary-text">Ubah Nama admin,</div>
          </div>
          <div class="petunjuk-tabel-admin-item">
            <el-icon color="var(--el-color-success)">
              <Unlock />
            </el-icon>
            <div class="secondary-text">Reset kata sandi,</div>
          </div>
          <div class="petunjuk-tabel-admin-item">
            <el-icon color="var(--el-color-danger)">
              <Delete />
            </el-icon>
            <div class="secondary-text">Hapus data</div>
          </div>
        </div>
        <el-table stripe :data="tableData" border>
          <el-table-column prop="nama_admin" label="Nama admin" />
          <el-table-column prop="hak_akses" label="Hak Akses" />
          <el-table-column label="Aksi" class-name="table-column-aksi">
            <template #default="scope">
              <el-popconfirm confirm-button-text="Ya" cancel-button-text="Batal" :title="`Yakin ingin mengubah hak akses ${scope.row.nama_admin} ke ${scope.row.hak_akses === 'parsial' ? 'penuh' : 'parsial'} ?`" @confirm="doUbahHakAkses(scope.row.id, scope.row.hak_akses)" width="max-content">
                <template #reference>
                  <el-button plain type="warning" :disabled="scope.row.id === 1">
                    <el-icon>
                      <Star v-if="scope.row.hak_akses === 'parsial'" />
                      <StarFilled v-else />
                    </el-icon>
                  </el-button>
                </template>
              </el-popconfirm>

              <el-popover placement="top" width="max-content" trigger="click" @hide="ubahNamaAdminValue = ''">
                <template #reference>
                  <el-button plain type="primary">
                    <el-icon>
                      <Edit />
                    </el-icon>
                  </el-button>
                </template>
                <div class="ubah-nama-admin-popover-content">
                  <div class="secondary-text">Masukkan nama baru untuk {{ scope.row.nama_admin }}</div>
                  <div style="margin-top: 5px">
                    <el-input size="small" v-model="ubahNamaAdminValue" style="width: 150px; margin-right: 5px" />
                    <el-button size="small" plain type="success" @click="doUbahNamaAdmin(scope.row.id)">Ubah</el-button>
                  </div>
                </div>
              </el-popover>

              <el-popover placement="top" width="max-content" trigger="click" @hide="resetKataSandiValue = ''">
                <template #reference>
                  <el-button plain type="success">
                    <el-icon>
                      <Unlock />
                    </el-icon>
                  </el-button>
                </template>
                <div class="reset-kata-sandi-popover-content">
                  <div class="secondary-text">Masukkan kata sandi baru untuk {{ scope.row.nama_admin }}</div>
                  <div style="margin-top: 5px">
                    <el-input show-password type="password" size="small" v-model="resetKataSandiValue" style="width: 150px; margin-right: 5px" />
                    <el-button size="small" plain type="success" @click="doResetKataSandi(scope.row.id)">Reset</el-button>
                  </div>
                </div>
              </el-popover>

              <el-popconfirm confirm-button-text="Ya" cancel-button-text="Batal" :title="`Yakin ingin menghapus admin bernama ${scope.row.nama_admin} ?`" @confirm="doHapusAdmin(scope.row.id)" width="max-content" confirm-button-type="danger">
                <template #reference>
                  <el-button plain type="danger" :disabled="scope.row.id === 1">
                    <el-icon>
                      <Delete />
                    </el-icon>
                  </el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </el-drawer>
</template>

<style>
.drawer-pengaturan-admin-container > .el-drawer__body {
  padding: 5px;
}
.drawer-pengaturan-admin-container > .el-drawer__header {
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--el-fill-color);
}
.secondary-text {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}
.petunjuk-tabel-admin {
  margin: 0 auto 20px auto;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  justify-content: center;
}
.petunjuk-tabel-admin-item {
  display: flex;
  gap: 5px;
  width: max-content;
}
.table-column-aksi > .cell {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 5px;
}
.table-column-aksi > .cell > .el-button {
  margin-left: 0;
}
.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.form-container > .el-form {
  flex-direction: column;
}
.table-admin-container {
  width: 100%;
  max-width: 900px;
  margin: 20px 0 0 0;
}
.pengaturan-admin-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
@media (min-width: 640px) {
}

@media (min-width: 768px) {
}

@media (min-width: 1024px) {
  .form-container {
    flex-direction: row;
    justify-content: center;
  }
  .table-admin-container {
    margin-top: 0;
  }
  .petunjuk-tabel-admin {
    margin-top: 10px;
  }
  .form-container > .el-form {
    flex-direction: row;
  }
}

@media (min-width: 1280px) {
}

@media (min-width: 1536px) {
}
</style>
