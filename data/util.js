 /*version: 1.0
 *Author:  zhiqin1.wang@samsung.com
 * */
//访问连接
var _url = {
		PM2_5_APIKEY : "5j1znBVAsnSf5xQyNQyq",
		PM2_5_URL : "http://www.pm25.in/api/querys/pm2_5.json?city=",   //stations：是否只返回一个城市均值的标识，可选参数，默认是yes，不需要监测点信息时传这个参数并设置为no
		WEATHER_APIKEY :"x51ehuh79ellz65s",
		CURRENT_URL1 : "http://101.200.78.153/8000/weather/now.json?key=",    // https://api.seniverse.com/v3/weather/now.json?key=
		FORECAST_URL1 : "http://101.200.78.153/8000/weather/daily.json?key=", // https://api.seniverse.com/v3/weather/daily.json?key=
		SUGGESTION_URL : "http://101.200.78.153/8000/weather/suggestion.json?key=",// https://api.seniverse.com/v3/life/suggestion.json?key=
		CURRENT_URL : "http://php.weather.sina.com.cn/iframe/samsung/citys_weather.php?day=0&citys=",
		FORECAST_URL : "http://php.weather.sina.com.cn/iframe/samsung/citys_weather.php?day=2&citys=",
		PROVINCE_URL : "http://101.200.78.153/8000/weather/getprovincelist"//"http://php.weather.sina.com.cn/iframe/samsung/provinces.php"//
}
//////////////////////////////////////////////////////////////////////////////////////
//AJAX - 创建 XMLHttpRequest 对象
/*	属性					描述
	onreadystatechange	存储函数（或函数名），每当 readyState 属性改变时，就会调用该函数。
	
	readyState	        存有 XMLHttpRequest 的状态。从 0 到 4 发生变化。
						0: 请求未初始化
						1: 服务器连接已建立
						2: 请求已接收
						3: 请求处理中
						4: 请求已完成，且响应已就绪
						
	status				200: "OK"
						404: 未找到页面
						
	方法							描述
	open(method,url,async)		规定请求的类型、URL 以及是否异步处理请求。
								method：请求的类型；GET 或 POST
								url：文件在服务器上的位置
								async：true（异步）或 false（同步）
								
	send(string)				将请求发送到服务器。
								string：仅用于 POST 请求
*/
function loadXMLDoc(method,url,callback1,callback2,apikey,text,ContentType){
	console.log('loadXMLDocGET');
	var xhr;
	if(window.XMLHttpRequest){
		xhr = new XMLHttpRequest();
	}
	else{
		xhr = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xhr.timeout = 30000;
	xhr.ontimeout = function(){
    	console.log("timeout"+url);
    };
	xhr.onreadystatechange = function(){
		console.log("readyState ============"+xhr.readyState);
		if(xhr.readyState == 4){
			if(xhr.status == 200){
				console.log("status ============"+xhr.status);
				var obj = xhr;
				console.log("responseText ============"+JSON.stringify(xhr.responseText));
				callback1(obj,callback2);
			}else{
				console.log("status ============"+xhr.status);
				console.log("responseText ============"+JSON.stringify(xhr));
				xhr.abort();
				showLoadingIcon(false);
				popup.init(2, "网络连接错误", ["重试","退出应用"],function(){
					tizen.application.getCurrentApplication().exit(); 
				});
			}
		}
	}
	xhr.open(method,url,true);
	if(apikey){
		xhr.setRequestHeader("apikey",apikey);
	}
	if(ContentType){
		xhr.setRequestHeader("Content-Type",ContentType);
	}
	xhr.send(text);
}
var loadPM2_5Time = 0;
var loadPM2_5failTime = 0;
function loadPM2_5(jsonstr,callback){
	 console.log("loadPM2_5");
	 var jsonObj = JSON.parse(jsonstr.responseText);
	 loadPM2_5Time++;
	 if(jsonObj.error){
		 loadPM2_5failTime++;
		 console.log("loadPM2_5  数据请求失败 "+loadPM2_5failTime+"次");
	 }
	 else{
		 for (var i in CITY_SELECTED){
			 if (jsonObj[0].area == CITY_SELECTED[i].name){
				 	CITY_SELECTED[i].degree = jsonObj[0].aqi;
		            break;
		     }
		 } 
	 }
	 if(loadPM2_5Time == CITY_SELECTED.length){
		 showLoadingIcon(false);
		 callback();
		 if(loadPM2_5failTime!=0){
			 popup.init(1, "空气质量API请求次数已用完！", ["知道了"]);
		 }
		 loadPM2_5Time = 0;
		 loadPM2_5failTime = 0; 
	 }
	 
}
function Province(name, url, regions) {
	this.name = name;
	this.url = encodeURI(url);
	this.regions = regions;
}

function parseXML(xmlDoc) {
	var doc = null;
	// code for IE
	if(window.ActiveXObject) {
		console.log("window.ActiveXObject");
		doc=new ActiveXObject("Microsoft.XMLDOM");
		doc.async="false";
		doc.loadXML(xmlDoc);
	}
	// code for Mozilla, Firefox, Opera, etc.
	else {
		console.log("for Mozilla, Firefox, Opera, etc");
		var parser = new DOMParser();
		doc = parser.parseFromString(xmlDoc,"text/xml");
	}
	console.log("doc ============"+JSON.stringify(doc));
	return doc.documentElement;
}

function createCityList(xmlDoc,callback){

	var response = xmlDoc.responseXML.documentElement;
	if(response) {
	    
	    console.log(response.nodeName);
	    
		if (response.nodeName == "provincelist") {
		    			    			    
			var tmpList = response.childNodes;
			var valueList;
			
			provinceList = null;
			provinceList = new Array();
			
			for(var i = 0 ; tmpList && i < tmpList.length; i++) {
				valueList = tmpList[i].getElementsByTagName("name");
				if(valueList.length)
					name = valueList[0].firstChild.data;
					
	            valueList = tmpList[i].getElementsByTagName("url");
				if(valueList.length)
					url = valueList[0].firstChild.data;
				
				var province = new Province(name, url, null);
				provinceList.push(province);
			}
			CITY_LIST = provinceList;
		    console.log("try to load " + JSON.stringify(CITY_LIST));
		    callback();
		}
		else if (response.nodeName == "citylist") {
		
		    var cityList = new Array();
		    
			var tmpList = response.childNodes;
			var valueList;
			for(var i = 0 ; tmpList && i < tmpList.length; i++) {
				valueList = tmpList[i].getElementsByTagName("name");
				if(valueList)
					name = valueList[0].firstChild.data;
					
				cityList.push(name);
			}
			 console.log("try to load " + JSON.stringify(cityList));
			 callback(cityList);	
		}
	}

}
/**
 * @brief			callback for loading curList url
 * @see				checkReadyState, loadXMLDoc
 * @return 			void
 */
var onLoadCurrentXMLTime = 0;
var onLoadCurrentXMLfailTime = 0;
var curList = [];
function onLoadCurrentXML(jsonstr,callback){
	 console.log("onLoadCurrentXML");
	 onLoadCurrentXMLTime++;
	 if(jsonstr == -1){
		 onLoadCurrentXMLfailTime++;
		 console.log("onLoadCurrentXML  数据请求失败 "+onLoadCurrentXMLfailTime+"次");
	 }
	 else{
		 var jsonObj = JSON.parse(jsonstr.response);
		 curList.push(jsonObj.results);
	 }
	 console.log("CITY_SELECTED.length = "+CITY_SELECTED.length+"onLoadCurrentXMLTime = "+onLoadCurrentXMLTime+"onLoadCurrentXMLfailTime = "+onLoadCurrentXMLfailTime);
	 if(onLoadCurrentXMLTime == CITY_SELECTED.length){
		if(onLoadCurrentXMLfailTime!=0){
			popup.init(1, "今日天气信息请求失败！", ["知道了"], function(){
				console.log("callback = "+JSON.stringify(callback));
				var invalidCity = [];
				for(var i=0;i<CITY_SELECTED.length;i++){
 					if(CITY_SELECTED[i].valid == false){
 						invalidCity.push(CITY_SELECTED[i].name);
 					}
 				}
				for(var i=0;i<invalidCity.length;i++){
					delPrefCity(invalidCity[i]);
				}
				saveDataToCommon();
				callback("fail");
			});
		}
		else{
			console.log("try to load " + JSON.stringify(curList));
			saveTodayWeatherAll(curList,callback);
		}
		onLoadCurrentXMLTime = 0;
		onLoadCurrentXMLfailTime = 0;
	 }
}
function saveTodayWeatherAll(curList,callback)
{
	// check if cityIndex is valid
	if (CITY_SELECTED == null || 0 >= CITY_SELECTED.length)
	{
		return ;
	}
	console.log("saveTodayWeatherAll " + JSON.stringify(CITY_SELECTED));
	var name;
	var valueList;
	for(var i = 0; curList && i < curList.length; i++) {
		console.log("saveTodayWeatherAll " + JSON.stringify(curList));
		valueList = curList[i].location;
		if(valueList) {
			name = valueList.name;
		}
		else {
			console.log("valueList is NULL");
			continue;
		}
		
		var cityIndex = getPrefCityIndex(name);
		if (cityIndex == -1)
		    continue ;
		    
		var city = CITY_SELECTED[cityIndex];
		var recordList = curList[i].now;
	
		if (name == city.name && recordList) {
			var text = recordList.text;
			
			var condition = recordList.code;
			
			var temp = recordList.temperature;
			
			var AQI = recordList.AQI;
			
			// use this function
			SetCityToday(city, text, condition, temp,AQI);
		}
		
	}
	console.log("try to load SetCityToday" + JSON.stringify(CITY_SELECTED));
 	for(var j=0;j<CITY_SELECTED.length;j++){
 		var url = _url.FORECAST_URL1+_url.WEATHER_APIKEY+"&location="+CITY_SELECTED[j].name+"&language=zh-Hans&unit=c&start=0&days=5";
 		loadXMLDoc("GET",url,onLoadForecastXML,callback);
 	}
}

function SetCityToday(city, text, condition, temp,degree){
	city.text = text;
	city.condition = mapCondition(condition);
	city.temp = temp+"°";	
	city.degree = degree;
	city.valid = true;
}

/**
 * @brief			callback for loading forecast url
 * @see				checkReadyState, loadXMLDoc
 * @return 			void
 */
var onLoadForecastXMLTime = 0;
var onLoadForecastXMLfailTime = 0;
var foreList = [];
function onLoadForecastXML(jsonstr,callback){
	 console.log("onLoadForecastXML");
	 onLoadForecastXMLTime++;
	 if(jsonstr == -1){
		 onLoadForecastXMLfailTime++;
		 console.log("onLoadForecastXML  数据请求失败 "+onLoadForecastXMLfailTime+"次");
	 }
	 else{
		 var jsonObj = JSON.parse(jsonstr.responseText);
		 foreList.push(jsonObj.results);
	 }
	 if(onLoadForecastXMLTime == CITY_SELECTED.length){
		if(onLoadForecastXMLfailTime!=0){
			popup.init(1, "天气预报信息请求失败！", ["知道了"], function(){
				callback("fail");
			});
		}
		else{
			console.log("try to load " + JSON.stringify(foreList));
			saveWeekWeatherAll(foreList,callback);
		}
		onLoadForecastXMLTime = 0;
		onLoadForecastXMLfailTime = 0;
	 }
}
function saveWeekWeatherAll(foreList,callback)
{
	if (CITY_SELECTED == null || CITY_SELECTED.length == 0)
	{
		return ;
	}		
	
	for(i = 0 ; foreList && i < foreList.length; i++) {
		var valueList = foreList[i].location;
		console.log("WZQ ====== saveWeekWeatherAll = "+JSON.stringify(valueList));
		var name = valueList.name;
		
		var cityIndex = getPrefCityIndex(name);
		
		if (cityIndex == -1)
		    continue ;
		    
		var city = CITY_SELECTED[cityIndex];
	
	    city.forecast = new Array();
	    
	    var recordList = foreList[i].daily;
	
	    var showDayNum = 0;
		for (var j = 0; j < recordList.length && showDayNum < 3; j++) {

			var date = recordList[j].date;
			if(!recordList[j].code_day){
				recordList[j].code_day = recordList[j].code_night;
			}
			if(!recordList[j].code_night){
				recordList[j].code_night = recordList[j].code_day;
			}
			if(!recordList[j].code_night && !recordList[j].code_day){
				recordList[j].code_night = recordList[j].code_day = 0;
			}
			
			var condition = recordList[j].code_day+","+recordList[j].code_night;

			var maxTemp = recordList[j].high;
			var minTemp = recordList[j].low;
			var temp = maxTemp + "," + minTemp;
            
            city.forecast.push(new CityForecast(date, condition, temp, maxTemp, minTemp));                
            showDayNum++;			
		}
	}
	console.log("WZQ ======saveWeekWeatherAll 111" + JSON.stringify(CITY_SELECTED));
	for(var j=0;j<CITY_SELECTED.length;j++){
		var suggest_url = _url.SUGGESTION_URL+_url.WEATHER_APIKEY+"&location="+CITY_SELECTED[j].name+"&language=zh-Hans";  
		loadXMLDoc("GET",suggest_url,onLoadSuggest,callback);
	}
	//callback();
}
var onLoadSuggestTime = 0;
var onLoadSuggestfailTime = 0;
function onLoadSuggest(jsonstr,callback){
	 console.log("onLoadSuggest");
	 onLoadSuggestTime++;
	 if(jsonstr == -1){
		 onLoadSuggestfailTime++;
		 console.log("onLoadSuggest  数据请求失败 "+onLoadSuggestfailTime+"次");
	 }
	 else{
		 var jsonObj = JSON.parse(jsonstr.responseText);
		 console.log("WZQ ======onLoadSuggest" + JSON.stringify(jsonObj.results));
		 saveSuggestionInfo(jsonObj.results);
	 }
	 if(onLoadSuggestTime == CITY_SELECTED.length){
		 showLoadingIcon(false);
		 callback();
		if(onLoadSuggestfailTime!=0){
			popup.init(1, "天气建议信息请求失败！", ["知道了"]/*, function(){
				callback("fail");
			}*/);
		}
		onLoadSuggestTime = 0;
		onLoadSuggestfailTime = 0;
		console.log("WZQ ======onLoadSuggest 111" + JSON.stringify(CITY_SELECTED));
		/*for(var j=0;j<CITY_SELECTED.length;j++){
			var pm2_5_url = _url.PM2_5_URL+CITY_SELECTED[j].name+"&token="+_url.PM2_5_APIKEY+"&stations=no";  
			loadXMLDoc("GET",pm2_5_url,loadPM2_5,callback);
		}*/
	 }
}
function saveSuggestionInfo(obj){
	if (CITY_SELECTED == null || CITY_SELECTED.length == 0)
	{
		return ;
	}
	var valueList = obj.location;
	console.log("WZQ ====== saveSuggestionInfo = "+JSON.stringify(valueList));
	var name = valueList.name;
	var cityIndex = getPrefCityIndex(name);
	
	if (cityIndex == -1)
	    return ;
	
	var city = CITY_SELECTED[cityIndex];
	var sugList = obj.suggestion;
	city.suggestion[0].brief = sugList.car_washing.brief;
	city.suggestion[1].brief = sugList.dressing.brief;
	city.suggestion[2].brief = sugList.flu.brief;
	city.suggestion[3].brief = sugList.sport.brief;
	city.suggestion[4].brief = sugList.travel.brief;
	city.suggestion[5].brief = sugList.uv.brief;
}
/**
 * @brief				constructor for CityForecast
 * @remarks			
 * @param date			date
 * @param condition     condition
 * @param maxtemp       max temperature
 * @param mintemp       min temperature
 * @return              CityForecast object
 */
function CityForecast(date, condition, temp, maxtemp, mintemp) {
    this.date = date;
    this.condition = mapCondition(condition);
    this.temp = formatTemperature(temp);
    this.maxtemp = maxtemp;
    this.mintemp = mintemp;  	
}
/**
 * @breif map SINA condition to Samsung condition
 * @param {string} condition
 * @return array of Samsung condition (only 2 items, 1 is day, 1 is night)
 */
function mapCondition(condition)
{
	// 0: is day condition, 1: is night condition
	var cons = condition.split(",");
	console.log("cons = "+cons);
	for (var i in cons)
	{
		var ci = cons[i];
		
		// default is clear
		if (ci <= 0 || ci > ConditionMap.length)
			ci = 1;
		console.log("ci = "+ci);
		cons[i] = ConditionMap[ci].samsung_id;
	}
	
	// if just have one condition, night is same as day
	if (cons.length == 1)
	{
		cons.push(cons[0]);
	}
	else if (cons.length == 0)
	{
		// default is clear/sunny
		cons.push(1, 1);
	}
	
	return cons;
}
/**
 * @brief				format the input temperature to low/high format
 * @remarks			
 * @param temp			temperature
 * @return              		formatted temperature
 */
function formatTemperature(temp)
{
	if (temp == null || temp == "")
		return "-/-";
	
	var temps = temp.split(",");
	
	if (temps.length != 2)
		return "-/-";
		
	if ( (temps[0] - temps[1]) > 0)
		return temps[1] + "°/" + temps[0]+"°";
	else
		return temps[0] + "°/" + temps[1]+"°";	
}
/**
 * @brief	convert date to displayable string, date is from current.xml
 */
function calcCurDate(time) {
	//alert("calcCurDate: "+time)
	var curDateHourArr = time.split(" ");
	str = curDateHourArr[0];
	var curDateArr = str.split("-");
	str = curDateHourArr[1];
	
	if (str == null)
	{
	    str = "06:00";
	}
	
	var curHourMinSecArr = str.split(":");
	curHour = curHourMinSecArr[0];
	if(curHour) {
		curHour = parseInt(curHour, 10);
		curMin = curHourMinSecArr[1];
	}
	else {
		curHour = 0;
	}
	if(curMin) {
		// no action
	}
	else {
		curMin = 00;
	}
	//
	if(curHour > 12) {
		//curHour = curHour-12;
		curHourMinStr = "pm"+(curHour-12)+':'+curMin;
	} else {
		curHourMinStr = "am"+curHour+':'+curMin;
	}
	//alert("curHour: "+curHour);
	curDate.setFullYear(curDateArr[0],curDateArr[1]-1,curDateArr[2]);
}
function getPrefCityIndex(cityName)
{
    var index = -1;
    for (var i in CITY_SELECTED)
    {
        if (cityName == CITY_SELECTED[i].name)
        {
            index = i;
            break;
        }
    } 
    
    return index;
}
function get(url,apikey){
	console.log('get');
	// Return a new promise.
	  return new Promise(function(resolve, reject) {
	    // Do the usual XHR stuff
		  var req;
	    if(window.XMLHttpRequest){
			req = new XMLHttpRequest();
		}
		else{
			req = new ActiveXObject("Microsoft.XMLHTTP");
		}
	    console.log('get'+req);
	    req.timeout = 30000;
	    req.ontimeout = function(){
	    	reject("timeout"+url);
	    };
	    req.onreadystatechange = function(){
	    	console.log("get readyState ============"+req.readyState);
	    	if(req.readyState == 4){
				if(req.status == 200){
					console.log("get status ============"+req.status+req.responseText);
					var obj = req.responseText;
					resolve(obj);
				}else{
					console.log("get status ============"+req.status);
					reject(req.status);
				}
			}
	    };
	    req.open('GET', url,true);
	    if(apikey){
	    	req.setRequestHeader("apikey",apikey);
		}
	    // Make the request
	    req.send();
	  });
}
function post(url,apikey,text,ContentType){
	console.log('post');
	// Return a new promise.
	  return new Promise(function(resolve, reject) {
	    // Do the usual XHR stuff
		  var req;
	    if(window.XMLHttpRequest){
			req = new XMLHttpRequest();
		}
		else{
			req = new ActiveXObject("Microsoft.XMLHTTP");
		}
	    req.onreadystatechange = function(){
	    	console.log("readyState ============"+req.readyState);
	    	if(req.readyState == 4){
				if(req.status == 200){
					console.log("status ============"+req.status);
					var obj = req.responseText;
					//console.log("responseText ============"+xhr.responseText);
					resolve(obj);
				}else{
					console.log("status ============"+req.status);
					reject(req.status);
				}
			}
	    };
	    req.open('POST', url,true);
	    if(apikey){
	    	req.setRequestHeader("apikey",apikey);
		}
		if(ContentType){
			req.setRequestHeader("Content-Type",ContentType);
		}
	    // Make the request
	    req.send(text);
	  });
}
/**
 * @brief	save preferred city list and default city
 */
function saveDataToCommon() {
	console.log("saveDataToCommon begin");	
	var fs = null;
	var bValid=1;
	var str = "";
		
	for (var i in CITY_SELECTED)
	{
		str += "city=" + CITY_SELECTED[i].name + "=";
	}					
	localStorage.setItem("weather.cfg",str);
	console.log("saveDataToCommon end");
	
}

/**
 * @brief load preferred and default city
 */
//var loadDataPm2_5CityNum = 0;
function loadDataFromCommon(callback) {
	
	var fp = localStorage.getItem("weather.cfg");
	if(fp) {
	    var index = -1;
		index = parsePreferredCity(fp);
	 	showLoadingIcon(true);
	 	for(var i=0;i<CITY_SELECTED.length;i++){
	 		var weatherinfo_url = _url.CURRENT_URL1+_url.WEATHER_APIKEY+"&location="+CITY_SELECTED[i].name+"&language=zh-Hans&unit=c";
	 		loadXMLDoc("GET",weatherinfo_url,onLoadCurrentXML,function(){
		 			if(CITY_SELECTED.length){
		 				callback("success");
		 			}else{
		 				callback("fail");
		 			}
	 		});
	 		
	 	}
	}
	else {
		console.log("file open failed.!!!!!");
		callback("fail");
		popup.init(1, "还没有添加城市，快去添加吧！", ["去添加"],function(){
			CMP.init();
		});
	}
}

function loadDataFromCommonwithLoading(callback) {
	
	var fp = localStorage.getItem("weather.cfg");
	if(fp) {
	    var index = -1;
		index = parsePreferredCity(fp);
	 	for(var i=0;i<CITY_SELECTED.length;i++){
	 		var weatherinfo_url = _url.CURRENT_URL1+_url.WEATHER_APIKEY+"&location="+CITY_SELECTED[i].name+"&language=zh-Hans&unit=c";
	 		loadXMLDoc("GET",weatherinfo_url,onLoadCurrentXML,function(){
		 			if(CITY_SELECTED.length){
		 				callback("success");
		 			}else{
		 				callback("fail");
		 			}
	 		});
	 		
	 	}
	}
	else {
		console.log("file open failed.!!!!!");
		callback("fail");
		popup.init(1, "还没有添加城市，快去添加吧！", ["去添加"],function(){
			CMP.init();
		});
	}
}
/**
 * @breif parse preferred city 
 */
function parsePreferredCity(fp) {
	var strLine, strArr;
	var defaultCity = null;
	strLine=fp;
	console.log("WZQ==================: "+strLine);
	strLine = strLine.trim();
	if(strLine.charAt(0) != '#') {
		strArr = strLine.split("=");
		for(var i=0;i<((strArr.length+1)/2);i++)
		{
			if (strArr[2*i] == 'default') {
			    defaultCity = strArr[1];
			}
			else if (strArr[2*i] == 'city') {
				var name = strArr[2*i+1];
				var city = new CityToday(name, 0, 0, 0, 0);
				CITY_SELECTED.push(city);
				console.log("WZQ--------name--------"+name);
			}
		}  
	}
	console.log("WZQ ======parsePreferredCity " + JSON.stringify(CITY_SELECTED));
	
}
/**
 * @brief				constructor for CityToday
 * @remarks			
 * @param name			city name
 * @param time			time of current weather information
 * @param condition		weather condition (0~10), such as "Rain", "Sunny", and so on
 * @param temp			temperature
 * @param degree		degree
 * @return              CityToday object
 */
function CityToday(name, text, condition, temp, degree) {
    this.valid = false;
	this.name = name;
	this.text = text;
	this.condition = condition;
	this.temp = temp;
	this.degree = degree;
	this.suggestion = [{"brief":"未知"},{"brief":"未知"},{"brief":"未知"},{"brief":"未知"},{"brief":"未知"},{"brief":"未知"}];
	this.forecast = null;
}

/**
 * @brief	check if city is prefferred city
 * @remarks		 
 * @param   cityName name of city
 * @return  true / false
 */
function checkIfPrefCity(cityName)
{
    var checked = false;
    for (var i in CITY_SELECTED)
    {
        if (cityName == CITY_SELECTED[i].name)
        {
            checked = true;
            break;
        }
    } 
    
    return checked;
}
/**
 * @brief	delete city from preffered city list
 * @remarks		 
 * @param   cityName name of city
 */
function delPrefCity(cityName)
{
    // remove, from end to start
    for (var i = CITY_SELECTED.length - 1; i >= 0 ; i--)
    {
        if (cityName == CITY_SELECTED[i].name)
        {
        	CITY_SELECTED.splice(i, 1);
        }
    }  
}
function showLoadingIcon(show) {
    if (show) {
        $('#loading-icon').addClass('active');               
    }
    else {
        $('#loading-icon').removeClass('active');                 
    }
}

/**
 * @brief	get PM level class name according to degree
 * @remarks		 
 * @param   PM degree of city
 */

function getPMlevelclass(degree){
	var level=0;
	var lclass="";
	if(degree>0&&degree<=50){
		level =1;
		lclass ="oneLevel";
	}else if(degree>50&&degree<=100){
		level =2;
		lclass ="twoLevel";
	}else if(degree>100&&degree<=150){
		level =3;
		lclass ="threeLevel";
	}else if(degree>150&&degree<=200){
		level =4;
		lclass ="fourLevel";
	}else if(degree>200&&degree<=300){
		level =5;
		lclass ="fiveLevel";
	}else if(degree>300){
		level =6;
		lclass ="sixLevel";
	}else{
		level =1;
		lclass ="oneLevel";
	}
	return lclass;
}


function loadXMLDocwithoutPopup(method,url,callback,apikey,text,ContentType){
	console.log('loadXMLDocGET');
	var xhr;
	if(window.XMLHttpRequest){
		xhr = new XMLHttpRequest();
	}
	else{
		xhr = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xhr.timeout = 30000;
	xhr.ontimeout = function(){
    	console.log("timeout"+url);
    };
	xhr.onreadystatechange = function(){
		console.log("readyState ============"+xhr.readyState);
		if(xhr.readyState == 4){
			if(xhr.status == 200){
				console.log("status ============"+xhr.status);
				var obj = xhr;
				console.log("responseText ============"+JSON.stringify(xhr.responseText));
				callback(obj);
			}else{
				console.log("status ============"+xhr.status);
				console.log("responseText ============"+JSON.stringify(xhr));
				xhr.abort();			
				callback1(-1);
			}
		}
	}
	xhr.open(method,url,true);
	if(apikey){
		xhr.setRequestHeader("apikey",apikey);
	}
	if(ContentType){
		xhr.setRequestHeader("Content-Type",ContentType);
	}
	xhr.send(text);
}

function updateTime(){
	var today=new Date();
	var h=today.getHours();
	var m=today.getMinutes();
	var s=today.getSeconds();
	var text =h+":"+m;
	console.log(text);
	document.getElementById("time").innerHTML=text;
    return setTimeout("updateTime()",30000);	
}
/// systeminfo
if(window.tizen){
var tvinfo = (function(){
	var api=function(){
		this.deviceCapabilities  = tizen.systeminfo.getCapabilities();
		this.EthernetMac;
		this.EthernetIP;
		this.EthernetMask;
		this.EthernetGetway;
		this.EthernetDNS;
		this.model;
		this.manufacture;
		this.buildversion;
		var that = this;
		tizen.systeminfo.getPropertyValue("ETHERNET_NETWORK", function(eth) {
		    console.log("The cpu load is " + eth.macAddress);
		    that.EthernetMac = eth.macAddress;
		    that.EthernetIP = eth.ipAddress;
		    that.EthernetMask = eth.subnetMask;
		    that.EthernetGetway = eth.gateway;
		    that.EthernetDNS = eth.dns;
		}, function(error) {
		    console.log("An error occurred " + error.message);
		});
		tizen.systeminfo.getPropertyValue("BUILD", function(build) {
		    console.log("The cpu load is " + build.model);
		    console.log("The cpu load is " + build.manufacturer);
		    console.log("The cpu load is " + build.buildVersion);
		    that.model = build.model;
		    that.manufacturer = build.manufacturer;
		    that.buildVersion = build.buildVersion;
		}, function(error) {
		    console.log("An error occurred " + error.message);
		});
	}
	api.prototype={
		getDUID:function(){
			return this.deviceCapabilities.duid;
		},
		getPlatformName:function(){
			return this.deviceCapabilities.platformName;
		},
		getEthernetMac:function(){
			console.log(this.EthernetMac);
			return this.EthernetMac;
		},
		getEthernetIP:function(){
			console.log(this.EthernetIP);
			return this.EthernetIP;
		},
		getModel:function(){
			return this.model;
		}
	}
	return new api();
})();
}
///push service 

var pushService = (function(){
	var push = function(){
		this.socket ;
		this.status=0 ;
	}
	push.prototype={
		init:function(){
			if(this.status)return;
			this.socket =io('http://101.200.78.153:8001',{
				  "transports":['websocket','polling']
			  });
			this.status=1;
			this.submituserinfo();
			this.socket.on('weatherUpdate',this.onWeatherUpdate);
			this.socket.on('connect_error',function(err){console.log('connect error')});
		},
		submituserinfo:function(){
			var cityselected_list=[];
			CITY_SELECTED.forEach(function(el,index){
				cityselected_list.push(el.name);
			});
			var Model = tvinfo.getModel();
			var DUID = tvinfo.getDUID();
			var platform = tvinfo.getPlatformName();
			var MAC = tvinfo.getEthernetMac();
			var IP = tvinfo.getEthernetIP();
			this.socket.emit('join',{username:Model,tvinfo:{duid:DUID,mac:MAC,ip:IP},citySelected:cityselected_list});
		},
		onWeatherUpdate:function(data){
			console.log(data);
			console.log(currentPage);
			if(currentPage==1)return;
			var len1 = data.name.length;
			var len2 = CITY_SELECTED.length;
			var count=0;
			var index=0;
			var that = this;
			for(index in data.city){
				
			for(var i=0;i<len2;i++){
				if(data.city[index]==CITY_SELECTED[i].name){
							count++;
							var weatherinfo_url = _url.CURRENT_URL1+_url.WEATHER_APIKEY+"&location="+CITY_SELECTED[i].name+"&language=zh-Hans&unit=c";
							console.log(CITY_SELECTED[i]);
							loadXMLDocwithoutPopup("GET",weatherinfo_url,function(data){
								    console.log(data);
								    var response = JSON.parse(data.responseText).results;
								    //console.log(CITY_SELECTED[i]);
								    var valueList = response.location;
									//console.log("WZQ ====== saveSuggestionInfo = "+JSON.stringify(valueList));
									var name = valueList.name;
									var cityIndex = getPrefCityIndex(name);
									console.log(cityIndex);
									if (cityIndex == -1)
									    return ;
									var city = CITY_SELECTED[cityIndex];
									var recordList = response.now;
								
									if (name == city.name && recordList) {
										var text = recordList.text;
										
										var condition = recordList.code;
										
										var temp = recordList.temperature;
										
										var AQI = recordList.AQI;
										
										// use this function
										SetCityToday(city, text, condition, temp, AQI);
										console.log(CITY_SELECTED);
									}
						 			components[currentPage].refresh();
							});
					}
				}				
			}		
		},
		disconnect:function(){
			if(this.status==0)return;
			this.socket.disconnect();
			this.status=0;
		},
		reconnect:function(){
			if(this.status)return;
			this.socket.connect();
			this.status=1;
		}
	}
	return new push();
})();