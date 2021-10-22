<template>
  <v-app>
    <v-container fluid>
      <v-row no-gutters>
        <v-col cols="7" class="main-part d-none d-md-none d-lg-flex">
          <div class="d-flex">
            <v-img src="@/assets/logo.png" contain></v-img>
            <p>Bidmath-Programmatic AI</p>
          </div>
        </v-col>
        <v-col cols="12" lg="5" class="login-part d-flex align-center justify-center">
          <v-row no-gutters class="align-start">
            <v-col cols="12" class="login-part d-flex align-center justify-center flex-column">
              <div class="login-wrapper pt-md-4 pt-0">
                <v-tabs grow>
                  <v-tabs-slider></v-tabs-slider>
                  <v-tab :href="`#tab-login`">
                    BIDMATH LOGIN
                  </v-tab>

                  <v-tab-item :value="'tab-login'" >
                    <v-form>
                      <v-container>
                        <v-row class="flex-column">
                          <v-form>
                            <v-col>
                              <v-text-field
                                  v-model="resetdata.username"
                                  :rules="emailRules"
                                  value="admin@bidmath.com"
                                  label="Email Address"
                                  required
                              ></v-text-field>
                              <v-text-field
                                  v-model="resetdata.old_password"
                                  :rules="passRules"
                                  type="password"
                                  label="Old Password"
                                  hint="At least 6 characters"
                                  required
                              ></v-text-field>
                              <v-text-field
                                  v-model="resetdata.new_password"
                                  :rules="passRules"
                                  type="password"
                                  label="New Password"
                                  hint="At least 6 characters"
                                  required
                              ></v-text-field>

                            </v-col>
                            <v-col class="d-flex justify-space-between">
                              <v-btn
                                  class="text-capitalize1"
                                  large
                                  :disabled="resetdata.new_password.length === 0 || resetdata.username.length === 0"
                                  color="primary"
                                  @click="resetPassword"
                              >
                                Reset</v-btn>
                            </v-col>
                          </v-form>
                        </v-row>
                      </v-container>
                    </v-form>
                  </v-tab-item>
                </v-tabs>
              </div>
            </v-col>
            <v-col cols="12" class="d-flex justify-center">
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import axios from "axios";
  export default {
    name: 'Reset',
    data() {
      return {
        resetdata: {
        username: "",
        old_password: "",
        new_password: "",
        },
        emailRules: [
          v => !!v || 'E-mail is required',
          v => /.+@.+/.test(v) || 'E-mail must be valid',
        ],
        passRules: [
          v => !!v || 'Password is required',
          v => v.length >= 6 || 'Min 6 characters'
        ],
        name : ''
      }
    },
    methods: {
    resetPassword(){
      axios.post(process.env.VUE_APP_BASE_URL + "/reset_password",
        this.resetdata, { 
          headers: {"Content-Type": "application/json",
           }

      })
      .then((res)=>{
            if (res.status == 200){
            this.$router.push('/login')   
            }
          })
          .catch((err)=>{
            console.log(err)
          });
          
    },
  }
  }
</script>


<style src="./Login.scss" lang="scss"/>