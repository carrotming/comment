/**
 * Created by 704664846 on 2017/3/4.
 */
$(function (){
  var headerT=$('#header').offset().top;
    $(window).on('scroll',function (){
        var scrollT=$(window).scrollTop();
        if(scrollT>=headerT){
            $('#rocket').stop().fadeIn(300)
            $('#header').css({
                'position':'fixed',
                'top':-50,
            })
            $('#leftPic').fadeIn(300);
            $('#header').css({background:'white'})
        }else{
            $('#rocket').stop().fadeOut(300)
            $('#header').css({
                'position':'absolute',
                'top':headerT,
            })
            $('#leftPic').hide();
            $('#header').css({background:'#f0f0f3'})
        }
    })

    $('#rocket').click(function (){
        event.stopPropagation();
        $('html body').animate({scrollTop:0})
    })

    var dataArr=[];
    
    function init(){
        dataArr=store.get('dataArr')||[];
        layout();
    }
    init();
    
    
    $('#btn').click(function (event){
        event.stopPropagation();
        event.preventDefault();
        var value=$('#box input[type=text]').val();
        if($.trim(value)==''){
            alert('请输入点什么');
        }else{
            var newIten={
                title:'',
                time:'',
                content:'',
                flag:false,
                isTime:false
            }
            newIten.title=value;
            dataArr.push(newIten);
            layout();

            $('#task>li:first').hide().slideDown();


        }
        $('#box input[type=text]').val(' ')
    })
    
    function layout(){

        store.set('dataArr',dataArr);
        $('#task').empty();
        $('#finish_task').empty();
        
        for(var i=0;i<dataArr.length;i++){

            var obj=dataArr[i]
            if(obj==''||!obj){
                continue;
            }
            var li='<li data-index="'+i+'"><input type="checkbox" '+ (obj.flag?'checked':'') +'><span id="title">'+obj.title+'</span><span id="details">详情</span><span id="del">删除</span></li>'

            if(!obj.flag){
                $('#task').prepend(li);
            }else{
                $('#finish_task').prepend(li);
            }
        }
    }
    
    $('#content ul').on('click','#del',function (event){
        event.stopPropagation();
        var index=$(this).parent().data('index')
        if(index==undefined||!dataArr[index]) return;

        delete dataArr[index]

        $(this).parent().slideUp(300,function (){
            $(this).remove();
        })

        store.set('dataArr',dataArr);
    })

    var curIndex;
    $('#content ul').on('click','#details',function (event){
        event.stopPropagation()
        $('#header,body').css({ background:'gray'});
        $('#someContent').css({
            'position':'fixed',
            'top':'50%',
            'left':'50%',
            'transform':'translate(-50%,-50%)'
        }).stop().fadeIn(300)
        document.body.style.overflow = 'hidden';
        var index=$(this).parent().data('index')
        curIndex=index;
        var obj=dataArr[index];
        $('#conTitle').text(obj.title)
        $('#someContent textarea').val(obj.content)
        $('#someContent input[type=text]').val(obj.time)
    })

    function close(){

        $('#header,body').css({ background:'#f0f0f3'})
        $('#someContent').stop().hide();
        document.body.style.overflow = 'auto';
    }

    $('#someContent').click(function (event){
        event.stopPropagation();
    });

    $('#someContent #close').click(function (event){
        event.stopPropagation()
        close()
    });
    $('#someContent button').click(function (event){
        close();
        event.stopPropagation()
        var obj=dataArr[curIndex];
        obj.title=$('#conTitle').text();
        obj.content= $('#someContent textarea').val();
        obj.time= $('#someContent input[type=text]').val();
        obj.isTime=true;
        dataArr[curIndex]=obj;
        store.set('dataArr',dataArr)

    })
    $('body').click(function () {
        close()
    });

    //给输入框添加时间选择框
    $.datetimepicker.setLocale('ch');
    $('#time').datetimepicker();

    $('#content ul').on('click','input[type=checkbox]',function () {
        var index = $(this).parent().data('index');
        if (index == undefined || !dataArr[index]) return;
        var obj = dataArr[index];
        obj.flag = $(this).is(':checked');
        dataArr[index] = obj;
        layout();
    });

    $('#Fin').click(function (){
        $('#content #task').hide()
        $('#content #finish_task').hide().fadeIn('fast')
    })
    $('#UnFin').click(function (){
        $('#content #task').hide().fadeIn('fast')
        $('#content #finish_task').hide()
    })

    $('#someContent button').click(function (){


        var item = dataArr[curIndex];

        item.content = $('#someContent textarea').val();
        item.time =  $('#someContent input[type=text]').val();
        item.isTime = false;

        dataArr[curIndex] = item;
        store.set('dataArr',dataArr);

        $('#someContent').fadeOut();
        $('body,html').css({background:'#f0f0f3'})

    })

    $('#nav').children().each(function (){
      $(this).click(function (){
        $(this).addClass('cur').siblings().removeClass('cur')
      })      
    })
    
    setInterval(function () {
        for (var i = 0; i < dataArr.length; i++){
            var item  = dataArr[i];
            if(item == undefined || !item || item.time.length < 1 || item.isTime){
                continue;
            }
            var cur_date = (new Date()).getTime();
            var remind_time = (new Date(item.time)).getTime();
            if (cur_date - remind_time >= 1){
                $('video').get(0).play();
                item.isTime = true;
                dataArr[i] = item;
                store.set('dataArr',dataArr);
            }
        }
    },300);
})
