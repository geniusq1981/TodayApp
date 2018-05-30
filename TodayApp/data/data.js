var cityselected = ["天津", "北京", "上海", "长春", "泰安", "广州", "深圳", "成都"];
/*
 * example
 * 
 * CITY_LIST = [
 * 		{
 * 			"name":"河北",
 * 			"url":"http://php.weather.sina.com.cn/iframe/samsung/citys.php?province=%E6%B2%B3%E5%8C%97",
 * 			"regions":["石家庄","承德","秦皇岛","保定","唐山","邯郸","邢台","张家口","沧州","廊坊","衡水"]
 * 		}
 * ]
 * */
var CITY_LIST = [];
/*
 * example
 * 
 * CITY_SELECTED = [
 * 		{
	        "valid": true,
	        "name": "大同",
	        "text": "多云",
	        "condition": [4, 4],
	        "temp": "18°",
	        "degree": 36,
	        "suggestion":[{"brief":"不宜"},{"brief":"炎热"},{"brief":"少发"},{"brief":"较适宜"},{"brief":"一般"},{"brief":"弱"}],
	        "forecast": [{"date": "2017-06-28","condition": [11,4],"temp": "15°/32°","maxtemp": "32","mintemp": "15"},
			             {"date": "2017-06-29","condition": [11,4],"temp": "15°/32°","maxtemp": "32","mintemp": "15"},
			             {"date": "2017-06-30","condition": [4,1] ,"temp": "16°/31°","maxtemp": "31","mintemp": "16"}]
    	}
 * ]
 * 
 * */
var CITY_SELECTED = [];
var weatherdata = [{
    "day0": {"w":"0","t":"10°/20°","a":"50"},
    "day1": {"w":"1","t":"9°/20°","a":"50"},
    "day2": {"w":"2","t":"11°/20°","a":"50"}
}, {
    "day0": {"w":"0","t":"15°/20°","a":"25"},
    "day1": {"w":"0","t":"17°/20°","a":"50"},
    "day2": {"w":"0","t":"11°/20°","a":"50"}
}, {
    "day0": {"w":"0","t":"13°/20°","a":"50"},
    "day1": {"w":"0","t":"12°/20°","a":"50"},
    "day2": {"w":"0","t":"13°/20°","a":"50"}
}, {
    "day0": {"w":"0","t":"12°/20°","a":"50"},
    "day1": {"w":"0","t":"11°/20°","a":"50"},
    "day2": {"w":"0","t":"10°/20°","a":"50"}
}, {
    "day0": {"w":"0","t":"16°/20°","a":"50"},
    "day1": {"w":"0","t":"17°/20°","a":"50"},
    "day2": {"w":"0","t":"18°/20°","a":"50"}
}, {
    "day0": {"w":"0","t":"12°/20°","a":"50"},
    "day1": {"w":"0","t":"11°/20°","a":"50"},
    "day2": {"w":"0","t":"12°/20°","a":"50"}
}, {
    "day0": {"w":"0","t":"13°/20°","a":"50"},
    "day1": {"w":"0","t":"14°/20°","a":"50"},
    "day2": {"w":"0","t":"15°/20°","a":"50"}
}, {
    "day0": {"w":"0","t":"16°/20°","a":"50"},
    "day1": {"w":"0","t":"17°/20°","a":"50"},
    "day2": {"w":"0","t":"18°/20°","a":"50"}
}];

