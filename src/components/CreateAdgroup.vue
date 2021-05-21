<template>
  <div>
    <b-card
      title="Create Adgroup"
      sub-title="Create new adgroup associated to campiagn"
      class="api-card text-left"
    >
      <div>
        <h4 class="bidlist-title">Avaliable Bidlists</h4>
        <div v-if="!loadingBidlist">
          <b-table
            striped
            hover
            :items="bidlistData"
            class="data-table"
            :fields="[
              'AdvertiserId',
              'CampaignId',
              'BidlistId',
              'AdGroupId',
              'Goal_VCR',
              'Goal_VR',
              'Goal_CPCV_THB',
              'Max_CPM_THB',
              'Latest_update',
              'Options',
            ]"
          >
            <template #cell(Options)="row">
              <b-button
                size="sm"
                @click="deleteBidlist(row)"
                class="mr-2"
                variant="danger"
                :disabled="loadingDelete"
              >
                <pulse-loader
                  v-if="loadingDelete"
                  size="10px"
                  color="#FBF9F8"
                ></pulse-loader>
                <span v-else>Remove</span>
              </b-button>
            </template></b-table
          >
          <b-button
            class="add-button"
            variant="primary"
            @click="showAddBidlistModal"
            :disabled="loadingAdd"
          >
            <pulse-loader
              v-if="loadingAdd"
              size="10px"
              color="#FBF9F8"
            ></pulse-loader>

            <span v-else> Add </span>
          </b-button>
        </div>
        <div v-else-if="loadingBidlist" class="loading-spinner">
          <b-spinner variant="danger" style="margin-top: 50px"></b-spinner>
        </div>
      </div>
    </b-card>
    <b-modal
      v-model="addBidlistModal"
      title="Add new bidlist"
      hide-footer
      size="xl"
    >
      <div class="input-group">
        <div class="select-group">
          <h5>Select advertiser id</h5>
          <b-form-input
            v-model="advertiserSelected"
            placeholder="Enter advertiser id"
          ></b-form-input>
        </div>
        <div class="select-group">
          <h5>Select campaign id</h5>
          <b-form-input
            v-model="campaignSelected"
            placeholder="Enter campaign id"
            :disabled="advertiserSelected === '' ? true : false"
          ></b-form-input>
        </div>
        <div class="select-group">
          <h5>Enter adgroup id</h5>
          <b-form-input
            v-model="adgroupInput"
            placeholder="Enter adgroup id"
            :disabled="campaignSelected === '' ? true : false"
          ></b-form-input>
        </div>
        <div class="select-group">
          <h5>Enter Goal_VCR</h5>
          <div class="enter-value">
            <b-form-input
              v-model="vcrValue"
              type="number"
              min="0"
              max="100"
              class="good-value-input-percent"
            >
            </b-form-input>
            <h2 style="margin-left: 5px; color: #424447">%</h2>
          </div>
        </div>
        <div class="select-group">
          <h5>Enter Goal_VR</h5>
          <div class="enter-value">
            <b-form-input
              v-model="vrValue"
              type="number"
              min="0"
              max="100"
              class="good-value-input-percent"
            >
            </b-form-input>
            <h2 style="margin-left: 5px; color: #424447">%</h2>
          </div>
        </div>
        <div class="select-group">
          <h5>Enter Goal_CPCV</h5>
          <div class="enter-value">
            <b-form-input
              v-model="cpcvValue"
              type="number"
              class="good-value-input"
            >
            </b-form-input>
            <b-form-select
              class="currency"
              v-model="cpcvCurrency"
              :options="cpcvCurrencyOptions"
            ></b-form-select>
          </div>
        </div>
        <div class="select-group">
          <h5>Enter Max_CPM</h5>
          <div class="enter-value">
            <b-form-input
              v-model="cpmValue"
              type="number"
              class="good-value-input"
            >
            </b-form-input>
            <b-form-select
              class="currency"
              v-model="cpmCurrency"
              :options="cpmCurrencyOptions"
            ></b-form-select>
          </div>
        </div>
        <div class="select-group">
          <b-button
            class="button-modal"
            variant="primary"
            @click="createAdgroup"
            :disabled="
              campaignSelected !== '' &&
              advertiserSelected !== '' &&
              adgroupInput !== '' &&
              !loadingAdd
                ? false
                : true
            "
          >
            <pulse-loader
              v-if="loadingAdd"
              size="10px"
              color="#FBF9F8"
            ></pulse-loader>

            <span v-else> Add </span>
          </b-button>
        </div>
      </div>
      <div class="json-reult">
        <vue-json-pretty
          showLength
          showLine
          :data="createAdgroupRes"
          :virtual="true"
          :itemHeight="10"
          class="bidlist-area-text"
        >
        </vue-json-pretty>
      </div>
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

