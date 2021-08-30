// transformations(number : number,length : number) Point:array
// 二进制转换，并返回成数组(length为想要数组长度)
// 返回值格式[1,0,1,0]
const transformations = (number,length) => {
    var result = [];
    for (var  i = 1; i < length+1; i++){
        if (number & (1 << i)) {
        result.push(1);
        }else{result.push(0)}
        }
    return result;
    }


// 在XXX.js通过 var timeUtils = require("../../utils/transformationsUtils")
// transformationsUtils.XXX() 来引用
module.exports = {
    transformations
}
