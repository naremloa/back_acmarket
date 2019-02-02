<template>
  <v-dialog v-model="localOpenDialog" :width="this.width || 500">
    <v-card>
      <v-card-title
        class="headline grey lighten-2"
        primary-title
      >{{localTitle}}</v-card-title>
      <v-card-text>
      <div
        id="mount-component"
      ></div>
      <component
        :is="componentLoader"
        @closeDialog="methodCloseDialog"
        @execOtherMethod="methodExecOtherMethod"
      />
      </v-card-text>
      <div v-if="localConfirmMethod">
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
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['openDialog', 'title', 'contentFilePath', 'confirmMethod', 'width', 'otherMethod'],
  data() {
    return {
      localTitle: '系統提醒',
      localContent: '您確定要執行此步驟嗎？',
      localConfirmMethod: null,
      localOpenDialog: false,
      localOtherMethod: null,
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
    otherMethod(val) {
      this.localOtherMethod = val;
    },
  },
  computed: {
    componentLoader() {
      return () => import(`@/views/${this.contentFilePath}`);
    },
  },
  methods: {
    methodConfirm() {
      if (this.localConfirmMethod) this.localConfirmMethod();
      this.localOpenDialog = false;
    },
    methodCloseDialog() {
      this.localOpenDialog = false;
    },
    methodExecOtherMethod() {
      if (this.localOtherMethod) this.localOtherMethod();
    },
  },
};
</script>
