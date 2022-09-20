<!-- eslint-disable no-undef -->
<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useAppStore } from "../../store";
import { useToggle, useDark } from "@vueuse/core";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import toRupiah from "@develoka/angka-rupiah-js";

const isDark = useDark();
const toggleTema = useToggle(isDark);
const formPlaystationRef = ref<FormInstance>();
const formPlaystation = reactive<Playstation>({
  versi: 1,
  tarif_per_menit: 0,
});
const cekDuplikasiPlaystation = (rule: any, value: any, callback: CallableFunction) => {
  if (playstationData.some((each) => each.versi === value)) {
    callback(new Error("Versi PS itu sudah ada"));
  } else {
    callback();
  }
};
const formPlaystationRules = reactive<FormRules>({
  versi: [
    { required: true, message: "Versi ps tidak boleh kosong", trigger: "change" },
    { validator: cekDuplikasiPlaystation, trigger: "change" },
  ],
  tarif_per_menit: [{ required: true, message: "Tarif tidak boleh kosong / 0", trigger: "blur", type: "number" }],
});
const playstationData = reactive<Playstation[]>([]);
const store = useAppStore();
const tabAktif = ref("playstation");
const ubahTarifPlaystationValue = ref(0);
const ubahTarifPlaystationValueRupiah = computed(() => {
  return toRupiah(ubahTarifPlaystationValue.value, {});
});
const getTableDataPlaystation = () => {
  playstationData.length = 0;
  window.api
    .getPlaystation()
    .then((rows: Playstation[]) => {
      rows.forEach((each) => {
        playstationData.push(each);
      });
    })
    .then(() => {
      return [];
    });
};
const insertPlaystation = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      window.api
        .insertPlaystation(formPlaystation.versi, formPlaystation.tarif_per_menit)
        .then((message: string) => ElMessage.success(message))
        .catch((err: Error) => ElMessage.error(err.message))
        .finally(() => {
          resetForm();
          getTableDataPlaystation();
        });
    } else {
      resetForm();
      ElMessage.warning("Isi semua input dengan benar!");
    }
  });
};
const resetForm = () => {
  formPlaystationRef.value?.resetFields();
};
const ubahTarifPlaystation = (versi: number) => {
  if (isNaN(ubahTarifPlaystationValue.value) || ubahTarifPlaystationValue.value.toString() === "") {
    ubahTarifPlaystationValue.value = 0;
    ElMessage.error("Isi input dengan benar");
  } else {
    window.api
      .ubahTarifPlaystation(versi, ubahTarifPlaystationValue.value)
      .then((message: string) => ElMessage.success(message))
      .catch((err: Error) => ElMessage.error(err.message))
      .finally(() => {
        ubahTarifPlaystationValue.value = 0;
        getTableDataPlaystation();
      });
  }
};
const deletePlaystation = (versi: number) => {
  window.api
    .deletePlaystation(versi)
    .then((message: string) => ElMessage.success(message))
    .catch((err: Error) => ElMessage.error(err.message))
    .finally(getTableDataPlaystation());
};
const doTruncate = (nama_tabel: string) => {};
</script>

