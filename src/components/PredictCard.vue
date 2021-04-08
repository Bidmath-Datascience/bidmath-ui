<template>
  <div>
    <b-card
      title="Predict CPU"
      sub-title="Select data from BigQuery and predict. Showing top 500 CPU !! Please choose only one date for predict !!"
      class="api-card text-left"
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
          <h5>Select adgroup id</h5>
          <b-form-select
            v-model="adgroupSelected"
            :options="adgroupOptions"
            :disabled="adgroupOptions.length === 1 ? true : false"
          ></b-form-select>
        </div>
        <div class="select-group">
          <h5>Select date</h5>
          <b-form-datepicker
            v-model="predictStartDate"
            class="mb-2"
          ></b-form-datepicker>
        </div>
        <!-- <div class="select-group">
          <h5>Select end date</h5>
          <b-form-datepicker
            v-model="predictEndDate"
            class="mb-2"
          ></b-form-datepicker>
        </div> -->
        <div class="select-group">
          <b-button
            class="search-button"
            variant="primary"
            @click="fetchPredict"
          >
            <pulse-loader
              v-if="predictLoading"
              size="10px"
              color="#FBF9F8"
            ></pulse-loader>
            <span v-else> Predict </span>
          </b-button>
        </div>
        <div class="select-group">
          <b-form-checkbox
            class="save-switch"
            v-model="saveChecked"
            name="check-button"
            switch
            size="lg"
            @click="!saveChecked"
          >
            Save predicted to BigQuery
          </b-form-checkbox>
        </div>
      </div>
      <div v-if="predictedData.length !== 0">
        <div class="input-group">
          <b-form-input
            v-model="cpuFilter"
            placeholder="Enter CPU"
            class="cpu-enter"
          >
          </b-form-input>
          <b-button class="filter-button" variant="primary" @click="filterData">
            Filter
          </b-button>
          <b-button
            class="filter-button"
            variant="primary"
            @click="resetFilter"
          >
            Reset filter
          </b-button>
          <b-button
            v-if="bidlistText.length == 0 || bidlistCreated == false"
            class="filter-button"
            :variant="isRowSelected ? 'primary' : 'secondary'"
            :disabled="isRowSelected ? false : true"
            @click="createBidlist"
          >
            Create Bidlist
          </b-button>
          <b-button
            v-else
            class="filter-button"
            variant="primary"
            @click="
              () => {
                bidlistText = [];
                $refs.selectableTable.clearSelected();
              }
            "
          >
            Clear
          </b-button>
        </div>
        <div class="bidlist-area" v-if="bidlistCreated">
          <div class="icon-group">
            <b-icon
              class="close-icon"
              icon="x"
              scale="2"
              variant="danger"
              @click="
                () => {
                  bidlistCreated = false;
                  bidlistText = '';
                }
              "
            ></b-icon>
          </div>
          <vue-json-pretty
            showLength
            showLine
            :data="bidlistText"
            :virtual="true"
            :itemHeight="10"
            class="bidlist-area-text"
          >
          </vue-json-pretty>
        </div>
        <b-table
          responsive
          sticky-header
          hover
          small
          :items="filterPredictedData"
          class="data-table"
          :tbody-tr-class="rowClass"
          select-mode="multi"
          selectable
          @row-selected="onRowSelected"
          ref="selectableTable"
        >
          <!-- Example scoped slot for select state illustrative purposes -->
          <template #cell(selected)="{ rowSelected }">
            <template v-if="rowSelected">
              <span aria-hidden="true">&check;</span>
              <span class="sr-only">Selected</span>
            </template>
            <template v-else>
              <span aria-hidden="true">&nbsp;</span>
              <span class="sr-only">Not selected</span>
            </template>
          </template></b-table
        >
      </div>
      <div v-if="predictNotFound">
        <h3 class="query-not-found">Data not found</h3>
      </div>
    </b-card>
  </div>
</template>

<script>
import axios from "axios";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";

