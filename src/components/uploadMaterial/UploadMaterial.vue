<!--/**-->
<!--* @Description:    问卷列表-->
<!--* @Author:         TSY-->
<!--* @CreateDate:     2018/6/9 13:28-->
<!--*/-->

<template>
    <div>
        <no-data-tips :data="questionnaireData"></no-data-tips>
        <vue-better-scroll ref="wrapper" class="questionnaire_bg"
                           :pullDownRefresh="pullDownRefreshObj"
                           :pullUpLoad="pullUpLoadObj"
                           :startY="0"
                           @pullingDown="loadUp" @pullingUp="loadBottom" :style="{'padding-bottom': marginBottom}">
            <ul ref="wrapperul" :style="{'margin-top': marginTop, 'margin-bottom': marginBottom}">
                <li class="questionnaire" v-for="(item,index) in questionnaireData" :key="index">
                    <div class="questionnaire_info">
                        <p class="questionnaire_title">{{ item.question_title }}</p>
                        <p class="questionnaire_time">{{ item.create_time }}</p>
                        <p v-if="item.is_finish==0" class="questionnaire_state">收集中</p>
                        <p v-else-if="item.is_finish==1" class="questionnaire_state">已结束</p>
                        <p v-else class="questionnaire_state_over">已发布</p>
                    </div>
                    <div>
                        <div class="questionnaire_action" v-if="user.type == 1">
                            <button class="questionnaire_detail click_item"
                                    @click="intoQuestionnaireCheck(item.question_id)">查看问卷
                            </button>
                            <button class="questionnaire_count click_item"
                                    @click="intoQuestionnaireCount(item.question_id)">查看统计
                            </button>
                        </div>
                        <div class="questionnaire_action" v-else>
                            <button v-if="item.is_commit == 0" class="questionnaire_count click_item"
                                    @click="intoQuestionnaireCheck(item.question_id)">填报问卷
                            </button>
                            <button v-else class="questionnaire_count click_item"
                                    @click="intoQuestionnaireCheck(item.question_id)">查看问卷
                            </button>
                        </div>
                    </div>
                </li>
            </ul>
            <!-- 数据不足一屏时，填充背景色 -->
            <fill-box></fill-box>
        </vue-better-scroll>
    </div>
</template>