<template>
  <el-drawer v-model="store.showDrawerPengaturanAplikasi" title="Pengaturan Aplikasi" direction="btt" custom-class="drawer-pengaturan-aplikasi-container" size="calc(100vh - 23px)" @open="getTableDataPlaystation" @closed="playstationData.length = 0">
    <div class="pengaturan-aplikasi-container">
      <el-tabs v-model="tabAktif" class="tab-pengaturan-aplikasi">
        <el-tab-pane label="Playstation" name="playstation">
          <div class="pengaturan-ps-container">
            <el-form label-position="top" class="form-pengaturan-playstation" ref="formPlaystationRef" :rules="formPlaystationRules" :model="formPlaystation" hide-required-asterisk>
              <el-form-item prop="versi" label="Versi">
                <el-input-number :min="1" v-model="formPlaystation.versi" />
              </el-form-item>
              <el-form-item label="Tarif / 1 Menit" prop="tarif_per_menit">
                <el-input v-model.number="formPlaystation.tarif_per_menit" />
              </el-form-item>
              <el-form-item>
                <el-button @click="insertPlaystation(formPlaystationRef)" type="primary">Tambah</el-button>
              </el-form-item>
              <el-form-item>
                <el-button @click="getTableDataPlaystation" type="success">Refresh</el-button>
              </el-form-item>
            </el-form>
            <div class="secondary-text" style="text-align: center; margin-bottom: 20px">
              Input: Versi <span style="color: var(--el-color-warning)">{{ formPlaystation.versi }}</span
              >, Tarif <span style="color: var(--el-color-success)">{{ toRupiah(formPlaystation.tarif_per_menit) }}</span> (Per jam <span style="color: var(--el-color-primary)">{{ toRupiah(formPlaystation.tarif_per_menit * 60) }}</span
              >)
            </div>
            <el-table border stripe :data="playstationData" style="width: 600px; margin: 0 auto 0 auto">
              <el-table-column prop="versi" label="Versi"></el-table-column>
              <el-table-column prop="tarif_per_menit" label="Tarif / 1 menit"></el-table-column>
              <el-table-column label="Aksi">
                <template #default="scope">
                  <div class="column-aksi-playstation">
                    <el-popover width="max-content" trigger="click">
                      <template #reference>
                        <el-button size="small" type="primary">Ubah tarif</el-button>
                      </template>
                      <div style="display: flex; flex-direction: column; gap: 5px">
                        <div class="secondary-text">Masukkan tarif baru</div>
                        <div class="secondary-text">{{ ubahTarifPlaystationValueRupiah }}</div>
                        <div style="display: flex; gap: 5px">
                          <el-input style="width: 150px" size="small" v-model.number="ubahTarifPlaystationValue" />
                          <el-button @click="ubahTarifPlaystation(scope.row.versi)" size="small" type="success">Ubah</el-button>
                        </div>
                      </div>
                    </el-popover>
                    <el-popconfirm @confirm="deletePlaystation(scope.row.versi)" title="Yakin ingin menghapus ?" width="max-content" confirm-button-text="Ya" cancel-button-text="Batal" confirm-button-type="danger">
                      <template #reference>
                        <el-button size="small" type="danger">Hapus</el-button>
                      </template>
                    </el-popconfirm>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Aplikasi" name="aplikasi">
          <el-divider content-position="left">Tema Aplikasi</el-divider>
          <el-switch v-model="isDark" @change="toggleTema(isDark)" active-text="Dark" inactive-text="Light" />
        </el-tab-pane>
        <el-tab-pane label="Danger Zone" name="dangerzone">
          <div class="danger-zone-container">
            <div class="danger-zone-item">
              <div class="secondary-text">Hapus / Reset semua data laporan billing</div>
              <el-popconfirm confirm-button-text="Ya" cancel-button-text="Batal" width="max-content" confirm-button-type="danger" title="Yakin ingin mereset ?" @confirm="doTruncate('laporan_billing')">
                <template #reference>
                  <el-button type="danger" plain>Reset Laporan Billing</el-button>
                </template>
              </el-popconfirm>
            </div>
            <div class="danger-zone-item">
              <div class="secondary-text">Hapus / Reset semua data laporan sewa</div>
              <el-popconfirm confirm-button-text="Ya" cancel-button-text="Batal" width="max-content" confirm-button-type="danger" title="Yakin ingin mereset ?" @confirm="doTruncate('laporan_sewa')">
                <template #reference>
                  <el-button type="danger" plain>Reset Laporan Sewa</el-button>
                </template>
              </el-popconfirm>
            </div>
            <div class="danger-zone-item">
              <div class="secondary-text">Hapus / Reset semua menu konsumsi</div>
              <el-popconfirm confirm-button-text="Ya" cancel-button-text="Batal" width="max-content" confirm-button-type="danger" title="Yakin ingin mereset ?" @confirm="doTruncate('menu_konsumsi')">
                <template #reference>
                  <el-button type="danger" plain>Reset Menu Konsumsi</el-button>
                </template>
              </el-popconfirm>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Printing" name="printing">
          <div class="pengaturan-printing-container">
            <el-form label-position="top" class="form-pengaturan-printing">
              <el-form-item label="Nama Toko">
                <el-input style="width: 200px" />
              </el-form-item>
              <el-form-item label="Sub Nama Toko">
                <el-input style="width: 200px" />
              </el-form-item>
              <el-form-item label="Alamat">
                <el-input style="width: 200px" />
              </el-form-item>
              <el-form-item label="Sub Alamat">
                <el-input style="width: 200px" />
              </el-form-item>
              <el-form-item label="Footer 1">
                <el-input style="width: 200px" />
              </el-form-item>
              <el-form-item label="Footer 2">
                <el-input style="width: 200px" />
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-drawer>
</template>

<style>
.form-pengaturan-playstation {
  display: flex;
  gap: 10px;
  align-items: flex-end;
  justify-content: center;
}
.column-aksi-playstation {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  align-items: center;
  justify-content: center;
}
.drawer-pengaturan-aplikasi-container > .el-drawer__body {
  padding-top: 0;
}
.drawer-pengaturan-aplikasi-container > .el-drawer__header {
  padding-bottom: 20px;
  margin-bottom: 10px;
  border-bottom: 1px solid var(--el-fill-color);
}
.danger-zone-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.danger-zone-item {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.pengaturan-printing-container {
  display: flex;
  justify-content: center;
}
@media (min-width: 640px) {
}

@media (min-width: 768px) {
}

@media (min-width: 1024px) {
  .pengaturan-printing-container {
    display: flex;
    justify-content: flex-start;
  }
}

@media (min-width: 1280px) {
}

@media (min-width: 1536px) {
}
</style>
