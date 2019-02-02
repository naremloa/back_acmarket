<template>
  <v-card>
    <v-card-title>
      訂單資訊
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
        <td class="text-xs-center">{{ props.item.roomType }}</td>
        <td class="text-xs-right">{{ currencies(props.item.price) }}</td>
        <td class="text-xs-right">{{ currencies(props.item.totalPrice) }}</td>
        <td class="text-xs-right">{{ currencies(props.item.totalValidPrice) }}</td>
        <td class="text-xs-center">{{ props.item.status }}</td>
        <td class="text-xs-center">{{ props.item.latestModifyAccount }}</td>
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
</template>
<script>
import httpMethod from '@/utils/httpMethod';
import { dateTime, currencies } from '@/utils/calculation';

export default {
  data() {
    return {
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
        { text: '最近操作訂單帳號', value: 'latestModifyAccount', sortable: false },
        { text: '最近操作訂單時間', value: 'latestModifyTime', sortable: false },
        { text: '備註', value: 'note', sortable: false },
      ],
      orderList: [],
    };
  },
  mounted() {
    this.getOrder();
  },
  methods: {
    dateTime,
    currencies,
    async getOrder() {
      const query = {
        name: 'Harmon',
        // phone: '+886 (932) 511-327',
      };
      const res = await httpMethod({
        url: '/v1/api/order/list',
        method: 'GET',
        params: query,
      });
      console.log(res);
      this.orderList = res.data;
    },
  },
};
</script>
