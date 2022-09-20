<script setup lang="ts">
import { useAppStore } from "../store";
import { ref } from "vue";
import filesize from "filesize";
import { ElMessage } from "element-plus";

const store = useAppStore();
const dbinfo = ref("");
const playstationCount = ref("");
const getDBInfo = () => {
  window.api
    .dbFileSize()
    .then((size: any) => {
      dbinfo.value = filesize(size);
    })
    .catch((err: Error) => console.log(err.message));
  window.api
    .dbDataCount("konfigurasi_ps", "versi")
    .then((count: string) => {
      playstationCount.value = Object.values(count[0])[0];
    })
    .catch((err: Error) => {
      ElMessage.error(err.message);
    });
  // window.api
  // .dbDataCount("konfigurasi_ps", "versi")
  // .then((count: string) => {
  //   playstationCount.value = Object.values(count[0])[0];
  // })
  // .catch((err: Error) => {
  //   ElMessage.error(err.message);
  // });
  // window.api
  // .dbDataCount("konfigurasi_ps", "versi")
  // .then((count: string) => {
  //   playstationCount.value = Object.values(count[0])[0];
  // })
  // .catch((err: Error) => {
  //   ElMessage.error(err.message);
  // });
};
</script>

<template>
  <div class="status-bar">
    <div class="status-bar-item logged-in-admin">
      <el-icon :size="16">
        <User />
      </el-icon>
      <div class="status-label">Admin: {{ store.loggedInAdmin.nama_admin ?? "Tidak ada" }}</div>
    </div>
    <div class="status-bar-item login-date">
      <el-icon :size="16">
        <Calendar />
      </el-icon>
      <div class="status-label">Login pada: {{ store.loggedInAdmin.tanggal_login ?? "Belum login" }}</div>
    </div>
    <div class="status-bar-item play-count">
      <el-icon :size="16">
        <Monitor />
      </el-icon>
      <div class="status-label">Aktif: {{ store.playCount }}</div>
    </div>
    <div class="status-bar-item play-count">
      <el-popover placement="top" width="max-content" @show="getDBInfo">
        <template #reference>
          <div style="display: flex; align-items: center; gap: 5px">
            <el-icon :size="16">
              <Coin />
            </el-icon>
            <div class="status-label">DB Info</div>
          </div>
        </template>
        <div style="display: flex; flex-direction: column; gap: 5px">
          <div class="secondary-text">Ukuran Database: {{ dbinfo }}</div>
          <div class="secondary-text">Data Laporan Billing: 1000 data</div>
          <div class="secondary-text">Data Laporan Sewa: 1000 data</div>
          <div class="secondary-text">Data Menu Konsumsi: 4000 data</div>
          <div class="secondary-text">Data Playstation: {{ playstationCount }} data</div>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<style>
.status-bar {
  border-top: 1px solid var(--el-fill-color);
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.status-bar-item {
  display: flex;
  align-items: center;
  height: 100%;
  padding-left: 10px;
  padding-right: 10px;
  gap: 5px;
}
.status-bar-item:hover {
  cursor: pointer;
  background-color: var(--el-fill-color);
}
.status-label {
  font-size: 8pt;
  color: var(--el-text-color-secondary);
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
