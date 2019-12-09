<template>
  <div id="app"  >
    <el-row :gutter="20">
      <el-col :span="14"><DiagramEditor  @nowSelectNodeId="selectLink"
                                        v-model="graph"></DiagramEditor>
        <!--<div>-->
          <!--<div :style="mystyle(400,300)">float window</div>-->
        <!--</div>-->
      </el-col>
      <el-col :span="10">
        <el-tag>{{selectId}}</el-tag>
        <el-button type="primary" @click ="changeSVG">主要按钮</el-button>

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
        changeSVG(){
          for(var node in this.graph.nodes){
              console.log("--*--")
              this.graph.nodes[node].point.x = 0
              this.graph.nodes[node].point.y = 0
              console.log("--*--")
          }
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
