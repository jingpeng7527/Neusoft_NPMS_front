<template>
  <v-container id="sales-log-table" fluid tag="section">
    <view-intro heading="Sales Log" />

    <v-row>
      <v-col>
        <!-- 查询条件表单 -->
        <material-card icon="mdi-account-outline" icon-small color="accent">
          <template #title>
            Search Log — <small class="text-body-1">input the info</small>
          </template>
          <v-form>
            <v-container>
              <v-row>

                <v-expansion-panels> 
                  <v-expansion-panel class="rounded-0">
                    <v-expansion-panel-header v-slot="{ open }">
                      <v-row no-gutters>
                        <v-col cols="4"> Start and end dates </v-col>
                        <v-col cols="8" class="text--secondary">
                          <v-fade-transition leave-absolute>
                            <span v-if="open"
                              >Please enter the time interval</span
                            >
                            <v-row v-else no-gutters style="width: 100%">
                              <v-col cols="6" md="6" sm="6">
                                Start date:
                                {{ dateinterval.start || "Not set" }}
                              </v-col>
                              <v-col cols="6" md="6" sm="6">
                                End date: {{ dateinterval.end || "Not set" }}
                              </v-col>
                            </v-row>
                          </v-fade-transition>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-row justify="space-around" no-gutters>
                        <v-col cols="12" md="6" sm="6">
                          <v-menu
                            ref="startMenu"
                            :close-on-content-click="false"
                            :return-value.sync="dateinterval.start"
                            offset-y
                            min-width="290px"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="dateinterval.start"
                                label="Start date"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker v-model="date" no-title scrollable>
                              <v-spacer></v-spacer>
                              <v-btn
                                text
                                color="primary"
                                @click="$refs.startMenu.isActive = false"
                              >
                                Cancel
                              </v-btn>
                              <v-btn
                                text
                                color="primary"
                                @click="$refs.startMenu.save(date)"
                              >
                                OK
                              </v-btn>
                            </v-date-picker>
                          </v-menu>
                        </v-col>

                        <v-col cols="12" md="6" sm="6">
                          <v-menu
                            ref="endMenu"
                            :close-on-content-click="false"
                            :return-value.sync="dateinterval.end"
                            offset-y
                            min-width="290px"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="dateinterval.end"
                                label="End date"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker v-model="date" no-title scrollable>
                              <v-spacer></v-spacer>
                              <v-btn
                                text
                                color="primary"
                                @click="$refs.endMenu.isActive = false"
                              >
                                Cancel
                              </v-btn>
                              <v-btn
                                text
                                color="primary"
                                @click="$refs.endMenu.save(date)"
                              >
                                OK
                              </v-btn>
                            </v-date-picker>
                          </v-menu>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-row>

              <v-col cols="12" class="text-right">
                <v-btn
                  outlined
                  color="blue-grey"
                  class="ma-2 white--text"
                  @click="reset()"
                >
                  Reset
                  <v-icon right>mdi-refresh</v-icon>
                </v-btn>
                <v-btn
                  color="green"
                  outlined
                  class="ma-2 white--text"
                  @click="search()"
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
              v-model="selectedSaleslog"
              :headers="headers"
              :items="saleslogs"
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
                  <v-btn-toggle v-model="icon" borderless>
                    <v-btn value="add" @click="openAddSaleslogDialog">
                      <span class="hidden-sm-and-down">Add</span>

                      <v-icon right> mdi-bookmark-plus-outline </v-icon>
                    </v-btn>

                    <v-btn value="edit" @click="openEditSaleslogDialog">
                      <span class="hidden-sm-and-down">Edit</span>

                      <v-icon right> mdi-pencil </v-icon>
                    </v-btn>

                    <v-btn value="delete" @click="openDeleteSaleslogDialog">
                      <span class="hidden-sm-and-down">Delete</span>

                      <v-icon right> mdi-delete </v-icon>
                    </v-btn>
                  </v-btn-toggle>
                </v-toolbar>
              </template>
            </v-data-table>
          </v-container>
        </material-card>
      </v-col>
    </v-row>

    <!-- 新建销售日报的增加 dialog -->
    <v-dialog v-model="addSaleslogDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Add Sales Log</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="6">
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
                      v-model="newSaleslogs.date"
                      label="Picker without buttons"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="newSaleslogs.date"
                    @input="menu2 = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  label="Week"
                  required
                  v-model="computedDateFormattedDatefns"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="12">
                <v-textarea
                  v-model="newSaleslogs.content"
                  label="Work content"
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
          <v-btn color="blue darken-1" text @click="closeAddSalesLogDialog">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="saveAddSalesLogDialog">
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

    <!-- 删除销售日报时的删除dialog -->
    <v-dialog v-model="deleteSaleslogDialog" max-width="290">
      <v-card>
        <v-card-title class="text-h5"> Delete </v-card-title>


        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" text @click="deleteSaleslogCancel">
            Cancel
          </v-btn>

          <v-btn color="green darken-1" text @click="deleteSaleslogConfirm">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { format, parseISO } from "date-fns";
