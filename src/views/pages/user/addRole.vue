<template>
  <div class="add-role">
    <v-form v-model="valid" ref="form" class="px-2" lazy-validation>
      <v-layout row wrap>
        <v-flex sm12>
          <v-text-field
            v-model="roleParams.name"
            label="角色名稱"
            clearable
            :rules="nameRules"
          ></v-text-field>
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
          <v-btn flat @click="methodCancelAddRole">取消</v-btn>
          <v-btn flat @click="methodFormReset">重置</v-btn>
          <v-btn color="primary" @click="methodProcessParams">
            <v-icon>mdi-check</v-icon>新增角色
          </v-btn>
        </v-flex>
      </v-layout>
    </v-form>

  </div>
</template>
<script>
import httpMethod from '@/utils/httpMethod';

export default {
  name: 'addRole',
  props: ['contentData', 'openDialog'],
  data() {
    return {
      open: ['public'],
      files: {
        html: 'mdi-language-html5',
        js: 'mdi-nodejs',
        json: 'mdi-json',
        md: 'mdi-markdown',
        pdf: 'mdi-file-pdf',
        png: 'mdi-file-image',
        txt: 'mdi-file-document-outline',
        xls: 'mdi-file-excel',
      },
      breweries: [],
      isLoading: false,
      tree: [],
      types: [],
      routerTree: [],
      valid: false,
      roleParams: this.getParamsOrigin(),
      nameRules: [
        v => !!v || '此欄位為必填',
      ],
      validRouterTree: new Map(),
    };
  },
  watch: {
    openDialog(val) {
      if (val) {
        this.getRouterTree();
      }
    },
  },
  mounted() {
    this.getRouterTree();
  },
  methods: {
    getParamsOrigin() {
      return {
        name: null,
        routerGroup: [],
      };
    },
    async getRouterTree() {
      const res = await httpMethod({
        url: '/v1/api/router/all',
        method: 'GET',
      });
      if (!res.code) {
        this.routerTree = res.data;
        res.data.forEach((item) => {
          const childList = [];
          item.childNode.forEach((child) => {
            childList.push(child.id);
          });
          this.validRouterTree.set(item.id, childList);
        });
      }
    },
    methodProcessParams() {
      const {
        name,
        routerGroup,
      } = this.roleParams;
      const params = {};
      if (name) params.name = name;
      if (routerGroup.length > 0) {
        const routerGroupSet = new Set(routerGroup);
        routerGroupSet.forEach((item) => {
          this.validRouterTree.forEach((valueList, key) => {
            if (valueList.findIndex(i => i === item) !== -1) {
              routerGroupSet.add(key);
            }
          });
        });
        params.routerGroup = [...routerGroupSet];
        this.addRole(params);
      } else {
        const alert = {
          open: true,
          text: '頁面權限不得為空，請勾選',
          color: 'error',
        };
        this.$store.commit('global/setNotifySetting', alert);
      }
    },
    async addRole(params) {
      if (this.$refs.form.validate()) {
        const res = await httpMethod({
          url: '/v1/api/user/role/add',
          method: 'POST',
          data: params,
        });
        let alert = null;
        if (!res.code) {
          alert = {
            open: true,
            text: res.data ? '新增成功' : `${res.msg}`,
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
        this.methodCancelAddRole();
        this.$emit('execOtherMethod');
      }
    },
    methodFormReset() {
      this.roleParams = this.getParamsOrigin();
      this.$refs.form.resetValidation();
    },
    methodCancelAddRole() {
      this.methodFormReset();
      this.$emit('closeDialog');
    },
  },
};
</script>
