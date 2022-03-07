<template>
  <v-app>
  <v-container fluid>
    <div class="planningtool-page" :style="{'background-image': 'url(' + require(`@/assets/intro-bg.svg`) + ')' }" >
      <v-row>
        <v-app-bar
    class="main-header"
    height="64"
    fixed
    color='white'>
      <h1 style="font-size:20px;color:black;font-family:Hind">
     BIDMATH - REACH TOOL - TH</h1>
      <v-spacer></v-spacer>
      <v-img  max-height="28"
  max-width="120" src="@/assets/logo_name.png"></v-img> 
      </v-app-bar>
      </v-row>
      
      <v-row >
        <v-col lg="3" sm="6" md="5" cols="8">
          <v-card >
            <v-card-text >
              <v-row no-gutters>
                <v-col >
                  <span
                    class="font-weight-medium card-dark-grey"
                    style="font-size: 16px"
                    >FX Rate: 1 USD =  ฿{{fxrate}}</span>
                </v-col>
                
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row >
        <v-col class="pl-10" lg="3" sm="6" md="5" cols="8">
          <v-card elevation="15">
            <v-card-text >
              <v-row no-gutters>
                <v-col >
                  <span
                    class="font-weight-medium card-dark"
                    style="font-size: 16px; color:black"
                    >FX Rate: 1 USD =  ฿{{fxrate}}</span>
                </v-col>
                
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row >
        
        <v-col class="pl-10" cols="4" >
          <v-card  class="cardColor" elevation="24">
            <v-card-text style="font-size: 20px;">
              <v-container>
              <v-row >
                <v-col cols="6">
                  <span
                    style="font-size: 20px;font-family:Hind;"
                    > Target Audience</span>
                </v-col>
                <v-col cols="6" >
                  <v-select class="myselect"
                  v-model=target_audience
                  :items=get_target_list()
                ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6">
                  
                  <span
                    style="font-size: 20px; font-family:Hind;"
                    > Census </span>
                    
                </v-col>
                <v-col cols="6" >
                  
                    <span
                    style="font-size: 20px; font-family:Hind;"
                    > {{this.dataset[this.target_audience]["TH Census"] | separator}} </span>
                </v-col>
              </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col class="pl-10 pr-10" cols="12">
          <v-card class="support-requests mx-1 mb-1"
          >
            <v-card-title >
             
              <v-spacer></v-spacer>
            </v-card-title>
            <v-card-text>
            <template>
            <v-simple-table fixed-header>
            <template v-slot:default>
            <thead>
            <tr>
            <th width=10%>Digital Solutions
            </th>
            <th width=10%>Platform Universe
            </th>
            <th width=8%>% Reach
            </th>
            <th width=13%>Unit/Video Length
            </th>
            <th width=7%>Frequency Cap/Month
            </th>
            <th width=10%>Potential reach
            </th>
            <th width=10%>Impressions
            </th>
            <th width=6%>CPM (USD) 
            </th>
            <th width=6%>CPM (THB)
            </th>
            <th width=10%>Budget (THB)
            </th>
            <th width=10%>Budget (USD)
            </th>
            </tr>
            </thead>
            <tbody>
            <tr
            v-for="item in reach_data"
            :key="item.solution"
            >
            <td>{{ item.solution}}</td>
            <td>{{ dataset[target_audience][item.name] | separator}}</td>
            <td >
              <v-select class="myselect"
                  v-model= item.reach_per
                  :items=reach_per_items
                  item-text = "value"
                  item-value = "key"
                  style="font-family:Hind"
                ></v-select> 
            </td>
            <td >
              <v-select class="myselect"
                  v-model= item.v_type
                  :items=v_type_data[item.name]
                  item-text = "key"
                  item-value = "key"
                  return-object
                ></v-select> 
            </td>
            <td >
              <v-text-field class="myselect" v-model="item.freq">
              </v-text-field>
            </td>
            <td>{{ calculate_reach(dataset[target_audience][item.name], item.reach_per) | separator}}</td>
            <td>{{ calculate_imp(dataset[target_audience][item.name], item.reach_per, item.freq) | separator}}</td>
            <td>${{ convert_thb_usd(item.v_type.cpm)}}</td>
            <td>฿{{ item.v_type.cpm}}</td>
            <td>฿{{ calculate_budget(item.v_type.cpm, dataset[target_audience][item.name], item.reach_per, item.freq) | separator}}</td>
            <td>${{ calculate_budget_usd(item.v_type.cpm, dataset[target_audience][item.name], item.reach_per, item.freq) | separator}}</td>
            </tr>
            </tbody>
    </template>
            </v-simple-table>
            <p style="font-weight:bold"> *****Duplication between the platform will be approximately 10-15%</p>
            </template>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="pl-10 pr-10" cols="12">
        <v-card >
          <v-card-title>
          How to use Reach Calculator:
          </v-card-title>
          <v-card-text >
        <p class="text-left">
          1. Choose the Target Audience from the dropdown (e.g F18+ or  M18-34 )
        </p>
        <p class="text-left">
          2. Select the % Reach (e.g 30% or 50% ) from dropdown to find out the target audience reach and creative asset format (e.g bumper or 15s video asset ) from Unit/video length dropdown 
        </p>
        <p class="text-left">
          3. Enter the Frequency cap for the campaign (e.g 4 or 6 per month )
        </p>
        <p class="text-left"> 
          4. Potential Impressions, cost per unit (CPM) & Budget will be auto populated respectively
        </p>
        <p class="text-left">
          5. "Standard" in the drop down under "Unit/video lenth" for "Programmatic display" are static IAB standard display banners of desktop and mobile sizes like 300x250, 160x600, 120x600, 728x90, 300x50, 320x50 etc
        </p>
        </v-card-text >
        </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
  </v-app>
