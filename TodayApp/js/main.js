var focusposition = {
	"page" : 0,
	"area" : 0,
	"position" : 0
}; // page->0:home;1:calendar;2:weather // area-> 0: top menu;1: center area// position -> top menu: 0,1,2,3,4; center area:1,2,3....
var currentPage = 0;
var keyhanderid = ["mainHome", "calendar", "weather","news","stock"];

var prefocusarea;
var tvKey = new Common.API.TVKeyValue();
var keyhandlerobj = null;
var currentselect = 0;
//Initialize function
var tmenu = (function () {

	var topmenuPlugin = function () {
		this.topmenuid = ["menuToday", "menuYea", "menuWeather", "menuCity"];
		this.focusposition = 0;
		this.curid = "menuToday"
	}
	topmenuPlugin.prototype = {
		init : function (e) {
			this.focusposition = 0;
			this.curid = "menuToday"
			this.renderfocus(this.focusposition);
			currentPage=0;
		},
		update:function(){
			components[currentPage].update();
			for(var i=0;i<components.length;i++){
				if(i==currentPage){
			components[i].show();
			}else{
				components[i].hide();	
				}
			}
		},
		active : function () {
			var that=this;
			this.topmenuid.forEach(function (e, index) {
				console.log(e+that.curid);
				if (e == that.curid) {
					console.log(that.curid);
					if(that.curid=="menuCity"){
						$("#" + e+" use").attr("xlink:href", "#icon-positionfocus");
					}else{
					$("#" + e).addClass("focus");
					}
				} else {
					if(this.curid=="menuCity"){
						$("#" + e+" use").attr("xlink:href", "#icon-position");
					}else{
					$("#" + e).removeClass("focus");
					}
				}
			});
			this.update();
			//components[currentPage].show();
		},
		deactive : function () {
			this.topmenuid.forEach(function (e, index) {
				console.log(e);
				$("#" + e).removeClass("focus");
			});
		},
		tpKeyHandler : function (e) {
			//console.log(this.curdiv);
			console.log($("#" + this.curid));
			console.log(e.keyCode);
			switch (e.keyCode) {
			case 37: //LEFT arrow
				if (this.focusposition)
					this.focusposition--;
				break;
			case 39: //RIGHT arrow
				if (this.focusposition < topmenuid.length - 1)
					this.focusposition++;
				console.log(this.focusposition);
				break;
			case 40: //DOWN arrow
				if(this.curid =="menuCity")return;
				setObjKeyhandler(keyhanderid[currentPage]);
				this.deactive();
				console.log(components[currentPage]);
				components[currentPage].active();				
				return;
			case 13: //OK button
				console.log(this.curdiv);
				$("#" + this.curid).click();
				break;
			case 10009: //RETURN button
				//tizen.application.getCurrentApplication().hide();
				popup.init(2, "确定退出今日信息？", ["取消","确定"],function(obj){
					if(obj == true){
						tizen.application.getCurrentApplication().exit();
					}
				});
				break;
			case 10182:
				tizen.application.getCurrentApplication().exit();
				break;
			default:
				console.log('Key code : ' + e.keyCode);
				break;
			}
			this.renderfocus(this.focusposition);
		},
		renderfocus : function (focus) {
			console.log(focus);
			var that = this
				this.topmenuid.forEach(function (e, index) {
					console.log($("#" + e));
					if (index == focus) {
						console.log(focus);
						that.curid = e;
						if(index==3){
							$("#" + e+" use").attr("xlink:href","#icon-positionfocus");
							//$("#" + e).addClass("fillfocus");
						}else{
						$("#" + e).addClass("focus");
						}
					} else {
						if(index==3){
							$("#" + e+" use").attr("xlink:href","#icon-position");
							//$("#" + e).removeClass("fillfocus");
						}else{
						$("#" + e).removeClass("focus");
						}
					}
				});
			console.log(that.curid);
		}
	}
	return new topmenuPlugin();
})();

