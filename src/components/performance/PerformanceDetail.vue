/**
* @Description:    绩效考评详情
* @Author:         TSY
* @CreateDate:     2018/8/24 15:33
*/
<template>
    <div>
        <input-selector label="教育局加/减分：" text-align="right" :value="addScore" @listenSelect="intoAddScoreSet()"></input-selector>
        <p class="top_item"><span>系统得分</span><span>{{ systemScore }}</span></p>
        <p class="top_item"><span>最终得分</span><span>{{ finalScore }}</span></p>
        <p class="top_item"><span>绩效排名</span><span>第{{ rank }}</span></p>
        <p class="score_text">绩效评分详情</p>
        <multilevel-list :dataGroup="ruleGroup" text-align="right"></multilevel-list>
    </div>
</template>

<script>
    import * as api from "../../constant/api"
    import InputSelector from "../common/InputSelector";
    import MultilevelList from "../common/MultilevelList";
    export default {
        name: "PerformanceDetail",
        components: {MultilevelList, InputSelector},
        data() {
            return {
                addScore: '0分',//教育局加/减分
                systemScore: '0分',//系统得分
                finalScore: '0分',//最终得分
                rank: '0名',//绩效排名
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
            getPerformanceDetail(){ //获取考评详情数据
                let params = {
                    'account_id': this.user.accountID,
                    'static_month': this.schoolItem.month,
                    'school_id': this.schoolItem.id
                }
                this.http(this,this.user.baseURL + api.GET_PERFORMANCE_DETAIL,params,(res)=>{
                    if (res.status == 1){
                        this.addScore = res.data.addsum_score;
                        this.systemScore = res.data.systemsum_score;
                        this.finalScore = res.data.finalsum_score;
                        this.rank = res.data.rank;
                        this.ruleGroup = res.data.ruleGroup;
                    } else {
                        this.$bottomToast(res.msg);
                    }
                })
            },
            intoAddScoreSet(){//加减分设置
                this.$router.push({name: 'performanceScoreSet'})
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .top_item {
        display flex
        align-items center
        justify-content space-between
        paddingAround()
        borderTop()
        fontSize(34px)
    }

    .score_text {
        background bg-color
        paddingAround()
        font-weight bold
        fontSize(28px)
    }
</style>