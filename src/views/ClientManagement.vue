<template>
  <v-container id="user-profile-view" fluid tag="section">
    <view-intro heading="Client Management" />
    <div>
      <v-snackbar v-model="snackbar" :timeout="2000" top color="green">
        {{ message }}
      </v-snackbar>
      <!-- 客户界面的 export按钮和对话框-->
      <v-dialog
        v-model="detailDialog"
        persistent
        fullscreen
        hide-overlay
        max-width="290"
      >
        <v-card>
          <v-card-title class="text-h5">Notification</v-card-title>

          <v-card-text> Are you sure to frozen this client </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="green darken-1" text @click="detailDialog = false">
              Cancel
            </v-btn>

            <v-btn color="green darken-1" text @click="detailDialog = false">
              Confirm
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- 客户界面的 新增/编辑客户全屏弹出窗 -->
      <v-dialog fullscreen hide-overlay v-model="testAddDialog">
        <ClientCURDialog
          :clientInfo="client"
          v-on:refreshClient="refreshClient"
        />
      </v-dialog>
    </div>
    <v-row justify="center">
      <!-- 客户查询 -->
      <v-col cols="12">
        <material-card color="primary" icon-small icon="mdi-account-outline">
          <template #title>
            Search Client —
            <small class="text-body-1">query with parameters</small>
          </template>
          <v-form class="mt-5">
            <v-container class="py-0">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field dense label="client name" v-model="form.name" />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    dense
                    color="purple"
                    v-model="form.clientNum"
                    label="client num"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <v-select
                    clearable
                    v-model="form.companyTypeId"
                    :items="companyType"
                    item-value="id"
                    item-text="name"
                    dense
                    label="coporation type"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <v-select
                    clearable
                    v-model="form.dept_id"
                    :items="dept"
                    item-value="id"
                    item-text="name"
                    dense
                    label="sale department"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <v-select
                    clearable
                    dense
                    v-model="form.user_id"
                    :items="user"
                    item-value="id"
                    item-text="username"
                    color="purple"
                    label="client manager"
                  />
                </v-col>

                <v-col cols="12" class="text-right">
                  <v-btn
                    outlined
                    color="blue-grey"
                    @click.stop="resetClientQuery"
                    class="ma-2 white--text"
                  >
                    Reset
                    <v-icon right>mdi-refresh</v-icon>
                  </v-btn>
                  <v-btn
                    color="green"
                    @click="queryClients"
                    outlined
                    class="ma-2 white--text"
                  >
                    Search
                    <v-icon right>mdi-magnify</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </material-card>
      </v-col>
      <!-- 客户查询结果表 -->
      <v-col cols="12">
        <material-card>
          <v-data-table
            v-model="selected"
            :headers="headers"
            :items="clients"
            item-key="clientNum"
            show-select
            class="rounded-0"
            :loading="isLoading"
            loading-text="Loading... Please wait"
            @click:row="openDetailDialog"
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title>Client Information Table</v-toolbar-title>
                <v-spacer></v-spacer>

                <v-btn-toggle borderless>
                  <!-- 新增客户按钮 -->
                  <div
                    v-show="loginUser.roleId == 1 || loginUser.roleId == 3"
                  >
                    <v-btn tile depressed value="add" @click.stop="openAddClientDialog">
                      <span class="hidden-sm-and-down">Add</span>
                      <v-icon right> mdi-plus-box-multiple-outline </v-icon>
                    </v-btn>
                  </div>
                  <div  v-show="loginUser.roleId == 1 || loginUser.roleId == 3||loginUser.roleId == 5">
                    <v-btn tile depressed value="edit" @click.stop="openEditClientDialog">
                      <span class="hidden-sm-and-down">Edit</span>
                      <v-icon right> mdi-pencil-outline </v-icon>
                    </v-btn>
                  </div>
                  <div v-show="loginUser.roleId == 5">
                    <v-btn depressed tile value="frozen" @click.stop="frozenClient">
                      <span class="hidden-sm-and-down">Frozen</span>
                      <v-icon right> mdi-account-off-outline </v-icon>
                    </v-btn>
                  </div>

                  <div
                    v-show="loginUser.roleId == 5 || loginUser.roleId == 2"
                  >
                    <download-excel
                      class="export-excel-wrapper"
                      :data="clients"
                      name="clients.xls"
                    >
                      <v-btn value="export" depressed tile :disabled="clients.length==0">
                        <span class="hidden-sm-and-down">Export</span>

                        <v-icon right> mdi-export </v-icon>
                      </v-btn>
                    </download-excel>
                  </div>
                </v-btn-toggle>
              </v-toolbar>
            </template>

            <template v-slot:[`item.isFrozen`]="{ item }">
              <v-chip v-if="item.isFrozen == 0" color="green" dark> Normal </v-chip>
              <v-chip v-else color="grey" dark> Frozen </v-chip>
            </template>
          </v-data-table>
        </material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { get, sync } from "vuex-pathify";
