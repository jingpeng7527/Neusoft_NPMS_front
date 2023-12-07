<template>
  <div>
    <v-card>
      <v-card-title>
        <span class="text-h2">Chance Info</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <div class="text-h3 black--text">Chance Stage</div>
          <v-stepper v-model="e1">
            <v-stepper-header>
              <v-stepper-step :complete="e1 > 1" step="1">
                Only intention
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="e1 > 2" step="2">
                Communication
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="e1 > 3" step="3">
                End of exchange
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="e1 > 4" step="4">
                Bidding
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="e1 > 5" step="5">
                Won the bid
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="e1 > 6" step="6">
                Contract signed
              </v-stepper-step>
            </v-stepper-header>
          </v-stepper>
        </v-container>

        <!-- 机会的基本信息 -->
        <v-container>
          <div class="text-h3 black--text">Chance Basic Info</div>
          <v-row>
            <v-col cols="12" sm="6" md="6">
              <v-text-field
                label="Chance Name*"
                required
                v-model="chanceBasicInfo.chanceName"
                :disabled="watchProcess"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="6">
              <v-select
                v-model="chanceBasicInfo.chanceSource"
                label="Chance Source"
                :items="addChanceSource"
                item-text="name"
                item-value="id"
                return-object
                :disabled="watchProcess"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-select
                label="Chance Stage"
                v-model="chanceBasicInfo.chanceStage"
                :items="addChanceStage"
                item-text="name"
                item-value="id"
                return-object
                :disabled="watchProcess"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-checkbox
                v-model="chanceBasicInfo.oldCustomer"
                :label="`Regular tobacco customers`"
                :disabled="watchProcess"
              ></v-checkbox>
            </v-col>

            <v-col cols="12" sm="8" md="8">
              <!-- <v-text-field
                label="Client Name"

                hint="example of persistent helper text"
                persistent-hint
                v-model="chanceBasicInfo.clientName"
                required
              ></v-text-field> -->

              <v-autocomplete
                v-model="chanceBasicInfo.clientId"
                :items="items"
                :search-input.sync="search"
                chips
                clearable
                hide-details
                hide-selected
                item-text="clientName"
                item-value="id"
                label="Search Client"
                prepend-inner-icon="mdi-magnify"
                dense
                :disabled="watchProcess"
              >
                <template v-slot:no-data>
                  <v-list-item>
                    <v-list-item-title>
                      Search for your
                      <strong>Client</strong>
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

            <v-col cols="12" sm="4" md="4">
              <v-btn
                tile
                depressed
                value="add"
                @click.stop="openAddClientDialog"
              >
                <span class="hidden-sm-and-down">Add</span>
                <v-icon right> mdi-plus-box-multiple-outline </v-icon>
              </v-btn>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-select
                v-model="chanceBasicInfo.chanceBelong"
                label="Chance Belong"
                :items="addChanceBelong"
                item-text="name"
                item-value="id"
                return-object
                :disabled="watchProcess"
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
                :disabled="watchProcess"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="chanceBasicInfo.presignDate"
                    label="Presign Date"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    :disabled="watchProcess"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="chanceBasicInfo.presignDate"
                  @input="menu = false"
                ></v-date-picker>
              </v-menu>
            </v-col>

            <v-col cols="12" sm="12" md="12">
              <v-textarea
                v-model="chanceBasicInfo.chanceBackground"
                name="chanceBackground"
                label="Chance Background"
                value=""
                hint="Hint text"
                :disabled="watchProcess"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-container>

        <!-- 子机会类型列表 -->
        <v-container>
          <v-data-table
            v-model="subSelected"
            :headers="subHeaders"
            :items="subChances"
            item-key="subName"
            show-select
            class="rounded-0"
          >
            <template v-slot:top>
              <v-toolbar flat>
                <div class="text-h3 black--text">Sub Chance Table</div>
                <!-- <v-toolbar-title>Chance Information Table</v-toolbar-title> -->
                <v-spacer></v-spacer>
                <!-- 按钮行 -->
                <v-btn-toggle v-model="icon" borderless>
                  <v-btn
                    @click.stop="openAddSubChanceDialog"
                    v-show="!watchProcess"
                  >
                    <span class="hidden-sm-and-down">Add</span>

                    <v-icon right> mdi-bookmark-plus-outline </v-icon>
                  </v-btn>

                  <v-btn
                    @click.stop="openEditSubChanceDialog"
                    v-show="!watchProcess"
                  >
                    <span class="hidden-sm-and-down">Edit</span>

                    <v-icon right> mdi-pencil </v-icon>
                  </v-btn>
                  <v-btn
                    @click.stop="openDeleteSubChanceDialog"
                    v-show="!watchEdit"
                  >
                    <span class="hidden-sm-and-down">Delete</span>

                    <v-icon right> mdi-delete </v-icon>
                  </v-btn>
                </v-btn-toggle>
              </v-toolbar>
            </template>
          </v-data-table>
        </v-container>

        <!-- 竞争列表 -->
        <v-container>
          <v-data-table
            v-model="competitionSelected"
            :headers="competitionHeaders"
            :items="competitions"
            item-key="competitor"
            show-select
            class="rounded-0"
          >
            <template v-slot:top>
              <v-toolbar flat>
                <div class="text-h3 black--text">Competition Table</div>
                <!-- <v-toolbar-title>Chance Information Table</v-toolbar-title> -->
                <v-spacer></v-spacer>
                <!-- 按钮行 -->
                <v-btn-toggle v-model="icon" borderless>
                  <v-btn
                    @click.stop="openAddCompetitionDialog"
                    v-show="!watchProcess"
                  >
                    <span class="hidden-sm-and-down">Add</span>

                    <v-icon right> mdi-bookmark-plus-outline </v-icon>
                  </v-btn>

                  <v-btn
                    @click.stop="openEditCompetitionDialog"
                    v-show="!watchProcess"
                  >
                    <span class="hidden-sm-and-down">Edit</span>

                    <v-icon right> mdi-pencil </v-icon>
                  </v-btn>
                  <v-btn
                    @click.stop="openDeleteCompetitionDialog"
                    v-show="!watchEdit"
                  >
                    <span class="hidden-sm-and-down">Delete</span>

                    <v-icon right> mdi-delete </v-icon>
                  </v-btn>
                </v-btn-toggle>
              </v-toolbar>
            </template>
          </v-data-table>
        </v-container>

        <!-- 购买决策人列表 -->
        <v-container>
          <v-data-table
            v-model="selectedPolicymaker"
            :headers="policymakerHeaders"
            :items="policymakers"
            item-key="name"
            show-select
            class="rounded-0"
          >
            <template v-slot:top>
              <v-toolbar flat>
                <div class="text-h3 black--text">Policymaker Table</div>
                <!-- <v-toolbar-title>Chance Information Table</v-toolbar-title> -->
                <v-spacer></v-spacer>
                <!-- 按钮行 -->
                <v-btn-toggle v-model="icon" borderless>
                  <v-btn
                    @click.stop="openAddPolicymakerDialog"
                    v-show="!watchProcess"
                  >
                    <span class="hidden-sm-and-down">Add</span>

                    <v-icon right> mdi-bookmark-plus-outline </v-icon>
                  </v-btn>

                  <v-btn
                    @click.stop="openEditPolicymakerDialog"
                    v-show="!watchProcess"
                  >
                    <span class="hidden-sm-and-down">Edit</span>

                    <v-icon right> mdi-pencil </v-icon>
                  </v-btn>
                  <v-btn
                    @click.stop="openDeletePolicymakerDialog"
                    v-show="!watchEdit"
                  >
                    <span class="hidden-sm-and-down">Delete</span>

                    <v-icon right> mdi-delete </v-icon>
                  </v-btn>
                </v-btn-toggle>
              </v-toolbar>
            </template>
          </v-data-table>
        </v-container>

        <small>*indicates required field</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          text
          @click="submit"
          v-show="!watchDetail && !watchProcess"
        >
          Submit
        </v-btn>
        <v-btn color="blue darken-1" text @click="save" v-show="watchSave">
          Save
        </v-btn>
        <v-btn color="blue darken-1" text @click="cancel"> Cancel </v-btn>
      </v-card-actions>
    </v-card>

    <!-- 子机会新增dialog -->
    <v-dialog v-model="addSubChanceDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Add Sub Chance</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  label="Sub Chance Name*"
                  required
                  rules="rules"
                  v-model="newSubChance.subName"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="newSubChance.subType"
                  :items="subChanceTypes"
                  item-text="text"
                  item-value="id"
                  return-object
                  label="sub Chance Type"
                  single-line
                ></v-select>
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                  v-model="newSubChance.product"
                  :items="subChanceProducts"
                  label="sub Chance Product"
                  single-line
                ></v-select>
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                  v-model="newSubChance.dept"
                  :items="subChanceDepts"
                  item-text="text"
                  item-value="id"
                  return-object
                  label="Department"
                  single-line
                ></v-select>
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                  v-model="newSubChance.currency"
                  :items="subChanceCurrencies"
                  label="Currency"
                  single-line
                ></v-select>
              </v-col>

              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  label="Amount*"
                  required
                  v-model="newSubChance.amount"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                  v-model="newSubChance.status"
                  :items="subChancesStatus"
                  item-text="name"
                  item-value="id"
                  return-object
                  label="Status"
                  single-line
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeAddSubChanceDialog">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="saveAddSubChanceDialog">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 子机会删除dialog -->
    <v-dialog v-model="deleteSubChanceDialog" max-width="290">
      <v-card>
        <v-card-title class="text-h5"> Hint </v-card-title>

        <v-card-text> Are you sure to delete this row of record? </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" text @click="deleteSubChanceCancel">
            NO
          </v-btn>

          <v-btn color="green darken-1" text @click="deleteSubChanceConfirm">
            YES
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 竞争新增dialog -->
    <v-dialog v-model="addCompetitionDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Add Competition</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  label="Competitor*"
                  required
                  v-model="newCompetition.competitor"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="newCompetition.position"
                  :items="competitionsPositionItems"
                  item-text="text"
                  item-value="id"
                  return-object
                  label="Competition Position"
                  single-line
                ></v-select>
              </v-col>

              <v-col cols="12" sm="6">
                <v-switch
                  v-model="newCompetition.state"
                  label="Competition State"
                ></v-switch>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeAddCompetitionDialog">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="saveAddCompetitionDialog">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 竞争删除dialog -->
    <v-dialog v-model="deleteCompetitionDialog" max-width="290">
      <v-card>
        <v-card-title class="text-h5"> Hint </v-card-title>

        <v-card-text> Are you sure to delete this row of record? </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" text @click="deleteCompetitionCancel">
            NO
          </v-btn>

          <v-btn color="green darken-1" text @click="deleteCompetitionConfirm">
            YES
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 购买决策人新增dialog -->
    <v-dialog v-model="addPolicymakerDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Add Policymaker</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  label="Name*"
                  required
                  v-model="newPolicymaker.name"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  label="Department*"
                  required
                  v-model="newPolicymaker.dept"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  label="Position*"
                  required
                  v-model="newPolicymaker.position"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  label="Phone*"
                  required
                  v-model="newPolicymaker.phone"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="newPolicymaker.policymaker"
                  :items="policymakerDialogItems"
                  item-text="text"
                  item-value="id"
                  return-object
                  label="policymaker"
                  single-line
                ></v-select>
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                  v-model="newPolicymaker.effect"
                  :items="effectLevelDialogItems"
                  item-text="text"
                  item-value="id"
                  return-object
                  label="Effect Level"
                  single-line
                ></v-select>
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                  v-model="newPolicymaker.recognition"
                  :items="recognitionLevelDialogItems"
                  item-text="text"
                  item-value="id"
                  return-object
                  label="recognition Level"
                  single-line
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeAddPolicymakerDialog">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="saveAddPolicymakerDialog">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 新增客户dialog -->
    <v-dialog fullscreen hide-overlay v-model="addClientDialog">
      <client-detail-dialog
        :clientInfo="client"
        v-on:refreshClient="refreshClient"
      ></client-detail-dialog>
    </v-dialog>

    <!-- 购买决策人删除dialog -->
    <v-dialog v-model="deletePolicymakerDialog" max-width="290">
      <v-card>
        <v-card-title class="text-h5"> Hint </v-card-title>

        <v-card-text> Are you sure to delete this row of record? </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" text @click="deletePolicymakerCancel">
            NO
          </v-btn>

          <v-btn color="green darken-1" text @click="deletePolicymakerConfirm">
            YES
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

    <!-- 客户界面的 新增/编辑客户全屏弹出窗 -->
    <!-- <v-dialog fullscreen hide-overlay v-model="testAddDialog">
        <ClientCURDialog
          :clientInfo="client"
          v-on:refreshClient="refreshClient"
        />
      </v-dialog> -->
  </div>