var mHome = (function () {

	var mHomePlugin = function () {
		this.topmenuid = ["menuToday", "menuYea", "menuWeather", "menuCity"];
		this.focusposition = 0;
		this.divlength =0;
		this.curdiv = "";
		this.alldivs = new Array();
	}
	mHomePlugin.prototype = {
		init : function (e) {
			this.focusposition = 0;
			this.divlength =0;
			this.curdiv = "";
			this.alldivs = new Array();
			this.update();
		},
		active : function () {
			//var divs = this.getdivs();
			this.divlength = this.alldivs.length;
			for (var i = 0; i < this.divlength; i++) {
				if (i == this.focusposition) {
					var temp = 25 * (i + 1);
					if (temp > 0 && temp < 90) {
						document.getElementById("centerarea").style.left = "0%";
					} else if (temp > 90 && temp < 160) {
						document.getElementById("centerarea").style.left = "-95%";
					} else if (temp > 160) {
						document.getElementById("centerarea").style.left = "-180%";
					} else {}
					addClass(this.alldivs[i], 'focus');
					this.curdiv=this.alldivs[i];
				} else {
					removeClass(this.alldivs[i], 'focus');
				}
			}	
			this.show();
		},
		deactive : function () {
			var divs = this.alldivs;
			for (var i = 0; i < divs.length; i++) {
					removeClass(divs[i], 'focus');
			}	
		},
		update:function(){
			this.renderdates();
			this.renderweather();
			if(CITY_SELECTED.length){
				pushService.init();
			}
		},
		refresh:function(){
			this.updateWeatherData();
		},
		show:function(){
			document.getElementById("centerarea").style.display = 'block';
		},
		hide:function(){
			document.getElementById("centerarea").style.display = 'none';
		},
		tpKeyHandler : function (e) {
			//console.log(this.curdiv);
			console.log($("#" + this.curid));
			//console.log(e.keyCode);
			switch (e.keyCode) {
			case 37: //LEFT arrow
				if (this.focusposition)
					this.focusposition--;
				break;
			case 38: //UP arrow
				setObjKeyhandler("topmenu");
				this.deactive();
				tmenu.active();
				return;
			case 39: //RIGHT arrow
				if (this.focusposition < this.divlength-1)
					this.focusposition++;
				console.log(this.focusposition);
				break;
			case 40: //DOWN arrow
				break;
			case 13: //OK button
				console.log(this.curdiv);
				console.log(currentPage);
				this.deactive();
				this.curdiv.click();		
				setObjKeyhandler(keyhanderid[currentPage]);				
				//console.log(components[currentPage]);
				components[currentPage].active();		
				return;
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
			this.renderfocus(this.focusposition);
		},
		renderfocus : function (focus) {
			console.log(focus);
			var divs = this.alldivs;
			console.log(divs);
			for (var i = 0; i < divs.length; i++) {
				if (i == focus) {
					var temp = 25 * (i + 1);
					if (temp > 0 && temp < 90) {
						document.getElementById("centerarea").style.left = "0%";
					} else if (temp > 90 && temp < 160) {
						document.getElementById("centerarea").style.left = "-95%";
					} else if (temp > 160) {
						document.getElementById("centerarea").style.left = "-180%";
					} else {}
					console.log(divs[i]);
					addClass(divs[i], 'focus');
					this.curdiv = divs[i];
				} else {
					removeClass(divs[i], 'focus');
				}
			}
		},
		renderdates:function () {
			var D = new Date();
			var yy = D.getFullYear();
			var mm = D.getMonth() + 1;
			var dd = D.getDate();
			if (yy < 100)
				yy = "19" + yy;
			Calcore.GetLunarDay(yy, mm, dd);
			var ndate=Calcore.getCDate();
			document.getElementById("datecard").getElementsByTagName("use")[0].href.baseVal = zdicon[D.getDay()];
			document.getElementById("date").innerHTML = dd;
			document.getElementById("ndate").innerHTML = ndate;
			document.getElementById("month").innerHTML = zm[mm - 1];

			//document.getElementById("calweek").getElementsByTagName("use")[0].href.baseVal = zdicon[D.getDay() - 1];
			//document.getElementById("caldate").innerHTML = dd;
			//document.getElementById("calndate").innerHTML = GetcDate();
		},
		updateWeatherData:function(){
			console.log("updateWeatherData!");
			
			CITY_SELECTED.forEach(function (el, index) {
				
				console.log($(".temprature")[index]);//.attr("xlink:href", "#icon-ok");
				console.log($(".air div")[index]);
				console.log($(".air svg")[index]);
				console.log($(".weathericon")[index]);
				console.log($(".weatherName")[index]);
				
				$($(".temprature")[index]).text('现在:'+ el.temp);
				$($(".air div")[index]).text(el.degree);
				$($(".air svg")[index]).attr("class", 'pmicon '+getPMlevelclass(el.degree));
				$($(".weathericon use")[index]).attr("xlink:href", '#icon-'+ConditionMap[el.condition[0]].samsung_value);
				$($(".weatherName use")[index]).attr("xlink:href", '#icon-'+ConditionMap[el.condition[0]].samsung_name);
				
			});
		
		},
		getPMlevelclass:function(degree){
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
		},
		renderweather:function() {
			console.log("renderweather!");
			var divobj = document.getElementById("centerarea");
			divobj.innerHTML = divobj.getElementsByTagName("div")[0].outerHTML;
			this.alldivs.splice(0,this.alldivs.length);
			this.alldivs.push(document.getElementById("datecard"));
			var that = this;
			CITY_SELECTED.forEach(function (el, index) {
				console.log(weatherdata[index]);
				var divEl = document.createElement("div");
				divEl.id = "mask" + index;
				divEl.className = "mask1";
				/*divEl.onclick = function () {
					clicktop('topweather');
				};*/
				
				console.log("renderweather el = "+el);
				console.log("renderweather el.temp = "+el.temp);
				console.log("renderweather el.time = "+el.time);
				console.log("renderweather el.name = "+el.name);
				console.log("renderweather el.condition[0] = "+el.condition[0]);
				console.log(that.getPMlevelclass(el.degree));
				divEl.innerHTML = "<div class='bluredBackground'>\
										    <div class='blackmask'>\
										    <ol class='weatherHome'><li class='weather'>\
										    <svg class='weathericon' aria-hidden='true'>\
											<use xlink:href='#icon-"+ConditionMap[el.condition[0]].samsung_value+"'></use>\
											</svg><svg class='weatherName' aria-hidden='true'>\
											<use xlink:href='#icon-"+ConditionMap[el.condition[0]].samsung_name+"'></use>\
											</svg>\
											</li>\
										    <li class='temprature'>现在: " + el.temp +
					"</li><li class='air'><svg class='pmicon "+getPMlevelclass(el.degree)+"' aria-hidden='true'>\
											<use xlink:href='#icon-pm'></use>\
											</svg><div>" + el.degree +
					"</div></li></ol></div></div>\
										    <div class='content'>" + el.name +
					"</div>";
				document.getElementById("centerarea").appendChild(divEl);
				divEl.onclick = function (el) {
					console.log(el.target.id);
					var id = el.target.id;
					console.log(id.length);
					var index = id.substr(id.length-1,1);
					
					clicktop('topweather',index);
				};
				/*divEl.addEventListener("click", function(){
					clicktop('topweather');
				});*/
				that.alldivs.push(divEl);
			});
			if(CITY_SELECTED.length==1){
				$("#datecard").attr("class","maskbig");
				$("#mask0").attr("class","mask1big");
			}else{
				$("#datecard").attr("class","mask");
			}

		}
	}
	return new mHomePlugin();
})();

var components =[mHome,calPage,weaPage,stockPage,stockPage];
var init = function () {
	// TODO:: Do your initialization job
	console.log('init() called');

	document.addEventListener('visibilitychange', function () {
		if (document.hidden) {
			// Something you want to do when hide or exit.
			pushService.disconnect();
			
		} else {
			// Something you want to do when resume.
			pushService.reconnect();
		}
	});
          //WZQ check local storage
	// add eventListener for keydown
	document.addEventListener('keydown', function (e) {
		if (keyhandlerobj == "cityManage") {
			CMP.cmKeyHandler(e);
		} else if (keyhandlerobj == "Provincelist") {
			CMP.plKeyHandler(e);
		} else if (keyhandlerobj == "cityList2") {
			CMP.clKeyHandler(e);
		} else if (keyhandlerobj == "mainHome") {
			mHome.tpKeyHandler(e);
		} else if (keyhandlerobj == "calendar") {
			calPage.tpKeyHandler(e);
		} else if (keyhandlerobj == "weather") {
			weaPage.tpKeyHandler(e);
		} else if (keyhandlerobj == "stock"){
			stockPage.tpKeyHandler(e);
		}else if (keyhandlerobj == "topmenu") {
			tmenu.tpKeyHandler(e);
		} else if(keyhandlerobj == "popup"){
			popup.keyhandler(e);
		} 
	});
	console.log(mHome);
	
	loadDataFromCommon(function(status){
		
		tmenu.init();
		setObjKeyhandler("topmenu");
		mHome.init();		
	    if(status=="success"){	    	
	    	mHome.show();
	    	pushService.init();
	    }
	    
	});	

	//initfocus();
};
// window.onload can work without <body onload="">
window.onload = init;
window.onunload = function(){
	pushService.disconnect();
}

function setObjKeyhandler(str) {
	keyhandlerobj = str;
}

function clicktop(menu,index) {
	console.log(menu);
	var params = index;
	switch (menu) {
	case 'topdate':
		calPage.hide();
		weaPage.hide();
		stockPage.hide();
		mHome.show();
		focusposition.page = 0;
		currentPage = 0;
		break;
	case 'topyear':
		mHome.hide();
		weaPage.hide();
		stockPage.hide();
		calPage.show();
		focusposition.page = 1;
		currentPage = 1;
		break;
	case 'topweather':
		//document.getElementById("centerarea").style.display = 'none';
		//document.getElementById("calendarpage").style.display = 'none';
		//renderweatherselected(0);
		//document.getElementById("weatherpage").style.display = 'block';
		mHome.hide()
		calPage.hide();
		stockPage.hide();
		console.log(params);
		if(params){
		weaPage.setfoucs(params);
		}
		weaPage.show();
		focusposition.page = 2;
		currentPage = 2;
		break;
	case 'topstock':
		//document.getElementById("centerarea").style.display = 'none';
		//document.getElementById("calendarpage").style.display = 'none';
		//renderweatherselected(0);
		//document.getElementById("weatherpage").style.display = 'block';
		//mHome.hide()
		//calPage.hide();
		//weaPage.hide();
		stockPage.show();
		focusposition.page = 2;
		currentPage = 4;
		setObjKeyhandler(keyhanderid[currentPage]);
		tmenu.deactive();
		console.log(components[currentPage]);
		components[currentPage].active();
		break;
	case 'topcity':
		CMP.init();
		break;
	case 'jdjfsk':
		break;
	default:
		break;
	}
}
function hasClass(obj, cls) {
	return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}
function addClass(obj, cls) {
	if (!this.hasClass(obj, cls))
		obj.className += " " + cls;
}

function removeClass(obj, cls) {
	if (hasClass(obj, cls)) {
		var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
		obj.className = obj.className.replace(reg, ' ');
	}
}
