<template>
  <div class="user-list">
    <v-form v-model="valid" class="mb-2">
      <v-layout row wrap>
        <v-flex sm12 md4 lg3 px-1 >
          <v-text-field
            v-model="searchParams.accountShow"
            label="帳號"
            clearable
          ></v-text-field>
        </v-flex>
        <v-flex sm12 md4 lg3 px-1 >
          <v-text-field
            v-model="searchParams.accountAliasShow"
            label="帳號名稱"
            clearable
          ></v-text-field>
        </v-flex>
        <v-flex sm12 md4 lg3 px-1 >
          <v-text-field
            v-model="searchParams.modifyUserShow"
            label="修改人"
            clearable
          ></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex
          sm12
          md3
          lg3
          px-1
          v-for="(item, idx) in searchTimeParams"
          :key="`searchTimeParams${idx}`"
        >
          <v-menu
            :ref="`menu${idx}`"
            :close-on-content-click="false"
            v-model="selectMenu[idx]"
            :nudge-right="40"
            :value="searchParams[item.key]"
            lazy
            transition="scale-transition"
            offset-y
            full-width
          >
            <v-text-field
              slot="activator"
              v-model="searchParams[item.key]"
              :label="item.label"
              clearable
              prepend-icon="mdi-calendar"
              readonly
            ></v-text-field>
            <v-date-picker
              v-model="searchParams[item.key]"
              scrollable
              no-title
              locale="zh-Hant"
              show-current
              class="d-flex"
            >
              <v-spacer></v-spacer>
              <v-btn
                flat
                color="primary"
                @click="$set(selectMenu,idx,false)"
              >Cancel</v-btn>
              <v-btn
                flat
                color="primary"
                @click="$refs[`menu${idx}`][0].save(searchParams[item.key])"
              >OK</v-btn>
            </v-date-picker>
          </v-menu>
        </v-flex>
        <v-flex text-xs-right>
          <v-btn flat @click="methodFormReset">重置</v-btn>
          <v-btn color="primary" @click="methodProcessParams">
            <v-icon>mdi-magnify</v-icon>搜尋
          </v-btn>
        </v-flex>
      </v-layout>
    </v-form>
    <v-card>
      <v-card-title>
        使用者列表
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
          <td class="text-xs-center">{{formatRole(props.item.role && props.item.role.id)}}</td>
          <td class="text-xs-center">
            <v-btn color="primary" @click="methodUpdateUserRole(props.item)">修改</v-btn>
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
      @valueChange="methodChangeOpenConfirmDialog"
      :title="confirmDialogInfo.title"
      :content="confirmDialogInfo.content"
      :confirmMethod="confirmDialogInfo.confirmMethod"
    />
    <dialogComponent
      :openDialog="dialogInfo.openDialog"
      @valueChange="methodChangeOpenDialog"
      :title="dialogInfo.title"
      :contentFilePath="dialogInfo.contentFilePath"
      :contentData="dialogInfo.contentData"
      :confirmMethod="dialogInfo.confirmMethod"
      :otherMethod="dialogInfo.otherMethod"
      :width="dialogInfo.width"
    />
  </div>
</template>
<script>
import httpMethod from '@/utils/httpMethod';
import { dateTime } from '@/utils/calculation';
import confirmDialog from '@/views/layout/components/confirmDialog.vue';
import dialogComponent from '@/views/layout/components/dialog.vue';

