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

var client;
const options = {
  // connectTimeout: 4000, // 超时时间
   reconnectPeriod: 4000, // 重连时间间隔
  clientId: "mqtitId-A",
  username: "admin",
  password: "admin",

};
client = mqtt.connect("ws://8.140.46.173:15675/ws", options);
export default {
  data() {
    return {
      msg: "--",
    };
  },

  created() {
    this.mqttMsg();
  },

  methods: {
    doPublish() {
      // const { topic, qos, payload } = this.publication;
      if(client.connected==true){
        console.log(client.connected)
        client.publish("topicC", "A sendTo b"+new Date(), {qos:2}, (error) => {
        if (error) {
          console.log("Publish error", error);
        }else{
          console.log("i am a , send to b")
        }
      });
      }else{
        console.log(client.connected)
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
      client.on("connect", (e) => {
        console.log("连接成功！！！");
        //this.doPublish()
        client.subscribe(["test"], { qos: 2 }, (error) => {
          if (!error) {
            //
            console.log("订阅成功");
          } else {
            console.log("订阅失败");
          }
        });
      });
      // 接收消息处理
      client.on("message", (topic, message) => {
        console.log("收到来自", topic, "的消息", message.toString());
        this.msg = message.toString();
      });
    },
  },
};
</script>
<style scoped>
</style>