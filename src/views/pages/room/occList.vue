<template>
  <div class="occ-list">
    <!-- <v-layout row wrap justify-end>
      <v-btn @click="methodAddCash">
        <v-icon>mdi-plus</v-icon>
        新增收支
      </v-btn>
    </v-layout> -->
    <v-expansion-panel class="mb-2">
      <v-expansion-panel-content class="accent">
        <div slot="header" class="subheading">搜尋選項</div>
        <v-form v-model="valid" class="px-2">
          <v-layout row wrap>
            <v-flex
              sm12
              md4
              lg3
              px-1
              v-for="(item, idx) in searchItemParams"
              :key="`searchItemParams${idx}`"
            >
              <v-text-field
                v-model="searchParams[item.key]"
                :label="item.label"
                clearable
              ></v-text-field>
            </v-flex>
            <!-- <v-flex sm12 md4 lg3 px-1 >
              <v-select
                v-model="searchParams.roomType"
                :items="constList.roomTypeList"
                item-text="value"
                item-value="id"
                label="訂房房型"
              ></v-select>
            </v-flex> -->
            <v-flex sm12 md4 lg3 px-1 >
              <v-select
                v-model="searchParams.status"
                :items="constList.orderStatusList"
                item-text="value"
                item-value="id"
                label="訂單狀態"
              ></v-select>
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
      </v-expansion-panel-content>
    </v-expansion-panel>
    <v-card>
      <v-card-title>
        收支列表
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
        :items="occList"
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
          <!-- <td class="text-xs-center">{{ props.item.certificateNumber }}</td>
          <td class="text-xs-center">{{ props.item.content }}</td>
          <td class="text-xs-center">{{ currencies(props.item.income) }}</td>
          <td class="text-xs-center">{{ currencies(props.item.outcome) }}</td>
          <td class="text-xs-center">{{ currencies(props.item.balance) }}</td> -->
          <!-- <td class="text-xs-center">{{ formatCashType(props.item.type) }}</td> -->
          <!-- <td class="text-xs-center">{{ dateTime(props.item.createTime) }}</td> -->
          <!-- <td class="text-xs-center">{{ props.item.createAccount }}</td> -->
          <td class="text-xs-center">
            <v-btn small @click="methodUpdateOcc(props.item)">
              <v-icon>mdi-square-edit-outline</v-icon>分配房間
            </v-btn>
          </td>
          <!-- <td class="text-xs-center">{{ dateTime(props.item.modifyTime) }}</td> -->
          <!-- <td class="text-xs-center">{{ props.item.modifyAccount }}</td> -->
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
      @valueChange="methodChangeOpenDialog"
      :title="confirmDialogInfo.title"
      :contentFilePath="confirmDialogInfo.contentFilePath"
      :contentData="confirmDialogInfo.contentData"
      :confirmMethod="confirmDialogInfo.confirmMethod"
      :otherMethod="confirmDialogInfo.otherMethod"
      :width="confirmDialogInfo.width"
    />
  </div>
</template>
<script>
import httpMethod from '@/utils/httpMethod';
import constList from '@/utils/const';
import dialogComponent from '@/views/layout/components/dialog.vue';
import { dateTime, currencies } from '@/utils/calculation';

