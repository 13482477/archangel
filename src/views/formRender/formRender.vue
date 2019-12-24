<template>
  <a-card :title="title">
    <a-form :form="form">
      <a-row v-for="(row, rowIndex) in this.formOption" :key="rowIndex" :gutter="4">
        <a-col v-for="(col, colIndex) in row" :key="colIndex" :span="24/row.length">
          <a-form-item :label="col.attributeLabel" :labelCol="{span: 5}" :wrapper-col="{span: 16}">
            <a-input v-if="col.type === 'text'" v-decorator="vDecorator(col)" />
            <a-textarea v-if="col.type === 'multiText'" :autosize="{ minRows: col.rows, maxRows: col.rows }" v-decorator="vDecorator(col)" />
            <a-input-number v-if="col.type === 'number'" v-decorator="vDecorator(col)" />
            <a-radio-group v-if="col.type === 'radio'" name="radioGroup" v-decorator="vDecorator(col)" >
              <a-radio v-for="(item, i) in col.items" :key="i" :value="item.value" >{{ item.label }}</a-radio>
            </a-radio-group>
            <a-checkbox-group v-if="col.type === 'checkBox'" v-decorator="vDecorator(col)">
              <a-checkbox v-for="(item, i) in col.items" :key="i" :value="item.value">{{ item.label }}</a-checkbox>
            </a-checkbox-group>
            <a-date-picker v-if="col.type === 'date'" format="YYYY-MM-DD" placeholder="Start" v-decorator="vDecorator(col)" />
            <a-date-picker v-if="col.type === 'datetime'" showTime format="YYYY-MM-DD HH:mm:ss" placeholder="Start" v-decorator="vDecorator(col)" />
            <a-select v-if="col.type === 'dropdownBox'" defaultValue="lucy" v-decorator="vDecorator(col)">
              <a-select-option value="jack">Jack</a-select-option>
              <a-select-option value="lucy">Lucy</a-select-option>
              <a-select-option value="disabled" disabled>Disabled</a-select-option>
              <a-select-option value="Yiminghe">yiminghe</a-select-option>
            </a-select>
            <a-switch v-if="col.type === 'switch'" defaultChecked v-decorator="[`${col.attributeName}`]" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col>
          <a-button type="primary" @click="submitForm">提交</a-button>
        </a-col>
      </a-row>
    </a-form>
  </a-card>
</template>

<script>
export default {
  name: 'formRender',
  data () {
    return {
      form: this.$form.createForm(this),
      title: '自定义表单',
      formName: '',
      formOption: null,
      dataUrl: '',
      submitUrl: '',
      formData: {}
    }
  },
  mounted () {
  },
  created () {
    this.formName = this.$route.params.formName
    this.dataUrl = this.$route.query.dataUrl
    this.submitUrl = this.$route.query.submitUrl
    this.loadFormOption()
  },
  methods: {
    loadFormOption () {
      this.$http.get('http://localhost:9800/form', {
        params: { formName: this.formName }
      }).then(resp => {
        this.formOption = JSON.parse(resp.data.formData)
        this.initData()
      }).catch(err => {
        console.log(err)
      })
    },
    initData () {
      this.$http.get(this.dataUrl).then(resp => {
        this.form.setFieldsValue(resp)
      }).catch(err => {
        console.log(err)
      })
    },
    submitForm () {
      console.log(this.submitUrl)
      console.log(this.form.getFieldsValue())
      this.$http.post(this.submitUrl, this.form.getFieldsValue())
    }
  },
  computed: {
    vDecorator () {
      return (cell) => {
        const result = []
        result.push(cell.attributeName)
        return result
      }
    }
  }
}
</script>

<style scoped>

</style>
