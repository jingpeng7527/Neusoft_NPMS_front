<template>
  <div>
    <v-snackbar v-model="snackbar" :timeout="2000" top color="green">
      {{ message }}
    </v-snackbar>

    <!-- 删除客户关系Dialog -->

    <!-- 客户界面的 新增/编辑客户全屏弹出窗 -->
    <!-- <v-dialog fullscreen hide-overlay v-model="addDialog"> -->
    <v-card>
      <v-card-title>
        <span class="text-h2 ml-5" v-show="!isEdit & !isDetail"
          >Add Client</span
        >
        <span class="text-h2 ml-5" v-show="isEdit">Edit Client</span>
        <span class="text-h2 ml-5" v-show="isDetail">Detailed Client Info</span>
      </v-card-title>
      <!-- 新增客户 基本信息 表单 -->
      <v-container>
        <div class="text-h3 black--text mb-5">Client Basic Info</div>
        <v-form>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                disabled
                dense
                label="Client ID"
                v-model="client.basic_info.clientNum"
              />
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                dense
                :readonly="isDetail"
                color="purple"
                v-model="client.basic_info.name"
                label="Client Name"
              />
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                dense
                :readonly="isDetail"
                color="purple"
                v-model="client.basic_info.taxpayerCode"
                label="Taxpayer Code"
              />
              <!-- 检验唯一性 -->
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                clearable
                :readonly="isDetail"
                v-model="client.basic_info.country"
                :items="regiondata.country"
                item-value="enKey"
                item-text="enKey"
                dense
                label="Country"
                prepend-icon="mdi-map"
              >
              </v-autocomplete>
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                clearable
                :readonly="isDetail"
                v-model="client.basic_info.accountGroupId"
                :items="accountGroup"
                item-value="accountNum"
                item-text="name"
                dense
                label="Account Group"
              />
            </v-col>
            <!-- 省市区 三级联动 -->
            <!-- 国外 文本框 -->
            <div v-show="client.basic_info.country === 'China' ? false : true">
              <v-col cols="12" md="12">
                <v-row>
                  <v-col cols="12" md="4">
                    <v-text-field
                      clearable
                      :readonly="isDetail"
                      v-model="client.basic_info.province"
                      dense
                      label="Province"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      clearable
                      :readonly="isDetail"
                      v-model="client.basic_info.city"
                      dense
                      label="City"
                  /></v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      clearable
                      :readonly="isDetail"
                      v-model="client.basic_info.district"
                      dense
                      label="District"
                  /></v-col>
                </v-row>
              </v-col>
            </div>
            <!-- 国内 选择器 -->
            <div v-show="client.basic_info.country === 'China' ? true : false">
              <v-col cols="12" md="12">
                <v-row>
                  <v-col cols="12" md="4">
                    <v-select
                      clearable
                      :readonly="isDetail"
                      v-model="client.basic_info.province"
                      :items="regiondata.province"
                      item-value="code"
                      item-text="name"
                      dense
                      label="Province"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-select
                      clearable
                      :readonly="isDetail"
                      v-model="client.basic_info.city"
                      :items="regiondata.city[client.basic_info.province]"
                      item-value="code"
                      item-text="name"
                      dense
                      label="City"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-select
                      clearable
                      :readonly="isDetail"
                      v-model="client.basic_info.district"
                      :items="regiondata.area[client.basic_info.city]"
                      item-value="code"
                      item-text="name"
                      dense
                      label="District"
                    />
                  </v-col> </v-row
              ></v-col>
            </div>

            <v-col cols="12" md="8">
              <v-text-field
                dense
                :readonly="isDetail"
                color="purple"
                v-model="client.basic_info.address"
                label="Address"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                dense
                color="purple"
                :readonly="isDetail"
                v-model="client.basic_info.postcode"
                label="Postcode"
              />
            </v-col>

            <v-col cols="12" md="4">
              <v-select
                clearable
                :readonly="isDetail"
                v-model="client.basic_info.companyTypeId"
                :items="companyType"
                item-value="id"
                item-text="name"
                dense
                label="Company Type"
              />
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                dense
                :readonly="isDetail"
                color="purple"
                v-model="client.basic_info.productType"
                label="Product Type"
              />
            </v-col>

            <v-col cols="12" md="4">
              <v-select
                dense
                :readonly="isDetail"
                v-model="client.basic_info.taxTypeId"
                :items="taxType"
                item-value="taxTypeNum"
                item-text="name"
                color="purple"
                label="Tax Type"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                dense
                :readonly="isDetail"
                color="purple"
                v-model="client.basic_info.annualSalesRevenue"
                label="Annual Sales Revenue"
              />
            </v-col>
            <v-col cols="12" md="8">
              <v-text-field
                dense
                :readonly="isDetail"
                color="purple"
                v-model="client.basic_info.coreSoftwareBrand"
                label="Core Software"
              />
            </v-col>

            <v-col cols="12" md="12">
              <v-text-field
                dense
                :readonly="isDetail"
                color="purple"
                v-model="client.basic_info.website"
                label="Website"
              />
            </v-col>

            <v-col cols="12" md="12">
              <v-textarea
                dense
                :readonly="isDetail"
                color="purple"
                v-model="client.effect"
                label="Effect"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-container>
      <!-- 新增客户 联系人信息 表格 -->
      <v-container>
        <div class="text-h3 black--text mb-5">Client Contact Info</div>
        <v-data-table
          v-model="selectedContact"
          :headers="contact_headers"
          :items="client.client_contacts"
          item-key="name"
          show-select
          single-select
          class="rounded-0"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-spacer></v-spacer>
              <v-btn-toggle borderless v-show="!isDetail">
                <v-btn @click.stop="openAddContactDialog">
                  <span class="hidden-sm-and-down">Add</span>
                  <v-icon right> mdi-plus-box-multiple-outline </v-icon>
                </v-btn>

                <v-btn @click.stop="openEditContactDialog">
                  <span class="hidden-sm-and-down">Edit</span>
                  <v-icon right> mdi-pencil-outline </v-icon>
                </v-btn>
