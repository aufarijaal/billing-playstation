<!-- eslint-disable no-undef -->
<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useAppStore } from "../../store";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import toRupiah from "@develoka/angka-rupiah-js";

const formPengaturanKonsumsiRef = ref<FormInstance>();
const formPengaturanKonsumsi = reactive<PaketSewa>({
  nama_paket: "",
  harga_12_jam: 0,
});
const formPengaturanKonsumsiRules = reactive<FormRules>({
  nama_paket: [{ required: true, message: "Nama paket tidak boleh kosong.", trigger: "change" }],
  harga_12_jam: [{ required: true, message: "Harga tidak boleh kosong / 0", trigger: "blur", type: "number" }],
});
const paketSewaData = reactive<PaketSewa[]>([]);
const store = useAppStore();
const ubahHargaPaketSewaValue = ref(0);
const ubahHargaPaketSewaValueRupiah = computed(() => {
  return toRupiah(ubahHargaPaketSewaValue.value, {});
});
const getDataPaketSewa = () => {
  paketSewaData.length = 0;
  window.api
    .getPaketSewa()
    .then((rows: PaketSewa[]) => {
      rows.forEach((each) => {
        paketSewaData.push(each);
      });
    })
    .then(() => {
      return [];
    });
};
const insertPaketSewa = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      window.api
        .insertPaketSewa(formPengaturanKonsumsi.nama_paket, formPengaturanKonsumsi.harga_12_jam)
        .then((message: string) => ElMessage.success(message))
        .catch((err: Error) => ElMessage.error(err.message))
        .finally(() => {
          resetForm();
          getDataPaketSewa();
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
const ubahHargaPaketSewa = (id: number) => {
  if (isNaN(ubahHargaPaketSewaValue.value) || ubahHargaPaketSewaValue.value.toString() === "") {
    ubahHargaPaketSewaValue.value = 0;
    ElMessage.error("Isi input dengan benar");
  } else {
    window.api
      .ubahHargaPaketSewa(id, ubahHargaPaketSewaValue.value)
      .then((message: string) => ElMessage.success(message))
      .catch((err: Error) => ElMessage.error(err.message))
      .finally(() => {
        ubahHargaPaketSewaValue.value = 0;
        getDataPaketSewa();
      });
  }
};
const deletePaketSewa = (versi: number) => {
  window.api
    .deletePaketSewa(versi)
    .then((message: string) => ElMessage.success(message))
    .catch((err: Error) => ElMessage.error(err.message))
    .finally(getDataPaketSewa());
};
</script>

<template>
  <el-drawer v-model="store.showDrawerPengaturanKonsumsi" title="Pengaturan Sewa" direction="btt" custom-class="drawer-pengaturan-sewa-container" size="calc(100vh - 23px)" @open="getDataPaketSewa" @closed="paketSewaData.length = 0">
    <div class="pengaturan-sewa-container">
      <el-form label-position="top" class="form-pengaturan-sewa" ref="formPengaturanKonsumsiRef" :rules="formPengaturanKonsumsiRules" :model="formPengaturanKonsumsi" hide-required-asterisk>
        <el-form-item prop="nama_paket" label="Nama Paket">
          <el-input v-model="formPengaturanKonsumsi.nama_paket" />
        </el-form-item>
        <el-form-item label="Harga / 12 Jam" prop="harga_12_jam">
          <el-input v-model.number="formPengaturanKonsumsi.harga_12_jam" />
        </el-form-item>
        <el-form-item>
          <el-button @click="insertPaketSewa(formPengaturanKonsumsiRef)" type="primary">Tambah</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataPaketSewa" type="success">Refresh</el-button>
        </el-form-item>
      </el-form>
      <div class="secondary-text" style="text-align: center; margin-bottom: 20px">
        Input: Nama Paket <span style="color: var(--el-color-warning)">{{ formPengaturanKonsumsi.nama_paket }}</span
        >, Harga <span style="color: var(--el-color-success)">{{ toRupiah(formPengaturanKonsumsi.harga_12_jam) }}</span> (1 hari <span style="color: var(--el-color-primary)">{{ toRupiah(formPengaturanSewa.harga_12_jam * 2) }}</span
        >)
      </div>
      <el-table border stripe :data="paketSewaData" style="width: 600px; margin: 0 auto 0 auto">
        <el-table-column prop="nama_paket" label="Nama Paket" />
        <el-table-column prop="harga_12_jam" label="Harga 12 Jam" />
        <el-table-column label="Aksi">
          <template #default="scope">
            <div class="column-aksi-sewa">
              <el-popover width="max-content" trigger="click">
                <template #reference>
                  <el-button size="small" type="primary">Ubah Harga</el-button>
                </template>
                <div style="display: flex; flex-direction: column; gap: 5px">
                  <div class="secondary-text">Masukkan harga baru</div>
                  <div class="secondary-text">{{ ubahHargaPaketSewaValueRupiah }}</div>
                  <div style="display: flex; gap: 5px">
                    <el-input style="width: 150px" size="small" v-model.number="ubahHargaPaketSewaValue" />
                    <el-button @click="ubahHargaPaketSewa(scope.row.id)" size="small" type="success">Ubah</el-button>
                  </div>
                </div>
              </el-popover>
              <el-popconfirm @confirm="deletePaketSewa(scope.row.id)" title="Yakin ingin menghapus ?" width="max-content" confirm-button-text="Ya" cancel-button-text="Batal" confirm-button-type="danger">
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
.form-pengaturan-sewa {
  display: flex;
  gap: 10px;
  align-items: flex-end;
  justify-content: center;
}
.column-aksi-sewa {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  align-items: center;
  justify-content: center;
}
.drawer-pengaturan-sewa-container > .el-drawer__body {
  padding-top: 0;
}
.drawer-pengaturan-sewa-container > .el-drawer__header {
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
