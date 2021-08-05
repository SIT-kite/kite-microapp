// request(obj): Promise
const symbols = {
		codeError:   Symbol("codeError"),
		codeNotZero: Symbol("codeNotZero")
};

const error = res => Object.assign(
	{ res, codeError: symbols.codeError },
	!("code" in res.data)
		? { msg: "res.code missing" }
		: typeof res.data.code !== "number"
			? { msg: "res.code is not a Number" }
			: { msg: "res.code is not 0", codeNotZero: symbols.codeNotZero }
)

export default Object.assign(
	option => new Promise(
		(resolve, reject) => wx.request(
			Object.assign(
				{}, option, {
					success: res =>
						res.data.code === 0 ? resolve(res) : reject(error(res)),
					fail: reject
				}
			)
		)
	), { symbols }
);
