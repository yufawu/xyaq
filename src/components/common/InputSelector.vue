/**
* @Description:    含有label标签、输入框、选择功能
* @Author:         TSY
* @CreateDate:     2018/7/6 16:12
*/
<template>
    <div class="place" @click="!readonly && select()">
        <span class="place_text">{{ label }}</span>
        <input type="text" :value="value" @input="updateVal" :disabled="disable"
               :placeholder="placeholder" :style="{ 'text-align': textAlign }">
        <img src="../../assets/specialCheck/btn_more_small.png">
    </div>
</template>

<script>
    export default {
        name: "InputSelector",
        props: {
            label: {
                type: String,
                default: ''
            },
            placeholder: {
                type: String,
                default: ''
            },
            value: {
                type: [String, Number],
                default: ''
            },
            textAlign: {
                type: String,
                default: 'left'
            },
            disable: {
                type: Boolean,
                default: true
            },
            readonly: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            updateVal(event) {
                let val = event.target.value;
                this.$emit('input', val);
            },
            select() {
                this.$emit('listenSelect');
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
        padding 0 px2vw(10px)
        color main-font-color
    }

    .place img {
        width 2%
    }

    input[disabled],input:disabled,input.disabled {
        background #ffffff
        color main-font-color
        -webkit-text-fill-color main-font-color
        -webkit-opacity 1
        opacity 1
    }
</style>