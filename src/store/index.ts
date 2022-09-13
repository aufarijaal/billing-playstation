import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useAppStore = defineStore("main", () => {
  const loggedInAdmin = reactive({
    nama_admin: undefined,
    hak_akses: undefined,
    tanggal_login: undefined,
  });
  const showLoginDialog = ref(true);
  const playCount = ref(0);

  return {
    loggedInAdmin,
    playCount,

    showLoginDialog,
  };
});
