<template>
  <v-dialog v-model="localOpenDialog" width="500">
    <v-card>
      <v-card-title
        class="headline grey lighten-2"
        primary-title
      >{{localTitle}}</v-card-title>
      <v-card-text>{{localContent}}</v-card-text>
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
export default {
  props: ['openDialog', 'title', 'content', 'confirmMethod'],
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
      console.log('​title -> val', val);
      this.localTitle = val;
    },
    content(val) {
      console.log('​content -> val', val);
      this.localContent = val;
    },
    confirmMethod(val) {
      console.log('​confirmMethod -> val', val);
      this.localConfirmMethod = val;
    },
  },
  methods: {
    methodConfirm() {
      console.log('​methodConfirm -> this.localConfirmMethod', this.localConfirmMethod);
      if (this.localConfirmMethod) this.localConfirmMethod();
      this.localOpenDialog = false;
    },
  },
};
</script>
