<template>
  <v-container id="regular-tables-view" fluid tag="section">
    <view-intro heading="Chance Table" />

    <v-row>
      <v-col>
        <!-- 查询条件表单 -->
        <material-card icon="mdi-account-outline" icon-small color="accent">
          <template #title>
            Search Chance — <small class="text-body-1">input the info</small>
          </template>
          <v-form>
            <v-container>
              <v-row>
                <v-col cols="12" md="3">
                  <v-text-field dense label="Chance number" 
                  v-model="queryChanceInfo.chanceNumber"/>
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field dense color="purple" 
                  label="Chance name" 
                  v-model="queryChanceInfo.chanceName"/>
                </v-col>

                <v-col class="d-flex" cols="12" sm="3">
                  <v-select
                    dense
                    :items="department"
                    label="Department"
                    item-text="name"
                    item-value="id"
                    return-object
                    v-model="queryChanceInfo.department"
                  ></v-select>
                </v-col>

                <v-col class="d-flex" cols="12" sm="3">
                  <v-select
                    dense
                    :items="customer_manager"
                    label="Customer manager"
                    item-text="username"
                    item-value="id"
                    return-object
                    v-model="queryChanceInfo.customerManager"
                  ></v-select>
                </v-col>

                <v-col>
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
                        v-model="queryChanceInfo.start_date"
                        label="Presign date from"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="queryChanceInfo.start_date"
                      @input="menu1 = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                --
                <v-col cols="12" md="3">
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
                        v-model="queryChanceInfo.end_date"
                        label="until"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="queryChanceInfo.end_date"
                      @input="menu2 = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>

                <v-col class="d-flex" cols="12" sm="3">
                  <v-select
                    dense
                    :items="chance_source"
                    label="Chance source"
                    item-text="name"
                    item-value="id"
                    return-object
                    v-model="queryChanceInfo.chanceSource"
                  ></v-select>
                </v-col>

                <v-col class="d-flex" cols="12" sm="3">
                  <v-select
                    dense
                    :items="chance_status"
                    label="Chance status"
                    item-text="name"
                    item-value="id"
                    return-object
                    v-model="queryChanceInfo.chanceStatus"
                  ></v-select>
                </v-col>

                <v-col class="d-flex" cols="12" sm="3">
                  <v-select
                    dense
                    :items="chance_stage"
                    label="Chance stage"
                    item-text="name"
                    item-value="id"
                    return-object
                    v-model="queryChanceInfo.chanceStage"
                  ></v-select>
                </v-col>

                <v-col class="d-flex" cols="12" sm="3">
                  <v-select
                    dense
                    :items="chance_type"
                    label="Chance type"
                    item-text="name"
                    item-value="id"
                    return-object
                    v-model="queryChanceInfo.chanceType"
                  ></v-select>
                </v-col>

                <v-col class="d-flex" cols="12" sm="3">
                  <v-select 
                  dense 
                  :items="chance_product" 
                  label="Product"
                  v-model="queryChanceInfo.product"></v-select>
                </v-col>

                <v-col cols="12" class="text-right">
                  <v-btn outlined color="blue-grey" class="ma-2 white--text" @click="reset">
                    Reset
                    <v-icon right>mdi-refresh</v-icon>
                  </v-btn>
                  <v-btn color="green" outlined class="ma-2 white--text" @click="searchChance">
                    Search
                    <v-icon right>mdi-magnify</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </material-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <!-- 机会table -->
        <material-card>
          <v-container>
            <v-data-table
              v-model="selected"
              :headers="headers"
              :items="chances"
              :single-expand="singleExpand"
              :expanded.sync="expanded"
              item-key="number"
              show-expand
              show-select
              class="rounded-0"
              :loading="isLoading"
              loading-text="Loading... Please wait"
            >

              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title>Chance Information Table</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <!-- 按钮行 -->
                  <v-btn-toggle v-model="icon" borderless>
                    <v-btn value="add" @click.stop="openAddChanceDialog"
                    v-show="isAddBtnVisible">
                      <span class="hidden-sm-and-down">Add</span>

                      <v-icon right> mdi-bookmark-plus-outline </v-icon>
                    </v-btn>

                    <v-btn value="edit" @click.stop="openEditChanceDialog"
                    v-show="isEditBtnVisible" 
                    :loading="isEditLoading">
                      <span class="hidden-sm-and-down">Edit</span>

                      <v-icon right> mdi-pencil </v-icon>
                    </v-btn>

                    <v-btn value="trace" @click.stop="openChanceTraceDialog"
                    v-show="isTraceBtnVisible">
                      <span class="hidden-sm-and-down">Trace</span>

                      <v-icon right> mdi-track-light </v-icon>
                    </v-btn>

                    <download-excel
                      class="export-excel-wrapper"
                      :data="chances"
                      name="ChanceInformation.xls"
                    >
                      <v-btn depressed value="export"
                      v-show="isExportBtnVisible">
                        <span lass="hidden-sm-and-down">Export</span>

                        <v-icon right> mdi-export </v-icon>
                      </v-btn>
                    </download-excel>
                  </v-btn-toggle>
                </v-toolbar>
              </template>
              <template v-slot:expanded-item="{ headers, item }">

                  <td :colspan="headers.length">
        Has to be some subchances of {{ item.name }}

                  
                  <!-- <v-data-table
                  hide-default-header
                  hide-default-footer
                  
    :headers="headers1"
    :items="desserts1"
    :items-per-page="5"
    class="elevation-1"
  ></v-data-table> -->
                </td>

                

              </template>

              <template v-slot:[`item.state`]="{ item }">
      <v-chip
        :color="getColor(item.state)"
        dark
      >
        {{ item.state }}
      </v-chip>
    </template>
            </v-data-table>
          </v-container>
        </material-card>
      </v-col>
    </v-row>

    <!-- 机会新增dialog -->
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      v-if="dialog"
    >
    <ChanceCURDialog
      :transferchancebasicinfo = "chancebasicinfo"
      :transfersubchances = "subchances"
      :transfercompetitions = "competitions"
      :transferpolicymakers = "policymakers"
      :transferchancenum = "chancenum"
      :edit="isedit"
      :issave="issave"
      :isprocess ="isprocess"
      :isdetail = false
      v-on:refreshChance="refreshChance"
    />

    </v-dialog>

    <!-- 机会跟踪记录dialog -->
    <v-dialog
      v-model="chanceTraceDialog"
      transition="dialog-bottom-transition"
      v-if="chanceTraceDialog"
    >
    <ChanceTraceLog
      :transferchancenum = "chancenum"
      :transferchancename = "chancename"
      v-on:refreshChanceTrace="refreshChanceTrace"
    />

    </v-dialog>

    <!-- 修改或者删除时的message bars -->
    <v-snackbar v-model="snackbar" :timeout="2000" top>
      {{ message }}
    </v-snackbar>

    <!-- 操作成功时的message bars -->
     <v-snackbar
      :timeout="2000"
      v-model="success"
      top
      color="primary"
    >
      {{message}}
    </v-snackbar>
    
  </v-container>
