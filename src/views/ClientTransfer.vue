<template>
  <v-container id="google-maps-view" fluid tag="section">
    <view-intro heading="Client Trannsfer" />
    <v-snackbar v-model="snackbar" :timeout="2000" top color="green">
      {{ message }}
    </v-snackbar>
    <v-dialog fullscreen hide-overlay v-model="openClientDetailDialog">
      <client-detail-dialog
        :clientInfo="client"
        v-on:refreshClient="refreshClient"
      ></client-detail-dialog>
    </v-dialog>

    <v-row>
      <v-col cols="12">
        <v-stepper color="primary" alt-labels v-model="e1">
          <v-stepper-header >
            <v-stepper-step :complete="e1 > 1" step="1">
              Transfer Out
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="e1 > 2" step="2">
              Transfer In
            </v-stepper-step>

            <!-- <v-divider></v-divider> -->

            <!-- <v-stepper-step step="3"> Confirmation </v-stepper-step> -->
          </v-stepper-header>
          <v-stepper-items>
            <v-stepper-content step="1">
              <material-card class="mb-12">
                <small class="text-h4">Search Clients For Transfer Out</small>
                <v-form class="mb-5">
                  <v-container>
                    <v-col>
                      <v-row>
                        <v-col md="3" cols="12">
                          <v-select
                            v-model="form.dept_id"
                            :items="dept"
                            item-value="id"
                            item-text="name"
                            dense
                            label="sale department"
                          />
                        </v-col>
                        <v-col md="3" cols="12">
                          <v-select
                            v-model="form.user_id"
                            :items="user"
                            item-value="id"
                            item-text="username"
                            dense
                            label="Client Managers"
                          />
                        </v-col>
                        <v-col md="4" cols="12">
                          <v-text-field
                            v-model="form.name"
                            dense
                            label="Client"
                            required
                            append-outer-icon="mdi-magnify"
                            @click:append-outer="searchClient"
                          />
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-container>
                </v-form>

                <div class="text-h4 mb-5">
                  Query Result - Select the Client to Transfer
                </div>
                <v-data-table
                  v-model="selected"
                  :headers="headers"
                  :items="clients"
                  item-key="clientNum"
                  show-select
                  single-select
                  items-per-page=5
                  class="rounded-0"
                  :loading="isLoadingClient"
                  loading-text="Loading... Please wait"
                  @click:row="axiosGetChancesOfClient"
                  @dblclick:row.stop="openClientDetailDialogMethod"
                ></v-data-table>

                <div class="text-h4 mb-5">
                  Chances Information - From Client You Choose
                </div>
                <v-data-table
                  v-model="selected"
                  :headers="chancesHeaders"
                  :items="chances"
                  items-per-page=5
                  item-key="clientNum"
                  class="rounded-0"
                  :loading="isLoadingChance"
                  loading-text="Loading... Please wait"
                  @click:row="openChanceDetailDialog"
                ></v-data-table>
              </material-card>

              <v-btn color="primary" @click="card1Submit"> Next Step </v-btn>
            </v-stepper-content>
            <v-stepper-content step="2">
              <material-card class="mb-12 ml-1 mr-1">
                <template #title>
                  Choose Client Mangaer to Transfer In
                </template>
                <v-form ref="transferInForm" class="ma-4">
                  <v-container>
                    <v-row>
                      <v-col md="3" cols="12">
                        <v-select
                          required
                          :rules="[
                            (v) => !!v || 'You must select to continue!',
                          ]"
                          v-model="form.dept_transferIn_id"
                          :items="dept"
                          item-value="id"
                          item-text="name"
                          dense
                          label="sale department"
                        />
                      </v-col>
                      <v-col md="3" cols="12">
                        <v-select
                          required
                          :rules="[
                            (v) => !!v || 'You must select to continue!',
                          ]"
                          v-model="form.user_transferIn_id"
                          :items="user"
                          item-value="id"
                          item-text="username"
                          dense
                          label="Client Managers"
                        />
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
              </material-card>
              <material-card class="mb-12 ml-1 mr-1">
                <template #title> Client Choosed to be Transfer </template>
                <v-data-table
                  class="rounded-0 ml-3 mr-5"
                  v-model="selected"
                  :headers="headers"
                  :items="selected"
                  item-key="clientNum"
                  items-per-page=5
                ></v-data-table>
              </material-card>
              <v-btn color="primary" @click="card2Submit"> Confirm </v-btn>

              <v-btn text @click="e1 = 1"> Last Step </v-btn>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-col>
    </v-row>

    <!-- 机会详情dialog -->
    <v-dialog
      v-model="chanceDetailDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
    <ChanceCURDialog
      :transferchancebasicinfo = "chancebasicinfo"
      :transfersubchances = "subchances"
      :transfercompetitions = "competitions"
      :transferpolicymakers = "policymakers"
      :edit="isedit"
      :issave="issave"
      :isprocess ="isprocess"
      :isdetail ="isdetail"
      v-on:refreshChance="refreshChance"
    />

    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: "GoogleMapsView",
  components: {
    clientDetailDialog: () =>
      import(
        /* webpackChunkName: "default-drawer-header" */
        "./components/ClientCURDialog"
      ),
       ChanceCURDialog: () =>
      import(
        /* webpackChunkName: "default-drawer-header" */
        "./components/ChanceCURDialog"
      )
  },

  computed: {},
  watch: {
    "form.dept_id": {
      handler(newValue, oldValue) {
        console.log(newValue);
        this.$axios
          .get("http://47.98.166.180:14000/npms/user/get_user_by_dept_id", {
            params: {
              dept_id: newValue,
              user_id: 2,
              role_id: 2,
            },
          })
          .then((res) => {
            console.log(res);
            this.isLoading = false;
            this.user = res.data.obj;
          });
      },
    },
    "form.dept_transferIn_id": {
      handler(newValue, oldValue) {
        this.$axios
          .get("http://47.98.166.180:14000/npms/user/get_user_by_dept_id", {
            params: {
              dept_id: newValue,
              user_id: 2,
              role_id: 2,
            },
          })
          .then((res) => {
            console.log(res);
            this.isLoading = false;
            this.user = res.data.obj;
          });
      },
    },
  },
  mounted() {
    this.init();
  },

  data: () => ({

     //控制机会详情界面的按钮可见
        isdetail:true,
        isedit:true,
        issave:false,
        isprocess:true,

        //需要传给子组件的四个infos
        chancebasicinfo:{},
        subchances:[],
        competitions:[],
        policymakers:[],
        
        //控制机会详情界面的显示
        chanceDetailDialog:false,

        selectedChanceNum:"",
    e1: 1,
    message: "",
    snackbar: false,
    isLoadingClient: false,
    isLoadingChance: false,

    openClientDetailDialog:false,

    dept: [],
    form: {
      name: null,
      dept_id: null,
      user_id: null,
      dept_transferIn_id: null,
      user_transferIn_id: null,
    },
    user: [
      {
        id: "1",
        userNum: "10001",
        user_name: "yyx",
        dept_id: "1",
      },
    ],
    clientManagers: [],
    singleSelect: false,
    selected: [],
    headers: [
      {
        text: "Client Num",
        align: "start",
        sortable: false,
        value: "clientNum",
      },
      { text: "Name", value: "clientName" },
      { text: "Product Type", value: "productType" },
      { text: "Company Type", value: "companyTypeName" },
      { text: "Sale Dept", value: "deptName" },
      { text: "Manager", value: "userName" },
    ],
    clients: [],
    client: {
        isEdit:false,
        isDetail:true,
        basic_info: {
          id: "2",
          clientNum: 1594,
          name: "Frozen Yogurt client",
          taxpayerCode: "xxxx",
          country: "xxx",
          accountGroupId: "",
          province: "xxx",
          address: "",
          postcode: "xxx",
          productType: 6.0,
          companyTypeId: 24,
          coreSoftwareBrand: "",
          annualSalesRevenue: "",
          website: "",
          taxTypeId: "",
          effect: "",
          isFrozen: "",
          userId: "",
          userNum: "10001", //客户经理id
          createTime: "",
        },

        client_contacts: [
          {
            id: 1,
            clientId: "xxx",
            name: "yys",
            dept: "xxxx",
            position: "xxxx",
            tel: "xxxx",
            phone: "8645",
            fax: "xxxx",
            mail: "xxx",
            qq: "2134453",
            wechat: "213244556",
          },
          {
            // id:2,
            clientId: "xxx",
            name: "ssss",
            dept: "xxxx",
            position: "xxxx",
            tel: "xxxx",
            phone: "8645",
            fax: "xxxx",
            mail: "xxx",
            qq: "2134453",
            wechat: "213244556",
          },
        ],
        client_relations: [
          {
            id: 1, 
            clientCurrentId: 1,
            clientRelateId: 2,
            clientRelateName: "apple",
            clientRelateTypeId: 2,
            clientRelateTypeName: "Subsidiary",
          },
          {
            id: 2,
            clientCurrentId: 1,
            clientRelateId: 2,
            clientRelateName: "bb",
            clientRelateTypeId: 2,
            clientRelateTypeName: "Subsidiary",
          },
        ],
      },
    chancesHeaders: [
      {
        text: "Chance Number",
        align: "start",
        sortable: false,
        value: "chanceNum",
      },
      { text: "Chance Name", value: "name" },
      { text: "Client Name", value: "clientName" },
      { text: "BackGround", value: "background" },
      //TODO 测试 yky的chance 接口
      // { text: "Chance Stage", value: "stage" },
      // { text: "Presign Date", value: "date" },
      // { text: "Department", value: "dept" },
      // { text: "Customer Manager", value: "manager" },
      // { text: "", value: "data-table-expand" }
    ],
    chances: [],
    chance:{}
  }),
  methods: {
    init() {
      this.$axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${localStorage.getItem("token")}`;
      this.axiosGetDept();
    },
    //初始化获取所有dept
    axiosGetDept() {
      this.$axios
        .get("http://47.98.166.180:14000/npms/chance/get_departments", {
          params: {
            user_id: 2,
            role_id: 2,
          },
        })
        .then((res) => {
          console.log(res);
          this.dept = res.data.obj;
        });
    },
    searchClient() {
      console.log(this.form);
      this.clients = [];
      this.isLoadingClient = true;
      this.$axios
        .get("http://8.140.46.173:16000/client/query_client", {
          params: {
            name: this.form.name,
            deptId: this.form.dept_id,
            userId: this.form.user_id,
          },
        })
        .then((res) => {
          console.log(res);
          if (res.data.status == 200) {
            this.clients = res.data.obj;
          }
        })
        .then((res) => {
          this.isLoadingClient = false;
        });
    },
    axiosGetChancesOfClient(item) {
      this.isLoadingChance = true;
      this.$axios
        .get("http://47.98.166.180:14000/npms/chance/get_chance_basic_info_by_client_id", {
          params: {
            clientId: item.id,
          },
        })
        .then((res) => {
          console.log(res);
          this.chances = res.data.obj;
        })
        .then((res) => {
          this.isLoadingChance = false;
        });
    },
    confirm() {},

    //TODO 打开机会详情
    openChanceDetailDialog(item) {
      this.isLoadingChance = true
      console.log("this is in the openChanceDetail Dialog")
      console.log(item);
      
      this.selectedChanceNum = item.chanceNum;
      console.log(this.selectedChanceNum);
      
  
      // this.axiosGetBasicInfo();
      // this.axiosGetSubChance();
      // this.axiosGetCompetition();
      // this.axiosPolicymaker();
      this.$axios
        .get(
          "http://47.98.166.180:14000/npms/chance/get_chance_basic_info_in_draft_and_real_by_chance_num",
          {
            params: {
              chanceNum: this.selectedChanceNum
            }
          }
        )
        .then(res => {
          console.log(res);
          this.chancebasicinfo = res.data.obj
          this.$axios
        .get(
          "http://47.98.166.180:14000/npms/sub-chance/get_sub_chance_in_draft_and_real_by_chance_num",
          {
            params: {
              chanceNum: this.selectedChanceNum
            }
          }
        )
        .then(res => {
          console.log(res);
          this.subchances = res.data.obj
          this.$axios
        .get("http://47.98.166.180:14000/npms/competition/get_competition_by_chance_num", {
          params: {
            chance_num: this.selectedChanceNum
          }
        })
        .then(res => {
          console.log(res);
          this.competitions = res.data.obj
          this.$axios
        .get("http://47.98.166.180:14000/npms/policymaker/get_policymaker_by_chance_num", {
          params: {
            chance_num: this.selectedChanceNum
          }
        })
        .then(res => {
          console.log(res);
          this.policymakers = res.data.obj
          this.chanceDetailDialog = true
          this.isLoadingChance = false
        });
        });
        });
        });
      
      
    },

    //打开客户详情
    openClientDetailDialogMethod(MouseEvent,item) {
      this.client.isEdit = false;
      this.client.isDetail = true;
      console.log("kehuxiangq")
      console.log(item)

      //axios get请求 client基本信息 由client表返回
      this.axiosGetClient(item.item.id);
      this.axiosGetClientRelations(item.item.id);
      this.axiosGetClientContacts(item.item.id);

      console.log("查看详情 " + this.client);
      this.openClientDetailDialog = true;
    },

    //关闭客户详情
    refreshClient(clientInfo) {
      console.log("clientInfo");
      console.log(clientInfo);
      var client = clientInfo;
      this.openClientDetailDialog = false;
    },

    axiosGetClientRelations(id) {
      var that = this;
      this.$axios
        .get("http://8.140.46.173:16000/client/query_client_contact", {
          params: {
            clientId: id,
          },
        })
        .then((res) => {
          console.log(res);
          if(res.data.obj==null){
            this.client.client_contacts=[]
          }else{
            this.client.client_contacts = res.data.obj;
          }
          
        });
    },
    axiosGetClientContacts(id) {
      this.$axios
        .get("http://8.140.46.173:16000/client/query_client_relate", {
          params: {
            clientCurrentId: id,
          },
        })
        .then((res) => {
          console.log(res);
          var relation = res.data.obj;
          // for(var i =0;i<relation.length;i++){
          //   var type=this.clientRelateType.find(o => o.id === relation[i].clientRelateTypeId);
          //   relation[i].clientRelateTypeName=type.name
          // }
          this.client.client_relations = res.data.obj;
        });
    },

    //根据id获取client详细 用于显示在客户界面表格里
    axiosGetClient(id) {
      var that = this;
      console.log(id);
      this.$axios
        .get("http://8.140.46.173:16000/client/query_client_detail", {
          params: {
            clientId: id,
          },
        })
        .then((res) => {
          console.log(res);
          that.isLoading = false;
          var temp = res.data.obj;
          var list = temp.province.split("-");
          temp.province = list[0];
          temp.city = list[1];
          temp.district = list[2];
          this.client.basic_info = temp;
        })
        .catch(function (error) {
          // handle error
          that.isLoading = false;
          console.log(error);
        })
        .then(function () {
          that.isLoading = false;
        });
    },

    card2Submit() {
      //提取chanceNums
      var chanceNums = this.chances.map((item, index) => {
        return item.chanceNum;
      });
      if (this.$refs.transferInForm.validate()) {
        this.$axios
          .get("http://8.140.46.173:16000/client/transfer_client", {
            params: {
              exportDeptId: this.form.dept_id,
              exportUserId: this.form.user_id,
              importDeptId: this.form.dept_transferIn_id,
              importUserId: this.form.user_transferIn_id,
              clientId: this.selected[0].id,
              chanceNums: chanceNums+'', //client 下所有chance 的 chance num
            },
          })
          .then((res) => {
            console.log(res);
            this.snackbar = true;
            this.message = "Transfer Success";
          });
      }
    },
    card1Submit() {
      if (this.selected.length != 1) {
        this.snackbar = true;
        this.message = "Please Choose one Client to Transfer";
      } else {
        this.e1 = 2;
      }
    },

    //关闭机会详情界面的方法
    //父子组件传旨,同时关闭新增或者修改机会的界面
    refreshChance(chanceInfo) {
      console.log(chanceInfo);
      var chance = chanceInfo;
      this.chanceDetailDialog = false;
    },

    axiosGetBasicInfo() {
      this.$axios
        .get(
          "http://47.98.166.180:14000/npms/chance-draft/get_TOApprove_chance_basic_info_by_chance_num",
          {
            params: {
              chanceNum: this.selectedChanceNum
            }
          }
        )
        .then(res => {
          console.log(res);
          this.chancebasicinfo = res.data.obj
        });
    },

    axiosGetSubChance() {
      this.$axios
        .get(
          "http://47.98.166.180:14000/npms/chance-draft/get_TOApprove_sub_chance_list_by_chance_num",
          {
            params: {
              chanceNum: this.selectedChanceNum
            }
          }
        )
        .then(res => {
          console.log(res);
          this.subchances = res.data.obj
        });
    },
    axiosGetCompetition() {
      this.$axios
        .get("http://47.98.166.180:14000/npms/competition/get_competition_by_chance_num", {
          params: {
            chance_num: this.selectedChanceNum
          }
        })
        .then(res => {
          console.log(res);
          this.competitions = res.data.obj
        });
    },

    axiosPolicymaker() {
      this.$axios
        .get("http://47.98.166.180:14000/npms/policymaker/get_policymaker_by_chance_num", {
          params: {
            chance_num: this.selectedChanceNum
          }
        })
        .then(res => {
          console.log(res);
          this.policymakers = res.data.obj
        });
    },
  },
};
</script>
