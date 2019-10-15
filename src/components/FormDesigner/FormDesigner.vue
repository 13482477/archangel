<template>
  <div class="designerRoot">
    <div class="designerContentWrapper">
      <div class="leftSide">
        <a-tabs type="line" :animated="true">
          <a-tab-pane tab="控件" key="widget">
            <div class="attributeContainer">
              <div>
                <label style="font-weight: bold; font-color: #000000">布局控件</label>
              </div>
              <div style="width: 100%; margin-top: 10px;">
                <ul>
                  <li>
                    <label>栅格</label>
                  </li>
                </ul>
              </div>
            </div>
            <div class="attributeContainer">
              <div style="font-weight: bold; font-color: #000000">表单控件</div>
              <div style="width: 100%; margin-top: 10px;">
                <draggable
                  tag="ul"
                  :list="widgetList"
                  :group="{ name: 'widget', pull: 'clone', put: 'false' }"
                >
                  <li v-for="(widget, i) in widgetList" :key="i"><label>{{ widget.name }}</label></li>
                </draggable>

              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane tab="属性" key="attribute">
            属性
          </a-tab-pane>
          <a-tab-pane tab="表单" key="form">
            表单
          </a-tab-pane>
        </a-tabs>
      </div>
      <div id="palette" class="rightSide">
        <draggable :list="gridData">
          <a-row v-for="(row, rowIndex) in gridData" :key="rowIndex" :gutter="4">
            <draggable>
              <a-col v-for="(col, colIndex) in row" :key="colIndex" :span="24/row.length">
                <div>
                  <div class="cellToolBox">
                    <a-button
                      type="dashed"
                      shape="circle"
                      size="small"
                      icon="delete"
                      @click="clearCell(rowIndex, colIndex)"
                      style="margin-right: 8px;"></a-button>
                    <a-button
                      type="dashed"
                      shape="circle"
                      size="small"
                      icon="minus"
                      @click="deleteCell(rowIndex, colIndex)"
                      style="margin-right: 8px;"></a-button>
                    <a-button
                      type="dashed"
                      shape="circle"
                      size="small"
                      icon="plus"
                      @click="addCell(rowIndex)"></a-button>
                  </div>
                  <a-form-item
                    v-if="col.type === 'inputText'"
                    :label="`Field id=${col.id} rowIndex=${rowIndex}, colIndex=${colIndex}`"
                  >
                    <a-input placeholder="placeholder"/>
                  </a-form-item>
                  <p v-else>{{ col.name }}</p>
                </div>
              </a-col>
            </draggable>
          </a-row>
          <div style="width: 100%; text-align: center;margin-top: 10px;">
            <a-button type="primary" size="large" icon="plus" style="width: 100%" @click="addRow()">添加列</a-button>
          </div>
          <div style="width: 100%">
            <pre>{{ gridData }}</pre>
          </div>
          <a-button @click="showGutters()"></a-button>
        </draggable>
      </div>
    </div>
  </div>
</template>
<script>
import ARow from 'ant-design-vue/es/grid/Row'
import ACol from 'ant-design-vue/es/grid/Col'
import ARadioGroup from 'ant-design-vue/es/radio/Group'
import ARadioButton from 'ant-design-vue/es/radio/RadioButton'
import AFormItem from 'ant-design-vue/es/form/FormItem'
import draggable from 'vuedraggable'
import nestedDraggable from '@/components/Draggable/nested'

class GridCell {
  constructor (id, name, type) {
    this.id = id
    this.name = name
    this.type = type
  }
}

class Widget {
  constructor (id, name, type) {
    this.id = id
    this.name = name
    this.type = type
  }
}

let id = 1

export default {
  name: 'FormDesigner',
  components: { AFormItem, ARadioButton, ARadioGroup, ACol, ARow, draggable, nestedDraggable },
  data () {
    return {
      widgetList: [
        new Widget(1, '文本框', 'text'),
        new Widget(2, '多行文本', 'multText'),
        new Widget(3, '数字', 'number'),
        new Widget(4, '单选框', 'radio'),
        new Widget(5, '复选框', 'checkBox'),
        new Widget(6, '时间', 'date'),
        new Widget(7, '时间日期', 'datetime'),
        new Widget(8, '下拉框', 'dropdownBox'),
        new Widget(9, '开关', 'switch')
      ],
      gridData: []
    }
  },
  methods: {
    addRow () {
      this.gridData.push(new Array(new GridCell(id++, 'cell')))
    },
    deleteRow (rowIndex) {
      this.gridData.splice(rowIndex, 1)
    },
    addCell (rowIndex) {
      if (this.gridData[rowIndex].length >= 4) {
        return
      }
      this.gridData[rowIndex].push(new GridCell(id++, 'cell'))
    },
    deleteCell (rowIndex, colIndex) {
      if (this.gridData[rowIndex].length <= 1) {
        this.deleteRow(rowIndex)
      }
      this.gridData[rowIndex].splice(colIndex, 1)
    },
    clearCell (rowIndex, colIndex) {
      this.gridData[rowIndex][colIndex].type = 'none'
    },
    addWidget (i) {
      return {

      }
    },
    showGutters () {
      alert(JSON.stringify(this.gutters))
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

#palette [class^="ant-col-"] > div {
  background: #ffffff;
  height: 120px;
  font-size: 13px;
  color: #000000;
  border: solid 3px rgba(0, 170, 238, 0.1);
  padding: 5px 5px 5px 5px;
}

.cellToolBox {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 1;
}

</style>

<style>
</style>
