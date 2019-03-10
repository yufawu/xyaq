/**
* @Description:    教育局通过 学校/职务/街道 筛选人员
* @Author:         TSY
* @CreateDate:     2018/9/5 9:04
*/
<template>
    <div>
        <drop-selector :selector="selector" @click="selectItem" :select-index="selectIndex"
                       :is-show-selector="isShowSelector">
            <label class="drop_down_item" :for="'input'+index" v-for="(item,index) in selectorItem" :key="index"
                   @click.stop>
                <span>{{ item.name || item.dutie_name }}</span>
                <input type="checkbox" :id="'input'+index" :name="'type'+selectIndex"
                       :checked="selectItemChecked[selectIndex][index]"
                       v-model="selectData[selectIndex]" :value="item">
            </label>
        </drop-selector>
        <school-list :show-school-list="showSchoolList" @confirm="selectPeopleClick"></school-list>
        <fill-box></fill-box>
    </div>
</template>

<script>
    import * as api from '../../constant/api'
    import * as types from '../../constant/types'
    import DropSelector from "../common/DropSelector";
    import SchoolList from "./SchoolList.vue";
    import FillBox from "../common/FillBox";

    export default {
        components: {
            FillBox,
            SchoolList,
            DropSelector
        },
        name: "noticeSelectPeople",
        data() {
            return {
                selector: ['所属街道', '学校职务'],//选项
                selectorText: ['所属街道', '学校职务'],//选项
                selectIndex: -1,//当前被选中的筛选条目index
                selectorItem: [],//当前下拉选项
                isShowSelector: false,//是否显示下拉框
                dutiesList: [],//职务列表
                schoolList: [],//接口返回的学校列表（包含街道）
                allSchoolList: [],//接口返回的学校列表（不包含街道）
                showSchoolList: [],//列表页显示的学校列表
                streetList: [],//街道列表
                selectData: [],//被勾选的选项
                selectItemChecked: [],//被勾选的选项   true/false
            }
        },
        mounted() {
            //根据分类初始化被勾选项数组
            for (let i = 0; i < this.selector.length; i++) {
                this.selectData.push([]);
                this.selectItemChecked.push([]);
            }
            this.getNoticeSelectList();
        },
        computed: {
            user() {
                return this.$store.getters.userInfo;
            }
        },
        watch: {
            selectData(val) {
                this.filterShowSchoolList(val);
            }
        },
        methods: {
            selectItem(index) {
                if (this.selectIndex == index) {
                    //点击同一项，让其显示或隐藏
                    this.isShowSelector = !this.isShowSelector;
                    //如果有筛选数据，则替换标题，否则给初始值（取消所有选择也给初始值）
                    if (this.selectData[index].length > 0) {
                        //用选择的第一项替换选项标题
                        this.selector.splice(index, 1, this.selectData[index][0].name || this.selectData[index][0].dutie_name);
                    } else {
                        //赋值初始值
                        this.selector.splice(index, 1, this.selectorText[index]);
                    }
                } else {
                    if (this.selectIndex != -1) {
                        //如果这次与上一次点击的不是同一项，则把上次的数据赋值给上个选项
                        if (this.selectData[this.selectIndex].length > 0) {
                            this.selector.splice(this.selectIndex, 1, this.selectData[this.selectIndex][0].name || this.selectData[this.selectIndex][0].dutie_name);
                        } else {
                            this.selector.splice(this.selectIndex, 1, this.selectorText[this.selectIndex]);
                        }
                    }
                    this.isShowSelector = true;
                }
                this.selectIndex = index;
                if (index == 0) {
                    this.selectorItem = this.streetList;
                } else {
                    this.selectorItem = this.dutiesList;
                }
            },
            dropItemClick(index) { //点击下拉面板中的选项
                this.selectItemChecked[this.selectIndex][index] = !this.selectItemChecked[this.selectIndex][index];
            },
            selectPeopleClick(ids) {//确认选择人员
                let people = [];//被选中的人员信息
                for (let i in ids) {
                    for (let j in this.allSchoolList) {
                        for (let k in this.allSchoolList[j].user_list) {
                            if (ids[i] == this.allSchoolList[j].user_list[k].PID) {
                                people.push(this.allSchoolList[j].user_list[k]);
                            }
                        }
                    }
                }
                this.$store.dispatch(types.SAVE_NOTICE_SELECT_SCHOOL_PEOPLE_IDS, ids);
                this.$store.dispatch(types.SAVE_NOTICE_SELECT_SCHOOL_PEOPLE, people);
                this.$router.back();
            },
            getNoticeSelectList() {//获取接口数据
                let params = {
                    'account_id': this.user.accountID,
                    'enter_type': this.user.type
                }
                this.http(this, (this.user.baseURL || '/') + api.GET_NOTICE_RECEIVER, params, (res) => {
                    if (res.status == 1) {
                        this.dutiesList = res.data.dutie_list;
                        this.streetList = res.data.street_list;
                        this.schoolList = res.data.school_list;
                        //提取街道里所有学校
                        this.getAllSchoolList();
                    } else {
                        this.$bottomToast(res.msg);
                    }
                })
            },
            getAllSchoolList() {//提取街道里所有学校
                this.showSchoolList = [];
                this.allSchoolList = [];
                for (let i in this.schoolList) {
                    for (let j in this.schoolList[i].member) {
                        this.showSchoolList.push(this.schoolList[i].member[j]);
                        this.allSchoolList.push(this.schoolList[i].member[j]);
                    }
                }
            },
            filterShowSchoolList(data) {//筛选出需要显示的列表
                this.showSchoolList = [];
                let tempList = [];//保存被筛选过街道的数据
                let tempUserList = [];//保存被筛选过职务的数据
                let isStreetFilter = false;//是否筛选过街道
                let isDutiesFilter = false;//是否筛选过职务
                if (data[0].length === 0 && data[1].length === 0) {//如果没有筛选项，显示全部
                    this.showSchoolList = JSON.parse(JSON.stringify(this.allSchoolList));
                    return
                }
                if (data[0].length > 0) { //匹配街道数据
                    isStreetFilter = true;
                    for (let j in data[0]) {
                        for (let k in this.schoolList) {//从所有数据中筛选出符合选中街道的数据
                            if (this.schoolList[k].street_code == data[0][j].street_code) {
                                for (let l in this.schoolList[k].member) {
                                    tempList.push(this.schoolList[k].member[l]);
                                }
                            }
                        }
                    }
                }
                if (data[1].length > 0) {//匹配职务数据
                    isDutiesFilter = true;
                    if (isStreetFilter && tempList.length == 0) {//被筛选过街道，且无数据，直接return
                        return
                    }
                    if (!isStreetFilter) {//没被筛选过街道，重新赋值所有的街道，以供职务筛选
                        tempList = JSON.parse(JSON.stringify(this.allSchoolList));
                    }
                    for (let j in data[1]) {
                        for (let m in tempList) {//从被被筛选过街道的数据中再次提取符合条件的数据
                            for (let n in tempList[m].user_list) {
                                if (tempList[m].user_list[n].dutie_id == data[1][j].dutie_id) {
                                    //把符合条件的数据装进临时数组，用于记录符合条件的机构ID和对应人员
                                    tempUserList.push({
                                        'id': tempList[m].AccountID,
                                        'data': tempList[m].user_list[n]
                                    });
                                }
                            }
                        }
                    }
                }
                if (isDutiesFilter && tempUserList.length == 0) {//被筛选过职务，且无数据，直接return
                    isDutiesFilter = false;
                    return
                }
                if (tempUserList.length > 0) {//职务临时列表有数据
                    this.showSchoolList = JSON.parse(JSON.stringify(tempList));
                    for (let i = 0, len = this.showSchoolList.length; i < len; i++) {
                        if (!this.showSchoolList[i]) {
                            return
                        }
                        this.showSchoolList[i].user_list = [];//先清空user_list，以供接下来push符合条件的数据
                        for (let j in tempUserList) {
                            if (this.showSchoolList[i].AccountID == tempUserList[j].id) {
                                this.showSchoolList[i].user_list.push(tempUserList[j].data);
                            }
                        }
                        //如果user_list为空，则不保留该学校
                        if (this.showSchoolList[i].user_list.length == 0) {
                            this.showSchoolList.splice(i, 1);
                            i--;
                        }
                    }
                    return;
                }
                //走到这一步了，说明没有筛选职务，把筛选过街道的数据显示出来
                if (tempList.length > 0) {
                    this.showSchoolList = tempList;
                }
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"
    @import "../../style/public.styl"

    .drop_down_item {
        width 100%
        display flex
        align-items center
        justify-content space-between
        padding px2vw(24px) 0
        borderBottom()
    }

    .drop_down_item input {
        -webkit-appearance checkbox
        width px2vw(30px)
        height px2vw(30px)
    }
</style>
