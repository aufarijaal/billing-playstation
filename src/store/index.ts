import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";

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

  const showDrawerPengaturanAdmin = ref(false);
  const showDrawerPengaturanAplikasi = ref(false);
  const showDrawerPengaturanSewa = ref(false);
  const showDrawerPengaturanKonsumsi = ref(false);
  const showDrawerLaporanBilling = ref(false);
  const showDrawerPengeluaran = ref(false);
  const showDrawerPesananKonsumsi = ref(false);

  return {
    loggedInAdmin,
    playCount,

    showLoginDialog,
    loginDialogClosable,

    showDrawerPengaturanAdmin,
    showDrawerPengaturanAplikasi,
    showDrawerPengaturanKonsumsi,
    showDrawerPengaturanSewa,
    showDrawerLaporanBilling,
    showDrawerPengeluaran,
    showDrawerPesananKonsumsi,
  };
});
