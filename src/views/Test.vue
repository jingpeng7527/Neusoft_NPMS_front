<template>
  <v-app>
    <v-autocomplete
      v-model="model"
      :items="items"
      :loading="isLoading"
      :search-input.sync="search"
      chips
      clearable
      hide-details
      hide-selected
      item-text="clientName"
      item-value="id"
      label="Search for a coin..."
      solo
    >
      <template v-slot:no-data>
        <v-list-item>
          <v-list-item-title>
            Search for your favorite
            <strong>Cryptocurrency</strong>
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
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      isLoading: false,
      items: [],
      model: null,
      search: null,
      tab: null,
    };
  },
  watch: {
    search(val) {
      // Items have already been loaded
      if (this.items.length > 0) return;

      this.isLoading = true;

      // Lazily load input items
      this.$axios
        .get("http://8.140.46.173:16000/client/query_client", {
          params: {
            name: "e",
          },
        })
        .then((res) => {
          console.log(res);
          this.isLoading = false;
          this.items = res.data.obj;
        });
    },
  },
};
</script>