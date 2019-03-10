/**
* @Description:    任务填报、编辑、查看
* @Author:         yufawu
* @CreateDate:     2018/8/25 14:20
*/
<template>
    <div class="wrapper">
        <div class="ques_body">
            <div class="ques_title">{{ questionnaireData.task_title }}</div>
            <div class="ques_desc">{{ questionnaireData.create_user }} {{ questionnaireData.create_time }}</div>
            <div class="ques_item" v-for="(ques,index) in questionnaireData.subject_arr" :key="index">
                <div class="ques_item_title">{{index + 1}}.{{ ques[0].subject_title }}</div>
                <div class="ques_item_content">
                    <div v-if="ques[0].type=='1'||ques[0].type=='2'" class="ques_item_content_selector"
                         v-for="(choice,i) in ques" :key="i">
                        <input :type="choice.type == 1 ? 'radio' : 'checkbox'" :disabled="isDisabled"
                               :name="'check'+index" v-model="answerData[index]" :value="choice.subject_id">{{
                        choice.aswer_title }}
                    </div>
                    <div v-else-if="ques[0].type=='3'" class="ques_item_content_selector">
                        <textarea v-model="answerData[index]" rows="5" :disabled="isDisabled"
                                  maxlength="180"></textarea>
                    </div>
                    <div v-else-if="ques[0].type=='4'" class="ques_item_content_selector">
                        <label :for="'file'+index">
                            <img v-if="taskType == 3" class="ques_item_upload_img" :src="fileImg[index]"
                                 @click="previewImg(fileImg[index])" :ref="'uploadImg'+index">
                            <img v-else class="ques_item_upload_img" :src="fileImg[index]"
                                 :ref="'uploadImg'+index">
                        </label>
                        <p v-if="taskType != 1" class="ques_item_upload_file_name">{{ answerData[index] ?
                            answerData[index].filename : '无附件' }}</p>
                        <upload-file :disable="isDisabled" :index="index" @complete="uploadFile"></upload-file>
                    </div>
                </div>
            </div>
            <div class="save">
                <button v-if="user.type != 1 && taskType != 3" class="save_btn" @click="submitMask">完成</button>
            </div>
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
                questionnaireData: {},//任务数据
                answerData: [],//任务答案数据
                fileImg: [],//填充的图片
                isConfirmSubmit: false,
            }
        },
        computed: {
            user() {
                return this.$store.getters.userInfo;
            },
            taskID() {
                return this.$store.getters.taskPublishListID || this.$route.query.task_id;
            },
            taskType() {
                return this.$store.getters.taskPublishListTitle || this.$route.query.task_type;
            },
            createUser() {
                return this.$store.getters.taskPublishCreateUser || this.$route.query.create_user;
            }
        },
        activated() {
            if (!this.$route.meta.isBack) {//当前操作不是返回的时候，调用方法获取数据，否则使用meta中keepAlive属性设置的路由缓存数据
                this.getQuestionnaireData();
            }
            this.$route.meta.isBack = false;//每次都重置该值，避免返回之后isBack一直为true，后续无法加载数据
        },
        beforeRouteEnter(to, from, next) {
            if (from.name == 'imageVideoPreview') {
                to.meta.isBack = true;
            }
            next();
        },
        mounted() {
            //获取路由参数
            this.questionnaireID = this.$route.params.id;

            if (this.user.type != 1) {//学校用户可填写
                this.isDisabled = false;
            }
            if (this.taskType == 3) {
                this.isDisabled = true;
            }
        },
        methods: {
            submitMask() {
                let len = this.questionnaireData.subject_arr.length;
                for (let i = 0; i < len; i++) {
                    if (this.answerData[i] == '') {
                        this.$toast('第' + (i + 1) + '题为必填项，不允许为空！');
                        return
                    }
                }
                //使用mint-ui确认框
                this.$messagebox({
                    title: '温馨提示',
                    message: '是否立即提交，提交后不可再修改！',
                    showCancelButton: true,
                    cancelButtonText: '保存'
                }).then(action => {
                    console.log(action)
                    if (action == 'confirm') {
                        this.isConfirmSubmit = true;
                    }
                    this.sendData();
                }).catch(e => {
                    console.log(e);
                });
            },
            taskSubmitConfirm() {
                let params = {
                    'school_task_id': this.taskID,
                    'create_user': this.$route.query.user_name || this.user.userName
                }
                this.http(this, (this.user.baseURL || this.$route.query.host) + api.SCHOOL_TASK_SUBMITINFO, params, (res) => {
                    this.$bottomToast(res.msg);
                    this.$router.back();
                })
            },
            getQuestionnaireData() {
                this.questionnaireData = [];
                let params = {
                    'account_id': this.user.accountID || this.$route.query.account_id,
                    'school_task_id': this.taskID,
                    'do_type': this.taskType
                }
                this.http(this, (this.user.baseURL || this.$route.query.host) + api.SCHOOL_TASK_VIEWINFO, params, (res) => {
                    if (res.status == 1) {
                        this.questionnaireData = res.data;
                        this.questionnaireID = res.school_task_id;
                        this.setAnswerData();
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
                this.$axiosUpload(api.SCHOOL_TASK_FILE_UPLOAD, params, (res) => {
                    if (res.status == 1) {
                        let fileURL = (this.user.baseURL || this.$route.query.host) + 'Uploads/edu_task/' + res.download.savepath + res.download.savename;
                        if (fileType == 'image') {
                            imgDOM[0].src = fileURL;
                            this.fileImg[index] = fileURL;
                        } else {
                            imgDOM[0].src = require('../../assets/specialCheck/file.png');
                            this.fileImg[index] = require('../../assets/specialCheck/file.png');
                        }
                        this.answerData[index] = res.download;
                    }
                    this.$bottomToast(res.info);
                })
            },
            sendData() {//提交问卷
                let questionArr = [], questionItemArr = [], quesType = '';
                let len = this.questionnaireData.subject_arr.length;
                for (let i = 0; i < len; i++) {
                    questionItemArr.push([]);
                    quesType = this.questionnaireData.subject_arr[i][0].type;
                    if (quesType == 1 || quesType == 2) {//为单选或多选题
                        let clen = this.questionnaireData.subject_arr[i].length;
                        for (let j = 0; j < clen; j++) {
                            questionItemArr[i].push({
                                'value': this.questionnaireData.subject_arr[i][j].aswer_title,
                                'id': this.questionnaireData.subject_arr[i][j].subject_id,
                                'checkCurr': this.answerData[i].includes(this.questionnaireData.subject_arr[i][j].subject_id),
                            })
                        }
                    } else if (quesType == 4) {//文件题
                        if (this.answerData[i].savepath) { //如果存在savepath，代表新上传的图片，否则拿后台返回文件信息
                            questionItemArr[i].push({
                                'id': this.questionnaireData.subject_arr[i][0].subject_id,
                                'value': 'Uploads/edu_task/' + this.answerData[i].savepath + this.answerData[i].savename,
                                'filename': this.answerData[i].savename,
                                'filesize': this.answerData[i].size
                            })
                        } else {
                            questionItemArr[i].push({
                                'id': this.questionnaireData.subject_arr[i][0].subject_id,
                                'value': this.answerData[i].content,
                                'filename': this.answerData[i].filename,
                                'filesize': this.answerData[i].filesize
                            })
                        }
                    } else { //填空题
                        questionItemArr[i].push({
                            'id': this.questionnaireData.subject_arr[i][0].subject_id,
                            'value': this.answerData[i],
                        })
                    }
                    questionArr.push({
                        'QItemsTitle': this.questionnaireData.subject_arr[i][0].subject_title,
                        'que_type': this.questionnaireData.subject_arr[i][0].type,
                        'qListItems': questionItemArr[i]
                    })
                }
                let params = {
                    'school_task_id': this.questionnaireID,
                    'account_id': this.user.accountID || this.$route.query.account_id,
                    'do_type': this.taskType,
                    'create_user': this.createUser,
                    'json_data': JSON.stringify({'questionItems': questionArr})
                }
                this.http(this, (this.user.baseURL || this.$route.query.host) + api.SCHOOL_TASK_SAVEINFO, params, (res) => {
                    if (res.status == 1) {
                        if (this.isConfirmSubmit) { //直接提交
                            this.taskSubmitConfirm();
                        } else {
                            this.$router.back();
                        }
                    }
                    this.$bottomToast(res.msg);
                })
            },
            setAnswerData() {
                if (!this.questionnaireData.subject_arr) {
                    return;
                }
                if (this.answerData.length < this.questionnaireData.subject_arr.length) {
                    //根据问题初始化答案
                    let items = this.questionnaireData.subject_arr;
                    if (this.taskType == 1) {
                        for (let i = 0; i < items.length; i++) {
                            if (items[i][0].type == '2') {
                                this.answerData.push([]);
                                this.fileImg.push([]);
                            } else if (items[i][0].type == '4') {
                                this.answerData.push('');
                                this.fileImg.push(require('../../assets/specialCheck/add_picture.png'));
                            } else {
                                this.answerData.push('');
                                this.fileImg.push('');
                            }
                        }
                    } else {//
                        for (let i = 0; i < items.length; i++) {
                            if (items[i][0].type == '1') {
                                for (let j = 0; j < items[i].length; j++) {
                                    if (items[i][j].aswer == 1) {
                                        this.answerData.push(items[i][j].subject_id);
                                        this.fileImg.push([]);
                                    }
                                }
                            } else if (items[i][0].type == '2') {
                                let arr = [];
                                for (let j = 0; j < items[i].length; j++) {
                                    if (items[i][j].aswer == 1) {
                                        arr.push(items[i][j].subject_id);
                                    }
                                }
                                this.answerData.push(arr);
                                this.fileImg.push([]);
                            } else if (items[i][0].type == '4') {
                                this.answerData.push(items[i][0]);
                                if (items[i][0].is_img == '1') {
                                    this.fileImg.push((this.user.baseURL || this.$route.query.host) + items[i][0].content);
                                } else {
                                    this.fileImg.push(require('../../assets/specialCheck/file.png'));
                                }
                            } else {
                                this.answerData.push(items[i][0].content);
                                this.fileImg.push('');
                            }
                        }
                    }
                }
            },
            previewImg(url) {//查看大图
                this.$router.push({name: 'imageVideoPreview', params: {'imgURL': url}});
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"
    @import "../../style/public.styl"

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
        display flex
        align-items center
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
        width: px2vw(44px);
        height: px2vw(44px);
        -webkit-appearance: none;
        border: none;
        background-size px2vw(44px) px2vw(44px)
        outline: none;
    }

    input[type='checkbox']:checked, input[type='radio']:checked {
        background-size px2vw(44px) px2vw(44px)
    }
</style>