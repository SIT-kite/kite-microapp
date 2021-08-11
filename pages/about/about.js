// 关于
// pages/about/about.js

import { handlerGohomeClick, handlerGobackClick } from "../../utils/navBarUtils"

const html =
`<h1 class="title">关于上应小风筝</h1>

<p class="p center">上应小风筝，这里的校园很棒！</p>

<h2 class="title">联系我们</h2>

<ol class="list">
<li class="li">小程序反馈群：943110696</li>
<li class="li">2021级易班新生群：147239936</li>
<li class="li">奉贤校区大学生活动中心309室</li>
</ol>

<h2 class="title">关于我们</h2>

<div class="blockquote">
<p class="p">你是否想体验一次当学生记者的感觉？</p>
<p class="p">你是否渴望在镜头前表现自己最出色的一面？</p>
<p class="p">你是否计划手持单反，锻炼自己的摄影技巧？</p>
<p class="p">你是否期待亲自举办一次声势浩大的晚会！</p>
<p class="p center">快加入我们吧！</p>
</div>

<p class="p"><strong>上海应用技术大学</strong>校易班学生工作站有八个常设部门，包括活动策划部、宣传部、编辑部、人力资源部、站务部、记者团、网课部和技术部。站长团具体负责工作站日常事务，各部门协同配合举办各类易班主题和校级重要活动。</p>

<h2 class="title">参与贡献</h2>

<p class="p">在每年招新期间，你可以关注一下“上海应用技术大学易班”公众号或有关QQ群，了解招新信息，加入校易班工作站（欢迎来技术部！）</p>
<p class="p">你也可以直接向有关项目提交 Issue 或 PR，留下你的痕迹；开源代码仓库见下。</p>

<h2 class="title">贡献者</h2>

<ul class="list">
<li class="li">2017级&ensp;外国语学院 &ensp; 张城</li>
<li class="li">2017级&ensp;生态技术与工程学院 &ensp; sascx</li>
<li class="li">2017级&ensp;理学院 &ensp; snowstar cyan</li>
<li class="li">2017级&ensp;计算机科学与信息工程学院 &ensp; peanut996</li>
<li class="li">2018级&ensp;材料科学与工程学院 &ensp; rainslide</li>
<li class="li">2018级&ensp;计算机科学与信息工程学院 &ensp; alenying</li>
<li class="li">2018级&ensp;计算机科学与信息工程学院 &ensp; sunnysab</li>
<li class="li">2018级&ensp;计算机科学与信息工程学院 &ensp; wanfengcxz</li>
<li class="li">2019级&ensp;计算机科学与信息工程学院 &ensp; B635</li>
<li class="li">2019级&ensp;计算机科学与信息工程学院 &ensp; wzh</li>
<li class="li">2019级&ensp;计算机科学与信息工程学院 &ensp; EvilorLive</li>
<li class="li">2019级&ensp;机械工程学院 &ensp; zdy180108</li>
<li class="li">2020级&ensp;计算机科学与信息工程学院 &ensp; Pony-Zhang</li>
<li class="li">2020级&ensp;计算机科学与信息工程学院 &ensp; Devin</li>
</ul>

<h2 class="title">开源代码</h2>
<p>https://github.com/SIT-Yiban/</p>`

Page({

  data: { html },

  // navBar handler
  handlerGohomeClick: handlerGohomeClick,
  handlerGobackClick: handlerGobackClick,

})
