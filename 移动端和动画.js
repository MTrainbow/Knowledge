$(function ($) {

    banner()

    initMobileTab()

    $('[data-toggle="tooltip"]').tooltip()

})
var banner = function () {
    /**
     * 1.获取数据
     * @param callback
     */
    var getData = function(callback){
        if (window.data){
            callback && callback(window.data)
        } else  {
            $.ajax({
                url:'js/data.json',
                type:'get',
                dataType:'json',
                data:'',
                success:function (data) {
                    console.log(data)
                    window.data = data ; //数据缓存,测试避免多次请求
                    callback && callback(window.data)
                }
            })
        }
    }
    /**
     * 2.配合模版渲染数据
     */
    var render = function () {
        getData(function (data) {
            var isMobile = $(window).width() < 768 ? true : false
            var pointHtml = template('pointTemplete',{list:data})
            var imgHtml = template('m_temp',{list:data,isMobile:isMobile})
            $('.carousel-indicators').html(pointHtml)
            $('.carousel-inner').html(imgHtml)
        })
    }
    /**
     * 3.数据测试和主动触发resize事件,真实开发中可有可无
     */
    $(window).on('resize',function (e) {
        render()
    }).trigger('resize')

    /**
     *  4.针对移动端触摸事件
     */
    var startX = 0
    var distance = 0
    var isMove = false
    $('.wjs_banner').on('touchstart',function (e) {
        startX = e.originalEvent.touches[0].clientX
    }).on('touchmove',function (e) {
        var moveX = e.originalEvent.touches[0].clientX
        distance = moveX - startX
        isMove = true
    }).on('touchend',function (e) {
        //移动端预设的触摸条件
        if (isMove && Math.abs(distance) > 50){
            if (distance > 0){
                //上一张
                $('.carousel').carousel('prev')
            } else {
                $('.carousel').carousel('next')
            }
        }
        //参数重置
        startX = 0
        distance = 0
        isMove = false
    })
}
var initMobileTab = function () {
    /*
    * 1.解决换行
    * */
    var $navTabs = $('.wjs_product .nav-tabs')
    var width = 0
    $navTabs.find('li').each(function (index,item) {
        width += $(this).outerWidth(true)
    })
    console.log(width)
    $navTabs.width(width)

    // 2.调整结构 ,添加盒子设置width：100%  overflow：hidden

    // 3.滑动效果s
    new IScroll($('.nav-tabs-parent')[0],{
        scrollX : true,
        scrollY : false,
        click : true
    })
}

  ##  购物车宣传（宣传页，活动页，h5宣传页）
#### 全屏切换效果
> 通过鼠标的滚轮 切换全屏页面

- 使用fullpage来完成

- 使用动画 （js实现动画，css3实现动画）
    + 一个是帧动画  一个是补间动画
    + 什么是帧动画：使用定时器 每隔一段时间 更改当前元素的状态 
    + 什么是补间动画：过渡(加过渡只要状态发生改变产出动画) 动画（多个节点来控制动画） 性能会更好
    + 在支持H5C3的的浏览器尽可能使用css3动画 （移动端开发）
    + transition  animation
    + transition  组合写法（transition:all 1s linear 1s）
      的拆分写法 transition-property  transition-duration transition-timing-function transition-delay

    + transition过渡：谁做动画给谁添加

      2D变形
      transform:translate(x,y)移动  ----定位的盒子居中显示和阴影效果更佳
      transform:scale(x,y)缩放
      transform: rotate(度数);旋转
      transform-origin:旋转中心点

### 转换
- 缩放 scale
- 位移 translate
- 旋转 rotate
- 倾斜 skew
以上四种转换方式是比较特殊，其实他们都是由 matrix 矩阵 

### 动画速度
- ease  先快后慢 最后非常慢
- linear 匀速
- ease-in 速度越来越快
- ease-out 速度越来越慢
- ease-in-out 速度先快后慢
以上五种动画速度是比较特殊，其实他们都是由 贝塞尔曲线 来的

### 3d转换 translate3d rotate3d
2d转换和3d转换区别：
1.除了多了一个参数表示3d
2.在移动端使用3d转换可以优化性能（如果设备有3d加速引擎 GPU 可以提高性能 ,是2dz转换是无法调用GPU）

### 总结
- transform会改变stacking context
- 背景图百分百(容器的宽度-背景的宽度 ）* 百分比)
- transition和animation都可以有动画完成后的监听,相当于jq中的callback
- jquery本身没有的追加插件方法$.fn.fullpage......
- C3动画添加属性、CSS添加属性、JQ动画的实质
- 三大家族的复习
- background-size /background-attachment -