import axios from "axios";
export default {
  components: {
    ClientCURDialog: () =>
      import(
        /* webpackChunkName: "default-drawer-header" */
        "./components/ClientCURDialog"
      ),
  },

  name: "UserProfileView",
  data() {
    return {
      loginUser: {},
      isLoading2: false,
      items: [],
      search: null,

      isLoading: false,
      isEdit: false,
      isDetail: false,

      message: "",
      snackbar: false,

      //规则
      rules: {
        required: (value) => !!value || "Required.",
        counter: (value) => value.length <= 20 || "Max 20 characters",
        email: (value) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        },
      },
      defaltRelate: {
        clientCurrentId: "",
        clientRelateId: "",
        clientRelateTypeId: "",
        clientRelateName: "apple",
      },
      //默认client模板

      defaltClient: {
        basic_info: {},
        client_contacts: [],
        client_relations: [],
      },
      //客户页面表格中选中的信息
      selected: [],
      //新增客户页面中 联系人表格(单选)
      selectedContact: [],
      //新增客户页面中 关系表格(单选)
      selectedRelation: [],
      //省市区信息
      regiondata: {
        province: [],
        city: [],
        area: [],
      },
      //省市区集合
      provinceIntegration: "",
      //Dialog 显示
      deleteContactDialog: false,
      addContactDialog: false,
      addRelationDialog: false,
      deleteRelationDialog: false,
      detailDialog: false,
      addDialog: false,
      testAddDialog: false,
      //客户 包含联系人list 关系list
      client: {
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
      //联系人
      contact: {},
      //关系
      relation: {},
      user: [
        {
          id: "1",
          userNum: "10001",
          user_name: "yyx",
          dept_id: "1",
        },
      ],
      dept: null,
      //查询参数
      form: {
        name: "e",
        clientNum: "8",
        companyTypeId: null,
        dept_id: null,
        user_id: null,
      },

      //客户表格表头及信息
      editedClientIndex: -1,
      headers: [
        {
          text: "ID",
          align: "start",
          sortable: false,
          value: "clientNum",
        },
        { text: "Name", value: "clientName" },
        { text: "Product Type", value: "productType" },
        { text: "Company Type", value: "companyTypeName" },
        { text: "Sale Dept", value: "deptName" },
        { text: "Manager", value: "userName" },
        { text: "Status", value: "isFrozen" },
      ],
      clients: [],
    };
  },
  mounted() {
    //this.getRegion();
    this.init();
  },
  watch: {
    "form.dept_id": {
      handler(newValue, oldValue) {
        this.$axios
          .get("http://47.98.166.180:14000/npms/user/get_user_by_dept_id", {
            params: {
              dept_id: newValue,
              user_id: this.loginUser.id,
              role_id: this.loginUser.roleId,
            },
          })
          .then((res) => {
            console.log(res);
            this.isLoading = false;
            this.user = res.data.obj;
          });
      },
    },
    isEdit() {
      console.log("fuzujian" + this.isEdit);
    },
    search(val) {
      // Items have already been loaded
      if (this.items.length > 0) return;

      this.isLoading = true;

      // Lazily load input items
      this.$axios
        .get("http://8.140.46.173:16000/client/query_client", {
          params: {
            name: val,
          },
        })
        .then((res) => {
          console.log(res);

          this.isLoading = false;
          this.items = res.data.obj;
        });
    },
  },
  computed: {
    ...get("static", [
      "accountGroup",
      "companyType",
      "taxType",
      "clientRelateType",
    ]),
  },

  methods: {
    //初始化
    init() {
      this.$axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${localStorage.getItem("token")}`;
      this.loginUser = JSON.parse(localStorage.getItem("user"));
      console.log(this.loginUser);
      this.clients.push(this.client);
      this.axiosGetDept();
      this.axiosGetDefaultClient();
    },
    axiosGetDept() {
      console.log("local storage")
      console.log(localStorage.getItem("token"))
      this.$axios
        .get("http://47.98.166.180:14000/npms/chance/get_departments", {
          params: {
            user_id: this.loginUser.id,
            role_id: this.loginUser.roleId,
          },
        })
        .then((res) => {
          console.log(res);
          this.dept = res.data.obj;
        });
    },

    axiosGetDefaultClient() {
      this.$axios
        .get("http://8.140.46.173:16000/client/init_client", {
          params: {
            user_id: this.loginUser.id,
            role_id: this.loginUser.roleId,
          },
        })
        .then((res) => {
          console.log(res);
          if (res.data.obj != null) {
            this.clients = res.data.obj;
          } else {
            this.clients = [];
          }
        });
    },

    resetClientQuery() {
      this.form = {};
    },

    //客户查询
    queryClients() {
      console.log(this.form);
      this.isLoading = true;
      this.$axios
        .get("http://8.140.46.173:16000/client/query_client", {
          params: {
            name: this.form.name,
            clientNum: this.form.clientNum,
            companyTypeId: this.form.companyTypeId,
            deptId: this.form.dept_id,
            userId: this.form.user_id,
          },
        })
        .then((res) => {
          console.log("chaxunjieguo");
          console.log(res);
          this.clients = Object.assign([], res.data.obj);
          this.isLoading = false;
        });
    },

    //客户新增
    openAddClientDialog() {
      // this.isEdit = false;
      // this.isDetail = false;
      this.client = Object.assign({}, this.defaltClient);
      this.client.isEdit = false;
      this.client.isDetail = false;
      this.testAddDialog = true;
      this.editedClientIndex = -1;
    },
    clientClose() {
      this.client = {};
      this.editedClientIndex = -1;
      this.selected = [];
    },

    //打开客户修改dialog
    openEditClientDialog() {
      this.client.isEdit = true;
      this.client.isDetail = false;
      if (this.selected.length != 1) {
        console.log("重新选择");
        this.message = "Please Select One Client to Edit";
        this.snackbar = true;
      } else if(this.selected[0].userId!=this.loginUser.id&&this.loginUser.roleId!=5){
        console.log("重新选择");
        this.message = "Have No Authority to Edit";
        this.snackbar = true;
      
      }else {
        this.editedClientIndex = this.clients.indexOf(this.selected[0]);

        //axios get请求 client基本信息 由client表返回
        //axios get请求 client contact
        //axios get client relations
        this.axiosGetClient(this.selected[0].id);
        this.axiosGetClientRelations(this.selected[0].id);
        this.axiosGetClientContacts(this.selected[0].id);
        console.log(this.client);

        this.testAddDialog = true;
      }
    },
    //客户冻结
    //TODO 测试接口
    frozenClient() {
      if (this.selected.length != 1) {
        console.log("重新选择");
        this.message = "Please Select One Client to Modify";
        this.snackbar = true;
      } else {
        var tempclient = Object.assign({}, this.selected[0]);
        var status = tempclient.isFrozen;
        if (status == 1) {
          tempclient.isFrozen = 0;
        } else {
          tempclient.isFrozen = 1;
        }
        console.log(tempclient);
        this.$axios({
          method: "post",
          url: "http://8.140.46.173:16000/client/frozen_client",
          data: tempclient,
        }).then((res) => {
          console.log(+res);
          this.snackbar = true;
          this.message = "Succeess!";
        });
      }
    },

    //客户查看详情
    openDetailDialog(item) {
      // this.isEdit = false;
      // this.isDetail = true;
      this.client.isEdit = false;
      this.client.isDetail = true;
      this.editedClientIndex = this.clients.indexOf(this.item);
      console.log(this.editedClientIndex);
      //axios get请求 client基本信息 由client表返回
      //axios get请求 client contact
      //axios get client relation
      console.log("item" + item);
      this.axiosGetClient(item.id);
      this.axiosGetClientRelations(item.id);
      this.axiosGetClientContacts(item.id);
      //this.client.basic_info = Object.assign({}, item);

      console.log("插卡详情 " + this.client);

      // this.client.client_contacts = this.selected[0].client_contacts;
      // this.client.client_relations = this.selected[0].client_contacts;

      this.testAddDialog = true;
    },
    //
    //一些请求
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
          if (res.data.obj == null) {
            this.client.client_contacts = [];
          } else {
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

    //提交修改或新增的客户信息
    axiosSaveOrUpdateClient(client) {
      console.log(client);
      var province =
        client.basic_info.province +
        "-" +
        client.basic_info.city +
        "-" +
        client.basic_info.district;
      client.basic_info.province = province;
      if (client.basic_info.id == null) {
        client.basic_info.isFrozen = 0;
      }
      client.basic_info.userId=this.loginUser.id
      //存client
      this.$axios({
        method: "post",
        url: "http://8.140.46.173:16000/client/create_client",
        data: client.basic_info,
      })
        .then((res) => {
          console.log(res);
          var clientID = res.data.obj.id;
          //存client contact
          for (var i = 0; i < client.client_contacts.length; i++) {
            client.client_contacts[i].clientId = clientID;
          }
          this.$axios({
            method: "post",
            url: "http://8.140.46.173:16000/client/create_client_contact",
            data: client.client_contacts,
          }).then((res) => {
            console.log("contact" + res);
            //存relation
            console.log("存relation id " + clientID);
            console.log(client.client_relations);
            for (var i = 0; i < client.client_relations.length; i++) {
              client.client_relations[i].clientCurrentId = clientID;
            }

            this.$axios({
              method: "post",
              url: "http://8.140.46.173:16000/client/create_client_relate",
              data: client.client_relations,
            }).then((res) => {
              console.log("relate" + res);
              this.snackbar = true;
              this.message = "Succeess Submit";
            });
          });
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
        .then(function () {
          // always executed
        });
    },

    axiosDeleteRelationBatch(Ids) {
      console.log("在删除");
      this.$axios.post("http://8.140.46.173:16000/client/delete_client_relate", Ids).then((res) => {
        console.log(res);
      });
    },

    refreshClient(clientInfo) {
      console.log("clientInfo");
      console.log(clientInfo);
      var client = clientInfo;
      this.testAddDialog = false;
      if (client != {} && !client.isDetail) {
        if (this.editedClientIndex > -1) {
          console.log("gengxinl");
          this.axiosSaveOrUpdateClient(client);
          this.axiosDeleteRelationBatch(client.deleteRelationList);
          //Object.assign(this.clients[this.editedClientIndex], client);
        } else {
          this.axiosSaveOrUpdateClient(client);
          //this.clients.push(client.basic_info);
        }
      }

      this.client={}
    },

    getColor (state) {
        if (state == "Normal") return 'green'
        else if (state == "Close") return 'red'
        else if (state == "Draft") return 'orange'
        else return 'blue'
      },
  },
};
</script>
