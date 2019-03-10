/**
* @Description:    多层级列表展开/折叠
* @Author:         TSY
* @CreateDate:     2018/8/24 15:58
*/
<template>
    <div class="rule_group">
        <ul>
            <li class="rule_item" v-for="(rule,index) in dataGroup" :key="index">
                <div class="rule_content" @click="checkItem(index)">
                    <p class="rule_item_title">{{ rule.name }}</p>
                    <img v-show="!isOpenItem[index]" class="check_img_up"
                         src="../../assets/specialCheck/btn_more_small.png">
                    <img v-show="isOpenItem[index]" class="check_img_down"
                         src="../../assets/specialCheck/btn_more_small_down.png">
                </div>
                <ul v-show="isOpenItem[index]">
                    <li class="rule_subitem" v-for="(item,i) in rule.child_arr" :key="i">
                        <span :style="{'flex': number>1?number:1}">{{ item.name }}</span>
                        <span :style="{ 'color': item.status == 1 ? '#42bd56' : item.status == 2 ? '#fb3939' : '','text-align': textAlign }">{{ item.sum_score || item.rule }}</span>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "MultilevelList",
        props: ["dataGroup","textAlign","number"],
        data() {
            return {
                isOpenItem: [],//控制每项的面板打开与折叠
            }
        },
        mounted() {

        },
        watch: {
            dataGroup(val) {
                //添加数据，控制折叠面板的显示或隐藏（默认隐藏）
                for (let i in val) {
                    this.isOpenItem[i] = false;
                }
            }
        },
        methods: {
            checkItem(index) {//展开或折叠面板
                this.isOpenItem.splice(index, 1, !this.isOpenItem[index])
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .rule_content {
        display flex
        align-items center
        justify-content space-between
        font-weight bold
        paddingAround()
        borderBottom()
        fontSize(32px)
    }

    .check_img_up {
        width 3%
    }

    .check_img_down {
        width 5%
    }

    .rule_subitem {
        display flex
        align-items center
        justify-content space-between
        paddingAround()
        borderBottom()
        fontSize(30px)
        padding-left px2vw(50px)
    }

    .rule_subitem span {
        width 0
        flex 1
    }
</style>