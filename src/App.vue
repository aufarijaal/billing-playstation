<script setup lang="ts">
import WindowFrame from "./components/WindowFrame.vue";
import MainContent from "./components/MainContent.vue";
import LoginDialog from "./components/dialogs/LoginDialog.vue";
import DrawerLaporanBilling from "./components/drawers/DrawerLaporanBilling.vue";
import DrawerPengaturanAdmin from "./components/drawers/DrawerPengaturanAdmin.vue";
import DrawerPengaturanAplikasi from "./components/drawers/DrawerPengaturanAplikasi.vue";
import DrawerPengaturanKonsumsi from "./components/drawers/DrawerPengaturanKonsumsi.vue";
import DrawerPengaturanSewa from "./components/drawers/DrawerPengaturanSewa.vue";
import DrawerPengeluaran from "./components/drawers/DrawerPengeluaran.vue";
</script>

<template>
  <drawer-laporan-billing />
  <drawer-pengaturan-admin />
  <drawer-pengaturan-aplikasi />
  <drawer-pengaturan-konsumsi />
  <drawer-pengaturan-sewa />
  <drawer-pengeluaran />
  <login-dialog />
  <window-frame />
  <main-content />
</template>

<style>
html,
body {
  height: 100%;
  font-family: v-sans, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
}
#app {
  overflow: hidden;
  height: inherit;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 23px auto;
  gap: 0px 0px;
}
</style>
