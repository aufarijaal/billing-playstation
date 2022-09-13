<script setup lang="ts">
import StatusBar from "./StatusBar.vue";
import BillingComponent from "./BillingComponent.vue";
</script>

<template>
  <div class="main-content-container">
    <div class="main-content">
      <billing-component />
      <status-bar />
    </div>
  </div>
</template>

<style>
.main-content-container {
  overflow-y: auto;
  height: 100%;
}
.main-content {
  height: inherit;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 23px;
  gap: 0px 0px;
}
</style>
