<template>
  <div>
    <b-card title="Current running Advertiser" class="api-card text-left">
      <div v-if="advertiser" class="ads-group">
        <b-button
          v-for="item in advertiser"
          :key="item.name"
          class="ads-button"
          :variant="
            item.status === 'active' ? 'outline-success' : 'outline-secondary'
          "
          @click="showAdModal(item.name, item.status)"
          >{{ item.name }}</b-button
        >
      </div>
      <div class="button-group">
        <b-button @click="modalShow = !modalShow" variant="outline-primary">
          Add
        </b-button>
      </div>
    </b-card>
    <b-modal v-model="adsModal" :title="modalName.name" hide-footer>
      <div class="button-modal-group">
        <b-button
          v-if="modalName.status === 'active'"
          variant="outline-secondary"
          @click="pauseAd(modalName.name)"
          >Pause</b-button
        >
        <b-button
          v-else
          variant="outline-success"
          @click="resumeAd(modalName.name)"
          >Activate</b-button
        >
        <b-button variant="outline-danger" @click="deleteAd(modalName.name)"
          >Delete</b-button
        >
      </div>
    </b-modal>
    <b-modal v-model="modalShow" title="Add runing advertiser" @ok="handleOk">
      <div style="margin-bottom: 5px">Enter AdvertiserID</div>
      <b-form-input id="name-input" v-model="adsId" required></b-form-input>
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

export default {
  name: "RunningAdsCard",
  components: {},
  props: {
    advertiser: null,
  },
  data() {
    return {
      modalShow: false,
      adsModal: false,
      adsId: "",
      modalName: {
        name: "",
        status: "",
      },
    };
  },
  methods: {
    handleOk() {
      /// call add api
      axios
        .post(process.env.VUE_APP_BASE_URL + "/create_job", {
          advertiser_id: this.adsId,
        })
        .then(() => {
          this.$emit("create-job", {
            name: this.adsId,
            status: "active",
          });
          this.adsId = "";
        });
    },
    showAdModal(ad_name, ad_status) {
      this.adsModal = !this.adsModal;
      this.modalName.name = ad_name;
      this.modalName.status = ad_status;
    },
    deleteAd(ad_name) {
      this.adsModal = !this.adsModal;
      axios
        .delete(process.env.VUE_APP_BASE_URL + "/delete", {
          params: {
            advertiser_id: ad_name,
          },
        })
        .then(() => {
          this.$emit(
            "delete-job",
            this.advertiser.filter((el) => el.name !== ad_name)
          );
        });
    },
    resumeAd(ad_name) {
      axios
        .get(process.env.VUE_APP_BASE_URL + "/resume", {
          params: {
            advertiser_id: ad_name,
          },
        })
        .then(() => {
          this.$emit("update-job", {
            name: ad_name,
            status: "active",
          });
          this.adsModal = !this.adsModal;
        });
    },
    pauseAd(ad_name) {
      axios
        .get(process.env.VUE_APP_BASE_URL + "/pause", {
          params: {
            advertiser_id: ad_name,
          },
        })
        .then(() => {
          this.$emit("update-job", { name: ad_name, status: "inactive" });
          this.adsModal = !this.adsModal;
        });
    },
  },
};
</script>

<style>
.ads-group {
  border: 1px solid rgb(214, 214, 214);
  border-radius: 5px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
}
.ads-button {
  height: 40px;
  margin: 10px;
}
.button-group {
  margin: 10px 10px 5px 5px;
}
.button-modal-group {
  display: flex;
  justify-content: space-around;
}
</style>
