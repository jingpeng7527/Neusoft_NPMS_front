// Pathify
import {
  make
} from 'vuex-pathify'

// Data
const state = {
  //登陆人信息
  //（int id, String companyNum,String name）
  opinionTypeCreate: [{
      id: 1,
      name: "Agree",
      num: 10
    },
    {
      id: 2,
      name: "Return",
      num: 20
    },
    {
      id: 3,
      name: "Refuse",
      num: 30
    },
  ],
  opinionTypeEdit: [{
    id: 1,
    name: "Agree",
    num: 10
  },
  {
    id: 3,
    name: "Disagree",
    num: 30
  },
],
  companyType: [{
      id: 1,
      name: "Foreign-owned",
      companyNum: 10
    },
    {
      id: 2,
      name: "Sino-foreign joint venture",
      companyNum: 20
    },
    {
      id: 3,
      name: "State-owned enterprise",
      companyNum: 30
    },
    {
      id: 4,
      name: "Private Enterprise",
      companyNum: 40
    },
    {
      id: 5,
      name: "Other",
      companyNum: 99
    },
  ],
  role: [{
      id: 1,
      value: "Client Manager",
      name: "客户经理"
    },
    {
      id: 2,
      value: "Vice Marketing President",
      name: "营销副总"
    },
    {
      id: 3,
      value: "Sales Director",
      name: "销售总监"
    },
    {
      id: 4,
      value: "General Manager of Business Department",
      name: "事业部总经理"
    },
    {
      id: 5,
      value: "Marketing Specialist",
      name: "营销专员"
    },
    {
      id: 6,
      value: "Admin",
      name: "管理人员"
    }
  ],
  //int id, String accountNum,String name
  accountGroup: [{
      id: 1,
      name: "domestic",
      accountNum: 10
    },
    {
      id: 2,
      name: "overseas",
      accountNum: 20
    },
    {
      id: 3,
      name: "subsidiaries",
      accountNum: 30
    }
  ],
  //int id, String clientRelateNum,String name
  taxType: [{
    id: 1,
    name: "tax free",
    taxTypeNum: 0
  }, {
    id: 2,
    name: "pay tax",
    taxTypeNum: 1
  }, ],
  clientRelateType: [{
    id: 1,
    name: "parent company",
    clientRelateNum: 10
  }, {
    id: 2,
    name: "Subsidiary",
    clientRelateNum: 20
  }, {
    id: 3,
    name: "Holding company",
    clientRelateNum: 30
  }, ]
}

const mutations = make.mutations(state)

const actions = {
  ...make.actions(state),
  init: async ({
    dispatch
  }) => {
    //
  },
}

const getters = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
