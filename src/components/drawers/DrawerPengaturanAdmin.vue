<script setup lang="ts">
import { useAppStore } from "../../store";
import type { FormInstance, FormRules } from "element-plus";
import { ref, reactive } from "vue";

const store = useAppStore();
// eslint-disable-next-line no-undef
const form = reactive<Omit<Admin, "id">>({
  nama_admin: "",
  kata_sandi: "",
  hak_akses: "parsial",
});
// eslint-disable-next-line no-undef
const tableData: Omit<Admin, "id" | "kata_sandi">[] = [
  {
    nama_admin: "master",
    hak_akses: "penuh",
  },
  {
    nama_admin: "coro",
    hak_akses: "parsial",
  },
  {
    nama_admin: "master",
    hak_akses: "penuh",
  },
  {
    nama_admin: "coro",
    hak_akses: "parsial",
  },
  {
    nama_admin: "master",
    hak_akses: "penuh",
  },
  {
    nama_admin: "coro",
    hak_akses: "parsial",
  },
  {
    nama_admin: "master",
    hak_akses: "penuh",
  },
  {
    nama_admin: "coro",
    hak_akses: "parsial",
  },
  {
    nama_admin: "master",
    hak_akses: "penuh",
  },
  {
    nama_admin: "coro",
    hak_akses: "parsial",
  },
  {
    nama_admin: "master",
    hak_akses: "penuh",
  },
  {
    nama_admin: "coro",
    hak_akses: "parsial",
  },
];
const formRef = ref<FormInstance>();
const cekDuplikatNamaAdmin = (rule: any, value: string, callback: CallableFunction) => {
  // if (!value) {
  //   return callback(new Error('Please input the age'))
  // }
  // setTimeout(() => {
  //   if (!Number.isInteger(value)) {
  //     callback(new Error('Please input digits'))
  //   } else {
  //     if (value < 18) {
  //       callback(new Error('Age must be greater than 18'))
  //     } else {
  //       callback()
  //     }
  //   }
  // }, 1000)
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
</script>

<template>
  <el-drawer v-model="store.showDrawerPengaturanAdmin" title="Pengaturan Admin" direction="btt" custom-class="drawer-container" size="calc(100vh - 23px)">
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
          <el-button type="primary" plain>Tambah</el-button>
          <el-button type="success" plain>Refresh</el-button>
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
              <el-button plain type="warning" @click="doUbahHakAkses(scope.$index, scope.row)">
                <el-icon>
                  <Star />
                </el-icon>
              </el-button>
              <el-button plain type="primary" @click="doUbahNamaAdmin(scope.$index, scope.row)">
                <el-icon>
                  <Edit />
                </el-icon>
              </el-button>
              <el-button plain type="success" @click="doResetKataSandi(scope.$index, scope.row)">
                <el-icon>
                  <Unlock />
                </el-icon>
              </el-button>
              <el-button plain type="danger" @click="doHapusAdmin(scope.$index, scope.row)">
                <el-icon>
                  <Delete />
                </el-icon>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </el-drawer>
</template>

<style>
.drawer-container > .el-drawer__body {
  padding: 5px;
}
.drawer-container > .el-drawer__header {
  margin-bottom: 20px;
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
  border-top: 1px solid var(--el-fill-color);
  padding-top: 10px;
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