### JS和jquery操作相关属性
- width
    + JS  
    获取任意<style></style>样式属性的值,带px
    function getStyleCss(element,attr) { 
            return window.getComputedStyle ? window.getComputedStyle(element,null)[attr] :
                element.currentStyle[attr];
        }
    getStyleCss(dv,width) 带px
    dv.style.width = "200px" 设置任意样式如border=‘20PX solid red’
    dv.style.width  带px,只能获取行内样式
    dv.offsetwidth  不带px,padding+border+width属性值之和(readonly)
      
    + JQ 
    $dv.css()  //设置和获取任意
    $dv.css('width','200px')  //设置单个，可以不带px    
    $dv.css(‘width’) //获取,带px
    $dv.width()  //封装的方法，直接获取width,不到px
    $dv.innerWidth() //获取padding+width
    $dv.outerWidth() //获取padding+width+borde <==> js中的offsetWith 
    
    $dv.css({                 //设置多个
             backgroundColor:"pink",
              color: "red",
              fontSize:"32px",
    })
    attr() 用于行内样式和JQ中css用法一样,设置行内样式
    $("img").attr("alt", "图破了");  //设置
    $("img").attr("alt")         //获取

- offset系列
  + 当前元素逐级网上找有定位,若都没，就相当于距离body左右的距离
  + 若父级存在定位,儿子有无定位都是距离父级左边的距离
  + 当前元素有定位,父级元素没有定位,逐级向上找有定位的，没找到就body
  
- scroll系列
  +  scrollWidth:元素中内容的实际的宽(没有边框),如果没有内容就是元素的宽
  +  scrollHeight:元素中内容的实际的高(没有边框),如果没有内容就是元素的高  
  +  scrollTop : 向上卷曲的距离
  +  scrollLeft: 向左卷曲的距离 
  
- client系列:可视区域
   + clientWidth:可视区域的宽(没有边框),边框内部的宽度
   + clientHeight:可视区域的高(没有边框),边框内部的高度
   + clientLeft:左边边框的宽度
   + clientTop :上面的边框的宽度

   + function getScroll() {   //页面卷曲
        return {
            left : window.pageXOffset||document.body.scrollLeft||document.documentElement.scrollLeft||0,
            top  : window.pageYOffset||document.body.scrollTop||document.documentElement.scrollTop||0
        }
    }
   + function getViewPort() {  //页面可视区域
        return {
            width : document.documentElement.clientWidth||document.body.clientWidth||0,
            height: document.documentElement.clientHeight||document.body.clientHeight||0
        }
    }
    //监听可视区域
   + window.onresize = function () {
        console.log(getViewPort().width);
        console.log(getViewPort().height);
    };
    //监听卷曲
   + window.onscroll = function () {
        console.log(getScroll().left);
        console.log(getScroll().top);
    };
   + /*终极版本
         *图片跟着鼠标飞,可以在任何的浏览器中实现
         window.event和事件参数对象e的兼容
         clientX和clientY单独的使用的兼容代码
         scrollLeft和scrollTop的兼容代码
         pageX,pageY和clientX+scrollLeft 和clientY+scrollTop

         把代码封装在一个函数
         
         把代码放在一个对象中
         把代码放在一个对象中
         */
         var evt={
             getEvent:function (evt) {   //window.event和事件参数对象e的兼容
                 return window.event||evt;
             },
             getClientX:function (evt) {  //可视区域的横坐标的兼容代码
                 return this.getEvent(evt).clientX;
             },
             getClientY:function (evt) {   //可视区域的纵坐标的兼容代码
                 return this.getEvent(evt).clientY;
             },
             getScrollLeft:function () {   //页面向左卷曲出去的横坐标
                 return window.pageXOffset||document.body.scrollLeft||document.documentElement.scrollLeft||0;
             },
             getScrollTop:function () {    //页面向上卷曲出去的纵坐标
                 return window.pageYOffset||document.body.scrollTop||document.documentElement.scrollTop||0;
             },
             getPageX:function (evt) {    //相对于页面的横坐标(pageX或者是clientX+scrollLeft)
                 return this.getEvent(evt).pageX? this.getEvent(evt).pageX:this.getClientX(evt)+this.getScrollLeft();
             },
             getPageY:function (evt) {   //相对于页面的纵坐标(pageY或者是clientY+scrollTop)
                 return this.getEvent(evt).pageY?this.getEvent(evt).pageY:this.getClientY(evt)+this.getScrollTop();
             }
         };
         
         document.onmousemove=function (e) {
             my$("im").style.left=evt.getPageX(e)+"px";
             my$("im").style.top=evt.getPageY(e)+"px";
         };
         //下面jq页面兼容ie8
         $(document).mousemove(function (e) {
                     $('img').css('left',e.pageX-$('img').width()/2)
                     $('img').css('top',e.pageY-$('img').height()/2)
                 }) 


### H5
- 新增api
    + 1. querySelector()       获取符合选择器的第一个元素
    + 2. querySelectorAll()    获取符合选择器的所有元素
    
- 类操作 和jquery类似
    + add(),remove(),toggle() contains()-----classList

- 自定义属性 data-*
    + jquery $('div').data('') 设置和css套路一样
    + div.dataset.*      设置和js设置属性套路一样
    