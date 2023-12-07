gt<template>
  <div>
    <!-- 修改或者删除时的message bars -->
    <v-snackbar v-model="snackbar" color="green" :timeout="2000" top>
      {{ message }}
    </v-snackbar>
    <material-card icon="mdi-account-outline" icon-small color="accent">
      <template #title>
        Chances Process Infomation —
        <small class="text-body-1">Select Chances to Approve</small>
      </template>
      <v-data-table
        :headers="headers"
        :items="chances"
        item-key="clientNum"
        class="rounded-0"
        :loading="isLoading"
        loading-text="Loading... Please wait"
        @click:row="openChanceDetailDialog"
      >
        <template v-slot:[`item.option`]="{ item }">
          <v-chip color="green" @click.stop="approve(item)" dark> Approve </v-chip>
        </template>
      </v-data-table>
    </material-card>
    <!-- 审批意见dialog -->
    <v-dialog v-model="approveDialog" width="auto">
      <material-card color="primary" icon-small icon="mdi-account-outline">
        <template #title>
            Chance Approval 
          </template>
        <v-container>
          <div class="text-h4 mb-5">
            Chances Approval Log —
            <small class="text-body-1">Information should be considerate</small>
          </div>

          <!-- 机会审批日志表格 -->
          <v-data-table
            :headers="chanceApprovalHeaders"
            :items="chanceApprovalLog"
          >
          </v-data-table>
          <div class="text-h4 mb-5">Chances Trace Log</div>
          <!-- 机会跟踪table -->
          <v-data-table :headers="traceHeaders" :items="chanceTraceLogs">
          </v-data-table>
          <!-- 审批意见表单 -->
          <div class="text-h4 mb-5">
            Approval Status —
            <small class="text-body-1">Fill the form</small>
          </div>
          <v-form ref="approveForm">
            <v-row>
              <v-col cols="12" md="4" v-if="selected.chanceStatusId==8" >
                <v-select
                  clearable
                  required
                  :rules="[(v) => !!v || 'You must select to continue!']"
                  v-model="selected.opinionTypeId"
                  :items="opinionTypeEdit"
                  item-value="id"
                  item-text="name"
                  dense
                  label="Opinion Type"
                />
              </v-col>
              <v-col cols="12" md="4" v-else >
                <v-select
                  clearable
                  required
                  :rules="[(v) => !!v || 'You must select to continue!']"
                  v-model="selected.opinionTypeId"
                  :items="opinionTypeCreate"
                  item-value="id"
                  item-text="name"
                  dense
                  label="Opinion Type"
                />
              </v-col>
              <v-col cols="12" md="8">
                <v-text-field
                  dense
                  color="purple"
                  v-model="selected.content"
                  label="Content"
                />
              </v-col>
              <v-col cols="12" class="text-right">
                  <v-btn
                    outlined
                    color="blue-grey"
                    @click.stop="approveDialog=false"
                    class="ma-2 white--text"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    color="green"
                    @click="submitApproval"
                    outlined
                    class="ma-2 white--text"
                  >
                    Submit
                  </v-btn>
                </v-col>
            </v-row>
          </v-form>
        </v-container>
      </material-card>
    </v-dialog>
    <!-- 机会详情dialog -->
    <v-dialog
      v-model="chanceDetailDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <ChanceCURDialog
        :transferchancebasicinfo="chancebasicinfo"
        :transfersubchances="subchances"
        :transfercompetitions="competitions"
        :transferpolicymakers="policymakers"
        :edit="isedit"
        :issave="issave"
        :isprocess="isprocess"
        :isdetail="isdetail"
        v-on:refreshChance="refreshChance"
      />
    </v-dialog>
  </div>
