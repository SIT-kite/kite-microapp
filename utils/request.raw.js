// request.raw.js

// request(obj): Promise
import promisify from "./promisify";
export default promisify(wx.request);
