/**
* @Description:    待办事项
* @Author:         TSY
* @CreateDate:     2018/9/4 10:56
*/
<template>
    <div class="body">
        <ul>
            <li class="todo" v-for="item in todoListData" :key="item.id">
                <input v-show="isShowCheckbox" type="checkbox" name="todo" v-model="todoChecked" :value="item">
                <div class="todo_content">
                    <img class="todo_img" :src="item.img">
                    <div class="content">
                        <div class="content_top">
                            <span class="content_top_type">{{ item.type }}</span>
                            <span>{{ item.time }}</span>
                        </div>
                        <p class="content_title">{{ item.title }}</p>
                        <div class="content_type" v-if="item.typeCode == 1">
                            <p>{{ item.content }}</p>
                            <p>{{ item.entryTime }}</p>
                        </div>
                        <p class="content_action">立即报名</p>
                    </div>
                </div>
            </li>
        </ul>
        <fill-box></fill-box>
        <div class="footer">
            <div class="footer_item" v-show="!isShowCheckbox" @click="editTodoList()">编辑</div>
            <div class="footer_item" v-show="isShowCheckbox" @click="selectAll()">{{ (this.todoChecked.length ==
                this.todoListData.length) ? '取消全选' : '全选' }}
            </div>
            <div class="footer_item" v-show="isShowCheckbox" @click="editTodoList()">取消</div>
            <div class="footer_item" v-show="isShowCheckbox" @click="deleteSelected()">删除</div>
        </div>
    </div>
</template>

<script>
    import * as api from '../../constant/api'
    import FillBox from "../common/FillBox";

    export default {
        name: "TodoList",
        components: {FillBox},
        data() {
            return {
                todoListData: [
                    {
                        'id': 1,
                        'img': require('../../assets/todoList/icon_hykq.png'),
                        'typeCode': 1,
                        'type': '会议考勤',
                        'time': '3分钟前',
                        'title': '你有新的会议待报名',
                        'content': '《省办公厅关于如何举办安全演练》的会议《省办公厅关于如何举办安全演练》的会议',
                        'entryTime': '2018.8.29-2018.9.10'
                    },
                    {
                        'id': 2,
                        'img': require('../../assets/todoList/icon_yhzg.png'),
                        'typeCode': 2,
                        'type': '隐患整改',
                        'time': '59分钟前',
                        'title': '隐患任务待完成'
                    },
                    {
                        'id': 3,
                        'img': require('../../assets/todoList/icon_rcjc.png'),
                        'typeCode': 3,
                        'type': '日常检查',
                        'time': '2018-09-01 08:55:22',
                        'title': '你有1条日常检查任务'
                    },
                    {
                        'id': 4,
                        'img': require('../../assets/todoList/icon_zlbs.png'),
                        'typeCode': 4,
                        'type': '资料报送',
                        'time': '2018-09-01 08:55:22',
                        'title': '你有2份问卷需填报'
                    },
                    {
                        'id': 5,
                        'img': require('../../assets/todoList/icon_aqdc.png'),
                        'typeCode': 5,
                        'type': '安全督查',
                        'time': '2018-09-01 08:55:22',
                        'title': '你有2条安全督查任务'
                    },
                    {
                        'id': 6,
                        'img': require('../../assets/todoList/icon_zxjc.png'),
                        'typeCode': 6,
                        'type': '专项检查',
                        'time': '2018-09-01 08:55:22',
                        'title': '你有8条专项检查任务'
                    },
                ],//待办事项列表
                todoChecked: [],//被选中的待办事项
                isShowCheckbox: false,//是否显示待办事项选择框
                isSelectAll: false,//是否已经选中所有的待办事项
            }
        },
        mounted() {
            // this.getTodoList();
        },
        computed: {
            user() {
                return this.$store.getters.userInfo;
            }
        },
        methods: {
            getTodoList() {// 获取待办事项列表
                let params = {
                    'account_id': this.user.accountID,
                    'pid': this.user.PID,
                    'job': this.user.job
                }
                this.$axios('', api.GET_TODO_LIST, params, (res) => {
                    if (res.status == 1) {
                        this.todoListData = res.data;
                    } else {
                        this.$bottomToast(res.msg);
                    }
                })
            },
            editTodoList() {//编辑/取消 待办事项列表
                this.isShowCheckbox = !this.isShowCheckbox;
            },
            deleteSelected() {//删除选中的待办事项
                if (this.todoChecked.length == 0) {
                    this.$bottomToast('请选择要删除的待办事项');
                    return
                }
                this.$messagebox.confirm('确认要删除所选择的待办事项？', '温馨提示').then(action => {
                    if (action == 'confirm') {
                        if (this.todoChecked.length == this.todoListData.length) { // 全选了所有的待办事项
                            this.todoListData = [];
                        } else {
                            for (let i in this.todoChecked) {
                                for (let j in this.todoListData) {
                                    if (this.todoChecked[i].id == this.todoListData[j].id) {
                                        this.todoListData.splice(j, 1);
                                    }
                                }
                            }
                        }
                        this.$bottomToast('删除成功');
                        this.todoChecked = [];
                    }
                }).catch(e => {
                    console.log(e)
                });
            },
            selectAll() {//点击全选按钮
                if (this.todoChecked.length != this.todoListData.length) {
                    this.todoChecked = this.todoListData;
                } else {
                    this.todoChecked = [];
                }
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .body {
        padding-bottom px2vw(90px)
    }

    input {
        -webkit-appearance checkbox
        margin 0 px2vw(10px)
    }

    input[type='checkbox'] {
        width: px2vw(50px)
        height: px2vw(50px)
        -webkit-appearance: none;
        border: none;
        background: url("../../assets/taskPublish/checkbox_round.png") no-repeat center;
        background-size px2vw(50px) px2vw(50px)
        outline: none;
    }

    input[type='checkbox']:checked {
        background: url("../../assets/taskPublish/checkbox_check.png") no-repeat center;
        background-size px2vw(50px) px2vw(50px)
    }

    .todo {
        width 100%
        display flex
        align-items center
        background bg-color
    }

    .todo_content {
        width 100%
        display flex
        align-items flex-start
        background white
        paddingAround()
        bottomLine()
    }

    .todo_img {
        width px2vw(50px)
        margin-right px2vw(18px)
    }

    .content {
        width 0
        flex 1
    }

    .content_top {
        display flex
        align-items center
        color vice-font-color
    }

    .content_top_type {
        margin-right px2vw(66px)
    }

    .content_title {
        fontSize(36px)
        margin-top px2vw(30px)
        font-weight bold
    }

    .content_type p {
        width 100%
        textOverflow()
        margin-top px2vw(14px)
        fontSize(28px)
        color vice-font-color
    }

    .content_action {
        margin-top px2vw(30px)
        fontSize(28px)
        color main-color
    }

    .footer {
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

</style>