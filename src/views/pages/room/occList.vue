<template>
  <div class="occ-list">
    <v-expansion-panel class="mb-2">
      <v-expansion-panel-content class="accent">
        <div slot="header" class="subheading">搜尋選項</div>
        <v-form v-model="valid" class="px-2">
          <v-layout row wrap>
            <v-flex sm12 md4 lg3 px-1 >
              <v-select
                v-model="searchParams.subRoomCid"
                :items="subRoomList"
                item-text="name"
                item-value="cid"
                label="房型列表"
              ></v-select>
            </v-flex>
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
              <v-btn color="primary" @click="getOccList">
                <v-icon>mdi-magnify</v-icon>搜尋
              </v-btn>
            </v-flex>
          </v-layout>
        </v-form>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <v-card>
      <v-card-title>
        佔用列表
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
        expand
        item-key="_id"
      >
        <template slot="items" slot-scope="props">
          <tr @click="props.expanded = !props.expanded">
            <td class="text-xs-center">{{ formatStringDate(props.item.date) }}</td>
            <td class="text-xs-center">{{ props.item.roomName }}</td>
            <td :class="['text-xs-center', props.item.subRoomName ? '': 'warning--text' ]">
              {{ props.item.subRoomName || '尚未分配房型' }}
            </td>
            <td class="text-xs-center">
              <v-btn small @click.stop="methodUpdateOcc(props.item)">
                <v-icon>mdi-square-edit-outline</v-icon>分配房間
              </v-btn>
            </td>
          </tr>
        </template>
        <template slot="expand" slot-scope="props">
          <div class="order-list__detail-list pa-3 pl-5 accent">
            <div>
                <p>更多訂單訊息</p>
                <p>{{methodGetOrderInfo(props.item)}}</p>
            </div>
            <!-- <v-layout row wrap>
              <v-flex xs12 md1>
                <p>更多訂單訊息</p>
              </v-flex>
              <v-flex xs12 md10 class="order-list__detail-list--content">
                <table class="order-list__detail-table">
                  <tr v-for="(key,keyIdx) in ['text', 'value']" :key="`detailRow${keyIdx}`">
                    <td
                      v-for="(item,idx) in detailHeaders"
                      :key="`detailItem${idx}`"
                    >{{keyIdx === 0
                      ? item[key]
                      : methodDetailTableFormat(props.item[item[key]], item.format) }}</td>
                  </tr>
                </table>
              </v-flex>
            </v-layout>
            <v-divider class="my-3"></v-divider>
            <v-layout row wrap>
              <v-flex xs12 md1>
                <p>更多訂房資訊</p>
                <v-btn small @click="methodGetMoreRoomOrderInfo(props.item._id)">更多</v-btn>
              </v-flex>
              <v-flex xs12 md10 class="order-list__detail-list--content">
                <v-data-table
                  :headers="detailRoomHeaders"
                  :items="props.item.roomInfo"
                  hide-actions
                >
                  <template slot="items" slot-scope="props">
                    <td>{{ formatRoomType(props.item.roomCid) }}</td>
                    <td>{{ currencies(props.item.price) }}</td>
                    <td>{{ props.item.num }}</td>
                  </template>
                </v-data-table>
              </v-flex>
              <v-flex xs12 v-if="props.item.moreRoomTypeList">
              <v-divider class="my-3"></v-divider>
                <v-data-table
                  :headers="moreDetailRoomHeaders"
                  :items="props.item.moreRoomTypeList"
                  hide-actions
                >
                  <template slot="items" slot-scope="props">
                    <td>{{ formatStringDate(props.item.date) }}</td>
                    <td>{{ props.item.roomName }}</td>
                  </template>
                </v-data-table>
              </v-flex>
            </v-layout> -->
          </div>
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
import dialogComponent from '@/views/layout/components/dialog.vue';
import { dateTime, currencies, formatStringDate } from '@/utils/calculation';

export default {
  name: 'occList',
  components: {
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
        { text: '入住日期', value: 'date', sortable: false },
        { text: '房型', value: 'roomName', sortable: false },
        { text: '房間', value: 'subRoomName', sortable: false },
        { text: '操作', value: '', sortable: false },
      ],
      occList: [],
      valid: false,
      searchParams: this.getParamsOrigin(),
      searchTimeParams: [
        { label: '創建開始時間', key: 'dateStartTimeShow' },
        { label: '創建結束時間', key: 'dateEndTimeShow' },
      ],
      selectMenu: [false, false, false, false, false, false, false, false],
      confirmDialogInfo: {
        openDialog: false,
        title: '',
        contentFilePath: 'pages/occ/updateOcc.vue',
        confirmMethod: null,
        otherMethod: null,
        width: 1000,
      },
      subRoomList: [],
    };
  },
  mounted() {
    this.getSubRoomList();
    this.getOccList();
  },
  methods: {
    dateTime,
    currencies,
    formatStringDate,
    async getSubRoomList() {
      const res = await httpMethod({
        url: '/v1/api/room/options',
        method: 'GET',
      });
      if (!res.code) {
        this.subRoomList = res.data;
        // console.log('​getOccList -> res.data', res.data);
      } else {
        this.subRoomList = [];
      }
    },
    getParamsOrigin() {
      return {
        subRoomCid: null,
        dateStartTimeShow: null,
        dateEndTimeShow: null,
      };
    },
    async getOccList() {
      const params = {};
      const {
        subRoomCid,
        dateStartTimeShow,
        dateEndTimeShow,
      } = this.searchParams;
      if (subRoomCid) params.roomCid = subRoomCid;
      if (dateStartTimeShow) params.dateStartTime = new Date(dateStartTimeShow).valueOf();
      if (dateEndTimeShow) params.dateEndTime = new Date(dateEndTimeShow).valueOf();
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
    methodChangeOpenDialog(val) {
      this.confirmDialogInfo.openDialog = val;
    },
    methodUpdateOcc(rowData) {
      this.confirmDialogInfo = {
        ...this.confirmDialogInfo,
        openDialog: true,
        title: '分配房間',
        contentFilePath: 'pages/room/updateOcc.vue',
        otherMethod: this.getOccList,
        contentData: rowData,
        width: 600,
      };
    },
    async methodGetOrderInfo(rowData) {
      console.log('TCL: methodGetOrderInfo -> rowData', rowData);
      const params = {
        occCid: rowData._id,
        orderCid: rowData.orderCid,
      };
      const res = await httpMethod({
        url: '/v1/api/occ/get/orderInfo',
        method: 'GET',
        params,
      });
      if (!res.code) {
        console.log('TCL: methodGetOrderInfo -> res', res);
        return res.data;
      }
      return [];
    },
  },
};
</script>
