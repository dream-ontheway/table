$(function () {
        //stus数组存储所有条目
        var stus = [];
        //stusl数组存放页面显示的条目
        var stusl = [];
        //th数组存放对应属性
        var th = ['', 'name', 'class', 'age', ''];

        //把已有的数据存储到stus和stusl数组中
        //增加一个index代表录入顺序的序号，用来对应页面上的条目和stus对象里的条目
        $('tbody tr').each(function (i) {
            stus[i] = {
                name: $(this).children(':eq(1)').text(),
                class: parseInt($(this).children(':eq(2)').text()),
                age: parseInt($(this).children(':eq(3)').text()),
                index:parseInt($(this).attr('index')),
            }
        })
        getstusl();

        //点击添加按钮动态增加数据
        $('#btn1').on('click', function () {
            //判断不为空，否则弹出提示
            if ($('#age').val() && $('#classNum').val() && $('#userName').val()) {
                //写入到stus和stusl数组里
                stus[stus.length] = {
                    name: $('#userName').val(),
                    class: parseInt($('#classNum').val()),
                    age: parseInt($('#age').val()),
                    index:stus.length,
                }
                stusl.push(stus[stus.length-1]);
                //调用zj函数增加到页面上
                zj(stusl, stusl.length - 1);
                //清空输入框
//                $('#userName').val('');
//                $('#classNum').val('');
//                $('#age').val('');
            } else {
                alert('请正确输入');
            }
        })

        //zj增加数据函数封装：在最后增加一行数据，来源arr[index]
        function zj(arr, index) {
            $('tbody').append(
                    '<tr index = "'+arr[index].index+'">' +
                    '<td><input type="checkbox"></td>' +
                    '<td>' + arr[index].name + '</td>' +
                    ' <td>' + arr[index].class + '班</td>' +
                    ' <td>' + arr[index].age + '</td>' +
                    ' <td><a href="javascript:;">删除</a></td>' +
                    ' </tr>'
            );
            //增加后调用隔行变色函数，赋予应有的背景色
            cor();
            //判断全选按钮响应状态
            quanXuanPD();
        }

        //隔行变色函数，并且调用一下
        function cor() {
            $('tbody>tr:even').css('background', '#eeeeee');
            $('tbody>tr:odd').css('background', '#ffffff');
        }
        cor();

        //鼠标移入移出事件
        $('tbody').on('mouseenter', 'tr', function () {
            $(this).css('background', 'pink');
        })
        $('tbody').on('mouseleave', 'tr', function () {
            cor();
        })

        //全选按钮
        $('#allCheck').on('click', function () {
            if ($(this).prop('checked')) {
                $('tbody input').prop('checked', true);
            } else {
                $('tbody input').prop('checked', false);
            }
        })

        //下面按钮被点击后判断全选按钮响应状态
        $('tbody').on('click', 'input', function () {
            quanXuanPD();
        })

        //全选按钮响应状态函数
        function quanXuanPD() {
            //如果下面被选中的checkbox个数和所有的checkbox个数相等，而且不为零，全选按钮勾选，否则不勾选
            if ($('tbody').find(':checkbox').length === $('tbody').find(':checked').length && $('tbody').find(':checkbox').length !== 0) {
                $('#allCheck').prop('checked', true)
            } else {
                $('#allCheck').prop('checked', false)
            }
            /*var flag = true;
             for (var i = 0; i < $('tbody input').length; i++) {
             if (!$('tbody input').eq(i).prop('checked')) {
             flag = false;
             break;
             }
             }
             if (flag && $('tbody input').length !== 0) {
             $('#allCheck').prop('checked', true);
             } else {
             $('#allCheck').prop('checked', false);
             }*/
        }

        //getstusl获取页面条目封装：把页面上的数据同步到stusl里
        function getstusl() {
            stusl = [];
            $('tbody tr').each(function (i) {
                stusl[i] = {
                    name: $(this).children(':eq(1)').text(),
                    class: parseInt($(this).children(':eq(2)').text()),
                    age: parseInt($(this).children(':eq(3)').text()),
                    index:parseInt($(this).attr('index')),
                }
            })
        }

        //点击删除：委托tbody，如果tbody下面的删除按钮被点击，删除当前行，重新设置背景色，判断全选按钮
        $('tbody').on('click', 'a', function () {
            //在总数组对index属性对应的条目标记re=true，暂不删除（避免即时删除之后，数组的索引和页面数据的index属性对应不上）
            //在点击恢复时会把页面上的数据和总数组的数据同步一下，到时删除掉标记的条目
            stus[parseInt($(this).parent().parent().attr('index'))].re = true;
            //在临时数组里删除的是页面tr的在tbody里索引号对应的条目
            stusl.splice($(this).parent().parent().index(), 1)
            //删除掉页面的条目，隔行换色，全选按钮判断
            $(this).parent().parent().remove();
            cor();
            quanXuanPD();
        })

        //搜索
        $('#btn2').on('click', function () {
            var val = $('#seach').val();
            //如果搜索框不为空才执行
            if (val) {
                //先让高亮显示的符合项恢复
                $('tbody td').css('backgroundColor', 'rgba(0,0,0,0)');
                //把页面上的条目放入临时数组stusl里，清空页面上的数据，符合搜索项的在后面重新生成
                getstusl();
                $('tbody').empty();
                //循环检索stusl里每一条数据
                for (var k = 0; k < stusl.length; k++) {
                    var nameFlag = stusl[k].name.indexOf(val) !== -1;
                    var classFlag = (stusl[k].class + '').indexOf(val) !== -1;
                    var ageFlag = (stusl[k].age + '').indexOf(val) !== -1;
                    //如果有符合项，把他写入页面
                    if (nameFlag || classFlag || ageFlag) {
                        zj(stusl, k);
                        //高亮显示符合项
                        $('tbody tr:last').children('td:eq(1)')[0].style.backgroundColor = nameFlag ? 'rgba(0,250,154,0.4)' : 'rgba(0,0,0,0)';
                        $('tbody tr:last').children('td:eq(2)')[0].style.backgroundColor = classFlag ? 'rgba(0,250,154,0.4)' : 'rgba(0,0,0,0)';
                        $('tbody tr:last').children('td:eq(3)')[0].style.backgroundColor = ageFlag ? 'rgba(0,250,154,0.4)' : 'rgba(0,0,0,0)';
                    }
                }
                //检索完成，页面创建完成后，调用隔行变色函数，stusl重新读取页面的每条数据
                cor();
                getstusl();
            }
        })

        //点击复原按钮 清空搜索和排序 按照录入顺序显示
        $('#btn3').on('click', function () {
            //搜索框清空，页面数据清空，排序标记类名移除
            $('thead .p').removeClass('gt lt');
            $('#seach').val('');
            $('tbody').empty();
            //遍历总数组stus，做标记的删除掉
            for(var i=0;i<stus.length;i++){
                //每一条数据的index属性重新赋值，如果被删除了，顶上来的会再赋值为i
                stus[i].index = i;
                //如果有标记删除掉，后一条数据会跑到当前位置，所以i--，把当前位置在看一遍
                if(stus[i].re){
                    stus.splice(i,1);
                    i--;
                }
            }
            //遍历经过删除后的新数组stus，写入到页面中
            for (var i=0;i<stus.length;i++) {
                zj(stus, i);
            }
            //把新的页面同步到临时条目数组stusl
            getstusl();
        })

        //点击排序，带有p类名的可以排序
        $('thead .p').on('click', function () {
            //如果被点击的列之前处于正序排序，移除类名gt，添加lt，调用排序函数逆序排序
            if ($(this).hasClass('gt')) {
                $(this).removeClass('gt').addClass('lt');
                paiXu(th[$(this).index()], false);
                //如果被点击的列之前处于逆序排序，移除类名li，添加gt，调用排序函数正序排序
            } else if ($(this).hasClass('lt')) {
                $(this).removeClass('lt').addClass('gt');
                paiXu(th[$(this).index()], true);
                //如果被点击的列之前没有排序，添加类名gt，移除其他列排序标记类名，调用排序函数正序排序
            } else {
                $(this).addClass('gt').siblings('.p').removeClass('gt lt');
                paiXu(th[$(this).index()], true);
            }
        })

        //排序函数：str：排序所依据的列，isgt：布尔值，true正序排序，false逆序排序
        function paiXu(str, isgt) {
            //sort：数组方法，遍历数组进行排序，根据函数返回值
            stusl.sort(function (a, b) {
                var n = 0;
                if (str === 'name') {
                    n = a[str].localeCompare(b[str]);
                } else {
                    n = (a[str] - b[str]);
                }
                //如果正序排序，返回n，否则返回-n
                return (isgt ? n : -n);
            });
            //排序结束，把页面清空，遍历临时数组，重新生成页面
            $('tbody').empty();
            for (var i = 0; i < stusl.length; i++) {
                zj(stusl, i);
            }
        }
    })