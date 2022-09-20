<script setup lang="ts">
import { ref } from "vue";
import MejaMain from "./MejaMain.vue";

let tabIndex = 2;
const editableTabsValue = ref("2");
const editableTabs = ref([
  {
    title: "Tab 1",
    name: "1",
    content: "Tab 1 content",
  },
  {
    title: "Tab 2",
    name: "2",
    content: "Tab 2 content",
  },
]);

const handleTabsEdit = (targetName: string, action: "remove" | "add") => {
  if (action === "add") {
    const newTabName = `${++tabIndex}`;
    editableTabs.value.push({
      title: "New Tab",
      name: newTabName,
      content: "",
    });
    editableTabsValue.value = newTabName;
  } else if (action === "remove") {
    const tabs = editableTabs.value;
    let activeName = editableTabsValue.value;
    if (activeName === targetName) {
      tabs.forEach((tab, index) => {
        if (tab.name === targetName) {
          const nextTab = tabs[index + 1] || tabs[index - 1];
          if (nextTab) {
            activeName = nextTab.name;
          }
        }
      });
    }

    editableTabsValue.value = activeName;
    editableTabs.value = tabs.filter((tab) => tab.name !== targetName);
  }
};
</script>

<template>
  <div class="billing">
    <el-tabs v-model="editableTabsValue" type="card" editable class="billing-tabs" @edit="handleTabsEdit">
      <el-tab-pane v-for="item in editableTabs" :key="item.name" :label="item.title" :name="item.name">
        <meja-main />
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
