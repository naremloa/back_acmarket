<template>
  <div class="article-add">
    <div>新增文章</div>
    <editor />
  </div>
</template>
<script>
import editor from '@/components/editor.vue';
import 'quill/dist/quill.snow.css';

export default {
  name: 'articleAdd',
  components: {
    editor,
  },
};
</script>
