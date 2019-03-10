/**
* @Description: 任务详情，任务发布
* @Author:         yufawu
* @CreateDate:     2018/8/28 11:50
*/
<template>
    <div>
        <div class="detail_header">
            <p class="title">{{data.task_title}}</p>
            <p class="subtitle">{{data.create_user}}
                <span class="time">{{data.create_time}}</span>
            </p>
        </div>
        <div class="detail_body">
            <!--<p>任务类型：{{data.task_type}}</p>-->
            <div v-if="user.type == 1">接收人职务：
                <span v-if="job_list.length==0" class="select_job">
                    校长&nbsp;&nbsp;&nbsp;副校长&nbsp;&nbsp;&nbsp;   安全主任
                </span>
                <span  class="select_job" v-for="(item,index) in job_list" :key="index">
                    {{item.dutie_name}}
                </span>
            </div>
            <p>开始时间：{{data.begin_time}}</p>
            <p>结束时间：{{data.end_time}}</p>
            <p>任务附件：<span>{{data.task_file_name}}</span></p>
            <p>任务描述：</p>
            <div class="notice_con" v-html="data.task_desc">
            </div>
            <div class="ques_body">
                <!--  <div class="ques_title">{{ data.task_title }}</div>
                  <div class="ques_desc">{{ data.create_user }}  {{ data.create_time }}</div>-->
                <div class="ques_item" v-for="(ques,index) in data.subject_arr" :key="index">
                    <div class="ques_item_title">{{index + 1}}.{{ ques[0].subject_title }}</div>
                    <div class="ques_item_content">
                        <div v-if="ques[0].type=='1'||ques[0].type=='2'" class="ques_item_content_selector"
                             v-for="(choice,i) in ques" :key="i">
                            <input :type="choice.type == 1 ? 'radio' : 'checkbox'" :disabled="isDisabled"
                                   :name="'check'+index">{{ choice.aswer_title }}
                        </div>
                        <div v-else-if="ques[0].type=='3'" class="ques_item_content_selector">
                            <textarea rows="5" :disabled="isDisabled" maxlength="180"></textarea>
                        </div>
                        <div v-else-if="ques[0].type=='4'" class="ques_item_content_selector">
                            <label>
                                <img class="ques_item_upload_img" src="../../assets/img_upload.png"
                                     :ref="'uploadImg'+index">
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <footer-button v-if="user.type == 1" @click="publish" text="发布" v-show="data.status == 0"></footer-button>
    </div>
</template>

<script>
    import * as api from '../../constant/api'
    import LabelText from "../common/LabelText";
    import FooterButton from "../common/FooterButton";
    import TaskPublish from "./TaskPublish";
    import {sortKey} from "../../utils/util";

    export default {
        components: {
            TaskPublish,
            FooterButton,
            LabelText
        },
        name: "taskNotice",
        data() {
            return {
                data: [],
                isDisabled: true,
            }
        },
        mounted: function () {
            this.getTaskDetail();
        },
        computed: {
            job_list_sort() {//用户选择后返回的职务列表信息
                return this.$store.getters.taskPublishJobList;
            },
            user() {
                return this.$store.getters.userInfo;
            },
            job_list() {//用户选择后返回的职务列表信息,进行排序
                return sortKey(this.job_list_sort,'dutie_id')
            },
            taskID() {
                return this.$store.getters.taskPublishListID;
            },
            taskType() {
                return this.$store.getters.taskPublishListTitle;
            }
        },
        methods: {
            publish() {
                if (this.user.accountID) {
                    this.$router.push({name: 'taskPublishReleaseNext'});
                } else {
                    this.$router.push({
                        name: 'taskPublishReleaseNext',
                        query: {
                            account_id: this.$route.query.account_id,
                            host: this.$route.query.host
                        }
                    });
                }
            },
            getTaskDetail() { //获取任务详情
                let params = {
                    'edu_task_id': this.taskID,

                }
                let params2 = {
                    'school_task_id': this.taskID,
                    'account_id': this.user.accountID || this.$route.query.account_id,
                    'do_type': this.taskType,
                }
                //教育局
                if (this.user.type == 1) {
                    this.http(this, (this.user.baseURL || this.$route.query.host) + api.EDU_TASK_DETAIL, params, (res) => {
                        if (res.status == 1) {
                            this.data = res.data
                        }
                    })
                }
                //学校
                if (this.user.type != 1) {
                    this.http(this, (this.user.baseURL || this.$route.query.host) + api.SCHOOL_TASK_VIEWINFO, params2, (res) => {
                        if (res.status == 1) {
                            this.data = res.data
                        }
                    })
                }
            },
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"
    @import "../../style/public.styl"
    .detail_header {
        text-align: center
        .title {
            line-height: px2vw(80px)
            color: lightBlack-color
            font-size: px2vw(36px)
            font-weight: bold
        }
        .subtitle {
            color: gray-color
            margin-bottom: px2vw(30px)
            .time {
                margin-left: 5%
            }
        }
    }

    .detail_body {
        margin-left: px2vw(40px)
        p {
            padding: px2vw(25px) 0
            font-size: px2vw(34px)
        }
    }
    .select_job{
        margin: 3%;
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
