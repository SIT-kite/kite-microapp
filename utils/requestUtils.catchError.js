// 打印并提示错误

const errors = {
		 NETWORK_ERROR: "网络请求错误",
		 REQUEST_ERROR: "业务逻辑错误",
	NO_ACCOUNT_ERROR: "账号不存在"
};

const isNonEmptyString = _ =>
  Object.prototype.toString.call(_) === "[object String]" &&
  _.trim() !== "";

const requestErrorSymbol = Symbol("REQUEST_ERROR");

const errorMap = new Map([
  [ errors.NETWORK_ERROR, "网络不在状态" ], // 网络请求错误
  [ errors.REQUEST_ERROR, requestErrorSymbol ], // 业务逻辑错误
  [ errors.NO_ACCOUNT_ERROR, "查询不到该用户的信息" ] // 账号不存在
]);

const errorHandlerMap = new Map([
  [ requestErrorSymbol, msg => isNonEmptyString(msg) ? msg : "业务逻辑出错" ],
  [ undefined, () => "未知错误" ]
])

// catchError(res: Object)
export default res => {

  let content = errorMap.get(res.error);
  if ( errorHandlerMap.has(content) ) {
    content = errorHandlerMap.get(content)(res.data);
  }

  console.error("catchError():", res);

  wx.showModal({
    title: "哎呀，出错误了 >.<",
    content,
    showCancel: false
  });

};
