<template>
  <v-container fluid>
    <div class="dashboard-page">
      <v-row no-gutters class="d-flex justify-space-between mt-10 mb-6">
        <h1 class="page-title">Tradedesk Campaigns</h1>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-card class="support-requests mx-1 mb-1">
            <v-row >
            <v-col>
            <v-card-title class="pa-6 pb-0">
              <p>Live Algo Adgroups</p>
              <v-spacer></v-spacer>
            </v-card-title>
            </v-col>
            <v-col>
            <v-spacer />
            <v-card-actions>
            <v-btn class="add-button"
                color="primary"
                @click="showAddBidlistModal"
                :disabled="adddialog"
         
            >Add</v-btn>
            <v-spacer></v-spacer>
            </v-card-actions>
            </v-col>
            </v-row>
            <v-card-text class="pa-0" v-if="!loadingBidlist">
              <v-simple-table>
                <template v-slot:default>
                  <thead class="pl-2">
                    <tr>
                      <th class="text-left pa-6">PARTNER</th>
                      <th class="text-left">ADVERTISER</th>
                      <th class="text-left">CAMPAIGN</th>
                      <th class="text-left">ADGROUP</th>
                      <th class="text-left">BIDLISTID</th>
                      <th class="text-left">VCR</th>
                      <th class="text-left">VR</th>
                      <th class="text-left">GOAL TYPE</th>
                      <th class="text-left">GOAL VALUE</th>
                      <th class="text-left">CPM</th>
                      <th class="text-left">BIDTYPE</th>
                      <th class="text-left">UPDATE</th>
                      <th class="text-left">OPTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                      <tr v-for="item in bidlistData" :key="item">
                          <td> {{item.Partner}}</td>
                          <td> {{item.AdvertiserId}}</td>
                          <td> {{item.CampaignId}}</td>
                          <td> {{item.AdGroupId}}</td>
                          <td> {{item.BidlistId}}</td>
                          <td> {{item.GoalVCR}}</td>
                          <td> {{item.GoalVR}}</td>
                          <td> {{item.GoalType}}</td>
                          <td> {{item.GoalValuePartner}} {{item.PartnerCur}}</td>
                          <td> {{item.CpmValuePartner}} {{item.PartnerCur}}</td>
                          <td> {{item.BidType}}</td>
                          <td> {{item.Latest_update}}</td>
                          <td> <v-btn color="error" @click="deleteBidlist(item)" :disabled="loadingDelete">
                              Remove</v-btn></td>
                      </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card-text>
            <v-card-text v-else-if="loadingBidlist" align="center">
            <v-progress-circular
                :size="70"
                :width="7"
                color="purple"
                indeterminate
            ></v-progress-circular>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <template>
  <v-row justify="center">
    <v-dialog
      v-model="adddialog"
      persistent
      max-width="600px"
    >
      <v-card>
        
        <v-card-title>
          <span class="text-h5">Create Adgroup</span>
        </v-card-title>
        <v-card-text v-if="!loadingAdd" >
          <v-container>
            <v-row>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-select
                  v-model="postdata.partner"
                  :items="['PnG_Thailand', 'PnG_Japan']"
                  label="Partner*"
                  required
                ></v-select>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-text-field
                  v-model="postdata.advertiser_id"
                  label="Advertiser Id"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-text-field
                  label="Campaign Id"
                  v-model="postdata.campaign_id"
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-text-field
                  v-model="postdata.adgroup_id"
                  label="Adgroup Id"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-text-field
                  v-model="postdata.vcr_value"
                  label="Goal VCR %"
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-text-field
                  v-model="postdata.vr_value"
                  label="Goal VR %"
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-select
                  v-model="postdata.goal_type"
                  :items="['cpcv', 'vcpm']"
                  label="Goal Type"
                  required
                ></v-select>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-text-field
                  v-model="postdata.goal_value"
                  label="Goal Value"
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-select
                  v-model="postdata.goal_currency"
                  :items="['THB', 'USD', 'JPY']"
                  label="Currency"
                  required
                ></v-select>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-select
                   v-model="postdata.adjustment_type"
                  :items="['TargetList', 'Optimized']"
                  label="Bid Type"
                  required
                ></v-select>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-text-field
                  v-model="postdata.cpm_value"
                  label="Goal CPM"
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-select
                  v-model="postdata.cpm_currency"
                  :items="['THB', 'USD', 'JPY']"
                  label="Currency"
                  required
                ></v-select>
              </v-col>
              <v-col
              >
                <v-text-field
                  v-model="postdata.dimension_list"
                  label="Dimension List"
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>

            </v-row>
            <p>Result</p>
            <v-row>
              <div class="json-result">
          <vue-json-pretty
            showLength
            showLine
            :data="adddialogresult"
            :virtual="true"
            :itemHeight="10"
            class="bidlist-area-text"
          >
        </vue-json-pretty>
      </div>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-text v-else-if="loadingAdd" align="center">
            <v-progress-circular
                :size="70"
                :width="7"
                color="purple"
                indeterminate
            ></v-progress-circular>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="adddialog = false"
          >
            Close
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="createAdgroup"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </v-row>
    </template>
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
    this.fetchBidlist()
  },
};
</script>

<style src="./Dashboard.scss" lang="scss"/>
