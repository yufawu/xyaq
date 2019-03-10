/**
* @Description:    发送通知公告
* @Author:         yufawu
* @CreateDate:     2018/9/5 8:59
*/
<template>
    <div>
        <div class="notice">
            <input-selector label="收件人" @click.native="selectReceiver" textAlign="right" placeholder="请选择收件人"
                            v-model="selectedUsers"></input-selector>
            <label-input label="主题：" placeholder="请输入公告标题" v-model="noticeContent.title"></label-input>
            <label-input label="红头：" placeholder="如果不需要红头标题则不填写" v-model="noticeContent.redTitle"></label-input>
            <div class="mark">
                <div class="desc">公告内容：</div>
                <textarea rows="5" maxlength="150" v-model="noticeContent.desc" placeholder="请输入通知公告详细内容"></textarea>
            </div>
            <div class="space"></div>
            <label class="input_label" :for="'file'+0">
                <input-selector label="上传附件：" text-align="right" v-model="fileName"></input-selector>
            </label>
            <upload-file @complete="uploadFile"></upload-file>
            <fill-box></fill-box>
            <footer-button text="发送" @click="noticeSend"></footer-button>
        </div>
    </div>
</template>

<script>
    import * as api from '../../constant/api'
    import * as types from '../../constant/types'
    import FooterButton from "../common/FooterButton"
    import LabelInput from "../common/LabelInput";
    import InputSelector from "../common/InputSelector";
    import FillBox from "../common/FillBox";
    import UploadFile from "../common/UploadFile";

    export default {
        components: {
            UploadFile,
            FooterButton,
            LabelInput,
            InputSelector,
            FillBox
        },
        name: "noticeWrite",
        data() {
            return {
                noticeContent: {
                    title: '',
                    redTitle: '',
                    desc: '',
                },//通知公告内容
                fileName: '',//上传的文件名
                filePath: '',//上传的文件路径
                ids: '',//接收人ID，多人逗号隔开
                isFromNotice: false,//是否从列表进来，是的话，需要清空缓存
            }
        },
        mounted() {
            this.$nextTick(function () {
                if (this.isFromNotice) {//从列表进来需要清空缓存
                    this.isFromNotice = false;
                    this.$store.dispatch(types.SAVE_NOTICE_SELECT_SCHOOL_PEOPLE_IDS, []);
                    this.$store.dispatch(types.SAVE_NOTICE_SELECT_SCHOOL_PEOPLE, []);
                    this.$store.dispatch(types.SAVE_NOTICE_SELECT_EDU_PEOPLE_IDS, []);
                    this.$store.dispatch(types.SAVE_NOTICE_SELECT_EDU_PEOPLE, []);
                }
            })
        },
        beforeRouteEnter(to, from, next) {
            if (from.name == 'notice') {
                next(vm => {
                    vm.isFromNotice = true
                })
            } else {
                next();
            }
        },
        computed: {
            selectedUsers() {//显示选择的人数
                return this.selectPeople[0] && this.selectPeople[0].user_name + '等' + this.selectPeople.length + '人';
            },
            selectPeople() {//选择的人员信息
                return this.$store.getters.noticeSelectSchoolPeople.concat(this.$store.getters.noticeSelectEduPeople)
            },
            user() {//用户信息
                return this.$store.getters.userInfo;
            }
        },
        methods: {
            selectReceiver() {//选择接收人
                if (this.user.type == 1) {
                    this.$router.push({name: 'noticeSelectAccount'});
                } else {
                    this.$router.push({name: 'noticeSelectEduPeople'});
                }
            },
            noticeSend() {//发送通知公告
                if (!this.checkContent() || !this.checkIDs()) {
                    return;
                }
                let params = {
                    'account_id': this.user.accountID,
                    'UserId': this.user.PID,
                    'toUser': this.ids,
                    'title': this.noticeContent.title,
                    'redhead': this.noticeContent.redTitle,
                    'content': this.noticeContent.desc,
                    'accName': this.fileName,
                    'accPath': this.filePath
                }
                this.http(this, (this.user.baseURL || '/') + api.SEND_NOTICE, params, (res) => {
                    this.$bottomToast(res.msg);
                    if (res.status == 1) {
                        this.$router.replace({name: 'notice'})
                    }
                })
            },
            checkIDs() { //验证是否选择收件人
                let idArr = [];
                for (let i in this.selectPeople) {
                    idArr.push(this.selectPeople[i].PID);
                }
                if (idArr.length !== 0) {
                    this.ids = idArr.join(',');
                    return true
                } else {
                    this.$bottomToast('请选择收件人');
                    return false
                }
            },
            checkContent() {//验证必填项是否已填写
                if (this.noticeContent.title.trim() == '') {
                    this.$bottomToast('请填写标题');
                    return false
                }
                if (this.noticeContent.desc.trim() == '') {
                    this.$bottomToast('请填写公告内容');
                    return false
                }
                return true
            },
            uploadFile(file, fileName) {//上传附件
                let params = {
                    'file': file,
                    'fileName': fileName,
                    'webHost': (this.user.baseURL || this.$route.query.host).substring(0, (this.user.baseURL || this.$route.query.host).length - 1)
                };
                this.$axiosUpload(api.SCHOOL_TASK_FILE_UPLOAD, params, (res) => {
                    if (res.status == 1) {
                        this.filePath = 'edu_task/' + res.download.savepath + res.download.savename;
                        this.fileName = res.download.filename;
                    }
                    this.$bottomToast(res.info);
                })
            },
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"
    .notice {
        .space {
            width: 100%
            height: px2vw(20px)
            background: bg-color
        }
        textarea {
            flex 1
            border none
        }
    }

    .mark {
        padding 3% 4%
        borderTop()
        display flex
    }

    .input_label {
        display inline-block
        width 100vw
    }

</style>
