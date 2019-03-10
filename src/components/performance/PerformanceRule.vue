/**
* @Description:    评分规则
* @Author:         TSY
* @CreateDate:     2018/8/23 16:09
*/
<template>
    <div>
        <p class="top_item">评分规则管理员：{{ ruleManager }}</p>
        <p class="top_item">加/减分范围设置：{{ scoreRange }}</p>
        <div class="rule_text">
            <div class="rule_title">评分规则</div>
            <div class="rule_subtitle">如需修改评分规则，请前往电脑端后台设置</div>
        </div>
        <multilevel-list :dataGroup="ruleGroup"></multilevel-list>
    </div>
</template>

<script>
    import * as api from "../../constant/api"
    import MultilevelList from "../common/MultilevelList";
    export default {
        name: "PerformanceRule",
        components: {MultilevelList},
        data() {
            return {
                ruleManager: '暂无',//评分规则管理员
                scoreRange: '-20分到20分',//加/减分范围设置
                ruleGroup: [],
            }
        },
        mounted() {
            this.getPerformanceDetail();
        },
        computed: {
            user() {
                return this.$store.getters.userInfo;
            },
            schoolItem() {
                return this.$store.getters.performanceSchoolItem;
            }
        },
        methods: {
            getPerformanceDetail(){ //获取考评规则数据
                console.log(this.schoolItem,'item')
                let params = {
                    'account_id': this.user.accountID,
                    'static_month': this.schoolItem.month
                }
                this.http(this,this.user.baseURL + api.GET_PERFORMANCE_RULE,params,(res)=>{
                    if (res.status == 1){
                        this.ruleManager = res.data.ruleManager;
                        this.scoreRange = res.data.sum_scoreRange;
                        this.ruleGroup = res.data.ruleGroup;
                    } else {
                        this.$bottomToast(res.msg);
                    }
                })
            },
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .top_item {
        paddingAround()
        borderBottom()
        fontSize(32px)
        textOverflow()
    }

    .rule_text {
        paddingAround()
        fontSize(32px)
        background bg-color
    }

    .rule_title {
        font-weight bold
    }

    .rule_subtitle {
        color vice-font-color
        fontSize(30px)
        margin-top px2vw(10px)
    }

</style>