export default {
  name: 'occList',
  components: {
    dialogComponent,
  },
  data() {
    return {
      constList,
      search: '',
      rowsPerPageItems: [20, 30, 50, 80, 100],
      pagination: {
        rowsPerPage: 20,
      },
      headers: [
        { text: '訂單號', value: 'cashId', sortable: false },
        { text: '憑證號', value: 'certificateNumber', sortable: false },
        { text: '摘要', value: 'content', sortable: false },
        { text: '收入金額', value: 'income', sortable: false },
        { text: '支出金額', value: 'outcome', sortable: false },
        { text: '餘額', value: 'balance', sortable: false },
        { text: '帳單類型', value: 'type', sortable: false },
        { text: '創建日期', value: 'createTime', sortable: false },
        { text: '創建用戶', value: 'createAccount', sortable: false },
        { text: '修改操作', value: '', sortable: false },
        { text: '修改日期', value: 'modifyTime', sortable: false },
        { text: '修改帳號', value: 'modifyAccount', sortable: false },
      ],
      occList: [],
      valid: false,
      searchParams: this.getParamsOrigin(),
      searchItemParams: [
        { label: '訂單號', key: 'cashIdShow' },
        // { label: '憑證號', key: 'certificateNumberShow' },
        // { label: '摘要', key: 'contentShow' },
        // { label: '創建用戶', key: 'createAccountShow' },
        // { label: '修改帳號', key: 'modifyAccountShow' },
      ],
      searchTimeParams: [
        { label: '創建開始時間', key: 'createTimeStartShow' },
        { label: '創建結束時間', key: 'createTimeEndShow' },
        // { label: '修改開始時間', key: 'modifyTimeStartShow' },
        // { label: '修改結束時間', key: 'modifyTimeEndShow' },
      ],
      selectMenu: [false, false, false, false, false, false, false, false],
      confirmDialogInfo: {
        openDialog: false,
        title: '',
        contentFilePath: 'pages/occ/updateOcc.vue',
        confirmMethod: null,
        otherMethod: null,
      },
    };
  },
  mounted() {
    this.getOccList();
  },
  methods: {
    dateTime,
    currencies,
    // formatCashType(type) {
    //   const res = constList.cashTypeList.filter(item => item.id === type)[0];
    //   return res ? res.value : '';
    // },
    getParamsOrigin() {
      return {
        type: null,
        cashIdShow: null,
        certificateNumberShow: null,
        contentShow: null,
        createAccountShow: null,
        modifyAccountShow: null,
        createTimeStartShow: null,
        createTimeEndShow: null,
        modifyTimeStartShow: null,
        modifyTimeEndShow: null,
      };
    },
    async getOccList(params) {
      const res = await httpMethod({
        url: '/v1/api/occ/list',
        method: 'GET',
        params,
      });
      if (!res.code) {
        this.occList = res.data;
        console.log('​getOccList -> res.data', res.data);
      } else {
        this.occList = [];
      }
    },
    methodFormReset() {
      this.searchParams = this.getParamsOrigin();
    },
    methodProcessParams() {
      const {
        type,
        cashIdShow,
        certificateNumberShow,
        contentShow,
        createAccountShow,
        modifyAccountShow,
        createTimeStartShow,
        createTimeEndShow,
        modifyTimeStartShow,
        modifyTimeEndShow,
      } = this.searchParams;
      const params = {};
      if (type) params.type = type;
      if (cashIdShow) params.id = cashIdShow;
      if (certificateNumberShow) params.certificateNumber = certificateNumberShow;
      if (contentShow) params.content = contentShow;
      if (createAccountShow) params.createAccount = createAccountShow;
      if (modifyAccountShow) params.modifyAccount = modifyAccountShow;
      if (createTimeStartShow) params.createTimeStart = new Date(createTimeStartShow).valueOf();
      if (createTimeEndShow) params.createTimeEnd = new Date(createTimeEndShow).valueOf();
      if (modifyTimeStartShow) params.modifyTimeStart = new Date(modifyTimeStartShow).valueOf();
      if (modifyTimeEndShow) params.modifyTimeEnd = new Date(modifyTimeEndShow).valueOf();
      this.getOccList(params);
    },
    methodChangeOpenDialog(val) {
      this.confirmDialogInfo.openDialog = val;
    },
    // methodAddCash() {
    //   this.confirmDialogInfo = {
    //     ...this.confirmDialogInfo,
    //     openDialog: true,
    //     title: '新增收支項目',
    //     contentFilePath: 'pages/cash/addCash.vue',
    //     otherMethod: this.getOccList,
    //     width: 1000,
    //   };
    // },
    methodUpdateOcc(rowData) {
      this.confirmDialogInfo = {
        ...this.confirmDialogInfo,
        openDialog: true,
        title: '分配房間',
        contentFilePath: 'pages/room/updateOcc.vue',
        otherMethod: this.getOccList,
        contentData: rowData,
        width: 1000,
      };
    },
  },
};
</script>
