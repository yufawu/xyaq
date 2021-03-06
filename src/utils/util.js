/**
 * @Description:    各种工具类
 * @Author:         TSY
 * @CreateDate:     2018/6/9 13:28
 */

/**
 * 判断安卓与IOS平台
 * @returns {string}
 */
export const checkPlatform = function () {
    if (/android/i.test(navigator.userAgent)) {
        return '1'
    }
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        return '2'
    }
}

/**
 * 判断是否为微信浏览器
 * @returns {boolean}
 */
export const isWeixin = function () {
    let ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
}

/**
 * 判断是否为iPhoneX
 * @returns {boolean}
 */
export const isIphoneX = function () {
    let ratio = window.devicePixelRatio || 1;//设备像素比
    let w = window.screen.width * ratio;
    let h = window.screen.height * ratio;
    if (checkPlatform() == 2 && w == 1125 && h == 2436) {
        return true
    }
    return false
}

/**
 * 是否为小程序环境
 * @param wx   微信SDK
 * @param callback 回调函数
 */
export const isMiniProgram = function (wx, callback) {
    //是否在微信环境
    if (!isWeixin()) {
        callback(false);
    } else {
        //微信API获取当前运行环境
        wx.miniProgram.getEnv((res) => {
            if (res.miniprogram) {//小程序环境
                callback(true);
            } else {
                callback(false);
            }
        })
    }
}

/**
 * 兼容微信设置页面的title
 */
export let setDocumentTitle = function (title) {
    document.title = title;
    let ua = navigator.userAgent;
    if (/\bMicroMessenger\/([\d.]+)/.test(ua) && /ip(hone|od|ad)/i.test(ua)) {
        let i = document.createElement('iframe');
        i.src = '/favicon.ico';
        i.style.display = 'none';
        i.onload = function () {
            setTimeout(function () {
                i.remove();
            }, 9);
        };
        document.body.appendChild(i);
    }
};

/**
 * 图片预览
 * @param Exif 图片旋转框架
 * @param file 文件
 * @param callback 回调函数
 * @returns {Promise<void>}
 */
export let imgPreview = async function (Exif, file, callback) {
    // 看支持不支持FileReader
    if (!file || !window.FileReader) return;

    let Orientation;
    let fileend = file.name.substring(file.name.lastIndexOf("."));
    let texttypes = [".txt"];
    let wordtypes = [".doc", ".docx"];
    let exceltypes = [".xlsx", ".xls", ".csv"];
    let ppttypes = [".ppt"];
    let pdftypes = [".pdf"];
    let ziptypes = [".rar", ".zip"];

    if (/^image/.test(file.type)) {//图片处理方式
        //去获取拍照时的信息，解决拍出来的照片旋转问题
        Exif.getData(file, function () {
            Orientation = Exif.getTag(this, 'Orientation') || '';
        });
        // 创建一个reader
        let reader = new FileReader();
        // 将图片将转成 base64 格式
        reader.readAsDataURL(file);
        // 读取成功后的回调
        reader.onloadend = function () {
            let img = new Image;
            img.src = this.result;
            //判断图片是否小于200K,是就直接上传，反之压缩图片
            if (this.result.length <= (200 * 1024)) {
                callback({'data': this.result, 'type': 'image'});
            } else {
                img.onload = function () {
                    let data = compress(img, Orientation);
                    callback({'data': data, 'type': 'image'});
                }
            }
        }
    } else {
        // 文件大小限制
        let fileSize = file.size;
        if (fileSize > 1024 * 1024 * 10) {
            callback({'data': file, 'type': 'outOfSize', 'img': require('../assets/specialCheck/add_picture.png')});
            return;
        }
        if (texttypes.includes(fileend)) {//文本文件处理方式
            callback({'data': file, 'type': 'text', 'img': require('../assets/specialCheck/file.png')});
        } else if (ziptypes.includes(fileend)) {//zip文件处理方式
            callback({'data': file, 'type': 'zip', 'img': require('../assets/specialCheck/file.png')});
        } else if (pdftypes.includes(fileend)) {//pdf文件处理方式
            callback({'data': file, 'type': 'pdf', 'img': require('../assets/specialCheck/file.png')});
        } else if (exceltypes.includes(fileend)) {//excel文件处理方式
            callback({'data': file, 'type': 'excel', 'img': require('../assets/specialCheck/file.png')});
        } else if (wordtypes.includes(fileend)) {//word文件处理方式
            callback({'data': file, 'type': 'word', 'img': require('../assets/specialCheck/file.png')});
        } else if (ppttypes.includes(fileend)) {//ppt文件处理方式
            callback({'data': file, 'type': 'ppt', 'img': require('../assets/specialCheck/file.png')});
        } else {
            callback({'data': file, 'type': 'other', 'img': require('../assets/specialCheck/add_picture.png')});
        }
    }
};

