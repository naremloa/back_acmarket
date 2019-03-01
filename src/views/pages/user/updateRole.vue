<template>
  <div class="update-role">
    <v-form v-model="valid" ref="form" class="px-2" lazy-validation>
      <v-layout row wrap>
        <v-flex sm12>
          <p>角色名稱：{{roleParams.name}}</p>
          <!-- <v-text-field
            v-model="roleParams.name"
            label="角色名稱"
            clearable
            :rules="nameRules"
          ></v-text-field> -->
        </v-flex>
        <v-flex sm12 >
          <div class="title pb-3">請勾選此角色可檢視的頁面。</div>
          <v-treeview
            v-model="roleParams.routerGroup"
            :items="routerTree"
            selected-color="primary"
            open-on-click
            selectable
            expand-icon="mdi-chevron-down"
            on-icon="mdi-checkbox-marked"
            off-icon="mdi-checkbox-blank-outline"
            indeterminate-icon="mdi-checkbox-intermediate"
            item-children="childNode"
          >
          </v-treeview>
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex text-xs-right>
          <v-btn flat @click="methodCancelUpdateRole">取消</v-btn>
          <v-btn flat @click="methodFormReset">重置</v-btn>
          <v-btn color="primary" @click="methodProcessParams">
            <v-icon>mdi-check</v-icon>修改角色
          </v-btn>
        </v-flex>
      </v-layout>
    </v-form>

  </div>
</template>
<script>
import httpMethod from '@/utils/httpMethod';

export default {
  name: 'updateRole',
  props: ['contentData', 'openDialog'],
  data() {
    return {
      routerTree: [],
      valid: false,
      roleParams: this.getParamsOrigin(),
      nameRules: [
        v => !!v || '此欄位為必填',
      ],
    };
  },
  watch: {
    openDialog(val) {
      if (val) {
        this.getRouterTree().then(() => {
          this.formatProps();
        });
        // this.formatProps();
      }
    },
  },
  mounted() {
    this.getRouterTree().then(() => {
      this.formatProps();
    });
  },
  methods: {
    getParamsOrigin() {
      return {
        name: null,
        routerGroup: [],
      };
    },
    formatProps() {
      this.roleParams.routerGroup.splice(0);
      this.$set(this.roleParams, 'name', this.contentData.value || '');
      this.$set(this.roleParams, 'routerGroup', this.contentData.routerGroup || []);
    },
    async getRouterTree() {
      const res = await httpMethod({
        url: '/v1/api/router/all',
        method: 'GET',
      });
      if (!res.code) {
        this.routerTree = res.data;
      }
    },
    methodProcessParams() {
      const {
        // name,
        routerGroup,
      } = this.roleParams;
      const params = {};
      params.cid = this.contentData.cid;
      if (routerGroup.length > 0) {
        params.routerGroup = routerGroup;
        this.updateRole(params);
      } else {
        const alert = {
          open: true,
          text: '頁面權限不得為空，請勾選',
          color: 'error',
        };
        this.$store.commit('global/setNotifySetting', alert);
      }
    },
    async updateRole(params) {
      if (this.$refs.form.validate()) {
        const res = await httpMethod({
          url: '/v1/api/user/role/update',
          method: 'POST',
          data: params,
        });
        console.log(res);
        let alert = null;
        if (!res.code) {
          alert = {
            open: true,
            text: res.data ? '修改成功' : `${res.msg}`,
            color: 'success',
          };
          this.$emit('closeDialog');
        } else {
          alert = {
            open: true,
            text: res.msg || '修改失敗，請重新再試，或聯絡客服人員',
            color: 'error',
          };
        }
        this.$store.commit('global/setNotifySetting', alert);
        // this.orderList = res.data;
        this.methodCancelUpdateRole();
        this.$emit('execOtherMethod');
      }
    },
    methodFormReset() {
      this.roleParams = this.getParamsOrigin();
      this.$refs.form.resetValidation();
    },
    methodCancelUpdateRole() {
      this.methodFormReset();
      this.$emit('closeDialog');
    },
  },
};
</script>
