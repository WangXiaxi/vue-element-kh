<template>
  <div class="">
    <div class="mt-6">
      <span class="withdraw-span">发生时间</span>
      <el-date-picker
        v-model="choosetime"
        type="daterange"
        :unlink-panels="false"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <el-button type="primary" plain >搜索</el-button>
    </div>
    <div>
      <el-table
        :data="tableFrozen"
        style="width: 100%" empty-text="暂无冻结款记录" :cell-class-name="tableRowClassName">
        <el-table-column
          label="交易说明"
          prop="desc">
        </el-table-column>
        <el-table-column
          label="发生时间"
          prop="name">
        </el-table-column>
        <el-table-column
          label="冻结金额(元)"
          prop="desc">
        </el-table-column>
        <el-table-column
          label="解冻金额(元)"
          prop="desc">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
    export default {
      computed: {
        defaultActive: function(){
          return this.$route.path.replace('/', '');
        }
      },
      methods: {
        //特殊列表样式修饰
        tableRowClassName({row, column, rowIndex, columnIndex}) {
          if (columnIndex === 3) {
            return 'orange-text';
          } else if (columnIndex === 2) {
            return 'green-text';
          }
          return '';
        },
      }
    }
</script>

<style scoped>

</style>
