<template>
  <div class="designerRoot">
    <div class="designerContentWrapper">
      <div class="leftSide">
        <a-tabs type="line" :animated="true">
          <a-tab-pane tab="控件" key="widget">
            <a-row>
              <div class="attributeContainer">
                <div style="font-weight: bold; font-color: #000000">表单控件</div>
                <div style="width: 100%; margin-top: 10px;">
                  <ul>
                    <li
                      v-for="(widget, i) in widgetList"
                      :key="i"
                      :widgetid="widget.type"
                      draggable="true"
                      @dragstart="onDragstart(widget.type)"
                      @dragend="onDragend"
                    >
                      <label>{{ widget.name }}</label>
                    </li>
                  </ul>
                </div>
              </div>
            </a-row>
            <a-row style="margin-top: 20px;">
              <div class="attributeContainer">
                <div style="font-weight: bold; font-color: #000000">表单名称</div>
                <div style="width: 100%; margin-top: 10px;">
                  <a-input v-model="formName" />
                </div>
              </div>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </div>
      <div id="palette" class="rightSide">
        <a-row v-for="(row, rowIndex) in gridData" :key="rowIndex" :gutter="4">
          <a-col v-for="(col, colIndex) in row" :key="colIndex" :span="24/row.length">
            <div @dragover="onDragover($event)" @drop="onDrop(rowIndex, colIndex)" @click="selectCell(rowIndex, colIndex)" class="cell" >
              <div class="cellToolBox">
                <a-button
                  type="dashed"
                  shape="circle"
                  size="small"
                  icon="delete"
                  @click="cleanCell(rowIndex, colIndex)"
                  style="margin-right: 8px;" />
                <a-button
                  type="dashed"
                  shape="circle"
                  size="small"
                  icon="minus"
                  @click="deleteCell(rowIndex, colIndex)"
                  style="margin-right: 8px;" />
                <a-button
                  type="dashed"
                  shape="circle"
                  size="small"
                  icon="plus"
                  @click="addCell(rowIndex, colIndex)" />
              </div>
              <div class="cellContent">
                <a-form-item :label="col.attributeLabel" :labelCol="{span: 5}" :wrapper-col="{span: 16}">
                  <a-input v-if="col.type === 'text'"/>
                  <a-textarea v-if="col.type === 'multiText'" :autosize="{ minRows: col.rows, maxRows: col.rows }" />
                  <a-input-number v-if="col.type === 'number'" />
                  <a-radio-group v-if="col.type === 'radio'" name="radioGroup" >
                    <a-radio v-for="(item, i) in col.items" :key="i" :value="item.value">{{ item.label }}</a-radio>
                  </a-radio-group>
                  <a-checkbox-group v-if="col.type === 'checkBox'">
                    <a-checkbox v-for="(item, i) in col.items" :key="i" :value="item.value">{{ item.label }}</a-checkbox>
                  </a-checkbox-group>
                  <a-date-picker v-if="col.type === 'date'" format="YYYY-MM-DD" placeholder="Start" />
                  <a-date-picker v-if="col.type === 'datetime'" showTime format="YYYY-MM-DD HH:mm:ss" placeholder="Start"/>
                  <a-select v-if="col.type === 'dropdownBox'" defaultValue="lucy">
                    <a-select-option value="jack">Jack</a-select-option>
                    <a-select-option value="lucy">Lucy</a-select-option>
                    <a-select-option value="disabled" disabled>Disabled</a-select-option>
                    <a-select-option value="Yiminghe">yiminghe</a-select-option>
                  </a-select>
                  <a-switch v-if="col.type === 'switch'" defaultChecked />
                </a-form-item>
              </div>
            </div>
          </a-col>
        </a-row>
        <a-row>
          <a-button type="primary" size="large" icon="plus" style="width: 100%" @click="addRow()">添加列</a-button>
        </a-row>
        <a-row style="margin-top: 5px; text-align: right">
          <a-button type="primary" size="large" @click="save()" style="width: 100%">保存</a-button>
        </a-row>
        <div style="width: 100%">
          <div style="width: 50%; display: inline-block; vertical-align: top;">
            <pre>{{ widgetList }}</pre>
          </div>
          <div style="width: 50%; display: inline-block; vertical-align: top;">
            <pre>{{ gridData }}</pre>
          </div>
        </div>
        <a-button @click="showGutters()"></a-button>
      </div>
    </div>
    <a-modal :title="modalTitle" v-model="modal.visible" @ok="handleModelOk" :width="800">
      <a-row class="modalRowGap modalLineHeight">
        <a-col :span="modal.labelSpan">
          <label>
            属性名称:
          </label>
        </a-col>
        <a-col :span="modal.widgetSpan">
          <a-input v-model="modal.attributeName" />
        </a-col>
      </a-row>
      <a-row class="modalRowGap modalLineHeight">
        <a-col :span="modal.labelSpan">
          <label>
            显示名称:
          </label>
        </a-col>
        <a-col :span="modal.widgetSpan">
          <a-input v-model="modal.attributeLabel" />
        </a-col>
      </a-row>
      <a-row class="modalRowGap modalLineHeight">
        <a-col :span="modal.labelSpan">
          是否必填:
        </a-col>
        <a-col :span="modal.widgetSpan">
          <a-switch v-model="modal.required" />
        </a-col>
      </a-row>
      <a-row v-if="modal.type === 'multiText'" class="modalRowGap modalRowGap">
        <a-col :span="modal.labelSpan">
          行数:
        </a-col>
        <a-col :span="modal.widgetSpan">
          <a-input-number v-model="modal.multiText.rows" />
        </a-col>
      </a-row>
      <a-row v-if="modal.type === 'radio'" class="modalRowGap modalLineHeight">
        <a-col :span="modal.labelSpan">
          选项：
        </a-col>
        <a-col :span="modal.widgetSpan">
          <a-row class="modalRowGap" v-for="(item, i) in modal.radioOption.items" :key="i">
            <a-col :span="4" style="text-align: right">
              名称：
            </a-col>
            <a-col :span="6">
              {{ item.label }}
            </a-col>
            <a-col :span="4" style="text-align: right">
              值：
            </a-col>
            <a-col :span="6">
              {{ item.value }}
            </a-col>
            <a-col :span="4" style="text-align: center">
              <a-button type="primary" @click="deleteRadioItem(i)">删除</a-button>
            </a-col>
          </a-row>
          <a-row class="modalRowGap">
            <a-col :span="4" style="text-align: right">
              选项名称：
            </a-col>
            <a-col :span="6">
              <a-input v-model="modal.radioOption.inputLabel" />
            </a-col>
            <a-col :span="4" style="text-align: right">
              选项值：
            </a-col>
            <a-col :span="6">
              <a-input v-model="modal.radioOption.inputValue" />
            </a-col>
            <a-col :span="4" style="text-align: center">
              <a-button type="primary" @click="addRadioItem">添加</a-button>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      <a-row v-if="modal.type === 'checkBox'" class="modalRowGap modalLineHeight">
        <a-col :span="modal.labelSpan">
          选项：
        </a-col>
        <a-col :span="modal.widgetSpan">
          <a-row class="modalRowGap" v-for="(item, i) in modal.checkBoxOption.items" :key="i">
            <a-col :span="4" style="text-align: right">
              名称：
            </a-col>
            <a-col :span="6">
              {{ item.label }}
            </a-col>
            <a-col :span="4" style="text-align: right">
              值：
            </a-col>
            <a-col :span="6">
              {{ item.value }}
            </a-col>
            <a-col :span="4" style="text-align: center">
              <a-button type="primary" @click="deleteCheckBoxItem(i)">删除</a-button>
            </a-col>
          </a-row>
          <a-row class="modalRowGap">
            <a-col :span="4" style="text-align: right">
              选项名称：
            </a-col>
            <a-col :span="6">
              <a-input v-model="modal.checkBoxOption.inputLabel" />
            </a-col>
            <a-col :span="4" style="text-align: right">
              选项值：
            </a-col>
            <a-col :span="6">
              <a-input v-model="modal.checkBoxOption.inputValue" />
            </a-col>
            <a-col :span="4" style="text-align: center">
              <a-button type="primary" @click="addCheckBoxItem">添加</a-button>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      <a-row v-if="modal.type === 'dropdownBox'" class="modalRowGap modalLineHeight">
        <a-col :span="modal.labelSpan">
          选项：
        </a-col>
        <a-col :span="modal.widgetSpan">
          <a-row class="modalRowGap" v-for="(item, i) in modal.dropdownBoxOption.items" :key="i">
            <a-col :span="4" style="text-align: right">
              名称：
            </a-col>
            <a-col :span="6">
              {{ item.label }}
            </a-col>
            <a-col :span="4" style="text-align: right">
              值：
            </a-col>
            <a-col :span="6">
              {{ item.value }}
            </a-col>
            <a-col :span="4" style="text-align: center">
              <a-button type="primary" @click="deleteDropdownBoxItem(i)">删除</a-button>
            </a-col>
          </a-row>
          <a-row class="modalRowGap">
            <a-col :span="4" style="text-align: right">
              选项名称：
            </a-col>
            <a-col :span="6">
              <a-input v-model="modal.dropdownBoxOption.inputLabel" />
            </a-col>
            <a-col :span="4" style="text-align: right">
              选项值：
            </a-col>
            <a-col :span="6">
              <a-input v-model="modal.dropdownBoxOption.inputValue" />
            </a-col>
            <a-col :span="4" style="text-align: center">
              <a-button type="primary" @click="addDropdownBoxItem">添加</a-button>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>
