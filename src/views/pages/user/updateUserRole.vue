<template>
  <div class="update-user-role">
    <v-form v-model="valid" ref="form" class="px-2" lazy-validation>
      <v-layout row wrap>
        <v-flex sm12>
          <v-select
            v-model="userRoleParams.role"
            :items="roleList"
            item-text="value"
            item-value="id"
            label="使用者角色"
            :rules="nameRules"
            required
          ></v-select>
        </v-flex>
      </v-layout>
        <v-layout>
        <v-flex text-xs-right>
          <v-btn flat @click="methodCancelUpdateOrder">取消</v-btn>
          <v-btn flat @click="methodFormReset">重置</v-btn>
          <v-btn color="primary" @click="methodProcessParams">
            <v-icon>mdi-check</v-icon>更新使用者角色
          </v-btn>
        </v-flex>
      </v-layout>
    </v-form>
  </div>
</template>
<script>
import httpMethod from '@/utils/httpMethod';

export default {
  name: 'updateUserRole',
  props: ['contentData', 'openDialog'],
  data() {
    return {
      valid: false,
      roleList: [],
      userRoleParams: this.getParamsOrigin(),
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
    this.getRoleList();
    this.formatProps(this.contentData);
  },
  methods: {
    async getRoleList() {
      const res = await httpMethod({
        url: '/v1/api/user/role/list',
        method: 'GET',
      });
      if (!res.code) {
        this.roleList = res.data;
      } else {
        const alert = {
          open: true,
          text: res.msg || '取得帳號列表錯誤',
          color: 'error',
        };
        this.$store.commit('global/setNotifySetting', alert);
      }
    },
    getParamsOrigin() {
      return {
        id: null,
        role: null,
      };
    },
    formatProps(rowData) {
      console.log('TCL: formatProps -> rowData', rowData);
      if (rowData) {
        const {
          accountId,
          role,
        } = rowData;
        this.userRoleParams.id = accountId;
        this.userRoleParams.role = role && role.id;
        console.log('TCL: formatProps -> this.userRoleParams', this.userRoleParams);
      }
    },
    methodFormReset() {
      this.userRoleParams = this.getParamsOrigin();
      this.$refs.form.resetValidation();
    },
    methodProcessParams() {
      const {
        id,
        role,
      } = this.userRoleParams;
      const params = {};
      if (id) params.cid = id;
      if (role) params.role = role;
      this.updateUserRole(params);
    },
    async updateUserRole(params) {
      if (this.$refs.form.validate()) {
        const res = await httpMethod({
          url: '/v1/api/user/udpate/role',
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
            text: res.msg || '修改失敗，請重新再試，或聯絡客服人員',
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
