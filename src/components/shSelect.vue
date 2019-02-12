<template>
  <v-flex sm12 md4 lg3 px-1>
    <v-select
      v-model="value"
      :label="setting.label"
      :items="setting.options"
      item-text="value"
      item-value="id" />
  </v-flex>
</template>
<script>
export default {
  name: 'sh-select',
  props: {
    propValue: {
      required: true,
    },
    setting: {
      type: Object,
      default: () => ({}),
    },
  },
  model: {
    prop: 'propValue',
    event: 'valueChange',
  },
  data() {
    return {
      value: '',
    };
  },
  watch: {
    value(val) { if (val !== this.propValue) this.$emit('valueChange', val); },
    propValue(val) { if (val !== this.value) this.value = this.propValue; },
  },
};
</script>
