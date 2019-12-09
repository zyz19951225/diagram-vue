<template>

    <g>
        <g>
            <text
                    v-if="selected"
                    :x="x + 5"
                    :y="y + node.height + 22"
                    class="button"
                    fill="#00b894"
                    @click="editCandidate"
            >
                {{ labels.edit || "Edit" }}
            </text>
            <text
                    v-if="selected"
                    :x="x + 5"
                    :y="y - 10"
                    class="button"
                    fill="#00b894"
                    stroke="none"
                    @click="toggleSelect"
            >
                {{
                !createLinkMode ? labels.link || "Link" : labels.cancel || "Cancel"
                }}
            </text>
            <text
                    v-if="selected"
                    :x="x + 100"
                    :y="y - 10"
                    class="button"
                    fill="orange"
                    @click="copy"
            >
                {{ labels.copy || "Copy" }}
            </text>
            <text
                    v-if="selected"
                    :x="x + 65"
                    :y="y + node.height + 22"
                    class="button"
                    fill="#ff7675"
                    @click="remove"
            >
                {{ labels.remove || "Remove" }}
            </text>
            <text
                    v-if="createLinkMode && !selected"
                    :x="x + 5"
                    :y="y - 10"
                    class="button"
                    fill="#ff7675"
                    @click="commitDest"
            >
                {{ labels.select || "Select" }}
            </text>
        </g>
        <g>
            <ellipse
                    v-if="node.shape === 'ellipse'"
                    class="grab"
                    :cx="x + node.width / 2"
                    :cy="y + node.height / 2"
                    :width="node.width"
                    :height="node.height"
                    :rx="node.width / 2"
                    :ry="node.height / 2"
                    :fill="content.color || '#ecf0f1'"
                    @mousedown="mousedown"
                    @click="myclick"
                    @mouseup="mouseup"
            />
            <rect
                    v-else
                    class="grab"
                    :x="x"
                    :y="y"
                    :width="node.width"
                    :height="node.height"
                    rx="5"
                    ry="3"
                    :fill="content.color || '#ecf0f1'"
                    @mousedown="mousedown"
                    @click="myclick"
                    @mouseup="mouseup"
                    style="fill:red;stroke:black;stroke-width:5px;opacity:0.5"
            />

        </g>
        <rect
                class="grab"
                :x="x"
                :y="y"
                :width="node.width"
                :height="node.height / 2"
                rx="5"
                ry="3"
                :fill="content.color || '#ecf0f1'"
                @mousedown="mousedown"
                @click="myclick"
                @mouseup="mouseup"
        />
        <text
                :x="x + node.width / 3"
                :y="y + node.height / 4"
                fill="#34495e"
                font-family="Meiryo UI, sans-serif"
                font-size="20"
                text-anchor="middle"
        >
            Msp版本管理
        </text>
        <rect
                class="grab"
                :x="x"
                :y="y + node.height / 2"
                :width="node.width / 2"
                :height="node.height / 2"
                rx="5"
                ry="3"
                :fill="content.color || '#ecf0f1'"
                @mousedown="mousedown"
                @click="myclick"
                @mouseup="mouseup"
        />
        <!--图标位置二-->
        <sketch-icon
                :x="x + 190"
                :y="y + 8"
                width="25"
                height="25"
                type="icon-bug"/>
        <!--图标位置一-->
        <sketch-icon
                :x="x + 220"
                :y="y + 8"
                width="25"
                height="25"
                type="icon-icon-test"/>

        <!--选中位置-->
        <sketch-icon
                :x="x+5"
                :y="y + 8"
                width="25"
                height="25"
                type="icon-xuanzhong1"/>
        <text
                :x="x + node.width / 4"
                :y="y + node.height / 1.2"
                fill="#34495e"
                font-family="Meiryo UI, sans-serif"
                font-size="20"
                text-anchor="middle"
        >
            bug数量
        </text>

        <rect
                class="grab"
                :x="x + node.width / 2"
                :y="y + node.height / 2"
                :width="node.width / 2"
                :height="node.height / 2"
                rx="5"
                ry="3"
                :fill="content.color || '#ecf0f1'"
                @mousedown="mousedown"
                @click="myclick"
                @mouseup="mouseup"
        />
        <text
                :x="x + node.width / 1.3"
                :y="y + node.height / 1.2"
                fill="#34495e"
                font-family="Meiryo UI, sans-serif"
                font-size="20"
                text-anchor="middle"
        >
            中心选择
        </text>
    </g>


