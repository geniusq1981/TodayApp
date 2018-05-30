var weaPage = (function () {

	var weaPagePlugin = function () {
		this.focusposition = 0;
	}
	weaPagePlugin.prototype = {
		init : function (e) {},
		active : function () {
			this.focusright();
		},
		setfoucs:function(index){
			this.focusposition=index;
			this.update();
		},
		deactive : function () {
			this.removefocus();
		},
		show:function(){
			document.getElementById("weatherpage").style.display = 'block';
			this.renderweatherselected(this.focusposition);
		},
		hide:function(){
			document.getElementById("weatherpage").style.display = 'none';
		},
		update:function(){
			//this.focusposition = 0;
			this.renderweatherselected(this.focusposition);
		},
		refresh:function(){
			this.updateWeatherData(this.focusposition);
		},
		tpKeyHandler : function (e) {
			//console.log(this.curdiv);
			console.log($("#" + this.curid));
			console.log(e.keyCode);
			switch (e.keyCode) {
			case 37: //LEFT arrow
				this.focusleft();
				if (this.focusposition)
					this.focusposition--;
				break;
			case 38: //UP arrow
				setObjKeyhandler("topmenu");
				this.deactive();
				tmenu.active();
				return;
			case 39: //RIGHT arrow
				this.focusright();
				if (this.focusposition < CITY_SELECTED.length - 1) //WZQ 2017/8/11 change cityselected to CITY_SELECTED
					this.focusposition++;
				console.log(this.focusposition);
				break;
			case 40: //DOWN arrow
				return;
			case 13: //OK button
				//console.log(this.curdiv);
				break;
			case 10009: //RETURN button
				setObjKeyhandler("topmenu");
				this.deactive();
				tmenu.active();
				return;
			case 10182:
				tizen.application.getCurrentApplication().exit();
				break;
			default:
				console.log('Key code : ' + e.keyCode);
				break;
			}
			this.renderweatherselected(this.focusposition);
		},
		renderfocus : function (focus) {
			
		},
		focusright:function(){
			$("#wpagecity").addClass('activea');
			$("#wpagecity").removeClass('activeb');	
		},
		focusleft:function(){
			$("#wpagecity").removeClass('activea');
			$("#wpagecity").addClass('activeb');	
		},
		removefocus:function(){
			$("#wpagecity").removeClass('activea');
			$("#wpagecity").removeClass('activeb');	
		},
		renderweatherselected : function (index) {
			console.log("renderweatherselected  index = "+index);
			var that = this;
			
				if(CITY_SELECTED){
				document.getElementById("wpagecity").innerHTML = CITY_SELECTED[index].name;
				 var html= "<ol class='cityweather'><li class='weather'>\
							<svg class='wpageweather_weathericon' aria-hidden='true'>\
							<use xlink:href='#icon-"+ConditionMap[CITY_SELECTED[index].condition[0]].samsung_value+"'></use>\
							</svg><svg class='wpageweather_weatherName' aria-hidden='true'>\
							<use xlink:href='#icon-"+ConditionMap[CITY_SELECTED[index].condition[0]].samsung_name+"'></use>\
							</svg>\
							</li>\
							<li class='wpageweather_temprature'>现在 : " + CITY_SELECTED[index].temp + "</li><li class='wpageweather_air'><svg class='wpageweather_pmicon "+getPMlevelclass(CITY_SELECTED[index].degree)+"' aria-hidden='true'>\
												<use xlink:href='#icon-pm'></use>\
												</svg><div>" + CITY_SELECTED[index].degree + "</div></li></ol><ul class='suggestion'>";
				 
					for(var i=0;i<defaultSuggestionUI.length;i++){
						html +="<li>\
				                    <svg class='suggestionicon' aria-hidden='true'>\
				                        <use xlink:href='#icon-"+defaultSuggestionUI[i].href+"'></use>\
				                    </svg>\
				                    <div class='name'>"+defaultSuggestionUI[i].name+"</div>\
				                    <div class='fontclass'>"+CITY_SELECTED[index].suggestion[i].brief+"</div>\
				                </li>";
					}
					html +="</ul>";
	            document.getElementById("wpageweather").innerHTML = html;
				document.getElementById("wpage3days").innerHTML = "<li class='banneritem'><ol>\
							<li>今天</li>\
							<li class='forecast_temp'>" + CITY_SELECTED[index].forecast[0].temp + "</li>\
							<li>" + ConditionMap[CITY_SELECTED[index].forecast[0].condition[0]].weather_value + "</li>\
							<li class='forecast_weather'><svg class='forecast_weathericon' aria-hidden='true'>\
							<use xlink:href='#icon-"+ConditionMap[CITY_SELECTED[index].forecast[0].condition[0]].samsung_value+"'></use>\
							</svg></li></ol>\
							</li>\
							<li  class='banneritem'><ol>\
							<li>明天</li>\
							<li class='forecast_temp'>" + CITY_SELECTED[index].forecast[1].temp + "</li>\
							<li>" + ConditionMap[CITY_SELECTED[index].forecast[1].condition[0]].weather_value + "</li>\
							<li class='forecast_weather'><svg class='forecast_weathericon' aria-hidden='true'>\
							<use xlink:href='#icon-"+ConditionMap[CITY_SELECTED[index].forecast[1].condition[0]].samsung_value+"'></use>\
							</svg></li></ol>\
							</li>\
							<li  class='banneritem'><ol>\
							<li >后天</li>\
							<li class='forecast_temp'>" + CITY_SELECTED[index].forecast[2].temp + "</li>\
							<li>" + ConditionMap[CITY_SELECTED[index].forecast[2].condition[0]].weather_value + "</li>\
							<li class='forecast_weather'><svg class='forecast_weathericon' aria-hidden='true'>\
							<use xlink:href='#icon-"+ConditionMap[CITY_SELECTED[index].forecast[2].condition[0]].samsung_value+"'></use>\
							</svg></li></ol>\
							</li>";
			}
		},
		updateWeatherData:function(index){
			console.log("updateWeatherData!");
			if(CITY_SELECTED){			
				$(".wpageweather_temprature").text('现在:'+ CITY_SELECTED[index].temp);
				$("。wpageweather_air div").text(CITY_SELECTED[index].degree);
				$("。wpageweather_air svg").attr("class", 'pmicon '+getPMlevelclass(CITY_SELECTED[index].degree));
				$("。wpageweather_weathericon use").attr("xlink:href", '#icon-'+ConditionMap[CITY_SELECTED[index].condition[0]].samsung_value);
				$("。wpageweather_weatherName use").attr("xlink:href", '#icon-'+ConditionMap[CITY_SELECTED[index].condition[0]].samsung_name);
				}			
		},
	}
	return new weaPagePlugin();
})();
