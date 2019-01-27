<template>
  <div class="room-repair-list">
    <v-card>
      <v-card-title>
        收支列表
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
        :items="roomRepairList"
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
          <td class="text-xs-center">{{ props.item.certificateNumber }}</td>
          <td class="text-xs-center">{{ props.item.content }}</td>
          <td class="text-xs-center">{{ currencies(props.item.income) }}</td>
          <td class="text-xs-center">{{ currencies(props.item.outcome) }}</td>
          <td class="text-xs-center">{{ props.item.balance }}</td>
          <td class="text-xs-center">{{ formatType(props.item.type) }}</td>
          <td class="text-xs-center">{{ dateTime(props.item.createTime) }}</td>
          <td class="text-xs-center">{{ props.item.createAccount }}</td>
          <td class="text-xs-center">{{ dateTime(props.item.modifyTime) }}</td>
          <td class="text-xs-center">{{ props.item.modifyAccount }}</td>
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
import { dateTime, currencies } from '@/utils/calculation';

export default {
  name: 'cashList',
  data() {
    return {
      search: '',
      rowsPerPageItems: [20, 30, 50, 80, 100],
      pagination: {
        rowsPerPage: 20,
      },
      headers: [
        { text: '訂單號', value: 'id', sortable: false },
        { text: '憑證號', value: 'certificateNumber', sortable: false },
        { text: '摘要', value: 'content', sortable: false },
        { text: '收入金額', value: 'income', sortable: false },
        { text: '支出金額', value: 'outcome', sortable: false },
        { text: '餘額', value: 'balance', sortable: false },
        { text: '帳單類型', value: 'type', sortable: false },
        { text: '創建日期', value: 'createTime', sortable: false },
        { text: '創建用戶', value: 'createAccount', sortable: false },
        { text: '修改日期', value: 'modifyTime', sortable: false },
        { text: '修改帳號', value: 'modifyAccount', sortable: false },
      ],
      roomRepairList: [],
    };
  },
  mounted() {
    this.getRoomRepairList();
  },
  methods: {
    dateTime,
    currencies,
    formatType(val) {
      return val === 1 ? '現金' : '銀行';
    },
    async getRoomRepairList() {
      const res = await httpMethod({
        url: '/v1/api/room/maintenance/list',
        method: 'GET',
      });
      if (!res.code) {
        this.roomRepairList = res.data;
        console.log('​getroomRepairList -> res.data', res.data);
      } else {
        this.roomRepairList = [];
      }
    },
  },
};
</script>
