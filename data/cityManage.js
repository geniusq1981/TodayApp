var CMP = (function(){
	
	var cityManagePlugin = function(){
		this.position = 0;
		this.uneditButtonid = 0;
		this.provinceId = {"listPos":0,"realPos":0};
		this.cityId = {"listPos":0,"realPos":0};
		this.ifedit = false;
	}
	cityManagePlugin.prototype = {
			init:function(){
				this.show();
				this.createHtml();
				this.addCityHtml();
			},
			show:function(){
				$("#cityManage").show();
				$(".cityEdit").addClass("_efocus");
				setObjKeyhandler("cityManage");
				console.log("CMP show keyhandler = "+keyhandlerobj);
			},
			hide:function(){
				this.position = 0;
				this.uneditButtonid = 0;
				if(this.ifedit == true){
					$(".addcity").show();
					$(".cityEdit").addClass("_efocus");
					this.edithide();
				};
				$("#cityManage").hide();
				setObjKeyhandler(null);
			},
			reset:function(){
				
			},
			setFocus:function(){
				
			},
			editshow:function(){
				$(".cityEdit use").attr("xlink:href", "#icon-ok");
				this.ifedit = true;
				$(".selectedcitylist ._delete").css("visibility","visible");
				$($(".selectedcitylist ._delete")[this.position]).addClass("_focus");
				$($(".selectedcitylist > li")[this.position]).addClass("addfocus");
			},
			edithide:function(){
				$(".cityEdit use").attr("xlink:href", "#icon-edit");
				this.ifedit = false;
				$(".selectedcitylist ._delete").css("visibility","hidden");
				$($(".selectedcitylist ._delete")[this.position]).removeClass("_focus");
				$($(".selectedcitylist > li")[this.position]).removeClass("addfocus");
			},
			createHtml:function(){
				var html="";
				html = '<li class="addcity">\
							<svg id="addcity" class="addicon" aria-hidden="true">\
								<use xlink:href="#icon-add"></use>\
							</svg>\
						</li>';
				$('#selectedcitylist').html(html);
			},
			addCityHtml:function(){
				$("#selectedcitylist .addcity").prevAll().remove();
				var html="";
				for(var i=0;i<CITY_SELECTED.length;i++){
					html += '<li>\
								<div>\
									<svg class="_delete" aria-hidden="true"><use xlink:href="#icon-delete"></use></svg>\
									<svg class="cityweathericon" aria-hidden="true"><use xlink:href="#icon-'+ConditionMap[CITY_SELECTED[i].condition[0]].samsung_value+'"></use></svg>\
									<div class="_temp">'+CITY_SELECTED[i].forecast[0].maxtemp+'°<br>'+CITY_SELECTED[i].forecast[0].mintemp+'°</div>\
									<div class="_name">'+ConditionMap[CITY_SELECTED[i].condition[0]].weather_value+'</div>	\
								</div>\
								<p>'+CITY_SELECTED[i].name+'</p>\
							</li>';
				}
				$('#selectedcitylist').prepend(html);
			},
			getWeatherInfo:function(){
				showLoadingIcon(true);
			 	for(var i=0;i<CITY_SELECTED.length;i++){
			 		var weatherinfo_url = _url.CURRENT_URL1+_url.WEATHER_APIKEY+"&location="+CITY_SELECTED[i].name+"&language=zh-Hans&unit=c";
			 		loadXMLDoc("GET",weatherinfo_url,onLoadCurrentXML,function(str){
			 			showLoadingIcon(false);
			 			console.log("getWeatherInfo" + JSON.stringify(CITY_SELECTED));
			 			if(str == "fail"){}
			 			else{
			 				CMP.addCityHtml();
			 			}
			 			
			 		});
			 	}
			 	saveDataToCommon();
			},
			getProvincelist:function(){
				showLoadingIcon(true);
				loadXMLDoc("GET",_url.PROVINCE_URL,createCityList,this.showProvincelist);
			},
			getCitylist:function(url){
				showLoadingIcon(true);
				loadXMLDoc("GET",url,createCityList,this.showCitylist);
			},
			hideProvincelist:function(){
				$("#cityList").hide();
				this.provinceId = {"listPos":0,"realPos":0};
			},
			hideCitylist:function(){
				$(".cityListLevel2").hide();
				$($(".cityListLevel1 .cityfocus")[this.provinceId.realPos]).addClass("afocus");
				this.cityId = {"listPos":0,"realPos":0};
			},
			showProvincelist:function(){
				showLoadingIcon(false);
				$("#cityList").show();
				CMP.createProvincelist();
				$($(".cityfocus")[CMP.provinceId.realPos]).addClass("afocus");
				setObjKeyhandler("Provincelist");
			},
			createProvincelist:function(){
				var html1=" <ul>";
				console.log("createCityList "+CITY_LIST[0].name);
				for(var i=0;i<CITY_LIST.length;i++){
					html1 += "<li><div class='cityfocus'>"+CITY_LIST[i].name+"</div></li>";
				}
				html1 += "</ul>";
				$("#_level1list").html(html1);
			},
			showCitylist:function(list){
				showLoadingIcon(false);
				CITY_LIST[CMP.provinceId.realPos].regions = list;
				console.log("try to load " + JSON.stringify(CITY_LIST));
				$(".cityListLevel2").show();
				$("#_subtitle>div").html(CITY_LIST[CMP.provinceId.realPos].name);
				CMP.createCitylist();
				$($(".cityListLevel1 .cityfocus")[CMP.provinceId.realPos]).removeClass("afocus");
				$($(".cityListLevel2 .cityfocus")[CMP.cityId.realPos]).addClass("afocus");
				setObjKeyhandler("cityList2");	
			},
			createCitylist:function(){
				var html2=" <ul>";
				for(var i=0;i<CITY_LIST[this.provinceId.realPos].regions.length;i++){
					html2 += "<li><div class='cityfocus'>"+CITY_LIST[this.provinceId.realPos].regions[i]+"<svg class='selecticon' aria-hidden='true'><use xlink:href='#icon-select'></use></svg></div></li>";
				}
				html2 += "</ul>";
				$("#_level2list").html(html2);
				for(var i=0;i<CITY_LIST[this.provinceId.realPos].regions.length;i++){
					if(checkIfPrefCity(CITY_LIST[this.provinceId.realPos].regions[i])){
						$($(".cityListLevel2 .selecticon")[i]).addClass("selectedfocus");
					}
				}
			},
			cmKeyHandler:function(e){
				console.log("cityManage page "+ e.keyCode);
				switch(e.keyCode){
				 case tvKey.KEY_ESC:
				 case tvKey.KEY_RETURN://Return
					 
					 	if(CITY_SELECTED == 0){
					 		popup.init(1, "城市不可以为空哦！", ["知道了"]);
					 	}
					 	else if(onLoadCurrentXMLTime != CITY_SELECTED.length && onLoadCurrentXMLTime!=0){
					 		popup.init(1, "请求进行中，请稍后！", ["知道了"]);
					 	}
					 	else{
					 		this.hide();
						 	mHome.update();
							weaPage.setfoucs(0);  //modify by WZQ 2017/8/16
						 	setObjKeyhandler("topmenu");
						 	tmenu.init();
						 	tmenu.active();
					 	}
						break;
					case tvKey.KEY_EXIT://Exit
						tizen.application.getCurrentApplication().exit(); 
						break;
					case tvKey.KEY_UP://up
						this.uneditButtonid = 0;
						if(this.ifedit == false){
							$("#addcity").removeClass("_focus");
							$(".cityEdit").addClass("_efocus");
						}
						else{
							$($(".selectedcitylist > li")[this.position]).removeClass("addfocus");
							$($(".selectedcitylist ._delete")[this.position]).removeClass("_focus");
							$(".cityEdit").addClass("_efocus");
						}
				    	break;
					case tvKey.KEY_DOWN://down
						this.uneditButtonid = 1;
						if(this.ifedit == false){
							if(CITY_SELECTED.length == 8){
								this.uneditButtonid = 0;
							}
							else{
								$(".cityEdit").removeClass("_efocus");
								$("#addcity").addClass("_focus");
							}
						}
						else{
							$($(".selectedcitylist > li")[this.position]).addClass("addfocus");
							$($(".selectedcitylist ._delete")[this.position]).addClass("_focus");
							$(".cityEdit").removeClass("_efocus");
						}
						break;
					case tvKey.KEY_LEFT://left
						if(this.ifedit == false){}
						else{
							if(this.position == 0){}
							else{
								$($(".selectedcitylist > li")[this.position]).removeClass("addfocus");
								$($(".selectedcitylist ._delete")[this.position]).removeClass("_focus");
								this.position--;
								$($(".selectedcitylist > li")[this.position]).addClass("addfocus");
								$($(".selectedcitylist ._delete")[this.position]).addClass("_focus");
							}
						}
				    	break;
					case tvKey.KEY_RIGHT://right
						if(this.ifedit == false){}
						else{
							if(this.position == (CITY_SELECTED.length-1)){}
							else{
								$($(".selectedcitylist > li")[this.position]).removeClass("addfocus");
								$($(".selectedcitylist ._delete")[this.position]).removeClass("_focus");
								this.position++;
								$($(".selectedcitylist > li")[this.position]).addClass("addfocus");
								$($(".selectedcitylist ._delete")[this.position]).addClass("_focus");
							}
						}
						break;
					case tvKey.KEY_ENTER://Enter
						if(this.ifedit == false){
							if(this.uneditButtonid == 1){
								this.getProvincelist();
							}
							else{
								if(CITY_SELECTED.length == 0){
									popup.init(1, "城市不可以为空哦！", ["知道了"]);
								}else{
									$(".addcity").hide();
									$(".cityEdit").removeClass("_efocus");
									this.editshow();
									this.uneditButtonid = 1;
								}	
							}
						}
						else{
							if(this.uneditButtonid == 1){
								console.log("cmkey enter = "+CITY_SELECTED.length);
								popup.init(2, "确定删除该城市？", ["取消","删除"],function(obj){
									if(obj == true){
										delPrefCity(CITY_SELECTED[CMP.position].name);
										$($(".selectedcitylist > li")[CMP.position]).remove();
										if((CMP.position == CITY_SELECTED.length) && (CITY_SELECTED.length != 0)){
											CMP.position--;
										}
										console.log(CMP.position);
										$($(".selectedcitylist > li")[CMP.position]).addClass("addfocus");
										$($(".selectedcitylist ._delete")[CMP.position]).addClass("_focus");
										if(CITY_SELECTED.length == 0){
											$(".addcity").show();
											$(".cityEdit").addClass("_efocus");
											CMP.edithide();
											CMP.uneditButtonid = 0;
										}
										saveDataToCommon();
									}
								});	
							}
							else{
								$(".addcity").show();
								$(".cityEdit").addClass("_efocus");
								this.edithide();
								this.uneditButtonid = 0;
							}
						}
						break;
					default:
						break;
	        	}
			},
			plKeyHandler:function(e){
				console.log("Provincelist page "+ e.keyCode);
				switch(e.keyCode){
				 case 27:
				 case tvKey.KEY_RETURN://Return 
					 	this.hideProvincelist();
					 	if(CITY_SELECTED.length != 0){
						 	this.getWeatherInfo();
					 	}
					 	$("#addcity").addClass("_focus");
					 	if(CITY_SELECTED.length == 8){
							this.uneditButtonid = 0;
							$("#addcity").removeClass("_focus");
							$(".addcity").hide();
							$(".cityEdit").addClass("_efocus");
						}
					 	setObjKeyhandler("cityManage");
						break;
					case tvKey.KEY_EXIT://Exit
						tizen.application.getCurrentApplication().exit(); 
						break;
					case tvKey.KEY_UP://up
						if(CITY_LIST.length<=9){
							if(this.provinceId.listPos == 0){}
							else{
								$($(".cityListLevel1 .cityfocus")[this.provinceId.listPos]).removeClass("afocus");
								this.provinceId.listPos--;
								this.provinceId.realPos--;
								$($(".cityListLevel1 .cityfocus")[this.provinceId.listPos]).addClass("afocus");
							}
						}
						else{
							if(this.provinceId.listPos>0){
								$($(".cityListLevel1 .cityfocus")[this.provinceId.realPos]).removeClass("afocus");
								this.provinceId.listPos--;
								this.provinceId.realPos--;
								$($(".cityListLevel1 .cityfocus")[this.provinceId.realPos]).addClass("afocus");
							}
							else if(this.provinceId.listPos==0 && this.provinceId.realPos>0 ){
								$($(".cityListLevel1 .cityfocus")[this.provinceId.realPos]).removeClass("afocus");
								this.provinceId.realPos--;
								$($(".cityListLevel1 li")[this.provinceId.realPos]).show();
								$($(".cityListLevel1 .cityfocus")[this.provinceId.realPos]).addClass("afocus");
							}
						}
				    	break;
					case tvKey.KEY_DOWN://down
						var maxlength = CITY_LIST.length;
						if(maxlength<=9){
							if(this.provinceId.listPos == (maxlength-1)){}
							else{
								$($(".cityListLevel1 .cityfocus")[this.provinceId.listPos]).removeClass("afocus");
								this.provinceId.realPos++;
								this.provinceId.listPos++;
								$($(".cityListLevel1 .cityfocus")[this.provinceId.listPos]).addClass("afocus");
							}
						}
						else{
							if(this.provinceId.listPos == 8 && (this.provinceId.realPos < (maxlength-1))){
								$($(".cityListLevel1 .cityfocus")[this.provinceId.realPos]).removeClass("afocus");
								$($(".cityListLevel1 li")[this.provinceId.realPos-8]).hide();
								this.provinceId.realPos++;
								$($(".cityListLevel1 .cityfocus")[this.provinceId.realPos]).addClass("afocus");
							}
							else if(this.provinceId.listPos < 8){
								$($(".cityListLevel1 .cityfocus")[this.provinceId.realPos]).removeClass("afocus");
								this.provinceId.realPos++;
								this.provinceId.listPos++;
								$($(".cityListLevel1 .cityfocus")[this.provinceId.realPos]).addClass("afocus");
							}
						}
						break;
					case tvKey.KEY_ENTER://Enter
						this.getCitylist(CITY_LIST[this.provinceId.realPos].url);
						break;
					default:
						break;
	        	}
			},
			clKeyHandler:function(e){
				console.log("cityList2 page "+ e.keyCode);
				switch(e.keyCode){
				 case 27: //ESC
				 case 49:
				 case tvKey.KEY_RETURN://Return
					 	this.hideCitylist();
					 	setObjKeyhandler("Provincelist");
						break;
					case tvKey.KEY_EXIT://Exit
						tizen.application.getCurrentApplication().exit(); 
						break;
					case tvKey.KEY_UP://up
						if(CITY_LIST[this.provinceId.realPos].regions.length<=9){
							if(this.cityId.listPos == 0){}
							else{
								$($(".cityListLevel2 .cityfocus")[this.cityId.listPos]).removeClass("afocus");
								this.cityId.listPos--;
								this.cityId.realPos--;
								$($(".cityListLevel2 .cityfocus")[this.cityId.listPos]).addClass("afocus");
							}
						}
						else{
							if(this.cityId.listPos>0){
								$($(".cityListLevel2 .cityfocus")[this.cityId.realPos]).removeClass("afocus");
								this.cityId.listPos--;
								this.cityId.realPos--;
								$($(".cityListLevel2 .cityfocus")[this.cityId.realPos]).addClass("afocus");
							}
							else if(this.cityId.listPos==0 && this.cityId.realPos>0 ){
								$($(".cityListLevel2 .cityfocus")[this.cityId.realPos]).removeClass("afocus");
								this.cityId.realPos--;
								$($(".cityListLevel2 li")[this.cityId.realPos]).show();
								$($(".cityListLevel2 .cityfocus")[this.cityId.realPos]).addClass("afocus");
							}
						}
						
				    	break;
					case tvKey.KEY_DOWN://down
						var maxlength = CITY_LIST[this.provinceId.realPos].regions.length;
						if(maxlength<=9){
							if(this.cityId.listPos == (maxlength-1)){}
							else{
								$($(".cityListLevel2 .cityfocus")[this.cityId.listPos]).removeClass("afocus");
								this.cityId.realPos++;
								this.cityId.listPos++;
								$($(".cityListLevel2 .cityfocus")[this.cityId.listPos]).addClass("afocus");
							}
						}
						else{
							if(this.cityId.listPos == 8 && (this.cityId.realPos < (maxlength-1))){
								$($(".cityListLevel2 .cityfocus")[this.cityId.realPos]).removeClass("afocus");
								$($(".cityListLevel2 li")[this.cityId.realPos-8]).hide();
								this.cityId.realPos++;
								$($(".cityListLevel2 .cityfocus")[this.cityId.realPos]).addClass("afocus");
							}
							else if(this.cityId.listPos < 8){
								$($(".cityListLevel2 .cityfocus")[this.cityId.realPos]).removeClass("afocus");
								this.cityId.realPos++;
								this.cityId.listPos++;
								$($(".cityListLevel2 .cityfocus")[this.cityId.realPos]).addClass("afocus");
							}
						}
						break;
					case tvKey.KEY_ENTER://Enter
						var cityname = CITY_LIST[this.provinceId.realPos].regions[this.cityId.realPos];
						if(checkIfPrefCity(cityname)){
							$($(".cityListLevel2 .selecticon")[this.cityId.realPos]).removeClass("selectedfocus");
							delPrefCity(cityname);
						}
						else{
							if(CITY_SELECTED.length == 8){
								popup.init(1, "最多可添加8个城市哦！", ["知道了"]);
							}
							else{
								$($(".cityListLevel2 .selecticon")[this.cityId.realPos]).addClass("selectedfocus");
								var cityinfo = new CityToday(cityname, 0, 0, 0, 0);
								CITY_SELECTED.push(cityinfo);
							}
						}
						break;
					default:
						break;
	        	}
			}
	}
	return new cityManagePlugin();
})();