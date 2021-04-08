<template>
  <div id="app">
    <h2>Bidmath - Programmatic AI</h2>
    <div v-if="advertiser.length !== 0">
      <div class="card-list">
        <CreateAdgroup :advertiser="advertiser" />
        <!-- <PredictCard :advertiser="advertiser" /> -->
        <RunningAdsCard
          :advertiser="advertiser"
          @create-job="(payload) => this.advertiser.push(payload)"
          @delete-job="(payload) => (this.advertiser = payload)"
          @update-job="updateJob"
        />
        <LastupdateCard />
        <QueryCard :advertiser="advertiser" class="last-card" />
      </div>
    </div>
    <div v-else class="spinner">
      <b-spinner variant="success" label="Spinning"></b-spinner>
    </div>
  </div>
</template>

<script>
import axios from "axios";

import LastupdateCard from "./components/LastupdateCard";
import RunningAdsCard from "./components/RunningAdsCard";
import QueryCard from "./components/QueryCard";
// import PredictCard from "./components/PredictCard";
import CreateAdgroup from "./components/CreateAdgroup";

export default {
  name: "App",
  components: {
    LastupdateCard,
    RunningAdsCard,
    QueryCard,
    // PredictCard,
    CreateAdgroup,
  },
  data() {
    return {
      advertiser: [],
    };
  },
  methods: {
    get_advertiser_list() {
      axios.get(process.env.VUE_APP_BASE_URL + "/list_job").then((data) => {
        this.advertiser = data.data.message.map((item) => {
          return {
            name: item.Job_name,
            status: item.state === 1 ? "active" : "inactive",
          };
        });
      });
    },
    updateJob(payload) {
      const index = this.advertiser.findIndex((el) => el.name === payload.name);
      this.advertiser.splice(index, 1, payload);
    },
  },
  mounted() {
    this.get_advertiser_list();
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.card-list {
  min-width: 960px;
}
.spinner {
  margin-top: 20px;
}
.last-card {
  margin-bottom: 100px;
}
</style>
