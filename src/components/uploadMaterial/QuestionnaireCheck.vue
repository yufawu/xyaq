/**
* @Description:    查看问卷
* @Author:         TSY
* @CreateDate:     2018/6/9 13:28
*/

<template>
    <div class="ques_body">
        <div class="ques_title">{{ questionnaireData.title }}</div>
        <div class="ques_desc">{{ questionnaireData.desc }}</div>
        <div class="ques_item" v-for="(ques,index) in questionnaireData.items" :key="index">
            <div class="ques_item_title" v-html="index+1 + '.' +ques.title">
                <span v-if="ques.necessary" class="ques_item_necessary">*</span>
            </div>
            <div class="ques_item_content">
                <div v-if="ques.type=='radio'||ques.type=='checkbox'" class="ques_item_content_selector"
                     v-for="(choice,i) in ques.choices" :key="i">
                    <input :type="ques.type" :disabled="isDisabled" v-model="answerData[index]" :value="choice.subject_id">{{
                    choice.title }}
                </div>
                <div v-else-if="ques.type=='text'" class="ques_item_content_selector">
                    <textarea v-model="answerData[index]" rows="5" :disabled="isDisabled" maxlength="180"></textarea>
                </div>
                <div v-else-if="ques.type=='file'" class="ques_item_content_selector">
                    <label :for="'file'+index">
                        <img class="ques_item_upload_img" :src="fileImg[index]" :ref="'uploadImg'+index">
                    </label>
                    <p v-if="questionnaireData.is_fill == 1" class="ques_item_upload_file_name">{{ fileImg[index].substring(fileImg[index].lastIndexOf("/") + 1) }}</p>
                    <upload-file :disable="isDisabled" :index="index" @complete="uploadFile"></upload-file>
                </div>
            </div>
        </div>
        <div class="save">
            <button v-if="user.type != 1 && questionnaireData.is_fill == 0" class="save_btn" @click="sendData">提交</button>
            <!--<button class="save_btn" @click="create">新建</button>-->
        </div>
    </div>
</template>

