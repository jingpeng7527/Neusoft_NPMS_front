<template>
  <div>
    <v-row>
      <v-col cols="12" sm="12" md="6">
        <!-- 移出方查询表单 -->

        <material-card icon="mdi-account-outline" icon-small color="accent">
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
                    :items="department"
                    label="Department"
                  ></v-select>
                </v-col>

                <v-col class="d-flex" cols="12" sm="12" md="12">
                  <v-select
                    dense
                    :items="customer_manager"
                    label="Customer manager"
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </material-card>
      </v-col>
      <v-col cols="12" sm="12" md="6">
        <!-- 移入方查询列表 -->
        <material-card icon="mdi-account-outline" icon-small color="accent">
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
                    :items="department"
                    label="Department"
                  ></v-select>
                </v-col>

                <v-col class="d-flex" cols="12" sm="6">
                  <v-select
                    dense
                    :items="customer_manager"
                    label="Customer manager"
                  ></v-select>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field dense label="Client Name" />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field dense label="Chance Name" />
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
        <v-btn color="green" outlined class="ma-2 white--text">
          Search
          <v-icon right>mdi-magnify</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
        <!-- 客户移交表单 -->

          <v-container>
            <v-data-table
              v-model="selected3"
              :headers="headers3"
              :items="ClientTransfer"
              item-key="name"
              show-select
              class="rounded-0"
              @click:row="test"
            >
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title>Client Transfer Table</v-toolbar-title>
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
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      
    };
  },
  watch: {
   
  },
};
</script>