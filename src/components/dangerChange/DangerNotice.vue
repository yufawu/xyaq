/**
* @Description:    整改通知书
* @Author:         TSY
* @CreateDate:     2018/9/25 14:27
*/
<template>
    <div class="body">
        <div class="red_title">洪湖市教育局</div>
        <div class="number">编号：1234567890</div>
        <div class="title">整改通知书</div>
        <div class="school">荆州监利县还原小学：</div>
        <p class="subtitle">我局在对你校（园）的工作检查中发现，你校（图）存在以下隐患（问题）：</p>
        <div class="content">
            <p class="content_item">1、嗯看看图可调图为证DJ了 out门口了咯五兔子可恶咯哦侧目</p>
            <p class="content_item">2、嗯看看图可调图为证DJ了 out门口了咯五兔子可恶咯哦侧目</p>
            <p class="content_item">3、嗯看看图可调图为证DJ了 out门口了咯五兔子可恶咯哦侧目</p>
        </div>
        <p class="end">请你校（园）根据学校安全管理的相关规定，加强校园安全管理，严格落实整改措施，确保在2018年10月02日将上述隐患（问题）整改到位，同时将整改落实情况书面报市教育局（安督办）。</p>
        <div class="seal">
            <div class="seal_content">
                <span class="seal_text">洪湖市教育局</span>
                <span class="seal_text">2018年09月30日</span>
            </div>
        </div>
        <div class="receiver">
            <span class="receiver_account">签收单位（盖章）：</span>
            <span class="receiver_person">签收人：</span>
        </div>
    </div>
</template>

<script>
    import * as api from '../../constant/api'

    export default {
        name: "DangerNotice",
        data() {
            return {
                dangerNoticeData: [],//通知书数据
            }
        },
        mounted() {
            this.getDangerChangeNotice();
        },
        methods: {
            getDangerChangeNotice() {//获取通知书数据
                let params = {
                    'account_id': this.$route.query.account_id || '',
                    'danger_id': this.$route.query.danger_id || ''
                }
                this.http(this, 'http://192.168.8.159:86/' + api.GET_DANGER_CHANGE_NOTICE, params, (res) => {
                    if (res.status == 1) {
                        this.dangerNoticeData = res.data;
                    } else {
                        this.$bottomToast(res.msg);
                    }
                })
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    p {
        text-indent 2em
    }

    .body {
        paddingAround()
        fontSize(28px)
    }

    .red_title {
        color red
        text-align center
        fontSize(40px)
        border-bottom px2vw(5vw) solid red
        paddingAround()
    }

    .number {
        text-align right
        fontSize(24px)
        margin px2vw(10px) 0
    }

    .title {
        text-align center
        fontSize(36px)
        margin px2vw(30px) 0
    }

    .school {
        font-weight bold
        margin px2vw(20px) 0
    }

    .content {
        margin px2vw(20px) 0
    }

    .end {
        margin px2vw(40px) 0
    }

    .seal {
        display flex
        justify-content flex-end
        margin-top px2vw(100px)
    }

    .seal_content {
        display flex
        flex-direction column
        justify-content center
        align-items center
    }

    .seal_text {
        margin px2vw(10px) 0
    }

    .receiver {
        display flex
        margin-top px2vw(100px)
    }

    .receiver_account {
        width 0
        flex 1.5
    }

    .receiver_person {
        width 0
        flex 1
    }
</style>