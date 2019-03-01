<template>
  <div class="add-sub-room">
    <v-form v-model="valid" ref="form" class="px-2" lazy-validation>
      <v-layout row wrap>
        <!-- <v-flex sm12 md4 lg3 px-1 >
          <v-select
            v-model="subRoomParams.roomId"
            :items="constList.roomTypeList"
            item-text="value"
            item-value="id"
            label="房型"
            :rules="nameRules"
            required
          ></v-select>
        </v-flex> -->
        <v-flex
          sm12
          md6
          px-1
          v-for="(item, idx) in subRoomItemParams"
          :key="`subRoomItemParams${idx}`"
        >
          <v-text-field
            v-model="subRoomParams[item.key]"
            :label="item.label"
            clearable
            :rules="item.require ? nameRules : []"
            :required="item.require"
          ></v-text-field>
        </v-flex>
        <!-- <v-flex
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
            v-model="subRoomParams[item.key]"
            :label="item.label"
            clearable
            :rules="nameRules"
            required
          ></v-text-field>
        </v-flex> -->
        <!-- <v-flex
          sm12
          md4
          lg3
          px-1
          v-for="(item, idx) in repairItemParams2"
          :key="`repairItemParams2${idx}`"
        >
          <v-text-field
            v-model="subRoomParams[item.key]"
            :label="item.label"
            clearable
          ></v-text-field>
        </v-flex> -->
      </v-layout>
      <v-layout>
        <v-flex text-xs-right>
          <v-btn flat @click="methodCancelAddSubRoom">取消</v-btn>
          <v-btn flat @click="methodFormReset">重置</v-btn>
          <v-btn color="primary" @click="methodProcessParams">
            <v-icon>mdi-check</v-icon>新增房間
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
  name: 'addSubRoom',
  props: ['contentData'],
  data() {
    return {
      constList,
      valid: false,
      subRoomParams: this.getParamsOrigin(),
      subRoomItemParams: [
        { label: '房間名稱', key: 'nameShow', require: true },
        // { label: '照片列表1', key: 'picList1', require: false },
        // { label: '照片列表2', key: 'picList2', require: false },
        // { label: '照片列表3', key: 'picList3', require: false },
      ],
      nameRules: [
        v => !!v || '此欄位為必填',
      ],
    };
  },
  // watch: {
  //   openDialog(val) {
  //     if (val) this.formatProps(this.contentData);
  //   },
  // },
  methods: {
    getParamsOrigin() {
      return {
        nameShow: null,
        // picList1: null,
        // picList2: null,
        // picList3: null,
      };
    },
    methodFormReset() {
      this.subRoomParams = this.getParamsOrigin();
      this.$refs.form.resetValidation();
    },
    methodProcessParams() {
      const {
        nameShow,
        // picList1,
        // picList2,
        // picList3,
      } = this.subRoomParams;
      const params = {};
      params.cid = this.contentData.roomCid;
      params.name = nameShow;
      // params.picList = [];
      // if (picList1) params.picList.push(picList1);
      // if (picList2) params.picList.push(picList2);
      // if (picList3) params.picList.push(picList3);
      this.addSubRoom(params);
    },
    async addSubRoom(params) {
      if (this.$refs.form.validate()) {
        const res = await httpMethod({
          url: '/v1/api/room/subRoom/add',
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
          this.methodCancelAddSubRoom();
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
    methodCancelAddSubRoom() {
      this.methodFormReset();
      this.$emit('closeDialog');
    },
  },
};
</script>