/**
 * 旋转图片
 * @param img
 * @param direction
 * @param canvas
 */
function rotateImg(img, direction, canvas) {
    //最小与最大旋转方向，图片旋转4次后回到原方向
    const min_step = 0;
    const max_step = 3;
    if (img == null) return;
    //img的高度和宽度不能在img元素隐藏后获取，否则会出错
    let height = img.height;
    let width = img.width;
    let step = 2;
    if (step == null) {
        step = min_step;
    }
    if (direction == 'right') {
        step++;
        //旋转到原位置，即超过最大值
        step > max_step && (step = min_step);
    } else {
        step--;
        step < min_step && (step = max_step);
    }
    //旋转角度以弧度值为参数
    let degree = step * 90 * Math.PI / 180;
    let ctx = canvas.getContext('2d');
    switch (step) {
        case 0:
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0);
            break;
        case 1:
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(degree);
            ctx.drawImage(img, 0, -height);
            break;
        case 2:
            canvas.width = width;
            canvas.height = height;
            ctx.rotate(degree);
            ctx.drawImage(img, -width, -height);
            break;
        case 3:
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(degree);
            ctx.drawImage(img, -width, 0);
            break;
    }
}

/**
 * 压缩图片
 * @param img
 * @param Orientation
 * @returns {string}
 */
function compress(img, Orientation) {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext('2d');
    //canvas
    let tCanvas = document.createElement("canvas");
    let tctx = tCanvas.getContext("2d");
    let width = img.width;
    let height = width * (img.height / img.width);
    //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
    let ratio;
    if ((ratio = width * height / 4000000) > 1) {
        ratio = Math.sqrt(ratio);
        width /= ratio;
        height /= ratio;
    } else {
        ratio = 1;
    }
    canvas.width = width;
    canvas.height = height;
    //   铺底色
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //如果图片像素大于100万则使用瓦片绘制
    let count;
    if ((count = width * height / 1000000) > 1) {
        count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
        //            计算每块瓦片的宽和高
        let nw = ~~(width / count);
        let nh = ~~(height / count);
        tCanvas.width = nw;
        tCanvas.height = nh;
        for (let i = 0; i < count; i++) {
            for (let j = 0; j < count; j++) {
                tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
                ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
            }
        }
    } else {
        ctx.drawImage(img, 0, 0, width, height);
    }
    //修复ios上传图片的时候 被旋转的问题
    if (Orientation != "" && Orientation != 1) {
        switch (Orientation) {
            case 6://需要顺时针（向左）90度旋转
                rotateImg(img, 'left', canvas);
                break;
            case 8://需要逆时针（向右）90度旋转
                rotateImg(img, 'right', canvas);
                break;
            case 3://需要180度旋转
                rotateImg(img, 'right', canvas);//转两次
                rotateImg(img, 'right', canvas);
                break;
        }
    }
    //进行最小压缩
    let ndata = canvas.toDataURL('image/jpeg', 0.2);
    tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
    return ndata;
}

/**
 * 日期格式化
 * @param time
 * @param format
 * @returns {string}
 */
export let formatDate = function (time, format = 'YY-MM-DD hh:mm:ss') {
    let date = new Date(time);

    let year = date.getFullYear(),
        month = date.getMonth() + 1,//月份是从0开始的
        day = date.getDate(),
        hour = date.getHours(),
        min = date.getMinutes(),
        sec = date.getSeconds();
    let preArr = Array.apply(null, Array(10)).map(function (elem, index) {
        return '0' + index;
    });////开个长度为10的数组 格式为 00 01 02 03

    let newTime = format.replace(/YY/g, year)
        .replace(/MM/g, preArr[month] || month)
        .replace(/DD/g, preArr[day] || day)
        .replace(/hh/g, preArr[hour] || hour)
        .replace(/mm/g, preArr[min] || min)
        .replace(/ss/g, preArr[sec] || sec);

    return newTime;
}

