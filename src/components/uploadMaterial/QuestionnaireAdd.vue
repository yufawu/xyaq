/**
 * @Description:    添加问卷
 * @Author:         TSY
 * @CreateDate:     2018/6/19 15:16
 */
<template>
    <div>
        <!--<div class="ques_body">-->
            <!--<input class="ques_title" types="text" v-model="questionnaireData.title">-->
            <!--<input class="ques_desc" types="text" v-model="questionnaireData.desc">-->
            <!--<div class="ques_item" v-if="questionnaireData.items.length>0" v-for="(ques,index) in questionnaireData.items" :key="index">-->
                <!--<div class="ques_item_title">{{ ques.title }}-->
                    <!--<span v-if="ques.necessary" class="ques_item_necessary">*</span>-->
                <!--</div>-->
                <!--<div class="ques_item_content">-->
                    <!--<div v-if="ques.types=='radio'||ques.types=='checkbox'" class="ques_item_content_selector"-->
                         <!--v-for="(choice,i) in ques.choices" :key="i">-->
                        <!--<input disabled="disabled" :types="ques.types" :name="index+1">-->
                        <!--<input class="ques_desc" placeholder="填写问题选项" types="text" v-model="choice">-->
                    <!--</div>-->
                    <!--<div v-else-if="ques.types=='text'" class="ques_item_content_selector">-->
                        <!--<textarea rows="5" maxlength="180"></textarea>-->
                    <!--</div>-->
                    <!--<div v-else-if="ques.types=='file'" class="ques_item_content_selector">-->
                        <!--<label>-->
                            <!--<img class="ques_item_upload_img" src="../assets/img_upload.png">-->
                        <!--</label>-->
                    <!--</div>-->
                <!--</div>-->
            <!--</div>-->
        <!--</div>-->
    </div>
</template>

<script>
    export default {
        name: "questionnaireAdd",
        data() {
            return {
                questionnaireData: {}
            }
        },
        mounted() {
            this.questionnaireData = this.$route.params.questionnaireData;
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    input[type='text'] {
        width 100%
        solidBorder(vice-font-color)
        padding 3%
        border-radius 5px
    }

    input[type='radio'] {
        appearance: radio
    }

    input[type='checkbox'] {
        appearance: checkbox
    }

    .ques_body {
        padding 5% 4%
    }

    .ques_title {
        fontSize(36px)
        font-weight bold
        text-align center
    }

    .ques_desc {
        padding 0 2%
        color vice-font-color
        margin 4% 0
    }

    .ques_item_necessary {
        color red
    }

    .ques_item_title {
        background bg-color
        padding 3%
        fontSize(34px)
        border-radius 5px
    }

    .ques_item_content {
        padding 0% 10%
    }

    .ques_item_content_selector {
        position relative
        margin 3% 0
    }

    .ques_item_content_selector textarea {
        width 100%
    }

    .ques_item_upload_file {
        position absolute
        left -99999px
        top 0
    }

    .ques_item_upload_img {
        width 40%
    }
</style>