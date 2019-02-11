<template>
  <div class="editor">
    <div ref="editor" />
  </div>
</template>
<script>
import _Quill from 'quill';

const Quill = window.Quill || _Quill;

export default {
  name: 'editor',
  beforeDestroy() {
    this.quill = null;
    delete this.quill;
  },
  data() {
    return {
      options: {
        theme: 'snow',
        placeholder: '請輸入......',
        formats: ['bold', 'header'],
      },
    };
  },
  mounted() {
    this.quill = new Quill(this.$refs.editor, this.options);
  },
};
</script>