export default {
  name: 'userList',
  components: {
    confirmDialog,
    dialogComponent,
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
        // { text: '權限', value: 'level', sortable: false },
        { text: '帳號狀態', value: 'status', sortable: false },
        { text: '操作', value: '', sortable: false },
        { text: '角色', value: 'role', sortable: false },
        { text: '修改角色', value: '', sortable: false },
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
      valid: false,
      searchParams: this.getParamsOrigin(),
      searchTimeParams: [
        { label: '註冊開始時間', key: 'registerTimeStartShow' },
        { label: '註冊結束時間', key: 'registerTimeEndShow' },
        { label: '修改開始時間', key: 'modifyTimeStartShow' },
        { label: '修改結束時間', key: 'modifyTimeEndShow' },
        { label: '最後登入開始時間', key: 'lastLoginTimeStartShow' },
        { label: '最後登入結束時間', key: 'lastLoginTimeEndShow' },
      ],
      selectMenu: [false, false, false, false, false, false],
      dialogInfo: {
        openDialog: false,
        title: '',
        contentFilePath: 'pages/user/updateUserRole.vue',
        contentData: null,
        confirmMethod: null,
        otherMethod: null,
      },
      roleList: [],
    };
  },
  mounted() {
    this.getUserList();
    this.getRoleList();
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
    formatRole(val) {
      const res = this.roleList.filter(item => item.id === val);
      if (res.length) {
        return res[0].value;
      }
      return '遊客';
    },
    async getRoleList() {
      const res = await httpMethod({
        url: '/v1/api/user/role/list',
        method: 'GET',
      });
      if (!res.code) {
        this.roleList = res.data;
      } else {
        const alert = {
          open: true,
          text: res.msg || '取得帳號列表錯誤',
          color: 'error',
        };
        this.$store.commit('global/setNotifySetting', alert);
      }
    },
    getParamsOrigin() {
      return {
        accountShow: null,
        accountAliasShow: null,
        modifyUserShow: null,
        registerTimeStartShow: null,
        registerTimeEndShow: null,
        modifyTimeStartShow: null,
        modifyTimeEndShow: null,
        lastLoginTimeStartShow: null,
        lastLoginTimeEndShow: null,
      };
    },
    async getUserList(params) {
      const res = await httpMethod({
        url: '/v1/api/user/list',
        method: 'GET',
        params,
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
    methodChangeOpenConfirmDialog(val) {
      this.confirmDialogInfo.openDialog = val;
    },
    methodChangeOpenDialog(val) {
      this.dialogInfo.openDialog = val;
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
    methodFormReset() {
      this.searchParams = this.getParamsOrigin();
    },
    methodProcessParams() {
      console.log('TCL: methodProcessParams -> methodProcessParams');
      const {
        accountShow,
        accountAliasShow,
        modifyUserShow,
        registerTimeStartShow,
        registerTimeEndShow,
        modifyTimeStartShow,
        modifyTimeEndShow,
        lastLoginTimeStartShow,
        lastLoginTimeEndShow,
      } = this.searchParams;
      const params = {};
      if (accountShow) params.account = accountShow;
      if (accountAliasShow) params.accountAlias = accountAliasShow;
      if (modifyUserShow) params.modifyUser = modifyUserShow;
      if (registerTimeStartShow) params.registerTime = new Date(registerTimeStartShow).valueOf();
      if (registerTimeEndShow) params.registerTime = new Date(registerTimeEndShow).valueOf();
      if (modifyTimeStartShow) params.modifyTime = new Date(modifyTimeStartShow).valueOf();
      if (modifyTimeEndShow) params.modifyTime = new Date(modifyTimeEndShow).valueOf();
      if (lastLoginTimeStartShow) params.lastLoginTime = new Date(lastLoginTimeStartShow).valueOf();
      if (lastLoginTimeEndShow) params.lastLoginTime = new Date(lastLoginTimeEndShow).valueOf();
      this.getUserList(params);
    },
    async methodUpdateUserRole(rowData) {
      console.log('TCL: methodUpdateUserRole -> rowData', rowData);
      this.dialogInfo = {
        ...this.dialogInfo,
        openDialog: true,
        title: '變更使用者角色',
        contentFilePath: 'pages/user/updateUserRole.vue',
        otherMethod: this.getUserList,
        contentData: rowData,
        width: 500,
      };
    },
  },
};
</script>