var todayinfo = {
    year: 2017,
    month: "5月",
    date: 23,
    week: "星期一",
    nyear: "",
    ndate: ""
}
var CalendarColorCard = ["#4a9ecc","#9186c2","#76c5af","#009944","#eb6100","#ca384f","#ff4d6f","#de795d","#dd992a","#dbb71b","#9b951d","#415754"];
var topmenuid = ["menuToday", "menuYea", "menuWeather","menuCity"];
var PM2_5ColorCard = ["#46c95e","#dd992a","#eb6100","#ca384f","#b31a82","#4c0000"];//0-50 一级 优， 51-100 二级 良，101-150 三级 轻度污染，151-200 四级 重度污染，201-300 五级 重度污染，>300 六级 严重污染
var defaultSuggestionUI = [{"href":"car","name":"洗车指数"},{"href":"bressing","name":"穿衣指数"},{"href":"flu","name":"感冒指数"},{"href":"sport","name":"运动指数"},{"href":"travel","name":"出行指数"},{"href":"uv","name":"紫外线指数"}];
var ConditionMap = [
                	{
                		weather_id: 0,
                		weather_value: "晴",
                		samsung_id: 0,
                		samsung_value: "weather_clear_d",
                		samsung_name:"clear"
                	},
                	{
                		weather_id: 1,
                		weather_value: "晴",
                		samsung_id: 1,
                		samsung_value: "weather_clear_d",
                		samsung_name:"clear"
                	},
                	{
                		weather_id: 2,
                		weather_value: "晴",
                		samsung_id: 2,
                		samsung_value: "weather_clear_d",
                	    samsung_name:"clear"
                	},
                	{
                		weather_id: 3,
                		weather_value: "晴",
                		samsung_id: 3,
                		samsung_value: "weather_clear_d",
                		samsung_name:"clear"
                	},
                	{
                		weather_id: 4,
                		weather_value: "多云",
                		samsung_id: 4,
                		samsung_value: "weather_cloudy_d",
                	    samsung_name:"cloudy"
                	},
                	{
                		weather_id: 5,
                		weather_value: "晴间多云",
                		samsung_id: 5,
                		samsung_value: "weather_cloudy_d",
                	    samsung_name:"cloudy"
                	},
                	{
                		weather_id: 6,
                		weather_value: "晴间多云",
                		samsung_id: 6,
                		samsung_value: "weather_cloudy_d",
                	    samsung_name:"cloudy"
                	},
                	{
                		weather_id: 7,
                		weather_value: "大部多云",
                		samsung_id: 7,
                		samsung_value: "weather_cloudy_d",
                	    samsung_name:"cloudy"
                	},
                	{
                		weather_id: 8,
                		weather_value: "大部多云",
                		samsung_id: 8,
                		samsung_value: "weather_cloudy_d",
                	    samsung_name:"cloudy"
                	},
                	{
                		weather_id: 9,
                		weather_value: "阴",
                		samsung_id: 9,
                		samsung_value: "weather_cloudy",
                		samsung_name:"overcast"
                	},
                	{
                		weather_id: 10,
                		weather_value: "阵雨",
                		samsung_id: 10,
                		samsung_value: "weather_shower",
                		samsung_name:"shower"
                	},
                	{
                		weather_id: 11,
                		weather_value: "雷阵雨",
                		samsung_id: 11,
                		samsung_value: "weather_thundershower",
                		samsung_name:"thundershower"
                	},
                	{
                		weather_id: 12,
                		weather_value: "雨伴冰雹",
                		samsung_id: 12,
                		samsung_value: "weather_hail",
                		samsung_name:"hail"
                	},
                	{
                		weather_id: 13,
                		weather_value: "小雨",
                		samsung_id: 13,
                		samsung_value: "weather_s_rain",
                		samsung_name:"s_rain"
                	},
                	{
                		weather_id: 14,
                		weather_value: "中雨",
                		samsung_id: 14,
                		samsung_value: "weather_m_rain",
                		samsung_name:"m_rain"
                	},
                	{
                		weather_id: 15,
                		weather_value: "大雨",
                		samsung_id: 15,
                		samsung_value: "weather_b_rain",
                		samsung_name:"b_rain"
                	},
                	{
                		weather_id: 16,
                		weather_value: "暴雨",
                		samsung_id: 16,
                		samsung_value: "weather_h_rain",
                		samsung_name:"h_rain"
                	},
                	{
                		weather_id: 17,
                		weather_value: "大暴雨",
                		samsung_id: 17,
                		samsung_value: "weather_h_rain",
                		samsung_name:"h_rain"
                	},
                	{
                		weather_id: 18,
                		weather_value: "特大暴雨",
                		samsung_id: 18,
                		samsung_value: "weather_h_rain",
                		samsung_name:"h_rain"
                	},
                	{
                		weather_id: 19,
                		weather_value: "冻雨",
                		samsung_id: 19,
                		samsung_value: "weather_icerain",
                		samsung_name:"ice_rain"
                	},
                	{
                		weather_id: 20,
                		weather_value: "雨夹雪",
                		samsung_id: 20,
                		samsung_value: "weather_sleet",
                		samsung_name:"sleet"
                	},
                	{
                		weather_id: 21,
                		weather_value: "阵雪",
                		samsung_id: 21,
                		samsung_value: "weather_s_snow",
                		samsung_name:"snow_shower"
                	},
                	{
                		weather_id: 22,
                		weather_value: "小雪",
                		samsung_id: 22,
                		samsung_value: "weather_s_snow",
                		samsung_name:"s_snow"
                	},
                	{
                		weather_id: 23,
                		weather_value: "中雪",
                		samsung_id: 23,
                		samsung_value: "weather_m_snow",
                		samsung_name:"m_snow"
                	},
                	{
                		weather_id: 24,
                		weather_value: "大雪",
                		samsung_id: 24,
                		samsung_value: "weather_b_snow",
                		samsung_name:"b_snow"
                	},
                	{
                		weather_id: 25,
                		weather_value: "暴雪",
                		samsung_id: 25,
                		samsung_value: "weather_h_snow",
                		samsung_name:"h_snow"
                	},
                	{
                		weather_id: 26,
                		weather_value: "浮尘",
                		samsung_id: 26,
                		samsung_value: "weather_dush",
                		samsung_name:"dush"
                	},
                	{
                		weather_id: 27,
                		weather_value: "扬沙",
                		samsung_id: 27,
                		samsung_value: "weather_blowingSand",
                		samsung_name:"blowingSand"
                	},
                	{
                		weather_id: 28,
                		weather_value: "沙尘暴",
                		samsung_id: 28,
                		samsung_value: "weather_sandStorm",
                		samsung_name:"sandStorm"
                	},
                	{
                		weather_id: 29,
                		weather_value: "强沙尘暴",
                		samsung_id: 29,
                		samsung_value: "weather_sandStorm",
                		samsung_name:"sandStorm"
                	},
                	{
                		weather_id: 30,
                		weather_value: "雾",
                		samsung_id: 30,
                		samsung_value: "weather_fog",
                		samsung_name:"fog"
                	},
                	{
                		weather_id: 31,
                		weather_value: "霾",
                		samsung_id: 31,
                		samsung_value: "weather_haze",
                		samsung_name:"haze"
                	},
                	{
                		weather_id: 32,
                		weather_value: "风",
                		samsung_id: 32,
                		samsung_value: "weather_wind",
                		samsung_name:"wind"
                	},
                	{
                		weather_id: 33,
                		weather_value: "大风",
                		samsung_id: 33,
                		samsung_value: "weather_wind",
                		samsung_name:"wind"
                	},
                	{
                		weather_id: 34,
                		weather_value: "飓风",
                		samsung_id: 34,
                		samsung_value: "weather_wind",
                		samsung_name:"wind"
                	},
                	{
                		weather_id: 35,
                		weather_value: "热带风暴",
                		samsung_id: 35,
                		samsung_value: "weather_wind",
                		samsung_name:"wind"
                	},
                	{
                		weather_id: 36,
                		weather_value: "龙卷风",
                		samsung_id: 36,
                		samsung_value: "weather_wind",
                		samsung_name:"wind"
                	},
                	{
                		weather_id: 37,
                		weather_value: "冷",
                		samsung_id: 37,
                		samsung_value: "weather_cloudy",
                		samsung_name:"cloudy"
                	},
                	{
                		weather_id: 38,
                		weather_value: "热",
                		samsung_id: 38,
                		samsung_value: "weather_clear_d",
                		samsung_name:"clear"
                	},
                	{
                		weather_id: 39,
                		weather_value: "多云",
                		samsung_id: 39,
                		samsung_value: "weather_cloudy_d",
                		samsung_name:"cloudy"
                	},
                	{
                		weather_id: 40,
                		weather_value: "雷雨",
                		samsung_id: 40,
                		samsung_value: "weather_thundershower",
                		samsung_name:"thundershower"
                	},
                	{
                		weather_id: 41,
                		weather_value: "小到中雨",
                		samsung_id: 14,
                		samsung_value: "weather_m_rain",
                		samsung_name:"m_rain"
                	},
                	{
                		weather_id: 42,
                		weather_value: "中到大雨",
                		samsung_id: 15,
                		samsung_value: "weather_b_rain",
                		samsung_name:"b_rain"
                	}
                	
                ];