/**
* @Description:    省市区三级联动选择器
* @Author:         TSY
* @CreateDate:     2018/11/2 11:56
*/
<template>
    <div v-show="isShow" class="mask" @click="close">
        <mt-picker @click.stop :slots="addressSlots" class="picker" @change="onAddressChange"
                   :visible-item-count="5"></mt-picker>
    </div>
</template>

<script>
    import addressData from "../../../public/addressData"

    export default {
        name: "AddressPicker",
        props: {
            isShow: {
                type: Boolean,
                default: false
            },
            visibleColumn: {// 2: 返回二级（省市）   3：返回三级（省市区）
                type: [String, Number],
                default: 2
            }
        },
        data() {
            return {
                companyName: '',
                isShowPicker: false,
                addressSlots: [
                    {
                        flex: 1,
                        defaultIndex: 1,
                        values: Object.keys(addressData),
                        className: 'slot1',
                        textAlign: 'center'
                    }, {
                        divider: true,
                        content: '-',
                        className: 'slot2'
                    }, {
                        flex: 1,
                        values: [],
                        className: 'slot3',
                        textAlign: 'center'
                    }, {
                        divider: true,
                        content: '-',
                        className: 'slot4'
                    }, {
                        flex: 1,
                        values: [],
                        className: 'slot5',
                        textAlign: 'center'
                    }
                ],
                addressSlotsTwo: [
                    {
                        flex: 1,
                        defaultIndex: 1,
                        values: Object.keys(addressData),
                        className: 'slot1',
                        textAlign: 'center'
                    }, {
                        divider: true,
                        content: '-',
                        className: 'slot2'
                    }, {
                        flex: 1,
                        values: [],
                        className: 'slot3',
                        textAlign: 'center'
                    }
                ],
                addressProvince: '省',
                addressCity: '市',
                addressArea: '区',
            }
        },
        mounted() {
            if (this.visibleColumn == 2) {
                this.addressSlots = this.addressSlotsTwo;
            }
            this.$nextTick(() => {
                setTimeout(() => {//初始化默认值
                    this.addressSlots[0].defaultIndex = 0;
                }, 100);
            });
        },
        methods: {
            onAddressChange(picker, values) {
                let city = Object.keys(addressData[values[0]]);
                let index = city.indexOf(values[1])
                let area = addressData[values[0]][city[index]];

                picker.setSlotValues(1, city);
                picker.setSlotValues(2, area);
                this.addressProvince = values[0];
                this.addressCity = values[1];
                this.addressArea = values[2];
                if (this.visibleColumn == 2) {
                    this.$emit("addressChange", this.addressProvince + this.addressCity);
                } else {
                    this.$emit("addressChange", this.addressProvince + this.addressCity + this.addressArea);
                }
            },
            close() {
                if (this.visibleColumn == 2) {
                    this.$emit("click", this.addressProvince + this.addressCity);
                } else {
                    this.$emit("click", this.addressProvince + this.addressCity + this.addressArea);
                }
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .picker {
        position absolute
        bottom 0
        left 0
        width 100%
        background white
    }
</style>