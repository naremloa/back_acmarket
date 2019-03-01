<template>
  <div class="update-order">
    <v-form v-model="valid" ref="form" class="px-2" lazy-validation>
      <v-layout row wrap>
        <v-flex
          sm12
          md4
          lg3
          px-1
          v-for="(item, idx) in orderItemParams1"
          :key="`orderItemParams1${idx}`"
        >
          <v-text-field
            v-model="orderParams[item.key]"
            :label="item.label"
            clearable
            :rules="item.require ? nameRules : []"
            :required="item.require"
          ></v-text-field>
        </v-flex>
        <v-flex sm12 md4 lg3 px-1 >
          <v-select
            v-model="orderParams.roomType"
            :items="constList.roomTypeList"
            item-text="value"
            item-value="id"
            label="訂房房型"
            :rules="nameRules"
            required
          ></v-select>
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
            v-model="orderParams[item.key]"
            :label="item.label"
            clearable
            :rules="nameRules"
            required
          ></v-text-field>
        </v-flex>
        <v-flex
          sm12
          md4
          lg3
          px-1
          v-for="(item, idx) in orderItemParams2"
          :key="`orderItemParams2${idx}`"
        >
          <v-text-field
            v-model="orderParams[item.key]"
            :label="item.label"
            clearable
          ></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex
          sm12
          md4
          lg3
          px-1
          v-for="(item, idx) in orderTimeParams"
          :key="`orderTimeParams${idx}`"
        >
          <v-menu
            :ref="`menu${idx}`"
            :close-on-content-click="false"
            v-model="selectMenu[idx]"
            :nudge-right="40"
            :value="orderParams[item.key]"
            lazy
            transition="scale-transition"
            offset-y
            full-width
          >
            <v-text-field
              slot="activator"
              v-model="orderParams[item.key]"
              :label="item.label"
              clearable
              prepend-icon="mdi-calendar"
              readonly
              :rules="nameRules"
              required
            ></v-text-field>
            <v-date-picker
              v-model="orderParams[item.key]"
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
                @click="$refs[`menu${idx}`][0].save(orderParams[item.key])"
              >OK</v-btn>
            </v-date-picker>
          </v-menu>
        </v-flex>
        </v-layout>
        <v-layout>
        <v-flex text-xs-right>
          <v-btn flat @click="methodCancelUpdateOrder">取消</v-btn>
          <v-btn flat @click="methodFormReset">重置</v-btn>
          <v-btn color="primary" @click="methodProcessParams">
            <v-icon>mdi-check</v-icon>更新訂單資訊
          </v-btn>
        </v-flex>
      </v-layout>
    </v-form>
  </div>
</template>
<script>
import httpMethod from '@/utils/httpMethod';
import constList from '@/utils/const';
import { dateTime } from '@/utils/calculation';

export default {
  name: 'updateOrder',
  props: ['contentData', 'openDialog'],
  data() {
    return {
      constList,
      valid: false,
      orderParams: this.getParamsOrigin(),
      orderItemParams1: [
        { label: '姓名', key: 'nameShow', require: true },
        { label: '電話', key: 'phoneShow', require: true },
        { label: '電子郵件', key: 'emailShow', require: false },
        { label: '國籍', key: 'nationalityShow', require: false },
      ],
      orderTimeParams: [
        { label: '入住時間', key: 'checkInTimeShow' },
        { label: '退房時間', key: 'checkOutTimeShow' },
      ],
      numberParams: [
        { label: '房間單價', key: 'priceShow' },
        { label: '應收總價', key: 'totalPriceShow' },
      ],
      orderItemParams2: [
        { label: '備註', key: 'noteShow' },
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
    this.formatProps(this.contentData);
  },
  methods: {
    dateTime,
    getParamsOrigin() {
      return {
        cid: null,
        roomType: null,
        nameShow: null,
        phoneShow: null,
        emailShow: null,
        nationalityShow: null,
        checkInTimeShow: null,
        checkOutTimeShow: null,
        priceShow: null,
        totalPriceShow: null,
        noteShow: null,
      };
    },
    formatProps(rowData) {
      const {
        _id,
        roomType,
        name,
        phone,
        email,
        nationality,
        price,
        totalPrice,
        note,
        checkInTime,
        checkOutTime,
      } = rowData;
      this.orderParams.cid = _id;
      this.orderParams.roomType = roomType;
      this.orderParams.nameShow = name;
      this.orderParams.phoneShow = phone;
      this.orderParams.emailShow = email;
      this.orderParams.nationalityShow = nationality;
      this.orderParams.priceShow = price / 100;
      this.orderParams.totalPriceShow = totalPrice / 100;
      this.orderParams.noteShow = note;
      this.orderParams.checkInTimeShow = dateTime(checkInTime, true);
      this.orderParams.checkOutTimeShow = dateTime(checkOutTime, true);
    },
    methodFormReset() {
      this.orderParams = this.getParamsOrigin();
      this.$refs.form.resetValidation();
    },
    methodProcessParams() {
      const {
        cid,
        roomType,
        nameShow,
        phoneShow,
        emailShow,
        nationalityShow,
        checkInTimeShow,
        checkOutTimeShow,
        priceShow,
        totalPriceShow,
        noteShow,
      } = this.orderParams;
      const params = {};
      if (cid) params.cid = cid;
      if (roomType) params.roomType = roomType;
      if (nameShow) params.name = nameShow;
      if (phoneShow) params.phone = phoneShow;
      if (emailShow) params.email = emailShow;
      if (nationalityShow) params.nationality = nationalityShow;
      if (priceShow) params.price = priceShow * 100;
      if (totalPriceShow) params.totalPrice = totalPriceShow * 100;
      if (noteShow) params.note = noteShow;
      if (checkInTimeShow) params.checkInTime = new Date(checkInTimeShow).valueOf();
      if (checkOutTimeShow) params.checkOutTime = new Date(checkOutTimeShow).valueOf();
      this.updateOrder(params);
    },
    async updateOrder(params) {
      if (this.$refs.form.validate()) {
        const res = await httpMethod({
          url: '/v1/api/order/update',
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
            text: res.msg || '新增失敗，請重新再試，或聯絡客服人員',
            color: 'error',
          };
        }
        this.$store.commit('global/setNotifySetting', alert);
        // this.orderList = res.data;
        this.methodCancelUpdateOrder();
        this.$emit('execOtherMethod');
      }
    },
    methodCancelUpdateOrder() {
      this.methodFormReset();
      this.$emit('closeDialog');
    },
  },
};
</script>
