/**
* @Description:    社会督查详情
* @Author:         TSY
* @CreateDate:     2018/8/6 17:00
*/
<template>
    <div>
        <div v-if="supervisionData.status == 1" class="title">隐患详情</div>
        <div class="content">
            <div class="content_text">{{ supervisionData.pat_content }}</div>
            <show-img-list :img1="supervisionData.pat_img1" :img2="supervisionData.pat_img2"
                           :img3="supervisionData.pat_img3"
                           :videoImg="supervisionData.video_img"
                           :videoURL="supervisionData.video_url"></show-img-list>
        </div>
        <label-text label="所属学校：" :text="supervisionData.account_name"></label-text>
        <div v-if="supervisionData.status == 2" class="footer">
            <div class="footer_item" @click="dispatchTask()">一键分派</div>
        </div>
        <fill-box></fill-box>
    </div>
</template>

<script>
    import * as api from '../../constant/api';
    import * as types from '../../constant/types';
    import {changeNum2Area, formatDate} from "../../utils/util";
    import InputSelector from "../common/InputSelector";
    import ShowImgList from "../common/ShowImgList";
    import LabelText from "../common/LabelText";
    import FillBox from "../common/FillBox";

    export default {
        name: "SupervisionDetail",
        components: {FillBox, LabelText, ShowImgList, InputSelector},
        data() {
            return {}
        },
        computed: {
            user() {
                return this.$store.getters.userInfo;
            },
            supervisionData() {
                return this.$store.getters.supervisionItem;
            },
            areaName() {
                return changeNum2Area(this.supervisionData.area_codes);
            }
        },
        methods: {
            dispatchTask() { //一键派发
                let params = {
                    'id': this.supervisionData.pat_id,
                    'area_codes': this.supervisionData.area_codes,
                    'account_id': this.user.accountID,
                    'pid': this.user.PID,
                    'edu_do_time': formatDate(new Date())
                };
                this.http(this, this.user.baseURL + api.SOCIAL_SUPERVISION_DISPATCH, params, (res) => {
                    if (res.status == 1) {
                        this.$store.dispatch(types.SET_SUPERVISION_BACK, true);
                        this.$router.back();
                    }
                    this.$bottomToast(res.msg);
                })
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .title {
        width 100%
        padding 3% 4%
        background bg-color
        fontSize(28px)
    }

    .content {
        padding 3% 4%
        border-bottom px2vw(16px) solid bg-color
    }

    .content_text {
        min-height 80px
    }

    .footer {
        position fixed
        display flex
        width 100%
        bottom 0
        left 0
        background main-color
        color white
        z-index 1
    }

    .footer_item {
        width 0
        flex-grow 1
        text-align center
        padding 3% 0
        fontSize(34px)
        borderRight(#ccc)
    }
</style>