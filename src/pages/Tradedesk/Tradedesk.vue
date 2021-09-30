<template>
  <v-container fluid>
    <div class="tradedesk-page">
      <v-row no-gutters class="d-flex justify-space-between mt-10 mb-6">
        <h1 class="page-title">Tradedesk Campaigns</h1>
      </v-row>
      <v-row >
        <v-col cols="12">
          <v-card class="support-requests mx-1 mb-1">
            <v-row >
            <v-col>
            <v-card-title class="pa-6 pb-0">
              <p>Tracked Adgroups</p>
            </v-card-title>
            </v-col>
            <v-divider class="mx-4" inset vertical> </v-divider>
            <v-col>
            <v-card-actions>
            <v-btn class="add-button"
                color="primary"
                @click="showAddAdgroupModal"
                :disabled="addadgroupdialog"
         
            >Add</v-btn>
            </v-card-actions>
            </v-col>
            </v-row>
        
          <template>
          <v-card-text class="pa-0" v-if="!loadingBidlist">
            <v-data-table :headers="adgroup_headers" :items="adgroupData" class="elevation-1">
              <template v-slot:item.status = '{item}'>
              <v-switch :input-value="item.status" flat @click="changeState(item)" ></v-switch>
              </template>
              <template v-slot:item.options = "{item}">
              <v-icon medium @click="deleteAdgroup(item)"  :disabled="loadingDelete" >
              mdi-delete
              </v-icon>
              </template>
              <template v-slot:item.create_bl = "{item}">
                <v-btn class="add-button"
                color="primary"
                small
                @click="showAddBidlistModal(item)"
                :disabled="addbidlistdialog"
                >New</v-btn>
              </template>
            </v-data-table>
          </v-card-text>
            <v-card-text v-else-if="loadingBidlist" align="center">
            <v-progress-circular
                :size="60"
                :width="7"
                color="purple"
                indeterminate
            ></v-progress-circular>
            </v-card-text>
          </template>
        </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-card class="support-requests mx-1 mb-1">
            <v-row >
            <v-col>
            <v-card-title class="pa-6 pb-0">
              <p>Tracked Bidlists</p>
            </v-card-title>
            </v-col>
            </v-row>
        
        <template>
        <v-card-text class="pa-0" v-if="!loadingBidlist">
          <v-data-table :headers="bidlist_headers" :items="bidlistData" class="elevation-1"
          :single-expand="singleExpand" show-expand
          :expanded.sync="expanded">
          <template v-slot:item.options = "{item}">
            <v-icon medium @click="deleteBidlist(item)"  :disabled="loadingDelete" >
            mdi-delete
            </v-icon>
            </template>
            <template v-slot:expanded-item="{ headers, item }">
            <td> </td>
            <td :colspan="headers.length-1">
              <v-card flat>
                <v-list-item>
                <v-list-item-content>
                <v-list-item-title>goal_vr :{{ item.goal_vr }},  goal_vcr :{{ item.goal_vcr }}, goal_value_partner :{{ item.goal_value_partner }}, cpm_value_partner: {{item.cpm_value_partner}}</v-list-item-title>
                </v-list-item-content>
                </v-list-item>
                <v-list-item>
                <v-list-item-content>
                <v-list-item-title>count: {{item.count}}, owner: {{item.owner}}, owner_id: {{item.owner_id}} </v-list-item-title>
                </v-list-item-content>
                </v-list-item>
                <v-list-item>
                <v-list-item-content>
                <v-list-item-title>dimension_list: {{item.dimension_list}} </v-list-item-title>
                </v-list-item-content>
                </v-list-item>
              </v-card>
            </td>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-text v-else-if="loadingBidlist" align="center">
          <v-progress-circular
                :size="70"
                :width="7"
                color="purple"
                indeterminate
          ></v-progress-circular>
        </v-card-text>
      </template>
          </v-card>
        </v-col>
      </v-row>

  <template>
  <v-row justify="center">
    <v-dialog
      v-model="addadgroupdialog"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">Add Adgroup</span>
        </v-card-title>
        <v-card-text v-if="!loadingAdd" >
          <v-container>
            <v-row>
              <v-col cols="6" >
                <v-text-field
                  v-model="postadgroupdata.name"
                  label="Name"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="6" >
                <v-select
                  v-model="postadgroupdata.partner"
                  :items="['PnG_Thailand', 'PnG_Japan']"
                  label="Partner*"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="postadgroupdata.advertiser_id"
                  label="Advertiser Id"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  label="Campaign Id"
                  v-model="postadgroupdata.campaign_id"
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4" >
                <v-text-field
                  v-model="postadgroupdata.adgroup_id"
                  label="Adgroup Id"
                ></v-text-field>
              </v-col>
              <v-col cols=auto >
                <v-checkbox
                v-model="postadgroupdata.create_algo"
                label="create algo bidlist"
                ></v-checkbox>
              </v-col>
            </v-row>
            <v-card-text v-if="postadgroupdata.create_algo">
            <v-row >
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-select
                   v-model="postbidlistdata.strategy"
                  :items="['algo', 'volumepriority','targetlist', 'blocklist']"
                  label="Stategy"
                  required
                ></v-select>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-text-field
                  v-model="postbidlistdata.vcr_value"
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
                  v-model="postbidlistdata.vr_value"
                  label="Goal VR %"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-select
                  v-model="postbidlistdata.goal_type"
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
                  v-model="postbidlistdata.goal_value"
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
                  v-model="postbidlistdata.goal_currency"
                  :items="['THB', 'USD', 'JPY']"
                  label="Goal Currency"
                  required
                ></v-select>
              </v-col>
              <v-col cols="6" >
                <v-text-field
                  v-model="postbidlistdata.cpm_value"
                  label="Goal CPM"
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="6" >
                <v-select
                  v-model="postbidlistdata.cpm_currency"
                  :items="['THB', 'USD', 'JPY']"
                  label="CPM Currency"
                  required
                ></v-select>
              </v-col>
              <v-col
              cols="12"
              >
                <v-text-field
                  v-model="postbidlistdata.dimension_list"
                  label="Dimension List"
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            </v-card-text>
            <v-col cols="12">
                <v-textarea
                  clearable
                  label="Result"
                  v-model="adddialogresult"
                ></v-textarea>
            </v-col>
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
            @click="addadgroupdialog = false"
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
  
    <template>
  <v-row justify="center">
    <v-dialog
      v-model="addbidlistdialog"
      persistent
      max-width="620px"
    >
      <v-card>
        
        <v-card-title>
          <span class="text-h5">Create Bidlist</span>
        </v-card-title>
        <v-card-text v-if="!loadingAdd" >
          <v-container>
            <v-row>
              <v-col cols="3" >
                <v-select
                  v-model="postbidlistdata.partner"
                  :items="['PnG_Thailand', 'PnG_Japan']"
                  label="Partner*"
                  required
                ></v-select>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="postbidlistdata.advertiser_id"
                  label="Advertiser Id"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="postbidlistdata.campaign_id"
                  label="Advertiser Id"
                ></v-text-field>
              </v-col>
              <v-col cols="3" >
                <v-text-field
                  v-model="postbidlistdata.adgroup_id"
                  label="Adgroup Id"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-select
                   v-model="postbidlistdata.strategy"
                  :items="['algo', 'volumepriority','targetlist', 'blocklist']"
                  label="Stategy"
                  required
                ></v-select>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-text-field
                  v-model="postbidlistdata.vcr_value"
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
                  v-model="postbidlistdata.vr_value"
                  label="Goal VR %"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-select
                  v-model="postbidlistdata.goal_type"
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
                  v-model="postbidlistdata.goal_value"
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
                  v-model="postbidlistdata.goal_currency"
                  :items="['THB', 'USD', 'JPY']"
                  label="Goal Currency"
                  required
                ></v-select>
              </v-col>
              <v-col cols="6" >
                <v-text-field
                  v-model="postbidlistdata.cpm_value"
                  label="Goal CPM"
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="6" >
                <v-select
                  v-model="postbidlistdata.cpm_currency"
                  :items="['THB', 'USD', 'JPY']"
                  label="CPM Currency"
                  required
                ></v-select>
              </v-col>
              <v-col cols="6" >
                <v-select
                  v-model="postbidlistdata.owner"
                  :items="['Advertiser', 'Adgroup', 'Campaign']"
                  label="Bidlist Owner"
                  required
                ></v-select>
              </v-col>
              <v-col cols="6" >
                <v-text-field
                  v-model="postbidlistdata.owner_id"
                  label="Owner Id"
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>
              <v-col
              cols="12"
              >
                <v-text-field
                  v-model="postbidlistdata.dimension_list"
                  label="Dimension List"
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  clearable
                  label="Result"
                  v-model="adddialogresult"
                ></v-textarea>
            </v-col>
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
            @click="addbidlistdialog = false"
          >
            Close
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="createBidlist"
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
  name: "Tradedesk",
  data() {
    return {
      expanded: [],
      singleExpand: false,
      adgroup_headers: [
        {
          text: 'NAME',
          align: 'start',
          value: 'name',
        },
        { text: 'PARTNER', value: 'partner' },
        { text: 'ADGROUP', value: 'adgroup_id' },
        { text: 'ADVERTISER', value: 'advertiser_id' },
        { text: 'CAMPAIGN', value: 'campaign_id' },
        { text: 'STATUS', value: 'status', sortable: false  },
        { text: 'OPTIONS', value: 'options', sortable: false },
        { text: 'BIDLIST', value: 'create_bl', sortable: false }
      ],
      bidlist_headers: [
        {
          text: 'BIDLIST',
          align: 'start',
          value: 'bidlist_id',
        },
        { text: 'PARTNER', value: 'partner' },
        { text: 'ADGROUP', value: 'adgroup_id' },
        { text: 'STRATEGY', value: 'strategy' },
        { text: 'GOALTYPE', value: 'goal_type' },
        { text: 'PARTNER CUR', value: 'partner_cur' },
        { text: 'LATEST UPDATE', value: 'latest_update' },
        { text: 'OPTIONS', value: 'options', sortable: false },
      ],
      
      adgroupData: [],
      bidlistData: [],
      addBidlistModal: false,
      loadingAdd: false,
      loadingBidlist: false,
      token:'',
      dummy:'',
      addadgroupdialog: false,
      addbidlistdialog: false,
      adddialogresult: "No response yet",
      postadgroupdata: {
          name: "",
          partner: "",
          advertiser_id : "",
          campaign_id: "",
          adgroup_id: "",
          create_algo: 0
      },
      postbidlistdata: {
        partner: "",
        advertiser_id : "",
        campaign_id: "",
        adgroup_id: "",
        strategy: "algo",
        goal_type: "vcpm",
        goal_vr: '',
        goal_vcr:'',
        count: '1000',
        owner: "Adgroup",
        owner_id: "",
        dimension_list: "Site,DeviceType,RenderingContext",
        goal_value: '',       
        goal_currency: "",
        cpm_value: '' ,
        cpm_currency: ""
      },
      postCreateAdgroupdta: {
        "adgroup": this.postadgroupdata,
        "bidlist": this.postbidlistdata
      }

    };
  },
  methods: {
    fetchAdgroup() {
      this.loadingBidlist = true;
      axios.get(process.env.VUE_APP_BASE_URL + "/ttd_api/ttd_adgroup",
      { 
           headers: {"Content-Type": "application/json",
           'Authorization':  `Bearer ${this.token}`
           }
      }
      ).then((res) => {
        if (res.status == 200){
        this.adgroupData = res.data.message;
        this.adgroupData = this.adgroupData.map((el) => ({
          ...el,
        }));
        this.loadingDelete = false;
        this.loadingBidlist = false;
        } else {
            this.$router.push('/login');
        }

      });

    },
    fetchBidlist() {
        this.loadingBidlist = true;
      axios.get(process.env.VUE_APP_BASE_URL + "/ttd_api/ttd_bidlist",
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
          goal_vr: `${+el.goal_vr * 100} %`,
          goal_vcr: `${+el.goal_vcr * 100} %`,
          latest_update: new Date(el.latest_update).toLocaleString(),

        }));
        this.loadingDelete = false;
        this.loadingBidlist = false;
        } else {
            this.$router.push('/login');
        }

      });

    },
    changeState(item) {
      this.loadingBidlist = true;
      console.log(this.token);
      console.log(item);
      axios.post(process.env.VUE_APP_BASE_URL + "/ttd_api/ttd_adgroup_status/"+ item.adgroup_id, {
            params: {
            partner: item.partner,
            adgroup_id: item.adgroup_id,
            value: item.status
          },
           headers: {"Content-Type": "application/json",
           'Authorization':  `Bearer ${this.token}`
           }
        })
        .then((res) => {
          console.log(res.data);
          // this.createAdgroupRes = res.data;
          this.fetchAdgroup();
        });
    },
    showAddBidlistModal(item) {
      this.postbidlistdata.partner = item.partner;
      this.postbidlistdata.adgroup_id = item.adgroup_id;
      this.postbidlistdata.advertiser_id = item.advertiser_id;
      this.postbidlistdata.campaign_id = item.campaign_id;
      this.addbidlistdialog = true;
    },
    showAddAdgroupModal() {
      this.addadgroupdialog = true;
    },
    deleteBidlist(row) {
      // console.log("delete", row.item.BidlistId, row.item.AdGroupId);
      this.loadingDelete = true;
      axios.delete(process.env.VUE_APP_BASE_URL + "/ttd_api/ttd_bidlist/"+row.bidlist_id, {
          params: {
            partner: row.partner,
            bidlist_id: row.bidlist_id
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
    deleteAdgroup(row) {
      // console.log("delete", row.item.BidlistId, row.item.AdGroupId);
      this.loadingDelete = true;
      axios.delete(process.env.VUE_APP_BASE_URL + "/ttd_api/ttd_adgroup/"+row.adgroup_id, {
          params: {
            partner: row.partner,
            adgroup_id: row.adgroup_id
          },
           headers: {"Content-Type": "application/json",
           'Authorization':  `Bearer ${this.token}`
           }
        })
        .then((res) => {
          console.log(res);
          this.fetchAdgroup();
          this.fetchBidlist();
        });
    },
    createAdgroup() {
      this.loadingAdd = true;
      console.log(this.postadgroupdata);
      console.log(this.postbidlistdata);
      axios
        .post(process.env.VUE_APP_BASE_URL + "/ttd_api/ttd_adgroup", 
        { 
          body: {"adgroup" : this.postadgroupdata, "bidlist" : this.postbidlistdata},
          headers: {"Content-Type": "application/json",
           'Authorization':  `Bearer ${this.token}`
           }
        })
        .then((res) => {
          console.log(res.data);
          // this.createAdgroupRes = res.data;
          this.adddialogresult = res.data.message;
          this.fetchBidlist();
          this.fetchAdgroup();
        })
        .finally(() => {
          this.loadingAdd = false;
          this.addadgroupdialog = true;
        });
    },
    createBidlist() {
      this.loadingAdd = true;
      axios
        .post(process.env.VUE_APP_BASE_URL + "/ttd_api/ttd_bidlist", 
        this.postbidlistdata, { 
          headers: {"Content-Type": "application/json",
           'Authorization':  `Bearer ${this.token}`
           }
        })
        .then((res) => {
          console.log(res.data);
          // this.createAdgroupRes = res.data;
          this.adddialogresult = res.data.message;
          this.fetchBidlist();
          this.fetchAdgroup();
        })
        .finally(() => {
          this.loadingAdd = false;
          this.addadgroupdialog = true;
        });
    },
  },
  mounted() {
    setTimeout(() => {
      this.apexLoading = true;
    });
    this.token = this.$cookies.get("token").access_token
    this.fetchBidlist()
    this.fetchAdgroup()
  },
};
</script>

<style src="./Tradedesk.scss" lang="scss"/>