/**
 * 获取URL地址中的参数  queryString
 * @param name
 * @returns {*}
 */
export let getQueryString = function (name, href) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let r = decodeURI(window.location.search).substr(1).match(reg);
    if (href) {
        href = href.split('?')[1];
        r = decodeURI(href).match(reg);
    }
    if (r != null) return unescape(r[2]);
    return null;
}

/**
 * 中文按拼音首字母排序
 * @param arr
 * @param empty
 * @returns {*}
 */
export let pySort = function (arr, empty) {
    if (!String.prototype.localeCompare)
        return null;
    let letters = "ABCDEFGHJKLMNOPQRSTWXYZ".split('');
    let zh = "阿八嚓哒妸发旮哈讥咔垃痳拏噢妑七呥扨它穵夕丫帀".split('');
    let arrList = [];
    for (let m = 0; m < arr.length; m++) {
        arrList.push(arr[m]);
    }
    let result = [];
    let curr;
    for (let i = 0; i < letters.length; i++) {
        curr = {letter: letters[i], data: []};
        if (i != 26) {
            for (let j = 0; j < arrList.length; j++) {
                let initial = arrList[j].charAt(0);//截取第一个字符
                if (arrList[j].charAt(0) == letters[i] || arrList[j].charAt(0) == letters[i].toLowerCase()) {   //首字符是英文的
                    curr.data.push(arrList[j]);
                } else if (zh[i] != '*' && isChinese(initial)) {      //判断是否是无汉字,是否是中文
                    if (initial.localeCompare(zh[i]) >= 0 && (!zh[i + 1] || initial.localeCompare(zh[i + 1]) < 0)) {   //判断中文字符在哪一个类别
                        curr.data.push(arrList[j]);
                    }
                }
            }
        } else {
            for (let k = 0; k < arrList.length; k++) {
                let ini = arrList[k].charAt(0);           //截取第一个字符
                if (!isChar(ini) && !isChinese(ini)) {
                    curr.data.push(arrList[k]);
                }
            }
        }
        if (empty || curr.data.length) {
            result.push(curr);
            //curr.data.sort(function(a,b){
            //    return b.localeCompare(a);       //排序,英文排序,汉字排在英文后面
            //});
        }
    }
    return result;
}

/**
 * 是否为中文
 * @param temp
 * @returns {boolean}
 */
function isChinese(temp) {
    let re = /[^\u4E00-\u9FA5]/;
    if (re.test(temp)) {
        return false;
    }
    return true;
}

/**
 * 是否为英文
 * @param char
 * @returns {boolean}
 */
function isChar(char) {
    let reg = /[A-Za-z]/;
    if (!reg.test(char)) {
        return false;
    }
    return true;
}

/**
 * 替换全部匹配的字符
 * @param f  代替换的字符
 * @param e  替换之后的字符
 * @returns {*}
 */
export const replaceAll = function (f, e) {//把f替换成e
    var reg = new RegExp(f, "g"); //创建正则RegExp对象
    return this.replace(reg, e);
}

/**
 * 去除字符串中的html标签
 * @param str
 * @returns {*}
 */
export const delHtmlTag = function (str) {
    str = str || '';
    return str.replace(/<[^>]+>/g, "");//去掉所有的html标记
}

/**
 * 根据日期字符串获取星期几
 * @param dateString 日期字符串（如：2016-12-29），为空时为用户电脑当前日期
 * @returns {String}
 */
export const getWeekFromDateString = function (dateString) {
    var date;
    if (isNull(dateString)) {
        date = new Date();
    } else {
        var dateArray = dateString.split("-");
        date = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2]);
    }
    //var weeks = new Array("日", "一", "二", "三", "四", "五", "六");
    //return "星期" + weeks[date.getDay()];
    return "星期" + "日一二三四五六".charAt(date.getDay());
}

