// 关于
// pages/about/about.js

import copyText from "../../../js/copyText";

const html = [
/*
`<h2 class="title">关于我们</h2>

<blockquote class="blockquote content">
<ul class="ul">
<li class="li">你是否想体验一次当学生记者的感觉？</li>
<li class="li">你是否渴望在镜头前表现自己最出色的一面？</li>
<li class="li">你是否计划手持单反，锻炼自己的摄影技巧？</li>
<li class="li">你是否期待亲自举办一次声势浩大的晚会！</li>
</ul>
</blockquote>

<p class="p center">快加入我们吧！</p>

<p class="p"><strong>上海应用技术大学</strong>校易班学生工作站有八个常设部门，<!--
-->包括活动策划部、宣传部、编辑部、人力资源部、站务部、记者团、网课部和技术部。<!--
-->站长团具体负责工作站日常事务，各部门协同配合举办各类易班主题和校级重要活动。</p>`,

`<h2 class="title">参与贡献</h2>

<p class="p">在每年招新期间，你可以关注一下“上海应用技术大学易班”公众号或有关QQ群，<!--
-->了解招新信息，加入校易班工作站。<small class="welcome">（欢迎来技术部！）</small></p>

<p class="p">你也可以直接向有关项目提交 Issue 或 PR，留下你的痕迹；开源代码仓库见下。</p>`
 */
].map(
  section => `<section class="section">${section}</section>`
).join("");

const contributors = [ "上海应用技术大学学生" ]; /*  [
  [ 2017, "外国语", "张城" ],
  [ 2017,     "理", "Snowstar Cyan" ],
  [ 2017, "计算机科学与信息工程", "peanut996" ],
  [ 2018,       "材料科学与工程", "RainSlide" ],
  [ 2018, "计算机科学与信息工程", "AlenYing" ],
  [ 2018, "计算机科学与信息工程", "sunnysab" ],
  [ 2018, "计算机科学与信息工程", "wanfengcxz" ],
  [ 2019, "计算机科学与信息工程", "B635" ],
  [ 2019, "计算机科学与信息工程", "wzh" ],
  [ 2019, "计算机科学与信息工程", "EvilorLive" ],
  [ 2019,             "机械工程", "zdy180108" ],
  [ 2020, "计算机科学与信息工程", "Pony-Zhang" ],
  [ 2020, "计算机科学与信息工程", "Devin" ],
  [ 2020,             "机械工程", "记者团廾匸" ]
].map(
  ([year, college, name]) => `${year}级 ${college.padStart(10, "　")}学院 ${name}`
); */

Page({
  data: { html, contributors },
  copy: e => copyText(e.target.dataset.text)
});
