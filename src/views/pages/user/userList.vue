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
          <td
            class="text-xs-center"
            :class="formatStatus(props.item.status).class"
          >{{ formatStatus(props.item.status).statusText }}</td>
          <td class="text-xs-center">
            <div v-if="props.item.status === 0">
              <v-btn color="error" @click="methodVerifyStatus(props.item, false)">不通過</v-btn>
              <v-btn color="success" @click="methodVerifyStatus(props.item, true)">通過</v-btn>
            </div>
          </td>
          <!-- <td class="text-xs-center">{{ props.item.softDelete }}</td> -->
          <td class="text-xs-center">{{ props.item.modifyUser }}</td>
          <td class="text-xs-center">{{ dateTime(props.item.modifyTime) }}</td>
          <td class="text-xs-center">{{ dateTime(props.item.registerTime) }}</td>
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
    <confirmDialog
      :openDialog="confirmDialogInfo.openDialog"
      @valueChange="methodChangeOpenDialog"
      :title="confirmDialogInfo.title"
      :content="confirmDialogInfo.content"
      :confirmMethod="confirmDialogInfo.confirmMethod"
    />
  </div>
</template>
<script>
import httpMethod from '@/utils/httpMethod';
import { dateTime } from '@/utils/calculation';
import confirmDialog from '@/views/layout/components/confirmDialog.vue';

export default {
  components: {
    confirmDialog,
  },
  data() {
    return {
      search: '',
      rowsPerPageItems: [20, 30, 50, 80, 100],
      pagination: {
        rowsPerPage: 20,
      },
      headers: [
        { text: '帳號', value: 'account', sortable: false },
        { text: '帳號名稱', value: 'accountAlias', sortable: false },
        // { text: '角色', value: 'role', sortable: false },
        // { text: '權限', value: 'level', sortable: false },
        { text: '帳號狀態', value: 'status', sortable: false },
        { text: '操作', value: '', sortable: false },
        // { text: '已刪除', value: 'softDelete', sortable: false },
        { text: '修改人', value: 'modifyUser', sortable: false },
        { text: '修改時間', value: 'modifyTime', sortable: false },
        { text: '註冊時間', value: 'registerTime', sortable: false },
        { text: '最後登入時間', value: 'lastLoginTime', sortable: false },
      ],
      userList: [],
      confirmDialogInfo: {
        openDialog: false,
        title: '',
        content: '',
        confirmMethod: null,
      },
    };
  },
  mounted() {
    this.getUserList();
    setTimeout(async () => {
      const res = await httpMethod({
        url: '/v1/api/user/role/list',
        method: 'GET',
      });
      console.log('TCL: mounted -> res', res);
    });
  },
  methods: {
    dateTime,
    formatStatus(val) {
      const statusList = [
        { val: 0, statusText: '無審核通過', class: 'warning--text' },
        { val: 1, statusText: '正常啟用', class: 'success--text' },
        { val: 2, statusText: '停用', class: 'error--text' },
        { val: 3, statusText: '刪除', class: '' },
      ];
      const res = statusList.filter(item => item.val === val);
      if (res.length) {
        return res[0];
      }
      return { val: null, statusText: '錯誤！無此狀態', class: 'purple--text' };
    },
    async getUserList() {
      const res = await httpMethod({
        url: '/v1/api/user/list',
        method: 'GET',
      });
      if (!res.code) {
        this.userList = res.data;
      } else {
        this.userList = [];
      }
    },
    async postUserList(params) {
      const res = await httpMethod({
        url: '/v1/api/user/review',
        method: 'POST',
        data: params,
      });
      if (!res.code) {
        if (res.data) {
          const alert = {
            open: true,
            text: '審核操作成功',
            color: 'success',
          };
          this.$store.commit('global/setNotifySetting', alert);
        }
      } else {
        const alert = {
          open: true,
          text: res.msg || '審核操作失敗',
          color: 'error',
        };
        this.$store.commit('global/setNotifySetting', alert);
      }
      this.getUserList();
    },
    methodChangeOpenDialog(val) {
      this.confirmDialogInfo.openDialog = val;
    },
    methodVerifyStatus(rowData, pass) {
      const { account, accountId } = rowData;
      const params = {
        status: pass ? 1 : 3,
        id: accountId,
        role: pass ? 1000 : null,
      };
      this.confirmDialogInfo = {
        ...this.confirmDialogInfo,
        openDialog: true,
        title: '帳號審核',
        content: `您確定要審核${account}為 ${pass ? '通過' : '不通過'}`,
        confirmMethod: () => this.postUserList(params),
      };
    },
  },
};
</script>
