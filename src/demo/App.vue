<template>
  <div id="app"  >

    <el-row>
      <el-button type="primary" plain>升级</el-button>
      <el-button type="primary" plain>版本比较</el-button>
      <el-button type="primary" plain>升级时间</el-button>
    </el-row>
    <el-row >
      <el-col :span="1.5" >

        <el-row v-for="(item,index) in time">
          <el-button type="primary" plain @click = "changeColorBySelectTime(item)">{{item}}</el-button>
        </el-row>


      </el-col>
      <el-col :span="13"><DiagramEditor
              ref="DiagramEditor"
              @nowSelectNodeId="selectLink"
              v-model="graph"></DiagramEditor>
      </el-col>
      <el-col :span="9">
        <el-tag>{{selectId}}</el-tag>
        <el-button type="primary" @click ="changeSvgDown">往下</el-button>
        <el-button type="primary" @click ="changeSvgUp">往上</el-button>
        <el-button type="primary" @click ="changeColorBySelectTime">change</el-button>

      </el-col>
    </el-row>
  </div>
</template>

<script>
import data from "./data.json";
import VueEvent from "./VueEnvent"
import { DiagramEditor } from "../index.js";
import VInput from "../minimal-ui/lib/VInput";
import Vue from "vue";
export default {
  name: "app",
  components: {
      VInput,
    DiagramEditor
  },
  data() {
    return {
        Bus:new Vue(),
      graph: {},
        selectId:"",
        time:[20191110,20191111,20191112,20191113]

    };
  },
    created(){
        VueEvent.$on("select",data =>{
        })
    },
  mounted() {
    this.graph = data;
  },
    methods:{

        changeSvgDown(){
         this.$refs.DiagramEditor.changeSvgDown()
        },
        changeSvgUp(){
            this.$refs.DiagramEditor.changeSvgUp()
        },
        changeColorBySelectTime(time){
            this.$refs.DiagramEditor.changeColor(time)
        },

        selectLink(i){
            this.selectId = i
        },
        mystyle(x, y){
            return `position: absolute;background: red;left: ${x}px;top: ${x}px;width: ${y}px;`
        }
    }
};
</script>

<style lang="scss">
body {
  #app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    // text-align: center;
    color: #2c3e50;
    width: 100%;
    height: 100%;
  }
  .scrollXY {
    overflow-x: auto;
    overflow-y: auto;
  }
}
</style>
