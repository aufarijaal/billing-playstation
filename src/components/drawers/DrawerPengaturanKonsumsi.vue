<!-- eslint-disable no-undef -->
<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useAppStore } from "../../store";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import toRupiah from "@develoka/angka-rupiah-js";

const formPengaturanKonsumsiRef = ref<FormInstance>();
const formPengaturanKonsumsi = reactive<MenuKonsumsi>({
  nama_barang: "",
  harga: 0,
});
const formPengaturanKonsumsiRules = reactive<FormRules>({
  nama_barang: [{ required: true, message: "Nama menu tidak boleh kosong.", trigger: "change" }],
  harga: [{ required: true, message: "Harga tidak boleh kosong / 0", trigger: "blur", type: "number" }],
});
const menuKonsumsiData = reactive<MenuKonsumsi[]>([]);
const store = useAppStore();
const ubahHargaMenuKonsumsiValue = ref(0);
const ubahHargaMenuKonsumsiValueRupiah = computed(() => {
  return toRupiah(ubahHargaMenuKonsumsiValue.value, {});
});
const getDataMenuKonsumsi = () => {
  menuKonsumsiData.length = 0;
  window.api
    .getMenuKonsumsi()
    .then((rows: MenuKonsumsi[]) => {
      rows.forEach((each) => {
        menuKonsumsiData.push(each);
      });
    })
    .then(() => {
      return [];
    });
};
const insertMenuKonsumsi = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      window.api
        .insertMenuKonsumsi(formPengaturanKonsumsi.nama_barang, formPengaturanKonsumsi.harga)
        .then((message: string) => ElMessage.success(message))
        .catch((err: Error) => ElMessage.error(err.message))
        .finally(() => {
          resetForm();
          getDataMenuKonsumsi();
        });
    } else {
      resetForm();
      ElMessage.warning("Isi semua input dengan benar!");
    }
  });
};
const resetForm = () => {
  formPengaturanKonsumsiRef.value?.resetFields();
};
const ubahHargaMenuKonsumsi = (id: number) => {
  if (isNaN(ubahHargaMenuKonsumsiValue.value) || ubahHargaMenuKonsumsiValue.value.toString() === "") {
    ubahHargaMenuKonsumsiValue.value = 0;
    ElMessage.error("Isi input dengan benar");
  } else {
    window.api
      .ubahHargaMenuKonsumsi(id, ubahHargaMenuKonsumsiValue.value)
      .then((message: string) => ElMessage.success(message))
      .catch((err: Error) => ElMessage.error(err.message))
      .finally(() => {
        ubahHargaMenuKonsumsiValue.value = 0;
        getDataMenuKonsumsi();
      });
  }
};
const deleteMenuKonsumsi = (versi: number) => {
  window.api
    .deleteMenuKonsumsi(versi)
    .then((message: string) => ElMessage.success(message))
    .catch((err: Error) => ElMessage.error(err.message))
    .finally(getDataMenuKonsumsi());
};
</script>

<template>
  <el-drawer v-model="store.showDrawerPengaturanKonsumsi" title="Pengaturan Menu Konsumsi" direction="btt" custom-class="drawer-pengaturan-menu-konsumsi-container" size="calc(100vh - 23px)" @open="getDataMenuKonsumsi" @closed="menuKonsumsiData.length = 0">
    <div class="pengaturan-menu-konsumsi-container">
      <el-form label-position="top" class="form-pengaturan-menu-konsumsi" ref="formPengaturanKonsumsiRef" :rules="formPengaturanKonsumsiRules" :model="formPengaturanKonsumsi" hide-required-asterisk>
        <el-form-item prop="nama_barang" label="Nama Barang">
          <el-input v-model="formPengaturanKonsumsi.nama_barang" />
        </el-form-item>
        <el-form-item label="Harga" prop="harga">
          <el-input v-model.number="formPengaturanKonsumsi.harga" />
        </el-form-item>
        <el-form-item>
          <el-button @click="insertMenuKonsumsi(formPengaturanKonsumsiRef)" type="primary">Tambah</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataMenuKonsumsi" type="success">Refresh</el-button>
        </el-form-item>
      </el-form>
      <div class="secondary-text" style="text-align: center; margin-bottom: 20px">
        Input: Nama Barang <span style="color: var(--el-color-warning)">{{ formPengaturanKonsumsi.nama_barang }}</span
        >, Harga <span style="color: var(--el-color-success)">{{ toRupiah(formPengaturanKonsumsi.harga) }}</span>
      </div>
      <el-table border stripe :data="menuKonsumsiData" style="width: 600px; margin: 0 auto 0 auto">
        <el-table-column prop="nama_barang" label="Nama Barang" />
        <el-table-column prop="harga" label="Harga" />
        <el-table-column label="Aksi">
          <template #default="scope">
            <div class="column-aksi-menu-konsumsi">
              <el-popover width="max-content" trigger="click">
                <template #reference>
                  <el-button size="small" type="primary">Ubah Harga</el-button>
                </template>
                <div style="display: flex; flex-direction: column; gap: 5px">
                  <div class="secondary-text">Masukkan harga baru</div>
                  <div class="secondary-text">{{ ubahHargaMenuKonsumsiValueRupiah }}</div>
                  <div style="display: flex; gap: 5px">
                    <el-input style="width: 150px" size="small" v-model.number="ubahHargaMenuKonsumsiValue" />
                    <el-button @click="ubahHargaMenuKonsumsi(scope.row.id)" size="small" type="success">Ubah</el-button>
                  </div>
                </div>
              </el-popover>
              <el-popconfirm @confirm="deleteMenuKonsumsi(scope.row.id)" title="Yakin ingin menghapus ?" width="max-content" confirm-button-text="Ya" cancel-button-text="Batal" confirm-button-type="danger">
                <template #reference>
                  <el-button size="small" type="danger">Hapus</el-button>
                </template>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-drawer>
</template>

<style>
.form-pengaturan-menu-konsumsi {
  display: flex;
  gap: 10px;
  align-items: flex-end;
  justify-content: center;
}
.column-aksi-menu-konsumsi {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  align-items: center;
  justify-content: center;
}
.drawer-pengaturan-menu-konsumsi-container > .el-drawer__body {
  padding-top: 0;
}
.drawer-pengaturan-menu-konsumsi-container > .el-drawer__header {
  padding-bottom: 20px;
  margin-bottom: 10px;
  border-bottom: 1px solid var(--el-fill-color);
}
@media (min-width: 640px) {
}

@media (min-width: 768px) {
}

@media (min-width: 1024px) {
}

@media (min-width: 1280px) {
}

@media (min-width: 1536px) {
}
</style>
