<template>
  <div class="user-list">
    <v-card>
      <v-card-title>
        使用者列表
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="userList"
        :search="search"
        prev-icon="mdi-menu-left"
        next-icon="mdi-menu-right"
        sort-icon="mdi-menu-down"
        rows-per-page-text="每頁顯示筆數"
        :rows-per-page-items="rowsPerPageItems"
        :pagination.sync="pagination"
      >
        <template slot="items" slot-scope="props">
          <td class="text-xs-center">{{ props.item.account }}</td>
          <td class="text-xs-center">{{ props.item.accountAlias }}</td>
          <!-- <td class="text-xs-center">{{ props.item.role }}</td> -->
          <!-- <td class="text-xs-center">{{ props.item.level }}</td> -->
          <td class="text-xs-center">{{ formatStatus(props.item.status) }}</td>
          <!-- <td class="text-xs-center">{{ props.item.softDelete }}</td> -->
          <td class="text-xs-center">{{ props.item.modifyUser }}</td>
          <td class="text-xs-center">{{ dateTime(props.item.registerTime) }}</td>
          <td class="text-xs-center">{{ dateTime(props.item.modifyTime) }}</td>
          <td class="text-xs-center">{{ dateTime(props.item.lastLoginTime) }}</td>
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
  </div>
</template>
<script>
import httpMethod from '@/utils/httpMethod';
import { dateTime } from '@/utils/calculation';

export default {
  data() {
    return {
      search: '',
      rowsPerPageItems: [20, 30, 50, 80, 100],
      pagination: {
        rowsPerPage: 20,
        sortBy: 'account',
      },
      headers: [
        { text: '帳號', value: 'account', sortable: false },
        { text: '帳號名稱', value: 'accountAlias', sortable: false },
        // { text: '角色', value: 'role', sortable: false },
        // { text: '權限', value: 'level', sortable: false },
        { text: '帳號狀態', value: 'status', sortable: false },
        // { text: '已刪除', value: 'softDelete', sortable: false },
        { text: '修改人', value: 'modifyUser', sortable: false },
        { text: '註冊時間', value: 'registerTime', sortable: false },
        { text: '修改時間', value: 'modifyTime', sortable: false },
        { text: '最後登入時間', value: 'lastLoginTime', sortable: false },
      ],
      userList: [],
    };
  },
  mounted() {
    this.getUserList();
  },
  methods: {
    dateTime,
    formatStatus(val) {
      const statusList = [
        { val: 0, status: '無審核通過' },
        { val: 1, status: '正常啟用' },
        { val: 2, status: '停用' },
        { val: 3, status: '刪除' },
      ];
      const res = statusList.filter(item => item.val === val);
      if (res.length) {
        return res[0].status;
      }
      return '錯誤！無此狀態';
    },
    async getUserList() {
      const res = await httpMethod({
        url: '/v1/api/user/list',
        method: 'GET',
      });
      if (!res.code) {
        this.userList = res.data;
        console.log('​getUserList -> res.data', res.data);
      } else {
        this.userList = [];
      }
    },
  },
};
</script>
