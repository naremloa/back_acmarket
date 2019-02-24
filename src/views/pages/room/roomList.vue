<template>
  <div class="room-list">
    <!-- <v-layout row wrap justify-end>
      <v-btn @click="methodAddSubRoom">
        <v-icon>mdi-plus</v-icon>
        新增房間
      </v-btn>
    </v-layout> -->
    <v-card>
      <v-card-title>
        房型設定
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
        :items="roomTypeList"
        :search="search"
        prev-icon="mdi-menu-left"
        next-icon="mdi-menu-right"
        sort-icon="mdi-menu-down"
        rows-per-page-text="每頁顯示筆數"
        :rows-per-page-items="rowsPerPageItems"
        :pagination.sync="pagination"
        :expand="true"
        item-key="roomName"
      >
        <template slot="items" slot-scope="props">
          <tr @click="props.expanded = !props.expanded">
            <td class="text-xs-center">{{ props.item.roomName }}</td>
            <td class="text-xs-center">
              <v-btn
                small
                @click="props.expanded = !props.expanded, methodUpdateRoomType(props.item)"
              >
                <v-icon>mdi-square-edit-outline</v-icon>修改房型
              </v-btn>
              <v-btn
                small
                @click="props.expanded = !props.expanded, methodAddSubRoom(props.item)"
              >
                <v-icon>mdi-plus</v-icon>新增房間
              </v-btn>
            </td>
          </tr>
        </template>
        <template slot="expand" slot-scope="props">
          <div class="room-list__subroom-list pa-2 pl-5 accent">
            <v-data-table
              v-if="props.item.subRoomList.length>0"
              :headers="subRoomHeader"
              :items="props.item.subRoomList"
              class="elevation-1 primary"
              :hide-actions="true"
            >
              <template slot="items" slot-scope="props">
                <td>{{ props.item.name }}</td>
                <td>
                  <v-btn small @click="methodUpdateSubRoom(props.item)">
                    <v-icon>mdi-square-edit-outline</v-icon>修改房間
                  </v-btn>
                </td>
              </template>
            </v-data-table>
            <div v-else>尚未新增房間</div>
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
import { dateTime, currencies } from '@/utils/calculation';
import constList from '@/utils/const';

