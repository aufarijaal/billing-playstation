<!-- eslint-disable no-undef -->
<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";

const props = defineProps({
  "nomor-meja": {
    type: Number,
    required: true,
  },
});
const playstationData = reactive<Playstation[]>([]);
const psTerpilih = ref(1);
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
onMounted(() => {
  getPlaystationData();
});
</script>

<template>
  <div class="meja-main-container">
    <div class="meja-main">
      <div class="meja-main-indikator">
        <div class="label-nomor-meja label-nomor-meja-primary">MEJA {{ props["nomor-meja"] }}</div>
        <el-progress :width="300" type="dashboard" :percentage="80">
          <template #default="{ percentage }">
            <div style="display: flex; gap: 10px; flex-direction: column; justify-content: center; align-items: center">
              <span class="timer-text">00:00:00</span>
              <div style="margin-bottom: 10px">
                <span style="font-size: 18px"
                  >Ps
                  <el-select v-model="psTerpilih" style="width: 60px; margin-left: 10px" @focus="getPlaystationData">
                    <el-option v-for="item in playstationData" :label="item.tarif_per_menit" :key="item.versi" :value="item.versi" />
                  </el-select>
                </span>
              </div>
              <el-button type="danger">Stop</el-button>
            </div>
          </template>
        </el-progress>
        <div style="text-align: center">
          <div class="harga-bayar-main" style="font-size: 20pt; font-weight: 500">Rp. 15.000</div>
          <div class="label-detail" style="margin: 12px 0 15px 0">
            <div class="secondary-text label-detail-waktu-mulai">Detail mulai: -</div>
            <div class="secondary-text label-detail-waktu-selesai">Detail selesai: -</div>
            <div class="secondary-text label-jenis-main">Jenis main: -</div>
            <div class="secondary-text label-by-admin">By admin: -</div>
          </div>
        </div>
      </div>
      <div class="label-nomor-meja label-nomor-meja-alt">MEJA 30</div>
      <div class="meja-main-operasi">
        <el-button type="primary" size="large" class="btn-los">Los</el-button>
        <el-button type="success" size="large" class="btn-diwaktu">Diwaktu</el-button>
        <el-button type="warning" size="large" class="btn-simpan-reset">Simpan & Reset</el-button>
        <el-button type="danger" size="large" class="btn-print-struk">Print Struk</el-button>
        <el-button-group size="large" class="btn-pesanan">
          <el-button class="btn-tambah-pesanan">Tambah Pesanan</el-button>
          <el-button class="btn-info-pesanan">
            <el-icon>
              <InfoFilled />
            </el-icon>
          </el-button>
        </el-button-group>
      </div>
    </div>
  </div>
</template>

<style>
.label-nomor-meja {
  font-size: 22px;
  font-weight: 600;
}
.label-nomor-meja-alt {
  display: none;
}
.label-nomor-meja-primary {
  margin-top: 10px;
  margin-bottom: 20px;
  text-align: center;
}
.meja-main-container {
  overflow-y: auto;
  height: 20%;
}
.meja-main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.btn-los {
  grid-area: los;
}
.btn-diwaktu {
  grid-area: diwaktu;
}
.btn-simpan-reset {
  grid-area: simres;
}
.btn-print-struk {
  grid-area: print;
}
.btn-pesanan {
  grid-area: pesanan;
  place-self: center;
}
.meja-main-indikator {
  display: flex;
  justify-content: center;
  flex-direction: column;
}
.meja-main-operasi {
  max-width: 500px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 10px;
  grid-template-areas:
    "los diwaktu"
    "simres print"
    "pesanan pesanan";
}
div.meja-main-operasi > button.el-button {
  margin-left: 0;
}
@media (min-width: 640px) {
}

@media (min-width: 768px) {
}

@media (min-width: 1024px) {
  .meja-main {
    flex-direction: row;
    justify-content: space-evenly;
    margin-top: 30px;
  }
  .label-nomor-meja-primary {
    display: none;
  }
  .label-nomor-meja-alt {
    display: block;
  }
}

@media (min-width: 1280px) {
}

@media (min-width: 1536px) {
}
</style>