<script>
    import * as api from '../../constant/api'
    import UploadFile from "../common/UploadFile";

    export default {
        name: "questionnaireCheck",
        components: {UploadFile},
        data() {
            return {
                isDisabled: true,//是否禁用选择
                questionnaireID: 0,//问卷ID
                questionnaireData: {},
                answerData: [],
                fileImg: []
            }
        },
        computed: {
            user() {
                return this.$store.getters.userInfo;
            }
        },
        mounted() {
            //获取路由参数
            this.questionnaireID = this.$route.params.id;

            this.getQuestionnaireData();

            if (this.user.type != 1) {//学校用户可填写
                this.isDisabled = false;
            }
        },
        methods: {
            getQuestionnaireData() {
                let params = {
                    'id': this.questionnaireID,
                    'account_id': this.user.accountID || this.$route.query.account_id
                }
                this.http(this, (this.user.baseURL || this.$route.query.host) + api.GET_QUESTIONNAIRE_DETAIL, params, (res) => {
                    if (res.status == 1) {
                        this.questionnaireData = res.data;
                        this.setAnswerData();
                        if (this.questionnaireData.is_fill == 1){
                            this.isDisabled = true;
                        }
                    } else {
                        this.$bottomToast(res.msg);
                    }
                })
            },
            uploadFile(file, fileName, index, fileType) {//上传附件
                //显示图片DOM
                let imgDOM = this.$refs['uploadImg' + index];
                let params = {
                    'file': file,
                    'fileName': fileName,
                    'webHost': (this.user.baseURL || this.$route.query.host).substring(0, (this.user.baseURL || this.$route.query.host).length - 1)
                };
                this.$axiosUpload(api.UPLOAD_FILES, params, (res) => {
                    if (res.status == 1) {
                        let fileURL = (this.user.baseURL || this.$route.query.host).substring(0, (this.user.baseURL || this.$route.query.host).length - 1) + res.img_url;
                        if (fileType == 'image') {
                            imgDOM[0].src = fileURL;
                            this.fileImg[index] = fileURL;
                        } else {
                            imgDOM[0].src = require('../../assets/specialCheck/file.png');
                            this.fileImg[index] = require('../../assets/specialCheck/file.png');
                        }
                        this.answerData[index] = res.img_url;
                    }
                    this.$bottomToast(res.msg);
                })
            },
            sendData() {//提交问卷
                let len = this.questionnaireData.items.length;
                for (let i = 0; i < len; i++) {
                    if (this.questionnaireData.items[i].necessary && this.answerData[i] == '') {
                        this.$toast('第' + (i + 1) + '题为必填项，不允许为空！');
                        return
                    }
                }
                let questionArr = [];
                for (let i = 0; i < len; i++) {
                    if(this.questionnaireData.items[i].choices.length > 1){//为单选或多选题
                        let clen = this.questionnaireData.items[i].choices.length;
                        for(let j=0;j<clen;j++){
                            questionArr.push({
                                'subject_id': this.questionnaireData.items[i].choices[j].subject_id,
                                'is_aswer': this.answerData[i].includes(this.questionnaireData.items[i].choices[j].subject_id) ? 1 : 0,
                                'aswer': '',
                                'submit_id': '0',
                                'type': this.questionnaireData.items[i].type
                            })
                        }
                    }else {//文件或填空题
                        questionArr.push({
                            'subject_id': this.questionnaireData.items[i].subject_id,
                            'is_aswer': 1,
                            'aswer': this.answerData[i],
                            'submit_id': '0',
                            'type': this.questionnaireData.items[i].type
                        })
                    }
                }
                let params = {
                    'id': this.questionnaireID,
                    'account_id': this.user.accountID || this.$route.query.account_id,
                    'is_fill': 0,
                    'pid': this.user.PID || this.$route.query.pid,
                    'question_arr': JSON.stringify(questionArr)
                }
                this.http(this, (this.user.baseURL || this.$route.query.host) + api.PUSH_QUESTIONNAIRE, params, (res) => {
                    if (res.status == 1) {
                        this.$bottomToast('提交成功');
                        if (this.user.accountID) {
                            this.$router.replace({name: 'uploadMaterial'})
                        } else {
                            this.$router.push({
                                name: 'uploadMaterial',
                                query: {
                                    account_id: this.$route.query.account_id,
                                    pid: this.$route.query.pid,
                                    host: this.$route.query.host
                                }
                            });
                        }
                    } else {
                        this.$bottomToast('提交失败，请重新提交');
                    }
                })
            },
            setAnswerData() {
                if (!this.questionnaireData.items) {
                    return;
                }
                if (this.answerData.length < this.questionnaireData.items.length) {
                    //根据问题初始化答案
                    let items = this.questionnaireData.items;
                    if(this.questionnaireData.is_fill == 0){
                        for (let i = 0; i < items.length; i++) {
                            if (items[i].type == 'checkbox') {
                                this.answerData.push([]);
                                this.fileImg.push([]);
                            } else if (items[i].type == 'file') {
                                this.answerData.push('');
                                this.fileImg.push(require('../../assets/specialCheck/add_picture.png'));
                            } else {
                                this.answerData.push('');
                                this.fileImg.push('');
                            }
                        }
                    } else {
                        for (let i = 0; i < items.length; i++) {
                            if (items[i].type == 'radio') {
                                for (let j=0;j<items[i].choices.length;j++){
                                    if (items[i].choices[j].is_aswer == 1){
                                        this.answerData.push(items[i].choices[j].subject_id);
                                        this.fileImg.push([]);
                                    }
                                }
                            }else if (items[i].type == 'checkbox') {
                                let arr = [];
                                for (let j=0;j<items[i].choices.length;j++){
                                    if (items[i].choices[j].is_aswer == 1){
                                        arr.push(items[i].choices[j].subject_id);
                                    }
                                }
                                this.answerData.push(arr);
                                this.fileImg.push([]);
                            } else if (items[i].type == 'file') {
                                this.answerData.push('');
                                if (items[i].is_img == 1){
                                    this.fileImg.push((this.user.baseURL || this.$route.query.host) + items[i].aswer);
                                } else {
                                    this.fileImg.push(require('../../assets/specialCheck/file.png'));
                                }
                            } else {
                                this.answerData.push(items[i].aswer);
                                this.fileImg.push('');
                            }
                        }
                    }
                }
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    input[type='radio'] {
        background: url("../../assets/taskPublish/checkbox_round.png") no-repeat center;
    }

    input[type='radio']:checked {
        background: url("../../assets/taskPublish/checkbox_check.png") no-repeat center;
    }

    input[type='checkbox'] {
        background: url("../../assets/check_box.png") no-repeat center;
    }

    input[type='checkbox']:checked {
        background: url("../../assets/check_box_checked.png") no-repeat center;
    }

    input[type='checkbox'], input[type='radio'] {
        width: px2vw(46px);
        height: px2vw(46px);
        -webkit-appearance: none;
        border: none;
        background-size px2vw(44px) px2vw(44px)
        outline: none;
    }

    input[type='checkbox']:checked, input[type='radio']:checked {
        background-size px2vw(44px) px2vw(44px)
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
        display flex
        align-items center
        position relative
        margin 3% 0
    }

    .ques_item_content_selector textarea {
        width 100%
    }

    .ques_item_upload_img {
        width 40%
    }

    .save {
        width 100%
        text-align center
    }

    .save_btn {
        width 80%
        padding 3% 0
        background main-color
        color white
        border-radius 8px
        margin-top 10%
    }
</style>