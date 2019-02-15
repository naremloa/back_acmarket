<template>
  <div class="editor">
    <button @click="handleClick">阿達阿塞德</button>
    <!-- <div ref="toolbar" id="toolbar">
      <span class="ql-formats">
        <button class="ql-bold" />
        <button class="ql-italic" />
        <button id="custom-button">&#8486;</button>
      </span>
    </div>
    <div id="counter" ref="counter"></div> -->
    <div ref="editor" />
  </div>
</template>
<script>
import _Quill from 'quill';
import defaultEditorOptiosn from '@/utils/editorOptions';

const Quill = window.Quill || _Quill;

export default {
  name: 'editor',
  // beforeCreate() {
  //   Quill.register('modules/counter', (quill, options) => {
  //     const container = document.querySelector('#counter');
  //     quill.on('text-change', () => {
  //       const text = quill.getText();
  //       container.innerText = text.split('').length;
  //     });
  //   });
  // },
  beforeDestroy() {
    this.quill = null;
    delete this.quill;
  },
  mounted() {
    this.quill = new Quill(
      this.$refs.editor,
      {
        ...this.options,
        ...this.customOptions,
      },
    );
  },
  data() {
    return {
      options: defaultEditorOptiosn,
      customOptions: {
        // modules: {
        //   counter: true,
        //   toolbar: {
        //     container: '#toolbar',
        //   },
        // },
      },
    };
  },
  methods: {
    handleClick() {
      if (this.quill) {
        console.log(this.quill.getContents());
      }
    },
  },

};
</script>
