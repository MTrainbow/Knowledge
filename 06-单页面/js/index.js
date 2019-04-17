/*1.ajax异步加载 渲染页面*/
/*2.渲染什么页面需要和后台提供的地址保持一致*/
/*3.切换历史渲染页面*/
$(function ($) {
    $('.wrapper').on('click','a',function (e) {
        var page = $(this).parent().data('page')
        render(page)
        //追加地址,且地址后台必现存在
        var historyUrl = $(this).attr('href')
        history.pushState(null,null,historyUrl)

        return false
    })

    //监听切换历史
    window.onpopstate = function (e) {
        var pathname = location.pathname
        var page = 'index'
        if (pathname.indexOf('index.php') > -1){
            page = 'index'
        }else if(pathname.indexOf('friend.php') > -1){
            page = 'friend'
        }else if(pathname.indexOf('my.php') > -1){
            page = 'my'
        }

        render(page)
    }

    var render = function (page) {
        $.getJSON('api/data.php',{page:page},function (res) {
            $('[data-page]').removeClass('now')
            $('[data-page = "'+res.page+'"]').addClass('now')
            $('.content').html(res.html)
        })
    }


})