<template>
  <div class="login">
    <div>here is home</div>
    <div>here is home</div>
    <input type="text" v-model="account" placeholder="Enter your ID">
    <input type="password" v-model="password" placeholder="Enter your password">
    <button @click="login">提交</button>
  </div>
</template>
<script>
import httpMethod from '@/utils/httpMethod';

export default {
  data() {
    return {
      account: '',
      password: '',
    };
  },
  methods: {
    async login() {
      const res = await httpMethod({
        url: '/v1/api/login/getAccount',
      });
    },
  },
};
</script>
