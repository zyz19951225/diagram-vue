<template>
        <svg class="icon" aria-hidden="true">
            <use
                    :xlink:href="xlinkHref"></use>
        </svg>

</template>

<script>
    export default {
        name  : 'SketchIcon',
        props : {
            type : {
                type     : String,
                required : true,
            },
        },
        computed : {
            xlinkHref() {
                return `#${this.type}`;
            },
        },
    };
</script>

<style scoped lang="less">
    .sketch-icon {
        .icon {
            width: 30px;
            height: 30px;
            vertical-align: -0.15em;
            fill: black;
            overflow: hidden;
        }
    }
</style>

