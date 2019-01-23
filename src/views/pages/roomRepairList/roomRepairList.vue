<template>
  <div class="room-repair-list">
    <v-card>
      <v-card-title>
        修理列表
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
          <td class="text-xs-center">{{ props.item.position }}</td>
          <td class="text-xs-center">{{ props.item.content }}</td>
          <td class="text-xs-center">{{ currencies(props.item.internalCost) }}</td>
          <td class="text-xs-center">{{ currencies(props.item.outsourcedCost) }}</td>
          <td class="text-xs-center">{{ props.item.note }}</td>
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
  data() {
    return {
      search: '',
      rowsPerPageItems: [20, 30, 50, 80, 100],
      pagination: {
        rowsPerPage: 20,
        sortBy: 'id',
      },
      headers: [
        { text: '房間id', value: 'id', sortable: false },
        { text: '維修位置', value: 'position', sortable: false },
        { text: '維修內容', value: 'content', sortable: false },
        { text: '自修配件費', value: 'internalCost', sortable: false },
        { text: '委外維修費', value: 'outsourcedCost', sortable: false },
        { text: '備註', value: 'note', sortable: false },
        { text: '創建時間', value: 'createTime', sortable: false },
        { text: '創建帳號', value: 'createAccount', sortable: false },
        { text: '修改時間', value: 'modifyTime', sortable: false },
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
