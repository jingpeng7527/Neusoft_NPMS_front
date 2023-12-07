<template>
  <div>
    <v-card>
      <v-container id="sales-log-table" fluid tag="section">
        <view-intro heading="Chance Trace Log" />

        <v-row>
          <v-col>
            <!-- 显示当前机会的信息 -->
            <material-card icon="mdi-account-outline" icon-small color="accent">
              <template #title>
                Chance Info <small class="text-body-1"></small>
              </template>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="chanceInfo.chanceNum"
                      label="chance number"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="chanceInfo.chanceName"
                      label="chance name"
                      readonly
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </material-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <!-- 机会跟踪表单 -->
            <v-data-table
              v-model="selected"
              :headers="headers"
              :items="chanceTraceLogs"
              :single-select=true
              show-select
              class="elevation-1"
              :loading="isLoading"
              loading-text="Loading... Please wait"
            >
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title>Chance Trace Table</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <!-- 按钮行 -->
                  <v-btn-toggle  borderless>
                    <v-btn value="add" @click="openAddDialog">
                      <span class="hidden-sm-and-down">Add</span>

                      <v-icon right> mdi-bookmark-plus-outline </v-icon>
                    </v-btn>

                    <v-btn value="edit" @click="openEditDialog">
                      <span class="hidden-sm-and-down">Edit</span>

                      <v-icon right> mdi-pencil </v-icon>
                    </v-btn>

                    <v-btn value="delete" @click="openDeleteDialog">
                      <span class="hidden-sm-and-down">Delete</span>

                      <v-icon right> mdi-delete </v-icon>
                    </v-btn>

                    <v-btn value="return" @click="returnBack">
                      <span class="hidden-sm-and-down">Return</span>

                      <v-icon right> mdi-keyboard-return </v-icon>
                    </v-btn>
                  </v-btn-toggle>
                </v-toolbar>
              </template>
            </v-data-table>
          </v-col>
        </v-row>

        <!-- 新建或者修改机会跟踪记录的增加 dialog -->
        <v-dialog
          v-model="addChanceTraceLogDialog"
          persistent
          max-width="600px"
        >
          <v-card>
            <v-card-title>
              <span class="text-h5">Add Chance Trace Log</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col class="d-flex" cols="12" sm="6" md="6">
                    <v-select
                      :items="businessTypes"
                      label="Business Type"
                      item-text="name"
                      item-value="id"
                      return-object
                      v-model="newChanceTraceLog.businessType"
                    ></v-select>
                  </v-col>

                  <v-col class="d-flex" cols="12" sm="6" md="6">
                    <v-select
                      :items="communicationTypes"
                      label="Communication Type"
                      v-model="newChanceTraceLog.communicationType"
                    ></v-select>
                  </v-col>

                  <v-col cols="12" sm="6" md="6">
                    <v-menu
                      v-model="menu"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="newChanceTraceLog.createDate"
                          label="Picker without buttons"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="newChanceTraceLog.createDate"
                        @input="menu = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      label="Address"
                      v-model="newChanceTraceLog.address"
                    />
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      label="Our Personnel"
                      v-model="newChanceTraceLog.ourPerson"
                    />
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      label="Client Personnel"
                      v-model="newChanceTraceLog.clientPerson"
                    />
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      label="Third-party Personnel"
                      v-model="newChanceTraceLog.thirdPartyPerson"
                    />
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      label="Communication Condition"
                      v-model="newChanceTraceLog.communicationCondition"
                    />
                  </v-col>

                  <v-col cols="12" md="12">
                    <v-textarea
                      v-model="newChanceTraceLog.effect"
                      label="Communication Effct"
                      value=""
                      hint="Hint text"
                    ></v-textarea>
                  </v-col>
                </v-row>
              </v-container>
              <small>*indicates required field</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeAddDialog">
                Close
              </v-btn>
              <v-btn color="blue darken-1" text @click="saveAddDialog">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- 修改或者删除时的message bars -->
        <v-snackbar v-model="snackbar" :timeout="2000" top>
          {{ message }}
        </v-snackbar>

        <!-- 操作成功时的message bars -->
        <v-snackbar :timeout="2000" v-model="success" top color="primary">
          {{ message }}
        </v-snackbar>

        <!-- 删除机会跟踪记录时的删除dialog -->
        <v-dialog v-model="deleteChanceTraceLogDialog" max-width="290">
      <v-card>
        <v-card-title class="text-h5"> Delete ChanceTraceLog </v-card-title>

        <v-card-text>
          Let Google help apps determine location. This means sending anonymous
          location data to Google, even when no apps are running.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" text @click="deleteCancel">
            Cancel
          </v-btn>

          <v-btn color="green darken-1" text @click="deleteConfirm">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
      </v-container>
    </v-card>
  </div>
