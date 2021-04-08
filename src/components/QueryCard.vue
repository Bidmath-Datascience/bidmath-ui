<template>
  <div>
    <b-card
      title="Query data from BigQuery"
      sub-title="Limited 500 rows"
      class="api-card text-left"
    >
      <div class="input-group">
        <div class="select-group">
          <h5>Select table name</h5>
          <b-form-select
            v-model="tebleSelected"
            @change="changeAdvertiser"
            :options="tableOptions"
          ></b-form-select>
        </div>
        <div class="select-group">
          <h5>Select advertiser</h5>
          <b-form-select
            :disabled="checkDisabled"
            v-model="advertiserSelected"
            :options="advertiserOptions"
          ></b-form-select>
        </div>
        <div class="select-group">
          <h5>Select start date</h5>
          <b-form-datepicker
            id="start-date"
            v-model="startDate"
            class="mb-2"
          ></b-form-datepicker>
        </div>
        <div class="select-group">
          <h5>Select end date</h5>
          <b-form-datepicker
            id="end-date"
            v-model="endDate"
            class="mb-2"
          ></b-form-datepicker>
        </div>
        <div class="select-group">
          <b-button
            class="search-button"
            variant="primary"
            @click="handleSearch"
          >
            <pulse-loader
              v-if="loadingQuery"
              size="10px"
              color="#FBF9F8"
            ></pulse-loader>
            <span v-else> Search </span>
          </b-button>
        </div>
      </div>
      <b-table
        v-if="queryData.length != 0"
        responsive
        striped
        sticky-header
        hover
        small
        :items="queryData"
        class="data-table"
      ></b-table>
      <div v-if="queryNotFound">
        <h3 class="query-not-found">Data not found</h3>
      </div>
    </b-card>
  </div>
</template>

<script>
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import axios from "axios";
import moment from "moment";

export default {
  name: "QueryCard",
  components: {
    PulseLoader,
  },
  props: {
    advertiser: null,
  },
  data() {
    return {
      tebleSelected: "",
      advertiserSelected: "",
      tableOptions: [
        { value: "", text: "Please select table name", disabled: true },
        { value: "TTD_Impressions_raw", text: "Impressions" },
        { value: "TTD_Video_events_raw", text: "Video envents" },
        { value: "TTD_Aggregated_data", text: "Merged logs" },
      ],
      advertiserOptions: [
        { value: "", text: "Please select advertiser id", disabled: true },
      ],
      startDate: "",
      endDate: "",
      advertiserId: "",
      queryData: [],
      queryNotFound: null,
      loadingQuery: false,
    };
  },
  methods: {
    handleSearch() {
      console.log(
        `Search ${this.tebleSelected} ${this.startDate} ${this.endDate} ${this.advertiserSelected}`
      );
      this.loadingQuery = true;
      axios
        .get(process.env.VUE_APP_BASE_URL + "/query", {
          params: {
            table_name: this.tebleSelected,
            advertiser_id: this.advertiserSelected,
            start_date: this.startDate,
            end_date: this.endDate,
          },
        })
        .then((res) => {
          console.log(res.data.message);
          this.queryData = res.data.message.map((item) => ({
            ...item,
            Lastest_Date_Run: moment(item.Lastest_Date_Run).format(
              "DD/MM/YYYY HH:mm"
            ),
          }));
        })
        .finally(() => {
          this.loadingQuery = false;
          if (this.queryData.length !== 0) {
            this.queryNotFound = false;
          } else {
            this.queryNotFound = true;
          }
        });
    },
    transformAdvertiser() {
      this.advertiser.forEach((element) => {
        this.advertiserOptions.push({
          value: element.name,
          text: element.name,
        });
      });
    },
    changeAdvertiser(e) {
      if (e === "TTD_Aggregated_data") {
        this.advertiserSelected = "";
      }
    },
  },
  computed: {
    checkDisabled() {
      return this.tebleSelected === "TTD_Aggregated_data";
    },
  },
  mounted() {
    this.transformAdvertiser();
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
  max-width: 900px;
  max-height: 900px;
}
.query-not-found {
  margin-top: 50px;
  text-align: center;
}
</style>
