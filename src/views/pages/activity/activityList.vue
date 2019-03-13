<template>
  <div class="activity-list">
    <v-layout row wrap justify-end>
      <v-btn @click="methodAddActivity">
        <v-icon>mdi-plus</v-icon>
        新增活動
      </v-btn>
    </v-layout>
    <!-- <v-expansion-panel class="mb-2">
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
    </v-expansion-panel> -->
    <v-card>
      <v-card-title>
        活動列表
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
        :items="activityList"
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
          <tr @click="methodProcessExpand(props.item), props.expanded = !props.expanded">
            <td class="text-xs-center">{{ props.item.name }}</td>
            <td class="text-xs-center">{{ dateTime(props.item.startTime, true) }}</td>
            <td class="text-xs-center">{{ dateTime(props.item.endTime, true) }}</td>
            <td class="text-xs-center">{{ props.item.roomActivityPrice }}</td>
            <td class="text-xs-center">{{ props.item.mag }}</td>
            <td class="text-xs-center">{{ props.item.activityPrice }}</td>
            <td class="text-xs-center">{{ currencies(props.item.extraActivityPrice) }}</td>
            <td class="text-xs-center">{{ props.item.remainDay }}</td>
            <td class="text-xs-center">{{ dateTime(props.item.createTime) }}</td>
            <td class="text-xs-center">{{ props.item.createAccount }}</td>
            <td class="text-xs-center">{{ props.item.status === 1 ? '啟用' : '停用' }}</td>
            <td class="text-xs-center">
              <v-btn
                small
                :color="props.item.status !== 1 ? 'success' : 'error'"
                @click.stop="methodVerifyStatus(props.item)"
              >{{ props.item.status !== 1 ? '啟用' : '停用' }}</v-btn>
              <v-btn small @click.stop="methodUpdateActivity(props.item)">
                <v-icon>mdi-square-edit-outline</v-icon>修改
              </v-btn>
            </td>
          </tr>
        </template>
        <template slot="expand" slot-scope="props">
          <div class="order-list__detail-list pa-3 pl-5 accent">
            <v-layout row wrap>
              <v-flex xs12>
                <div>
                  <span>活動房價試算</span>
                  <v-switch
                    v-model="expandList[props.item._id].activity"
                    label="參加活動"
                    color="primary"
                    @change="methodGetActivityRoomPriceByDay(props.item,props.item._id),
                      methodGetActivityTotalPrice(props.item,props.item._id)"
                  ></v-switch>
                </div>
              </v-flex>
              <v-flex xs12 md2 class="order-list__detail-list--content">
                <v-text-field
                  type="number"
                  v-model.number="expandList[props.item._id].roomUnitPrice"
                  label="房間單價"
                  min="0"
                  @change="methodGetActivityRoomPriceByDay(props.item,props.item._id),
                    methodGetActivityTotalPrice(props.item,props.item._id)"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md2 offset-md1 class="order-list__detail-list--content">
                <v-text-field
                  type="number"
                  v-model.number="expandList[props.item._id].nthOfDay"
                  label="第n天"
                  min="1"
                  @change="methodGetActivityRoomPriceByDay(props.item,props.item._id)"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md2 class="order-list__detail-list--content">
                當天單價：{{expandList[props.item._id].nthOfPrice}}
              </v-flex>
              <v-flex xs12 md2 class="order-list__detail-list--content">
                <v-text-field
                  type="number"
                  v-model.number="expandList[props.item._id].totalDay"
                  label="總天數"
                  min="1"
                  @change="methodGetActivityTotalPrice(props.item,props.item._id)"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md2 class="order-list__detail-list--content">
                所有天數的總價：{{expandList[props.item._id].totalPrice}}
              </v-flex>
            </v-layout>
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
import constList from '@/utils/const';
import { getActivityRoomPriceByDay, getActivityTotalPrice } from '@/utils/formatMethod';
import confirmDialog from '@/views/layout/components/confirmDialog.vue';
import dialogComponent from '@/views/layout/components/dialog.vue';
import { dateTime, currencies } from '@/utils/calculation';

