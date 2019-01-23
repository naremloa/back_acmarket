<template>
  <v-app :dark="layoutDark">
    <vertical-sidebar v-model="drawer"/>
    <tool-bar
      v-model="drawer"
      :height="toolBarHeight"
      @changeLayoutToDark="changeLayoutToDark" />
    <!-- <v-content class="accent" :style="{position: 'absolute'}"> -->
    <v-content class="accent">
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>
<script>
import verticalSidebar from './components/verticalSidebar.vue';
import toolBar from './components/toolBar.vue';

export default {
  name: 'index',
  components: {
    verticalSidebar,
    toolBar,
  },
  props: {
    source: String,
  },
  data() {
    return {
      drawer: true,
      layoutDark: false,
      toolBarHeight: 50,
    };
  },
  mounted() {},
  computed: {
    containerPaddingTop() {
      return { paddingTop: `${this.toolBarHeight}px` };
    },
  },
  methods: {
    changeLayoutToDark(toDark) {
      this.layoutDark = toDark;
    //  :style="containerPaddingTop"
    },
  },
};
</script>