/**
 * 是否为Null
 * @param object
 * @returns {Boolean}
 */
function isNull(object){
    if(object == null || typeof object == "undefined"){
        return true;
    }
    return false;
}

/**
 * 把英文转换成对应的的数字传给后台
 * @param type
 * @returns {string}
 */
export const changeType2Number = function (type) {
    let num = '1';
    switch (type) {
        case 'radio':
            num = '1';
            break;
        case 'checkbox':
            num = '2';
            break;
        case 'text':
            num = '3';
            break;
        case 'file':
            num = '4';
            break;
    }
    return num;
}

/**
 * 把后台传过来的数字转换成对应的职位
 * @param job
 * @returns {string}
 */
export const changeJob2String = function (job) {
    let jobString = '其他';
    job = parseInt(job);
    switch (job) {
        case 1:
            jobString = '教育局领导';
            break;
        case 2:
            jobString = '安保科科长';
            break;
        case 3:
            jobString = '安保科科员';
            break;
        case 4:
            jobString = '校长';
            break;
        case 5:
            jobString = '安全处主任';
            break;
        case 6:
            jobString = '安全员';
            break;
    }
    return jobString;
}

/**
 * 把后台传过来的数字转换成对应的区域
 * @param num
 * @returns {string}
 */
export const changeNum2Area = function (num) {
    let area = ""
    num = parseInt(num);
    switch (num) {
        case 1:
            area = '祖庙';
            break;
        case 2:
            area = '张槎';
            break;
        case 3:
            area = '石湾';
            break;
        case 4:
            area = '南庄';
            break;
    }
    return area;
}

/**
 * 把后台传过来的数字转换成对应的隐患性质
 * @param num
 * @returns {string}
 */
export const change2nature = function (num) {
    num = parseInt(num);
    let nature = "";
    switch (num) {
        case 1:
            nature = "责任事故";
            break;
        case 2:
            nature = "自然事故";
            break;
        case 3:
            nature = "技术事故";
            break;
        case 4:
            nature = "其他";
            break;
        default:
            nature = "其他";
            break;
    }
    return nature;
}

/**
 * 把后台传过来的数字转换成对应的隐患类型
 * @param num
 * @returns {string}
 */
export const change2type = function (num) {
    num = parseInt(num);
    let type = "";
    switch (num) {
        case 1:
            type = "交通事故";
            break;
        case 2:
            type = "踩踏事故";
            break;
        case 3:
            type = "溺水事故";
            break;
        case 4:
            type = "火灾事故";
            break;
        case 5:
            type = "触电事故";
            break;
        case 6:
            type = "校园伤害";
            break;
        case 7:
            type = "其他";
            break;
        default:
            type = "其他";
            break;
    }
    return type;
}

/**
 * 把后台传过来的数字转换成对应的隐患等级
 * @param num
 * @returns {string}
 */
export const change2grade = function (num) {
    num = parseInt(num);
    let grade = "";
    switch (num) {
        case 1:
            grade = "特大事故";
            break;
        case 2:
            grade = "重大事故";
            break;
        case 3:
            grade = "较大事故";
            break;
        case 4:
            grade = "一般事故";
            break;
        default:
            grade = "其他";
            break;
    }
    return grade;
}

/**
 * 把后台传过来的数字转换成对应的隐患状态
 * @param num
 * @returns {string}
 */
export const change2status = function (num) {
    num = parseInt(num);
    let status = "";
    switch (num) {
        case 1:
            status = "新填报未批示";
            break;
        case 2:
            status = "处理中未批示";
            break;
        case 3:
            status = "已结案未批示";
            break;
        case 4:
            status = "处理中已批示";
            break;
        case 5:
            status = "已结案已批示";
            break;
        case 6:
            status = "异常";
            break;
        default:
            status = "其他";
            break;
    }
    return status;
}

/**
 * 对象形式的数组排序，传入对象数组、需要排序的属性
 * @param num
 * @returns {string}
 */
export function sortKey(array, key) {
    return array.sort(function (a, b) {
        let x = a[key]
        let y = b[key]
        return ((x < y) ? -1 : (x > y) ? 1 : 0)
    })
}
