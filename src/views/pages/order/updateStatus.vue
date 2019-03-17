<template>
  <div class="update-status">
    <v-stepper>
      <v-stepper-header>
        <template v-if="[1,2,3,4,5].includes(status)">
          <v-stepper-step :complete="status >= 1" :step="1">已下訂</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :complete="status >= 2" :step="2">已付訂金</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :complete="status >= 3" :step="3">已付全額</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :complete="status >= 4" :step="4">已入住</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :complete="status >= 5" :step="5">已退房(結單)</v-stepper-step>
        </template>
        <template v-else-if="[6, 7].includes(status)">
          <v-stepper-step :complete="status >= 6" :step="6">已退訂</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :complete="status >= 7" :step="7">已退金額(結單)</v-stepper-step>
        </template>
        <template v-else-if="status === 8">
          <v-stepper-step :complete="status >= 8" :step="8">無效訂單(結單)</v-stepper-step>
        </template>
      </v-stepper-header>
      <v-stepper-items>
        <v-layout row wrap>
          <v-flex sm12 md4 lg3 px-1 v-if="[1].includes(status)">
            <v-text-field
              v-model="inputField.deposit"
              :label="'確認訂金'"
              clearable
            ></v-text-field>
          </v-flex>
          <v-flex sm12 md4 lg3 px-1 v-if="[2, 3].includes(status)">
            <v-text-field
              v-model="inputField.price"
              :label="'確認全額'"
              clearable
            ></v-text-field>
          </v-flex>
          <v-flex sm12 md4 lg3 px-1 v-if="[6].includes(status)">
            <v-text-field
              v-model="inputField.refund"
              :label="'確認退款'"
              clearable
            ></v-text-field>
          </v-flex>
          <v-layout row wrap justify-end>
            <v-flex sm12 md8 class="text-sm-right">
              <v-btn
                color="primary" @click="updateStatus(status + 1)" >更新狀態</v-btn>
              <v-bottom-sheet inset v-if="![5, 6, 7, 8].includes(status)">
                <template v-slot:activator>
                  <v-btn color="error" flat>退訂</v-btn>
                </template>
                <v-card>
                  <v-layout row wrap>
                    <v-flex sm12 md8>
                      請確認是否要使該訂單進入退訂流程，進入退訂流程後，狀態不能再更改。
                      <v-btn color="error" flat @click="updateStatus(6)">確認</v-btn>
                    </v-flex>
                  </v-layout>
                </v-card>
              </v-bottom-sheet>
              <v-btn
                color="error" flat @click="updateStatus(8)">無效訂單</v-btn>
            </v-flex>
          </v-layout>
        </v-layout>
      </v-stepper-items>
    </v-stepper>
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
      inputField: {
        deposit: 0,
        price: 0,
        refund: 0,
      },
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
    this.status = this.contentData.status;
  },
  methods: {
    async updateStatus(newStatus) {
      const { _id } = this.contentData;
      const { deposit, price, refund } = this.inputField;
      const params = {
        cid: _id,
        status: newStatus,
        deposit: deposit * 100,
        price: deposit * 100,
        refund: deposit * 100,
      };
      const res = await httpMethod({
        url: '/v1/api/order/update/status',
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
