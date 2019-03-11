<template>
  <div class="update-activity">
    <v-form v-model="valid" ref="form" class="px-2" lazy-validation>
      <v-layout row wrap>
        <v-flex
          sm12
          md4
          lg3
          px-1
          v-for="(item, idx) in activityItemParams1"
          :key="`activityItemParams1${idx}`"
        >
          <v-text-field
            v-model="activityParams[item.key]"
            :label="item.label"
            clearable
            :rules="item.require ? nameRules : []"
            :required="item.require"
          ></v-text-field>
        </v-flex>
        <v-flex
          sm12
          md4
          lg3
          px-1
          v-for="(item, idx) in activityTimeParams"
          :key="`activityTimeParams${idx}`"
        >
          <v-menu
            :ref="`menu${idx}`"
            :close-on-content-click="false"
            v-model="selectMenu[idx]"
            :nudge-right="40"
            :value="activityParams[item.key]"
            lazy
            transition="scale-transition"
            offset-y
            full-width
          >
            <v-text-field
              slot="activator"
              v-model="activityParams[item.key]"
              :label="item.label"
              clearable
              prepend-icon="mdi-calendar"
              readonly
              :rules="nameRules"
              required
            ></v-text-field>
            <v-date-picker
              v-model="activityParams[item.key]"
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
                @click="$refs[`menu${idx}`][0].save(activityParams[item.key])"
              >OK</v-btn>
              </v-date-picker>
            </v-menu>
          </v-flex>
        <v-flex
          sm12
          md4
          lg3
          px-1
          v-for="(item, idx) in numberParams"
          :key="`numberParams${idx}`"
        >
          <v-text-field
            type="number"
            min="0"
            v-model="activityParams[item.key]"
            :label="item.label"
            clearable
            :rules="nameRules"
            required
          ></v-text-field>
        </v-flex>
        </v-layout>
        <v-layout>
        <v-flex text-xs-right>
          <v-btn flat @click="methodCancelUpdateActivity">取消</v-btn>
          <v-btn flat @click="methodFormReset">重置</v-btn>
          <v-btn color="primary" @click="methodProcessParams">
            <v-icon>mdi-check</v-icon>修改活動
          </v-btn>
        </v-flex>
      </v-layout>
    </v-form>
  </div>
</template>
<script>
import httpMethod from '@/utils/httpMethod';
import { getDate } from '@/utils/formatMethod';

export default {
  name: 'updateActivity',
  props: ['contentData', 'openDialog'],
  data() {
    return {
      valid: false,
      activityParams: this.getParamsOrigin(),
      activityItemParams1: [
        { label: '活動名稱', key: 'nameShow', require: true },
      ],
      activityTimeParams: [
        { label: '開始時間', key: 'startTimeShow' },
        { label: '結束時間', key: 'endTimeShow' },
      ],
      numberParams: [
        { label: '房型活動價基數', key: 'roomActivityPriceShow' },
        { label: '倍率', key: 'magShow' },
        { label: '活動額外價格', key: 'activityPriceShow' },
        { label: '活動有效天數', key: 'remainDayShow' },
      ],
      selectMenu: [false, false, false, false, false, false, false, false],
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
    console.log('TCL: mounted -> this.contentData', this.contentData);
    this.formatProps(this.contentData);
  },
  methods: {
    getDate,
    getParamsOrigin() {
      return {
        cid: null,
        nameShow: null,
        startTimeShow: null,
        endTimeShow: null,
        roomActivityPriceShow: null,
        magShow: null,
        activityPriceShow: null,
        remainDayShow: null,
      };
    },
    formatProps(rowData) {
      console.log('TCL: formatProps -> rowData', rowData);
      const {
        _id,
        name,
        startTime,
        endTime,
        roomActivityPrice,
        mag,
        activityPrice,
        remainDay,
      } = rowData;
      this.activityParams.cid = _id;
      this.activityParams.nameShow = name;
      this.activityParams.startTimeShow = startTime.toString().length !== 13
        ? ''
        : this.getDate(startTime, 'fullDate');
      this.activityParams.endTimeShow = startTime.toString().length !== 13
        ? ''
        : this.getDate(endTime, 'fullDate');
      this.activityParams.roomActivityPriceShow = (Number(roomActivityPrice) || 0) / 100;
      this.activityParams.magShow = mag;
      this.activityParams.activityPriceShow = (Number(activityPrice) || 0) / 100;
      this.activityParams.remainDayShow = remainDay;
    },
    methodFormReset() {
      this.activityParams = this.getParamsOrigin();
      this.$refs.form.resetValidation();
    },
    methodProcessParams() {
      if (this.$refs.form.validate()) {
        const {
          cid,
          nameShow,
          startTimeShow,
          endTimeShow,
          roomActivityPriceShow,
          magShow,
          activityPriceShow,
          remainDayShow,
        } = this.activityParams;
        const params = {};
        if (cid) params.cid = cid;
        if (nameShow) params.name = nameShow;
        if (startTimeShow) params.startTime = new Date(startTimeShow).valueOf();
        if (endTimeShow) params.endTime = new Date(endTimeShow).valueOf();
        if (roomActivityPriceShow) params.roomActivityPrice = roomActivityPriceShow * 100;
        if (magShow) params.mag = magShow;
        if (activityPriceShow) params.activityPrice = activityPriceShow * 100;
        if (remainDayShow) params.remainDay = remainDayShow;
        this.updateActivity(params);
      }
    },
    async updateActivity(params) {
      const res = await httpMethod({
        url: '/v1/api/activity/update',
        method: 'POST',
        data: params,
      });
      console.log(res);
      let alert = null;
      if (!res.code) {
        alert = {
          open: true,
          text: `${res.msg}`,
          color: 'success',
        };
      } else {
        alert = {
          open: true,
          text: res.msg || '修改失敗，請重新再試，或聯絡客服人員',
          color: 'error',
        };
      }
      this.$store.commit('global/setNotifySetting', alert);
      // this.orderList = res.data;
      this.methodCancelUpdateActivity();
      this.$emit('execOtherMethod');
    },
    methodCancelUpdateActivity() {
      this.methodFormReset();
      this.$emit('closeDialog');
    },
  },
};
</script>
