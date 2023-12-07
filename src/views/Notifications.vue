<template>
  <div>
    <v-row>
      <v-col cols="12" md="12">
        <v-card rounded="lg">
          <v-app-bar
            color="primary"
            elevate-on-scroll
            scroll-target="#scrolling-techniques-7"
            dark
          >
            <v-app-bar-nav-icon
              @click.stop="drawer = !drawer"
            ></v-app-bar-nav-icon>

            <v-toolbar-title>{{ list[selectedItem].username }}</v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn icon>
              <v-icon>mdi-magnify</v-icon>
            </v-btn>

            <v-btn icon>
              <v-icon>mdi-filter</v-icon>
            </v-btn>

            <v-btn icon>
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </v-app-bar>
          <v-sheet
            id="scrolling-techniques-7"
            class="overflow-y-auto ml-5"
            :height="0.7 * height"
          >
            <v-container style="height: 1000px">
              <div
                v-for="(msg, index) in list[selectedItem].msglist"
                :key="index"
              >
                <div class="ma-5" v-if="msg.flag == list[selectedItem].userNum&&loginUser.userNum=='1107'||loginUser.userNum!='1107'&&msg.flag !=loginUser.userNum">
                  <v-row>
                    <v-avatar color="blue">
                      <span class="white--text text-h5">{{
                        list[selectedItem].username.charAt(0)
                      }}</span>
                    </v-avatar>
                    <v-chip class="ma-2"> {{ msg.info }} </v-chip>
                  </v-row>
                </div>
                <div v-else class="ma-5">
                  <v-row>
                    <v-spacer></v-spacer>
                    <v-chip class="ma-2"> {{ msg.info }} </v-chip>
                    <v-avatar color="red">
                      <span class="white--text text-h5">{{loginUser.username.charAt(0)}}</span>
                    </v-avatar>
                  </v-row>
                </div>
              </div>
            </v-container>
          </v-sheet>
          <div rounded="sm" class="ml-5 mr-5 mt-5">
            <v-text-field
              v-model="message"
              append-icon="mdi-send"
              prepend-inner-icon="mdi-emoticon"
              filled
              clear-icon="mdi-close-circle"
              clearable
              rounded
              label="Message"
              type="text"
              @click:append="sendMessage"
              @click:clear="clearMessage"
            ></v-text-field>
          </div>

          <v-navigation-drawer v-model="drawer" temporary absolute right>
            <v-toolbar>
              <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->

              <v-toolbar-title>New Chat</v-toolbar-title>

              <v-spacer></v-spacer>
            </v-toolbar>

            <v-list subheader>
              <v-subheader>Recent chat</v-subheader>
              <v-list-item-group v-model="selectedItem" color="primary">
                <v-list-item v-for="chat in list" :key="chat.userNum">
                  <v-list-item-avatar
                    color="indigo"
                    class="text-h5 font-weight-light white--text"
                  >
                    {{ chat.username.charAt(0) }}
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title
                      v-text="chat.username"
                    ></v-list-item-title>
                  </v-list-item-content>

                  <v-list-item-icon>
                    <v-icon
                      :color="
                        chat.msglist.length > 0 ? 'deep-purple accent-4' : 'grey'
                      "
                    >
                      mdi-message-outline
                    </v-icon>
                  </v-list-item-icon>
                </v-list-item>
              </v-list-item-group>
            </v-list>

            <v-divider></v-divider>

            <v-list subheader>
              <v-subheader>Previous chats</v-subheader>

              <v-list-item v-for="chat in previous" :key="chat.title">
                <v-list-item-avatar>
                  <v-img
                    :alt="`${chat.title} avatar`"
                    :src="chat.avatar"
                  ></v-img>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title v-text="chat.name"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import mqtt from "mqtt";
