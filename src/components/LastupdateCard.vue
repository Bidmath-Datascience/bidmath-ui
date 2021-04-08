<template>
  <div>
    <b-card
      title="Last update data"
      sub-title="Get yesterday log data and upload to BigQuery"
      class="api-card text-left"
    >
      <b-table
        v-if="log_data.length !== 0"
        striped
        hover
        :items="log_data"
        :fields="[
          'Advertiser_Id',
          { key: 'Last_update', label: 'Last Update (UTC time)' },
        ]"
        class="data-table"
      ></b-table>
    </b-card>
  </div>
</template>

<script>
import axios from "axios";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

export default {
  name: "LastupdateCard",
  components: {},
  data() {
    return {
      logData: null,
      log_data: [],
    };
  },
  methods: {
    fetch_log() {
      var out_put = [];
      axios
        .get(process.env.VUE_APP_BASE_URL + "/log")
        .then((data) => {
          // console.log(data.data.message);
          data.data.message.forEach((item) => {
            out_put.push(item[1]);
          });
        })
        .finally(() => {
          const remane_out_put = out_put.reduce(
            (obj, item) => ({
              ...obj,
              [item.Advertiser_Id]: new Date(item.timestamp)
                .toString()
                .slice(0, 24),
            }),
            {}
          );
          // console.log(remane_out_put);
          this.log_data = Object.keys(remane_out_put).map((key) => ({
            Advertiser_Id: key,
            Last_update: remane_out_put[key],
          }));
        });
    },
  },
  mounted() {
    this.fetch_log();
  },
};
</script>
<style>
.api-card {
  width: 70%;
  margin: auto;
  margin-top: 50px;
}
.data-table {
  max-width: 800px;
  margin: auto;
  margin-top: 30px;
}
</style>
