<template>
    <div id="svg-diagram-show-area" class="scrollXY" ref="field">

        <div
                v-for="item in nodeList"
                :key="item.id"
                :id="item.id"
                style="visibility: hidden"
        >
            <div :style="mystyle(item.point.x+260,item.point.y+60)">
                <el-tag>{{item.content.text}}</el-tag>
            </div>
        </div>
        <div>
            <svg
                    :width="fluid ? '100%' : width"
                    :height="fluid ? '100%' : height"
                    :viewBox="viewBoxDiagram"
                    xmlns="http://www.w3.org/2000/svg"

            >

                <defs>
                    <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" stroke-width="0.5"/>
                    </pattern>
                    <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                        <rect width="100" height="100" fill="url(#smallGrid)"/>
                        <path d="M 100 0 L 0 0 0 100" fill="none" stroke="gray" stroke-width="1"/>
                    </pattern>
                </defs>
                <g :transform="scaleStr">
                    <rect
                            x="0"
                            y="0"
                            :width="width"
                            :height="height"
                            :fill="background || 'url(#smallGrid)'"
                            @click="reset"
                    />
                    <Node
                            :node="item"
                            :selected="item.id === selectedNode"
                            v-for="item in nodeList"
                            :key="item.key"
                            :createLinkMode="createLinkMode"
                            :editable="editable"
                            :labels="labels"
                            :rWidth="rect().rWidth"
                            :rHeight="rect().rHeight"
                            :scale="scale"
                            @editNode="editNode"
                            @select="selectNode"
                            @copy="copyNode"
                            @updateLocation="updateNodeLocation"
                            @toggleSelect="toggleSrcSelect"
                            @commitDest="commitDest"
                            @remove="removeNode"
                    />
                    <Link
                            :link="item"
                            v-for="item in linkList"
                            :selected="item.id === selectedLink"
                            :key="item.id"
                            :source="findNode(item.source)"
                            :destination="findNode(item.destination)"
                            :editable="editable"
                            :labels="labels"
                            :rWidth="rect().rWidth"
                            :rHeight="rect().rHeight"
                            :scale="scale"
                            @editLink="editLink"
                            @select="selectLink"
                            @updateLocation="updateLinkLocation"
                            @remove="removeLink"
                    />
                </g>
            </svg>

        </div>
    </div>
</template>

