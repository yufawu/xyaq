/**
* @Description:    含有label标签、输入框
* @Author:         TSY
* @CreateDate:     2018/7/6 16:56
*/
<template>
    <div class="place">
        <span class="place_text">{{ label }}</span>
        <input :type="type" :value="value" @input="updateVal" :placeholder="placeholder" :disabled="disabled" :style="{ 'text-align': textAlign }">
    </div>
</template>

<script>
    export default {
        name: "LabelInput",
        props: {
            disabled: {
                type: Boolean,
                default: false
            },
            type: {
                type: String,
                default: 'text'
            },
            label: {
                type: String,
                default: ''
            },
            placeholder: {
                type: String,
                default: ''
            },
            textAlign: {
                type: String,
                default: 'left'
            },
            value: {
                type: String,
                default: ''
            }
        },
        methods: {
            updateVal(event) {
                let val = event.target.value;
                this.$emit('input', val);
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .place {
        display flex
        align-items center
        paddingAround()
        borderTop()
    }

    .place_text {
        fontSize(32px)
    }

    .place input {
        width 0
        flex-grow 1
        border none
    }

    input[disabled],input:disabled,input.disabled {
        background #ffffff
        color main-font-color
        -webkit-text-fill-color main-font-color
        -webkit-opacity 1
        opacity 1
    }
</style>