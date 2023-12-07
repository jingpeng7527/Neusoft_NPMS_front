<template>
  <v-list expand nav v-bind="$attrs" v-on="$listeners">
    <template v-for="(item, i) in items">
      <div :key="`item-${i}`">
        <default-list-group
          v-if="item.items&&item.auth.includes(roleId)"
          :key="`group-${i}`"
          :item="item"
        />

        <default-list-item v-if="!item.items&&item.auth.includes(roleId)" :key="`item-${i}`" :item="item" />
      </div>
    </template>
  </v-list>
</template>

<script>
export default {
  name: "DefaultList",
  data() {
    return {
      roleId: JSON.parse(localStorage.getItem("user")).roleId,
    };
  },
  mounted() {
    this.roleId = JSON.parse(localStorage.getItem("user")).roleId;
    console.log(`role id ${this.roleId} in list`);
    console.log(this.items)
    console.log(this.items[0].auth.includes(5))
  },

  components: {
    DefaultListGroup: () => import("./ListGroup"),
    DefaultListItem: () => import("./ListItem"),
  },

  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
};
</script>
