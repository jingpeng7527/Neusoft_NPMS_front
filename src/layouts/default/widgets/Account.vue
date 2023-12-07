<template>
  <v-menu
    bottom
    left
    min-width="200"
    offset-y
    origin="top right"
    transition="scale-transition"
  >
    <template v-slot:activator="{ attrs, on }">
      <v-btn
        class="ml-2"
        min-width="0"
        text
        v-bind="attrs"
        v-on="on"
      >
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </template>

    <v-list
      :tile="false"
      flat
      nav
    >
      <template v-for="(p, i) in profile">
        <v-divider
          v-if="p.divider"
          :key="`divider-${i}`"
          class="mb-2 mt-2"
        />

        <app-bar-item
          v-else
          :key="`item-${i}`"
          
        >
          <v-list-item-title @click="pathTo(p)" v-text="p.title" />
        </app-bar-item>
      </template>
    </v-list>
  </v-menu>
</template>

<script>
  export default {
    name: 'DefaultAccount',

    data: () => ({
      profile: [
        { title: 'Profile' ,path:'/'},
        { title: 'Settings' ,path:'/' },
        { divider: true },
        { title: 'Log out', path:'/login' },
      ],
    }),

    methods: {
      pathTo(p){
        console.log("in path to")
        console.log(p)
        if(p.path=="/login"){
            localStorage.removeItem("isLogin");
             this.$router.push(p.path).catch(() =>{})
        }
       
      }
    }
  }
</script>
