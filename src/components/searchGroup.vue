<template>
  <div class="search-group">
    <v-form v-model="valid" class="px-2">
      <v-layout row wrap>
      </v-layout>
    </v-form>
  </div>
</template>
<script>
export default {
  name: 'searchGroup',
  data() {
    return {
      valid: false,
    };
  },
};
</script>