export default {
  name: 'roomList',
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
        { text: '房型名稱', value: 'name', sortable: false },
        // { text: '維修位置', value: 'position', sortable: false },
        // { text: '維修內容', value: 'content', sortable: false },
        // { text: '自修配件費', value: 'internalCost', sortable: false },
        // { text: '委外維修費', value: 'outsourceCost', sortable: false },
        // { text: '備註', value: 'note', sortable: false },
        // { text: '創建時間', value: 'createTime', sortable: false },
        // { text: '創建帳號', value: 'createAccount', sortable: false },
        { text: '操作', value: '', sortable: false },
        // { text: '修改時間', value: 'modifyTime', sortable: false },
        // { text: '修改帳號', value: 'modifyAccount', sortable: false },
      ],
      subRoomHeader: [
        { text: '房間名稱', value: 'name', sortable: false },
        { text: '操作', value: '', sortable: false },
      ],
      roomTypeList: [],
      // valid: false,
      // searchParams: this.getParamsOrigin(),
      // searchItemParams: [
      //   { label: '房間ID', key: 'idShow' },
      //   { label: '維修位置', key: 'positionShow' },
      //   { label: '維修內容', key: 'contentShow' },
      //   { label: '備註', key: 'noteShow' },
      //   { label: '創建帳號', key: 'createAccountShow' },
      //   { label: '修改帳號', key: 'modifyAccountShow' },
      // ],
      // searchTimeParams: [
      //   { label: '創建開始時間', key: 'createTimeStartShow' },
      //   { label: '創建結束時間', key: 'createTimeEndShow' },
      //   { label: '修改開始時間', key: 'modifyTimeStartShow' },
      //   { label: '修改結束時間', key: 'modifyTimeEndShow' },
      // ],
      // selectMenu: [false, false, false, false],
      confirmDialogInfo: {
        openDialog: false,
        title: '',
        contentFilePath: 'pages/room/addSubRoom.vue',
        confirmMethod: null,
        otherMethod: null,
      },
    };
  },
  mounted() {
    this.getRoomTypeList();
  },
  methods: {
    dateTime,
    currencies,
    // formatRoom(val) {
    //   const res = this.constList.roomTypeList.filter(item => item.id === val)[0];
    //   return res ? res.value : '';
    // },
    async getRoomTypeList(params) {
      const res = await httpMethod({
        url: '/v1/api/room/list',
        method: 'GET',
        params,
      });
      if (!res.code) {
        // this.roomTypeList = res.data;
        this.roomTypeList = res.data.map(item => ({
          ...item,
          subRoomList: item.subRoomList.map(subItem => ({
            ...subItem,
            roomTypeCid: item.roomCid,
          })),
        }));
        console.log('​getroomTypeList -> res.data', res.data);
      } else {
        this.roomTypeList = [];
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
    // methodFormReset() {
    //   this.searchParams = this.getParamsOrigin();
    // },
    // methodProcessParams() {
    //   const {
    //     idShow,
    //     positionShow,
    //     contentShow,
    //     noteShow,
    //     createAccountShow,
    //     modifyAccountShow,
    //     createTimeStartShow,
    //     createTimeEndShow,
    //     modifyTimeStartShow,
    //     modifyTimeEndShow,
    //   } = this.searchParams;
    //   const params = {};
    //   if (idShow) params.id = idShow;
    //   if (positionShow) params.position = positionShow;
    //   if (contentShow) params.content = contentShow;
    //   if (noteShow) params.note = noteShow;
    //   if (createAccountShow) params.createAccount = createAccountShow;
    //   if (modifyAccountShow) params.modifyAccount = modifyAccountShow;

    //   if (createTimeStartShow) params.createTimeStart = new Date(createTimeStartShow).valueOf();
    //   if (createTimeEndShow) params.createTimeEnd = new Date(createTimeEndShow).valueOf();
    //   if (modifyTimeStartShow) params.modifyTimeStart = new Date(modifyTimeStartShow).valueOf();
    //   if (modifyTimeEndShow) params.modifyTimeEnd = new Date(modifyTimeEndShow).valueOf();

    //   this.getRoomTypeList(params);
    // },
    methodChangeOpenDialog(val) {
      this.confirmDialogInfo.openDialog = val;
    },
    // methodAddSubRoomRepair() {
    //   this.confirmDialogInfo = {
    //     ...this.confirmDialogInfo,
    //     openDialog: true,
    //     title: '新增房型',
    //     contentFilePath: 'pages/room/addRoomType.vue',
    //     otherMethod: this.getRoomTypeList,
    //   };
    // },
    methodUpdateRoomType(rowData) {
      this.confirmDialogInfo = {
        ...this.confirmDialogInfo,
        openDialog: true,
        title: '更新房型',
        contentFilePath: 'pages/room/updateRoomType.vue',
        otherMethod: this.getRoomTypeList,
        contentData: rowData,
        width: 1000,
      };
    },
    async methodAddSubRoom(rowData) {
      console.log('TCL: methodAddSubRoom -> rowData', rowData);
      this.confirmDialogInfo = {
        ...this.confirmDialogInfo,
        openDialog: true,
        title: rowData.roomName ? `新增 ${rowData.roomName} 的房間` : '新增房間',
        contentFilePath: 'pages/room/addSubRoom.vue',
        otherMethod: this.getRoomTypeList,
        contentData: rowData,
        width: 500,
      };
    },
    methodUpdateSubRoom(rowData) {
      console.log('TCL: methodUpdateSubRoom -> rowData', rowData);
      this.confirmDialogInfo = {
        ...this.confirmDialogInfo,
        openDialog: true,
        title: '修改房間',
        contentFilePath: 'pages/room/updateSubRoom.vue',
        otherMethod: this.getRoomTypeList,
        contentData: rowData,
        width: 500,
      };
    },
  },
};
</script>