<script>
    import * as api from '../../constant/api'
    import NoDataTips from "../common/NoDataTips";
    import {checkPlatform, isWeixin, isIphoneX} from "../../utils/util";
    import FillBox from "../common/FillBox";

    export default {
        name: "uploadMaterial",
        components: {FillBox, NoDataTips},
        data() {
            return {
                questionnaireData: [],//问卷调查数据
                page: 1,//当前加载的页数
                // 这个配置用于做下拉刷新功能，默认为 false。当设置为 true 或者是一个 Object 的时候，可以开启下拉刷新，可以配置顶部下拉的距离（threshold） 来决定刷新时机以及回弹停留的距离（stop）
                pullDownRefreshObj: {
                    threshold: 90,
                    stop: 40
                },
                // 这个配置用于做上拉加载功能，默认为 false。当设置为 true 或者是一个 Object 的时候，可以开启上拉加载，可以配置离底部距离阈值（threshold）来决定开始加载的时机
                pullUpLoadObj: {
                    threshold: 0,
                    txt: {
                        more: '加载更多',
                        nomore: '没有更多数据了'
                    }
                },
                startY: 0,//纵轴方向初始化位置
                clientQuery: {'account_id': '', 'pid': ''},//获取客户端url传值
                top: '0',
                bottom: '0',
                isIphoneBack: false,//判断是否为iPhone返回，兼容下拉刷新控件
                isIphoneIn: false,//判断是否为iPhone进入，兼容下拉刷新控件
            }
        },
        computed: {
            user() {
                return this.$store.getters.userInfo;
            },
            marginTop() {
                return this.top + 'px'
            },
            marginBottom() {
                return this.bottom + 'px'
            }
        },
        beforeRouteEnter(to, from, next) {
            if ((from.name == 'questionnaireCheck' || from.name == 'questionnaireCount') && checkPlatform() == 2) {
                next(vm => {
                    vm.isIphoneBack = true;
                });
            } else if (from.name != 'questionnaireCheck' && from.name != 'questionnaireCount' && checkPlatform() == 2) {
                next(vm => {
                    vm.isIphoneIn = true;
                });
            } else {
                next();
            }
        },
        mounted() {
            this.getQuestionnaireList();
            //适配兼容IOSAPP下拉刷新控件 【微信浏览器正常显示，无需兼容】
            if (!isWeixin()) {
                setTimeout(() => {
                    if (this.isIphoneBack) {
                        if (isIphoneX()) {
                            this.top = 80;
                        } else {
                            this.top = 60;
                        }
                    }
                    if (this.isIphoneIn) {
                        if (isIphoneX()) {
                            this.bottom = 20;
                        }
                    }
                }, 60)
            }
        },
        methods: {
            getQuestionnaireList() {//获取问卷列表
                let params = {
                    'account_id': this.user.accountID || this.$route.query.account_id,
                    'pid': this.user.PID || this.$route.query.pid,
                    'page': this.page
                };
                this.http(this, (this.user.baseURL || this.$route.query.host) + api.GET_QUESTIONNAIRE_LIST, params, (res) => {
                    if (res.status == 1) {
                        if (this.page == 1) {
                            this.questionnaireData = res.data;
                        } else {
                            this.questionnaireData = this.questionnaireData.concat(res.data);
                        }
                        // 在刷新数据完成之后，调用此方法，通知加载完成。（下拉刷新回弹到顶部，上拉加载回弹到底部）
                        this.$refs.wrapper.forceUpdate(true);
                    } else {
                        this.$toast(res.msg);
                        // 没有数据之后，改为false，再次上拉不会加载数据
                        this.$refs.wrapper.forceUpdate(false);
                    }
                });
            },
            loadUp() {
                this.page = 1;
                this.getQuestionnaireList();
            },
            loadBottom() {
                this.page++;
                this.getQuestionnaireList();
            },
            intoQuestionnaireCheck(index) {//查看问卷
                if (this.user.accountID) {
                    this.$router.push({name: 'questionnaireCheck', params: {id: index}});
                } else {
                    this.$router.push({
                        name: 'questionnaireCheck',
                        params: {id: index},
                        query: {
                            account_id: this.$route.query.account_id,
                            pid: this.$route.query.pid,
                            host: this.$route.query.host
                        }
                    });
                }
            },
            intoQuestionnaireCount(index) {//查看问卷统计
                if (this.user.accountID) {
                    this.$router.push({name: 'questionnaireCount', params: {id: index}});
                } else {
                    this.$router.push({
                        name: 'questionnaireCount',
                        params: {id: index},
                        query: {
                            account_id: this.$route.query.account_id,
                            pid: this.$route.query.pid,
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

    .questionnaire_bg {
        width 100%
        height 100vh
        padding px2vw(40px) px2vw(32px)
        background bg-color
    }

    .questionnaire {
        padding-top 5%
        margin-bottom 6%
        border-radius 5px
        background white
    }

    .questionnaire_info {
        padding 0 5%
    }

    .questionnaire_title {
        font-size 4.5vw
        font-weight bold
    }

    .questionnaire_time {
        color vice-font-color
        margin-top 1%
    }

    .questionnaire_state {
        color green-color
        margin 4% 0
    }

    .questionnaire_state_over {
        @extend .questionnaire_state
        color vice-font-color
    }

    .questionnaire_action {
        display flex
        borderTop()
    }

    .questionnaire_detail {
        width 0
        flex-grow 1
        justify-content center
        background white
        padding 4% 0
        color main-color
    }

    .questionnaire_count {
        @extend .questionnaire_detail
        borderLeft()
    }

</style>