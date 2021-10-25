async () => {

  let scroll;

  await new Promise(
    resolve => wx.createSelectorQuery().select("selector1").node(
      res => {
        scroll = res.node;
        resolve();
      }
    ).exec()
  );

  scroll.scrollIntoView("selector2");

}