</template>
<script>
import VueEvent from "../demo/VueEnvent"
import mouseLocation from "../mouseLocation";
import SketchIcon from "./SketchIcon"

export default {
    components: {SketchIcon},
    mixins: [mouseLocation],
    props: {
        node: {
            width: Number,
            height: Number,
            id: String,
            content: {
                text: String,
                url: String,
                color: String,
                time: String
            },
            point: {
                type: Object,
                default: {
                    x: 0,
                    y: 0
                }
            },
            shape: {
                type: String,
                default: "rectangle"
            },
            key: {
                type: String,
                default: "randomkey"
            }
        },
        editable: Boolean,
        createLinkMode: Boolean,
        selected: Boolean,
        labels: Object,
        scale: String,
        rWidth: Number,
        rHeight: Number
    },
    watch: {
        node(newVal) {
            console.log(newVal)
                console.log("watch!!!!!!!")
                this.x = this.node.point.x;
                this.y = this.node.point.y;
            },
        immediate: true,
        deep: true

    },
    data() {
        return {
            startPosition: null,
            cursorOffset: {
                x: 0,
                y: 0
            },
            id: this.node.id,
            key:this.node.key,
            x: this.node.point.x,
            y: this.node.point.y,
            content: this.node.content,
            dialogVisible: false
        };
    },
    methods: {
        isSelect(){
          console.log("isSelect")
        },
        myclick() {
            console.log("myclick")
        },
        toggleSelect() {
            this.$emit("toggleSelect");
        },
        commitDest() {
            this.$emit("commitDest", this.id);
        },
        remove() {
            this.$emit("remove", this.id);
        },
        copy() {
            this.$emit("copy", this.node);
        },
        // mousedown(e) {
        //     // console.log(this.$root.$children[0].Bus.$emit("a",123))
        //     VueEvent.$emit("select", this.id)
        //     console.log("mouseDown!!!");
        //     this.$emit("select", this.id);
        //     console.log(this.id)
        //     //if (!this.editable) return;
        //     const [x, y] = this.getLocation(e);
        //     console.log("mousedown's-x --- y"+this.x+"--*--"+this.y)
        //     this.cursorOffset.x = x;
        //     this.cursorOffset.x = x;
        //     this.cursorOffset.y = y;
        //     this.startPosition = { x: this.x, y: this.y };
        //     document.addEventListener("mousemove", this.mousemove);
        //     document.addEventListener("mouseup", this.mouseup);
        // },
        mousemove(e) {
            console.log("mousemove!!!");
            if (this.startPosition) {
                e.preventDefault();
                const [x, y] = this.getLocation(e);
                console.log("mousemoveTo-x---y"+x+"--*--"+y)
                console.log("startPosition-x---y"+this.startPosition.x+"--*--"+this.startPosition.y)
                this.x = x - this.startPosition.x
                    // this.startPosition.x +
                    // (x - this.cursorOffset.x) / this.rWidth / parseFloat(this.scale);
                this.y = y - this.startPosition.y
                    // this.startPosition.y +
                    // (y - this.cursorOffset.y) / this.rHeight / parseFloat(this.scale);
                console.log("相位差值---"+this.x+"**-**"+this.y)
                console.log(this.id)
                this.$emit("updateLocation", {
                    key: this.key,
                    x: this.x,
                    y: this.y
                });
            }
        },
        // mouseup() {
        //     console.log("mouseUp!!!");
        //     this.startPosition = null;
        //     document.removeEventListener("mousemove", this.mousemove);
        //     document.removeEventListener("mouseup", this.mouseup);
        // },

        editCandidate() {
            this.$emit("editNode", {
                id: this.id,
                shape: this.node.shape,
                width: this.node.width,
                height: this.node.height,
                content: this.content
            });
        }
    }
};
</script>
<style lang="scss" scoped>
    .shadow {
        filter: drop-shadow(1px 1px 3px rgba(0, 0, 0, 0.3));
        -webkit-filter: drop-shadow(1px 1px 3px rgba(0, 0, 0, 0.3));
        -moz-filter: drop-shadow(1px 1px 3px rgba(0, 0, 0, 0.3));
    }

    .button {
        cursor: pointer;
    }
</style>
