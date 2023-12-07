<template>
  <v-container id="report-management-view" fluid tag="section">
    <v-card>
      <v-tabs v-model="active" color="primary" slider-color="yellow">
        <v-tab v-if="[2,3].includes(loginUser.roleId)">Sales Log</v-tab>
        <v-tab v-if="[2,3].includes(loginUser.roleId)">Client Relate</v-tab>
        <v-tab v-if="loginUser.roleId==5">Client Transfer</v-tab>
        <v-tab-item v-for="n in loginUser.roleId==5?1:2" :key="n">
          <v-container fluid>
            <!-- 第一个tab -->
            <!-- 销售报表查询 -->
            <div v-if="n == 1&&[2,3].includes(loginUser.roleId)" >
              <v-row>
                <v-col>
                  <!-- 查询条件表单 -->
                  <material-card
                    icon="mdi-account-outline"
                    icon-small
                    color="accent"
                  >
                    <template #title>
                      Search Sales Log —
                      <small class="text-body-1">input the info</small>
                    </template>
                    <v-form>
                      <v-container>
                        <v-row>
                          <v-col class="d-flex" cols="12" sm="4">
                            <v-select
                              dense
                              :items="department1"
                              label="Department"
                              item-text="name"
                              item-value="id"
                              return-object
                              v-model="querySaleslog.dept"
                            ></v-select>
                          </v-col>

                          <v-col class="d-flex" cols="12" sm="4">
                            <v-select
                              dense
                              :items="customer_manager1"
                              label="Customer manager"
                              item-text="username"
                              item-value="id"
                              return-object
                              v-model="querySaleslog.customerManager"
                            ></v-select>
                          </v-col>

                          <v-col class="d-flex" cols="12" sm="4">
                            <v-select
                              dense
                              :items="week"
                              label="Week"
                              v-model="querySaleslog.week"
                            ></v-select>
                          </v-col>

                          <v-col>
                            <v-menu
                              v-model="menu2"
                              :close-on-content-click="false"
                              :nudge-right="40"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  dense
                                  v-model="querySaleslog.start_date"
                                  label="Presign date from"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="querySaleslog.start_date"
                                @input="menu2 = false"
                              ></v-date-picker>
                            </v-menu>
                          </v-col>
                          --
                          <v-col cols="12" md="6">
                            <v-menu
                              v-model="menu1"
                              :close-on-content-click="false"
                              :nudge-right="40"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  dense
                                  v-model="querySaleslog.end_date"
                                  label="until"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="querySaleslog.end_date"
                                @input="menu1 = false"
                              ></v-date-picker>
                            </v-menu>
                          </v-col>
                        </v-row>

                        <v-col cols="12" class="text-right">
                          <v-btn
                            outlined
                            color="blue-grey"
                            class="ma-2 white--text"
                            @click="resetSaleslogQuery"
                          >
                            Reset
                            <v-icon right>mdi-refresh</v-icon>
                          </v-btn>
                          <v-btn
                            color="green"
                            outlined
                            class="ma-2 white--text"
                            @click="searchSaleslog"
                          >
                            Search
                            <v-icon right>mdi-magnify</v-icon>
                          </v-btn>
                        </v-col>
                      </v-container>
                    </v-form>
                  </material-card>
                </v-col>
              </v-row>

              <v-row>
                <v-col>
                  <!-- 销售日报表单 -->
                  <material-card>
                    <v-container>
                      <!-- 按钮行 -->
                      <v-data-table
                        v-model="selected1"
                        :headers="headers1"
                        :items="salesLogs"
                        show-select
                        class="rounded-0"
                        @click:row="test"
                        :loading="isLoading"
                        loading-text="Loading... Please wait"
                      >
                        <template v-slot:top>
                          <v-toolbar flat>
                            <v-toolbar-title>Sales Log Table</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <!-- 按钮行 -->

                            <download-excel
                              class="export-excel-wrapper"
                              :data="salesLogs"
                              name="Saleslogs.xls"
                            >
                              <v-btn-toggle v-model="icon" borderless>
                                <v-btn value="export1">
                                  <span class="hidden-sm-and-down">Export</span>

                                  <v-icon right> mdi-export </v-icon>
                                </v-btn>
                              </v-btn-toggle>
                            </download-excel>
                          </v-toolbar>
                        </template>
                      </v-data-table>
                    </v-container>
                  </material-card>
                </v-col>
              </v-row>
            </div>
            <!-- 第二个tab -->
            <div v-if="n == 2&&[2,3].includes(loginUser.roleId)">
              <v-row>
                <v-col>
                  <!-- 查询条件表单 -->
                  <material-card
                    class="mb-12 ml-1 mr-1"
                    icon="mdi-account-outline"
                    icon-small
                    color="accent"
                  >
                    <template #title>
                      Search Client Relate —
                      <small class="text-body-1">input the info</small>
                    </template>
                    <v-form
                      ref="clientQueryForm"
                      lazy-validation
                      v-model="clientQueryFormValid"
                    >
                      <v-container>
                        <v-row>
                          <v-col cols="12" md="4">
                            <v-text-field
                              dense
                              v-model="form.clientNum"
                              label="Client Numer"
                            />
                          </v-col>

                          <v-col class="d-flex" cols="12" sm="4">
                            <v-select
                              dense
                              v-model="form.dept_id"
                              :items="dept"
                              item-value="id"
                              item-text="name"
                              label="Department"
                            ></v-select>
                          </v-col>

                          <v-col class="d-flex" cols="12" sm="4">
                            <v-select
                              dense
                              v-model="form.user_id"
                              :items="user"
                              item-value="id"
                              item-text="username"
                              label="client manager"
                              required
                              :rules="[
                                (v) => !!v || 'You must select to continue!',
                              ]"
                            ></v-select>
                          </v-col>

                          <v-col cols="12" md="6">
                            <v-autocomplete
                              v-model="form.client"
                              :items="items"
                              :search-input.sync="search"
                              chips
                              clearable
                              hide-details
                              hide-selected
                              item-text="clientName"
                              item-value="clientNum"
                              label="client name"
                              dense
                              return-object
                            >
                              <template v-slot:no-data>
                                <v-list-item>
                                  <v-list-item-title>
                                    Search for your
                                    <strong>Relate Client</strong>
                                  </v-list-item-title>
                                </v-list-item>
                              </template>
                              <template
                                v-slot:selection="{ attr, on, item, selected }"
                              >
                                <v-chip
                                  v-bind="attr"
                                  :input-value="selected"
                                  color="blue-grey"
                                  class="white--text"
                                  v-on="on"
                                >
                                  <v-icon left> mdi-bitcoin </v-icon>
                                  <span v-text="item.clientName"></span>
                                </v-chip>
                              </template>
                              <template v-slot:item="{ item }">
                                <v-list-item-avatar
                                  color="indigo"
                                  class="text-h5 font-weight-light white--text"
                                >
                                  {{ item.clientName.charAt(0) }}
                                </v-list-item-avatar>
                                <v-list-item-content>
                                  <v-list-item-title
                                    v-text="item.clientName"
                                  ></v-list-item-title>
                                  <v-list-item-subtitle
                                    v-text="item.productType"
                                  ></v-list-item-subtitle>
                                </v-list-item-content>
                                <v-list-item-action>
                                  <v-icon>mdi-bitcoin</v-icon>
                                </v-list-item-action>
                              </template>
                            </v-autocomplete>
                          </v-col>
                        </v-row>

                        <v-col cols="12" class="text-right">
                          <v-btn
                            outlined
                            color="blue-grey"
                            class="ma-2 white--text"
                            @click.stop="resetClientQuery"
                          >
                            Reset
                            <v-icon right>mdi-refresh</v-icon>
                          </v-btn>
                          <v-btn
                            color="green"
                            outlined
                            class="ma-2 white--text"
                            @click="queryClientInfo"
                          >
                            Search
                            <v-icon right>mdi-magnify</v-icon>
                          </v-btn>
                        </v-col>
                      </v-container>
                    </v-form>
                  </material-card>
                </v-col>
              </v-row>

              <v-row v-show="afterSearch">
                <v-col cols="12" md="12">
                  <v-card class="mx-auto" outlined>
                    <v-card-title class="text-body-1">
                      The Result
                    </v-card-title>

                    <v-list-item>
                      <v-list-item-content>
                        <v-col cols="12" md="3" sm="6">
                          <v-row justify="center">
                            <v-icon large color="blue-grey darken-2">
                              mdi-information-outline
                            </v-icon>
                          </v-row>

                          <v-row justify="center">
                            <div class="text-xl">{{ form.client.name }}</div>
                          </v-row>

                          <v-row justify="center">
                            <v-chip class="ma-2"> Client Name </v-chip>
                          </v-row>
                        </v-col>

                        <v-col cols="12" md="3" sm="6">
                          <v-row justify="center">
                            <v-icon large color="blue-grey darken-2">
                              mdi-message-text
                            </v-icon>
                          </v-row>

                          <v-row justify="center">
                            <div class="text-h4">
                              {{ form.client.clientNum }}
                            </div>
                          </v-row>

                          <v-row justify="center">
                            <v-chip class="ma-2"> Cliet Number </v-chip>
                          </v-row>
                        </v-col>

                        <v-col cols="12" md="3" sm="6">
                          <v-row justify="center">
                            <v-icon large color="blue-grey darken-2">
                              mdi-domain
                            </v-icon>
                          </v-row>

                          <v-row justify="center">
                            <div class="text-h3">
                              {{ form.client.deptName }}
                            </div>
                          </v-row>
                          <v-row justify="center">
                            <v-chip class="ma-2"> Department </v-chip>
                          </v-row>
                        </v-col>

                        <v-col cols="12" md="3" sm="6">
                          <v-row justify="center">
                            <v-icon large color="blue-grey darken-2">
                              mdi-account-supervisor
                            </v-icon>
                          </v-row>

                          <v-row justify="center">
                            <div class="text-h3">
                              {{ form.client.userName }}
                            </div>
                          </v-row>

                          <v-row justify="center">
                            <v-chip class="ma-2"> Customer Manager </v-chip>
                          </v-row>
                        </v-col>
                      </v-list-item-content>
                    </v-list-item>
                  </v-card>
                </v-col>
              </v-row>

              <v-row v-show="!afterSearch">
                <!-- TODO 骨架加载 -->
              </v-row>

              <v-row>
                <v-col>
                  <!-- 客户联系人表单 -->
                  <material-card>
                    <v-container>
                      <!-- 添加名片 -->
                      <v-data-table
                        v-model="selectedContact"
                        :headers="contact_headers"
                        :items="client.client_contacts"
                        item-key="name"
                        class="rounded-0"
                      >
                        <template v-slot:top>
                          <v-toolbar flat>
                            <v-toolbar-title
                              >Client Contact Table</v-toolbar-title
                            >
                            <v-spacer></v-spacer>
                            <!-- 按钮行 -->
                            <download-excel
                              class="export-excel-wrapper"
                              :data="ClientContact"
                              name="ClientContact.xls"
                            >
                              <v-btn-toggle borderless>
                                <v-btn value="export2_2">
                                  <span class="hidden-sm-and-down">Export</span>

                                  <v-icon right> mdi-export </v-icon>
                                </v-btn>
                              </v-btn-toggle>
                            </download-excel>
                          </v-toolbar>
                        </template>
                      </v-data-table>
                    </v-container>
                  </material-card>
                </v-col>
              </v-row>

              <v-row>
                <v-col>
                  <!-- 关联客户表单 -->
                  <material-card>
                    <v-container>
                      <v-data-table
                        v-model="selectedRelation"
                        :headers="relation_headers"
                        :items="client.client_relations"
                        item-key="id"
                        class="rounded-0"
                      >
                        <template v-slot:top>
                          <v-toolbar flat>
                            <v-toolbar-title
                              >Client Relate Table</v-toolbar-title
                            >
                            <v-spacer></v-spacer>
                            <!-- 按钮行 -->

                            <download-excel
                              class="export-excel-wrapper"
                              :data="ClientRelate"
                              name="ClientRelate.xls"
                            >
                              <v-btn-toggle v-model="icon" borderless>
                                <v-btn value="export2_2">
                                  <span class="hidden-sm-and-down">Export</span>

                                  <v-icon right> mdi-export </v-icon>
                                </v-btn>
                              </v-btn-toggle>
                            </download-excel>
                          </v-toolbar>
                        </template>
                      </v-data-table>
                    </v-container>
                  </material-card>
                </v-col>
              </v-row>
            </div>
            <!-- 第三个tab -->
            <div v-if="n == 1&&loginUser.roleId==5"> 
              <v-row>
                <v-col cols="12" sm="12" md="6">
                  <!-- 移出方查询表单 -->

                  <material-card
                    icon="mdi-account-outline"
                    icon-small
                    color="accent"
                  >
                    <template #title>
                      Client Transfer From —
                      <small class="text-body-1">input the info</small>
                    </template>
                    <v-form>
                      <v-container>
                        <v-row>
                          <v-col class="d-flex" cols="12" sm="12" md="12">
                            <v-select
                              dense
                              v-model="transferForm.exportDeptId"
                              :items="dept"
                              item-value="id"
                              item-text="name"
                              label="Department"
                            ></v-select>
                          </v-col>

                          <v-col class="d-flex" cols="12" sm="12" md="12">
                            <v-select
                              dense
                              v-model="transferForm.exportUserId"
                              :items="userExport"
                              item-value="id"
                              item-text="username"
                              label="client manager"
                            ></v-select>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-form>
                  </material-card>
                </v-col>
                <v-col cols="12" sm="12" md="6">
                  <!-- 移入方查询列表 -->
                  <material-card
                    icon="mdi-account-outline"
                    icon-small
                    color="accent"
                  >
                    <template #title>
                      Client Transfer to —
                      <small class="text-body-1">input the info</small>
                    </template>
                    <v-form>
                      <v-container>
                        <v-row>
                          <v-col class="d-flex" cols="12" sm="6">
                            <v-select
                              dense
                              v-model="transferForm.importDeptId"
                              :items="dept"
                              item-value="id"
                              item-text="name"
                              label="Department"
                            ></v-select>
                          </v-col>

                          <v-col class="d-flex" cols="12" sm="6">
                            <v-select
                              dense
                              v-model="transferForm.importUserId"
                              :items="userImport"
                              item-value="id"
                              item-text="username"
                              label="client manager"
                            ></v-select>
                          </v-col>

                          <v-col cols="12" md="6">
                            <v-text-field
                              dense
                              v-model="transferForm.clientName"
                              label="Client Name"
                            />
                          </v-col>

                          <v-col cols="12" md="6">
                            <v-text-field
                              dense
                              v-model="transferForm.chanceName"
                              label="Chance Name"
                            />
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-form>
                  </material-card>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" class="text-right">
                  <v-btn outlined color="blue-grey" class="ma-2 white--text">
                    Reset
                    <v-icon right>mdi-refresh</v-icon>
                  </v-btn>
                  <v-btn
                    color="green"
                    outlined
                    class="ma-2 white--text"
                    @click="searchTransfer"
                  >
                    Search
                    <v-icon right>mdi-magnify</v-icon>
                  </v-btn>
                </v-col>
              </v-row>

              <v-row>
                <v-col>
                  <!-- 客户移交表单 -->

                  <v-container>
                    <v-data-table
                      v-model="selected3"
                      :headers="transferHeaders"
                      :items="transferLogs"
                      item-key="chanceNum"
                      show-select
                      class="rounded-0"
                    >
                      <template v-slot:top>
                        <v-toolbar flat>
                          <v-toolbar-title
                            >Client Transfer Table</v-toolbar-title
                          >
                          <v-spacer></v-spacer>
                          <!-- 按钮行 -->

                          <download-excel
                            class="export-excel-wrapper"
                            :data="ClientTransfer"
                            name="ClientTransfer.xls"
                          >
                            <v-btn-toggle v-model="icon" borderless>
                              <v-btn value="export3">
                                <span class="hidden-sm-and-down">Export</span>

                                <v-icon right> mdi-export </v-icon>
                              </v-btn>
                            </v-btn-toggle>
                          </download-excel>
                        </v-toolbar>
                      </template>
                    </v-data-table>
                  </v-container>
                </v-col>
              </v-row>
            </div>
          </v-container>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "RegularTablesView",

  mounted: function () {
    this.$axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${localStorage.getItem("token")}`;
    this.loginUser = JSON.parse(localStorage.getItem("user"));
    this.queryDepartment();
    this.queryCustomerManager();
    this.init();
  },

  watch: {
    //监听整个返回值，通过变化的dept_id去queryuser
    querySaleslog: {
      handler() {
        this.$axios
          .get("http://47.98.166.180:14000/npms/user/get_user_by_dept_id", {
            params: {
              user_id: this.loginUser.id,
              role_id: this.loginUser.roleId,
              dept_id: this.querySaleslog.dept.id,
            },
          })
          .then((res) => {
            console.log(res);
            if (res.data.status == 200) {
              this.customer_manager1 = res.data.obj;
            }
          });
      },
      immediate: true,
      deep: true,
    },
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
            if(res.data.obj!=null){
              this.user = res.data.obj;
            }else{
              this.user=[]
            }
            
          });
      },
    },
    "transferForm.exportDeptId": {
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
            this.userExport = res.data.obj;
          });
      },
    },
    //TODO 测试查不到client 监听客户搜索 绑定autocomplete
  search(val) {
    
    // Items have already been loaded
    if (this.items.length > 0||val==''||val==null) return;
    console.log("search")
    console.log(val)
    this.isSearching = true;
    this.$axios
      .get("http://8.140.46.173:16000/client/query_client", {
        params: {
          name: val,
          clientNum: this.form.clientNum,
          deptId: this.form.dept_id,
          userId: this.form.user_id,
        },
      })
      .then((res) => {
        console.log(res);
        this.items = res.data.obj;
      })
      .then((res) => {
        this.isSearching = false;
      });
  },
    "transferForm.importDeptId": {
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
            this.userImport = res.data.obj;
          });
      },
    },
  },
  

  data() {
    return {
      
      loginUser:JSON.parse(localStorage.getItem("user")),
      clientQueryFormValid:false,
      afterSearch: false,
      selected1: [],
      selected2_1: [],
      selected2_2: [],
      selected3: [],

      //控制tab1里的销售日报表单的loading动画
      isLoading: false,

      //需要返回给后端查询对象
      querySaleslog: {
        dept: { id: "", name: "", deptNum: "" },
        customerManager: "",
        week: "",
        start_date: "",
        end_date: "",
      },
      //需要从后端拿到的department列表
      department1: [{ name: "", id: "", deptNum: "" }],

      //需要从后端拿到的customerManager列表
      customer_manager1: [{ username: "", id: "" }],

      //静态表中的week数组
      week: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Firday",
        "Saturday",
        "Sunday",
      ],
      headers1: [
        {
          text: "Department",
          align: "start",
          sortable: false,
          value: "dept",
        },
        { text: "Customer Manager Number", value: "customerManagerNumber" },
        { text: "Customer Manager Name", value: "customerManagerName" },
        { text: "Date", value: "date" },
        { text: "Week", value: "week" },
        { text: "Work Content", value: "content" },
      ],

      headers2_1: [
        {
          text: "Name",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "Dept", value: "dept" },
        { text: "Position", value: "position" },
        { text: "Tel", value: "tel" },
        { text: "Phone", value: "phone" },
        { text: "Fax", value: "fax" },
        { text: "Mail", value: "mail" },
        { text: "QQ", value: "qq" },
        { text: "We-Chat", value: "wechat" },
      ],

      headers2_2: [
        {
          text: "Related Client Number ",
          sortable: false,
          value: "number",
        },
        { text: "Related Client Name", value: "name" },
        { text: "Relation", value: "relation" },
      ],

      headers3: [
        { text: "From Dept", value: "fromDept" },
        { text: "From Manager", value: "fromManager" },
        { text: "To Dept", value: "toDept" },
        { text: "To Manager", value: "toManager" },
        { text: "Client Number", value: "clientNumber" },
        { text: "Client Name", value: "clientName" },
        { text: "Chance Number", value: "chanceNumber" },
        { text: "Chance Name", value: "chanceName" },
      ],

      salesLogs: [
        {
          dept: "",
          customerManagerNumber: "",
          customerManagerName: "",
          date: "",
          week: "",
          content: "",
        },
      ],

      ClientContact: [
        {
          name: "yyc",
          dept: "Sales department",
          position: "human resource manager",
          tel: "102-232-22",
          phone: "18906188844",
          fax: "011-233-22",
          mail: "475830085@qq.com",
          qq: "475633423",
          wechat: "18906188582abc",
        },
      ],

      ClientRelate: [
        {
          number: "001",
          name: "Microsoft",
          relation: "father",
        },
      ],

      ClientTransfer: [
        {
          fromDept: "Sales Department",
          fromManager: "yyc",
          toDept: "Human Resource Department",
          toManager: "yyx",
          clientNumber: "0011",
          clientName: "NEUsoft",
          chanceNumber: "20128822",
          chanceName: "SAP",
        },
      ],
      //TAB 2  客户关系查询
      user: [],
      dept: [],
      form: {
        name: "",
        clientNum: "",
        companyTypeId: "",
        dept_id: "",
        user_id: "",
        client:{}
        // client: {
        //   name: null,
        //   clientNum: null,
        //   username: null,
        //   deptName: null,
        // },
      },

      client: {
        basic_info: {},
        client_contacts: [],
        client_relations: [],
      },

      //TAB2 autocomplete 客户查询 下拉框
      search: "",
      items: [],
      isSearching: false,

      //TAB2 客户联系人表格信息
      selectedContact: [],
      contact_headers: [
        { text: "Name", value: "name" },
        { text: "Department", value: "dept" },
        { text: "Position", value: "position" },
        { text: "Tel", value: "tel" },
        { text: "Phone", value: "phone" },
        { text: "Fax", value: "fax" },
        { text: "Email", value: "mail" },
        { text: "WeChat", value: "wechat" },
        { text: "Status", value: "status", sortable: false },
      ],

      //TAB2 客户关系表格信息
      selectedRelation: [],
      relation_headers: [
        {
          text: "ID",
          align: "start",
          sortable: false,
          value: "clientRelateId",
        },
        { text: "Name", value: "clientRelateName" },
        { text: "Relation", value: "clientRelateTypeName" },
      ],

      //TAB3 查询条件
      userImport:[],
      userExport:[],
      transferForm: {
        exportDeptId: null,
        exportUserId: null,
        importDeptId: null,
        importUserId: null,
        clientName: null,
        chanceName: null,
      },

      //TAB3 查询结果
      transferHeaders: [
        { text: "From Dept", value: "exportDeptName" },
        { text: "From Manager", value: "exportUserName" },
        { text: "To Dept", value: "importDeptName" },
        { text: "To Manager", value: "importUserName" },
        { text: "Client Number", value: "clientNum" },
        { text: "Client Name", value: "clientName" },
        { text: "Chance Number", value: "chanceNum" },
        { text: "Chance Name", value: "chanceName" },
      ],
      transferLogs: [
        {
          exportDeptName: "y",
          exportUserName: "",
          importDeptName: "y",
          importUserName: "y",
          clientNum: "",
          clientName: "",
          chanceNum: "",
          chanceName: "",
        },
        {
          exportDeptName: "q",
          exportUserName: "",
          importDeptName: "q",
          importUserName: "",
          clientNum: "",
          clientName: "q",
          chanceNum: "",
          chanceName: "",
        },
      ],
    };
  },

  methods: {
    //清空当前的查询条件
    resetSaleslogQuery() {
      this.querySaleslog = {};
      this.salesLogs = [];
    },

    //从后端拿取的静态部门
    queryDepartment: function () {
      this.$axios
        .get("http://47.98.166.180:14000/npms/chance/get_departments", {
          params: {
            user_id: this.loginUser.id,
            role_id: this.loginUser.roleId,
          },
        })
        .then((res) => {
          if (res.data.status == 200) {
            //把拿到的department同步到下拉框里
            this.department1 = res.data.obj;
            this.dept = res.data.obj;
          }
        });
    },

    //从后端拿取的静态客户经理
    queryCustomerManager: function () {
      this.$axios
        .get("http://47.98.166.180:14000/npms/user/get_user_by_dept_id", {
          params: {
            user_id: this.loginUser.id,
            role_id: this.loginUser.roleId,
            dept_id: this.querySaleslog.dept.id,
          },
        })
        .then((res) => {
          console.log(res);
          if (res.data.status == 200) {
            this.customer_manager1 = res.data.obj;
          }
        });
    },

    //发送post请求到后端，得到list
    searchSaleslog() {
      this.isLoading = true;
      this.$axios
        .get("http://8.140.46.173:12000/npms/sales_log/query_sales_log", {
          params: {
            user_id: this.querySaleslog.customerManager.id,
            start_time: this.querySaleslog.start_date,
            end_time: this.querySaleslog.end_date,
            week: this.querySaleslog.week,
          },
        })
        .then((res) => {
          console.log(res);
          if (res.data.status == 200) {
            //将得到的list传到table里
            console.log(this.querySaleslog);

            for (var i = 0; i < res.data.obj.length; i++) {
              this.salesLogs[i].dept = this.querySaleslog.dept.name;
              this.salesLogs[i].customerManagerNumber =
                this.querySaleslog.customerManager.id;
              this.salesLogs[i].customerManagerName =
                this.querySaleslog.customerManager.username;
              this.salesLogs[i].date = res.data.obj[i].date;
              this.salesLogs[i].week = res.data.obj[i].week;
              this.salesLogs[i].content = res.data.obj[i].content;
            }
            this.isLoading = false;
          }
        });
    },

    //客户查询参数reste
    resetClientQuery() {
      this.form = {};
    },

    //一些请求
    axiosGetClientRelations(id) {
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
          // for(var i =0;i<relation.length;i++){
          //   var type=this.clientRelateType.find(o => o.id === relation[i].clientRelateTypeId);
          //   relation[i].clientRelateTypeName=type.name
          // }
          this.client.client_relations = res.data.obj;
        });
    },
    //根据id获取client详细 用于显示在客户界面表格里
    axiosGetClient(id) {
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

    //客户详细信息查询
    queryClientInfo() {
        var id = this.form.client.id;
        this.afterSearch = false;
        this.$axios
          .all(
            this.axiosGetClient(id),
            this.axiosGetClientRelations(id),
            this.axiosGetClientContacts(id)
          )
          .then((res) => {
            this.afterSearch = true;
          })
          .then((res) => {});
    },

    //TAB3
    //TODO 接口测试
    searchTransfer() {
      console.log(this.transferForm);
      this.$axios
        .get("http://8.140.46.173:16000/client/query_client_transfer_log", {
          params: {
            exportDeptId: this.transferForm.exportDeptId,
            exportUserId: this.transferForm.exportUserId,
            importDeptId: this.transferForm.importDeptId,
            importUserId: this.transferForm.importUserId,
            clientName: this.transferForm.clientName,
            chanceName: this.transferForm.chanceName,
          },
        })
        .then((res) => {
          console.log(res);
          this.transferLogs = res.data.obj;
        });
    },
  },
};
</script>
