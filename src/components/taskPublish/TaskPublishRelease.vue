**
* @Description:    新建任务（暂时未使用）
* @Author:         yufawu
* @CreateDate:     2018/8/26 15:20
*/
<template>
    <div class="publish">
        <div class="mould">是否使用任务模板
            <i class="iconfont " :class="{'icon-toggleoff': !isActive,'icon-toggleon': isActive }"
               @click="useMould"></i>
        </div>
        <label-input label="任务标题：" placeholder="2018校园暴力伤害报告"></label-input>
        <input-selector label="任务类型：" placeholder="一次性任务"></input-selector>
        <input-selector label="开始时间：" placeholder="2018-08-01"></input-selector>
        <input-selector label="结束时间：" placeholder="2018-09-30"></input-selector>
        <label-input label="任务描述：" placeholder="输入任务详情"></label-input>
        <textarea placeholder="根据学校数字化校园建设的总体部署数字化校园平台校鸽"></textarea>
        <input-selector label="上传附件：" placeholder="报告模板.doc"></input-selector>
        <fill-box></fill-box>
        <footer-button text="选择接收人" @click="selectRecipient"></footer-button>
    </div>
</template>

<script>
    import FooterButton from "../common/FooterButton"
    import LabelInput from "../common/LabelInput";
    import InputSelector from "../common/InputSelector";
    import FillBox from "../common/FillBox";

    export default {
        name: "taskPublishRelease",
        components: {
            FillBox,
            InputSelector,
            LabelInput,
            FooterButton,
        },
        data() {
            return {
                isViewSummary: false,//显示/隐藏 查看总结的内容
                isActive: false,
            }
        },
        methods: {
            useMould() {
                this.isActive = !this.isActive
            },
            selectRecipient() {
                if (this.user.accountID) {
                    this.$router.push({name: 'taskPublishReleaseNext'})
                } else {
                    this.$router.push({
                        name: 'taskPublishReleaseNext',
                        query: {
                            account_id: this.$route.query.account_id,
                            host: this.$route.query.host
                        }
                    });
                }
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"
    @import "../../style/public.styl"
    .publish /deep/ .place_text {
        font-size: px2vw(34px)
    }

    .publish /deep/ .place input {
        font-size: px2vw(30px)
    }

    .mould {
        lineHeight(90px)
        padding: 0 4%
        margin-top: 2%
        fontSize(34px)
        color: black-color
    }

    .mould_img {
        width: 16%
        float: right
    }

    textarea {
        width: 90%
        height: auto
        border: none
        padding: 3%
        font-size: px2vw(30px)
    }

    .icon-toggleoff {
        font-size: 6vh
        float: right
        color: gray-color
    }

    .icon-toggleon {
        font-size: 6vh
        float: right
        color: main-color
    }


</style>