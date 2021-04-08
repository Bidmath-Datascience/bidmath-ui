<template>
  <div>
    <b-card
      title="Create Adgroup"
      sub-title="Create new adgroup associated to campiagn"
      class="api-card text-left"
    >
      <div v-if="bidlistData.length > 0">
        <h4 class="bidlist-title">Avaliable Bidlists</h4>
        <b-table
          striped
          hover
          :items="bidlistData"
          class="data-table"
          :fields="[
            'AdvertiserId',
            'CampaignId',
            'BidlistId',
            'GoodValue',
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
      <div v-else class="loading-bidlist">
        <h4>Loading bidlist...</h4>
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
          <b-form-select
            v-model="advertiserSelected"
            :options="advertiserOptions"
          ></b-form-select>
        </div>
        <div class="select-group">
          <h5>Select campaign id</h5>
          <b-form-select
            v-model="campaignSelected"
            :options="campaignOptions"
            :disabled="campaignOptions.length === 1 ? true : false"
          ></b-form-select>
        </div>
        <div class="select-group">
          <h5>Enter adgroup id</h5>
          <b-form-input
            v-model="adgroupInput"
            :state="adgroupState"
            aria-describedby="input-live-help input-live-feedback"
            placeholder="Enter adgroup id"
            trim
            :disabled="campaignSelected === '' ? true : false"
          ></b-form-input>
        </div>
        <div class="select-group-good-value">
          <h5>Enter good value (in THB)</h5>
          <div style="display: flex; align-items: center">
            <b-form-input
              class="good-value-input"
              v-model="goodvalueInput"
              :state="goodvalueState"
              aria-describedby="input-live-help input-live-feedback"
              placeholder="THB"
              trim
              :disabled="campaignSelected === '' ? true : false"
            ></b-form-input>
            <label class="usd">{{ convertToUs }} USD</label>
          </div>
        </div>
        <div class="select-group">
          <b-button
            class="button-modal"
            variant="primary"
            @click="createAdgroup"
            :disabled="
              goodvalueState && adgroupState && !loadingAdd ? false : true
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
    };
  },
  methods: {
    fetchBidlist() {
      axios.get(process.env.VUE_APP_BASE_URL + "/show_bidlist").then((res) => {
        this.bidlistData = res.data.message;
        console.log(this.bidlistData);
        this.loadingDelete = false;
      });
    },
    showAddBidlistModal() {
      this.addBidlistModal = true;
    },
    createAdgroup() {
      this.loadingAdd = true;
      axios
        .post(process.env.VUE_APP_BASE_URL + "/create_adgroup/", {
          advertiser_id: this.advertiserSelected,
          campaign_id: this.campaignSelected,
          adgroup_id: this.adgroupInput,
          good_value: (+this.goodvalueInput / 31).toFixed(2),
        })
        .then((res) => {
          console.log(res.data);
          this.createAdgroupRes = res.data;
          this.fetchBidlist();
        })
        .finally(() => {
          this.loadingAdd = false;
        });
    },
    deleteBidlist(row) {
      console.log("delete", row.item.BidlistId);
      this.loadingDelete = true;
      axios
        .delete(process.env.VUE_APP_BASE_URL + "/bidlist", {
          params: {
            bidlist: row.item.BidlistId,
          },
        })
        .then((res) => {
          console.log(res);
          this.fetchBidlist();
        });
    },
  },
  mounted() {
    this.fetchBidlist();
    this.advertiser.forEach((el) => {
      this.advertiserOptions.push({
        value: el.name,
        text: el.name,
      });
    });
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
    advertiserSelected(val) {
      this.campaignOptions = [
        {
          value: "",
          text: "Please select campaign id",
          disabled: true,
        },
      ];
      this.campaignOptions[0].text = "Loading..";
      axios
        .get(process.env.VUE_APP_BASE_URL + "/campaign_list", {
          params: {
            advertiserId: val,
          },
        })
        .then((res) => {
          res.data.message
            .map((item) => ({
              value: item.CampaignId,
              text: item.CampaignId,
            }))
            .forEach((element) => {
              this.campaignOptions.push(element);
            });
          console.log(this.campaignOptions);
        })
        .finally(() => {
          if (this.campaignOptions.length === 1) {
            this.campaignOptions[0].text = "No campaign avaliabe";
          } else {
            this.campaignOptions[0].text = "Please select campaign id";
          }
        });
    },
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
.usd {
  padding-left: 10px;
  margin-bottom: 0;
}
</style>