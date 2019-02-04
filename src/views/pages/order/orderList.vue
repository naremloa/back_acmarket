<template>
  <div class="order-list">
    <v-layout row wrap justify-end>
      <v-btn @click="methodAddOrder">
        <v-icon>mdi-plus</v-icon>
        新增訂單
      </v-btn>
    </v-layout>
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
            <v-flex sm12 md4 lg3 px-1 >
              <v-select
                v-model="searchParams.roomType"
                :items="constList.roomTypeList"
                item-text="value"
                item-value="id"
                label="訂房房型"
              ></v-select>
            </v-flex>
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
        訂單資訊
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
        :items="orderList"
        :search="search"
        prev-icon="mdi-menu-left"
        next-icon="mdi-menu-right"
        sort-icon="mdi-menu-down"
        rows-per-page-text="每頁顯示筆數"
        :rows-per-page-items="rowsPerPageItems"
        :pagination.sync="pagination"
      >
        <template slot="items" slot-scope="props">
          <td class="text-xs-center">{{ props.item.orderId }}</td>
          <td class="text-xs-center">{{ props.item.name }}</td>
          <td class="text-xs-center">{{ props.item.phone }}</td>
          <td class="text-xs-center">{{ props.item.email }}</td>
          <td class="text-xs-center">{{ props.item.nationality }}</td>
          <td class="text-xs-center">{{ dateTime(props.item.checkInTime) }}</td>
          <td class="text-xs-center">{{ dateTime(props.item.checkOutTime) }}</td>
          <td class="text-xs-center">{{ dateTime(props.item.createTime) }}</td>
          <td class="text-xs-center">{{ formatRoomType(props.item.roomType) }}</td>
          <td class="text-xs-right">{{ currencies(props.item.price) }}</td>
          <td class="text-xs-right">{{ currencies(props.item.totalPrice) }}</td>
          <td class="text-xs-right">{{ currencies(props.item.totalValidPrice) }}</td>
          <td class="text-xs-center">
            <div v-if="props.item.status === 5">{{ formatOrderStatus(props.item.status) }}</div>
            <v-btn
              v-else
              small
              @click="methodUpdateStatus(props.item)"
            >{{ formatOrderStatus(props.item.status) }}</v-btn>
          </td>
          <td class="text-xs-center">{{ props.item.latestModifyAccount }}</td>
          <td class="text-xs-center">
            <v-btn small @click="methodUpdateOrder(props.item)">
              <v-icon>mdi-square-edit-outline</v-icon>修改訂單
            </v-btn>
          </td>
          <td class="text-xs-center">{{ dateTime(props.item.latestModifyTime) }}</td>
          <td class="text-xs-center">{{ props.item.note }}</td>
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
  name: 'orderList',
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
        { text: '訂單編號', value: 'orderId', sortable: false },
        { text: '姓名', value: 'name', sortable: false },
        { text: '電話', value: 'phone', sortable: false },
        { text: '電子郵件', value: 'email', sortable: false },
        { text: '國籍', value: 'nationality', sortable: false },
        { text: '入住時間', value: 'checkInTime', sortable: false },
        { text: '退房時間', value: 'checkOutTime', sortable: false },
        { text: '訂房時間', value: 'createTime', sortable: false },
        { text: '訂房房型', value: 'roomType', sortable: false },
        { text: '房間單價', value: 'price', sortable: false },
        { text: '應收總價', value: 'totalPrice', sortable: false },
        { text: '實收總價', value: 'totalValidPrice', sortable: false },
        { text: '訂單狀態', value: 'status', sortable: false },
        { text: '操作', value: '', sortable: false },
        { text: '最近操作訂單帳號', value: 'latestModifyAccount', sortable: false },
        { text: '最近操作訂單時間', value: 'latestModifyTime', sortable: false },
        { text: '備註', value: 'note', sortable: false },
      ],
      orderList: [],
      valid: false,
      searchParams: this.getParamsOrigin(),
      searchItemParams: [
        { label: '訂單編號', key: 'orderIdShow' },
        { label: '姓名', key: 'nameShow' },
        { label: '電話', key: 'phoneShow' },
        { label: '電子郵件', key: 'emailShow' },
        { label: '國籍', key: 'nationalityShow' },
        { label: '最近操作訂單帳號', key: 'latestModifyAccountShow' },
        { label: '備註', key: 'noteShow' },
      ],
      searchTimeParams: [
        { label: '入住開始時間', key: 'checkInTimeStartShow' },
        { label: '入住結束時間', key: 'checkInTimeEndShow' },
        { label: '退房開始時間', key: 'checkOutTimeStartShow' },
        { label: '退房結束時間', key: 'checkOutTimeEndShow' },
        { label: '訂房開始時間', key: 'createTimeStartShow' },
        { label: '訂房結束時間', key: 'createTimeEndShow' },
        { label: '最近操作訂單開始時間', key: 'latestModifyTimeStartShow' },
        { label: '最近操作訂單結束時間', key: 'latestModifyTimeEndShow' },
      ],
      selectMenu: [false, false, false, false, false, false, false, false],
      confirmDialogInfo: {
        openDialog: false,
        title: '',
        contentFilePath: 'pages/order/addOrder.vue',
        contentData: null,
        confirmMethod: null,
        otherMethod: null,
      },
    };
  },
  mounted() {
    this.getOrder();
  },
  methods: {
    dateTime,
    currencies,
    formatRoomType(type) {
      const res = constList.roomTypeList.filter(item => item.id === type)[0];
      return res ? res.value : '';
    },
    formatOrderStatus(type) {
      const res = constList.orderStatusList.filter(item => item.id === type)[0];
      return res ? res.value : '';
    },
    getParamsOrigin() {
      return {
        roomType: null,
        status: null,
        orderIdShow: null,
        nameShow: null,
        phoneShow: null,
        emailShow: null,
        nationalityShow: null,
        latestModifyAccountShow: null,
        noteShow: null,
        checkInTimeStartShow: null,
        checkInTimeEndShow: null,
        checkOutTimeStartShow: null,
        checkOutTimeEndShow: null,
        createTimeStartShow: null,
        createTimeEndShow: null,
        latestModifyTimeStartShow: null,
        latestModifyTimeEndShow: null,
      };
    },
    async getOrder(params) {
      const res = await httpMethod({
        url: '/v1/api/order/list',
        method: 'GET',
        params,
      });
      console.log(res);
      this.orderList = res.data;
    },
    methodFormReset() {
      this.searchParams = this.getParamsOrigin();
    },
    methodProcessParams() {
      const {
        roomType,
        status,
        orderIdShow,
        nameShow,
        phoneShow,
        emailShow,
        nationalityShow,
        latestModifyAccountShow,
        noteShow,
        checkInTimeStartShow,
        checkInTimeEndShow,
        checkOutTimeStartShow,
        checkOutTimeEndShow,
        createTimeStartShow,
        createTimeEndShow,
        latestModifyTimeStartShow,
        latestModifyTimeEndShow,
      } = this.searchParams;
      const params = {};
      if (roomType) params.roomType = roomType;
      if (status) params.status = status;
      if (orderIdShow) params.orderId = orderIdShow;
      if (nameShow) params.name = nameShow;
      if (phoneShow) params.phone = phoneShow;
      if (emailShow) params.email = emailShow;
      if (nationalityShow) params.nationality = nationalityShow;
      if (latestModifyAccountShow) params.latestModifyAccount = latestModifyAccountShow;
      if (noteShow) params.note = noteShow;
      if (checkInTimeStartShow) params.checkInTimeStart = new Date(checkInTimeStartShow).valueOf();
      if (checkInTimeEndShow) params.checkInTimeEnd = new Date(checkInTimeEndShow).valueOf();
      if (checkOutTimeStartShow) params.checkOutTimeStart = new Date(checkOutTimeStartShow).valueOf();
      if (checkOutTimeEndShow) params.checkOutTimeEnd = new Date(checkOutTimeEndShow).valueOf();
      if (createTimeStartShow) params.createTimeStart = new Date(createTimeStartShow).valueOf();
      if (createTimeEndShow) params.createTimeEnd = new Date(createTimeEndShow).valueOf();
      if (latestModifyTimeStartShow) params.latestModifyTimeStart = new Date(latestModifyTimeStartShow).valueOf();
      if (latestModifyTimeEndShow) params.latestModifyTimeEnd = new Date(latestModifyTimeEndShow).valueOf();
      this.getOrder(params);
    },
    methodChangeOpenDialog(val) {
      this.confirmDialogInfo.openDialog = val;
    },
    methodAddOrder() {
      this.confirmDialogInfo = {
        ...this.confirmDialogInfo,
        openDialog: true,
        title: '新增訂單',
        contentFilePath: 'pages/order/addOrder.vue',
        otherMethod: this.getOrder,
        width: 1000,
      };
    },
    methodUpdateStatus(rowData) {
      this.confirmDialogInfo = {
        ...this.confirmDialogInfo,
        openDialog: true,
        title: '更新狀態',
        contentFilePath: 'pages/order/updateStatus.vue',
        otherMethod: this.getOrder,
        contentData: rowData,
        width: 800,
      };
    },
    methodUpdateOrder(rowData) {
      this.confirmDialogInfo = {
        ...this.confirmDialogInfo,
        openDialog: true,
        title: '更新訂單資訊',
        contentFilePath: 'pages/order/updateOrder.vue',
        otherMethod: this.getOrder,
        contentData: rowData,
        width: 1000,
      };
    },
  },
};
</script>
