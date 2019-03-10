/**
* @Description:    学校列表/教育局职务列表
* @Author:         TSY
* @CreateDate:     2018/10/21 16:23
*/
<template>
    <div>
        <div class="wrapper">
            <ul class="item_wrapper">
                <li class="item_first" v-for="(item,index) in showSchoolList" :key="item.AccountID">
                    <div @click="checkItem(index)" class="item">
                        <div class="checkGroup" @click="checkAll(index)" @click.stop>
                            <i class="iconfont"
                               :class="{'icon-gouxuan':isSelectAll[index],'icon-checkboxround0':!isSelectAll[index]}"></i>
                        </div>
                        <div class="item_first_name">{{item.AccountName}}</div>
                        <i class="iconfont" :class="{'icon-right-copy':!isOpenItem[index], 'icon-down-copy':isOpenItem[index]}"></i>
                    </div>
                    <ul class="item_second" v-show="isOpenItem[index]">
                        <li v-for="(people,i) in item.user_list" :key="people.PID">
                            <user-info-item :avatar="people.avatar" :pid="people.PID" :job="people.dutie_name"
                                            :user-name="people.user_name">
                                <input @click="stateChanged(index,i)" type="checkbox" name="school"
                                       :id="'check'+people.PID"
                                       v-model="selectPeople" :value="people.PID">
                            </user-info-item>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <footer-button @click="selectPeopleClick" text="确定"></footer-button>
    </div>
</template>

<script>
    import FooterButton from "../common/FooterButton.vue";
    import UserInfoItem from "../common/UserInfoItem.vue";

    export default {
        components: {
            UserInfoItem,
            FooterButton
        },
        name: "schoolList",
        props: ['showSchoolList'],
        data() {
            return {
                isOpenItem: [],//控制每项的面板打开与折叠
                isSelectAll: [],//控制每项的面板选中状态
                selectPeople: [],    //存储选择的人员
            }
        },
        mounted() {
            if (this.$route.name == 'noticeSelectEduPeople'){
                this.selectPeople = this.selectEduPeopleID;
            } else {
                this.selectPeople = this.selectSchoolPeopleID
            }
        },
        watch: {
            showSchoolList(data) {
                //设置头像背景颜色
                let len = data.length;
                for (let i = 0; i < len; i++) {
                    //根据数据初始化全选按钮状态
                    this.isSelectAll.push(false);
                    //根据数据初始化折叠面板折叠状态
                    this.isOpenItem.push(true);
                }
                //初始化第一级的选中状态
                this.initFirstLevelChecked();
            }
        },
        computed: {
            selectSchoolPeopleID() {//学校选中的ID
                return this.$store.getters.noticeSelectSchoolPeopleID
            },
            selectEduPeopleID() {//教育局选中的ID
                return this.$store.getters.noticeSelectEduPeopleID
            }
        },
        methods: {
            selectPeopleClick() {//确认选择人员
                this.$emit('confirm', this.selectPeople)
            },
            stateChanged(index, i) {//改变人员选中状态的时候，动态修改父级的选中状态
                if (this.selectPeople.includes(this.showSchoolList[index].user_list[i].PID)) {//点击之前为选中状态
                    this.$set(this.isSelectAll, index, false);//改变父级按钮的选中状态为非选中状态
                } else {//点击之前为非选中状态
                    this.setFirstLevelChecked(index, this.showSchoolList[index].user_list[i].PID);//给第一级添加选中状态
                }
            },
            initFirstLevelChecked() {//初始化第一级的选中状态
                for (let i in this.showSchoolList) {
                    for (let k in this.showSchoolList[i].user_list) {
                        if (!this.selectPeople.includes(this.showSchoolList[i].user_list[k].PID)) {//只要有其中一个未选中，就跳出循环，不给父级添加选中状态
                            this.$set(this.isSelectAll, i, false);//改变第一级按钮的选中状态为非选中状态
                            break
                        }
                        this.$set(this.isSelectAll, i, true);//改变第一级按钮的选中状态为选中状态
                    }
                }
            },
            setFirstLevelChecked(index, data) {//给第一级添加选中状态
                for (let k in this.showSchoolList[index].user_list) {
                    if (!this.selectPeople.includes(this.showSchoolList[index].user_list[k].PID) && data != this.showSchoolList[index].user_list[k].PID) {//只要有其中一个未选中，就跳出循环，不给父级添加选中状态
                        return false
                    }
                }
                this.$set(this.isSelectAll, index, true);//改变第一级按钮的选中状态为选中状态
            },
            checkItem(index) {//展开或折叠面板
                this.$set(this.isOpenItem, index, !this.isOpenItem[index]);
            },
            checkAll(index) {//第一层级的全选操作
                this.$set(this.isSelectAll, index, !this.isSelectAll[index]);//改变当前按钮的选中状态
                if (!this.showSchoolList[index].user_list) {
                    return
                }
                if (!this.isSelectAll[index]) {// 从全选 =》 全不选
                    for (let i = 0, len = this.selectPeople.length; i < len; i++) {
                        if (!this.selectPeople[i]) { //删除干净了
                            return
                        }
                        for (let j in this.showSchoolList[index].user_list) {//循环删除该学校的人员
                            if (this.selectPeople[i] == this.showSchoolList[index].user_list[j].PID) {
                                this.selectPeople.splice(i, 1);
                                i--;
                                break;
                            }
                        }
                    }
                } else {// 从全不选 =》 全选
                    for (let i in this.showSchoolList[index].user_list) {//循环添加该学校的人员
                        if (this.selectPeople.includes(this.showSchoolList[index].user_list[i].PID)) { //如果已经存在，就不用再进行添加
                            continue;
                        }
                        this.selectPeople.push(this.showSchoolList[index].user_list[i].PID);
                    }
                }
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .wrapper {
        padding-bottom: px2vw(90px)
        background bg-color
    }

    .item_wrapper {
        padding-top: px2vw(90px)
        background white
    }

    .item_first {
        borderBottom()
    }

    .item_first_name {
        flex: 1;
        width: 0;
        textOverflow()
    }

    .item {
        display flex
        fontSize(34px)
        paddingAround()
        .iconfont {
            fontSize(44px)
        }
    }

    .item_second li {
        display: flex
        align-items center
        borderTop()
        paddingAround()
        padding-left px2vw(45px)
        .content-wrap {
            display: flex;
            width: 100%
            .item_img {
                display flex
                justify-content center
                align-items center
                width: px2vw(90px)
                height: px2vw(90px)
                border-radius: 50%
                margin-left px2vw(20px)
                margin-right px2vw(15px)
                color: #fff
                text-align: center
            }
            .content {
                .content_name {
                    font-weight: bold
                }
                .vice {
                    color: vice-font-color
                }
            }

        }

    }

    .item_second label {
        flex 1
    }

    .icon-gouxuan {
        color: main-color
    }

    .icon-checkboxround0 {
        color: vice-font-color
    }

    .checkGroup {
        width px2vw(60px)
        display inline-block
    }

    .head_img {
        width: px2vw(100px)
        height: px2vw(100px)
        border-radius 50%
        margin-left px2vw(15px)
        margin-right px2vw(15px)
    }

    input[type='checkbox'] {
        width: px2vw(44px);
        height: px2vw(44px);
        -webkit-appearance: none;
        border: none;
        background: url("../../assets/taskPublish/checkbox_round.png") no-repeat center;
        background-size px2vw(44px) px2vw(44px)
        outline: none;
    }

    input[type='checkbox']:checked {
        background: url("../../assets/taskPublish/checkbox_check.png") no-repeat center;
        background-size px2vw(44px) px2vw(44px)
    }
</style>