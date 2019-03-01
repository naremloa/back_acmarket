<template>
  <div class="add-cash">
    <v-form v-model="valid" ref="form" class="px-2" lazy-validation>
      <v-layout row wrap>
        <v-flex sm12>
          <v-btn-toggle v-model="selectedType">
            <v-btn flat large class="px-4">收入</v-btn>
            <v-btn flat large class="px-4">支出</v-btn>
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
          <v-btn flat @click="methodCancelAddCash">取消</v-btn>
          <v-btn flat @click="methodFormReset">重置</v-btn>
          <v-btn color="primary" @click="methodProcessParams">
            <v-icon>mdi-check</v-icon>新增訂單
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
  name: 'addCash',
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
  methods: {
    getParamsOrigin() {
      return {
        type: null,
        certificateNumberShow: null,
        contentShow: null,
        incomeShow: null,
        outcomeShow: null,
      };
    },
    methodFormReset() {
      this.cashParams = this.getParamsOrigin();
      this.$refs.form.resetValidation();
    },
    methodProcessParams() {
      const {
        type,
        certificateNumberShow,
        contentShow,
        incomeShow,
        outcomeShow,
      } = this.cashParams;
      const params = {};
      if (type) params.type = type;
      if (certificateNumberShow) params.certificateNumber = certificateNumberShow;
      if (contentShow) params.content = contentShow;
      params.income = incomeShow ? incomeShow * 100 : 0;
      params.outcome = outcomeShow ? outcomeShow * 100 : 0;
      this.addCash(params);
    },
    async addCash(params) {
      if (this.$refs.form.validate()) {
        const res = await httpMethod({
          url: '/v1/api/cash/add',
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
        } else {
          alert = {
            open: true,
            text: res.msg || '新增失敗，請重新再試，或聯絡客服人員',
            color: 'error',
          };
        }
        this.$store.commit('global/setNotifySetting', alert);
        // this.orderList = res.data;
        this.methodCancelAddCash();
        this.$emit('execOtherMethod');
      }
    },
    methodCancelAddCash() {
      this.methodFormReset();
      this.$emit('closeDialog');
    },
  },
};
</script>