</template>

<script>
export default {
  components: {
    clientDetailDialog: () =>
      import(
        /* webpackChunkName: "default-drawer-header" */
        "./ClientCURDialog"
      )
  },

  //从父组件拿到的数据
  props: [
    "transferchancebasicinfo",
    "transfersubchances",
    "transfercompetitions",
    "transferpolicymakers",
    "transferchancenum",
    "edit",
    "issave",
    "isprocess",
    "isdetail"
  ],
  mounted: function() {
    this.init();
    this.queryDepartment();
    this.watchEdit = this.edit;
    this.watchSave = this.issave;
    this.watchProcess = this.isprocess;
    this.watchDetail = this.isdetail;
    //尝试绑定
    //绑定有问题
  },

  watch: {
    //监听search
    search(val) {
      // Items have already been loaded
      if (this.items.length > 0 && this.noUpdate) return;

      // Lazily load input items
      this.$axios
        .get("http://8.140.46.173:16000/client/query_client", {
          params: {
            name: val
          }
        })
        .then(res => {
          console.log(res);
          this.items = res.data.obj;
        });
    },

    //监听edit
    edit: {
      handler(newvalue, oldvalue) {
        this.watchEdit = newvalue;
        console.log("thi is i the wath");
        console.log(this.edit);
        console.log(this.watchEdit);
      },
      immediate: true,
      deep: true
    },

    transferchancebasicinfo: {
      handler(newvalue, oldvalue) {
        console.log("********************aaaaaaaaaaaaa");
        //将后端拿到的chanceBasicInfo赋值到子界面
        this.fakeChanceBasicInfo = newvalue;
        console.log(this.fakeChanceBasicInfo);
        this.chanceBasicInfo.chanceNum = this.fakeChanceBasicInfo.chanceNum;
        this.chanceBasicInfo.chanceName = this.fakeChanceBasicInfo.name;
        (this.chanceBasicInfo.clientId = this.fakeChanceBasicInfo.clientId),
          (this.chanceBasicInfo.chanceSource = {
            id: this.fakeChanceBasicInfo.chanceSourceId,
            name: this.fakeChanceBasicInfo.chanceSourceName
          });

        this.chanceBasicInfo.chanceStage = {
          id: this.fakeChanceBasicInfo.chanceStageId,
          name: this.fakeChanceBasicInfo.chanceStageName
        };

        this.chanceBasicInfo.chanceStatus = {
          id: this.fakeChanceBasicInfo.chanceStatusId,
          name: this.fakeChanceBasicInfo.chanceStatusName
        };

        this.chanceBasicInfo.oldCustomer = this.fakeChanceBasicInfo.old;
        this.chanceBasicInfo.id=this.fakeChanceBasicInfo.id
        this.chanceBasicInfo.clientName = this.fakeChanceBasicInfo.clientName
        this.chanceBasicInfo.createDate = this.fakeChanceBasicInfo.createDate
        this.chanceBasicInfo.chanceBelong = {
          id: this.fakeChanceBasicInfo.deptId,
          name: this.fakeChanceBasicInfo.deptName
        };
        (this.chanceBasicInfo.presignDate = this.fakeChanceBasicInfo.presignDate),
          (this.chanceBasicInfo.chanceBackground = this.fakeChanceBasicInfo.background);
        this.chanceBasicInfo.userId = this.fakeChanceBasicInfo.userId;
      },
      immediate: true,
      deep: true
    },

    //将后端拿到的subChance赋值到子界面
    transfersubchances: {
      handler(newvalue, oldvalue) {
        this.fakeSubChances = newvalue;
        console.log("********************bbbbbbbbbbbbb");
        console.log(this.fakeSubChances);
        for (var i = 0; i < this.fakeSubChances.length; i++) {
          this.subChances.push({
            subChanceNum: this.fakeSubChances[i].subChanceNum,
            subName: this.fakeSubChances[i].name,
            subType: {
              id: this.fakeSubChances[i].chanceTypeNum,
              text: this.fakeSubChances[i].chanceTypeValue
            },
            subTypeName: this.fakeSubChances[i].chanceTypeValue,
            product: this.fakeSubChances[i].productNum,
            dept: {
              id: this.fakeSubChances[i].deptId,
              text: this.fakeSubChances[i].deptName
            },
            deptName: this.fakeSubChances[i].deptName,
            currency: this.fakeSubChances[i].currency,
            amount: this.fakeSubChances[i].moneyAmount,
            status: {
              id: this.fakeSubChances[i].subChanceStatusId,
              text: this.fakeSubChances[i].chanceStatusName
            },
            statusName: this.fakeSubChances[i].chanceStatusName
          });
        }
        console.log("this is the new subHcnaes");
        console.log(this.subChances);
      },
      immediate: true,
      deep: true
    },

    //将后端拿到的compeitions赋值到子界面
    transfercompetitions: {
      handler(newvalue, oldvalue) {
        (this.fakeCompetitions = newvalue),
        console.log("***********************ccccccccccccc");
        console.log(this.fakeCompetitions);
        for (var i = 0; i < this.fakeCompetitions.length; i++) {
          this.competitions.push({
            id:this.fakeCompetitions[i].id,
            competitor: this.fakeCompetitions[i].competitor,
            position: {
              id: this.fakeCompetitions[i].competitivePositionId,
              text: this.fakeCompetitions[i].competitivePositionName
            },
            positionName: this.fakeCompetitions[i].competitivePositionName,
            state: this.fakeCompetitions[i].state
          });
        }
        this.$forceUpdate()
      },
      immediate: true,
      deep: true
    },

    //将后端拿到的policymakers赋值到子界面
    transferpolicymakers: {
      handler(newvalue, oldvalue) {
        this.fakePolicymakers = newvalue;
        console.log("********************dddddddddddddddd");
        console.log(this.fakePolicymakers);
        for (var i = 0; i < this.fakePolicymakers.length; i++) {
          this.policymakers.push({
            id:this.fakePolicymakers[i].id,
            name: this.fakePolicymakers[i].name,
            dept: this.fakePolicymakers[i].dept,
            position: this.fakePolicymakers[i].position,
            phone: this.fakePolicymakers[i].tel,
            policymaker: {
              id: this.fakePolicymakers[i].policymakerTypeId,
              text: this.fakePolicymakers[i].policymakerTypeName
            },
            policymakerName: this.fakePolicymakers[i].policymakerTypeName,
            effect: {
              id: this.fakePolicymakers[i].effectLevelId,
              text: this.fakePolicymakers[i].effectLevelName
            },
            effectName: this.fakePolicymakers[i].effectLevelName,
            recognition: {
              id: this.fakePolicymakers[i].recognitionLevelId,
              text: this.fakePolicymakers[i].recognitionLevelName
            },
            recognitionName: this.fakePolicymakers[i].recognitionLevelName
          });
        }
      },
      immediate: true,
      deep: true
    },

    issave: {
      handler(newvalue, oldvalue) {
        this.watchSave = newvalue;
        //这种是新增
        if(this.watchSave  == true) {
          this.watchIntoProcess =1
        }
      },
      immediate:true,
      deep:true
    },

    // isprocess: {
    //   handler(newvalue, oldvalue) {
    //     this.watchProcess = newvalue;
    //     console.log("this is in the watch and watchProcess");
    //   }
    // },

    isdetail: {
      handler(newvalue, oldvalue) {
        this.watchDetail = newvalue;
      }
    },

    //监听子机会的情况，如果发生变化进入审批
    subChances: {
      handler() {
        if (this.watchSave == true) {
          //确定是新增状态
          this.watchIntoProcess = 1;
        } else {
          this.watchIntoProcess = 3;
        }
      },
      deep: true
    },

    //监听chancebelong的变化，更新到需要传给后端的参数里
    "chanceBasicInfo.chanceBelong": {
      handler() {
        if (this.watchSave == true) {
          //确定是新增状态
          this.watchIntoProcess = 1;
        } else {
          this.watchIntoProcess = 3;
        }
      }
    },

    // 监听chanceStage的变化，更新到stepper里
    "chanceBasicInfo.chanceStage": {
      handler(newvalue, oldvalue) {
        this.e1 = this.chanceBasicInfo.chanceStage.id;
        console.log("e1");
        console.log(this.e1);
        console.log("old");
        console.log(oldvalue);
        console.log(newvalue);
        if (newvalue.id < oldvalue.id) {
          //如果是逆向修改，才会触发审批
          if (this.watchSave == true) {
            this.watchIntoProcess = 1;
          } else {
            this.watchIntoProcess = 3;
          }
        }
      },
      immediate:true,
    },

    //监听整个返回值，通过变化的dept_id去queryuser
    newSubChance: {
      handler() {
        //通过chanceType更新product
        this.$axios
          .get(
            "http://47.98.166.180:14000/npms/chance-type-product/get_product_by_chance_type_num",
            {
              params: {
                chance_type_num: this.newSubChance.subType.id
              }
            }
          )
          .then(res => {
            console.log(res);
            if (res.data.status == 200) {
              //将product信息更新到product下拉框里
              //for 循环
              this.subChanceProducts = [];
              for (var i = 0; i < res.data.obj.length; i++) {
                console.log(res.data.obj[i].productNum);
                this.subChanceProducts.push(res.data.obj[i].productNum);
              }
            }
          });

        //通过产品更新部门
        this.$axios
          .get("http://47.98.166.180:14000/npms/product-dept/get_dept_by_product", {
            params: {
              product_num: this.newSubChance.product
            }
          })
          .then(res => {
            console.log(res);
            if (res.data.status == 200) {
              //将部门信息更新到dept下拉框里
              //for 循环
              this.subChanceDepts = [];
              for (var i = 0; i < res.data.obj.length; i++) {
                this.subChanceDepts.push({
                  id: res.data.obj[i].deptId,
                  text: res.data.obj[i].deptName
                });
              }
            }
          });
      },
      immediate: true,
      deep: true
    }
  },

  data() {
    return {
      noUpdate: true,
      newClientId: 0,

      e1: 1,
      menu: false,
      icon: "",
      loginUser: {},
      //只有noraml或者时draft才能修改
      watchEdit: false,
      //只有时草稿draft状态才能save
      watchSave: true,
      //此时的机会是否已经在流程中（指的是非normal或者draft状态）
      watchProcess: false,
      //需要传给后端的，是否需要进入审批的属性
      watchIntoProcess: 2,

      watchDetail: false,
      //从后端拿去到的items（client）
      search: "",
      items: [],
      //从yyc那里调取的新增客户的窗口
      testAddDialog: false,
      client: {},
      defaltClient: {
        basic_info: {},
        client_contacts: [],
        client_relations: []
      },
      message: "",
      //接收从后端拿到的四个数据
      fakeChanceBasicInfo: {},
      fakeSubChances: [],
      fakeCompetitions: [],
      fakePolicymakers: [],

      rules: [value => !!value || "Required."],

      //用于控制新增和修改不同按钮的显示
      deleteSubChanceDisabled: false,

      deleteCompetitionDisabled: false,

      deletePolicymakerDisabled: false,

      //打开提示的两个snackbar
      snackbar: false,
      success: false,

      //全局变量用于储存后端返回的chanceNum
      returnChanceNum: -1,
      //机会基本信息
      //静态chancesource下拉框
      addChanceSource: [
        { id: 1, name: "Company" },
        { id: 2, name: "Personal" },
        { id: 3, name: "Factory owner" }
      ],

      //静态chancestage下拉框
      addChanceStage: [
        { id: 1, name: "Only intention, selection has not yet started" },
        { id: 2, name: "Communication and display" },
        {
          id: 3,
          name: "End of the exchange and display, waiting for bidding"
        },
        { id: 4, name: "Bidding" },
        { id: 5, name: "Won the bid, business, contract" },
        { id: 6, name: "Contract has been signed" }
      ],

      //静态chanceBelong下拉框
      //页面初始化时从后端拿到
      addChanceBelong: [],

      //绑定新增的机会基础信息
      chanceBasicInfo: {
        chanceNum: "",
        chanceName: "",
        clientId: "",
        // clientId: "",
        // clientName: "",
        chanceSource: "",
        chanceStage: "",
        oldCustomer: "",
        chanceBelong: "",
        presignDate: "",
        chanceBackground: "",
        chanceStatus: {
          id: "",
          name: ""
        }
      },

      //绑定当前的子机会table中被选定的那一项
      subSelected: [],
      editedSubChanceIndex: -1,
      //用来控制子机会新增对话框的出现
      addSubChanceDialog: false,
      //用来控制子机会删除对话框的出现
      deleteSubChanceDialog: false,
      //子机会表格内容
      subHeaders: [
        { text: "Sub Chance Name", value: "subName" },
        { text: "Sub Chance Type", value: "subTypeName" },
        { text: "Product", value: "product" },
        { text: "Department", value: "deptName" },
        { text: "Currency", value: "currency" },
        { text: "Amount", value: "amount" },
        { text: "Status", value: "statusName" }
      ],
      subChances: [],

      //静态子机会中的状态下拉框
      subChancesStatus: [
        { id: 1, name: "Normal" },
        { id: 2, name: "Pause" },
        { id: 3, name: "Close" },
        { id: 4, name: "Draft" },
        { id: 5, name: "Processing" }
      ],

      //绑定新增子机会的dialog中的对象
      newSubChance: {
        subName: "",
        subType: "",
        product: "",
        dept: "",
        currency: "",
        amount: "",
        status: ""
      },

      //新增子机会的种类选择栏
      subChanceTypes: [
        { id: "01", text: "Implementation of third-party software products" },
        { id: "02", text: "Custom development" },
        { id: "05", text: "Third-party service" },
        { id: "06", text: "Third-party software product" },
        { id: "07", text: "Third-party software product maintenance fee" },
        { id: "08", text: "Own software products" },
        { id: "09", text: "Own software products maintenance fee" },
        { id: "12", text: "Hardware products" },
        { id: "14", text: "Non-product development" },
        { id: "15", text: "Product development" }
      ],

      //新增子机会的部门选择栏
      subChanceDepts: [
        { text: "Industry department", id: 1 },
        { text: "Sales department", id: 2 },
        { text: "Business department", id: 3 },
        { text: "Other department", id: 4 }
      ],

      //新增子机会的产品类型选择栏
      subChanceProducts: [
        "SAP",
        "ORACLE",
        "Other",
        "3rdParty",
        "NPMS",
        "NFOL",
        "NSRM",
        "Hardware",
        "Non-product",
        "product"
      ],

      //新增子机会的货币选择栏
      subChanceCurrencies: ["$", "¥"],

      // 绑定当前的竞争情况table中被选定的那一项
      competitionSelected: [],
      editedCompetitionIndex: -1,
      //用来控制竞争情况新增/修改对话框的出现
      addCompetitionDialog: false,
      //用来控制竞争情况删除对话框的出现
      deleteCompetitionDialog: false,
      //表单中的header
      competitionHeaders: [
        { text: "Competitor", value: "competitor" },
        { text: "Competition Position", value: "positionName" },
        { text: "State", value: "state" }
      ],
      competitions: [],

      //新增竞争情况的下拉框
      competitionsPositionItems: [
        { text: "The only option", id: 1 },
        { text: "Front runner", id: 2 },
        { text: "Well matched", id: 3 },
        { text: "Behind", id: 4 }
      ],

      //绑定竞争情况的dialog里的对象
      newCompetition: {
        competitor: "",
        position: "",
        state: ""
      },

      //绑定当前的决策人table中被选定的那一项
      selectedPolicymaker: [],
      editedPolicymakerIndex: -1,
      //用来控制购买决策人新增对话框的出现
      addPolicymakerDialog: false,
      //用来控制购买决策人删除对话框的出现
      deletePolicymakerDialog: false,
      // 购买决策人列表
      policymakerHeaders: [
        { text: "Name", value: "name" },
        { text: "Department", value: "dept" },
        { text: "Position", value: "position" },
        { text: "Phone", value: "phone" },
        { text: "Policymaker", value: "policymakerName" },
        { text: "Effect Level", value: "effectName" },
        { text: "Recognition level", value: "recognitionName" }
      ],
      //表格里绑定的决策人信息,这个是一个list，应该是最终需要返回给后端的
      policymakers: [],

      //新增的dialog里绑定的对象
      newPolicymaker: {
        name: "",
        dept: "",
        position: "",
        phone: "",
        policymaker: "",
        effect: "",
        recognition: ""
      },
      //决策人新增窗口中的决策人下拉列表
      policymakerDialogItems: [
        { text: "final policy maker", id: 1 },
        { text: "policy maker", id: 2 },
        { text: "technical director", id: 3 },
        { text: "user", id: 4 }
      ],

      //决策人新增窗口中的影响程度下拉列表
      effectLevelDialogItems: [
        { text: "high", id: 1 },
        { text: "medium", id: 2 },
        { text: "low", id: 3 }
      ],

      //决策人新增窗口中的认程度下啦列表
      recognitionLevelDialogItems: [
        { text: "fully approve", id: 1 },
        { text: "approve", id: 2 },
        { text: "neutral", id: 3 }
      ],

      addClientDialog: false
    };
  },

  methods: {
    //初始化界面，并且从localsession里拿到login客户的信息

    init() {
      this.$axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${localStorage.getItem("token")}`;
      this.loginUser = JSON.parse(localStorage.getItem("user"));
      console.log(this.loginUser);
    },

    //新增客户
    //客户新增
    //yyc 帮忙改跳转到新增客户的界面并且返回client对象
    openAddClientDialog() {
      // this.isEdit = false;
      // this.isDetail = false;
      this.addClientDialog = true;
      this.client = Object.assign({}, this.defaltClient);
      this.client.isEdit = false;
      this.client.isDetail = false;
      this.testAddDialog = true;
      this.editedClientIndex = -1;
    },
    //关闭新增客户窗口
    refreshClient(clientInfo) {
      console.log("clientInfo");
      console.log(clientInfo);
      var client = clientInfo;
      this.addClientDialog = false;
      this.axiosSaveOrUpdateClient(client);
      this.client = {};
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
      client.basic_info.userId = this.loginUser.id;
      //存client
      this.$axios({
        method: "post",
        url: "http://8.140.46.173:16000/client/create_client",
        data: client.basic_info
      })
        .then(res => {
          console.log(res);
          var clientID = res.data.obj.id;
          this.newClientId = clientID;
          //存client contact
          for (var i = 0; i < client.client_contacts.length; i++) {
            client.client_contacts[i].clientId = clientID;
          }
          this.$axios({
            method: "post",
            url: "http://8.140.46.173:16000/client/create_client_contact",
            data: client.client_contacts
          }).then(res => {
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
              data: client.client_relations
            }).then(res => {
              console.log("relate" + res);
              this.snackbar = true;
              this.message = "Succeess Submit";
              this.noUpdate = false;
            });
          });
        })
        .catch(function(error) {
          // handle error
          console.log(error);
        })
        .then(function() {
          // always executed
        });
    },

    submit() {
      // this.$emit("refreshChance", {});
      //TODO:将数据传给后端
      //分为两种情况
      //1. 触发审批，先save后submit
      //2.不触发审批，直接submit

      //先行最终判断此时的状态是否是修改（副打回）还是修改（总打回）
      if(this.chanceBasicInfo.chanceStatus.id == 9) {
        this.watchIntoProcess = 1
      }else if(this.chanceBasicInfo.chanceStatus.id == 10){
        this.watchIntoProcess = 4
      }else if(this.chanceBasicInfo.chanceStatus.id == 4) {
        this.watchIntoProcess = 1
      }
      console.log("*************Submit**************");
      if (this.watchIntoProcess == 2) {
        console.log("watchIntoProcess");
        console.log(this.watchIntoProcess);
        //上传basicInfo
        this.$axios
          .post("http://47.98.166.180:14000/npms/chance/modify_chance_basic_info", {
            chanceNum: this.chanceBasicInfo.chanceNum,
            name: this.chanceBasicInfo.chanceName,
            clientId: this.chanceBasicInfo.clientId,
            chanceSourceId: this.chanceBasicInfo.chanceSource.id,
            chanceStageId: this.chanceBasicInfo.chanceStage.id,
            chanceStatusId: this.chanceBasicInfo.chanceStatus.id,
            presignDate: this.chanceBasicInfo.presignDate,
            old: this.chanceBasicInfo.oldCustomer,
            deptId: this.chanceBasicInfo.chanceBelong.id,
            background: this.chanceBasicInfo.chanceBackground,
            userId: this.chanceBasicInfo.userId,
            chanceStatusId: this.chanceBasicInfo.chanceStatus.id,
            id:this.chanceBasicInfo.id,
            createDate:this.chanceBasicInfo.createDate,
            clientName:this.chanceBasicInfo.clientName
          })
          .then(res => {
            console.log(res);
            //上传compeition
            //上传
            //把拿到的chanceNum存起来，用于传给后端
            this.returnChanceNum = this.chanceBasicInfo.chanceNum;
            this.saveCompetitionInDraft();
            this.savePolicymakerInDraft();
            //清空当前所有的表中数据
                   this.clear();
                   this.$emit("refreshChance", {});
          });
      } else if (this.watchIntoProcess == 1 || this.watchIntoProcess == 3 || this.watchIntoProcess == 4) {
        //触发审批
        //先保存再高审批
        console.log("watchIntoProcess");
        console.log(this.watchIntoProcess);
        var newdemoBasicInfo = {
          chanceNum: this.chanceBasicInfo.chanceNum,
          name: this.chanceBasicInfo.chanceName,
          clientId: this.chanceBasicInfo.clientId,
          chanceSourceId: this.chanceBasicInfo.chanceSource.id,
          chanceStageId: this.chanceBasicInfo.chanceStage.id,
          presignDate: this.chanceBasicInfo.presignDate,
          old: this.chanceBasicInfo.oldCustomer,
          deptId: this.chanceBasicInfo.chanceBelong.id,
          background: this.chanceBasicInfo.chanceBackground,
          userId: this.loginUser.id,
          chanceStatusId: this.chanceBasicInfo.chanceStatus.id
        };

        this.$axios
          .post(
            "http://47.98.166.180:14000/npms/chance-draft/save_chance_in_draft",
            newdemoBasicInfo
          )
          .then(res => {
            console.log(res);
            //把拿到的chanceNum存起来，用于传给后端
            this.returnChanceNum = res.data.obj.chanceNum;
            console.log("this is chanceNum");
            console.log(this.returnChanceNum);
            //将子机会连同chanceNum传给后端
            // this.saveSubChanceInDraft();
            console.log("this is subChances");
      console.log(this.subChances);
      var newdemoSubChances = [];
      for (var i = 0; i < this.subChances.length; i++) {
        var tempChanceTypeProductId = "";
            newdemoSubChances.push({
              
              subChanceNum: this.subChances[i].subChanceNum,
              chanceNum: this.returnChanceNum,
              name: this.subChances[i].subName,
              //TODO:改成将两个参数传回后端进行存储
              chanceTypeProductId: "1",
              deptId: this.subChances[i].dept.id,
              moneyAmount: this.subChances[i].amount,
              currency: this.subChances[i].currency,
              subChanceStatusId:this.subChances[i].status.id
            });
      }
        console.log("this is newdeomoSubchacnes");
        console.log(newdemoSubChances);

        this.$axios
          .post(
            "http://47.98.166.180:14000/npms/sub-chance-draft/save_sub_chance_draft",
            newdemoSubChances
          )
          .then(res => {
            console.log(res);

            console.log("this is in the save dialog");
            console.log(this.subChances);
            //将竞争情况连同chanceNum传给后端
            this.saveCompetitionInDraft();
            console.log("this is in the compeitions");
            console.log(this.competitions);
            //将决策人连同chanceNum传给后端
            this.savePolicymakerInDraft();
            console.log("this is in the policymaker");
            console.log(this.policymakers);

            //此时再submit
            this.$axios
              .get("http://47.98.166.180:14000/npms/chance-draft/submit", {
                params: {
                  chanceNum: this.returnChanceNum,
                  isProcess: this.watchIntoProcess
                }
              })
              .then(res => {
                console.log(res);
                 //清空当前所有的表中数据
                   this.clear();
                   this.$emit("refreshChance", {});
              });
          });
          });
      }

     this.message = "Operation Success!";
      this.success = true;
    },

    cancel() {
      //清空当前所有的表中数据
      this.clear();
      this.$emit("refreshChance", {});
    },

    save() {
      //清空当前所有的表中数据

      //把当前表单内的数据存储到后端
      //将目前的chanceStatus改为草稿中
      this.saveChanceBasicInfoInDraft();

      //TODO:根据得到的chanceNum，把subChanceList传给后端

      //TODO：根据得到的chanceNum，把competition列表传给后端
      // this.saveCompetitionInDraft(chanceNum)

      //TODO：根据得到的chanceNum，把policymaker列表传给后端
      // this.savePolicymakerInDraft(chanceNum)
      //关闭当前的dialog
      this.message = "Operation Success!";
      this.success = true;
    },

    //将机会基本信息传给后端
    saveChanceBasicInfoInDraft() {
       var newdemoSubChances = [];
      console.log("this is chacneBasicINfo");
      console.log(this.chanceBasicInfo);
      // this.chanceBasicInfo.chanceStatus.id = "4";
      // this.chanceBasicInfo.chanceStatus.name = "draft";
      var newdemoBasicInfo = {
        chanceNum: this.chanceBasicInfo.chanceNum,
        name: this.chanceBasicInfo.chanceName,
        clientId: this.chanceBasicInfo.clientId,
        chanceSourceId: this.chanceBasicInfo.chanceSource.id,
        chanceStageId: this.chanceBasicInfo.chanceStage.id,
        presignDate: this.chanceBasicInfo.presignDate,
        old: this.chanceBasicInfo.oldCustomer,
        deptId: this.chanceBasicInfo.chanceBelong.id,
        background: this.chanceBasicInfo.chanceBackground,
        userId: this.loginUser.id,
        chanceStatusId: this.chanceBasicInfo.chanceStatus.id,
      };

      this.$axios
        .post(
          "http://47.98.166.180:14000/npms/chance-draft/save_chance_in_draft",
          newdemoBasicInfo
        )
        .then(res => {
          console.log(res);
          //把拿到的chanceNum存起来，用于传给后端
          this.returnChanceNum = res.data.obj.chanceNum;
          console.log("this is chanceNum");
          console.log(this.returnChanceNum);
          // 将子机会连同chanceNum传给后端
          this.saveSubChanceInDraft();
          console.log("this is in the save dialog subchances");
          console.log(this.subChances);
         
          //将竞争情况连同chanceNum传给后端
          this.saveCompetitionInDraft();
          console.log("this is in the compeitions");
          console.log(this.competitions);
          //将决策人连同chanceNum传给后端
          this.savePolicymakerInDraft();
          console.log("this is in the policymaker");
          console.log(this.policymakers);

          this.clear();
          this.$emit("refreshChance", {});
        }).then(res => {
          // this.$axios
          //   .post(
          //     "http://47.98.166.180:14000/npms/sub-chance-draft/save_sub_chance_draft",
          //     newdemoSubChances
          //   )
          //   .then(res => {
          //     console.log(res);
          //   });
        })
    },

    //将子机会列表传给后端的方法
    saveSubChanceInDraft() {
      console.log("this is subChances");
      console.log(this.subChances);
      var newdemoSubChances = [];
      for (var i = 0; i < this.subChances.length; i++) {
        var tempChanceTypeProductId = "";
            newdemoSubChances.push({
              subChanceNum: this.subChances[i].subChanceNum,
              chanceNum: this.returnChanceNum,
              name: this.subChances[i].subName,
              //TODO:改成将两个参数传回后端进行存储
              chanceTypeProductId: "1",
              deptId: this.subChances[i].dept.id,
              moneyAmount: this.subChances[i].amount,
              currency: this.subChances[i].currency,
              subChanceStatusId:this.subChances[i].status.id
            });
      }
        console.log("this is newdeomoSubchacnes");
        console.log(newdemoSubChances);

        this.$axios
          .post(
            "http://47.98.166.180:14000/npms/sub-chance-draft/save_sub_chance_draft",
            newdemoSubChances
          )
          .then(res => {
            console.log(res);
          });
    },

    //将competition列表传给后端的方法
    saveCompetitionInDraft() {
      console.log("this is subCompetition list");
      console.log(this.competitions);

      var newdemoCompetitions = [];
      for (var i = 0; i < this.competitions.length; i++) {
          newdemoCompetitions.push({
            id:this.competitions[i].id,
          chanceNum: this.returnChanceNum,
          competitor: this.competitions[i].competitor,
          competitivePositionId: this.competitions[i].position.id,
          state: this.competitions[i].state
        });
      }

      this.$axios
        .post(
          "http://47.98.166.180:14000/npms/competition/save_or_update_competition",
          newdemoCompetitions
        )
        .then(res => {
          console.log(res);
        });
    },

    //将policymaker列表传给后端的方法
    savePolicymakerInDraft() {
      console.log("this is the policymaker list");
      console.log(this.policymakers);

      var newdemoPolicymakers = [];
      for (var i = 0; i < this.policymakers.length; i++) {
        newdemoPolicymakers.push({
          id:this.policymakers[i].id,
          chanceNum: this.returnChanceNum,
          name: this.policymakers[i].name,
          dept: this.policymakers[i].dept,
          position: this.policymakers[i].position,
          tel: this.policymakers[i].phone,
          policymakerTypeId: this.policymakers[i].policymaker.id,
          effectLevelId: this.policymakers[i].effect.id,
          recognitionLevelId: this.policymakers[i].recognition.id
        });
      }
      this.$axios
        .post(
          "http://47.98.166.180:14000/npms/policymaker/insert_or_update_policymaker",
          newdemoPolicymakers
        )
        .then(res => {
          console.log(res);
        });
    },

    //清空新增/修改机会对话框中的所有内容
    clear() {
      this.e1 = 1;
      this.chanceBasicInfo = {};
      this.subChances = [];
      this.competitions = [];
      this.policymakers = [];
    },

    //打开新增子机会窗口
    openAddSubChanceDialog() {
      this.addSubChanceDialog = true;
      this.editedSubChanceIndex = -1;
      this.newSubChance = {};
    },

    //关闭新增子机会窗口
    closeAddSubChanceDialog() {
      this.addSubChanceDialog = false;
      console.log(this.newSubChance);
      this.newSubChance = {};
      this.subSelected = [];
    },

    //点击新增对话框中的保存按钮，仅仅更新到子机会表单
    saveAddSubChanceDialog() {
      this.addSubChanceDialog = false;
      //分为新增和修改两种情况
      if (this.editedSubChanceIndex > -1) {
        Object.assign(
          this.subChances[this.editedSubChanceIndex],
          this.newSubChance
        );
        this.subChances[
          this.editedSubChanceIndex
        ].subTypeName = this.newSubChance.subType.text;
        this.subChances[
          this.editedSubChanceIndex
        ].deptName = this.newSubChance.dept.text;
        this.subChances[
          this.editedSubChanceIndex
        ].statusName = this.newSubChance.status.name;

        console.log("this is edited");
        console.log(this.subChances[this.editedSubChanceIndex]);
      } else {
        console.log(this.newSubChance);
        var newdemoSubChance = new Object();
        newdemoSubChance.subName = this.newSubChance.subName;
        newdemoSubChance.subType = this.newSubChance.subType;
        newdemoSubChance.subTypeName = this.newSubChance.subType.text;
        newdemoSubChance.product = this.newSubChance.product;
        newdemoSubChance.dept = this.newSubChance.dept;
        newdemoSubChance.deptName = this.newSubChance.dept.text;
        newdemoSubChance.currency = this.newSubChance.currency;
        newdemoSubChance.amount = this.newSubChance.amount;
        newdemoSubChance.status = this.newSubChance.status;
        newdemoSubChance.statusName = this.newSubChance.status.name;
        this.subChances.push(newdemoSubChance);
      }
      console.log(this.subChances);
      console.log(newdemoSubChance);
      this.message = "Operation Success!";
      this.editedSubChanceIndex = -1;
      this.success = true;
      this.newSubChance = {};
      this.subSelected = [];
    },

    //打开修改子机会窗口
    openEditSubChanceDialog() {
      //如果当前选中的行不止一个
      if (this.subSelected.length != 1) {
        console.log("select again");
        this.message = "Please Select One Row to Edit";
        this.snackbar = true;
      } else {
        //打开新增对话框（其实是修改）
        this.addSubChanceDialog = true;
        this.editedSubChanceIndex = this.subChances.indexOf(
          this.subSelected[0]
        );
        this.newSubChance = Object.assign({}, this.subSelected[0]);
      }
    },

    //打开删除子机会窗口
    openDeleteSubChanceDialog() {
      if (this.subSelected.length != 1) {
        this.message = "Please Select One Row to Delete!";
        this.snackbar = true;
      } else {
        this.deleteSubChanceDialog = true;
        this.editedSubChanceIndex = this.subChances.indexOf(
          this.subSelected[0]
        );
      }
    },

    //取消删除子机会
    deleteSubChanceCancel() {
      this.deleteSubChanceDialog = false;
      this.newSubChance = {};
      this.subSelected = [];
    },

    //确认删除子机会
    deleteSubChanceConfirm() {
      (this.deleteSubChanceDialog = false),
        this.subChances.splice(this.editedSubChanceIndex, 1);
      this.newSubChance = {};
      this.subSelected = [];
    },

    //打开新增决策人窗口
    openAddPolicymakerDialog() {
      this.addPolicymakerDialog = true;
      this.editedPolicymakerIndex = -1;
      this.newPolicymaker = {};
    },

    //关闭新增决策人窗口
    closeAddPolicymakerDialog() {
      this.addPolicymakerDialog = false;
      console.log(this.newPolicymaker);
      this.newPolicymaker = {};
      this.selectedPolicymaker = [];
    },

    //点击新增对话框中的保存按钮，仅仅更新到前端界面里的表内
    saveAddPolicymakerDialog() {
      this.addPolicymakerDialog = false;
      //分为新增和修改两种情况
      if (this.editedPolicymakerIndex > -1) {
        //当打开的是修改对话框
        //把当前选中的那一行数据更新到policymaker里

        //TODO 完成修改
        Object.assign(
          this.policymakers[this.editedPolicymakerIndex],
          this.newPolicymaker
        );
        this.policymakers[
          this.editedPolicymakerIndex
        ].effectName = this.newPolicymaker.effect.text;
        this.policymakers[
          this.editedPolicymakerIndex
        ].recognitionName = this.newPolicymaker.recognition.text;
        this.policymakers[
          this.editedPolicymakerIndex
        ].policymakerName = this.newPolicymaker.policymaker.text;
        console.log("this is edited ");
        console.log(this.policymakers[this.editedPolicymakerIndex]);
      } else {
        //当打开的是新增对话框
        //直接把newPolicymaker的数据push

        this.policymakers.push({
          name: this.newPolicymaker.name,
          dept: this.newPolicymaker.dept,
          position: this.newPolicymaker.position,
          phone: this.newPolicymaker.phone,
          policymakerName: this.newPolicymaker.policymaker.text,
          effectName: this.newPolicymaker.effect.text,
          recognitionName: this.newPolicymaker.recognition.text,
          policymaker: this.newPolicymaker.policymaker,
          effect: this.newPolicymaker.effect,
          recognition: this.newPolicymaker.recognition
        });
      }
      console.log("policymakers");
      console.log(this.policymakers);
      console.log("newPolicyMaker");
      console.log(this.newPolicymaker);
      this.message = "Operation Success!";
      this.success = true;
      this.newPolicymaker = {};
      this.selectedPolicymaker = [];
    },

    //打开修改决策人窗口
    openEditPolicymakerDialog() {
      // this.addPolicymakerDialog = true
      //如果当前选中的行不止一个
      if (this.selectedPolicymaker.length != 1) {
        console.log("select again");
        this.message = "Please Select One Row to Edit";
        this.snackbar = true;
      } else {
        console.log(this.selectedPolicymaker);
        console.log("this is selected policymaker");
        console.log(this.selectedPolicymaker[0]);
        //打开新增对话框
        this.addPolicymakerDialog = true;
        this.editedPolicymakerIndex = this.policymakers.indexOf(
          this.selectedPolicymaker[0]
        );
        console.log("this.editedSalesLog" + this.editedPolicymakerIndex);
        this.newPolicymaker = Object.assign({}, this.selectedPolicymaker[0]);
        console.log(this.newPolicymaker);
      }
    },

    //打开删除决策人窗口
    openDeletePolicymakerDialog() {
      if (this.selectedPolicymaker.length != 1) {
        console.log("select again");
        this.message = "Please Select One Row to delete";
        this.snackbar = true;
      } else {
        this.deletePolicymakerDialog = true;
        this.editedPolicymakerIndex = this.policymakers.indexOf(
          this.selectedPolicymaker[0]
        );
      }
    },

    //取消删除决策人
    deletePolicymakerCancel() {
      this.deletePolicymakerDialog = false;
      this.newPolicymaker = {};
      this.selectedPolicymaker = [];
    },

    //确认删除决策人
    deletePolicymakerConfirm() {
      this.deletePolicymakerDialog = false;
      this.policymakers.splice(this.editedPolicymakerIndex, 1);
      this.newPolicymaker = {};
      this.selectedPolicymaker = [];
    },

    //打开新增竞争窗口
    openAddCompetitionDialog() {
      this.addCompetitionDialog = true;
      this.editedCompetitionIndex = -1;
      this.newCompetition = {};
    },

    //关闭新增竞争窗口
    closeAddCompetitionDialog() {
      this.addCompetitionDialog = false;
      this.newCompetition = {};
      this.competitionSelected = [];
    },

    //点击新增竞争的保存按钮，同步到前端表单
    saveAddCompetitionDialog() {
      this.addCompetitionDialog = false;
      //分为新增和修改两种情况
      if (this.editedCompetitionIndex > -1) {
        //当打开的是修改对话框
        //把当前选中的那一行数据更新到policymaker里

        //TODO 完成修改
        Object.assign(
          this.competitions[this.editedCompetitionIndex],
          this.newCompetition
        );
        this.competitions[
          this.editedCompetitionIndex
        ].positionName = this.newCompetition.position.text;
        console.log("this is edited ");
        console.log(this.competitions[this.editedCompetitionIndex]);
      } else {
        //当打开的是新增对话框
        //直接把newPolicymaker的数据push

        this.competitions.push({
          competitor: this.newCompetition.competitor,
          position: this.newCompetition.position,
          positionName: this.newCompetition.position.text,
          state: this.newCompetition.state
        });
      }
      console.log("this is competions");
      console.log(this.competitions);
      console.log(this.newCompetition.position.text);
      console.log("this is newCompetition");
      console.log(this.newCompetition);
      this.message = "Operation Success!";
      this.success = true;
      this.newPolicymaker = {};
      this.competitionSelected = [];
    },
    //打开修改竞争窗口
    //打开修改决策人窗口
    openEditCompetitionDialog() {
      // this.addPolicymakerDialog = true
      //如果当前选中的行不止一个
      if (this.competitionSelected.length != 1) {
        console.log("select again");
        this.message = "Please Select One Row to Edit";
        this.snackbar = true;
      } else {
        console.log(this.competitionSelected);
        console.log("this is selected policymaker");
        console.log(this.competitionSelected[0]);
        //打开新增对话框
        this.addCompetitionDialog = true;
        this.editedCompetitionIndex = this.competitions.indexOf(
          this.competitionSelected[0]
        );
        console.log("this.editedCompetition" + this.editedCompetitionIndex);
        this.newCompetition = Object.assign({}, this.competitionSelected[0]);
      }
    },
    //打开删除竞争窗口
    openDeleteCompetitionDialog() {
      if (this.competitionSelected.length != 1) {
        console.log("select again");
        this.message = "Please Select One Row to delete";
        this.snackbar = true;
      } else {
        this.deleteCompetitionDialog = true;
        this.editedCompetitionIndex = this.competitions.indexOf(
          this.competitionSelected[0]
        );
      }
    },
    //取消删除竞争
    deleteCompetitionCancel() {
      this.deleteCompetitionDialog = false;
      this.newCompetition = {};
      this.competitionSelected = [];
    },

    //确认删除竞争
    deleteCompetitionConfirm() {
      this.deleteCompetitionDialog = false;
      this.competitions.splice(this.editedCompetitionIndex, 1);
      this.newCompetition = {};
      this.competitionSelected = [];
    },

    //从后端拿取的静态部门
    queryDepartment: function() {
      //为了得到所有的部门充当机会归属而应运而生的奇怪接口
      this.$axios
        .get("http://47.98.166.180:14000/npms/chance/get_departments", {
          params: {
            user_id: "5",
            role_id: "2"
          }
        })
        .then(res => {
          if (res.data.status == 200) {
            //把拿到的department同步到下拉框里
            this.addChanceBelong = res.data.obj;
          }
        });
    }
  }
};
</script>
