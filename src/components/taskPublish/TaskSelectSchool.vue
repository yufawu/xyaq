**
* @Description:    任务下发、学校选择列表页
* @Author:         yufawu
* @CreateDate:     2018/8/28 14:20
*/
<template>
    <div>
        <div class="item_wrapper">
            <ul class="item_first">
                <li v-for="(item,index) in schoolList" :key="index">
                    <div @click="checkItem(index)" class="item">
                        <div class="checkGroup" @click="checkAll(index)" @click.stop>
                            <i class="iconfont"
                               :class="{'icon-gouxuan':isSelectAll[index],'icon-checkboxround0':!isSelectAll[index]}"></i>
                        </div>
                        {{item.name}}
                    </div>
                    <ul class="item_second" v-show="isOpenItem[index]">
                        <li v-for="(school,i) in item.school_list" :key="i">
                            <label :for="'check'+index+i">
                                <input @click="stateChanged(index,i)" type="checkbox" name="school" :id="'check'+index+i" v-model="selectSchool"
                                       :value="school">{{school.AccountName}}
                            </label>
                        </li>
                    </ul>
                </li>

            </ul>
        </div>
        <footer-button @click="selectSchoolClick()" text="确定"></footer-button>
    </div>

</template>

<script>
    import * as api from '../../constant/api'
    import * as types from '../../constant/types'
    import FooterButton from "../common/FooterButton";

    export default {
        components: {
            FooterButton,
        },
        name: "taskSelectSchool",
        data() {
            return {
                isItemSelect: false,//显示/隐藏 查看总结的内容
                schoolList: [],      //从后台获取的学校列表信息
                selectSchoolIds:[], //存储选择学校的id,判断是否全选
                schoolGroup: [],    //存储选择的学校--中间变量
                isOpenItem: [],//控制每项的面板打开与折叠
                isSelectAll: [],
                selectSchool: this.$store.getters.taskPublishSchoolList
            }
        },
        mounted() {
            this.getTaskSchoolList();

        },
        computed: {
            user() {
                return this.$store.getters.userInfo;
            },
            // selectSchool() {//存储选择的学校
            //     return this.$store.getters.taskPublishSchoolList;
            // }
        },
        methods: {
            checkItem(index) {//展开或折叠面板
                this.$set(this.isOpenItem, index, !this.isOpenItem[index]);
            },
            selectSchoolClick() {
                this.$store.dispatch(types.SET_TASK_PUBLISH_SCHOOL_LIST, this.selectSchool);
                this.$router.back();
            },
            stateChanged(index, i) {//改变人员选中状态的时候，动态修改父级的选中状态
                if (this.selectSchoolIds.includes(this.schoolList[index].school_list[i].AccountID)) {//点击之前为选中状态
                    this.$set(this.isSelectAll, index, false);//改变父级按钮的选中状态为非选中状态
                } else {//点击之前为非选中状态
                    this.setFirstLevelChecked(index, this.schoolList[index].school_list[i].AccountID);//给第一级添加选中状态
                }
            },
            initFirstLevelChecked() {//初始化第一级的选中状态
                for (let j in this.selectSchool){
                    this.selectSchoolIds.push(this.selectSchool[j].AccountID)
                }
                for (let i in this.schoolList) {
                    for (let k in this.schoolList[i].school_list) {
                        if (!this.selectSchoolIds.includes(this.schoolList[i].school_list[k].AccountID)) {//只要有其中一个未选中，就跳出循环，不给父级添加选中状态
                            this.$set(this.isSelectAll, i, false);//改变第一级按钮的选中状态为非选中状态
                            break
                        }
                        this.$set(this.isSelectAll, i, true);//改变第一级按钮的选中状态为选中状态
                    }
                }
            },
            setFirstLevelChecked(index, data) {//给第一级添加选中状态
                for (let k in this.schoolList[index].school_list) {
                    if (!this.selectSchoolIds.includes(this.schoolList[index].school_list[k].AccountID) && data != this.schoolList[index].school_list[k].AccountID) {//只要有其中一个未选中，就跳出循环，不给父级添加选中状态
                        return false
                    }
                }
                this.$set(this.isSelectAll, index, true);//改变第一级按钮的选中状态为选中状态
            },
            getTaskSchoolList() { //获取任务列表
                let params = {
                    'account_id': this.user.accountID || this.$route.query.account_id,
                }
                this.http(this, (this.user.baseURL || this.$route.query.host) + api.EDU_TASK_SCHOOL_LIST, params, (res) => {
                    if (res.status == 1) {
                        this.schoolList = res.data
                        this.initFirstLevelChecked();
                        this.schoolList.forEach(() => {
                            this.isOpenItem.push(false);
                            this.isSelectAll.push(false);
                        })
                    }
                })
            },
            checkAll(index) {
                this.$set(this.isSelectAll, index, !this.isSelectAll[index])
                let schoolInfo = this.schoolList[index].school_list;
                if (!this.isSelectAll[index]) {
                    if (this.selectSchool.length > 0) {
                        for (let i = 0; i < this.selectSchool.length; i++) {
                            for (let j = 0; j < schoolInfo.length; j++) {
                                if (this.selectSchool[i].AccountID == schoolInfo[j].AccountID) {
                                    this.selectSchool.splice(i, 1);
                                }
                            }
                        }
                    }
                } else {
                    // this.selectSchool = [];
                    for (let i = 0; i < schoolInfo.length; i++) {
                        this.selectSchool.push(schoolInfo[i]);
                    }
                }
            },

        }

    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"
    @import "../../style/public.styl"
    * {
        color: black-color
    }

    .item {
        margin-bottom: 1%
        padding: 0 4%
        lineHeight(60px)
        fontSize(28px)
        background: bg-color
    }

    .item_first li {
        line-height: px2vw(60px)
        borderBottom(bg-color)
    }

    .item_first .item_second li {
        padding: 0 15%
        position: relative
    }

    .item_second li {
        display flex
    }

    .item_second label {
        flex 1
    }

    .icon-gouxuan {
        color: main-color
    }

    .checkGroup {
        width px2vw(40px)
        height px2vw(60px)
        display inline-block
    }

    input[type='checkbox'] {
        width: 20px;
        height: 20px;
        -webkit-appearance: none;
        background: url("../../assets/taskPublish/checkbox_round.png") no-repeat center;
        background-size 20px 20px
        outline: none;
        position: absolute
        left: 25px
    }

    input[type='checkbox']:checked {
        background: url("../../assets/taskPublish/checkbox_check.png") no-repeat center;
        background-size 20px 20px
    }
</style>