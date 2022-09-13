<script setup lang="ts">
import { useAppStore } from "../store";
const store = useAppStore();
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
