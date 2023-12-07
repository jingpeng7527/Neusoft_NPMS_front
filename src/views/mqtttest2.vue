<template>
  <div id="app">
    <p>mqtt收到的数据：</p>
    <p>{{ msg }}</p>
    <v-btn @click="doPublish">send</v-btn>
  </div>
</template>

<script>
//  npm install mqtt  --save

import mqtt from "mqtt";

export default {
  data() {
    return {
      loginUser:{},
      msg: "--",
      options: {
        keepalive: 60,
        connectTimeout: 4000, // 超时时间
        reconnectPeriod: 4000, // 重连时间间隔
        clientId: "1101",
        username: "admin",
        password: "admin",
        keepAliveInterval: 10,
        clean: false, // 保留会话
      },
      receiverOptions: {
        keepalive: 60,
        connectTimeout: 4000, // 超时时间
        reconnectPeriod: 4000, // 重连时间间隔
        clientId: "Receiver",
        username: "admin",
        password: "admin",
        clean: true, // 保留会话
      },
      sendTopic:"",
      receiveTopic:"",
      receiverClient: {},
      client: {
        connected: false,
      },
      subscribeSuccess: false,
    };
  },

  mounted() {
    // this.receiverClient = mqtt.connect(
    //   "ws://8.140.46.173:15675/ws",
    //   this.receiverOptions
    // );
    this.loginUser = JSON.parse(localStorage.getItem("user"));
    this.sendTopic=this.loginUser.userNum
    this.receiveTopic=this.loginUser.userNum+"receive"
    this.client = mqtt.connect(
      "ws://8.140.46.173:15675/ws",
      this.options
    );
    this.mqttMsg();
  },

  methods: {
    // //100%能发送的版本
    // doPublish() {
    //   // const { topic, qos, payload } = this.publication;
    //   this.client = mqtt.connect("ws://8.140.46.173:15675/ws", this.options);
    //   this.client.on("connect", (e) => {
    //     console.log("连接成功！！！");
    //     console.log("before set true  " + this.client.connected);
    //     this.client.publish("test", "B sendTo test", { qos: 2 }, (error) => {
    //       if (error) {
    //         console.log("Publish error", error);
    //       } else {
    //         console.log("I am B try to send A ");
    //       }
    //     });
    //   });
    // },
    //test版本
    doPublish() {
      // const { topic, qos, payload } = this.publication;
      //this.client.end()
      console.log(this.sendTopic)
      if (this.client.connected) {
        this.client.publish("1101", "B sendTo test", { qos: 2 }, (error) => {
          if (error) {
            console.log("Publish error", error);
          } else {
            console.log("I am B try to send A ");
          }
        });
      // } else {
      //   this.client.reconnect();
      //   this.client.publish("1101", "B sendTo test", { qos: 2 }, (error) => {
      //       if (error) {
      //         console.log("Publish error", error);
      //       } else {
      //         console.log("I am B try to send A ");
      //       }
      //     });
      }
    },
    doSubscribe() {
      const { topic, qos } = this.subscription;
      this.client.subscribe(topic, qos, (error, res) => {
        if (error) {
          console.log("Subscribe to topics error", error);
          return;
        }
        this.subscribeSuccess = true;
        console.log("Subscribe to topics res", res);
      });
    },
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
    mqttMsg() {
      console.log("Receiver before before  " + this.client.connected);
      this.client.on("connect", (e) => {
        console.log("连接成功！！！");
        console.log("Receiver before set true  " + this.client.connected);
        //this.doPublish()
        this.client.subscribe(["1101receiver"], { qos: 2 }, (error) => {
          if (!error) {
            console.log("订阅成功");
          } else {
            console.log("订阅失败");
          }
        });
      });
      // 接收消息处理
      this.client.on("message", (topic, message) => {
        console.log("收到来自", topic, "的消息", message.toString());
        this.msg = message.toString();
      });
    },
  },
};
</script>
<style scoped>
</style>