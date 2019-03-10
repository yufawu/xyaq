/**
 * @Description:    专项检查生成表单
 * @Author:         TSY
 * @CreateDate:     2018/6/26 9:35
 */
<template>
    <div></div>
</template>

<script>
    export default {
        name: "specialCreateTable",
        data() {
            return {
                htmlData: ''
            }
        },
        mounted() {
            location.href = this.user.baseURL + 'Api/SafetySupervision/create_table.html?supervision_record_id='+this.taskRecordID;
        },
        computed: {
            user() {//用户信息
                return this.$store.getters.userInfo;
            },
            taskRecordID() {
                return this.$store.getters.taskRecordID;
            }
        },
        methods: {

        }
    }
</script>

<style lang="stylus">
    @import "../../style/common.styl"

    th, td {
        border 1px solid #000
    }

</style>