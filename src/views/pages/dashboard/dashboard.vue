<template>
  <div id="dashboard">
    <v-layout id="scroll-layout" v-scroll:#kk="onScroll">
    {{this.$vuetify.breakpoint}}
    </v-layout>
  </div>
</template>
<script>
export default {
  name: 'dashboard',
  data() {
    return {

    };
  },
  mounted() {
    // console.log('this.$vuetify.breakpoint', this.$vuetify.breakpoint);
  },
  methods: {
    onScroll(e) {
      // console.log('onScroll -> e', e);
      // console.log('this.$vuetify.breakpoint', this.$vuetify.breakpoint);
    },
  },
};
</script>
