/**
* @Description:    调用 微信公众号/微信小程序 扫码接口
* @Author:         TSY
* @CreateDate:     2018/10/31 14:48
*/
<template>
    <div @click="getScanSignPackage">
        <slot></slot>
    </div>
</template>

<script>
    import {isMiniProgram} from "../../utils/util";
    import wx from "weixin-js-sdk"
    import * as api from '../../constant/api'

    export default {
        name: "ScanCode",
        data() {
            return {}
        },
        mounted() {
            this.isMiniScanBack();
        },
        computed: {},
        methods: {
            isMiniScanBack() {//如果是小程序扫码返回，则处理扫码数据
                isMiniProgram(wx, (res) => {
                    if (res) {
                        let miniType = this.$route.query.miniType;
                        let result = this.$route.query.result;
                        result = decodeURI(result);
                        if (miniType && miniType === 'mini') {
                            this.scanResult(result);
                        }
                    }
                })
            },
            getScanSignPackage() { //获取微信扫一扫签名等参数
                isMiniProgram(wx, (res) => {
                    if (res) {
                        wx.miniProgram.redirectTo({url: '../scanCode/scanCode?redirect=' + window.location.href});
                    } else {
                        this.getScanSignData();
                    }
                })
            },
            getScanSignData() { //获取签名数据
                this.http(this, '/' + api.SAFE_MEETING_SCAN_SINGING, {}, (res) => {
                    if (res.status == 1) {
                        this.wxScan(res.data);
                    } else {
                        this.$bottomToast(res.msg);
                    }
                })
            },
            wxScan(data) {//调用微信扫码
                wx.config({
                    // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    debug: false,
                    // 必填，公众号的唯一标识
                    appId: data.appId,
                    // 必填，生成签名的时间戳
                    timestamp: "" + data.timestamp,
                    // 必填，生成签名的随机串
                    nonceStr: data.nonceStr,
                    // 必填，签名
                    signature: data.signature,
                    // 必填，需要使用的JS接口列表，所有JS接口列表
                    jsApiList: ['checkJsApi', 'scanQRCode']
                });
                wx.error(function (res) {
                    alert("出错了：" + res.errMsg);//这个地方的好处就是wx.config配置错误，会弹出窗口哪里错误，然后根据微信文档查询即可。
                });
                wx.ready(function () {
                    wx.checkJsApi({
                        jsApiList: ['scanQRCode'],
                        success: function (res) {
                            console.log(res);
                        }
                    });
                    wx.scanQRCode({
                        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                        scanType: ["qrCode"], // 可以指定扫二维码还是一维码，默认二者都有
                        success: function (res) {
                            // _this.scanResult(res.resultStr);
                            this.$emit('scanSuccess', res.resultStr)
                        }
                    });
                });
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

</style>