<!-- eslint-disable no-unused-vars -->
<!-- eslint-disable no-undef -->
<script setup lang="ts">
import { useAppStore } from "../../store";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { reactive, ref, onMounted } from "vue";
import dayjs from "dayjs";

const store = useAppStore();
const formRef = ref<FormInstance>();
const dataAdmin = reactive<Pick<Admin, "nama_admin">[]>([]);

const form = reactive({
  nama_admin: "",
  kata_sandi: "",
});

const rules = reactive<FormRules>({
  nama_admin: [{ required: true, message: "Pilih salah satu nama admin", trigger: "change" }],
  kata_sandi: [{ required: true, message: "Kata sandi tidak boleh kosong", trigger: "blur" }],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      window.api
        .doLogin(form.nama_admin, form.kata_sandi)
        .then((data: any) => {
          store.loggedInAdmin.hak_akses = data.hak_akses;
          store.loggedInAdmin.nama_admin = form.nama_admin;
          store.loggedInAdmin.tanggal_login = dayjs().format("DD MMMM YYYY HH:mm:ss");
          store.showLoginDialog = false;
          ElMessage.success("Login berhasil");
        })
        .catch((err: Error) => ElMessage.error(err.message));
    } else {
      ElMessage.error("Login gagal. coba lagi");
    }
  });
};

const closeDialog = () => {
  store.loginDialogClosable = false;
  formRef.value?.resetFields();
};

onMounted(() => {
  window.api
    .getAdmins()
    .then((data: Admin[]) => {
      let counter = 0;
      const fill = () => {
        counter++;
        if (counter <= data.length) {
          dataAdmin.push({
            nama_admin: data[counter - 1].nama_admin,
          });
          fill();
        }
      };
      fill();
    })
    .catch((err: Error) => {
      console.log(err);
      ElMessage.error(err.message);
    });
});
</script>

<template>
  <!-- Login dialog closable akan true jika di trigger oleh button ganti admin. karena user bisa membatalkan penggantian admin nya -->
  <el-dialog :show-close="store.loginDialogClosable" :close-on-click-modal="store.loginDialogClosable" :close-on-press-escape="store.loginDialogClosable" v-model="store.showLoginDialog" width="250px" align-center class="login-dialog" @closed="closeDialog">
    <div class="login-form-container">
      <img src="icon.ico" width="40" style="margin-bottom: 18px" />
      <el-form hide-required-asterisk label-position="top" ref="formRef" :model="form" :rules="rules">
        <el-form-item label="Nama admin" prop="nama_admin">
          <el-select placeholder="Pilih nama admin" v-model="form.nama_admin">
            <el-option v-for="admin in dataAdmin" :key="admin.nama_admin" :value="admin.nama_admin" :label="admin.nama_admin" />
          </el-select>
        </el-form-item>
        <el-form-item label="Kata sandi" prop="kata_sandi">
          <el-input type="password" show-password v-model="form.kata_sandi" />
        </el-form-item>
      </el-form>
      <el-button type="primary" plain @click="submitForm(formRef)">Login</el-button>
    </div>
  </el-dialog>
</template>

<style>
.login-form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
#app .login-dialog .el-dialog__body {
  padding: 20px;
}
#app .login-dialog header {
  display: none;
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
