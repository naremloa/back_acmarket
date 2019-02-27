<template>
  <div class="update-occ">
    <v-form v-model="valid" ref="form" class="px-2" lazy-validation>
      <v-layout row wrap>
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
      </v-layout>
      <v-layout>
        <v-flex text-xs-right>
          <v-btn flat @click="methodCancelUpdateOcc">取消</v-btn>
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
  name: 'updateOcc',
  props: ['contentData', 'openDialog'],
  data() {
    return {
      constList,
      valid: false,
      occInfoParams: this.getParamsOrigin(),
      occParamsList: [
        { label: '房型名稱', key: 'name', require: true },
        { label: '房型價格', key: 'priceShow', require: true },
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
    console.log('TCL: mounted -> this.contentData', this.contentData);
    this.formatProps(this.contentData);
  },
  methods: {
    getParamsOrigin() {
      return {
        name: null,
        priceShow: null,
        intro: null,
        regulation: null,
        refund: null,
      };
    },
    formatProps(rowData) {
      console.log('TCL: formatProps -> rowData', rowData);
      const {
        roomName,
        price,
        intro,
        regulation,
        refund,
      } = rowData;
      this.occInfoParams.name = roomName;
      this.occInfoParams.priceShow = (Number(price) || 0) / 100;
      this.occInfoParams.intro = intro;
      this.occInfoParams.regulation = regulation;
      this.occInfoParams.refund = refund;
    },
    methodFormReset() {
      this.occInfoParams = this.getParamsOrigin();
      this.$refs.form.resetValidation();
    },
    methodProcessParams() {
      const params = {};
      const { roomCid: cid } = this.contentData;
      const { name, priceShow } = this.occInfoParams;
      params.cid = cid;
      params.name = name;
      params.price = priceShow * 100;
      this.updateOcc(params);
    },
    async updateOcc(params) {
      if (this.$refs.form.validate()) {
        const res = await httpMethod({
          url: '/v1/api/occ/update/subRoomCid',
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
          this.methodCancelUpdateOcc();
          this.$emit('execOtherMethod');
        } else {
          alert = {
            open: true,
            text: res.msg || '新增失敗，請重新再弒，或聯絡客服人員',
            color: 'error',
          };
        }
        this.$store.commit('global/setNotifySetting', alert);
      }
    },
    methodCancelUpdateOcc() {
      this.methodFormReset();
      this.$emit('closeDialog');
    },
  },
};
</script>
