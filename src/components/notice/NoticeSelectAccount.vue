/**
* @Description:    通知公告选择机构类型
* @Author:         TSY
* @CreateDate:     2018/10/19 8:58
*/
<template>
    <div>
        <input-selector label="教育局列表" @listenSelect="eduSelect"></input-selector>
        <input-selector label="学校列表" @listenSelect="schoolSelect"></input-selector>
        <div class="nearest">最近联系人</div>
        <ul class="nearest_list">
            <no-data-tips :data="allPeople" text="无最近联系人"></no-data-tips>
            <li v-for="item in nearestSelectedSchoolPeople" :key="item.PID">
                <user-info-item :avatar="item.avatar" :pid="item.PID" :job="item.dutie_name" :user-name="item.user_name">
                    <input type="checkbox" name="school"
                           :id="'check'+item.PID"
                           v-model="selectSchoolPeople"
                           :value="item.PID">
                </user-info-item>
            </li>
            <li v-for="item in nearestSelectedEduPeople" :key="item.PID">
                <user-info-item :avatar="item.avatar" :pid="item.PID" :job="item.dutie_name" :user-name="item.user_name">
                    <input type="checkbox" name="school"
                           :id="'check'+item.PID"
                           v-model="selectEduPeople"
                           :value="item.PID">
                </user-info-item>
            </li>
        </ul>
    </div>
</template>

<script>
    import * as types from '../../constant/types'
    import InputSelector from "../common/InputSelector";
    import UserInfoItem from "../common/UserInfoItem";
    import NoDataTips from "../common/NoDataTips";

    export default {
        name: "NoticeSelectAccount",
        components: {NoDataTips, UserInfoItem, InputSelector},
        data() {
            return {
                selectSchoolPeople: [],//被选中的学校人员ID
                selectEduPeople: [],//被选中的教育局人员ID
                nearestSelectedSchoolPeople: [],//近期被选中的学校人员
                nearestSelectedEduPeople: [],//近期被选中的教育局人员
                isFirstShow: true,//是否第一次显示
                allPeople: [],//所有人员
            }
        },
        mounted() {
            this.selectSchoolPeople = this.selectSchoolPeopleStore || [];
            this.selectEduPeople = this.selectEduPeopleStore || [];
            this.nearestSelectedSchoolPeople = this.nearestSchoolSelected || [];
            this.nearestSelectedEduPeople = this.nearestEduSelected || [];
            this.allPeople = this.nearestSelectedSchoolPeople.concat(this.nearestSelectedEduPeople);
        },
        computed: {
            selectSchoolPeopleStore() {//近期被选中的学校人员ID
                return this.$store.getters.noticeSelectSchoolPeopleID
            },
            selectEduPeopleStore() {//近期被选中的教育局人员ID
                return this.$store.getters.noticeSelectEduPeopleID
            },
            nearestSchoolSelected() {//近期被选中的学校人员
                return this.$store.getters.noticeSelectSchoolPeople
            },
            nearestEduSelected() {//近期被选过的人员
                return this.$store.getters.noticeSelectEduPeople
            }
        },
        watch: {
            selectSchoolPeople(ids) {
                let people = [];//被选中的人员信息
                for (let i in ids) {
                    for (let j in this.nearestSelectedSchoolPeople) {
                        if (ids[i] == this.nearestSelectedSchoolPeople[j].PID) {
                            people.push(this.nearestSelectedSchoolPeople[j]);
                        }
                    }
                }
                this.$store.dispatch(types.SAVE_NOTICE_SELECT_SCHOOL_PEOPLE_IDS, ids);
                this.$store.dispatch(types.SAVE_NOTICE_SELECT_SCHOOL_PEOPLE, people);
            },
            selectEduPeople(ids) {
                let people = [];//被选中的人员信息
                for (let i in ids) {
                    for (let j in this.nearestSelectedEduPeople) {
                        if (ids[i] == this.nearestSelectedEduPeople[j].PID) {
                            people.push(this.nearestSelectedEduPeople[j]);
                        }
                    }
                }
                this.$store.dispatch(types.SAVE_NOTICE_SELECT_EDU_PEOPLE_IDS, ids);
                this.$store.dispatch(types.SAVE_NOTICE_SELECT_EDU_PEOPLE, people);
            }
        },
        methods: {
            eduSelect() {//选择教育局列表
                this.$router.push({name: 'noticeSelectEduPeople'});
            },
            schoolSelect() {//选择学校列表
                this.$router.push({name: 'noticeSelectPeople'});
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .nearest {
        background bg-color
        paddingSmall()
    }

    .nearest_list li {
        paddingAround()
        borderBottom()
    }

    input[type='checkbox'] {
        width: px2vw(44px);
        height: px2vw(44px);
        -webkit-appearance: none;
        background: url("../../assets/taskPublish/checkbox_round.png") no-repeat center;
        background-size px2vw(44px) px2vw(44px)
        outline: none;
    }

    input[type='checkbox']:checked {
        background: url("../../assets/taskPublish/checkbox_check.png") no-repeat center;
        background-size px2vw(44px) px2vw(44px)
    }
</style>