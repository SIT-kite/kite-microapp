// 关于
// pages/about/about.js
import { handlerGohomeClick, handlerGobackClick } from '../../utils/navBarUtils'

const htmlSnip =
`<h1 class="title">关于上应小风筝</h1>

<p>上应小风筝，这里的校园很棒！</p>

<h2 class="title">联系我们</h2>

<ol>
<li>小程序反馈群: 943110696</li>
<li>2020级易班新生群: 962202486</li>
<li>奉贤校区大学生活动中心309室</li>
</ol>

<h2 class="title">关于我们</h2>

<div class="blockquote">
<p>你是否想体验一次学生记者的感觉？</p>
<p>你是否渴望在镜头前露面，表达自己出色的一面！</p>
<p>你是否计划手持一只单反，锻炼自己的摄影技巧？</p>
<p>你是否期待自己举办一次声势浩大的晚会！</p>
<p>快加入我们吧！</p>
</div>

<p class="p"><strong>上海应用技术大学</strong>校易班学生工作站有八个常设部门，包括活动策划部、宣传部、编辑部、人力资源部、站务部、记者团、网课部和技术部。站长团具体负责工作站日常事务，各部门协同配合举办各类易班主题和校级重要活动。</p>

<h2 class="title">参与贡献</h2>
<p class="p">在每年招新期间，你可以关注一下"上海应用技术大学易班"公众号，或有关QQ群了解招新信息加入校易班工作站(欢迎来技术部!)<br>
你也可以直接对有关项目提交 Issue 或 PR，留下你的痕迹。</p>

<h2 class="title">贡献者</h2>
<ul>
<li>2017级 外国语学院 张城</li>
<li>2017级 生态学院 sascx</li>
<li>2018级 材料学院 rainslide</li>
<li>2018级 计算机学院 alenying</li>
<li>2017级 计算机学院 peanut996</li>
<li>2018级 计算机学院 wanfengcxz</li>
<li>2018级 计算机学院 sunnysab</li>
<li>2017级 理学院 snowstar cyan</li>
</ul>

<h2 class="title">开源代码</h2>
<p>github.com/SIT-Yiban/kite-microapp</p>
<br>`

Page({

  data: { htmlSnip },

  // navBar handler
  handlerGohomeClick: handlerGohomeClick,
  handlerGobackClick: handlerGobackClick,

})