export default {
  name: "CreateAdgroup",
  components: {
    VueJsonPretty,
    PulseLoader,
  },
  props: {
    advertiser: null,
  },
  data() {
    return {
      bidlistData: [],
      addBidlistModal: false,
      advertiserOptions: [
        {
          value: "",
          text: "Please select advertiser id",
          disabled: true,
        },
      ],
      campaignOptions: [
        {
          value: "",
          text: "Please select campaign id",
          disabled: true,
        },
      ],
      advertiserSelected: "",
      campaignSelected: "",
      adgroupInput: "",
      goodvalueInput: 0.0,
      createAdgroupRes: "",
      bidlistRes: null,
      loadingAdd: false,
      loadingDelete: false,
      loadingBidlist: false,
      cpcvCurrency: "thb",
      cpmCurrency: "thb",
      cpcvCurrencyOptions: [
        { value: "thb", text: "฿" },
        { value: "usd", text: "$" },
      ],
      cpmCurrencyOptions: [
        { value: "thb", text: "฿" },
        { value: "usd", text: "$" },
      ],
      cpmValue: 0.0,
      cpcvValue: 0.0,
      vcrValue: 0.0,
      vrValue: 0.0,
    };
  },
  methods: {
    fetchBidlist() {
      this.loadingBidlist = true;
      axios.get(process.env.VUE_APP_BASE_URL + "/bidlist").then((res) => {
        this.bidlistData = res.data.message;
        // console.log(this.bidlistData);
        this.bidlistData = this.bidlistData.map((el) => ({
          ...el,
          Latest_update: new Date(el.Latest_update).toLocaleString(),
        }));
        this.loadingDelete = false;
        this.loadingBidlist = false;
      });
    },
    showAddBidlistModal() {
      this.addBidlistModal = true;
    },
    createAdgroup() {
      this.loadingAdd = true;
      axios
        .post(process.env.VUE_APP_BASE_URL + "/bidlist", {
          advertiser_id: this.advertiserSelected,
          campaign_id: this.campaignSelected,
          adgroup_id: this.adgroupInput,
          vr_value: this.vrValue,
          vcr_value: this.vcrValue,
          cpcv_value: this.cpcvValue,
          cpm_value: this.cpmValue,
          cpcv_Currency: this.cpcvCurrency,
          cpm_Currency: this.cpmCurrency,
        })
        .then((res) => {
          // console.log(res.data);
          this.createAdgroupRes = res.data;
          this.fetchBidlist();
        })
        .finally(() => {
          this.loadingAdd = false;
        });
    },
    deleteBidlist(row) {
      // console.log("delete", row.item.BidlistId, row.item.AdGroupId);
      this.loadingDelete = true;
      axios
        .delete(process.env.VUE_APP_BASE_URL + "/bidlist", {
          params: {
            BidlistID: row.item.BidlistId,
            AdGroupId: row.item.AdGroupId,
          },
        })
        .then(() => {
          // console.log(res);
          this.fetchBidlist();
        });
    },
  },
  mounted() {
    this.fetchBidlist();
    // this.advertiser.forEach((el) => {
    //   this.advertiserOptions.push({
    //     value: el.name,
    //     text: el.name,
    //   });
    // });
  },
  computed: {
    adgroupState() {
      return this.adgroupInput.length === 7 ? true : false;
    },
    goodvalueState() {
      return isNaN(+this.goodvalueInput) || this.goodvalueInput.length === 0
        ? false
        : true;
    },
    convertToUs() {
      return (+this.goodvalueInput / 31).toFixed(2);
    },
  },
  watch: {
    // vcrValue(val) {
    //   if (+val > 100 || +val < 0) {
    //     this.vcrValue = 0.0;
    //   }
    // },
    // vrValue(val) {
    //   if (val > 100 || val < 0) {
    //     this.vrValue = "";
    //   }
    // },
    //   advertiserSelected(val) {
    //     this.campaignOptions = [
    //       {
    //         value: "",
    //         text: "Please select campaign id",
    //         disabled: true,
    //       },
    //     ];
    //     this.campaignOptions[0].text = "Loading..";
    //     axios
    //       .get(process.env.VUE_APP_BASE_URL + "/campaign_list", {
    //         params: {
    //           advertiserId: val,
    //         },
    //       })
    //       .then((res) => {
    //         res.data.message
    //           .map((item) => ({
    //             value: item.CampaignId,
    //             text: item.CampaignId,
    //           }))
    //           .forEach((element) => {
    //             this.campaignOptions.push(element);
    //           });
    //         console.log(this.campaignOptions);
    //       })
    //       .finally(() => {
    //         if (this.campaignOptions.length === 1) {
    //           this.campaignOptions[0].text = "No campaign avaliabe";
    //         } else {
    //           this.campaignOptions[0].text = "Please select campaign id";
    //         }
    //       });
    //   },
  },
};
</script>
<style>
.bidlist-title {
  text-align: center;
  margin-top: 50px;
}
.loading-bidlist {
  margin: auto;
  margin-top: 50px;
}
.add-button {
  margin-top: 20px;
  margin-left: 30px;
}
.input-group {
  display: flex;
  flex-wrap: wrap;
}
.select-group {
  max-width: 200px;
  margin: 20px;
}
.select-group-good-value {
  max-width: 400px;
  margin: 20px;
}
.button-modal {
  margin-top: 30px;
}
.bidlist-area-text {
  min-height: 400px;
  max-height: 400px;
  background-color: #fdf5df;
  overflow: auto;
}
.good-value-input {
  max-width: 120px;
}
.good-value-input-percent {
  max-width: 70px;
}
.usd {
  padding-left: 10px;
  margin-bottom: 0;
}
.api-card {
  width: 80%;
  margin: auto;
  margin-top: 50px;
}
.data-table {
  margin: auto;
  margin-top: 30px;
}
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
.enter-value {
  display: flex;
  flex-direction: row;
  max-width: 150px;
}
.currency {
  margin-left: 5px;
  max-width: 50px;
}
.loading-spinner {
  text-align: center;
}
</style>