import { defineStore } from "pinia";
import { reactive, ref } from "vue";

interface LoggedInAdmin {
  nama_admin: string | undefined;
  hak_akses: "penuh" | "parsial" | undefined;
  tanggal_login: string | undefined;
}

export const useAppStore = defineStore("main", () => {
  const loggedInAdmin = reactive<LoggedInAdmin>({
    nama_admin: undefined,
    hak_akses: undefined,
    tanggal_login: undefined,
  });
  const showLoginDialog = ref(false);
  const loginDialogClosable = ref(false);
  const playCount = ref(0);

  return {
    loggedInAdmin,
    playCount,

    showLoginDialog,
    loginDialogClosable,
  };
});
