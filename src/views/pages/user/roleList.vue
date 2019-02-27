<template>
  <div class="role-list">
    <v-layout row wrap justify-end>
        <v-btn slot="activator" @click="methodAddRole">
          <v-icon>mdi-plus</v-icon>新增角色
        </v-btn>
    </v-layout>
    <v-card>
      <v-card-title>
        使用者角色列表
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="搜尋結果篩選"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="roleList"
        :search="search"
        prev-icon="mdi-menu-left"
        next-icon="mdi-menu-right"
        sort-icon="mdi-menu-down"
        rows-per-page-text="每頁顯示筆數"
        :rows-per-page-items="rowsPerPageItems"
        :pagination.sync="pagination"
      >
        <template slot="items" slot-scope="props">
          <td class="text-xs-center">{{ props.item.id }}</td>
          <td class="text-xs-center">{{ props.item.value }}</td>
          <td class="text-xs-center">
            <v-btn small @click="methodUpdateRole(props.item)">
              <v-icon>mdi-square-edit-outline</v-icon>修改角色權限
            </v-btn>
          </td>
        </template>
        <v-alert slot="no-results" :value="true" color="warning" icon="mdi-alert">
          找不到有關於 "{{ search }}" 的資料
        </v-alert>
        <template slot="no-data">
          <v-alert :value="true" color="primary" icon="mdi-alert">
            暫無數據
          </v-alert>
        </template>
        <template slot="pageText" slot-scope="props">
          第{{ props.pageStart }}筆 - 第{{ props.pageStop }}筆，總筆數 {{ props.itemsLength }}
        </template>
      </v-data-table>
    </v-card>
    <dialogComponent
      :openDialog="confirmDialogInfo.openDialog"
      :contentData="confirmDialogInfo.contentData"
      @valueChange="methodChangeOpenDialog"
      :title="confirmDialogInfo.title"
      :contentFilePath="confirmDialogInfo.contentFilePath"
      :confirmMethod="confirmDialogInfo.confirmMethod"
      :otherMethod="confirmDialogInfo.otherMethod"
    />
  </div>
</template>
<script>
import httpMethod from '@/utils/httpMethod';
import { dateTime, currencies } from '@/utils/calculation';
import dialogComponent from '@/views/layout/components/dialog.vue';

export default {
  name: 'roleList',
  components: {
    dialogComponent,
  },
  data() {
    return {
      search: '',
      rowsPerPageItems: [20, 30, 50, 80, 100],
      pagination: {
        rowsPerPage: 20,
        // sortBy: 'id',
      },
      headers: [
        { text: '角色ID', value: 'id', sortable: false },
        { text: '角色名稱', value: 'value', sortable: false },
        { text: '操作', value: '', sortable: false },
      ],
      roleList: [],
      confirmDialogInfo: {
        openDialog: false,
        contentData: null,
        title: '',
        contentFilePath: 'pages/user/addRole.vue',
        confirmMethod: null,
      },
    };
  },
  mounted() {
    this.getRoleList();
  },
  methods: {
    dateTime,
    currencies,
    async getRoleList() {
      const res = await httpMethod({
        url: '/v1/api/user/role/list',
        method: 'GET',
      });
      if (!res.code) {
        this.roleList = res.data;
        console.log('​getRoleList -> res.data', res.data);
      } else {
        this.roleList = [];
      }
    },
    methodChangeOpenDialog(val) {
      this.confirmDialogInfo.openDialog = val;
    },
    methodAddRole() {
      this.confirmDialogInfo = {
        ...this.confirmDialogInfo,
        openDialog: true,
        title: '新增角色',
        contentFilePath: 'pages/user/addRole.vue',
        otherMethod: this.getRoleList,
      };
    },
    methodUpdateRole(rowData) {
      this.confirmDialogInfo = {
        ...this.confirmDialogInfo,
        contentData: rowData,
        openDialog: true,
        title: '修改角色',
        contentFilePath: 'pages/user/updateRole.vue',
        otherMethod: this.getRoleList,
      };
    },
  },
};
</script>