export default {
  name: 'activityList',
  components: {
    confirmDialog,
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
        { text: '活動名稱', value: 'name', sortable: false },
        { text: '開始時間', value: 'startTime', sortable: false },
        { text: '結束時間', value: 'endTime', sortable: false },
        { text: '房型活動價基數率', value: 'roomActivityPrice', sortable: false },
        { text: '倍率', value: 'mag', sortable: false },
        { text: '活動價基數率', value: 'activityPrice', sortable: false },
        { text: '活動額外價格', value: 'extraActivityPrice', sortable: false },
        { text: '活動有效天數', value: 'remainDay', sortable: false },
        { text: '創建日期', value: 'createTime', sortable: false },
        { text: '創建用戶', value: 'createAccount', sortable: false },
        { text: '狀態', value: 'status', sortable: false },
        { text: '操作', value: '', sortable: false },
      ],
      activityList: [],
      valid: false,
      searchParams: this.getParamsOrigin(),
      // searchItemParams: [
      //   { label: '訂單號', key: 'cashIdShow' },
      //   { label: '憑證號', key: 'certificateNumberShow' },
      //   { label: '摘要', key: 'contentShow' },
      //   { label: '創建用戶', key: 'createAccountShow' },
      //   { label: '修改帳號', key: 'modifyAccountShow' },
      // ],
      // searchTimeParams: [
      //   { label: '創建開始時間', key: 'createTimeStartShow' },
      //   { label: '創建結束時間', key: 'createTimeEndShow' },
      //   { label: '修改開始時間', key: 'modifyTimeStartShow' },
      //   { label: '修改結束時間', key: 'modifyTimeEndShow' },
      // ],
      selectMenu: [false, false, false, false, false, false, false, false],
      expandList: {},
      confirmDialogInfo: {
        openDialog: false,
        title: '',
        content: '',
        confirmMethod: null,
      },
      dialogInfo: {
        openDialog: false,
        title: '',
        contentFilePath: 'pages/activity/addActivity.vue',
        confirmMethod: null,
        otherMethod: null,
      },
    };
  },
  mounted() {
    this.getActivityList();
  },
  methods: {
    dateTime,
    currencies,
    getActivityRoomPriceByDay,
    getActivityTotalPrice,
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
    async getActivityList(params) {
      const res = await httpMethod({
        url: '/v1/api/activity/list',
        method: 'GET',
        params,
      });
      if (!res.code) {
        this.activityList = res.data;
        console.log('​getActivityList -> res.data', res.data);
      } else {
        this.activityList = [];
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
      this.getActivityList(params);
    },
    methodChangeOpenDialog(val) {
      this.dialogInfo.openDialog = val;
    },
    methodAddActivity() {
      this.dialogInfo = {
        ...this.dialogInfo,
        openDialog: true,
        title: '新增活動',
        contentFilePath: 'pages/activity/addActivity.vue',
        otherMethod: this.getActivityList,
        width: 1000,
      };
    },
    methodUpdateActivity(rowData) {
      this.dialogInfo = {
        ...this.dialogInfo,
        openDialog: true,
        title: '修改活動',
        contentFilePath: 'pages/activity/updateActivity.vue',
        otherMethod: this.getActivityList,
        contentData: rowData,
        width: 1000,
      };
    },
    methodChangeOpenConfirmDialog(val) {
      this.confirmDialogInfo.openDialog = val;
    },
    methodVerifyStatus(rowData, pass) {
      console.log('TCL: methodVerifyStatus -> rowData', rowData);
      const { _id, status, name } = rowData;
      const params = {
        cid: _id,
        status: status === 1 ? 0 : 1,
      };
      this.confirmDialogInfo = {
        ...this.confirmDialogInfo,
        openDialog: true,
        title: '變更活動狀態',
        content: `您確定變更活動： ${name} 的狀態為 ${status !== 1 ? '啟用' : '停用'}`,
        confirmMethod: () => this.updateActivityStatus(params),
      };
    },
    async updateActivityStatus(params) {
      const res = await httpMethod({
        url: '/v1/api/activity/toggle/status',
        method: 'POST',
        data: params,
      });
      let alert = null;
      if (!res.code) {
        if (res.data) {
          alert = {
            open: true,
            text: `${res.msg}`,
            color: 'success',
          };
        }
      } else {
        alert = {
          open: true,
          text: res.msg || '變更失敗，請重新再試，或聯絡客服人員',
          color: 'error',
        };
      }
      this.$store.commit('global/setNotifySetting', alert);
      this.getActivityList();
    },
    methodProcessExpand(rowData) {
      console.log('TCL: methodProcessExpand -> rowData', rowData);
      this.$set(this.expandList, rowData._id, {
        activity: true,
        roomUnitPrice: 0,
        nthOfDay: 0,
        nthOfPrice: 0,
        totalDay: 0,
        totalPrice: 0,
      });
      // this.expandList[rowData._id] = {
      //   roomUnitPrice: 0,
      //   nthOfDay: 0,
      //   nthOfPrice: 0,
      //   totalDay: 0,
      //   totalPrice: 0,
      // };
    },
    methodGetActivityRoomPriceByDay(rowData, id) {
      if (this.expandList[id].nthOfDay && this.expandList[id].roomUnitPrice) {
        const params = {
          roomActivityPrice: rowData.roomActivityPrice,
          mag: rowData.mag,
          activityPrice: rowData.activityPrice,
          extraActivityPrice: rowData.extraActivityPrice,
          remainDay: rowData.remainDay,
          price: this.expandList[id].roomUnitPrice * 100,
        };
        this.$set(this.expandList[id], 'nthOfPrice', this.currencies(this.getActivityRoomPriceByDay(
          params,
          this.expandList[id].nthOfDay,
          this.expandList[id].activity,
        )));
      } else {
        this.$set(this.expandList[id], 'nthOfPrice', 0);
      }
    },
    methodGetActivityTotalPrice(rowData, id) {
      if (this.expandList[id].totalDay && this.expandList[id].roomUnitPrice) {
        const params = {
          roomActivityPrice: rowData.roomActivityPrice,
          mag: rowData.mag,
          activityPrice: rowData.activityPrice,
          extraActivityPrice: rowData.extraActivityPrice,
          remainDay: rowData.remainDay,
          price: this.expandList[id].roomUnitPrice * 100,
        };
        this.$set(this.expandList[id], 'totalPrice', this.currencies(this.getActivityTotalPrice(
          params,
          this.expandList[id].totalDay,
          this.expandList[id].activity,
        )));
      } else {
        this.$set(this.expandList[id], 'totalPrice', 0);
      }
    },
  },
};
</script>
