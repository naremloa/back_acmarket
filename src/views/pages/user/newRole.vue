<template>
  <div>
    <v-btn @click="$emit('closeDialog')">XXX</v-btn>
    {{tree}}
    <v-treeview
      v-model="tree"
      activatable
      :items="routerTree"
      active-class="grey lighten-4 indigo--text"
      selected-color="indigo"
      open-on-click
      selectable
      expand-icon="mdi-chevron-down"
      on-icon="mdi-checkbox-marked"
      off-icon="mdi-checkbox-blank-outline"
      indeterminate-icon="mdi-checkbox-intermediate"
      item-children="childNode"
    >
    </v-treeview>
  </div>
</template>
<script>
export default {
  props: ['aa'],
  data() {
    return {
      open: ['public'],
      files: {
        html: 'mdi-language-html5',
        js: 'mdi-nodejs',
        json: 'mdi-json',
        md: 'mdi-markdown',
        pdf: 'mdi-file-pdf',
        png: 'mdi-file-image',
        txt: 'mdi-file-document-outline',
        xls: 'mdi-file-excel',
      },
      breweries: [],
      isLoading: false,
      tree: [],
      types: [],
      routerTree: [
        {
          id: 1001,
          dataKey: 'user',
          name: '帳號管理',
          apiRoot: '',
          rootId: 0,
          childNode: [
            {
              id: 1010,
              dataKey: 'userList',
              name: '帳號列表',
              apiRoot: ['/user', '/router'],
              rootId: 1001,
              childNode: [],
            },
            {
              id: 1013,
              dataKey: 'roleList',
              name: '角色列表',
              apiRoot: [
                '/user',
                '/router',
              ],
              rootId: 1001,
              childNode: [],
            },
          ],
        },
        {
          id: 1002,
          dataKey: 'manager',
          name: '日常管理',
          apiRoot: '',
          rootId: 0,
          childNode: [
            {
              id: 1011,
              dataKey: 'orderList',
              name: '訂單列表',
              apiRoot: '/order',
              rootId: 1002,
              childNode: [],
            },
            {
              id: 1012,
              dataKey: 'roomList',
              name: '房間列表',
              apiRoot: '/room',
              rootId: 1002,
              childNode: [],
            },
          ],
        },
      ],
    };
  },
  mounted() {
    console.log('TCL: mounted -> un', this.aa);
  },
};
</script>
