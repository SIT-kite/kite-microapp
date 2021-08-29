// transformations(times : number,length : number) Point:array
// 二进制转换，并返回成数组(length为想要数组长度)
// 返回值格式[1,0,1,0]
const transformations = (times,length) => {
    　　var two = parseInt(times).toString(2);
    　　var Point = [];
    　　if (two.length < length) {
    　　　　for (var j = 0; j < (length - two.length); j++) {
    　　　　　　Point.push('0')
    　　　　}
    　　}
    　　for (var k = 0; k < two.length; k++) {
    　　　　Point.push(two.charAt(k))
    　　}
    　　return Point;
    }


// 在XXX.js通过 var timeUtils = require("../../utils/transformationsUtils")
// transformationsUtils.XXX() 来引用
module.exports = {
    transformations
}