export default {
  name: "PredictCard",
  components: {
    PulseLoader,
    VueJsonPretty,
  },
  props: {
    advertiser: null,
  },
  data() {
    return {
      predictStartDate: null,
      predictEndDate: null,
      saveChecked: false,
      advertiserSelected: "",
      campaignSelected: "",
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
      adgroupOptions: [
        {
          value: "",
          text: "Please select adgroup id",
          disabled: true,
        },
      ],
      adgroupSelected: "",
      predictedData: [],
      filterPredictedData: [],
      predictLoading: false,
      predictNotFound: false,
      cpuFilter: null,
      selectedRow: [],
      isRowSelected: false,
      bidlistCreated: false,
      bidlistText: [],
    };
  },
  methods: {
    fetchPredict() {
      this.predictedData = [
        { key: "1", value: 1 },
        { key: "1", value: 2 },
        { key: "1", value: 3 },
        { key: "1", value: 4 },
        { key: "1", value: 5 },
        { key: "1", value: 6 },
      ];
      this.filterPredictedData = this.predictedData;

      // this.predictLoading = true;
      // axios
      //   .get(process.env.VUE_APP_BASE_URL + "/predict_cpu", {
      //     params: {
      //       campaign_id: this.campaignSelected,
      //       adgroup_id: this.adgroupSelected,
      //       start_date: this.predictStartDate,
      //       end_date: this.predictStartDate,
      //       is_save: this.saveChecked,
      //     },
      //   })
      //   .then((res) => {
      //     console.log(res.data.message);
      //     this.predictedData = res.data.message;
      //   })
      //   .finally(() => {
      //     this.predictLoading = false;
      //     if (this.predictedData.length !== 0) {
      //       this.predictNotFound = false;
      //     } else {
      //       this.predictNotFound = true;
      //     }
      //     this.filterPredictedData = this.predictedData;
      //   });
    },
    rowClass(item, type) {
      if (!item || type !== "row") return;
      if (item.CPU === 0.012695 || item.CPU === 0.02126625)
        return "table-warning";
    },
    filterData() {
      this.filterPredictedData = this.predictedData.filter(
        (row) => row.CPU > +this.cpuFilter
      );

      this.cpuFilter = null;
    },
    resetFilter() {
      this.filterPredictedData = this.predictedData;
    },
    onRowSelected(item) {
      this.selectedRow = item;
      console.log("this.bidlistText", this.bidlistText);
      console.log("this.selectedRow", this.selectedRow);
      this.bidlistText = this.selectedRow;
      this.isRowSelected = this.selectedRow.length !== 0 ? true : false;
    },
    createBidlist() {
      this.bidlistCreated = true;
      this.bidlistText = this.selectedRow;
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
      (this.adgroupOptions = [
        {
          value: "",
          text: "Please select adgroup id",
          disabled: true,
        },
      ]),
        axios
          .get(process.env.VUE_APP_BASE_URL + "/campaign_list", {
            params: {
              advertiserid: val,
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
          });
    },
    campaignSelected(val) {
      axios
        .get(process.env.VUE_APP_BASE_URL + "/adgroups_list", {
          params: {
            campaignid: val,
          },
        })
        .then((res) => {
          res.data.message
            .map((item) => ({
              value: item.AdGroupId,
              text: item.AdGroupId,
            }))
            .forEach((element) => {
              this.adgroupOptions.push(element);
            });
          console.log(this.adgroupOptions);
        });
    },
  },
  mounted() {
    console.log("ads", this.advertiser);
    this.advertiser.forEach((el) => {
      this.advertiserOptions.push({
        value: el.name,
        text: el.name,
      });
    });
  },
};
</script>

<style>
.input-group {
  display: flex;
  flex-wrap: wrap;
}
.select-group {
  max-width: 350px;
  margin: 20px;
}
.search-button {
  margin-top: 30px;
}
.data-table {
  max-height: 900px;
}
.query-not-found {
  margin-top: 50px;
  text-align: center;
}
.save-switch {
  margin-top: 40px;
}
.cpu-enter {
  margin-top: 20px;
  margin-left: 30px;
  max-width: 100px;
}
.filter-button {
  margin-top: 20px;
  margin-left: 30px;
}
.bidlist-area {
  margin: 40px 20px;
  max-height: 400px;
}
.bidlist-area-text {
  min-height: 400px;
  max-height: 400px;
  background-color: #fdf5df;
  overflow: auto;
}
.icon-group {
  height: 20px;
}
.close-icon {
  float: right;
}
.close-icon:hover {
  cursor: pointer;
}
</style>
