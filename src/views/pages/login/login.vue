<template>
  <v-layout class="login" fill-height align-center row>
    <v-flex lg4 md6 sm12  offset-md3 offset-lg4>
      <v-card :class="$vuetify.breakpoint.smAndUp ? 'pa-4' : null">
        <v-card-title primary-title class="text-md-center login-title">
          <div>
            <h3 class="headline mb-2 text-xs-center">{{pageType[type].text}}</h3>
            <div>Located two hours south of Sydney in the
              <br>Southern Highlands of New South Wales, ...</div>
          </div>
        </v-card-title>
        <v-card-actions>
          <v-form v-model="valid" ref="loginForm">
            <v-container>
              <v-layout column>
                <v-flex xs12 md4 >
                  <v-text-field
                    v-model="account"
                    :rules="nameRules('account')"
                    label="帳號"
                    required />
                </v-flex>
                <v-flex xs12 md4 >
                  <v-text-field
                    type="password"
                    v-model="password"
                    :rules="nameRules('password')"
                    label="密碼"
                    required />
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex xs12 sm8 >
                  <v-text-field
                    v-model="code"
                    :rules="nameRules('code')"
                    label="驗證碼"
                    required />
                </v-flex>
                <v-flex xs12 sm4 >
                  <div v-html="codeSvg" @click="getCode"></div>
                </v-flex>
              </v-layout>
            </v-container>
            <v-btn @click="handleLogin">登入</v-btn>
            <v-btn @click="resetForm" flat>重置</v-btn>
            <v-btn @click="handleRegister">註冊</v-btn>
          </v-form>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import httpMethod from '@/utils/httpMethod';
import { setCookie } from '@/utils/cookie';

export default {
  data() {
    return {
      valid: false,
      pageType: {
        1: { text: '系統登入', action: 'login' },
        2: { text: '註冊帳號', action: 'register' },
      },
      type: 1,
      account: '',
      password: '',
      code: '',
      codeSvg: '',
    };
  },
  mounted() {
    this.getCode();
  },
  methods: {
    nameRules(str) {
      return [
        v => !!v || `${str} is required`,
        v => (v && v.length <= 10) || `${str} must be less than 10 characters`,
      ];
    },
    togglePageType() { this.type = { 1: 2, 2: 1 }[this.type]; },
    checkPageType(action) {
      if (this.pageType[this.type].action !== action) {
        this.togglePageType();
        return false;
      }
      return true;
    },
    appendIconCallback() {},
    prependIconCallback() {},
    async handleLogin() {
      if (!this.checkPageType('login')) return;
      const { account, password, code } = this;
      const params = { account, password, code };
      const res = await httpMethod({
        url: '/v1/api/login/testLogin',
        method: 'POST',
        data: params,
      });
      console.log('​handleLogin -> res', res);
      if (!res.code) {
        const alert = {
          open: true,
          text: `${res.msg}`,
          color: 'green darken-3',
        };
        this.$store.commit('global/setNotifySetting', alert);
        setCookie('loginStatus', res.data.loginStatus);
        this.$router.push('/');
      } else {
        const alert = {
          open: true,
          text: res.msg || '登入失敗，請重新再弒，或聯絡客服人員',
          color: 'red darken-3',
        };
        this.$store.commit('global/setNotifySetting', alert);
        this.getCode();
      }
    },
    async handleRegister() {
      if (!this.checkPageType('register')) return;
      const { account, password, code } = this;
      const params = { account, password, code };
      const res = await httpMethod({
        url: '/v1/api/login/register',
        method: 'POST',
        data: params,
      });
      console.log('​handleRegister -> res', res);
      if (!res.code) {
        const alert = {
          open: true,
          text: `${res.msg}\n請以新帳號登入`,
          color: 'green darken-3',
        };
        this.$store.commit('global/setNotifySetting', alert);
        this.resetForm();
        this.checkPageType('login');
      } else {
        const alert = {
          open: true,
          text: res.msg || '創建失敗',
          color: 'red darken-3',
        };
        this.$store.commit('global/setNotifySetting', alert);
      }
      this.getCode();
    },
    async getCode() {
      const res = await httpMethod({
        url: '/v1/api/login/code',
        method: 'GET',
      });
      this.codeSvg = res.data.code;
    },
    resetForm() {
      this.$refs.loginForm.reset();
    },
  },
};
</script>
