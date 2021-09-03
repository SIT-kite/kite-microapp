// drawCanvas(canvas, data)
export default async (canvas, data) => {

	const ctx = canvas.getContext("2d");

	const px = 1; // wx.getSystemInfoSync().windowWidth / 750;
	const cw =  650 * px;
	const ch = 1000 * px;

	canvas.width = cw;
	canvas.height = ch;

	console.log({ data, px, cw, ch });

	// 绘制图像时，需要先载入图像，再在回调函数 onload 中绘制图像
	/* drawImageBySrc(
		src: String, dx: Number, dy: number, dWidth: Number, dHeight: Number,
		callback?: Function
	): Promise */
	const drawImageBySrc = (src, dx, dy, dWidth, dHeight, callback) => new Promise(
		(resolve, reject) => Object.assign(
			canvas.createImage(), {
				src,
				onload: e => {
					ctx.drawImage(e.target, dx, dy, dWidth, dHeight);
					typeof callback === "function" && callback();
					resolve();
				},
				onerror: err => {
					console.error("drawImageBySrc():", err);
					reject("drawImageBySrc(): image load error");
				}
			}
		)
	);

	const saveRestore = async callback => {
		ctx.save();
		await callback();
		ctx.restore();
	}

	const arcPath = (...arg) => {
		ctx.beginPath();
		ctx.arc(...arg);
		ctx.closePath();
	};

	// 头像 直径 d 半径 r 坐标 x y
	const avatar_d = 150 * px;
	const avatar_r = avatar_d / 2;
	const avatar_x = cw / 2 - avatar_r;
	const avatar_y = 20 * px;

	// 白色背景 坐标 x y 宽高 w h
	const main_x = 50 * px;
	const main_y = avatar_d + avatar_y;
	const main_w = 550 * px;
	const main_h = ch - 40 * px - avatar_r - avatar_y;

	const getCenter_x = w => main_x + (main_w - w) / 2;

	// 背景
	// 渐变背景
	var gra = ctx.createLinearGradient(0, 0, cw, ch);
	gra.addColorStop(0.1, "#ABDCFF");
	gra.addColorStop(1, "#0396FF");

	ctx.fillStyle = gra; // "rgb(48,191,109)"
	ctx.fillRect(0, 0, cw, ch);

	// 白色背景
	ctx.fillStyle = "#FAFAFA";
	ctx.fillRect(main_x, main_y - avatar_r, main_w, main_h);

	// 头像白底
	ctx.fillStyle = "white";
	arcPath(
		avatar_x + avatar_r, avatar_y + avatar_r, avatar_r + 5 * px, 0, Math.PI * 2
	);
	ctx.fill();

	// 头像
	await saveRestore(async () => {
		arcPath(
			avatar_x + avatar_r, avatar_y + avatar_r, avatar_r, 0, Math.PI * 2
		);
		ctx.clip();
		await drawImageBySrc(data.avatarPath, avatar_x, avatar_y, avatar_d, avatar_d);
	})

	// 用户昵称 y = 60
	ctx.font = `normal bold ${Math.round(42*px)}px Microsoft YaHei`;
	ctx.fillStyle = "black";
	const name = data.nickName;
	const name_w = ctx.measureText(name).width;
	ctx.fillText(name, getCenter_x(name_w), main_y + 60 * px, 500 * px);

	const gap_w =  20 * px;
	const font_normal = `normal bold ${Math.round(36*px)}px Microsoft YaHei`;
	const font_large  = `normal bold ${Math.round(50*px)}px Microsoft YaHei`;

	// 第一行字 y = 160
	// 昨日消耗电费 xx.xx 元
	// bill1        bill2 bill3
	{

		ctx.font = font_normal;
		const bill1 = "昨日消耗电费";
		const bill3 = "元";
		const bill1_w = ctx.measureText(bill1).width;
		const bill3_w = ctx.measureText(bill3).width;

		ctx.font = font_large;
		const bill2 = `${data.rank.con}`;
		const bill2_w = ctx.measureText(bill2).width;

		const bill_w = bill1_w + gap_w + bill2_w + gap_w + bill3_w;
		const bill_x = getCenter_x(bill_w);
		const bill_y = main_y + 160 * px;

		ctx.font = font_normal;
		ctx.fillStyle = "black";
		ctx.fillText(bill1, bill_x, bill_y);
		ctx.fillText(bill3, bill_x + bill1_w + gap_w + bill2_w + gap_w, bill_y);

		ctx.font = font_large;
		ctx.fillStyle = "red";
		ctx.fillText(bill2, bill_x + bill1_w + gap_w, bill_y);

	}

	// 第二行字 y = 230
	// 超越了   yy.yy%   的寝室
	// percent1 percent2 percent3
	{

		ctx.font = font_normal;
		const percent1 = "超越了";
		const percent3 = "的寝室";
		const percent1_w = ctx.measureText(percent1).width;
		const percent3_w = ctx.measureText(percent1).width;

		ctx.font = font_large;
		const percent2 = `${data.rank.percen}%`;
		const percent2_w = ctx.measureText(percent2).width;

		const percent_w =
			percent1_w + gap_w + percent2_w + gap_w + percent3_w;
		const percent_x = getCenter_x(percent_w);
		const percent_y = main_y + 230 * px;

		ctx.fillStyle = "black";
		ctx.font = font_normal;
		ctx.fillText(percent1, percent_x, percent_y);
		ctx.fillText(percent3, percent_x + percent1_w + gap_w + percent2_w + gap_w, percent_y);

		ctx.fillStyle = "red";
		ctx.font = font_large;
		ctx.fillText(percent2, percent_x + percent1_w + gap_w, percent_y);

	}

	// 图片 省电达人 / 空调才是本体 y = 270
	const power_d = 330 * px;
	const power_args = [ getCenter_x(power_d), main_y + 270 * px, power_d, power_d ];
	if (data.rank.percen <= 25) {
		await drawImageBySrc(
			"/electricity/assets/power_saver.png", ...power_args
		);
	} else if (data.rank.percen >= 75) {
		await drawImageBySrc(
			"/electricity/assets/power_user.png", ...power_args
		);
	}

	// 图片 小程序码
	await drawImageBySrc(
		"/assets/share_code.png",
		main_w - 110 * px,
		main_y + main_h - 170 * px - avatar_r,
		150 * px, 150 * px
	);

	// 长按识别小程序码 打开上应小风筝，享受便利校园

	const share_x = main_x + main_w - 180 * px;
	const share_y = main_y + main_h - avatar_r;
	const getShare_x = sharetext =>
		share_x - ctx.measureText(sharetext).width;

	const share1 = "长按识别小程序码";
	const share2 = "打开上应小风筝，享受便利校园";

	ctx.font = `normal ${Math.round(24*px)}px Microsoft YaHei`;
	ctx.fillStyle = "#9E9E9E";
	ctx.fillText(share1, getShare_x(share1), share_y - 100 * px);
	ctx.fillText(share2, getShare_x(share2), share_y -  60 * px);

};
