<script setup lang="ts">
import { ref, unref } from "vue";
import { ClickOutside as vClickOutside } from "element-plus";
const windowMenuRef = ref();
const windowMenuPopoverRef = ref();
const onClickOutside = () => {
  unref(windowMenuPopoverRef).popperRef?.delayHide?.();
};

const minimize = () => {
  window.api.minimize();
};

const toggleMaxmimize = () => {
  window.api.toggleMaxmimize();
};

const closeApp = () => {
  window.api.closeApp();
};
</script>

<template>
  <el-popover placement="bottom-end" :show-arrow="false" ref="windowMenuPopoverRef" :virtual-ref="windowMenuRef" trigger="hover" virtual-triggering popper-class="window-menu-popover" :offset="0">
    <el-button size="small" type="default" text>Sewa</el-button>
    <el-button size="small" type="default" text>Laporan Billing</el-button>
    <el-button size="small" type="default" text>Pengeluaran</el-button>
    <el-button size="small" type="default" text>Pengaturan Aplikasi</el-button>
    <el-button size="small" type="default" text>Pengaturan Admin</el-button>
    <el-button size="small" type="default" text>Pengaturan Sewa</el-button>
    <el-button size="small" type="default" text>Pengaturan Konsumsi</el-button>
    <el-button size="small" type="default" text>Ganti Admin</el-button>
    <el-button size="small" type="danger" text>Keluar</el-button>
  </el-popover>
  <div class="window-frame" style="border-bottom: 1px solid var(--el-border-color)">
    <div class="window-menu" ref="windowMenuRef" v-click-outside="onClickOutside">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" preserveAspectRatio="xMidYMid meet" viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" d="M14 5H2V3h12v2zm0 4H2V7h12v2zM2 13h12v-2H2v2z" clip-rule="evenodd" /></svg>
    </div>
    <div class="window-title">Billing playstation</div>
    <div class="window-operation">
      <div @click="minimize" class="window-button window-minimize">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" preserveAspectRatio="xMidYMid meet" viewBox="0 0 16 16"><path fill="currentColor" d="M14 8v1H3V8h11z" /></svg>
      </div>
      <div @click="toggleMaxmimize" class="window-button window-maximize-restore">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" preserveAspectRatio="xMidYMid meet" viewBox="0 0 16 16"><path fill="currentColor" d="M3 3v10h10V3H3zm9 9H4V4h8v8z" /></svg>
      </div>
      <div @click="closeApp" class="window-button window-close">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" preserveAspectRatio="xMidYMid meet" viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" d="m7.116 8l-4.558 4.558l.884.884L8 8.884l4.558 4.558l.884-.884L8.884 8l4.558-4.558l-.884-.884L8 7.116L3.442 2.558l-.884.884L7.116 8z" clip-rule="evenodd" /></svg>
      </div>
    </div>
  </div>
</template>

<style>
.window-frame {
  display: flex;
  justify-content: space-between;
  align-items: center;
  -webkit-app-region: drag;
}
.el-popper.el-popover.window-menu-popover {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 160px;
  padding: 10px;
}
.el-popper.el-popover.window-menu-popover > .el-button {
  margin: 0;
}
.window-title {
  font-size: 12px;
}
.window-operation {
  display: flex;
  -webkit-app-region: no-drag;
  height: 100%;
  z-index: 100000;
}
.window-menu {
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-app-region: no-drag;
  cursor: pointer;
  height: 100%;
  width: 28px;
}
.window-menu:hover {
  background-color: var(--el-fill-color);
}
.window-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  cursor: pointer;
}
.window-maximize-restore:hover,
.window-minimize:hover {
  background-color: var(--el-fill-color);
}
.window-close:hover {
  background-color: var(--el-color-danger);
}
</style>
