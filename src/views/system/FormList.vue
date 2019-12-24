<template>
  <a-card :bordered="false" :style="{ height: '100%' }">
    <a-table :columns="table.columns" :rowKey="record => record.id" :dataSource="table.data" :pagination="table.pagination" :loading="table.loading">
    </a-table>
  </a-card>
</template>

<script>

export default {
  name: 'FormList',
  components: {
  },
  data () {
    return {
      table: {
        columns: [
          {
            title: 'id',
            dataIndex: 'id'
          },
          {
            title: 'formName',
            dataIndex: 'formName'
          },
          {
            title: 'formData',
            dataIndex: 'formData'
          }
        ],
        data: [],
        pagination: {},
        loading: false
      }
    }
  },
  created () {
    this.loadingTableData()
  },
  methods: {
    loadingTableData () {
      this.$http.get('http://localhost:9800/forms').then(resp => {
        console.log(resp)
        this.table.data = resp.content
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>

</style>
