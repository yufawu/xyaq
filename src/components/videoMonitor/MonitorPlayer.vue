/**
* @Description:    监控视频播放器
* @Author:         TSY(界面)  巫瑜发（接口）
* @CreateDate:     2018/9/17 11:22
*/
<template>
    <div>
        <div id="playercontainer"></div>
        <import-js js-url="https://login.paxy365.com/new_weixin/baiduVideoWebSDK/cyberplayer.js" :js-load-call-back="loadSuccess" ></import-js>
    </div>
</template>

<script>
    import ImportJs from "../common/ImportJs";

    export default {
        name: "MonitorPlayer",
        components: {ImportJs},
        data() {
            return {
                monitorSrc: '',//视频hls地址
                monitorRtmpSrc: '',//视频rtmp地址
            }
        },
        mounted() {
            this.monitorSrc = (this.selectedMonitor && this.selectedMonitor.hlsHD || this.selectedMonitor.hls) || this.$route.query.hlsHD;
            this.monitorRtmpSrc = (this.selectedMonitor && this.selectedMonitor.rtmpHD || this.selectedMonitor.rtmp) || this.$route.query.rtmpHD;
        },
        computed: {
            selectedMonitor() {//获取选择的监控
                return this.$store.getters.monitorItem;
            },
        },
        methods: {
            loadSuccess() {
                cyberplayer("playercontainer").setup({
                    width : '100%',
                    height : 200,
                    backcolor : "#FFFFFF",
                    stretching : "uniform",
                    ak : "d994802b3bdd45b5bacd838f07f6caf3",
                    autoStart : false,
                    repeat : true,
                    volume : 100,
                    controls : "over",
                    hls: {
                        reconnecttime: 5
                    },
                    file : this.monitorSrc,
                    fallbackfile: this.monitorRtmpSrc
                });
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .jwplayer .jw-icon-barlogo-new:before {
        content: none;
    }
    .jw-icon-barlogo-new {
        background: url('https://login.paxy365.com/new_weixin/favicon.ico') no-repeat;
        background-position: center;
    }
</style>