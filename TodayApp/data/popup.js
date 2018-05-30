var popup = (function(){
	var popupPlugin = function(){
		this.buttonNum = 1;    //1：一个按键   2：两个按键
		this.buttonPos = 0;    //主要用于两个按键时使用
		this.preKeyhandlerObj = null;   //用于popup关闭，返回keyhandler使用
		this.callback = null;
		
	}
	popupPlugin.prototype = {
			init:function(bNum,mes,bName,callback){    //bName is Array  example bName = ["取消","删除"];
				this.preKeyhandlerObj = keyhandlerobj;
				console.log("init ="+this.preKeyhandlerObj);
				this.buttonNum = bNum;
				this.callback = callback;
				this.show();
				this.create(mes, bName);
				setObjKeyhandler("popup");
			},
			show:function(){
				$("#popup").show();
			},
			hide:function(){
				$("#popup").hide();
				setObjKeyhandler(this.preKeyhandlerObj);
				console.log("reset ="+this.preKeyhandlerObj);
				if(this.buttonNum == 2){
					if(this.buttonPos == 1){
						this.callback(true);
					}
				}
				else{
					if(this.callback){
						console.log("callback is true");
						this.callback();
					};
				}
				this.reset();
			},
			reset:function(){
				console.log("popup reset");
				this.buttonPos = 0;
				this.buttonNum = 1;
				//this.preKeyhandlerObj = null;
				//this.callback = null;
			},
			create:function(mes,bName){
				$("#popupMessage").html(mes);
				var html="";
				for(var i=0;i<bName.length;i++){
					html +='<li class="popupb">'+bName[i]+'</li>';
				}
				$("#popupButton").html(html);
				if(this.buttonNum == 1){
					$(".popupb").addClass("onlyOneButton");
				}
				else{
					$($(".popupButton > li")[1]).addClass("popupBblur");
				}
			},
			keyhandler:function(e){
				console.log("popupPlugin page "+ e.keyCode);
				switch(e.keyCode){
				 	case tvKey.KEY_RETURN://Return
				 		if(this.buttonNum == 2){
				 			this.buttonPos = 0;
						}
				 		this.hide();
						break;
					case tvKey.KEY_EXIT://Exit
						tizen.application.getCurrentApplication().exit(); 
						break;
					case tvKey.KEY_UP://up
				    	break;
					case tvKey.KEY_DOWN://down
						break;
					case tvKey.KEY_LEFT://left
						if(this.buttonNum == 2){
							this.buttonPos = 0;
							$($(".popupButton > li")[0]).removeClass("popupBblur");
							$($(".popupButton > li")[1]).addClass("popupBblur");
						}
				    	break;
					case tvKey.KEY_RIGHT://right
						if(this.buttonNum == 2){
							this.buttonPos = 1;
							$($(".popupButton > li")[1]).removeClass("popupBblur");
							$($(".popupButton > li")[0]).addClass("popupBblur");
						}
						break;
					case tvKey.KEY_ENTER://Enter
						this.hide();
						break;
					default:
						break;
	        	}
			
			}
	}
	
	return new popupPlugin();
})()