<template>
  <v-dialog v-model="localOpenDialog" width="500">
    <v-card>
      <v-card-title
        class="headline grey lighten-2"
        primary-title
      >{{localTitle}}</v-card-title>
      <v-card-text>
      <div
        id="mount-component"
      ></div>
      <component :is="componentLoader" @closeDialog="methodCloseDialog" />
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          @click="localOpenDialog = false"
        >取消</v-btn>
        <v-btn
          color="primary"
          @click="methodConfirm"
        >確定</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from 'vue';

export default {
  props: ['openDialog', 'title', 'contentFilePath', 'confirmMethod'],
  data() {
    return {
      localTitle: '系統提醒',
      localContent: '您確定要執行此步驟嗎？',
      localConfirmMethod: null,
      localOpenDialog: false,
    };
  },
  watch: {
    openDialog(val) {
      this.localOpenDialog = val;
    },
    localOpenDialog(val, oldVal) {
      if (val !== oldVal) {
        this.$emit('valueChange', val);
      }
    },
    title(val) {
      this.localTitle = val;
    },
    // contentFilePath(val) {
    //   this.importComponent(val).then((importItem) => {
    //     // new ImportComponent({
    //     //   propsData: {
    //     //     aa: this.localTitle,
    //     //   },
    //     //   on: {
    //     //     closeDialog: this.methodCloseDialog(),
    //     //   },
    //     // }).$mount('#mount-component');
    //   });
    // },
    confirmMethod(val) {
      this.localConfirmMethod = val;
    },
  },
  computed: {
    componentLoader() {
			console.log('TCL: componentLoader -> this.contentFilePath', this.contentFilePath);
      return () => import(`@/views/${this.contentFilePath}`);
    },
  },
  methods: {
    methodConfirm() {
      if (this.localConfirmMethod) this.localConfirmMethod();
      this.localOpenDialog = false;
    },
    methodCloseDialog() {
      console.log('TCL: methodCloseDialog -> methodCloseDialog');
      this.localOpenDialog = false;
    },
  },
};
</script>
