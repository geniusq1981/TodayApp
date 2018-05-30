var calendarplugin = (function(id) {
    /*
     * 用于记录日期，显示的时候，根据dateObj中的日期的年月显示
     */
    console.log(id);
    var dateObj = (function() {
        var _date = new Date(); // 默认为当前系统时间
        return {
            getDate: function() {
                return _date;
            },
            setDate: function(date) {
                _date = date;
            }
        };
    })();

    var CalendarColorCard = ["#4a9ecc", "#9186c2", "#76c5af", "#009944", "#eb6100", "#ca384f", "#ff4d6f", "#de795d", "#dd992a", "#dbb71b", "#9b951d", "#415754"];
    var curCalRow = 0;
    var calRow = 0;
    var firstLineColor = "";
    var status = 0;
    // 设置calendar div中的html部分
    renderHtml();
    // 表格中显示日期
    showCalendarData();
    // 绑定事件
    bindEvent();

    /**
     * 渲染html结构
     */
    function renderHtml(len) {
        var calendar = document.getElementById(id);

        var titleBox = document.createElement("div"); // 标题盒子 设置上一月 下一月 标题
        var bodyBox = document.createElement("div"); // 表格区 显示数据

        console.log("enter calendarplugin!");
        // 设置标题盒子中的html
        titleBox.className = 'calendar-title-box';
        titleBox.innerHTML = "<span class='prev-month-deactive' id='prevMonth'></span>" +
            "<span class='calendar-title' id='calendarTitle'><span class='title-year' id='title-year'></span><span class='title-month' id='title-month'></span></span>" +
            "<span id='nextMonth' class='next-month-deactive'></span>";
        calendar.appendChild(titleBox); // 添加到calendar div中

        // 设置表格区的html结构
        bodyBox.className = 'calendar-body-box';
        var _headHtml = "<tr id='firstline' class='firstline'>" +
            "<th class='firstline-left'>日</th>" +
            "<th>一</th>" +
            "<th>二</th>" +
            "<th>三</th>" +
            "<th>四</th>" +
            "<th>五</th>" +
            "<th class='firstline-right'>六</th>" +
            "</tr>";
        bodyBox.innerHTML = "<table class='calendar-head'>" + _headHtml + "</table>" + "<table id='calendarTable' class=''></table>";
        // 添加到calendar div中
        calendar.appendChild(bodyBox);

    }



    function renderCalTable(len) {
            console.log(len + "!!" + curCalRow);
            var CalTable = document.getElementById("calendarTable");
            if (len == curCalRow) {
                return;
            } else {
                CalTable.innerHTML = "";
            }

            var _bodyHtml = "";

            // 一个月最多31天，所以一个月最多占6行表格
            for (var i = 0; i < len; i++) {
                _bodyHtml += "<tr>" +
                    "<td></td>" +
                    "<td></td>" +
                    "<td></td>" +
                    "<td></td>" +
                    "<td></td>" +
                    "<td></td>" +
                    "<td></td>" +
                    "</tr>";
            }
            curCalRow = len;
            CalTable.className = "calendar-table-" + len;
            CalTable.innerHTML = _bodyHtml;
        }
        /*
         *  renderNewTable:
         */
    function createNewTable(len, flag) {
        var newTable = document.createElement("table");
        var curTable = document.getElementById("calendarTable");
        console.log(curTable);
        var parentBody = curTable.parentNode;
        console.log(parentBody);
        var _bodyHtml = "";

        // 一个月最多31天，所以一个月最多占6行表格
        for (var i = 0; i < len; i++) {
            _bodyHtml += "<tr>" +
                "<td></td>" +
                "<td></td>" +
                "<td></td>" +
                "<td></td>" +
                "<td></td>" +
                "<td></td>" +
                "<td></td>" +
                "</tr>";
        }
        //curCalRow=len;
        newTable.id = "newCalTable";
        newTable.className = "calendar-table-" + len + (flag ? " calendar-table-nextmonth" : " calendar-table-premonth");
        newTable.innerHTML = _bodyHtml;
        parentBody.appendChild(newTable);
    }

    /*
     *
     */
    function renderCalTitle() {

        var _year = dateObj.getDate().getFullYear();
        var _month = dateObj.getDate().getMonth() + 1;
        var _dateStr = getDateStr(dateObj.getDate());

        var _firstDay = new Date(_year, _month - 1, 1); // 当前月第一天

        var _flagDay = new Date(_year, _month - 1, 34 + 1 - _firstDay.getDay());

        if (getDateStr(_flagDay).substr(0, 6) == getDateStr(_firstDay).substr(0, 6)) {
            calRow = 6;
        } else {
            calRow = 5;
        }

        firstLineColor = CalendarColorCard[_month - 1];
        // 设置顶部标题栏中的 年、月信息
        var calendarTitle = document.getElementById("calendarTitle");
        var calendarYear = document.getElementById("title-year");
        var calendarMonth = document.getElementById("title-month");
        var titleyear = _dateStr.substr(0, 4) + " ";
        var titlemonth = _dateStr.substr(4, 2) + "";
        //var titleStr = _dateStr.substr(0, 4) + " " + _dateStr.substr(4,2) + "";
        calendarYear.innerText = titleyear;
        calendarMonth.innerText = titlemonth;
        //calendarTitle.innerText = titleStr;
    }

    /**
     * 表格中显示数据，并设置类名
     */
    function showNewCalendarData() {
        console.log("showCalendarData");
        var _year = dateObj.getDate().getFullYear();
        var _month = dateObj.getDate().getMonth() + 1;
        var _dateStr = getDateStr(dateObj.getDate());

        var _firstDay = new Date(_year, _month - 1, 1); // 当前月第一天

        var _flagDay = new Date(_year, _month - 1, 34 + 1 - _firstDay.getDay());

        document.getElementById("firstline").style.backgroundColor = CalendarColorCard[_month - 1];

        // 设置表格中的日期数据
        var _table = document.getElementById("newCalTable");
        var _tds = _table.getElementsByTagName("td");


        for (var i = 0; i < _tds.length; i++) {
            console.log(_month - 1);
            console.log(i + 1 - _firstDay.getDay());
            var _thisDay = new Date(_year, _month - 1, i + 1 - _firstDay.getDay());
            console.log(_thisDay);
            var _thisDayStr = Calcore.getDateStr(_thisDay);
            var _thisCDayStr = Calcore.GetLunarDayPlus(_thisDayStr);
            var _thisJieri = Calcore.getFestival();
            console.log(_thisJieri);
            var indexflag =_thisJieri.indexOf('(');
            console.log(indexflag);
            if(indexflag!=-1){
            	_thisJieri=_thisJieri.substring(0,indexflag);
            }
            var fontstyle = "";
            var fontweight = "";
            //console.log(_thisCDayStr);
            //_tds[i].data = _thisDayStr;
            _tds[i].style.backgroundColor = "";
            _tds[i].setAttribute('data', _thisDayStr);
            _tds[i].setAttribute('rc', parseInt(i / 7) * 10 + i % 7);
            //_tds[i].width = "50px";
            //_tds[i].height = "50px";
            var curDate = getDateStr(new Date());
            if (_thisDayStr.substr(0, 6) == getDateStr(_firstDay).substr(0, 6)) {
                if (_thisDayStr == curDate) { // 当前天
                    _tds[i].className = 'currentDay';
                    _tds[i].style.backgroundColor = CalendarColorCard[_month - 1];
                    fontweight = "font-weight:bold;";
                    fontstyle = _thisJieri ? ("style='" + fontweight + "'") : "";
                } else {
                    _tds[i].className = 'currentMonth'; // 当前月
                    fontweight = "font-weight:bold;";
                    fontstyle = _thisJieri ? ("style='" + fontweight + " color:" + CalendarColorCard[_month - 1] + "'") : "";
                }

            } else if (_thisDayStr.substr(0, 6) < getDateStr(_firstDay).substr(0, 6)) { // 其他月
                _tds[i].className = 'preMonth';
            } else if (_thisDayStr.substr(0, 6) > getDateStr(_firstDay).substr(0, 6)) {
                _tds[i].className = 'nextMonth';
            } else {
                _tds[i].className = 'otherMonth';
            }

            //fontstyle = _thisJieri?("style='"+fontweight+" color:"+CalendarColorCard[_month-1]+"'"):"";
            _tds[i].innerHTML = _thisDay.getDate() + "<div class='calcdate' " + fontstyle + ">" + (_thisJieri ? _thisJieri : _thisCDayStr.substr(_thisCDayStr.length - 2, 2)) + "</div>";

        }
    }

    /**
     * 表格中显示数据，并设置类名
     */
    function showCalendarData() {
        console.log("showCalendarData");
        var _year = dateObj.getDate().getFullYear();
        var _month = dateObj.getDate().getMonth() + 1;
        var _dateStr = getDateStr(dateObj.getDate());

        document.getElementById("firstline").style.backgroundColor = CalendarColorCard[_month - 1];

        var _firstDay = new Date(_year, _month - 1, 1); // 当前月第一天

        var _flagDay = new Date(_year, _month - 1, 34 + 1 - _firstDay.getDay());

        if (getDateStr(_flagDay).substr(0, 6) == getDateStr(_firstDay).substr(0, 6)) {
            renderCalTable(6);
        } else {
            renderCalTable(5);
        }
        // 设置顶部标题栏中的 年、月信息
        var calendarTitle = document.getElementById("calendarTitle");
        var calendarYear = document.getElementById("title-year");
        var calendarMonth = document.getElementById("title-month");
        var titleyear = _dateStr.substr(0, 4) + " ";
        var titlemonth = _dateStr.substr(4, 2) + "";
        //var titleStr = _dateStr.substr(0, 4) + " " + _dateStr.substr(4,2) + "";
        calendarYear.innerText = titleyear;
        calendarMonth.innerText = titlemonth;
        //calendarTitle.innerText = titleStr;

        // 设置表格中的日期数据
        var _table = document.getElementById("calendarTable");
        var _tds = _table.getElementsByTagName("td");


        for (var i = 0; i < _tds.length; i++) {
            console.log(_month - 1);
            console.log(i + 1 - _firstDay.getDay());
            var _thisDay = new Date(_year, _month - 1, i + 1 - _firstDay.getDay());
            console.log(_thisDay);
            var _thisDayStr = Calcore.getDateStr(_thisDay);
            var _thisCDayStr = Calcore.GetLunarDayPlus(_thisDayStr);
            var _thisJieri = Calcore.getFestival();
            console.log(_thisJieri);
            var indexflag =_thisJieri.indexOf('(');
            console.log(indexflag);
            if(indexflag!=-1){
            	_thisJieri=_thisJieri.substring(0,indexflag);
            }
            var fontstyle = "";
            var fontweight = "";
            //console.log(_thisCDayStr);
            //_tds[i].data = _thisDayStr;
            _tds[i].style.backgroundColor = "";
            _tds[i].setAttribute('data', _thisDayStr);
            _tds[i].setAttribute('rc', parseInt(i / 7) * 10 + i % 7);
            //_tds[i].width = "50px";
            //_tds[i].height = "50px";
            var curDate = getDateStr(new Date());
            if (_thisDayStr.substr(0, 6) == getDateStr(_firstDay).substr(0, 6)) {
                if (_thisDayStr == curDate) { // 当前天
                    _tds[i].className = 'currentDay';
                    _tds[i].style.backgroundColor = CalendarColorCard[_month - 1];
                    fontweight = "font-weight:bold;";
                    fontstyle = _thisJieri ? ("style='" + fontweight + "'") : "";
                } else {
                    _tds[i].className = 'currentMonth'; // 当前月
                    fontweight = "font-weight:bold;";
                    fontstyle = _thisJieri ? ("style='" + fontweight + " color:" + CalendarColorCard[_month - 1] + "'") : "";
                }

            } else if (_thisDayStr.substr(0, 6) < getDateStr(_firstDay).substr(0, 6)) { // 其他月
                _tds[i].className = 'preMonth';
            } else if (_thisDayStr.substr(0, 6) > getDateStr(_firstDay).substr(0, 6)) {
                _tds[i].className = 'nextMonth';
            } else {
                _tds[i].className = 'otherMonth';
            }
            //fontstyle = _thisJieri?("style='"+fontweight+" color:"+CalendarColorCard[_month-1]+"'"):"";
            _tds[i].innerHTML = _thisDay.getDate() + "<div class='calcdate' " + fontstyle + ">" + (_thisJieri ? _thisJieri : _thisCDayStr.substr(_thisCDayStr.length - 2, 2)) + "</div>";

        }
    }

    /**
     * 绑定上个月下个月事件
     */
    function bindEvent() {
        var prevMonth = document.getElementById("prevMonth");
        var nextMonth = document.getElementById("nextMonth");
        addEvent(prevMonth, 'click', toPrevMonth);
        addEvent(nextMonth, 'click', toNextMonth);
    }

    /**
     * 绑定事件
     */
    function addEvent(dom, eType, func) {
        if (dom.addEventListener) { // DOM 2.0
            dom.addEventListener(eType, function(e) {
                func(e);
            });
        } else if (dom.attachEvent) { // IE5+
            dom.attachEvent('on' + eType, function(e) {
                func(e);
            });
        } else { // DOM 0
            dom['on' + eType] = function(e) {
                func(e);
            }
        }
    }

    /**
     * 点击上个月图标触发
     */
    function toPrevMonth(cb) {
        if (status) {
            return;
        }
        status = 1;
        var date = dateObj.getDate();
        dateObj.setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
        renderCalTitle();
        createNewTable(calRow, 0);
        showNewCalendarData();
        $('#calendarTable').animate({
            "left": "1070px"
        }, 500, function() {
            $('#calendarTable').remove();
        });
        $('#newCalTable').animate({
            "left": "0px"
        }, 500, function() {
            $('#newCalTable').attr("id", "calendarTable").removeClass("calendar-table-premonth");
            console.log("cb call");
            status = 0;
            if (typeof cb == 'function') cb();
        });
        //showCalendarData();
    }

    /**
     * 点击下个月图标触发
     */
    function toNextMonth(cb) {
        console.log(cb);
        if (status) {
            return;
        }
        status = 1;
        var date = dateObj.getDate();
        dateObj.setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
        console.log(dateObj);
        renderCalTitle();
        createNewTable(calRow, 1);
        showNewCalendarData();
        $('#calendarTable').animate({
            "left": "-1070px"
        }, 500, function() {
            $('#calendarTable').remove();
        });
        $('#newCalTable').animate({
            "left": "0px"
        }, 500, function() {
            $('#newCalTable').attr("id", "calendarTable").removeClass("calendar-table-nextmonth");
            console.log("cb call");
            status = 0;
            if (typeof cb == 'function') cb();
        });
        //$("#calendarTable").addClass("calendar-move-active");
        //$("#newCalTable").addClass("calendar-move-active");
        // $("#calendarTable").addClass("calendar-table-premonth");
        // $("#newCalTable").removeClass("calendar-table-nextmonth");
        //$("#calendarTable").remove();
        //showCalendarData();
    }

    /**
     * 日期转化为字符串， 4位年+2位月+2位日
     */
    function getDateStr(date) {
        var _year = date.getFullYear();
        var _month = date.getMonth() + 1; // 月从0开始计数
        var _d = date.getDate();

        _month = (_month > 9) ? ("" + _month) : ("0" + _month);
        _d = (_d > 9) ? ("" + _d) : ("0" + _d);
        return _year + _month + _d;
    }


    var calendarInstance = function() {
        
    }
    calendarInstance.prototype = {
        init: function() {

        },
        getRows:function(){
        	var _table = document.getElementById("calendarTable");
            var _trs = _table.getElementsByTagName("tr");
            return _trs.length;
        },
        toNextMonth: function(callback) {
            toNextMonth(callback);
        },
        toPrevMonth: function(callback) {
            toPrevMonth(callback);
        },
        setDate: function(date) {
            dateObj.setDate(date)
        },
        getDate: function() {
            return dateObj.getDate();
        },
        update: function() {
            showCalendarData();
        }

    }
    return new calendarInstance();
})("calarea");