</template>
<script>
import { get, sync } from "vuex-pathify";
export default {
  components: {
    ChanceCURDialog: () =>
      import(
        /* webpackChunkName: "default-drawer-header" */
        "./components/ChanceCURDialog"
      ),
  },
  data() {
    return {
      snackbar:"",
      message:"",
      
      approveDialog: false,
      localUser:{},
      //控制机会详情界面的按钮可见
      isdetail: true,
      isedit: true,
      issave: false,
      isprocess: true,

      //需要传给子组件的四个infos
      chancebasicinfo: {},
      subchances: [],
      competitions: [],
      policymakers: [],

      selectedChanceNum: "",
      chanceDetailDialog: false,

      chanceApprovalLog: [],
      chanceApprovalHeaders: [
        {
          text: "Chance Name",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "Status", value: "chanceApproveState" },
        { text: "Opinion", value: "opinion" },
        { text: "Approval Person", value: "userName" },
      ],

      //

      selected: {},
      headers: [
        {
          text: "ID",
          align: "start",
          sortable: false,
          value: "chanceNum",
        },
        { text: "Process Name", value: "processName" },
        { text: "Chance Name", value: "name" },
        { text: "Client Manager", value: "userName" },
        { text: "Create Data", value: "createDate" },
        { text: "Option", value: "option" },
      ],
      chances: [],

      chanceTraceLogs: [],

      traceHeaders: [
        { text: "Interview Date", value: "create_date" },
        { text: "Our Personnel", value: "our_personnel" },
        { text: "Client Personnel", value: "client_personnel" },
        { text: "Third Party Personnel", value: "third_party_personnel" },
        { text: "Communication Type", value: "communication_type" },
        { text: "Address", value: "address" },
        { text: "Condition", value: "communication_condition" },
        { text: "effect", value: "effect" },
      ],
    };
  },
  mounted() {
    this.localUser = JSON.parse(localStorage.getItem("user"));
    this.init();
  },
  computed: {
    ...get("static", ["opinionTypeCreate","opinionTypeEdit"]),
  },
  methods: {

    submitApproval(){
      
      this.selected.userId=this.localUser.id
      console.log(this.selected)
      this.$axios({
          method: "post",
          url: "http://47.98.166.180:14000/npms/chance-draft/approve_chance_draft_by_chance_num",
          data: this.selected,
        }).then((res) => {
          console.log(res);
          this.snackbar = true;
          this.message = "Succeess!";
          this.selected={}
          this.axiosGetInitChance()
        });
      this.axiosGetInitChance()
      this.approveDialog=false

    },
    init() {
      this.$axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${localStorage.getItem("token")}`;
      this.loginUser = JSON.parse(localStorage.getItem("user"));
      console.log(this.loginUser);
      this.isLoading = true;
      this.axiosGetInitChance()
    },

    axiosGetInitChance(){
      this.$axios
        .get("http://47.98.166.180:14000/npms/chance-draft/get_TOApprove_chance_list_by_user_id", {
          params: {
            userId: this.loginUser.id,
          },
        })
        .then((res) => {
          console.log(res);
          this.isLoading = false;
          if (res.data.obj != null) {
            var list = res.data.obj;
            for (var i = 0; i < list.length; i++) {
              list[i].processName = "Chance " + list[i].chanceStatusName;
            }
            this.chances = list;
          }
        });
    },

    axiosGetBasicInfo() {
      this.$axios
        .get(
          "http://47.98.166.180:14000/npms/chance-draft/get_TOApprove_chance_basic_info_by_chance_num",
          {
            params: {
              chanceNum: this.selectedChanceNum,
            },
          }
        )
        .then((res) => {
          console.log(res);
          this.chancebasicinfo = res.data.obj;
          this.$forceUpdate();
        });
    },

    axiosGetSubChance() {
      this.$axios
        .get(
          "http://47.98.166.180:14000/npms/chance-draft/get_TOApprove_sub_chance_list_by_chance_num",
          {
            params: {
              chanceNum: this.selectedChanceNum,
            },
          }
        )
        .then((res) => {
          console.log(res);
          this.subchances = res.data.obj;
          this.$forceUpdate();
        });
    },
    axiosGetCompetition() {
      this.$axios
        .get("http://47.98.166.180:14000/npms/competition/get_competition_by_chance_num", {
          params: {
            chance_num: this.selectedChanceNum,
          },
        })
        .then((res) => {
          console.log(res);
          this.competitions = res.data.obj;
          this.$forceUpdate();
        });
    },

    axiosPolicymaker() {
      this.$axios
        .get("http://47.98.166.180:14000/npms/policymaker/get_policymaker_by_chance_num", {
          params: {
            chance_num: this.selectedChanceNum,
          },
        })
        .then((res) => {
          console.log(res);
          this.policymakers = res.data.obj;

          this.$forceUpdate();
        });
    },

    axiosGetTraceLog() {
      this.$axios
        .get("http://8.140.46.173:19000/chance/chance_trace_log/query", {
          params: {
            chance_num: this.selectedChanceNum,
          },
        })
        .then((res) => {
          console.log(res);
          this.chanceTraceLogs = res.data.obj;
          this.$forceUpdate();
        });
    },

    axiosGetApprovalLog() {
      this.$axios
        .get(
          "http://47.98.166.180:14000/npms/chance-approve-log/get_chance_approve_log_by_chance_num",
          {
            params: {
              chance_num: this.selectedChanceNum,
            },
          }
        )
        .then((res) => {
          console.log(res);
          this.chanceApprovalLog = res.data.obj;
          this.$forceUpdate();
        });
    },

    openChanceDetailDialog(item) {
      console.log(item);
      this.chanceDetailDialog = true;
      this.selectedChanceNum = item.chanceNum;
      console.log(this.selectedChanceNum);
      this.axiosGetBasicInfo();
      this.axiosGetSubChance();
      this.axiosGetTraceLog();
      this.axiosGetCompetition();
      this.axiosPolicymaker();
      this.axiosGetApprovalLog();
    },

    //父子组件传旨,同时关闭新增或者修改机会的界面
    refreshChance(chanceInfo) {
      console.log(chanceInfo);
      var chance = chanceInfo;
      this.chanceDetailDialog = false;
    },

    approve(item) {
      this.axiosGetApprovalLog();
      this.axiosGetTraceLog();
      console.log(item)
      this.selected=item
      console.log("!!!!!!!")
      console.log(this.chanceTraceLogs)
      console.log(this.chanceApprovalLog)
      this.approveDialog = true;
    },
  },
};
</script>
