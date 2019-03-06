<template>
  <div class="update-order">
    <v-form v-model="valid" ref="form" lazy-validation>
      <v-layout row wrap>
        <v-flex
          sm12
          px-2
          v-for="(item, idx) in orderPersonInfoList"
          :key="`orderPersonInfoList${idx}`"
          :class="item.class"
        >
          <v-text-field
            v-if="item.type === 'input'"
            v-model="orderParams[item.model]"
            :label="item.label"
            clearable
            :rules="ruleList[item.rules]"
            :required="item.required"
            :class="item.required ? 'require-start': ''"
          ></v-text-field>
          <v-radio-group
            v-if="item.type === 'radio'"
            v-model="orderParams[item.model]"
            :rules="ruleList[item.rules]"
            :required="item.required"
            :class="item.required ? 'require-start': ''"
            row
          >
            <p class="form__label">{{item.label}}</p>
            <v-radio
              v-for="(option,idx) in item.options"
              :key="`options${idx}`"
              :label="option.label"
              :value="option.value"
              color="primary"
            ></v-radio>
          </v-radio-group>
          <v-radio-group
            v-if="item.type === 'radioOther'"
            v-model="orderParams[item.model]"
            :rules="ruleList[item.rules]"
            :required="item.required"
            :class="item.required ? 'require-start': ''"
            row
            class="form__radio-other-group"
          >
            <p class="form__label">{{item.label}}</p>
            <v-radio
              v-for="(option,idx) in item.options"
              :key="`radioOptions${idx}`"
              :label="option.label"
              :value="option.value"
              color="primary"
            ></v-radio>
            <v-text-field
              v-model="orderParams[item.otherModel]"
              class="form__radio-other-group--other-input"
              placeholder="請依照護照上填寫"
              :disabled="orderParams[item.model] !== 2"
              :required="orderParams[item.model] === 2"
              :rules="orderParams[item.model] === 2 ? ruleList.require : []"
              clearable
            ></v-text-field>
          </v-radio-group>
          <div
            v-if="item.type === 'checkboxOther'"
            class="form__checkbox-other-group"
          >
            <p class="form__label">{{item.label}}</p>
            <v-checkbox
              v-for="(option, idx) in item.options"
              :key="`checkboxOptions${idx}`"
              v-model="orderParams[item.model]"
              :label="option.label"
              :value="option.value"
              color="primary"
            ></v-checkbox>
            <v-text-field
              v-model="orderParams[item.otherModel]"
              class="form__checkbox-other-group--other-input"
              placeholder="請輸入其他需求"
              :disabled="orderParams[item.model] && !orderParams[item.model].find(i => i === 2)"
              clearable
            ></v-text-field>
          </div>
          <v-menu
            v-if="item.type === 'timepicker'"
            ref="menu"
            v-model="item.menuModel"
            :close-on-content-click="false"
            :return-value.sync="orderParams[item.model]"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{on}">
              <v-text-field
                v-model="orderParams[item.model]"
                :label="item.label"
                prepend-icon="mdi-clock-outline"
                clearable
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-time-picker
              v-if="item.menuModel"
              v-model="orderParams[item.model]"
              full-width
              @click:minute="$refs.menu[0].save(orderParams[item.model])"
              color="primary"
              format="24hr"
            ></v-time-picker>
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
      orderPersonInfoList: [
        {
          type: 'input',
          model: 'nameShow',
          label: '聯絡姓名',
          required: true,
          rules: 'require',
          class: 'md6',
        },
        {
          type: 'radio',
          model: 'genderShow',
          label: '客戶性別',
          required: true,
          rules: 'require',
          class: 'md6',
          options: [
            { label: '男', value: '男' },
            { label: '女', value: '女' },
          ],
        },
        {
          type: 'input',
          model: 'phoneShow',
          label: '聯絡電話',
          required: true,
          rules: 'phone',
          class: 'md6',
        },
        {
          type: 'input',
          model: 'emailShow',
          label: '電子郵件',
          required: true,
          rules: 'email',
          class: 'md6',
        },
        {
          type: 'radioOther',
          model: 'nationalityOptionShow',
          otherModel: 'nationalityTextShow',
          label: '國籍',
          required: true,
          rules: 'require',
          class: 'md6',
          options: [
            { label: '本國', value: 1 },
            { label: '其他', value: 2 },
          ],
        },
        {
          type: 'radio',
          model: 'breakfastShow',
          label: '早餐',
          required: true,
          rules: 'require',
          class: 'md6',
          options: [
            { label: '正常', value: '正常' },
            { label: '素食', value: '素食' },
            { label: '不食用（不用不退費請知悉）', value: '不食用' },
          ],
        },
        {
          type: 'input',
          model: 'numberAdultShow',
          label: '成人人數',
          required: true,
          rules: 'requireNumber',
          class: 'md2',
        },
        {
          type: 'input',
          model: 'numberChildShow',
          label: '小孩人數',
          required: false,
          rules: 'number',
          class: 'md2',
        },
        {
          type: 'timepicker',
          model: 'arriveTimeShow',
          menuModel: false,
          label: '預計抵達時間',
          required: false,
          rules: 'none',
          class: 'md6 offset-md2',
        },
        {
          type: 'checkboxOther',
          model: 'demandOptionShow',
          otherModel: 'demandTextShow',
          label: '其他需求',
          required: false,
          rules: 'none',
          class: 'md10',
          options: [
            { label: '無', value: '無' },
            { label: '租機車', value: '租機車' },
            { label: '租轎車', value: '租轎車' },
            { label: '租船出海', value: '租船出海' },
            { label: '其他', value: 2 },
          ],
        },
        {
          type: 'input',
          model: 'noteShow',
          label: '備註',
          required: false,
          rules: 'none',
          class: 'md12',
        },
      ],
      ruleList: {
        require: [
          v => !!v || '此欄位為必填',
        ],
        requireNumber: [
          (v) => {
            if (!v) return '此欄位為必填';
            const reg = /^(\d+\.\d\d|\d+)$/;
            return reg.test(v) || '請輸入正確數字';
          },
        ],
        number: [
          (v) => {
            const reg = /^(\d+\.\d\d|\d+)$/;
            return reg.test(v) || '請輸入正確數字';
          },
        ],
        phone: [
          (v) => {
            if (!v) return '此欄位為必填';
            const reg = /^(\d+\.\d\d|\d+)$/;
            return reg.test(v) || '請輸入電話號碼，不用任何符號';
          },
        ],
        email: [
          (v) => {
            if (!v) return '此欄位為必填';
            const reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
            return reg.test(v) || '請輸入正確的Email格式';
          },
        ],
        none: [],
      },
      demandListArr: ['無', '租機車', '租轎車', '租船出海'],
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
        nameShow: null,
        genderShow: null,
        phoneShow: null,
        emailShow: null,
        nationalityOptionShow: null,
        nationalityTextShow: null,
        breakfastShow: null,
        numberAdultShow: 0,
        numberChildShow: 0,
        arriveTimeShow: null,
        demandOptionShow: [],
        demandTextShow: null,
        noteShow: null,
      };
    },
    formatProps(rowData) {
      const {
        _id,
        name,
        gender,
        phone,
        email,
        nationality,
        breakfast,
        numberAdult,
        numberChild,
        arriveTime,
        demand,
        note,
      } = rowData;
      this.orderParams.cid = _id;
      this.orderParams.nameShow = name;
      this.orderParams.genderShow = gender;
      this.orderParams.phoneShow = phone;
      this.orderParams.emailShow = email;
      this.orderParams.nationalityOptionShow = nationality === '本國' ? 1 : 2;
      this.orderParams.nationalityTextShow = nationality === '本國' ? null : nationality;
      this.orderParams.breakfastShow = breakfast;
      this.orderParams.numberAdultShow = numberAdult;
      this.orderParams.numberChildShow = numberChild;
      this.orderParams.arriveTimeShow = arriveTime;
      const demandList = demand.split(/,/g);
      let haveOtherDemand = false;
      demandList.forEach((demandText) => {
        if (this.demandListArr && this.demandListArr.findIndex(txt => txt === demandText) === -1) haveOtherDemand = true;
      });
      this.orderParams.demandOptionShow = haveOtherDemand
        ? [...demandList.slice(0, -1), 2]
        : demandList;
      this.orderParams.demandTextShow = haveOtherDemand
        ? demandList.slice(-1).toString()
        : null;
      this.orderParams.noteShow = note;
    },
    methodFormReset() {
      this.orderParams = this.getParamsOrigin();
      this.$refs.form.resetValidation();
    },
    methodProcessParams() {
      const {
        cid,
        nameShow,
        genderShow,
        phoneShow,
        emailShow,
        nationalityOptionShow,
        nationalityTextShow,
        breakfastShow,
        numberAdultShow,
        numberChildShow,
        arriveTimeShow,
        demandOptionShow,
        demandTextShow,
        noteShow,
      } = this.orderParams;
      // const params = {};
      const params = {
        cid,
        name: nameShow,
        gender: genderShow,
        phone: phoneShow,
        email: emailShow,
        nationality: nationalityOptionShow === 1 ? '本國' : nationalityTextShow,
        breakfast: breakfastShow,
        numberAdult: numberAdultShow,
        numberChild: numberChildShow,
        arriveTime: arriveTimeShow,
        demand: demandOptionShow && demandOptionShow.find(i => i === 2)
          ? [...demandOptionShow.filter(i => i !== 2), demandTextShow]
          : demandOptionShow,
        note: noteShow,
      };
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