</template>

<script>
//import Trend from "vuetrend";
//import ApexChart from "vue-apexcharts";

export default {
  name: "PlanningTool",
  components: {
    //Trend,
    //ApexChart,
    //vueNumeralFilterInstaller
  },
  data() {
    return {
      dataset: {'M, 18-24': {'TH Census': 4694757,
  'programmatic_display': 2878825,
  'programmatic_video': 2536108,
  'youtube': 2970000,
  'facebook': 3304000},
 'M, 18-34': {'TH Census': 9353674,
  'programmatic_display': 5735673,
  'programmatic_video': 5052855,
  'youtube': 7050000,
  'facebook': 8168000},
 'M, 18-44': {'TH Census': 14295799,
  'programmatic_display': 8766184,
  'programmatic_video': 7722591,
  'youtube': 10700000,
  'facebook': 13381000},
 'M, 18-54': {'TH Census': 19634735,
  'programmatic_display': 12040019,
  'programmatic_video': 10606684,
  'youtube': 13800000,
  'facebook': 18484000},
 'M, 18-64': {'TH Census': 24079586,
  'programmatic_display': 14765602,
  'programmatic_video': 13007792,
  'youtube': 15700000,
  'facebook': 22386000},
 'M, 18-65+': {'TH Census': 28021737,
  'programmatic_display': 17182929,
  'programmatic_video': 15137342,
  'youtube': 17000000,
  'facebook': 25802000},
 'M, 25-34': {'TH Census': 4658917,
  'programmatic_display': 2856848,
  'programmatic_video': 2516747,
  'youtube': 4080000,
  'facebook': 4864000},
 'M, 25-44': {'TH Census': 9601042,
  'programmatic_display': 5887359,
  'programmatic_video': 5186483,
  'youtube': 7770000,
  'facebook': 10077000},
 'M, 25-54': {'TH Census': 14939978,
  'programmatic_display': 9161194,
  'programmatic_video': 8070576,
  'youtube': 10800000,
  'facebook': 15180000},
 'M, 25-64': {'TH Census': 19384829,
  'programmatic_display': 11886777,
  'programmatic_video': 10471684,
  'youtube': 12800000,
  'facebook': 19082000},
 'M, 25-65+': {'TH Census': 23326980,
  'programmatic_display': 14304104,
  'programmatic_video': 12601234,
  'youtube': 14000000,
  'facebook': 22498000},
 'M, 35-44': {'TH Census': 4942125,
  'programmatic_display': 3030511,
  'programmatic_video': 2669736,
  'youtube': 3690000,
  'facebook': 5213000},
 'M, 35-54': {'TH Census': 10281061,
  'programmatic_display': 6304347,
  'programmatic_video': 5553829,
  'youtube': 6750000,
  'facebook': 10316000},
 'M, 35-64': {'TH Census': 14725912,
  'programmatic_display': 9029929,
  'programmatic_video': 7954938,
  'youtube': 8690000,
  'facebook': 14218000},
 'M, 35-65+': {'TH Census': 18668063,
  'programmatic_display': 11447256,
  'programmatic_video': 10084488,
  'youtube': 9920000,
  'facebook': 17634000},
 'M, 45-54': {'TH Census': 5338936,
  'programmatic_display': 3273836,
  'programmatic_video': 2884093,
  'youtube': 3060000,
  'facebook': 5103000},
 'M, 45-64': {'TH Census': 9783787,
  'programmatic_display': 5999418,
  'programmatic_video': 5285202,
  'youtube': 4990000,
  'facebook': 9005000},
 'M, 45-65+': {'TH Census': 13725938,
  'programmatic_display': 8416745,
  'programmatic_video': 7414752,
  'youtube': 6230000,
  'facebook': 12421000},
 'M, 55-64': {'TH Census': 4444851,
  'programmatic_display': 2725583,
  'programmatic_video': 2401108,
  'youtube': 1940000,
  'facebook': 3902000},
 'M, 55-65+': {'TH Census': 8387002,
  'programmatic_display': 5142910,
  'programmatic_video': 4530658,
  'youtube': 3180000,
  'facebook': 7318000},
 'M, 65+': {'TH Census': 3942151,
  'programmatic_display': 2417327,
  'programmatic_video': 2129550,
  'youtube': 1240000,
  'facebook': 3416000},
 'F, 18-24': {'TH Census': 4491653,
  'programmatic_display': 2754282,
  'programmatic_video': 2426391,
  'youtube': 2830000,
  'facebook': 3179000},
 'F, 18-34': {'TH Census': 9121834,
  'programmatic_display': 5593509,
  'programmatic_video': 4927615,
  'youtube': 7020000,
  'facebook': 7944000},
 'F, 18-44': {'TH Census': 14251582,
  'programmatic_display': 8739070,
  'programmatic_video': 7698704,
  'youtube': 10900000,
  'facebook': 13243000},
 'F, 18-54': {'TH Census': 20117016,
  'programmatic_display': 12335754,
  'programmatic_video': 10867212,
  'youtube': 14500000,
  'facebook': 18788000},
 'F, 18-64': {'TH Census': 25122259,
  'programmatic_display': 15404969,
  'programmatic_video': 13571044,
  'youtube': 16700000,
  'facebook': 23255000},
 'F, 18-65+': {'TH Census': 30224604,
  'programmatic_display': 18533727,
  'programmatic_video': 16327331,
  'youtube': 18600000,
  'facebook': 27734000},
 'F, 25-34': {'TH Census': 4630181,
  'programmatic_display': 2839227,
  'programmatic_video': 2501224,
  'youtube': 4190000,
  'facebook': 4765000},
 'F, 25-44': {'TH Census': 9759929,
  'programmatic_display': 5984788,
  'programmatic_video': 5272314,
  'youtube': 8110000,
  'facebook': 10064000},
 'F, 25-54': {'TH Census': 15625363,
  'programmatic_display': 9581473,
  'programmatic_video': 8440821,
  'youtube': 11700000,
  'facebook': 15609000},
 'F, 25-64': {'TH Census': 20630606,
  'programmatic_display': 12650687,
  'programmatic_video': 11144653,
  'youtube': 13900000,
  'facebook': 20076000},
 'F, 25-65+': {'TH Census': 25732951,
  'programmatic_display': 15779445,
  'programmatic_video': 13900940,
  'youtube': 15800000,
  'facebook': 24555000},
 'F, 35-44': {'TH Census': 5129748,
  'programmatic_display': 3145561,
  'programmatic_video': 2771090,
  'youtube': 3930000,
  'facebook': 5299000},
 'F, 35-54': {'TH Census': 10995182,
  'programmatic_display': 6742246,
  'programmatic_video': 5939597,
  'youtube': 7490000,
  'facebook': 10844000},
 'F, 35-64': {'TH Census': 16000425,
  'programmatic_display': 9811461,
  'programmatic_video': 8643429,
  'youtube': 9700000,
  'facebook': 15311000},
 'F, 35-65+': {'TH Census': 21102770,
  'programmatic_display': 12940218,
  'programmatic_video': 11399716,
  'youtube': 11600000,
  'facebook': 19790000},
 'F, 45-54': {'TH Census': 5865434,
  'programmatic_display': 3596684,
  'programmatic_video': 3168507,
  'youtube': 3560000,
  'facebook': 5545000},
 'F, 45-64': {'TH Census': 10870677,
  'programmatic_display': 6665899,
  'programmatic_video': 5872340,
  'youtube': 5770000,
  'facebook': 12720000},
 'F, 45-65+': {'TH Census': 15973022,
  'programmatic_display': 9794657,
  'programmatic_video': 8628626,
  'youtube': 7700000,
  'facebook': 14491000},
 'F, 55-64': {'TH Census': 5005243,
  'programmatic_display': 3069215,
  'programmatic_video': 2703832,
  'youtube': 2210000,
  'facebook': 4467000},
 'F, 55-65+': {'TH Census': 10107588,
  'programmatic_display': 6197973,
  'programmatic_video': 5460119,
  'youtube': 4140000,
  'facebook': 8946000},
 'F, 65+': {'TH Census': 5102345,
  'programmatic_display': 3128758,
  'programmatic_video': 2756287,
  'youtube': 1930000,
  'facebook': 4479000},
 'MF, 18-24': {'TH Census': 9186410,
  'programmatic_display': 5633107,
  'programmatic_video': 4962499,
  'youtube': 5810000,
  'facebook': 6483000},
 'MF, 18-34': {'TH Census': 18475508,
  'programmatic_display': 11329181,
  'programmatic_video': 9980469,
  'youtube': 14100000,
  'facebook': 16112000},
 'MF, 18-44': {'TH Census': 28547381,
  'programmatic_display': 17505254,
  'programmatic_video': 15421295,
  'youtube': 21700000,
  'facebook': 26624000},
 'MF, 18-54': {'TH Census': 39751751,
  'programmatic_display': 24375774,
  'programmatic_video': 21473896,
  'youtube': 28300000,
  'facebook': 37272000},
 'MF, 18-64': {'TH Census': 49201845,
  'programmatic_display': 30170571,
  'programmatic_video': 26578836,
  'youtube': 32500000,
  'facebook': 45641000},
 'MF, 18-65+': {'TH Census': 58246341,
  'programmatic_display': 35716656,
  'programmatic_video': 31464673,
  'youtube': 35600000,
  'facebook': 53536000},
 'MF, 25-34': {'TH Census': 9289098,
  'programmatic_display': 5696075,
  'programmatic_video': 5017971,
  'youtube': 8270000,
  'facebook': 9629000},
 'MF, 25-44': {'TH Census': 19360971,
  'programmatic_display': 11872147,
  'programmatic_video': 10458796,
  'youtube': 15900000,
  'facebook': 20141000},
 'MF, 25-54': {'TH Census': 30565341,
  'programmatic_display': 18742667,
  'programmatic_video': 16511397,
  'youtube': 22500000,
  'facebook': 30789000},
 'MF, 25-64': {'TH Census': 40015435,
  'programmatic_display': 24537465,
  'programmatic_video': 21616338,
  'youtube': 26600000,
  'facebook': 39158000},
 'MF, 25-65+': {'TH Census': 49059931,
  'programmatic_display': 30083549,
  'programmatic_video': 26502174,
  'youtube': 29800000,
  'facebook': 47053000},
 'MF, 35-44': {'TH Census': 10071873,
  'programmatic_display': 6176072,
  'programmatic_video': 5440826,
  'youtube': 7620000,
  'facebook': 10512000},
 'MF, 35-54': {'TH Census': 21276243,
  'programmatic_display': 13046592,
  'programmatic_video': 11493426,
  'youtube': 14200000,
  'facebook': 21160000},
 'MF, 35-64': {'TH Census': 30726337,
  'programmatic_display': 18841390,
  'programmatic_video': 16598367,
  'youtube': 18400000,
  'facebook': 29529000},
 'MF, 35-65+': {'TH Census': 39770833,
  'programmatic_display': 24387475,
  'programmatic_video': 21484204,
  'youtube': 21600000,
  'facebook': 37424000},
 'MF, 45-54': {'TH Census': 11204370,
  'programmatic_display': 6870520,
  'programmatic_video': 6052601,
  'youtube': 6620000,
  'facebook': 10648000},
 'MF, 45-64': {'TH Census': 20654464,
  'programmatic_display': 12665317,
  'programmatic_video': 11157541,
  'youtube': 10800000,
  'facebook': 19017000},
 'MF, 45-65+': {'TH Census': 29698960,
  'programmatic_display': 18211402,
  'programmatic_video': 16043378,
  'youtube': 13900000,
  'facebook': 26912000},
 'MF, 55-64': {'TH Census': 9450094,
  'programmatic_display': 5794798,
  'programmatic_video': 5104941,
  'youtube': 4150000,
  'facebook': 8369000},
 'MF, 55-65+': {'TH Census': 18494590,
  'programmatic_display': 11340882,
  'programmatic_video': 9990777,
  'youtube': 7320000,
  'facebook': 16264000},
 'MF, 65+': {'TH Census': 9044496,
  'programmatic_display': 5546085,
  'programmatic_video': 4885837,
  'youtube': 3170000,
  'facebook': 7895000}},
      fxrate : 30.86,
      target_audience: "M, 18-34",
      target_audience_items: ["M, 18-24", "M, 18-34"],
      value: this.getRandomInt(10, 90),
      value2: this.getRandomInt(10, 90),
      reach_per_items: [
        {key :25, value: "25%"}, 
        {key :30, value: "30%"},
        {key :35, value: "35%"},
        {key :40, value: "40%"},
        {key :45, value: "45%"},
        {key :50, value: "50%"},
        {key :55, value: "55%"},
        {key :60, value: "60%"},
        {key :65, value: "65%"},
        ],
      v_type_data : {
        programmatic_display: [
          {key:  "Standard", cpm: 51.31},],
        youtube : [
          {key : "Bumper", cpm : 45.00}, 
          {key : "Non-Skippable", cpm : 73.00}, 
          {key : "Skippable", cpm : 66.23} ],
        programmatic_video : [
          {key : "Non-Skippable (15s, 30s)", cpm: 68.88}, 
          {key : "Bumpers", cpm : 47.00},
          {key: "Skippable", cpm : 66.56},],
        facebook : [
          {key: "Social Static Post", cpm : 33.00},
          {key: "Instream", cpm: 44.00},
          {key: "ThruPlay", cpm: 39.00}],
      },
      reach_data : [
        {
         name: "programmatic_display",
         solution : "PROGRAMMATIC DISPLAY (TradeDesk)",
         reach_per : 40,
         v_type : {key:  "Standard", cpm: 51.31},
         freq : 3,
        },
        {
         name: "programmatic_video",
         solution : "PROGRAMMATIC VIDEO (TradeDesk)",
         reach_per : 40,
         v_type : {key : "Non-Skippable (15s, 30s)", cpm: 68.88},
         freq : 3,
        },
        {
         name: "youtube",
         solution : "YOUTUBE",
         reach_per : 40,
         v_type : {key : "Bumper", cpm : 45.00},
         freq : 3,
        },
        {
         name: "facebook",
         solution : "FACEBOOK",
         reach_per : 40,
         v_type : {key: "ThruPlay", cpm: 39.00},
         freq : 3,
        }

      ]
      
    };
  },
  methods: {
    get_target_list() {
      return Object.keys(this.dataset)
    },
    convert_usd_thb(value) {
      return Math.round(value*this.fxrate)
    },
    convert_thb_usd(value) {
      return Math.round((value/this.fxrate)*100)/100
    },
    calculate_reach(value, reach_per){
      return Math.round(value * reach_per / 100)
    },
    calculate_imp(value, reach_per, freq){
      return Math.round(value * freq* reach_per / 100)
    },
    calculate_budget(cpm, value, reach_per, freq) {
      return Math.round(value * freq* reach_per * cpm/ 100000)
    },
    calculate_budget_usd(cpm, value, reach_per, freq) {
      return Math.round((value * freq* reach_per * cpm)/ (100000* this.fxrate))
    },
    getRandomDataForTrends() {
      const arr = [];
      for (let i = 0; i < 12; i += 1) {
        arr.push(Math.random().toFixed(1) * 10);
      }
      return arr;
    },
    generatePieSeries() {
      let series = [];

      for (let i = 0; i < 4; i++) {
        let y = Math.floor(Math.random() * (500 - 100 + 100)) + 100;
        series.push(y);
      }
      return series;
    },
    getRandomInt(min, max) {
      let rand = min - 0.5 + Math.random() * (max - min + 1);
      return Math.round(rand);
    },
  },
  mounted() {
    setTimeout(() => {
      this.apexLoading = true;
    });
  },
};
</script>

<style src="./PlanningTool.scss" lang="scss"/>