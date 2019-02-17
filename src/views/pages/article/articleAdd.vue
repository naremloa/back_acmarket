<template>
  <div class="article-add">
    <div>新增文章</div>
    <!-- <editor /> -->
    <vue-editor v-model="content" />
  </div>
</template>
<script>
// import editor from '@/components/editor.vue';
import { VueEditor } from 'vue2-editor';
import 'quill/dist/quill.snow.css';

export default {
  name: 'articleAdd',
  components: {
    // editor,
    VueEditor,
  },
  data() {
    return {
      content: '<h1>Some initial content</h1>',
    };
  },
};
</script>
