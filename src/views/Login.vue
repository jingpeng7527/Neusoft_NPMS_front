<template>
  <div class="login_container">
    <video
      autoplay=true
      loop="loop"
      controls="controls"
      class="blur earthvideo"
    >
      <source src="../assets/Leaf.mp4" type="video/mp4" />
      您的浏览器不支持 video 标签。
    </video>

    <div >

      <v-row align="center" justify="center">
          <v-row >
            <!-- <v-col cols="12" md="7" v-show="!($vuetify.breakpoint.name=='xs'||$vuetify.breakpoint.name=='sm')">
              <img  src="../assets/login_bg.png"  class="background-image"/>
            </v-col> -->
            <v-col cols="12" md="12" sm="12">
              <v-card
                color="#F2F6FCCC"
                class="login_box"
              >
               <v-card-title style="color: black; font-size: 25px">Welcome to NPMS</v-card-title>
                <v-card-text>
                 
                  <v-form ref="loginForm" action="login" :model="loginForm">
                    
                    <v-text-field
                      v-model="loginForm.username"
                      :rules="[(v) => !!v || 'Username Required!']"
                      required
                      dense
                      rounded
                      filled
                      placeholder="Please enter username"
                      label="Username"
                      class="mt-11"
                    />
                    <v-text-field
                      v-model="loginForm.password"
                      @keydown.enter="login"
                      :rules="[(v) => !!v || 'Password Required!']"
                      required
                      dense
                      rounded
                      filled
                      placeholder="Please enter password"
                      label="Password"
                    />
                    <v-card-actions class="pa-0">
                      <v-btn
                        block
                        color="#45b5d4"
                        class="rounded-xl"
                        height="40px"
                        rounded
                        style="color: #fff"
                        @click.stop="login"
                      >
                        LOGIN IN
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

      </v-row>


      <!-- <search-bar /> -->
    </div>
    
  </div>
</template>

<script>
import qs from "qs";
export default {
  name: "DefaultLayout",
  computed: {
    height() {
      return this.getHeight();
    },
  },
  components: {
    // SearchBar: () => import(
    //   /* webpackChunkName: "default-app-bar" */
    //   './Test'
    // )
  },
  mounted() {
    this.localUser = JSON.parse(localStorage.getItem("user"));
    this.loginForm.username = this.localUser.username;
    console.log(this.loginForm);
  },
  data() {
    return {
      localUser: {},
      loginForm: {
        username: "",
        password: "",
      },
      fixStyle: ''
    };
  },
  

  methods: {
    

    getHeight() {
      console.log(this.$vuetify.breakpoint.name);
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return 220;
        case "sm":
          return 400;
        case "md":
          return 600;
        case "lg":
          return 600;
        case "xl":
          return 800;
      }
    },

    login() {
      // localStorage.setItem("isLogin", true);
      if (this.$refs.loginForm.validate()) {
        var url =
          "http://39.106.82.211:15000/auth/oauth/token?grant_type=password&client_id=client-app&client_secret=123456&username=" +
          this.$data.loginForm.username +
          "&password=" +
          this.$data.loginForm.password;
        this.$axios.post(url).then((res) => {
          console.log("数据：", res);
          var token = res.data.data.token;
          localStorage.setItem("token", res.data.data.token);
          // this.$axios.defaults.headers.common["Authorization"] =
          //   localStorage.getItem("token");
          this.$axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${token}`;
          this.$axios
            .get("http://39.106.82.211:15000/api/user/login")
            .then((res) => {
              console.log("login", res);
              if (res.status == 200) {
                //如果登录成功把用户角色信息存进local storage
                // res.data.obj.expire=86400000*3
                // res.data.obj.startTime=new Date().getTime()

                localStorage.setItem("isLogin", true);
                localStorage.setItem("user", JSON.stringify(res.data));
                //跳转到dashboard
                this.$router.push({
                  name: "Dashboard",
                });
              } else {
                //提示用户名或密码错误
                alert("用户名密码错误");
                this.$refs.loginForm.reset();
              }
            });
        });
      }
    },

    // login() {
    //   localStorage.setItem("isLogin", true);
    //   if (this.$refs.loginForm.validate()) {
    //     this.$axios
    //       .post("/pjLogin/login", {
    //         username: this.$data.loginForm.username,
    //         password: this.$data.loginForm.password,
    //       })
    //       .then((res) => {
    //         console.log("数据：", res);
    //         if (res.data.status == 1001) {
    //           //如果登录成功把用户角色信息存进local storage
    //           localStorage.setItem("user", JSON.stringify(res.data.obj));
              
    //           //跳转到dashboard
    //           this.$router.push({
    //             name: "Dashboard",
    //           });
    //         } else {
    //           //提示用户名或密码错误
    //           alert("用户名密码错误");
    //           this.$refs.loginForm.reset();
    //         }
    //       });
    //   }
    // },
  },
};
</script>

<style>
.background {
  background-image: url(/assets/login_bg.jpg);

}

.background-image {
  margin-top: 40px;
  width: 100%;
}

.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  min-width: 200px;
  height: 300px;
  background-color: #F2F6FCCC;
  border-radius:15px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 25px;

  animation-name: dropbox;
  animation-duration: 1s;
  animation-timing-function: ease-out;
}
 

</style>
