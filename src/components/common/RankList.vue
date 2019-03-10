/**
* @Description:    排行榜列表 （名次---学校---分数）
* @Author:         TSY
* @CreateDate:     2018/8/25 15:10
*/
<template>
    <div>
        <ul>
            <li class="rank_item" v-for="(item,index) in data" :key="index" @click="intoDetail(item)">
                <div v-if="item.ranking < 4" class="rank_item_number">
                    <img :src="rankImg[item.ranking - 1]" alt="">
                </div>
                <div v-else class="rank_item_number">{{ item.ranking }}</div>
                <div class="rank_item_name">{{ item.account_name }}</div>
                <div class="rank_item_score">{{ item.sum_score }}分</div>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "RankList",
        props: ["data"],
        data() {
            return {
                rankImg: [
                    require('../../assets/icon_no1.png'),
                    require('../../assets/icon_no2.png'),
                    require('../../assets/icon_no3.png')
                ]//学校排名图标
            }
        },
        mounted() {

        },
        computed: {},
        methods: {
            intoDetail(item) {
                this.$emit('select',item);
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .rank_item {
        display flex
        align-items center
        padding px2vw(24px) px2vw(28px)
        borderBottom()
    }

    .rank_item img {
        width 50%
    }

    .rank_item_number {
        width 0
        flex 0.8
        text-align center
    }

    .rank_item_name {
        width 0
        flex 4
        margin-left px2vw(50px)
        textOverflow()
    }

    .rank_item_score {
        width 0
        flex 1
        text-align right
    }
</style>