export default {
  name: "SalesLogTableView",

  data() {
    return {
      isLoading: false,
      //提示框
      message: "",
      snackbar: false,
      success: false,

      //显示dialog
      addSaleslogDialog: false,
      deleteSaleslogDialog: false,
      //新增销售日报中绑定的对象
      newSaleslogs: {
        date: format(parseISO(new Date().toISOString()), "yyyy-MM-dd"),
        week: "",
        content: "",
      },
      //要传给后端的日期时间段
      dateinterval: {
        name: "",
        location: null,
        start: null,
        end: null,
      },

      locations: [
        "Australia",
        "Barbados",
        "Chile",
        "Denmark",
        "Ecuador",
        "France",
      ],

      //绑定当前的saleslog table中被选定的那一项
      selectedSaleslog: [],
      //修改saleslog时确认的edit
      editedSalesDialogIndex: -1,
      headers: [
        {
          text: "Sales date",
          align: "start",
          value: "date"
        },
        { text: "Week ", value: "week" },
        { text: "Work content", value: "content" },
      ],
      saleslogs: [
        {
          //新增时没有ID，修改时有ID
          //新增时，访问存储端口后，要重新访问刷新表格的端口，然后就会获得id
          id: "",
          date: "",
          week: "",
          content: "",
        },
      ],
    };
  },

  computed: {
    computedDateFormattedDatefns() {
      if (this.newSaleslogs.date == null) {
        return "";
      } else {
        return this.newSaleslogs.date
          ? format(parseISO(this.newSaleslogs.date), "EEEE")
          : "";
      }
    },
  },

  mounted: function () {
    this.$axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${localStorage.getItem("token")}`;
    this.search();
  },

  //监听新增对话框里的week属性，并且将其存入newSalesLogs
  watch: {
    computedDateFormattedDatefns: {
      handler() {
        this.newSaleslogs.week = this.computedDateFormattedDatefns;
      },
    },
  },

  methods: {
    search() {
      console.log(this.dateinterval);
      this.isLoading = true;
      if (this.dateinterval.start == null || this.dateinterval.end == null) {
        (this.dateinterval.start = "2021-07-01"),
          (this.dateinterval.end = "2021-07-30");
      }
      this.$axios
        .get("http://8.140.46.173:12000/npms/sales_log/query_sales_log", {
          params: {
            user_id: "2",
            start_time: this.dateinterval.start,
            end_time: this.dateinterval.end,
          },
        })
        .then((res) => {
          console.log(res);
          if (res.data.status == 200) {
            console.log(res.data.obj);
            this.saleslogs = res.data.obj;
          } else {
            //still in this login page
            return;
          }
          this.isLoading = false;
        });
    },

    //将dateinterval清零
    reset() {
      this.dateinterval = {};
    },

    //新增按钮时，打开新增对话框
    openAddSaleslogDialog() {
      this.addSaleslogDialog = true;
      this.editedSalesDialogIndex = -1;
      this.newSaleslogs = {};
    },

    //修改按钮时，打开修改对话框
    openEditSaleslogDialog() {
      //如果当前选中的行不止一个
      if (this.selectedSaleslog.length != 1) {
        console.log("select again");
        this.message = "Please Select One Row to Edit"
        this.snackbar = true
      } else {
        console.log(this.selectedSaleslog);
        console.log(this.selectedSaleslog[0]);
        //打开新增对话框
        this.addSaleslogDialog = true;
        this.editedSalesDialogIndex = this.saleslogs.indexOf(
          this.selectedSaleslog[0]
        );
        console.log("this.editedSalesLog" + this.editedSalesDialogIndex);
        this.newSaleslogs = Object.assign({}, this.selectedSaleslog[0]);
        console.log(this.newSaleslogs);
      }
    },

    //点击关闭按钮时，关闭新增对话框
    closeAddSalesLogDialog() {
      this.addSaleslogDialog = false;
      console.log(this.newSaleslogs);
      this.newSaleslogs = {};
      this.selectedSaleslog = [];
    },

    //点击新增对话框中的保存按钮时，关闭新增对话框，并且将内容存储到saleslog里
    //TODO 将内容传给后端
    saveAddSalesLogDialog() {
      this.addSaleslogDialog = false;
      console.log(this.newSaleslogs);
      //分为新增和修改两种情况
      if (this.editedSalesDialogIndex > -1) {
        //当打开的是修改对话框时
        //把当前选中的那一行数据更新并且到saleslogs里
        Object.assign(
          this.saleslogs[this.editedSalesDialogIndex],
          this.newSaleslogs
        );
        this.$axios
          .post("http://8.140.46.173:12000/npms/sales_log/insert_or_update", {
            id: this.newSaleslogs.id,
            userId: 2,
            date: this.newSaleslogs.date,
            week: this.newSaleslogs.week,
            content: this.newSaleslogs.content,
          })
          .then((res) => {
            console.log(res);
            if (res.data.status == 200) {
              this.$axios
                .get("http://8.140.46.173:12000/npms/sales_log/query_sales_log", {
                  params: {
                    user_id: "2",
                    start_time: this.dateinterval.start,
                    end_time: this.dateinterval.end,
                  },
                })
                .then((res) => {
                  console.log(res);
                  if (res.data.status == 200) {
                    console.log(res.data.obj);
                    this.saleslogs = res.data.obj;
                  } else {
                    //still in this login page
                    return;
                  }
                  this.isLoading = false;
                });
            } else {
              //still in this login page
              return;
            }
          });
      } else {
        //新增的时候假推，为了修改方便所以还是删掉
        // this.saleslogs.push(this.newSaleslogs);

        // TODO 将数据从前端传给后端并存储
        this.$axios
          .post("http://8.140.46.173:12000/npms/sales_log/insert_or_update", {
            id: this.newSaleslogs.id,
            userId: 2,
            date: this.newSaleslogs.date,
            week: this.newSaleslogs.week,
            content: this.newSaleslogs.content,
          })
          .then((res) => {
            console.log(res);
            if (res.data.status == 200) {
              this.$axios
                .get("http://8.140.46.173:12000/npms/sales_log/query_sales_log", {
                  params: {
                    user_id: "2",
                    start_time: this.dateinterval.start,
                    end_time: this.dateinterval.end,
                  },
                })
                .then((res) => {
                  console.log(res);
                  if (res.data.status == 200) {
                    console.log(res.data.obj);
                    this.saleslogs = res.data.obj;
                  } else {
                    //still in this login page
                    return;
                  }
                  this.isLoading = false;
                });
            } else {
              //still in this login page
              return;
            }
          });
      }
      this.message = "Operation Success!";
      this.success = true;
      this.newSaleslogs = {};
      this.selectedSaleslog = [];
    },

    //点击删除按钮时，打开是否确认删除的对话框
    openDeleteSaleslogDialog() {
      if (this.selectedSaleslog.length != 1) {
        console.log("重新选择");
        this.message = "Please Select One Row to delete";
        this.snackbar = true;
      } else {
        this.deleteSaleslogDialog = true;
        this.editedSalesDialogIndex = this.saleslogs.indexOf(
          this.selectedSaleslog[0]
        );
      }
    },

    //取消删除
    deleteSaleslogCancel() {
      this.deleteSaleslogDialog = false;
      this.newSaleslogs = {};
      this.selectedSaleslog = [];
    },

    //确认删除

    deleteSaleslogConfirm() {
      // this.saleslogs.splice(this.editedSalesDialogIndex, 1);

      this.$axios
        .get("http://8.140.46.173:12000/npms/sales_log/delete_sales_log", {
          params: {
            id: this.selectedSaleslog[0].id,
          },
        })
        .then((res) => {
          console.log(res);
          if (res.data.status == 200) {
            console.log("success");
            this.$axios
              .get("http://8.140.46.173:12000/npms/sales_log/query_sales_log", {
                params: {
                  user_id: "2",
                  start_time: this.dateinterval.start,
                  end_time: this.dateinterval.end,
                },
              })
              .then((res) => {
                console.log(res);
                if (res.data.status == 200) {
                  console.log(res.data.obj);
                  this.saleslogs = res.data.obj;
                } else {
                  //still in this login page
                  return;
                }
                this.isLoading = false;
              });
          } else {
          }
        });

      this.message = "Operation Success!";
      this.success = true;
      this.deleteSaleslogDialog = false;
      this.newSaleslogs = {};
      this.selectedSaleslog = [];
    },
  },
};
</script>
