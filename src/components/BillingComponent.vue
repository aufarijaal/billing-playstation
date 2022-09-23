<!-- eslint-disable no-undef -->
<script setup lang="ts">
import { ElMessage, TabPanelName } from "element-plus";
import { reactive, ref } from "vue";
import MejaMain from "./MejaMain.vue";

const showTambahMejaDialog = ref(false);
const tabAktif = ref("1");
const playstationData = reactive<Playstation[]>([]);
const getPlaystationData = () => {
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
const newTab = reactive({
  title: "",
  identifier: "",
  versiPs: 1,
});
const tabs = reactive([
  {
    title: "Meja 1",
    identifier: "1",
  },
]);
const handleEdit = (paneName: TabPanelName | undefined, action: "add" | "remove") => {
  if (action === "add") {
    // tabs.push({
    //   title: "Meja 2",
    //   identifier: "2",
    // });
    ElMessage.success("Tombol tambah meja diklik");
    showTambahMejaDialog.value = true;
  } else if (action === "remove") {
    ElMessage.warning("Tombol hapus meja diklik");
  }
};
const validateAddTab = () => {
  if (tabs.some((each) => each.title === newTab.title)) {
    ElMessage.warning(`Nama meja "${newTab.title}" sudah ada!`);
  }
};
</script>

<template>
  <div class="billing">
    <el-dialog v-model="showTambahMejaDialog" width="400px" title="Tambah Meja">
      <div style="display: flex; align-items: center; justify-content: space-around; gap: 0; margin-bottom: 10px">
        <div class="secondary-text">Nama Meja</div>
        <el-input v-model="newTab.title" size="small" style="width: 200px" />
      </div>
      <div style="display: flex; align-items: center; justify-content: space-around; gap: 0">
        <div class="secondary-text">Versi Ps</div>
        <el-select size="small" v-model="newTab.versiPs" style="width: 200px; margin-left: 10px" @focus="getPlaystationData">
          <el-option v-for="item in playstationData" :label="item.tarif_per_menit" :key="item.versi" :value="item.versi" />
        </el-select>
      </div>
      <div style="display: flex; justify-content: center; margin-top: 20px">
        <el-button size="small" type="success" plain @click="validateAddTab">Tambah</el-button>
      </div>
    </el-dialog>
    <el-tabs type="card" v-model="tabAktif" class="billing-tabs" editable @edit="handleEdit">
      <el-tab-pane v-for="tab in tabs" :key="tab.identifier" :label="tab.title" :name="tab.identifier">
        <meja-main :nomor-meja="parseInt(tab.identifier)" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style>
.billing {
  overflow: hidden;
}
.billing-tabs {
  margin-top: 5px;
  margin-left: 5px;
  margin-right: 5px;
  height: 95%;
}
.el-tab-pane,
.el-tabs__content {
  height: 200%;
}
.billing-tabs > .el-tabs__header .el-tabs__item {
  font-size: 9pt;
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
