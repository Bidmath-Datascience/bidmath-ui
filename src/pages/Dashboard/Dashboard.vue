<template>
  <v-container fluid>
    <div class="dashboard-page">
      
    </div>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  name: "Dashboard",
  data() {
    return {
      bidlistData: [],
      addBidlistModal: false,
      loadingAdd: false,
      loadingBidlist: false,
      token:'',
      adddialog: false,
      adddialogresult: "testtt",
      postdata: {
          partner: "",
          advertiser_id : "",
          campaign_id: "",
          adgroup_id: "",
          vr_value: 85,
          vcr_value:0,
          adjustment_type:'',
          goal_type: '',
          goal_value:'',
          cpm_value: '',
          goal_currency: '',
          cpm_currency: '',
          dimension_list: 'Site,DeviceType,RenderingContext'
      },

    };
  },
  methods: {
    fetchBidlist() {
        this.loadingBidlist = true;
      axios.get(process.env.VUE_APP_BASE_URL + "/ttd_api/bidlist",
      { 
           headers: {"Content-Type": "application/json",
           'Authorization':  `Bearer ${this.token}`
           }
      }
      ).then((res) => {
        if (res.status == 200){
        this.bidlistData = res.data.message;
        this.bidlistData = this.bidlistData.map((el) => ({
          ...el,
          GoalVCR: `${+el.GoalVCR * 100} %`,
          GoalVR: `${+el.GoalVR * 100} %`,
          Latest_update: new Date(el.Latest_update).toLocaleString(),

        }));
        this.loadingDelete = false;
        this.loadingBidlist = false;
        } else {
            this.$router.push('/login');
        }

      });

    },
    showAddBidlistModal() {
      this.adddialog = true;
    },
    deleteBidlist(row) {
      // console.log("delete", row.item.BidlistId, row.item.AdGroupId);
      this.loadingDelete = true;
      axios.delete(process.env.VUE_APP_BASE_URL + "/ttd_api/bidlist", {
          params: {
            partner: row.Partner,
            adgroup_id: row.AdGroupId,
            bidlist_id: row.BidlistId
          },
           headers: {"Content-Type": "application/json",
           'Authorization':  `Bearer ${this.token}`
           }
        })
        .then((res) => {
          console.log(res);
          this.fetchBidlist();
        });
    },
    createAdgroup() {
      this.loadingAdd = true;
      axios
        .post(process.env.VUE_APP_BASE_URL + "/ttd_api/bidlist", 
        this.postdata, { 
          headers: {"Content-Type": "application/json",
           'Authorization':  `Bearer ${this.token}`
           }
        })
        .then((res) => {
          console.log(res.data);
          // this.createAdgroupRes = res.data;
          this.adddialogresult = res.data.message;
          this.fetchBidlist();
        })
        .finally(() => {
          this.loadingAdd = false;
          this.adddialog = true;
        });
    },
  },
  mounted() {
    setTimeout(() => {
      this.apexLoading = true;
    });
    this.token = this.$cookies.get("token").access_token
    //this.fetchBidlist()
  },
};
</script>

<style src="./Dashboard.scss" lang="scss"/>