</template>

<script>
export default {
  props:[
    "transferchancenum",
    "transferchancename"
  ],
  data() {
    return {
      //提示框
      message: "",
      snackbar: false,
      success: false,
      menu: false,

      //表格内的加载控制
      isLoading: false,
      //控制新增或者修改机会跟踪日志的窗口打开
      addChanceTraceLogDialog: false,
      watchChanceNum:"",

      //控制删除机会跟踪日志的窗口打开
      deleteChanceTraceLogDialog:false,
      //控制修改的界面打开
      editedDialogIndex:-1,
      selected:[],

      headers: [
        { text: "Business Type", value: "businessTypeName" },
        { text: "Interview Date", value: "createDate" },
        { text: "Our Personnel", value: "ourPerson" },
        { text: "Client Personnel", value: "clientPerson" },
        { text: "Third Party Personnel", value: "thirdPartyPerson" },
        { text: "Communication Type", value: "communicationType" },
        { text: "Address", value: "address" },
        { text: "Condition", value: "communicationCondition" },
        { text: "effect", value: "effect" }
      ],

      //查询到的机会信息
      chanceInfo: {},
      //机会跟踪日志里绑定的列表对象
      chanceTraceLogs: [],

      //新增的dialog里绑定的对象
      newChanceTraceLog: {
        //这里返回的是一个对象！
        businessType: "",
        communicationType: "",
        createDate: "",
        address: "",
        ourPerson: "",
        clientPerson: "",
        thirdPartyPerson: "",
        communicationCondition: "",
        effect: ""
      },

      //静态表格
      businessTypes: [
        { id: 1, name: "Third-party software service" },
        { id: 2, name: "Third-party software product" },
        { id: 3, name: "Onwed software product" },
        { id: 4, name: "Onwed software product service" },
        { id: 5, name: "System integration" },
        { id: 6, name: "Non-product development" },
        { id: 7, name: "Product development" }
      ],

      communicationTypes: ["QQ", "WeChat", "FeiQ", "Email", "Interview"]
    };
  },

  mounted: function() {
    console.log("*******************mounted******************")
    this.$axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${localStorage.getItem("token")}`;
    console.log(this.transferchancenum)
   
    this.chanceInfo.chanceNum = this.transferchancenum
    this.chanceInfo.chanceName = this.transferchancename
    console.log(this.transferchancename)
     this.search();
    
  },

  watch: {
    transferchancenum: {
      handler(newvalue, oldvalue) {
        this.watchChanceNum = this.transferchancenum
        console.log("this is in the watch************")
        console.log(this.watchChanceNum)
      },
      immediate: true,
      deep: true
    },

  },

  methods: {

    //进入界面时渲染一开始的默认机会跟踪日志
    search: function() {
      console.log("this is in the serach method")
      console.log(this.transferchancenum)
      this.isLoading = true,

      this.$axios
      .get("http://8.140.46.173:19000/chance/chance_trace_log/query", {
        params: {
          chance_num: this.transferchancenum
        }
      }).then(res=> {
        console.log(res)
        //把得到的list同步到表格里
        this.chanceTraceLogs = [];
        for(var i = 0; i< res.data.obj.length;i++) {
          for(var j=0; j< this.businessTypes.length; j++) {
            if(this.businessTypes[j].id == res.data.obj[i].business_type_id){
              var currbusinessTypeName = this.businessTypes[j].name
            }
          }
          this.chanceTraceLogs.push({
            id:res.data.obj[i].id,
            businessTypeId:res.data.obj[i].business_type_id,
            businessTypeName:currbusinessTypeName,
            businessType:{
              id:res.data.obj[i].business_type_id,
              name:currbusinessTypeName
            },
            createDate:res.data.obj[i].create_date,
            ourPerson:res.data.obj[i].our_personnel,
            clientPerson:res.data.obj[i].client_personnel,
            thirdPartyPerson:res.data.obj[i].third_party_personnel,
            communicationType:res.data.obj[i].communication_type,
            address:res.data.obj[i].address,
            communicationCondition:res.data.obj[i].communication_condition,
            effect:res.data.obj[i].effect,
          })
        }
        this.isLoading = false
      })
      
    },

    //返回父界面
    returnBack() {
      this.$emit("refreshChanceTrace", "");
    },

    //清空对话框所有东西
    clear() {
      this.newChanceTraceLog = {};
      this.selected = []
    },
    //打开新增界面
    openAddDialog() {
      this.addChanceTraceLogDialog = true;
      this.editedDialogIndex = -1
      this.newChanceTraceLog = {}
    },

    //关闭新增界面
    closeAddDialog() {
      this.addChanceTraceLogDialog = false;
      this.clear();
    },

    //打开修改界面
    openEditDialog() {
        //如果当前选中的行不止一个
        if(this.selected.length != 1) {
            console.log("重新选择");
              (this.message = "Please Select One Row to Edit"),
          (this.snackbar = true);
        }else {
            console.log(this.selected)
            console.log(this.selected[0])
            //打开新增对话框
            this.addChanceTraceLogDialog = true
            this.editedDialogIndex = this.chanceTraceLogs.indexOf(
                this.selected[0]
            )
            console.log("this.editedSalesLog" + this.editedDialogIndex)
            this.newChanceTraceLog = Object.assign({}, this.selected[0])
            console.log(this.newChanceTraceLog)
        }
    },

    //储存新增的信息并且关闭界面
    saveAddDialog() {
      //TODO:将新增的数据传给后端
      this.addChanceTraceLogDialog = false;
      this.message = "Operation Success!";
      this.success = true
      //分为新增和修改两种情况
      if(this.editedDialogIndex > -1) {
        //当打开的是修改对话框
        this.$axios.post("http://8.140.46.173:19000/chance/chance_trace_log/create", {
          id:this.chanceTraceLogs[this.editedDialogIndex].id,
          address:this.newChanceTraceLog.address,
          effect:this.newChanceTraceLog.effect,
          business_type_id:this.newChanceTraceLog.businessType.id,
          chance_num:this.transferchancenum,
          our_personnel:this.newChanceTraceLog.ourPerson,
          client_personnel:this.newChanceTraceLog.clientPerson,
          third_party_personnel:this.newChanceTraceLog.thirdPartyPerson,
          communication_condition:this.newChanceTraceLog.communicationCondition,
          communication_type:this.newChanceTraceLog.communicationType,
          create_date:this.newChanceTraceLog.createDate
        }).then((res)=> {
        //   Object.assign(
        //   this.chanceTraceLogs[this.editedDialogIndex],
        //   this.newChanceTraceLog
        // );
        console.log(res)
         this.clear()
        this.search()
        })
       
      }else {
        //如果打开的就是新增的界面
        this.$axios.post("http://8.140.46.173:19000/chance/chance_trace_log/create", {
          id:this.newChanceTraceLog.id,
          address:this.newChanceTraceLog.address,
          effect:this.newChanceTraceLog.effect,
          business_type_id:this.newChanceTraceLog.businessType.id,
          chance_num:this.transferchancenum,
          our_personnel:this.newChanceTraceLog.ourPerson,
          client_personnel:this.newChanceTraceLog.clientPerson,
          third_party_personnel:this.newChanceTraceLog.thirdPartyPerson,
          communication_condition:this.newChanceTraceLog.communicationCondition,
          communication_type:this.newChanceTraceLog.communicationType,
          create_date:this.newChanceTraceLog.createDate
        }).then(res=>{
          console.log(res)
          console.log(this.newChanceTraceLog.communicationCondition)
          console.log(this.newChanceTraceLog.ourPerson)
          this.clear();
          this.search()
        })
      }
      
    },

    //点击删除按钮时，打开是否确认删除的对话框
    openDeleteDialog() {
        if(this.selected.length !=1) {
            console.log("重新选择");
              (this.message = "Please Select One Row to Edit"),
          (this.snackbar = true);
        }else {
            this.deleteChanceTraceLogDialog = true
            this.editedDialogIndex = this.chanceTraceLogs.indexOf(
                this.selected[0]
            )
        }
    },
    //取消删除
    deleteCancel() {
        this.deleteChanceTraceLogDialog = false
        console.log(this.selected[0].id)
        this.newChanceTraceLog = {}
        this.selected = []
    },

    //确认删除
    deleteConfirm() {
        //TODO：将删除的信息传给后端，并且删除
        this.$axios
        .get("http://8.140.46.173:19000/chance/chance_trace_log/delete", {
          params: {
            id:this.selected[0].id
          }
        }).then(res=> {
          console.log(res)
          console.log("id"+this.selected[0].id)
          this.search()
          this.message = "Operation Success!";
          this.success = true
        })
        this.deleteChanceTraceLogDialog= false
    }
  }
};
</script>