<!-- 
                <v-btn @click.stop="frozenContact" v-show="isEdit">
                  <span class="hidden-sm-and-down">Frozen</span>
                  <v-icon right> mdi-pencil-outline </v-icon>
                </v-btn> -->

                <v-btn @click.stop="deleteContact">
                  <span class="hidden-sm-and-down">Delete</span>

                  <v-icon right> mdi-delete-outline </v-icon>
                </v-btn>
              </v-btn-toggle>
            </v-toolbar>
          </template>
          
          <template v-if="loginUser.roleId==5" v-slot:[`item.status`]="{ item }">
            <v-chip
              :color="getColor(item.status)"
              @click.stop="frozenContact(item)"
              dark
            >
              {{ item.status }}
            </v-chip>
          </template>
        </v-data-table>
      </v-container>
      <!-- <client-contacts :contacts="client.client_contacts" /> -->
      <!-- 新增客户 关系 表格 -->
      <v-container>
        <div class="text-h3 black--text mb-5">Client Relations Info</div>
        <v-data-table
          v-model="selectedRelation"
          :headers="relation_headers"
          :items="client.client_relations"
          item-key="id"
          show-select
          single-select
          class="rounded-0"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <!-- "clientCurrentId": 1,
            "clientRelateId": 2,
            "clientRelateTypeId": 2,
            "clientRelateName": "apple" -->
              <!-- <v-toolbar-title
                              >Client Information Table</v-toolbar-title
                            > -->
              <v-spacer></v-spacer>
              <!--增改export按钮和对话框-->
              <v-btn-toggle borderless v-show="!isDetail">
                <v-btn value="add" @click.stop="openAddRelationDialog">
                  <span class="hidden-sm-and-down">Add</span>
                  <v-icon right> mdi-plus-box-multiple-outline </v-icon>
                </v-btn>

                <v-btn value="edit" @click.stop="openEditRelationDialog">
                  <span class="hidden-sm-and-down">Edit</span>
                  <v-icon right> mdi-pencil-outline </v-icon>
                </v-btn>

                <v-btn @click.stop="deleteRelation">
                  <span class="hidden-sm-and-down">Delete</span>

                  <v-icon right> mdi-delete-outline </v-icon>
                </v-btn>
              </v-btn-toggle>
            </v-toolbar>
          </template>
        </v-data-table>
      </v-container>
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="green darken-1" text @click="cancel"> Cancel </v-btn>

        <v-btn color="green darken-1" text @click="submit"> Confirm </v-btn>
      </v-card-actions>
    </v-card>
    <!-- 新建客户里面的 增加联系人dialog -->
    <v-dialog v-model="addContactDialog" persistent max-width="800">
      <v-card>
        <!-- <v-card-title class="text-h5"> Edit Client </v-card-title> -->

        <v-container class="pa-5">
          <div class="text-h3 black--text mb-5">Add Client Contact Info</div>

          <v-form>
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  dense
                  label="Contact Name"
                  v-model="contact.name"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field dense label="Department" v-model="contact.dept" />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  dense
                  label="Position"
                  v-model="contact.position"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field dense label="Tel" v-model="contact.tel" />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  dense
                  label="Phone Number"
                  v-model="contact.phone"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field dense label="Fax" v-model="contact.fax" />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field dense label="E-mail" v-model="contact.mail" />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field dense label="QQ" v-model="contact.qq" />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field dense label="WeChat" v-model="contact.wechat" />
              </v-col>
            </v-row>
          </v-form>
        </v-container>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" text @click="addContactDialog = false">
            Cancel
          </v-btn>

          <v-btn color="green darken-1" text @click="addContact()">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 新建客户里面的 删除联系人dialog -->
    <v-dialog v-model="deleteContactDialog" max-width="290">
      <v-card>
        <v-card-title class="text-h5"> Delete Client </v-card-title>

        <v-card-text>
          Let Google help apps determine location. This means sending anonymous
          location data to Google, even when no apps are running.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" text @click="deleteItemCancel">
            Cancel
          </v-btn>

          <v-btn color="green darken-1" text @click="deleteItemConfirm">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 新建客户里面的 增加关系dialog -->
    <v-dialog v-model="addRelationDialog" persistent max-width="800">
      <v-card>
        <!-- <v-card-title class="text-h5"> Edit Client </v-card-title> -->

        <v-container class="pa-5">
          <div class="text-h3 black--text mb-5">Client Relations Info</div>

          <v-form>
            <v-row>
              <v-col cols="12" md="4">
                <v-select
                  clearable
                  v-model="relation.client_relate_type"
                  :items="clientRelateType"
                  item-value="clientRelateNum"
                  item-text="name"
                  dense
                  return-object
                  label="Relate Type"
                />
              </v-col>
              <!-- 查询客户 -->
              <v-col cols="12" md="12">
                <v-autocomplete
                  v-model="relation.client_relate_client"
                  :items="items"
                  :loading="isLoading"
                  :search-input.sync="search"
                  chips
                  clearable
                  hide-details
                  hide-selected
                  item-text="clientName"
                  item-value="clientNum"
                  label="Search Client"
                  prepend-inner-icon="mdi-magnify"
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
                  <template v-slot:selection="{ attr, on, item, selected }">
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
                      <v-list-item-title v-text="item.clientName"></v-list-item-title>
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
          </v-form>
        </v-container>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" text @click="addRelationDialog = false">
            Cancel
          </v-btn>

          <v-btn color="green darken-1" text @click="relationConfirm()">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 新建客户里面的 删除关系dialog -->
    <v-dialog v-model="deleteRelationDialog" max-width="290">
      <v-card>
        <v-card-title class="text-h5"> Delete Client Relation</v-card-title>

        <v-card-text>
          Let Google help apps determine location. This means sending anonymous
          location data to Google, even when no apps are running.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" text @click="deleteRelationCancel">
            Cancel
          </v-btn>

          <v-btn color="green darken-1" text @click="deleteRelationConfirm">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { get } from "vuex-pathify";