</template>

<script>
export default {
  components: {
  ChanceCURDialog: () =>
      import(
        /* webpackChunkName: "default-drawer-header" */
        "./components/ChanceCURDialog"
      ),
  ChanceTraceLog: () =>
      import(
        "./components/ChanceTraceLog"
      ),
  },

  date: null,
  
  name: "RegularTablesView",

  mounted:function() {
    this.init()
    this.queryDepartment();
    this.queryCustomerManager();
    this.checkBtnVisible()

  },

  watch: {
    //监听整个返回值，通过变化的dept_id去queryuser
    'queryChanceInfo.department': {
      handler() {
        this.$axios.get("http://47.98.166.180:14000/npms/user/get_user_by_dept_id", {
        params: {
          user_id: this.loginUser.id,
          role_id: this.loginUser.roleId,
          dept_id: this.queryChanceInfo.department.id
        }
      }).then(res=> {
        console.log(res);
        if(res.data.status == 200) {
          this.customer_manager = res.data.obj
          if(this.customer_manager.length == 1) {
            this.queryChanceInfo.customerManager = this.customer_manager[0]
                   this.searchChance()
          }
        }
      })},

    'queryChanceInfo.chanceType':{
      handler() {
        //通过chanceType更新product
        this.$axios.get("http://47.98.166.180:14000/npms/chance-type-product/get_product_by_chance_type_num", {
          params: {
            chance_type_num: this.queryChanceInfo.chanceType.id
          }
        }).then(res=> {
          console.log(res);
          if(res.data.status == 200) {
            //将product信息更新到product下拉框里
            //for 循环
            this.chance_product = []
            for(var i = 0; i< res.data.obj.length; i++) {
              console.log(res.data.obj[i].productNum)
              this.chance_product.push(res.data.obj[i].productNum);
            }
          }
        })
      }
    },

    'queryChanceInfo.product':{
      handler() {
        //通过product更新chanceType
        this.$axios.get("http://47.98.166.180:14000/npms/chance-type-product/get_chance_type_by_product_num", {
          params: {
            product_num: this.queryChanceInfo.product
          }
        }).then(res => {
          console.log(res)
          if(res.data.status == 200) {
            this.chance_type = []
            for(var i = 0; i< res.data.obj.length; i++) {
              this.chance_type.push({
                 id:res.data.obj[i].chanceTypeNum,
                 name:res.data.obj[i].chanceTypeValue
              })
            }
          }
        }) 
      }
    }
    }
    
  },

  data() {
    return {
      loginUser:{},
      isLoading:false,
      isEditLoading:false,
      //用于控制日期选择菜单的显示
      menu1:false,
      menu2:false,

      //用于控制不同用户看到不同按钮的权限
      isAddBtnVisible:true,
      isEditBtnVisible:true,
      isTraceBtnVisible:true,
      isExportBtnVisible:true,

      icon: "",

      //提示框
      message: "",
      snackbar: false,
      success: false,


      dialog:false,
      addChanceSource: [],
      addChanceStage: [],
      checkbox: false,
      addChanceBelong: [],
      //绑定当前机会表格中被选定的那一行数据
      selected: [],
      //修改机会时确认的edit
      // editedChanceIndex:-1,
      //从后端拿去到并且要传给子组件的chance对象
      //包含1个chanceBasic对象和3个list
      chancebasicinfo:{},
      subchances:[],
      competitions:[],
      policymakers:[],
      chancenum:"",
      chancename:"",

      //机会跟踪记录的窗口打开控制属性
      chanceTraceDialog:false,


      expanded: [],
      singleExpand: true,

      
      //父子组件传值
      isedit:false,
      issave:false,
      isprocess:false,


      //查询
      //静态department里
      department: [
        {name:"", id:"", deptNum: ""}
      ],

      //静态customer_manager里
      customer_manager: [
        {username:"", id:""}
      ],
      //静态机会归属
      chance_source: [
        {id:"1", name:"Company"},
        {id:"2", name:"Personal"},
        {id:"3", name:"Factory owner"}
      ],

      //静态机会stage
      chance_stage: [
        {id:"1", name: "Only intention, selection has not yet started"},
        {id:"2", name: "Communication and display"},
        {id:"3", name: "End of the exchange and display, waiting for bidding"},
        {id:"4", name: "Bidding"},
        {id:"5", name: "Won the bid, business, contract"},
        {id:"6", name: "Contract has been signed"}
      ],
      //静态机会status
      chance_status:[
        {id:"1", name:"Normal"},
        {id:"2", name:"Pause"},
        {id:"3", name:"Close"},
        {id:"4", name:"Draft"},
        {id:"5", name:"Processing"},
        {id:"6", name:"Create Processing"},
        {id:"7", name:"Approve Processing"},
        {id:"8", name:"Edit Processing"},
        {id:"9", name:"Need to be modified"},
        {id:"10", name:"Need to be edited"}
      ],

      //静态chance_type
      chance_type: [
        {id:"01", name:"Implementation of third-party software products"},
        {id:"02", name:"Custom development"},
        {id:"05", name:"Third-party service"},
        {id:"06", name:"Third-party software product"},
        {id:"07", name:"Third-party software product maintenance fee"},
        {id:"08", name:"Own software products"},
        {id:"09", name:"Own software products maintenance fee"},
        {id:"12", name:"Hardware products"},
        {id:"14", name:"Non-product development"},
        {id:"15", name:"Product development"}
      ],

      //静态product
      chance_product: [
        'SAP',
        'ORACLE',
        'Other',
        '3rdParty',
        'NPMS',
        'NFOL',
        'NSRM',
        'Hardware',
        'Non-product',
        'product',
      ],


      //需要传到后端用来查询机会列表的对象
      queryChanceInfo: {
        chanceNumber:"",
        chanceName:"",
        //注意这里返回的是对象
        department: {id:"", name:""},
        //注意这里也时对象
        customerManager:"",
        start_date:"",
        end_date:"",
        chanceSource:"",
        chanceStatus:"",
        chanceStage:"",
        chanceType:"",
        product:""
      },

      
      //机会的表头
      headers: [
        {
          text: "Chance Number",
          align: "start",
          sortable: false,
          value: "number"
        },
        { text: "Chance Name", value: "name" },
        { text: "Chance Source", value: "source" },
        { text: "Chance Stage", value: "stage" },
        { text: "Presign Date", value: "date" },
        { text: "Department", value: "dept" },
        { text: "Customer Manager", value: "manager" },
        { text: "State", value: "state"},
        { text: "", value: "data-table-expand" }
      ],

      //初始显示在主页上的机会表单上的数据
      chances: [
      ],
    };
  },

  methods: {

    //获取登陆的用户信息
     init() {
       this.$axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${localStorage.getItem("token")}`;
       this.loginUser = JSON.parse(localStorage.getItem("user"));
       console.log(this.loginUser)

    },

    //根据用户信息判断四个按钮的可见性
    checkBtnVisible() {
      //如果当前登陆的客户是1.客户经理 可以看到新增按钮
      if(this.loginUser.roleId == 1 ) {
        this.isAddBtnVisible = true
      }else {
        this.isAddBtnVisible = false
      }
      //如果当前登陆的客户是1.客户经理 5.营销专员可以看到修改按钮
      if(this.loginUser.roleId == 1 || this.loginUser.roleId == 3 || this.loginUser.roleId == 5) {
        this.isEditBtnVisible = true
      }else {
        this.isEditBtnVisible = false
      }

      //如果当前登陆的客户是1.客户经理 2. 营销副总 3.销售总监可以看到机会跟踪按钮
      if(this.loginUser.roleId == 1 || this.loginUser.roleId == 2|| this.loginUser.roleId == 3) {
        this.isTraceBtnVisible = true
      }else {
        this.isTraceBtnVisible = false
      }

      //如果是2.营销副总 5.营销专员 可以看到导出按钮
      if(this.loginUser.roleId == 2 || this.loginUser.roleId == 5 ) {
        this.isExportBtnVisible = true
      }else {
        this.isExportBtnVisible = false
      }
    },
    //更改state的颜色
    getColor (state) {
        if (state == "Normal") return 'green'
        else if (state == "Close") return 'red'
        else if (state == "Draft") return 'orange'
        else return 'blue'
      },
    //打开新增机会的对话框
    openAddChanceDialog(){
      this.isedit = false;
      this.issave = true;
      console.log("这时在父组件，isEdit应该等于false")
      console.log(this.isedit)
      this.chancebasicinfo = {}
      this.subchances= []
      this.competitions =[]
      this.policymakers = []
      this.chancenum = ""
      this.dialog = true;
    },
    //打开修改机会的对话框
    openEditChanceDialog() {
      this.isEditLoading = true
      if(this.selected.length != 1) {
        console.log("请重新选择机会")
        this.message = "Please Select One Row to Edit"
        this.snackbar = true
        this.isEditLoading = false
      }else {
        //如果不是机会所属人或者营销专员，则不能进行修改
        if(this.selected[0].id == this.loginUser.id || this.loginUser.roleId == 5) {
          this.isedit = true
        console.log("这时在父组件，isEdit应该等于true")
        console.log(this.isedit)
        this.chancenum = this.selected[0].number
       
        //打开新增对话框
        //TODO根据选中的ChanceNumber从后端拿到那4个数据并传到子组件
         this.$axios.get("http://47.98.166.180:14000/npms/chance/get_chance_basic_info_in_draft_and_real_by_chance_num", {
           params: {
             chanceNum: this.selected[0].number
           }
         }).then(res=> {
           console.log(res)
           this.chancebasicinfo = res.data.obj
           if(this.chancebasicinfo.chanceStatusId == 4) {
              this.issave = true
           } else{
              this.issave = false
           }

           if(this.chancebasicinfo.chanceStatusId == 1 || this.chancebasicinfo.chanceStatusId == 4 || this.chancebasicinfo.chanceStatusId == 9 || this.chancebasicinfo.chanceStatusId == 10) {
             this.isprocess = false
           }else {
             this.isprocess = true
           }

        console.log("这时在父组件，需要根据情况判断issave是否是true")
        console.log(this.issave)
           //根据选中的chancenumber从后端拿到子机会
           this.$axios.get("http://47.98.166.180:14000/npms/sub-chance/get_sub_chance_in_draft_and_real_by_chance_num", {
             params: {
             chanceNum: this.selected[0].number
            }
           }).then(res=> {
             console.log(res)
             this.subchances = res.data.obj

             //根据选中的chancenumber从后端拿到竞争列表
             this.$axios.get("http://47.98.166.180:14000/npms/competition/get_competition_by_chance_num", {
               params: {
                 chance_num: this.selected[0].number
               }
             }).then(res=> {
               console.log(res)
               this.competitions = res.data.obj

               //根据选中的chanceNumber从后端拿到决策人列表
               this.$axios.get("http://47.98.166.180:14000/npms/policymaker/get_policymaker_by_chance_num", {
                 params: {
                   chance_num: this.selected[0].number
                 }
               }).then(res=> {
                 console.log(res)
                 this.policymakers = res.data.obj

                 console.log("this is the whole chance to be passed to the son vue")
                 console.log(this.chancebasicinfo)
                 console.log(this.subchances)
                 console.log(this.competitions)
                 console.log(this.policymakers)
                 this.isEditLoading = false
                 this.dialog = true
               })
             })
           })

         })
        }else {
          console.log("没有那种权限")
        this.message = "Have No Authority To Edit"
        this.snackbar = true
        this.isEditLoading = false
        }
        
         
      }
    },

    //打开机会跟踪记录窗口
    openChanceTraceDialog() {
      if(this.selected.length != 1) {
        console.log("请重新选择机会")
        this.message = "Please Select One Row to Edit"
        this.snackbar = true
      }else {
        this.chanceTraceDialog = true
        this.chancenum = this.selected[0].number
        this.chancename = this.selected[0].name
      }
      
    },

    //父子组件传旨,同时关闭新增或者修改机会的界面
    refreshChance(chanceInfo) {
      var chance = chanceInfo;
      this.dialog = false;
      this.selected = [];
    },

    //父子组件传值，同时关闭查看机会跟踪记录的界面
    refreshChanceTrace(chancenum) {
      this.chanceTraceDialog = false
      this.selected = []
    },

    //清空查询的栏
    reset() {
      this.queryChanceInfo ={}

    },

    //从后端拿取的静态部门
    queryDepartment: function() {
      this.$axios.get("http://47.98.166.180:14000/npms/chance/get_departments", {
        params: {
          user_id: this.loginUser.id,
          role_id: this.loginUser.roleId
        }
      }).then(res=> {
        if(res.data.status == 200) {

          //把拿到的department同步到下拉框里
          this.department = res.data.obj
          if(this.department.length == 1) {
            this.queryChanceInfo.department = this.department[0]
          }
        }
      })
    },

    //从后端拿取的静态客户经理
    queryCustomerManager: function() {
      console.log(this.loginUser.id)
        console.log(this.loginUser.roleId)
        console.log(this.queryChanceInfo.department.id)
      if(this.queryChanceInfo.department.id != "") {
        
        this.$axios.get("http://47.98.166.180:14000/npms/user/get_user_by_dept_id", {
        params: {
          user_id: this.loginUser.id,
          role_id: this.loginUser.roleId,
          dept_id: this.queryChanceInfo.department.id
        }
      }).then(res=> {
        console.log(res);
        if(res.data.status == 200) {
          console.log(res.data.obj)
          //把拿到的客户经理同步到下拉框里
          this.customer_manager = res.data.obj
          if(this.customer_manager.length == 1) {
            this.queryChanceInfo.customerManager = this.customer_manager[0]
          }
        }
      })
      }   
    },

    //把主页上的query信息传给后端，得到查询到的所有chance
    searchChance() {
      console.log("我传到后端的请求对象")
        console.log({
        loginUserId:this.loginUser.id,
        chanceNum: this.queryChanceInfo.chanceNumber,
        name: this.queryChanceInfo.chanceName,
        userId: this.queryChanceInfo.customerManager.id,
        presignDateBegin: this.queryChanceInfo.start_date,
        presignDateEnd: this.queryChanceInfo.end_date,
        chanceStageId: this.queryChanceInfo.chanceStage.id,
        chanceTypeNum: this.queryChanceInfo.chanceType.id,
        productNum: this.queryChanceInfo.product,
        chanceStatusId:this.queryChanceInfo.chanceStatus.id})
      this.isLoading = true
      var newdemoQuery = {
        loginUserId:this.loginUser.id,
        chanceNum: this.queryChanceInfo.chanceNumber,
        name: this.queryChanceInfo.chanceName,
        userId: this.queryChanceInfo.customerManager.id,
        presignDateBegin: this.queryChanceInfo.start_date,
        presignDateEnd: this.queryChanceInfo.end_date,
        chanceStageId: this.queryChanceInfo.chanceStage.id,
        chanceTypeNum: this.queryChanceInfo.chanceType.id,
        productNum: this.queryChanceInfo.product,
        chanceStatusId:this.queryChanceInfo.chanceStatus.id}
      this.$axios.post("http://47.98.166.180:14000/npms/chance/query_chance_basic_info", newdemoQuery).then(res=> {
        console.log("从后端拿到的机会查询结果")
        console.log(res);
        
        if(res.data.status == 200) {
          //TODO把拿到的数据放到下面的机会展示table里
          this.chances = []
          for(var i = 0; i< res.data.obj.length; i++) {
            this.chances.push({
              id:res.data.obj[i].userId,
              number:res.data.obj[i].chanceNum,
              name:res.data.obj[i].name,
              source:res.data.obj[i].chanceSourceName,
              stage:res.data.obj[i].chanceStageName,
              date:res.data.obj[i].presignDate,
              dept:res.data.obj[i].deptName,
              manager:res.data.obj[i].userName,
              state:res.data.obj[i].chanceStatusName
            })
          }
          this.isLoading = false
        }
      }) 
    }
  }
};
</script>

<style scoped></style>
