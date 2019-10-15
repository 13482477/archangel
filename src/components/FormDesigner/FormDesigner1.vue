<template>
  <a-layout>
    <a-layout-header>Header</a-layout-header>
    <a-layout>
      <a-layout-sider>Sider</a-layout-sider>
      <a-layout-content>Content</a-layout-content>
    </a-layout>
    <a-layout-footer>Footer</a-layout-footer>
  </a-layout>
  <!--<a-card title="Card Title" style="border: none" body-style="padding: 5px;">-->
    <!--<a-radio-group button-style="solid" slot="extra" default-value="form">-->
      <!--<a-radio-button value="form">表单</a-radio-button>-->
      <!--<a-radio-button value="list">列表</a-radio-button>-->
    <!--</a-radio-group>-->
    <!--<a-row>-->
      <!--<a-col :md="4" align="middle">-->
        <!--<a-card-->
          <!--ref="widget"-->
          <!--style="width:100%; border: none; "-->
          <!--body-style="text-align: left; padding: 5px;"-->
          <!--:tabList="tabList"-->
          <!--:activeTabKey="key"-->
          <!--@tabChange="key => onTabChange(key, 'key')">-->
          <!--<span slot="customRender" slot-scope="item" >-->
            <!--{{item.tabName}}-->
          <!--</span>-->
          <!--<p v-if="key === 'widget'">-->
            <!--fdsafdsaf-->
          <!--</p>-->
          <!--<p v-else-if="key === 'attribute'">attribute</p>-->
          <!--<p v-else-if="key === 'form'">form</p>-->
        <!--</a-card>-->
      <!--</a-col>-->
      <!--<a-col :md="20">-->
        <!--<a-card style="margin-left: 10px; width: 100%">-->
          <!--djkfdsakl-->
        <!--</a-card>-->
      <!--</a-col>-->
    <!--</a-row>-->
  <!--</a-card>-->
</template>

<script>
import ARow from 'ant-design-vue/es/grid/Row'
import ACol from 'ant-design-vue/es/grid/Col'
import ARadioGroup from 'ant-design-vue/es/radio/Group'
import ARadioButton from 'ant-design-vue/es/radio/RadioButton'
export default {
  name: 'FormDesigner',
  components: { ARadioButton, ARadioGroup, ACol, ARow },
  data () {
    return {
      tabList: [{
        key: 'widget',
        // tab: '控件',
        tabName: '控件',
        scopedSlots: {
          tab: 'customRender'
        }
      }, {
        key: 'attribute',
        tab: '属性'
      }, {
        key: 'form',
        tab: '表单'
      }],
      key: 'widget'
    }
  },
  methods: {
    onTabChange (key, type) {
      this[type] = key
    }
  }
}
</script>

<style>
#components-layout-demo-basic {
  text-align: center;
}
#components-layout-demo-basic .ant-layout-header,
#components-layout-demo-basic .ant-layout-footer {
  background: #7dbcea;
  color: #fff;
}
#components-layout-demo-basic .ant-layout-footer {
  line-height: 1.5;
}
#components-layout-demo-basic .ant-layout-sider {
  background: #3ba0e9;
  color: #fff;
  line-height: 120px;
}
#components-layout-demo-basic .ant-layout-content {
  background: rgba(16, 142, 233, 1);
  color: #fff;
  min-height: 120px;
  line-height: 120px;
}
#components-layout-demo-basic > .ant-layout {
  margin-bottom: 48px;
}
#components-layout-demo-basic > .ant-layout:last-child {
  margin: 0;
}
</style>
