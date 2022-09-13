<script setup lang="ts">
import WindowFrame from "./components/WindowFrame.vue";
import MainContent from "./components/MainContent.vue";
import LoginDialog from "./components/dialogs/LoginDialog.vue";
</script>

<template>
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
