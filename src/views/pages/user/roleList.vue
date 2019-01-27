<template>
  <div class="room-repair-list">
    <v-card>
      <v-card-title>
        使用者角色列表
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
          <td class="text-xs-center">{{ props.item.value }}</td>

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
        { text: '角色ID', value: 'id', sortable: false },
        { text: '角色名稱', value: 'value', sortable: false },
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
        url: '/v1/api/user/role/list',
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
