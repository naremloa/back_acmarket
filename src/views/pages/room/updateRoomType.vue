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
        intro: null,
        regulation: null,
        refund: null,
      };
    },
    formatProps(rowData) {
      console.log('TCL: formatProps -> rowData', rowData);
      const {
        roomName,
        intro,
        regulation,
        refund,
      } = rowData;
      this.roomTypeInfoParams.name = roomName;
      this.roomTypeInfoParams.intro = intro;
      this.roomTypeInfoParams.regulation = regulation;
      this.roomTypeInfoParams.refund = refund;
    },
    methodFormReset() {
      this.roomTypeInfoParams = this.getParamsOrigin();
      this.$refs.form.resetValidation();
    },
    methodProcessParams() {
      const { roomCid: cid } = this.contentData;
      this.updateRoomTypeInfo({ cid, ...this.roomTypeInfoParams });
    },
    async updateRoomTypeInfo(params) {
      if (this.$refs.form.validate()) {
        const res = await httpMethod({
          url: '/v1/api/room/update',
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
          this.methodCancelUpdateRoomTypeInfo();
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
    methodCancelUpdateRoomTypeInfo() {
      this.methodFormReset();
      this.$emit('closeDialog');
    },
  },
};
</script>