export default {
  computed: {
    height() {
      return this.getHeight();
    },
  },
  watch: {
    selectedItem(n, o) {
      console.log(`new ${n}, old ${o}`);
    },
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

    // 创建连接
    createConnection() {
      // 连接字符串, 通过协议指定使用的连接方式
      // ws 未加密 WebSocket 连接
      // wss 加密 WebSocket 连接
      // mqtt 未加密 TCP 连接
      // mqtts 加密 TCP 连接
      // wxs 微信小程序连接
      // alis 支付宝小程序连接
      const { host, port, endpoint, ...options } = this.connection;
      const connectUrl = `ws://${host}:${port}${endpoint}`;
      try {
        this.client = mqtt.connect(connectUrl, options);
      } catch (error) {
        console.log("mqtt.connect error", error);
      }
      this.client.on("connect", () => {
        console.log("Connection succeeded!");
        this.doSubscribe();
      });
      this.client.on("error", (error) => {
        console.log("Connection failed", error);
      });
      this.client.on("message", (topic, message) => {
        this.receiveNews = this.receiveNews.concat(message);
        console.log(`Received message ${message} from topic ${topic}`);
        this.receiveMsgAndStore(topic, topic, `${message}`);
      });
    },
    // 订阅主题
    doSubscribe() {
      const { topic, qos } = this.subscription;
      console.log(`监听的topic ${topic}`);
      this.client.subscribe(topic, { qos: 2 }, (error, res) => {
        if (error) {
          console.log("Subscribe to topics error", error);
          return;
        }
        this.subscribeSuccess = true;
        console.log("Subscribe to topics res", res);
      });
    },
    // 取消订阅
    doUnSubscribe() {
      const { topic } = this.subscription;
      this.client.unsubscribe(topic, (error) => {
        if (error) {
          console.log("Unsubscribe error", error);
        }
      });
    },
    // 发送消息
    doPublish(topic, msg) {
      //const { topic, qos, payload } = this.publish
      this.client.publish(topic, msg, { qos:2 }, (error) => {
        if (error) {
          console.log("Publish error", error);
        } else {
          this.sendMsgAndStore(topic, topic, `${msg}`);
        }
      });
    },
    // 断开连接
    destroyConnection() {
      if (this.client.connected) {
        try {
          this.client.end();
          this.client = {
            connected: false,
          };
          console.log("Successfully disconnected!");
        } catch (error) {
          console.log("Disconnect failed", error.toString());
        }
      }
    },

    receiveMsgAndStore(flag, topic, msg) {
      let obj;
      if(this.loginUser.userNum=="1107"){
        obj = this.list.find((o) => o.userNum === topic);
      }else{
        obj=this.list[0]
      }
     
      let msgItem = {};
      msgItem.flag = flag;
      msgItem.info = msg;

      if (typeof(obj.msglist) == undefined||obj.msglist==null) {
        let msgList = [];
        msgList.push(msgItem);
        obj.msglist = msgList;
      } else {
        obj.msglist.push(msgItem);
      }

      console.log("receive and save to list ");
      console.log(obj);
      console.log(msgItem.info);
      console.log(this.list);
      this.$forceUpdate();
    },

    sendMsgAndStore(flag, topic, msg) {
      let obj = this.list[this.selectedItem];
      console.log(`send obj ${obj}`)
      let msgItem = {};
      msgItem.flag = flag;
      msgItem.info = msg;

      if (typeof(obj.msglist) == undefined||obj.msglist==null) {
        let msgList = [];
        msgList.push(msgItem);
        obj.msglist = msgList;
      } else {
        obj.msglist.push(msgItem);
      }
      console.log("receive and save to list ");
      console.log(obj);
      console.log(msgItem.info);
      console.log(this.list);
      this.$forceUpdate();
    },
    sendMessage() {
      let topic;
      if(this.loginUser.userNum=="1107"){
        topic = this.list[this.selectedItem].userNum + "receive";
      }else{
        topic = this.loginUser.userNum;
      }
      console.log(`send msg to topic ${topic}`);
      if (this.client.connected) {
        this.doPublish(topic, this.message);
      } else {
        this.createConnection();
        this.doPublish(topic, this.message);
      }
      this.resetIcon();
      this.clearMessage();
    },
    clearMessage() {
      this.message = "";
    },
    resetIcon() {
      this.iconIndex = 0;
    },
    changeIcon() {
      this.iconIndex === this.icons.length - 1
        ? (this.iconIndex = 0)
        : this.iconIndex++;
    },

    init() {

      this.$axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${localStorage.getItem("token")}`;
      
      this.loginUser = JSON.parse(localStorage.getItem("user"));
      this.connection.clientId=this.loginUser.userNum
      if (this.loginUser.userNum == "1107") {
        this.$axios
          .get("http://8.140.46.173:16000/client/init_user", {
            params: {},
          })
          .then((res) => {
            console.log(res);
            this.list = res.data;
            for(var i =0;i<this.list.length;i++){
              this.list[i].msglist=[]
            }

            var topics = this.list.map((item, index) => {
              return item.userNum;
            });
            this.subscription.topic = topics;
            console.log("dingyue list");
            console.log(this.subscription.topic);
            this.createConnection();
          });
      } else {
        this.subscription.topic = this.loginUser.userNum + "receive";
        this.list=[
          {
            id:8,
            userNum:"1107",
            username:"Customer Service",
            msglist:[],
          }
        ]
        this.selectedItem=0;
        console.log("dingyue list");
        console.log(this.subscription.topic);
        this.createConnection();
      }
    },
  },
  mounted() {
    this.init();
  },
  data: () => ({
    list: [],

    currentSendingTopic: "",

    connection: {
      host: "8.140.46.173",
      port: 15675,
      endpoint: "/ws",
      clean: false, // 保留会话
      connectTimeout: 4000, // 超时时间
      reconnectPeriod: 4000, // 重连时间间隔
      keepAliveInterval: 10,
      // 认证信息
      clientId: "",
      username: "admin",
      password: "admin",
      // will:{
      //   qos:2
      // }
    },
    subscription: {
      topic: [],
      qos: 2,
    },
    publish: {
      topic: "",
      qos: 2,
      payload: "",
    },
    receiveNews: "",
    qosList: [
      { label: 0, value: 0 },
      { label: 1, value: 1 },
      { label: 2, value: 2 },
    ],
    client: {
      connected: false,
    },
    subscribeSuccess: false,

    message: "",

    selectedItem: 1,
    drawer: true,
    chats: [
      {
        active: true,
        avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
        name: "Jason Oner",
        userId: 1,
      },
      {
        active: true,
        avatar: "https://cdn.vuetifyjs.com/images/lists/2.jpg",
        name: "Mike Carlson",
      },
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/3.jpg",
        name: "Cindy Baker",
      },
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/4.jpg",
        name: "Ali Connors",
      },
    ],
    previous: [
      {
        name: "Travis Howard",
        avatar: "https://cdn.vuetifyjs.com/images/lists/5.jpg",
      },
    ],
  }),
};
</script>