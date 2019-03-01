<template>
  <div class="update-status">
    <v-stepper>
      <v-stepper-header>
        <v-stepper-step :complete="status >= 1" :step="1">已下訂</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="status >= 2" :step="2">已付款</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="status >= 3" :step="3">已入住</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="status >= 4" :step="4">已退房</v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content
          v-for="(item,idx) in constList.orderStatusList"
          :key="`orderStatusList${idx}`"
          :step="item.id"
        >
          <v-layout row wrap>
            <v-flex sm12 md4>
              <v-btn v-if="status < 3" color="error" flat  @click="updateStatus(5)">取消訂單</v-btn>
            </v-flex>
            <v-flex sm12 md8 class="text-sm-right">
              <!-- <v-btn
                v-if="status > 1"
                @click="updateStatus(status - 1)"
              >回復狀態</v-btn> -->
              <v-btn
                v-if="status < 4"
                color="primary"
                @click="updateStatus(status + 1)"
              >更新狀態</v-btn>
              <div v-else>已完成此項訂單</div>
            </v-flex>
          </v-layout>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
    <v-layout>
      <v-flex class="text-sm-right">
        <v-btn @click="methodCloseDialog">關閉</v-btn>
      </v-flex>
    </v-layout>
  </div>
</template>
<script>
import httpMethod from '@/utils/httpMethod';
import constList from '@/utils/const';

export default {
  name: 'updateStatus',
  props: ['contentData', 'openDialog'],
  data() {
    return {
      constList,
      status: 1,
    };
  },
  watch: {
    openDialog(val) {
      if (val) {
        const { status } = this.contentData;
        this.status = status;
      }
    },
  },
  mounted() {
    console.log('TCL: mounted -> this.status', this.status);
    this.status = this.contentData.status;
  },
  methods: {
    async updateStatus(newStatus) {
      console.log('TCL: updateStatus -> newStatus', newStatus);
      const { _id } = this.contentData;
      const params = {
        cid: _id,
        status: newStatus,
      };
      const res = await httpMethod({
        url: '/v1/api/order/update/status',
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
        this.status = newStatus;
      } else {
        alert = {
          open: true,
          text: res.msg || '更新失敗，請重新再試，或聯絡客服人員',
          color: 'error',
        };
      }
      this.$store.commit('global/setNotifySetting', alert);
      // this.orderList = res.data;
    },
    methodCloseDialog() {
      this.$emit('closeDialog');
      this.$emit('execOtherMethod');
    },
  },
};
</script>
