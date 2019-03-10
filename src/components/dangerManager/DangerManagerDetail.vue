/**
* @Description:    事故详情
* @Author:         TSY
* @CreateDate:     2018/8/13 11:42
*/
<template>
    <div class="body">
        <div class="content">
            <p class="danger_detail"><span>事故详情：</span>{{ dangerDetail }}</p>
            <p class="content_text"><span>事故填报学校：</span>{{ dangerData.account_name }}</p>
            <p class="content_text"><span>事故发生地点：</span>{{ dangerData.place }}</p>
            <p class="content_text"><span>事故发生时间：</span>{{ dangerData.happen_time }}</p>
            <p class="content_text"><span>事故分类：</span>{{ dangerType }}</p>
            <p class="content_text"><span>事故性质：</span>{{ dangerNature }}</p>
            <p class="content_text"><span>事故现状态：</span>{{ dangerStatus }}</p>
            <p class="content_text"><span>事故严重等级：</span>{{ dangerGrade }}</p>
        </div>
        <div v-if="(dangerData.img&&dangerData.img.length>0) || (dangerData.video&&dangerData.video.img)"
             class="img_list">
            <show-img-list :img="dangerData.img"></show-img-list>
        </div>
        <div class="approval" v-if="dangerData.common_list && dangerData.common_list.length > 0">
            <div class="approval_item" v-for="item in dangerData.common_list" :key="item.comment_id">
                <div v-if="item.type == 1" class="approval_item_title">教育局批示（{{ item.update_time }}）：</div>
                <div v-else class="approval_item_title">学校续报（{{ item.update_time }}）：</div>
                <div class="approval_item_detail">{{ item.content }}</div>
            </div>
        </div>
        <div class="approval" v-if="dangerData.status == 3 || dangerData.status == 5">
            <div class="approval_item">
                <div class="approval_item_title">结案报告：</div>
                <div class="approval_item_detail">{{ dangerData.close == '' ? '无' :
                    dangerData.close }}
                </div>
            </div>
        </div>
        <div class="approval" v-if="dangerData.process != ''">
            <div class="approval_item">
                <div class="approval_item_title">处理信息：</div>
                <div class="approval_item_detail">{{ dangerData.process }}
                </div>
            </div>
        </div>
        <!--批示-->
        <div class="approval" v-if="dangerData.status != 5 && dangerData.status != 3">
            <div class="approval_item" v-if="user.type == 1">
                <div class="approval_item_title">教育局批示：</div>
                <textarea rows="5" maxlength="100" v-model="approveContent"></textarea>
            </div>
            <div class="approval_item" v-else>
                <div class="approval_item_title">学校续报：</div>
                <textarea rows="5" maxlength="100" v-model="approveContent"></textarea>
            </div>
        </div>
        <div class="approval"
             v-if="user.type != 1 && dangerData.status != 5 && dangerData.status != 3">
            <div class="approval_item">
                <div class="approval_item_title">结案报告：</div>
                <textarea rows="5" maxlength="100" v-model="reportContent"></textarea>
            </div>
        </div>
        <footer-button v-if="user.type == 1 && dangerData.status != 5 && dangerData.status != 3"
                       text="批示" @click="approve()"></footer-button>
        <div v-else class="school_footer">
            <div class="footer_item" v-if="dangerData.status != 5 && dangerData.status != 3"
                 @click="approve()">续报
            </div>
            <div class="footer_item" v-if="dangerData.status != 5 && dangerData.status != 3"
                 @click="report()">结案
            </div>
        </div>
        <fill-box></fill-box>
    </div>
</template>

