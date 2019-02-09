<template>
  <div class="article-list">
    <v-layout row wrap justify-end>
      <v-btn @click="() => $router.push('/front/article/add')">
        <v-icon>mdi-plus</v-icon>
        新增文章
      </v-btn>
    </v-layout>
  </div>
</template>
<script>
export default {
  name: 'articleList',
};
</script>
