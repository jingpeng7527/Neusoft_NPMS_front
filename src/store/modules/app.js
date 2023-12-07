// Pathify
import {
  make
} from 'vuex-pathify'

// Data
const state = {
  drawer: null,
  drawerImage: true,
  mini: false,
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
  ],
  items: [{
      title: 'DashBoard',
      icon: 'mdi-view-dashboard',
      auth: [1, 2, 3, 4, 5],
      to: '/',
    },

    {
      title: "Management",
      icon: 'mdi-menu',
      auth: [1, 2, 3, 4, 5],
      items: [{
          title: 'Client Management',
          icon: 'mdi-account-details',
          auth: [1, 2, 3, 4, 5],
          to: '/components/clientManagement',
        },
        {
          title: 'Client Transfer',
          auth: [5],
          icon: 'mdi-account-arrow-right',
          to: '/client/transfer/',
        },
        {
          title: 'Chance Maintain',
          auth: [1, 2, 3, 4, 5],
          icon: 'mdi-star-plus',
          to: '/tables/chanceMaintain/',
        },
        {
          auth: [1, 2, 3],
          title: 'Sales Log',
          icon: 'mdi-file-clock',
          to: '/components/salesLog/',
        },
        {
          auth: [2, 3, 5],
          title: 'Report Management',
          icon: 'mdi-cloud-search',
          to: '/components/reportManagement/',
        },
      ]
    },

    {
      title: "Approval",
      icon: 'mdi-chevron-triple-right',
      auth: [2, 3, 4],
      items: [{
        auth: [2, 3, 4],
        title: 'Chance Approval',
        icon: 'mdi-account',
        to: '/aprroval/chance',
      }, ]
    },
    {

      title: 'Notifications',
      auth: [1, 2, 3, 4, 5],
      icon: 'mdi-bell',
      to: '/components/notifications/',

    },

  ],
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
