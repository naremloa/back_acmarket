<template>
  <div class="phelomi">
    <router-view></router-view>
    <v-snackbar
      v-model="notifySetting.open"
      top
      right
      multi-line
      :timeout="notifySetting.timeout"
      :color="notifySetting.color"
    >{{notifySetting.text}}<v-btn
        flat
        @click="notifySetting.open = false"
      >
        <v-icon color="white">mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>
<script>
import { dateTime } from '@/utils/calculation';
import { mapGetters } from 'vuex';

export default {
  name: 'app',
  created() {
    if (process.env.BUILD_TIME) {
      console.info(
        '%c build ',
        'background-color:#bf360c;color:#fff',
        dateTime(process.env.BUILD_TIME),
      );
    }
  },
  mounted() {
    window.addEventListener('resize', this.onResize, { passive: true });
    console.log('​onResize -> this.$vuetify.breakpoint', this.$vuetify.breakpoint);
  },
  computed: {
    ...mapGetters({
      notifySetting: 'global/notifySetting',
    }),
  },
  methods: {
    onResize() {
      console.log('​onResize -> this.$vuetify.breakpoint', this.$vuetify.breakpoint);
    },
  },
  beforeDestroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize, { passive: true });
    }
  },
};
</script>
