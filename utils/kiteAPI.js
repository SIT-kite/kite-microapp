import request   from "./request";
import getHeader from "./getHeader";

// kiteAPI(globalData): kiteAPI(option): Promise
export default globalData => option => request(
  Object.assign(
    option, {
      url: `${globalData.apiUrl}${option.url}`,
      header: Object.assign(
        getHeader("urlencoded", globalData.token),
        option.header || {}
      )
    }
  )
)

/*

import kiteAPI from ".../kiteAPI";

kiteAPI = kiteAPI(globalData);

kiteAPI({ url: "/notice" }).then(
  res => this.setNotice(res.data.data)
);

*/
