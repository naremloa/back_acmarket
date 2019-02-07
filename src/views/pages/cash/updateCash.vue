<template>
  <div class="update-cash">
    <v-form v-model="valid" ref="form" class="px-2" lazy-validation>
      <v-layout row wrap>
        <v-flex sm12>
          <v-btn-toggle v-model="selectedType" mandatory>
            <v-btn flat large class="px-4" @click="methodClearNumber">收入</v-btn>
            <v-btn flat large class="px-4" @click="methodClearNumber">支出</v-btn>
          </v-btn-toggle>
        </v-flex>
        <v-flex
          sm12
          md4
          lg3
          px-1
          v-for="(item, idx) in orderItemParams1"
          :key="`orderItemParams1${idx}`"
        >
          <v-text-field
            v-model="cashParams[item.key]"
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
        >
          <v-text-field
            type="number"
            min="0"
            v-model="cashParams[numberParams[selectedType].key]"
            :label="numberParams[selectedType].label"
            clearable
            :rules="nameRules"
            required
          ></v-text-field>
        </v-flex>
        <v-flex sm12 md4 lg3 px-1 >
          <v-select
            v-model="cashParams.type"
            :items="constList.cashTypeList"
            item-text="value"
            item-value="id"
            label="帳單類型"
            :rules="nameRules"
            required
          ></v-select>
        </v-flex>
      </v-layout>
        <v-layout>
        <v-flex text-xs-right>
          <v-btn flat @click="methodCancelUpdateCash">取消</v-btn>
          <v-btn flat @click="methodFormReset">重置</v-btn>
          <v-btn color="primary" @click="methodProcessParams">
            <v-icon>mdi-check</v-icon>修改收支明細
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
  name: 'updateCash',
  props: ['contentData', 'openDialog'],
  data() {
    return {
      constList,
      selectedType: 0,
      valid: false,
      cashParams: this.getParamsOrigin(),
      orderItemParams1: [
        { label: '憑證號', key: 'certificateNumberShow', require: true },
        { label: '摘要', key: 'contentShow', require: true },
      ],
      numberParams: [
        { label: '入款金額', key: 'incomeShow' },
        { label: '出款金額', key: 'outcomeShow' },
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
    dateTime,
    getParamsOrigin() {
      return {
        cid: null,
        certificateNumber: null,
        contentShow: null,
        incomeShow: null,
        outcomeShow: null,
        type: null,
      };
    },
    formatProps(rowData) {
      const {
        _id,
        certificateNumber,
        content,
        income,
        outcome,
        type,
      } = rowData;
      this.cashParams.cid = _id;
      this.cashParams.certificateNumberShow = certificateNumber;
      this.cashParams.contentShow = content;
      this.cashParams.incomeShow = income ? income / 100 : 0;
      this.cashParams.outcomeShow = outcome ? outcome / 100 : 0;
      this.cashParams.type = type;
      this.selectedType = income ? 0 : 1;
    },
    methodFormReset() {
      this.cashParams = this.getParamsOrigin();
      this.$refs.form.resetValidation();
    },
    methodProcessParams() {
      const {
        cid,
        certificateNumberShow,
        contentShow,
        incomeShow,
        outcomeShow,
        type,
      } = this.cashParams;
      if ((this.selectedType === 0 && !incomeShow)
          || (this.selectedType === 1 && !outcomeShow)) {
        const alert = {
          open: true,
          text: '金額不得為0',
          color: 'error',
        };
        this.$store.commit('global/setNotifySetting', alert);
        return;
      }
      const params = {};
      if (cid) params.cid = cid;
      if (certificateNumberShow) params.certificateNumber = certificateNumberShow;
      if (contentShow) params.content = contentShow;
      params.income = this.selectedType === 0 ? incomeShow * 100 : 0;
      params.outcome = this.selectedType === 1 ? outcomeShow * 100 : 0;
      if (type) params.type = type;

      this.updateOrder(params);
    },
    async updateOrder(params) {
      if (this.$refs.form.validate()) {
        const res = await httpMethod({
          url: '/v1/api/cash/update',
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
            text: res.msg || '修改失敗，請重新再弒，或聯絡客服人員',
            color: 'error',
          };
        }
        this.$store.commit('global/setNotifySetting', alert);
        // this.orderList = res.data;
        this.methodCancelUpdateCash();
        this.$emit('execOtherMethod');
      }
    },
    methodCancelUpdateCash() {
      this.methodFormReset();
      this.$emit('closeDialog');
    },
    methodClearNumber() {
      // this.cashParams.incomeShow = 0;
      // this.cashParams.outcomeShow = 0;
      this.$refs.form.resetValidation();
    },
  },
};
</script>
