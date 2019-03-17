<template>
  <div class="update-occ">
    <v-form v-model="valid" ref="form" class="px-2" lazy-validation>
      <v-layout row wrap align-center>
        <v-flex sm4>入住時間：</v-flex>
        <v-flex sm8>{{formatStringDate(contentData.date) || ''}}</v-flex>
        <v-flex sm4>入住房型：</v-flex>
        <v-flex sm8>{{contentData.roomName || ''}}</v-flex>
        <v-flex sm4 v-if="contentData.subRoomCid">已分配房型：</v-flex>
        <v-flex sm8 v-if="contentData.subRoomCid">{{contentData.subRoomName || ''}}</v-flex>
        <v-flex sm4>分配房間：</v-flex>
        <v-flex sm12 md8>
          <v-select
            v-model="occInfoParams.selectedSubRoom"
            :items="subRoomList"
            item-text="name"
            item-value="cid"
            label="選擇房間"
          ></v-select>
        </v-flex>
      </v-layout>
      <!-- <v-layout row wrap>
        <v-flex
          sm12
          md4
          lg3
          px-1
          v-for="(item, idx) in occParamsList"
          :key="`occParamsList${idx}`"
        >
          <v-text-field
            v-model="occInfoParams[item.key]"
            :label="item.label"
            clearable
            :rules="item.require ? nameRules : []"
            :required="item.require"
          ></v-text-field>
        </v-flex>
      </v-layout> -->
      <v-layout>
        <v-flex text-xs-right>
          <v-btn flat @click="methodCancelUpdateOcc">取消</v-btn>
          <v-btn flat @click="methodFormReset">重置</v-btn>
          <v-btn flat @click="methodClearSubRoom">清除分配房間</v-btn>
          <v-btn color="primary" @click="methodProcessParams">
            <v-icon>mdi-check</v-icon>分配房間
          </v-btn>
        </v-flex>
      </v-layout>
    </v-form>
  </div>
</template>
<script>
import httpMethod from '@/utils/httpMethod';
import constList from '@/utils/const';
import { dateTime, currencies, formatStringDate } from '@/utils/calculation';

export default {
  name: 'updateOcc',
  props: ['contentData', 'openDialog'],
  data() {
    return {
      constList,
      valid: false,
      occInfoParams: this.getParamsOrigin(),
      occParamsList: [
        { label: '房型名稱', key: 'name', require: true },
      ],
      subRoomList: [],
      nameRules: [
        v => !!v || '此欄位為必填',
      ],
    };
  },
  watch: {
    openDialog(val) {
      if (val) {
        this.getSubRoomList();
        this.formatProps(this.contentData);
      }
    },
  },
  mounted() {
    this.getSubRoomList();
    this.formatProps(this.contentData);
  },
  methods: {
    formatStringDate,
    getParamsOrigin() {
      return {
        selectedSubRoom: null,
      };
    },
    async getSubRoomList() {
      const params = {
        cid: this.contentData._id,
      };
      const res = await httpMethod({
        url: '/v1/api/occ/room/options',
        method: 'GET',
        params,
      });
      let alert = null;
      if (!res.code) {
        // alert = {
        //   open: true,
        //   text: `${res.msg}`,
        //   color: 'success',
        // };
        this.subRoomList = res.data;
        // this.methodCancelUpdateOcc();
        // this.$emit('execOtherMethod');
      } else {
        alert = {
          open: true,
          text: res.msg || '無法取得房間列表，請重新再試，或聯絡客服人員',
          color: 'error',
        };
      }
      this.$store.commit('global/setNotifySetting', alert);
    },
    formatProps(rowData) {
      const {
        subRoomCid,
      } = rowData;
      this.occInfoParams.selectedSubRoom = subRoomCid;
    },
    methodFormReset() {
      this.occInfoParams = this.getParamsOrigin();
      this.$refs.form.resetValidation();
    },
    methodProcessParams() {
      const params = {};
      const { _id, roomCid } = this.contentData;
      params.cid = _id;
      params.roomCid = roomCid;
      params.subRoomCid = this.occInfoParams.selectedSubRoom;
      this.updateOcc(params);
    },
    async updateOcc(params) {
      if (this.$refs.form.validate()) {
        const res = await httpMethod({
          url: '/v1/api/occ/update/subRoomCid',
          method: 'POST',
          data: params,
        });
        let alert = null;
        if (!res.code) {
          alert = {
            open: true,
            text: `${res.msg}`,
            color: 'success',
          };
          this.methodCancelUpdateOcc();
          this.$emit('execOtherMethod');
        } else {
          alert = {
            open: true,
            text: res.msg || '修改失敗，請重新再試，或聯絡客服人員',
            color: 'error',
          };
        }
        this.$store.commit('global/setNotifySetting', alert);
      }
    },
    async methodClearSubRoom() {
      const params = {};
      const { _id, roomCid } = this.contentData;
      params.cid = _id;
      params.roomCid = roomCid;
      params.subRoomCid = '';
      const res = await httpMethod({
        url: '/v1/api/occ/update/subRoomCid',
        method: 'POST',
        data: params,
      });
      let alert = null;
      if (!res.code) {
        alert = {
          open: true,
          text: `${res.msg}`,
          color: 'success',
        };
        this.methodCancelUpdateOcc();
        this.$emit('execOtherMethod');
      } else {
        alert = {
          open: true,
          text: res.msg || '修改失敗，請重新再試，或聯絡客服人員',
          color: 'error',
        };
      }
    },
    methodCancelUpdateOcc() {
      this.methodFormReset();
      this.$emit('closeDialog');
    },
  },
};
</script>
