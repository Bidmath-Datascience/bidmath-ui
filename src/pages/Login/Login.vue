<template>
  <v-app>
    <v-container fluid>
      <v-row no-gutters>
        <v-col cols="7" class="main-part d-none d-md-none d-lg-flex">
          <div class="d-flex">
            <v-img src="@/assets/logo.png" contain></v-img>
            <p>Bidmath-Programatic Solutions</p>
          </div>
        </v-col>
        <v-col cols="12" lg="5" class="login-part d-flex align-center justify-center">
          <v-row no-gutters class="align-start">
            <v-col cols="12" class="login-part d-flex align-center justify-center flex-column">
              <div class="login-wrapper pt-md-4 pt-0">
                <v-tabs grow>
                  <v-tabs-slider></v-tabs-slider>
                  <v-tab :href="`#tab-login`">
                    LOGIN
                  </v-tab>

                  <v-tab-item :value="'tab-login'" >
                    <v-form>
                      <v-container>
                        <v-row class="flex-column">
                          <v-col>
                            <p class="login-slogan display-2 text-center font-weight-medium my-10"></p>
                            <v-btn v-google-signin-button="clientId" height="45" block color="white" elevation="0" class="google-signin-button">
                              <v-img src="@/assets/google.svg" max-width="30" class="mr-4"></v-img>
                              Sign in with Google</v-btn>
                          </v-col>
                          <v-col cols="12" class="d-flex align-center my-8">
                            <v-divider></v-divider>
                            <span class="px-5"> or </span>
                            <v-divider></v-divider>
                          </v-col>
                          <v-form>
                            <v-col>
                              <v-text-field
                                  v-model="userform.username"
                                  :rules="emailRules"
                                  value="admin@bidmath.com"
                                  label="Email Address"
                                  required
                              ></v-text-field>
                              <v-text-field
                                  v-model="userform.password"
                                  :rules="passRules"
                                  type="password"
                                  label="Password"
                                  hint="At least 6 characters"
                                  required
                              ></v-text-field>

                            </v-col>
                            <v-col class="d-flex justify-space-between" v-if="!loading">
                              <v-btn
                                  class="text-capitalize"
                                  large
                                  :disabled="userform.password.length === 0 || userform.username.length === 0"
                                  color="primary"
                                  @click="onSubmit"
                              >
                                Login</v-btn>
                            </v-col>
                            <v-col v-if="loading">
                                <v-progress-linear
                                 color="deep-purple accent-4"
                                indeterminate
                                rounded
                                height="6"
                                ></v-progress-linear>
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
import GoogleSignInButton from "vue-google-signin-button-directive";
  export default {
    name: 'Login',
    directives: {
    GoogleSignInButton
    },
    data() {
      return {
        userform: {
        username: '',
        password: ''
      },
        emailRules: [
          v => !!v || 'E-mail is required',
          v => /.+@.+/.test(v) || 'E-mail must be valid',
        ],
        passRules: [
          v => !!v || 'Password is required',
          v => v.length >= 6 || 'Min 6 characters'
        ],
        name : '',
        auth: false,
        loading: false,
        clientId: '691392139488-u1mp89f02to7ljpc0bv8s1bu4vaool7v.apps.googleusercontent.com'
      }
    },

    methods: {
    onSubmit(){
      this.loading = true
      const formData = new FormData();
      formData.append('username', this.userform.username);
      formData.append('password', this.userform.password);
      axios.post(process.env.VUE_APP_BASE_URL + "/login", 
      formData,
      { 
           headers: {"Content-Type": "application/x-www-form-urlencoded"}
      })
      .then((res)=>{
            if (res.status == 200){
            window.localStorage.setItem('username', res.data.name);
            if (res.data.reset) {
            this.$router.push('/reset') 
            } else {
            this.$cookies.set('token', res.data)
            this.$router.push('/dashboard') 
            }
            }
          });
      this.loading= true
    },
    authenticateUser() {
        axios.get(process.env.VUE_APP_BASE_URL + "/auth",
      { 
           headers: {"Content-Type": "application/json",
           'Authorization':  `Bearer ${this.token}`
           }
      }
      ).then((res) => {
        if (res.status == 200) {
          this.$router.push('/dashboard')
        } else
        {
          this.$cookies.remove("token");
          this.$router.push('/login');
        }
      });
    },
    created() {
     
      if (this.auth == 'true') {
        this.$router.push('/dashboard');
      }
    },
    OnGoogleAuthSuccess (idToken) {
        this.loading = true
        console.log(idToken)
        axios.post(process.env.VUE_APP_BASE_URL + "/swap_token", idToken,
        )
        .then((res)=>{
            if (res.status == 200){
            this.$cookies.set('token', res.data)
            window.localStorage.setItem('username', res.data.name);
            this.$router.push('/dashboard') 
            }
          });
      this.loading= true
      // Receive the idToken and make your magic with the backend
    },
    OnGoogleAuthFail (error) {
      console.log(error)
    }
  },
  mounted() {
    this.token = this.$cookies.get("token").access_token
    if (this.token) {
        this.authenticateUser()
    }
  },
  }
</script>


<style src="./Login.scss" lang="scss"/>