<script>
    import Node from "@/lib/Node";
    import Link from "@/lib/Link";
    // import drag from "./zoomAnd/drag.js"
    // import zoom from "./zoomAnd/zoom.js"
    // import index from "./zoomAnd/index.js"

    import Vue from 'vue'
    // window.onload = function () {
    //
    //     const zoom = $solway.zoom({
    //         ele: document.getElementById('zoomSvg'),
    //         scale: 1,
    //         minScale: 0.1
    //     });
    //
    //
    //     $solway.drag({
    //         ele: document.getElementById('dragDiv')
    //     });
    // };

    export default {

        name: "Diagram",
        props: {
            width: Number,
            height: Number,
            scale: {
                type: String,
                default: "1"
            },
            background: String,
            nodes: Array,
            links: Array,
            editable: Boolean,
            labels: Object,
            fluid: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            node(newVal) {
                console.log("watch the change!!!")
                console.log(newVal)
                this.x = newVal.x;
                this.y = newVal.y;
            },
            immediate: true,
            deep: true

        },
        components: {
            Node,
            Link
        },

        computed: {
            viewBoxDiagram() {
                return this.fluid
                    ? `0 0 ${this.width / this.scale} ${this.height / this.scale}`
                    : `0 0 ${this.width} ${this.height}`;
            },
            scaleStr() {
                return (
                    "scale(" +
                    (this.fluid ? 1.0 : this.scale || 1.0) +
                    ")" +
                    "translate(" +
                    0 +
                    "," +
                    0 +
                    ")"
                );
            },
            nodeList: {
                get() {
                    return this.nodes;
                },
                set(val) {
                    this.$emit("nodeChanged", {
                        nodes: val
                    });
                }
            },
            linkList: {
                get() {
                    return this.links;
                },
                set(val) {
                    this.$emit("linkChanged", {
                        links: val
                    });
                }
            }
        },
        data() {
            return {
                flag: false,
                name: "",
                url: "",
                color: "",
                selectedNode: -1,
                selectedLink: -1,
                createLinkMode: false
            };
        },

        methods: {

            onShortcutTouchStart(e) {
                console.log(e)
            },
            onShortcutTouchMove(e) {
                console.log(e)
            },
            mystyle(x, y) {
                return `position: absolute;border-radius: 5px;background:#87CEEB;border:2px solid black;left: ${x}px;top: ${y}px;width: 200px;height:100px;`
            },
            editNode(item) {
                this.$emit("editNode", item);
            },
            editLink(item) {
                this.$emit("editLink", item);
            },
            changeSvgUp() {
                for (let n = this.nodes.length - 1; n >= 0; n--) {
                    let node = this.nodes[n]
                    // node.point.x += 10
                    node.point.y += 100
                    node.key = this.generateID()
                }
                for (let n = this.links.length - 1; n >= 0; n--) {
                    let link = this.links[n]
                    // link.point.x += 10
                    link.point.y += 100
                    link.key = this.generateID()
                }
            },
            changeSvgDown() {
                for (let n = this.nodes.length - 1; n >= 0; n--) {
                    let node = this.nodes[n]
                    // node.point.x += 10
                    node.point.y -= 10
                    node.key = this.generateID()
                }
                for (let n = this.links.length - 1; n >= 0; n--) {
                    let link = this.links[n]
                    // link.point.x += 10
                    link.point.y -= 10
                    link.key = this.generateID()
                }
            },
            changeColor(time) {
                for (var node in this.nodes) {
                    if (this.nodes[node].content.time != time) {
                        this.nodes[node].content.color = "#fab1a0"
                        // this.nodes[node].key = this.generateID()
                    } else {
                        this.nodes[node].content.color = "black"
                        // this.nodes[node].key = this.generateID()
                    }
                }
            },
            generateID() {
                return (
                    new Date().getTime().toString(16) +
                    Math.floor(Math.random() * 1000000).toString(16)
                );
            },
            addNode() {
                if (!this.editable) return;
                this.nodeList.push({
                    id: this.generateID(),
                    content: {
                        text: this.name,
                        color: this.color,
                        url: this.url
                    },
                    width: 200,
                    height: 60,
                    point: {
                        x: 10,
                        y: 100 + Math.random() * 100
                    }
                });
            },
            reset() {
                if (!this.createLinkMode) {
                    this.selectedNode = -1;
                    this.selectedLink = -1;
                }
            },
            updateLinkLocation(obj) {
                let item = this.linkList.find(x => x.id === obj.id);
                item.point.x = obj.x;
                item.point.y = obj.y;
            },
            findNode(id) {
                return this.nodes.find(x => x.id === id);
            },
            removeLink(id) {
                this.linkList = this.linkList.filter(x => x.id !== id);
            },
            rect() {
                const rect = this.$refs.field.getBoundingClientRect();
                return {
                    rWidth: this.fluid ? rect.width / this.width : 1,
                    rHeight: this.fluid ? rect.height / this.height : 1
                };
            },
            updateNodeLocation(obj) {
                console.log("updateNodeLocation")
                var item = this.nodeList.find(x => x.key === obj.key);
                item.point.x += obj.x
                item.point.y += obj.y
                console.log(item.key)
                // for (let n = this.nodes.length - 1; n >= 0; n--) {
                //     let node = this.nodes[n]
                //     // node.point.x += 10
                //     node.point.y -= 1
                //     node.key = this.generateID()
                // }

                // for (let n = this.nodes.length - 1; n >= 0; n--) {
                //     let node = this.nodes[n]
                //     // node.point.x += 10
                //     node.point.y -= 1
                //     node.key = this.generateID()
                //     console.log("node.key"+item.key)
                // }
                // for (let n = this.links.length - 1; n >= 0; n--) {
                //     let link = this.links[n]
                //     // link.point.x += 10
                //     link.point.y -= 1000
                //     link.key = this.generateID()
                // }

                // let item = this.nodeList.find(x => x.id === obj.id);
                //  item.point.x = obj.x;
                //  for(var node in this.nodes){
                //      console.log(obj.x+"++++"+obj.y)
                //      this.nodes[node].point.x += obj.x;
                //      this.nodes[node].point.y =  this.nodes[node].point.y+obj.y;
                //      console.log( this.nodes[node].point.x +"*****"+  this.nodes[node].point.y )
                //      //     this.nodes[node].key = this.generateID();
                //      // item.point.y = obj.y;
                //  }
                //  item.point.y = obj.y;
                //  // let item = this.nodeList.find(x => x.id === obj.id);
                // //  for(var node in this.nodes){
                // //      this.nodes[node].point.x += obj.x;
                // //      this.nodes[node].point.y += obj.y;
                // //      console.log( this.nodes[node].point.x +"*****"+  this.nodes[node].point.y )
                // // //     this.nodes[node].key = this.generateID();
                // //      // item.point.y = obj.y;
                // //  }

            },
            selectNode(id) {
                this.selectedNode = id;
                if (document.getElementById(id).style.visibility == "hidden") {
                    document.getElementById(id).style.visibility = ""
                } else {
                    document.getElementById(id).style.visibility = "hidden"
                }
                this.$emit("selectNode", id)
            },
            showController() {
                console.log("showContrller")
            },
            selectLink(id) {
                this.selectedLink = id;
            },
            toggleSrcSelect() {
                this.createLinkMode = !this.createLinkMode;
            },
            commitDest(id) {
                let src = this.nodeList.find(x => x.id === this.selectedNode);
                let dest = this.nodeList.find(x => x.id === id);
                this.linkList.push({
                    id: this.generateID(),
                    source: this.selectedNode,
                    destination: id,
                    point: {
                        x: (src.point.x + dest.point.x) * 0.5,
                        y: (src.point.y + dest.point.y) * 0.5
                    }
                });
                this.createLinkMode = false;
                this.selectedNode = -1;
            },
            removeNode(id) {
                const nodes = this.nodeList.filter(x => x.id !== id);
                this.nodeList = nodes;
                const links = this.linkList.filter(x => {
                    return x.source !== id && x.destination !== id;
                });
                this.linkList = links;
                this.createLinkMode = false;
            },
            copyNode() {
                this.changeY()
                // if (!this.editable) return;
                // this.nodeList.push({
                //   id: this.generateID(),
                //   content: {
                //     text: node.content.text,
                //     color: node.content.color,
                //     url: node.content.url
                //   },
                //   width: node.width,
                //   height: node.height,
                //   point: {
                //     x: node.point.x + 30,
                //     y: node.point.y + 30
                //   },
                //   shape: node.shape
                // });
            }
        },

    };
</script>
<style>
    .button {
        cursor: pointer;
    }

    .grab {
        cursor: grab;
    }
</style>
