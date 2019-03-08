<template>
  <div class="order-rooms">
    <table class="order-list__detail-table">
      <tr>
        <th
          v-for="(item, idx) in titleRow"
          :key="`titleRow${idx}`"
        >{{item}}</th>
      </tr>
      <tr
        v-for="(item, idx) in orderList"
        :key="`orderList${idx}`"
      >
        <td
          v-if="item.haveDate"
          :rowspan="dateRows[item.haveDate].rowspan"
        >{{formatNumberDate(dateRows[item.haveDate].date)}}</td>
        <td>{{item.roomName}}</td>
        <td>{{currencies(item.roomPrice)}}</td>
        <td>{{item.roomCount}}</td>
        <td>{{currencies(item.subTotal)}}</td>
      </tr>
      <tr class="sumtotal-row">
        <th colspan="4"></th>
        <th>總計</th>
      </tr>
      <tr>
        <td colspan="4"></td>
        <td>{{currencies(sumTotal)}}</td>
      </tr>
    </table>
  </div>
</template>
<script>
import { formatNumberDate, getDatePriceKey } from '@/utils/formatMethod';
import { currencies } from '@/utils/calculation';

export default {
  name: 'orderRooms',
  props: ['orderRoomList'],
  mounted() {
  },
  watch: {
    orderRoomList: {
      handler(val) {
        if (Array.isArray(val)) return;
        this.orderList.splice(0);
        this.sumTotal = 0;
        this.dateRows = {};
        Object.keys(val).forEach((key) => {
          this.dateRows[key] = {
            date: key,
            rowspan: val[key].length,
          };
          val[key].forEach((dataRow, idx) => {
            this.sumTotal += Number(dataRow.subTotal);
            this.orderList.push({ haveDate: idx === 0 ? key : null, ...dataRow });
          });
        });
      },
      immediate: true,
    },
  },
  data() {
    return {
      titleRow: ['日期', '房型', '單價', '數量', '小計'],
      orderList: [],
      sumTotal: 0,
      dateRows: {},
    };
  },
  methods: {
    currencies,
    formatNumberDate,
    getDatePriceKey,
    methodClearRoom() {
      this.orderList.splice(0);
      this.sumTotal = 0;
    },
  },
};
</script>