<script>
    import * as api from '../../constant/api'
    import FillBox from "../common/FillBox";
    import FooterButton from "../common/FooterButton";
    import ShowImgList from "../common/ShowImgList";
    import {change2grade, change2nature, change2status, change2type, delHtmlTag} from "../../utils/util";

    export default {
        name: "DangerManagerDetail",
        components: {ShowImgList, FooterButton, FillBox},
        data() {
            return {
                approveContent: '',//批示内容
                reportContent: '',//结案报告
                dangerData: {},//隐患数据
            }
        },
        mounted() {
            this.getDangerDetail();
        },
        computed: {
            user() {
                return this.$store.getters.userInfo;
            },
            dangerDetail() {
                return delHtmlTag(this.dangerData.details);
            },
            dangerNature() {
                return change2nature(this.dangerData.nature);
            },
            dangerType() {
                return change2type(this.dangerData.nature);
            },
            dangerStatus() {
                return change2status(this.dangerData.nature);
            },
            dangerGrade() {
                return change2grade(this.dangerData.grade);
            }
        },
        methods: {
            getDangerDetail() {//获取事故详情
                let params = {'accident_id': this.$route.query.accident_id || ''}
                this.http(this, (this.user.baseURL || '/') + api.GET_DANGER_MANAGER_DETAIL, params, (res)=>{
                    if (res.status == 1) {
                        this.dangerData = res.data;
                    } else {
                        this.$bottomToast(res.msg)
                    }
                })
            },
            approve() { //批示
                if (this.approveContent == '') {
                    if (this.user.type == 1) {
                        this.$bottomToast('请输入批示内容')
                    } else {
                        this.$bottomToast('请输入续报内容')
                    }
                    return
                }
                let userName = '';
                if (!this.user.userName || this.user.userName == '请登录') {
                    userName = decodeURIComponent(this.$route.query.user_name).replace(/\\/g, "%");//IOS传过来的是Unicode编码，需要转成中文
                } else {
                    userName = this.user.userName;
                }
                let params = {
                    'accident_id': this.dangerData.accident_id,
                    'account_id': this.user.accountID || this.$route.query.account_id,
                    'comment_name': userName,
                    'type': this.user.type || '2',
                    'content': this.approveContent
                }
                this.http(this, (this.user.baseURL || this.$route.query.host) + api.DANGER_MANAGER_APPROVE, params, (res) => {
                    this.$bottomToast(res.msg)
                    if (res.status == 1) {
                        this.$router.back();
                    }
                })
            },
            report() { //结案报告
                if (this.reportContent == '') {
                    this.$bottomToast('请输入结案内容');
                    return
                }
                let params = {
                    'accident_id': this.dangerData.accident_id,
                    'account_id': this.user.accountID || this.$route.query.account_id,
                    'close': this.reportContent
                }
                this.http(this, (this.user.baseURL || this.$route.query.host) + api.DANGER_MANAGER_REPORT, params, (res) => {
                    this.$bottomToast(res.msg);
                    if (res.status == 1) {
                        this.$router.back();
                    }
                })
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .body {
        background bg-color
        margin-bottom px2vw(60px)
    }

    .content {
        background #fff
        padding px2vw(30px)
    }

    .content_text {
        width 100%
        margin-bottom px2vw(30px)
        text-overflow ellipsis
        overflow hidden
        white-space nowrap
    }

    .danger_detail {
        width 100%
        margin-bottom px2vw(30px)
    }

    .content_text span, .danger_detail span {
        font-weight bold
        fontSize(32px)
    }

    .approval {
        @extends .content
        margin-top px2vw(16px)
    }

    .approval_item {
        margin-bottom px2vw(24px)
    }

    .approval_item_title {
        font-weight bold
        fontSize(32px)
    }

    .approval_item_detail {
        margin-top px2vw(10px)
    }

    .approval_item textarea {
        width 100%
        margin-top px2vw(24px)
    }

    .school_footer {
        position fixed
        display flex
        width 100%
        bottom 0
        left 0
        background main-color
        color white
        z-index 2
    }

    .footer_item {
        width 0
        flex-grow 1
        text-align center
        padding 3% 0
        fontSize(34px)
        borderRight(#ccc)
    }

    .img_list {
        background white
        paddingAround()
    }
</style>