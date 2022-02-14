// drawCanvas(canvas, data)

const srcMap = new Map([
	// ["avatar", avatarPath],
	["power-user", "./assets/power-user.png"],
	["power-saver", "./assets/power-saver.png"],
	["power-common", "./assets/power-common.png"],
	["appcode", "./assets/appcode.png"]
]);

export default async (canvas, data) => {

	const {
		avatarPath, nickName,
		rank: { consumption, percent }
	} = data;

	srcMap.set("avatar", avatarPath);

	const ctx = canvas.getContext("2d");

	const px = wx.getSystemInfoSync().pixelRatio;
	const cw = 650 * px;
	const ch = 1000 * px;

	canvas.width = cw;
	canvas.height = ch;

	console.log("分享图参数:", { data, px, cw, ch });

	// 绘制图像时，需要先载入图像，再在回调函数 onload 中绘制图像
	/* drawImageBySrc(
	  src: String, dx: Number, dy: number, dWidth: Number, dHeight: Number,
	  callback?: Function
	): Promise */
	const drawImageBySrc = (src, dx, dy, dWidth, dHeight, callback) => new Promise(
		(resolve, reject) => {
			const image = canvas.createImage();
			return Object.assign(
				image, {
				src,
				onload: () => {
					ctx.drawImage(image, dx, dy, dWidth, dHeight);
					typeof callback === "function" && callback();
					resolve();
				},
				onerror: err => {
					console.error("drawImageBySrc():", err);
					reject("drawImageBySrc(): image load error");
				}
			}
			);
		}
	);

	const drawImage = (name, ...args) => {
		const src = srcMap.get(name);
		if (src === undefined) {
			throw "unknown image name";
		} else {
			return drawImageBySrc(src, ...args);
		}
	}

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

	// 从 对象宽度 和 canvas 宽度 计算 使对象居中的X坐标
	// calcXfromW(w): x
	const centerXfromW = w => (cw - w) / 2;
	const centerXfromR = r => cw / 2 - r;

	// const measureText = text => {
	//   const {fontBoundingBoxAscent, fontBoundingBoxDescent} = ctx.measureText(text);
	// }

	// 各种间距
	const gap = 20 * px;

	// 计算加上间距后的总宽度
	// addGap(...w)
	const addGap = (...w) => w.reduce((sum, cur) => sum + gap + cur);

	// 头像 直径 d 半径 r 坐标 x y
	const avatar_d = 150 * px;
	const avatar_r = avatar_d / 2;
	const avatar_x = centerXfromR(avatar_r);
	const avatar_y = 25 * px;

	// 白色背景 坐标 x y 宽高 w h
	const main_x = 50 * px;
	const main_y = avatar_y + avatar_d + 25 * px;
	const main_w = 550 * px;
	const main_h = ch - 50 * px - avatar_r - avatar_y;

	// 随机方向随机颜色渐变背景
	const randomColor = [0, 0, 0].map(() => Math.ceil(191 + Math.random() * 64));
	const randomDirection = [0, 0, cw, ch].sort(() => Math.random() - 0.5);
	const gra = ctx.createLinearGradient(...randomDirection);
	gra.addColorStop(0, `rgb(${randomColor.join(", ")})`);
	gra.addColorStop(1, `rgb(${randomColor.map(color => color - 128).join(", ")})`);
	ctx.fillStyle = gra;
	ctx.fillRect(0, 0, cw, ch);

	// 白色背景
	ctx.fillStyle = "#FAFAFA";
	ctx.fillRect(main_x, avatar_y + avatar_r, main_w, main_h);

	// 头像白底
	ctx.fillStyle = "white";
	arcPath(avatar_x + avatar_r, avatar_y + avatar_r, avatar_r + 5 * px, 0, Math.PI * 2);
	ctx.fill();

	// 头像
	await saveRestore(async () => {
		arcPath(avatar_x + avatar_r, avatar_y + avatar_r, avatar_r, 0, Math.PI * 2);
		ctx.clip();
		await drawImage("avatar", avatar_x, avatar_y, avatar_d, avatar_d);
	});

	// 用户昵称 y = 20
	ctx.textAlign = "center";
	ctx.textBaseline = "top";

	ctx.font = `bold ${Math.round(42 * px)}px sans-serif`;
	ctx.fillStyle = "black";
	ctx.fillText(nickName, cw / 2, main_y + gap, 500 * px);

	ctx.textAlign = "start";
	ctx.textBaseline = "middle";

	// 绘制电费数据行
	// renderLine(prefix, text, suffix, y)
	const renderLine = (prefix, text, suffix, y) => {

		const font_normal = `${Math.round(36 * px)}px sans-serif`;
		const font_large = `bold ${Math.round(50 * px)}px sans-serif`;

		ctx.font = font_normal;
		const prefix_w = ctx.measureText(prefix).width;
		const suffix_w = ctx.measureText(suffix).width;

		ctx.font = font_large;
		const text_w = ctx.measureText(text).width;

		const line_w = addGap(prefix_w, text_w, suffix_w);
		const line_x = centerXfromW(line_w);
		const line_y = main_y + y;

		ctx.font = font_normal;
		ctx.fillStyle = "black";
		ctx.fillText(prefix, line_x, line_y);
		ctx.fillText(suffix, addGap(line_x, prefix_w, text_w), line_y);

		ctx.font = font_large;
		ctx.fillStyle = "red";
		ctx.fillText(text, addGap(line_x, prefix_w), line_y);

	};

	// 电费 y = 125
	renderLine("昨日消耗电费", `${consumption}`, "元", 125 * px);
	// 排名 y = 200
	renderLine("超越了", `${percent}%`, "的寝室", 200 * px);

	// 图片 省电达人 / 空调才是本体 / 正常用电 y = 250 d = 330
	const power_d = 330 * px;
	await drawImage(
		percent <= 30 ? "power-saver"
		: percent >= 70 ? "power-user"
		: "power-common",
		centerXfromW(power_d), main_y + 250 * px, power_d, power_d
	);

	// 图片 小程序码 d = 150
	const appCode_d = 150 * px;
	const appCode_xy = addGap(appCode_d, 50 * px);
	await drawImage("appcode", cw - appCode_xy, ch - appCode_xy, appCode_d, appCode_d);

	// 长按识别小程序码 打开上应小风筝，享受便利校园

	ctx.textAlign = "end";
	ctx.textBaseline = "middle";

	const share_x = cw - addGap(0, 50 * px, 150 * px);
	const share_y = ch - addGap(0, 50 * px);

	const share1 = "长按识别小程序码";
	const share2 = "打开上应小风筝，享受便利校园";

	ctx.font = `${Math.round(24 * px)}px sans-serif`;
	ctx.fillStyle = "#9E9E9E";
	ctx.fillText(share1, share_x, share_y - 90 * px);
	ctx.fillText(share2, share_x, share_y - 50 * px);

};