export default {
  //"./ClientContactsCURD"
  name: "ClientCURDialog",
  components: {
    // ClientContacts: () =>
    //   import(
    //       "./ClientContactsCURD.vue"
    //   )
  },
  props: ["clientInfo", "edit", "detail"],
  computed: {
    ...get("static", [
      "accountGroup",
      "companyType",
      "taxType",
      "clientRelateType",
    ]),
  },
  watch: {
    //   edit:{
    //       handler(newValue, oldValue) {
    //           console.log(newValue,oldValue)
    //           this.isEdit=newValue;
    //       },
    //       deep:true
    //   },
    //   "clientInfo.isDetail":{
    //       handler(newValue, oldValue) {
    //           this.isDetail=newValue;
    //       }
    //   },
    clientInfo: {
      handler(newValue, oldValue) {
        this.client=newValue;
        this.isEdit=newValue.isEdit;
        this.isDetail=newValue.isDetail;
        console.log("zhigaibian")
        console.log(newValue,oldValue)
        console.log(this.client)
      },
      deep: true,
    },
    edit(val) {
      console.log("zizujian" + this.isEdit);
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
        })
        .then((res) => {
          this.isLoading = false;
        })
    },
  },
  data() {
    return {
      search: "",
      items: [],
      isLoading: false,
      //Dialog 显示
      deleteContactDialog: false,
      addContactDialog: false,
      addRelationDialog: false,
      deleteRelationDialog: false,
      detailDialog: false,
      addDialog: false,
      testAddDialog: false,
      //关系
      relation: {},
      selectedRelation: [],
      //关系表头
      editedClientRelationIndex: -1,
    
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
      //联系人
      contact: {},
      selectedContact: [],
      //联系人表头
      editedClientContactIndex: -1,
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

      snackbar: false,
      message: "",

      isEdit: this.clientInfo.isEdit,
      isDetail: this.clientInfo.isDetail,
      client: this.clientInfo,
      contacts: this.clientInfo.client_contacts,

      regiondata: {
        city: [],
        country: [],
        province: [],
        area: [],
      },
      loginUser:{}
    };
  },

  created() {
    //console.log("ul created" + this.isEdit);
  },
  mounted() {
    //console.log("ul mounted" + this.isEdit);
    this.$axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${localStorage.getItem("token")}`;
    this.loginUser = JSON.parse(localStorage.getItem("user"));
    this.getRegion();
  },
  beforeCreate() {
    //console.log("ul beforeCreate" + this.isEdit);
  },
  beforeMount() {
    //console.log("ul beforeMount" + this.isEdit);
  },
  beforeUpdate() {
    //console.log("ul beforeUpdate" + this.isEdit);
  },
  updated() {
    //console.log("ul updated" + this.isEdit);
  },
  beforeDestroy() {
    //console.log("ul beforeDestroy" + this.isEdit);
  },
  destroyed() {
    //console.log("ul destroyed" + this.isEdit);
  },
  methods: {
    getRegion() {
      console.log(this.client);
      this.$axios.get("/province.json").then((res) => {
        //console.log(res.data);
        this.regiondata.province = res.data;
      });
      this.$axios.get("/country.json").then((res) => {
        //console.log(res.data);
        this.regiondata.country = res.data;
      });
      this.$axios.get("/area.json").then((res) => {
        //console.log(res.data);
        this.regiondata.area = res.data;
      });
      this.$axios.get("/city.json").then((res) => {
        //console.log(res.data);
        this.regiondata.city = res.data;
      });
    },
    submit() {
      this.client.deleteRelationList=this.deleteRelationList
      console.log(this.client);
      this.$emit("refreshClient", this.client);
      this.deleteRelationList=[]
    },
    cancel() {
        this.client.deleteRelationList=this.deleteRelationList
      console.log(this.client);
      this.$emit("refreshClient", {});
      this.deleteRelationList=[]
    },

    //contacts
    getColor(status) {
      if (status == "frozen") return "grey";
      else return "green";
    },
    //打开新增 修改客户联系人对话框
    openAddContactDialog() {
      console.log(this.selectedContact);
      console.log(this.selectedContact[0]);
      this.addContactDialog = true;
      this.editedClientContactIndex = -1;
      this.contact = {};
      console.log(this.contact);
    },
    openEditContactDialog() {
      if (this.selectedContact.length != 1) {
        console.log("重新选择");
        this.message = "Please Select One Contact to Edit";
        this.snackbar = true;
      } else if(this.selectedContact[0].status=='frozen'&&this.loginUser.roleId!=5){
        console.log("重新选择");
        this.message = "Have No Authority to Edit Frozen Contact";
        this.snackbar = true;
      } else if(this.selectedContact[0].status=='frozen'&&this.loginUser.roleId==5){
        console.log("重新选择");
        this.message = "Please change the status to normal before edit";
        this.snackbar = true;
      }
      else {
        console.log(this.selectedContact);
        console.log(this.selectedContact[0]);
        this.addContactDialog = true;
        this.editedClientContactIndex = this.client.client_contacts.indexOf(
          this.selectedContact[0]
        );
        console.log(
          "this.editedClientContactIndex" + this.editedClientContactIndex
        );
        this.contact = Object.assign({}, this.selectedContact[0]);
        console.log(this.contact);
      }
    },
    contactClose() {
      this.contact = {};
      this.editedClientContactIndex = -1;
      this.selectedContact = [];
    },
    //客户新增 确认/修改 新增联系人
    addContact() {
      this.addContactDialog = false;
      this.contact.status="frozen"
      if (this.editedClientContactIndex > -1) {
        Object.assign(
          this.client.client_contacts[this.editedClientContactIndex],
          this.contact
        );
      } else {
        this.client.client_contacts.push(this.contact);
      }

      this.contactClose();
    },
    //冻结联系人
    frozenContact(item) {
      console.log(item);
      var index = this.client.client_contacts.indexOf(item);
      var tempItem = Object.assign({}, item);
      var tempStatus = tempItem.status;
      console.log(tempItem.status);
      tempItem.status = tempStatus == "frozen" ? "nomal" : "frozen";
      console.log(tempItem);
      Object.assign(this.client.client_contacts[index], tempItem);
      console.log(this.client.client_contacts[index]);
    },
    //删除联系人
    deleteContact() {
      if (this.selectedContact.length != 1) {
        console.log("重新选择");
        this.message = "Please Select One Contact to Delete";
        this.snackbar = true;
      } else {
        this.editedClientContactIndex = this.client.client_contacts.indexOf(
          this.selectedContact[0]
        );
        this.deleteContactDialog = true;
      }
    },

    //关系
    //打开新增/修改关系
    openAddRelationDialog() {
      this.addRelationDialog = true;
      this.editedClientRelationIndex = -1;
      this.relation = {};
    },
    openEditRelationDialog() {
      if (this.selectedRelation.length != 1) {
        console.log("重新选择");
        this.message = "Please Select One Relation to Edit";
        this.snackbar = true;
      } else {
        this.addRelationDialog = true;
        this.editedClientRelationIndex = this.client.client_relations.indexOf(
          this.selectedRelation[0]
        );
        this.relation = Object.assign({}, this.selectedRelation[0]);
      }
    },
    relationClose() {
      this.relation = {};
      this.editedClientRelationIndex = -1;
      this.selectedRelation = [];
    },
    relationConfirm() {
      this.addRelationDialog = false;
      this.relation.clientRelateId = this.relation.client_relate_client.id;
      this.relation.clientRelateName = this.relation.client_relate_client.clientName;
      this.relation.clientRelateTypeId = this.relation.client_relate_type.id;
      this.relation.clientRelateTypeName =
        this.relation.client_relate_type.name;
      console.log(this.relation);
      if (this.editedClientRelationIndex > -1) {
        Object.assign(
          this.client.client_relations[this.editedClientRelationIndex]
        );
      } else {
        this.client.client_relations.push(this.relation);
      }
      console.log(this.relation);
      console.log(this.client.client_relations);
      this.relationClose();
    },
    //删除关系
    deleteRelation() {
      if (this.selectedRelation.length != 1) {
        console.log("重新选择");
        this.message = "Please Select One Client to Delete";
        this.snackbar = true;
      } else {
        this.editedClientRelationIndex = this.client.client_relations.indexOf(
          this.selectedRelation[0]
        );
        this.deleteRelationDialog = true;
      }
    },
    deleteRelationConfirm() {
      //如果关系是有id的需要记录下
      if (this.selectedRelation[0].id != null) {
        console.log(this.selectedRelation[0]);
        console.log("deleteList 里面");
        this.deleteRelationList.push(this.selectedRelation[0].id);
      }

      //if(this.client.client_relations[this.editedClientRelationIndex].client_id)
      this.client.client_relations.splice(this.editedClientRelationIndex, 1);
      this.deleteRelationDialog = false;
      this.relationClose();
    },
    deleteRelationCancel() {
      this.deleteRelationDialog = false;
      this.relationClose();
    },

    deleteItemConfirm() {
      this.client.client_contacts.splice(this.editedClientContactIndex, 1);
      this.deleteContactDialog = false;
      this.contactClose();
    },
    deleteItemCancel() {
      this.deleteContactDialog = false;
      this.contactClose();
    },
  },
};
</script>
