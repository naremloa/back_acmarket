<template>
  <div class="room-repair-list">
    <v-layout row wrap justify-end>
      <v-btn @click="methodAddRoomRepair">
        <v-icon>mdi-plus</v-icon>
        新增維修事項
      </v-btn>
      <v-btn @click="methodAddSubRoom">
        <v-icon>mdi-plus</v-icon>
        新增房間
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
        修理列表
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
          <td class="text-xs-center">{{ formatRoom(props.item.id) }}</td>
          <td class="text-xs-center">{{ props.item.position }}</td>
          <td class="text-xs-center">{{ props.item.content }}</td>
          <td class="text-xs-center">{{ currencies(props.item.internalCost) }}</td>
          <td class="text-xs-center">{{ currencies(props.item.outsourceCost) }}</td>
          <td class="text-xs-center">{{ props.item.note }}</td>
          <td class="text-xs-center">{{ dateTime(props.item.createTime) }}</td>
          <td class="text-xs-center">{{ props.item.createAccount }}</td>
          <td class="text-xs-center">
            <v-btn small @click="methodUpdateRoomRepair(props.item)">
              <v-icon>mdi-square-edit-outline</v-icon>修改維修明細
            </v-btn>
          </td>
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
    <dialogComponent
      :openDialog="confirmDialogInfo.openDialog"
      @valueChange="methodChangeOpenDialog"
      :title="confirmDialogInfo.title"
      :contentFilePath="confirmDialogInfo.contentFilePath"
      :contentData="confirmDialogInfo.contentData"
      :confirmMethod="confirmDialogInfo.confirmMethod"
      :otherMethod="confirmDialogInfo.otherMethod"
      width="1000"
    />
  </div>
</template>
<script>
import httpMethod from '@/utils/httpMethod';
import dialogComponent from '@/views/layout/components/dialog.vue';
import { dateTime, currencies } from '@/utils/calculation';
import constList from '@/utils/const';

export default {
  name: 'roomRepairList',
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
        { text: '房間ID', value: 'id', sortable: false },
        { text: '維修位置', value: 'position', sortable: false },
        { text: '維修內容', value: 'content', sortable: false },
        { text: '自修配件費', value: 'internalCost', sortable: false },
        { text: '委外維修費', value: 'outsourceCost', sortable: false },
        { text: '備註', value: 'note', sortable: false },
        { text: '創建時間', value: 'createTime', sortable: false },
        { text: '創建帳號', value: 'createAccount', sortable: false },
        { text: '操作', value: '', sortable: false },
        { text: '修改時間', value: 'modifyTime', sortable: false },
        { text: '修改帳號', value: 'modifyAccount', sortable: false },
      ],
      roomRepairList: [],
      valid: false,
      searchParams: this.getParamsOrigin(),
      searchItemParams: [
        { label: '房間ID', key: 'idShow' },
        { label: '維修位置', key: 'positionShow' },
        { label: '維修內容', key: 'contentShow' },
        { label: '備註', key: 'noteShow' },
        { label: '創建帳號', key: 'createAccountShow' },
        { label: '修改帳號', key: 'modifyAccountShow' },
      ],
      searchTimeParams: [
        { label: '創建開始時間', key: 'createTimeStartShow' },
        { label: '創建結束時間', key: 'createTimeEndShow' },
        { label: '修改開始時間', key: 'modifyTimeStartShow' },
        { label: '修改結束時間', key: 'modifyTimeEndShow' },
      ],
      selectMenu: [false, false, false, false],
      confirmDialogInfo: {
        openDialog: false,
        title: '',
        contentFilePath: 'pages/roomRepair/addRoomRepair.vue',
        confirmMethod: null,
        otherMethod: null,
      },
    };
  },
  mounted() {
    // this.getRoomRepairList();
    this.getRoomOption();
  },
  methods: {
    dateTime,
    currencies,
    formatRoom(val) {
      const res = this.constList.roomTypeList.filter(item => item.id === val)[0];
      return res ? res.value : '';
    },
    async getRoomRepairList(params) {
      const res = await httpMethod({
        url: '/v1/api/room/maintenance/list',
        method: 'GET',
        params,
      });
      if (!res.code) {
        this.roomRepairList = res.data;
        console.log('​getroomRepairList -> res.data', res.data);
      } else {
        this.roomRepairList = [];
      }
    },
    getParamsOrigin() {
      return {
        idShow: null,
        positionShow: null,
        contentShow: null,
        noteShow: null,
        createAccountShow: null,
        modifyAccountShow: null,
        createTimeStartShow: null,
        createTimeEndShow: null,
        modifyTimeStartShow: null,
        modifyTimeEndShow: null,
      };
    },
    methodFormReset() {
      this.searchParams = this.getParamsOrigin();
    },
    methodProcessParams() {
      const {
        idShow,
        positionShow,
        contentShow,
        noteShow,
        createAccountShow,
        modifyAccountShow,
        createTimeStartShow,
        createTimeEndShow,
        modifyTimeStartShow,
        modifyTimeEndShow,
      } = this.searchParams;
      const params = {};
      if (idShow) params.id = idShow;
      if (positionShow) params.position = positionShow;
      if (contentShow) params.content = contentShow;
      if (noteShow) params.note = noteShow;
      if (createAccountShow) params.createAccount = createAccountShow;
      if (modifyAccountShow) params.modifyAccount = modifyAccountShow;

      if (createTimeStartShow) params.createTimeStart = new Date(createTimeStartShow).valueOf();
      if (createTimeEndShow) params.createTimeEnd = new Date(createTimeEndShow).valueOf();
      if (modifyTimeStartShow) params.modifyTimeStart = new Date(modifyTimeStartShow).valueOf();
      if (modifyTimeEndShow) params.modifyTimeEnd = new Date(modifyTimeEndShow).valueOf();

      this.getRoomRepairList(params);
    },
    methodChangeOpenDialog(val) {
      this.confirmDialogInfo.openDialog = val;
    },
    methodAddRoomRepair() {
      this.confirmDialogInfo = {
        ...this.confirmDialogInfo,
        openDialog: true,
        title: '新增維修事項',
        contentFilePath: 'pages/roomRepair/addRoomRepair.vue',
        otherMethod: this.getRoomRepairList,
      };
    },
    methodUpdateRoomRepair(rowData) {
      this.confirmDialogInfo = {
        ...this.confirmDialogInfo,
        openDialog: true,
        title: '更新維修事項',
        contentFilePath: 'pages/roomRepair/updateRoomRepair.vue',
        otherMethod: this.getRoomRepairList,
        contentData: rowData,
        width: 1000,
      };
    },

    async methodAddSubRoom() {
      const res = await httpMethod({
        url: '/v1/api/room/subRoom/add',
        method: 'POST',
        data: {
          cid: '5c728b7b44e77ca854b57cd7',
          name: '太平洋房',
        },
      });
    },
    async getRoomOption() {
      const res = await httpMethod({
        url: '/v1/api/room/options',
        method: 'GET',
      });
    },
  },
};
</script>