<script>
import ARow from 'ant-design-vue/es/grid/Row'
import ACol from 'ant-design-vue/es/grid/Col'
import ARadioGroup from 'ant-design-vue/es/radio/Group'
import ARadioButton from 'ant-design-vue/es/radio/RadioButton'
import AFormItem from 'ant-design-vue/es/form/FormItem'

export default {
  name: 'FormDesigner',
  components: { AFormItem, ARadioButton, ARadioGroup, ACol, ARow },
  data () {
    return {
      target: null,
      widgetList: [
        {
          name: '文本框',
          type: 'text'
        },
        {
          name: '多行文本',
          type: 'multiText'
        },
        {
          name: '数字',
          type: 'number'
        },
        {
          name: '单选框',
          type: 'radio'
        },
        {
          name: '复选框',
          type: 'checkBox'
        },
        {
          name: '时间',
          type: 'date'
        },
        {
          name: '时间日期',
          type: 'datetime'
        },
        {
          name: '下拉框',
          type: 'dropdownBox'
        },
        {
          name: '开关',
          type: 'switch'
        }
      ],
      selectedCell: {
        rowIndex: 0,
        colIndex: 0
      },
      formName: '',
      gridData: [],
      modal: {
        labelSpan: 8,
        widgetSpan: 16,
        rowIndex: 0,
        colIndex: 0,
        visible: false,
        title: '',
        type: '',
        attributeName: '',
        attributeLabel: '',
        required: false,
        multiText: {
          rows: 0
        },
        radioOption: {
          inputLabel: '',
          inputValue: '',
          defaultValue: '',
          items: []
        },
        checkBoxOption: {
          inputLabel: '',
          inputValue: '',
          items: []
        },
        dropdownBoxOption: {
          inputLabel: '',
          inputValue: '',
          items: []
        }
      }
    }
  },
  methods: {
    addRow () {
      this.gridData.push([{}])
    },
    addCell (rowIndex, colIndex) {
      if (this.gridData[rowIndex].length >= 4) {
        return
      }
      this.gridData[rowIndex].splice(colIndex + 1, 0, {})
    },
    deleteRow (rowIndex) {
      this.gridData.splice(rowIndex, 1)
    },
    deleteCell (rowIndex, colIndex) {
      this.gridData[rowIndex].splice(colIndex, 1)
      if (this.gridData[rowIndex].length === 0) {
        this.deleteRow(rowIndex)
      }
    },
    onDragstart (type) {
      this.target = type
    },
    onDragend () {
      this.target = null
    },
    onDragover (event) {
      event.preventDefault()
    },
    onDrop (rowIndex, colIndex) {
      if (this.target == null) {
        return
      }
      this.modal.visible = true
      this.modal.type = this.target
      this.modal.rowIndex = rowIndex
      this.modal.colIndex = colIndex
    },
    selectCell (rowIndex, colIndex) {
      this.selectedCell = {
        rowIndex: rowIndex,
        colIndex: colIndex
      }
    },
    showGutters () {
      alert(JSON.stringify(this.gutters))
    },
    handleModelOk () {
      this.$set(this.gridData[this.modal.rowIndex][this.modal.colIndex], 'type', this.modal.type)
      this.$set(this.gridData[this.modal.rowIndex][this.modal.colIndex], 'attributeName', this.modal.attributeName)
      this.$set(this.gridData[this.modal.rowIndex][this.modal.colIndex], 'attributeLabel', this.modal.attributeLabel)
      if (this.modal.type === 'multiText') {
        this.handleMultiText()
      } else if (this.modal.type === 'radio') {
        this.handleRadio()
      } else if (this.modal.type === 'checkBox') {
        this.handleCheckBox()
      } else if (this.modal.type === 'dropdownBox') {
        this.handleDropdownBox()
      }
      this.cleanModal()
      this.modal.visible = false
    },
    cleanModal () {
      this.modal.title = ''
      this.modal.type = ''
      this.modal.attributeName = ''
      this.modal.attributeLabel = ''
      this.modal.required = false

      this.modal.multiText.rows = 0

      this.modal.radioOption.inputLabel = ''
      this.modal.radioOption.inputValue = ''
      this.modal.radioOption.items = []

      this.modal.checkBoxOption.inputLabel = ''
      this.modal.checkBoxOption.inputValue = ''
      this.modal.checkBoxOption.items = []

      this.modal.dropdownBoxOption.inputLabel = ''
      this.modal.dropdownBoxOption.inputValue = ''
      this.modal.dropdownBoxOption.items = []
    },
    handleMultiText () {
      this.$set(this.gridData[this.modal.rowIndex][this.modal.colIndex], 'rows', this.modal.multiText.rows)
    },
    handleRadio () {
      this.$set(this.gridData[this.modal.rowIndex][this.modal.colIndex], 'items', this.modal.radioOption.items)
    },
    handleCheckBox () {
      this.$set(this.gridData[this.modal.rowIndex][this.modal.colIndex], 'items', this.modal.checkBoxOption.items)
    },
    handleDropdownBox () {
      this.$set(this.gridData[this.modal.rowIndex][this.modal.colIndex], 'items', this.modal.dropdownBoxOption.items)
    },
    addRadioItem () {
      this.modal.radioOption.items.push({
        label: this.modal.radioOption.inputLabel,
        value: this.modal.radioOption.inputValue
      })
      this.modal.radioOption.inputLabel = ''
      this.modal.radioOption.inputValue = ''
    },
    deleteRadioItem (index) {
      this.modal.radioOption.items.splice(index, 1)
    },
    addCheckBoxItem () {
      this.modal.checkBoxOption.items.push({
        label: this.modal.checkBoxOption.inputLabel,
        value: this.modal.checkBoxOption.inputValue
      })
      this.modal.checkBoxOption.inputLabel = ''
      this.modal.checkBoxOption.inputValue = ''
    },
    deleteCheckBoxItem (index) {
      this.modal.checkBoxOption.items.splice(index, 1)
    },
    addDropdownBoxItem () {
      this.modal.dropdownBoxOption.items.push({
        label: this.modal.dropdownBoxOption.inputLabel,
        value: this.modal.dropdownBoxOption.inputValue
      })
      this.modal.dropdownBoxOption.inputLabel = ''
      this.modal.dropdownBoxOption.inputValue = ''
    },
    deleteDropdownBoxItem (index) {
      this.modal.dropdownBoxOption.items.splice(index, 1)
    },
    cleanCell (rowIndex, colIndex) {
      this.$set(this.gridData[rowIndex], colIndex, {})
    },
    async save () {
      const resp = await this.$http.post('http://localhost:9800/form', {
        formName: this.formName,
        formData: JSON.stringify(this.gridData)
      })
      console.log(resp)
    }
  },
  computed: {
    cellSelected () {
      return (rowIndex, colIndex) => {
        return this.selectedCell !== null && this.selectedCell.rowIndex === rowIndex && this.selectedCell.colIndex === colIndex
      }
    },
    modalTitle () {
      if (this.modal.type === 'text') {
        return '文本框'
      } else if (this.modal.type === 'multiText') {
        return '多行文本'
      } else if (this.modal.type === 'number') {
        return '数字'
      } else if (this.modal.type === 'radio') {
        return '单选框'
      } else if (this.modal.type === 'checkBox') {
        return '复选框'
      } else if (this.modal.type === 'date') {
        return '时间'
      } else if (this.modal.type === 'datetime') {
        return '时间日期'
      } else if (this.modal.type === 'dropdownBox') {
        return '下拉框'
      } else if (this.modal.type === 'switch') {
        return '开关'
      } else {
        return '未知'
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .designerRoot {
    height: 100%;
    width: 100%;

    .designerTitle {
      width: 100%;
      height: 40px;
      padding: 10px 10px 10px 10px;
      background-color: #ffffff;
      margin-bottom: 10px;
    }

    .designerContentWrapper {
      width: 100%;
      height: 100%;
      display: flex;

      .leftSide {
        width: 300px;
        height: 100%;
        background-color: #ffffff;
        padding: 10px 10px 10px 10px;

        .attributeContainer {
          width: 100%;

          ul {
            list-style: none;
            width: 100%;
            padding: 0px;
            height: 50px;
          }

          li {
            float: left;
            display: inline;
            width: 48%;
            height: 50px;
            border: 1px dashed #F0F2F5;
            border-radius: 1px;
            margin: 2px 2px 0px 0px;
            padding: 10px;
          }
        }
      }

      .rightSide {
        flex: 1;
        margin-left: 10px;
        height: 100%;
        background-color: #ffffff;
        padding: 10px 10px 10px 10px;
      }
    }
  }

  #palette [class^="ant-col-"] {
    background: transparent;
    border: 0;
    margin-bottom: 5px;
  }

  .cell {
    position: relative;
    background: #ffffff;
    min-height: 120px;
    font-size: 13px;
    color: #000000;
    padding: 5px 5px 5px 5px;
    border: solid 3px rgba(0, 170, 238, 0.1);
  }

  .cellSelected {
    border-color: red;
    border-style: dashed;
  }

  .cellContent {
    position: relative;
    width: 100%;
    margin-top: 30px;
  }

  .cellToolBox {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 1;
  }

  .modalRowGap {
    margin-bottom: 10px;
  }
  .modalLineHeight {
    line-height: 30px;
  }

</style>

<style>
</style>
