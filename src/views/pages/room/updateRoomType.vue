<template>
  <div class="update-room-type">
    <v-form v-model="valid" ref="form" class="px-2" lazy-validation>
      <v-layout row wrap>
        <v-flex
          sm12
          md4
          lg3
          px-1
          v-for="(item, idx) in roomTypeParamsList"
          :key="`roomTypeParamsList${idx}`"
        >
          <v-text-field
            v-model="roomTypeInfoParams[item.key]"
            :label="item.label"
            clearable
            :rules="item.require ? nameRules : []"
            :required="item.require"
          ></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex text-xs-right>
          <v-btn flat @click="methodCancelUpdateRoomTypeInfo">取消</v-btn>
          <v-btn flat @click="methodFormReset">重置</v-btn>
          <v-btn color="primary" @click="methodProcessParams">
            <v-icon>mdi-check</v-icon>更新房型資訊
          </v-btn>
        </v-flex>
      </v-layout>
    </v-form>
  </div>
</template>
<script>
import httpMethod from '@/utils/httpMethod';
import constList from '@/utils/const';

export default {
  name: 'updateRoomType',
  props: ['contentData', 'openDialog'],
  data() {
    return {
      constList,
      valid: false,
      roomTypeInfoParams: this.getParamsOrigin(),
      roomTypeParamsList: [
        { label: '房型名稱', key: 'name', require: true },
        { label: '淡季平日單價', key: 'lowNormalPriceShow', require: true },
        { label: '淡季假日單價', key: 'lowHolidayPriceShow', require: true },
        { label: '旺季平日單價', key: 'peakNormalPriceShow', require: true },
        { label: '旺季假日單價', key: 'peakHolidayPriceShow', require: true },
        { label: '房型介紹', key: 'intro', require: false },
        { label: '住房須知', key: 'regulation', require: false },
        { label: '退訂政策', key: 'refund', require: false },
      ],
      nameRules: [
        v => !!v || '此欄位為必填',
      ],
    };
  },
  watch: {
    openDialog(val) {
      if (val) this.formatProps(this.contentData);
    },
  },
  mounted() {
    this.formatProps(this.contentData);
  },
  methods: {
    getParamsOrigin() {
      return {
        name: null,
        lowNormalPriceShow: null,
        lowHolidayPriceShow: null,
        peakNormalPriceShow: null,
        peakHolidayPriceShow: null,
        intro: null,
        regulation: null,
        refund: null,
      };
    },
    formatProps(rowData) {
      const {
        roomName,
        price,
        intro,
        regulation,
        refund,
      } = rowData;
      const {
        lowSeasonWeekday: lowNormalPrice,
        lowSeasonWeekend: lowHolidayPrice,
        peakSeasonWeekday: peakNormalPrice,
        peakSeasonWeekend: peakHolidayPrice,
      } = price;
      this.roomTypeInfoParams.name = roomName;
      this.roomTypeInfoParams.lowNormalPriceShow = (Number(lowNormalPrice) || 0) / 100;
      this.roomTypeInfoParams.lowHolidayPriceShow = (Number(lowHolidayPrice) || 0) / 100;
      this.roomTypeInfoParams.peakNormalPriceShow = (Number(peakNormalPrice) || 0) / 100;
      this.roomTypeInfoParams.peakHolidayPriceShow = (Number(peakHolidayPrice) || 0) / 100;
      this.roomTypeInfoParams.intro = intro;
      this.roomTypeInfoParams.regulation = regulation;
      this.roomTypeInfoParams.refund = refund;
    },
    methodFormReset() {
      this.roomTypeInfoParams = this.getParamsOrigin();
      this.$refs.form.resetValidation();
    },
    methodProcessParams() {
      const params = {};
      const { roomCid: cid } = this.contentData;
      const {
        name,
        lowNormalPriceShow,
        lowHolidayPriceShow,
        peakNormalPriceShow,
        peakHolidayPriceShow,
      } = this.roomTypeInfoParams;
      params.cid = cid;
      params.name = name;
      params.lowNormalPrice = lowNormalPriceShow * 100;
      params.lowHolidayPrice = lowHolidayPriceShow * 100;
      params.peakNormalPrice = peakNormalPriceShow * 100;
      params.peakHolidayPrice = peakHolidayPriceShow * 100;
      this.updateRoomTypeInfo(params);
    },
    async updateRoomTypeInfo(params) {
      if (this.$refs.form.validate()) {
        const res = await httpMethod({
          url: '/v1/api/room/update',
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
          this.methodCancelUpdateRoomTypeInfo();
          this.$emit('execOtherMethod');
        } else {
          alert = {
            open: true,
            text: res.msg || '新增失敗，請重新再試，或聯絡客服人員',
            color: 'error',
          };
        }
        this.$store.commit('global/setNotifySetting', alert);
      }
    },
    methodCancelUpdateRoomTypeInfo() {
      this.methodFormReset();
      this.$emit('closeDialog');
    },
  },
};
</script>
