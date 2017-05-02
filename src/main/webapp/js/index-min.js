var $jscomp=$jscomp||{};$jscomp.scope={};$jscomp.getGlobal=function(a){return"undefined"!=typeof window&&window===a?a:"undefined"!=typeof global&&null!=global?global:a};$jscomp.global=$jscomp.getGlobal(this);$jscomp.inherits=function(a,b){function c(){}c.prototype=b.prototype;a.superClass_=b.prototype;a.prototype=new c;a.prototype.constructor=a;for(var d in b)if(Object.defineProperties){var e=Object.getOwnPropertyDescriptor(b,d);e&&Object.defineProperty(a,d,e)}else a[d]=b[d]};
$jscomp.defineProperty="function"==typeof Object.defineProperties?Object.defineProperty:function(a,b,c){a!=Array.prototype&&a!=Object.prototype&&(a[b]=c.value)};$jscomp.SYMBOL_PREFIX="jscomp_symbol_";$jscomp.initSymbol=function(){$jscomp.initSymbol=function(){};$jscomp.global.Symbol||($jscomp.global.Symbol=$jscomp.Symbol)};$jscomp.symbolCounter_=0;$jscomp.Symbol=function(a){return $jscomp.SYMBOL_PREFIX+(a||"")+$jscomp.symbolCounter_++};
$jscomp.initSymbolIterator=function(){$jscomp.initSymbol();var a=$jscomp.global.Symbol.iterator;a||(a=$jscomp.global.Symbol.iterator=$jscomp.global.Symbol("iterator"));"function"!=typeof Array.prototype[a]&&$jscomp.defineProperty(Array.prototype,a,{configurable:!0,writable:!0,value:function(){return $jscomp.arrayIterator(this)}});$jscomp.initSymbolIterator=function(){}};$jscomp.arrayIterator=function(a){var b=0;return $jscomp.iteratorPrototype(function(){return b<a.length?{done:!1,value:a[b++]}:{done:!0}})};
$jscomp.iteratorPrototype=function(a){$jscomp.initSymbolIterator();a={next:a};a[$jscomp.global.Symbol.iterator]=function(){return this};return a};$jscomp.iteratorFromArray=function(a,b){$jscomp.initSymbolIterator();a instanceof String&&(a+="");var c=0,d={next:function(){if(c<a.length){var e=c++;return{value:b(e,a[e]),done:!1}}d.next=function(){return{done:!0,value:void 0}};return d.next()}};d[Symbol.iterator]=function(){return d};return d};
$jscomp.polyfill=function(a,b,c,d){if(b){c=$jscomp.global;a=a.split(".");for(d=0;d<a.length-1;d++){var e=a[d];e in c||(c[e]={});c=c[e]}a=a[a.length-1];d=c[a];b=b(d);b!=d&&null!=b&&$jscomp.defineProperty(c,a,{configurable:!0,writable:!0,value:b})}};$jscomp.polyfill("Array.prototype.keys",function(a){return a?a:function(){return $jscomp.iteratorFromArray(this,function(a){return a})}},"es6-impl","es3");
var People=function(a){a=void 0===a?null:a;this.id=null==a?UUID.toString():a;this.dob=this.gender=this.description=this.name="";this.mother=null;this.partnerList=[];this.childrenMap={}};People.prototype.listOccupancy=function(a){this.partnerList.forEach(function(a){});return{left:1,right:1}};People.prototype.addParents=function(a,b){a.gender="m";b.gender="f";b.addPartner(a);b.addChild(a,this);this.mother=b};
People.prototype.addPartner=function(a){a.gender||(a.gender=this.isMale?"f":"m");this.partnerList.push(a);a.partnerList.push(this)};People.prototype.addChild=function(a,b){a=a.id;var c=this.childrenMap[a];c||(c=[],this.childrenMap[a]=c);b.mother=this;c.push(b)};People.prototype.listChildren=function(a){var b=[];a=this.childrenMap[a.id];if(!a)return b;a.forEach(function(a){var c=a.partnerList;a.isMale?(b.push(a),b=b.concat(c)):(b=b.concat(c),b.push(a))});return b};
$jscomp.global.Object.defineProperties(People.prototype,{isMale:{configurable:!0,enumerable:!0,get:function(){return"m"==this.gender}},father:{configurable:!0,enumerable:!0,get:function(){}},numOfPartner:{configurable:!0,enumerable:!0,get:function(){return this.partnerList.length}}});var Actor=function(){this.y=this.x=0};Actor.prototype.isHit=function(a,b){return!1};Actor.prototype.react=function(){return[]};Actor.prototype.draw=function(a){};
var Chain=function(a){a=void 0===a?null:a;Actor.call(this);this.id=null==a?UUID.toString():a;this.gender="";this.mother=null;this.partnerList=[];this.childrenMap={}};$jscomp.inherits(Chain,Actor);Chain.prototype.listOccupancy=function(a){this.partnerList.forEach(function(a){});return{left:1,right:1}};Chain.prototype.addParents=function(a,b){a.gender="m";b.gender="f";b.addPartner(a);b.addChild(a,this);this.mother=b};
Chain.prototype.addPartner=function(a){a.gender||(a.gender=this.isMale?"f":"m");this.partnerList.push(a);a.partnerList.push(this)};Chain.prototype.addChild=function(a,b){a=a.id;var c=this.childrenMap[a];c||(c=[],this.childrenMap[a]=c);b.mother=this;c.push(b)};Chain.prototype.listChildren=function(a){var b=[];a=this.childrenMap[a.id];if(!a)return b;a.forEach(function(a){var c=a.partnerList;a.isMale?(b.push(a),b=b.concat(c)):(b=b.concat(c),b.push(a))});return b};
$jscomp.global.Object.defineProperties(Chain.prototype,{isMale:{configurable:!0,enumerable:!0,get:function(){return"m"==this.gender}},father:{configurable:!0,enumerable:!0,get:function(){}},numOfPartner:{configurable:!0,enumerable:!0,get:function(){return this.partnerList.length}}});var EnclosingLine=function(){Actor.call(this);this.y=this.x=100;this.radius=10;this.points=[];this.addPoint(200,100);this.addPoint(200,200);this.addPoint(100,200)};$jscomp.inherits(EnclosingLine,Actor);
EnclosingLine.prototype.addPoint=function(a,b){this.points.push({x:a,y:b})};EnclosingLine.prototype.isHit=function(a,b){};EnclosingLine.prototype.draw=function(a){a.save();a.beginPath();a.moveTo(this.x,this.y);this.points.forEach(function(b){a.lineTo(b.x,b.y)});a.lineTo(this.x,this.y);a.strokeStyle="green";a.stroke();a.restore()};
var Field=function(a,b){this.width=a;this.height=b;this.view=new FlexibleView(a,b);this.ty=this.tx=0;this.spacing=128;this.focus=null;this.actorList=[];this.dirty=!1;Field.Instance=this};Field.prototype.setFocus=function(a){this.focus=a;this.dirty=!0};Field.prototype.addActor=function(a){for(var b=[],c=0;c<arguments.length;++c)b[c-0]=arguments[c];var d=this;b.forEach(function(a){d.actorList.push(a)});this.dirty=!0};
Field.prototype.scan=function(a,b){var c=this,d=this.view.scale,e=a/d-this.tx,f=b/d-this.ty;this.target=null;this.actorList.forEach(function(a){if(a=a.isHit(e,f))c.target=a})};
Field.prototype.arrange=function(){if(this.dirty){console.log("dirty.");this.dirty=!1;var a=0,b=0,c=0,d=0,e=[];this.focus.x=0;this.focus.y=0;this.focus.scanAll(e);console.log("list:"+e.length);Tally.reset();this.focus.calculate();e.forEach(function(a){e.forEach(function(b){a!=b&&a.touch(b)})});e.forEach(function(e){var f=e.x;e=e.y;a=Math.min(a,f);b=Math.min(b,e);c=Math.max(c,f);d=Math.max(d,e)});var f=(this.height-(d-b))/2;this.tx=(this.width-(c-a))/2-a;this.ty=f-b}};
Field.prototype.draw=function(){var a=this.view.ctx;this.view.clear();this.actorList.sort(function(a,c){return a.z-c.z});a.save();a.font="16px 'Times New Roman'";a.translate(this.tx,this.ty);this.actorList.forEach(function(b){b.draw(a)});a.restore()};var FlexibleView=function(a,b){this.canvas=document.getElementById("canvas");this.ctx=this.canvas.getContext("2d");this.view=document.getElementById("view");this.scale=1;this.init();this.setSize(a,b)};
FlexibleView.prototype.setSize=function(a,b){this.width=a;this.height=b;this.canvas.width=a;this.canvas.height=b;this.resize()};FlexibleView.prototype.init=function(){var a=this,b=document.querySelector('[data-role="header"]'),c=document.querySelector('[data-role="footer"]');this.margin=(b?b.offsetHeight:0)+(c?c.offsetHeight:0);window.addEventListener("resize",function(){a.resize()})};
FlexibleView.prototype.resize=function(){var a=document.body.clientWidth/this.width,b=(window.innerHeight-this.margin)/this.height;this.scale=b<a?b:a;this.view.setAttribute("style","transform: scale("+this.scale+");")};FlexibleView.prototype.clear=function(){this.ctx.clearRect(0,0,this.width,this.height)};var InputPanel=function(){this.panel=document.getElementById("inputPanel");this.person=null;this.setupEvents()};
InputPanel.prototype.setupEvents=function(){var a=this,b=this.panel.querySelector('[name="name"]'),c=$('[name="gender"]'),d=document.getElementById("parentsButton"),e=document.getElementById("partnerButton");b.addEventListener("change",function(){a.person.name=b.value});c.click(function(b){a.person.gender=b.target.value;a.refreshControls()});d.addEventListener("click",function(){var b=new Person,c=new Person;a.person.addParents(b,c);a.refreshControls();Field.Instance.addActor(b,c)});e.addEventListener("click",
function(){var b=new Person;a.person.addPartner(b);a.refreshControls();Field.Instance.addActor(b)});$(this.panel).panel({close:function(){Field.Instance.scan(Number.MAX_VALUE,Number.MAX_VALUE)}});$(e).addClass("ui-state-disabled")};
InputPanel.prototype.refreshControls=function(){var a=this.person.mother,b=this.person.gender,c=this.person.partnerList.length,d=Object.keys(this.person.childrenMap).length,e=document.getElementById("parentsButton"),f=document.getElementById("partnerButton"),g=document.getElementById("deleteButton");0==c?$('[name="gender"]').checkboxradio("enable"):$('[name="gender"]').checkboxradio("disable");a?$(e).addClass("ui-state-disabled"):$(e).removeClass("ui-state-disabled");null==b||""==b?$(f).addClass("ui-state-disabled"):
$(f).removeClass("ui-state-disabled");0==c&&0==d?$(g).removeClass("ui-state-disabled"):$(g).addClass("ui-state-disabled");Field.Instance.dirty=!0};InputPanel.prototype.setupForm=function(){var a=this;$("#inputPanel form :input").each(function(b,c){b=c.getAttribute("name");var d=c.getAttribute("type"),e=a.person[b];"radio"==d?$(c).val([e]).checkboxradio("refresh"):(console.log(b+":"+e),$(c).val(e))});this.refreshControls()};InputPanel.prototype.open=function(a){this.person=a;this.setupForm();$(this.panel).panel("open")};
var Person=function(a){Chain.call(this,void 0===a?null:a);this.dob=this.description=this.name="";this.radius=32;this.principal=!1};$jscomp.inherits(Person,Chain);Person.prototype.scanAll=function(a,b){b=void 0===b?0:b;var c=this;-1===a.indexOf(this)&&(this.depth=b,this.touched=this.fixed=!1,a.push(this),this.mother&&this.mother.scanAll(a,b-1),this.partnerList.forEach(function(d){var e=c.listChildren(d);d.scanAll(a,b);e.forEach(function(c){c.scanAll(a,b+1)})}))};
Person.prototype.calculate=function(){var a=this;if(!this.fixed){var b=Field.Instance.spacing,c=b/2;this.mother&&!this.mother.fixed?(this.mother.x=this.x+c,this.mother.y=this.y-b,this.mother.calculate()):(this.count=Tally.increment(),this.fixed=!0,this.partnerList.forEach(function(d){var e=a.listChildren(d),f=a.x-c-b*(e.length-1)/2;console.log("#"+a.count+" childrenList:"+e.length);d.fixed||(d.x=a.x+b*("m"==d.gender?-1:1),d.y=a.y,console.log("partner#"+d.count+":"+d.x),d.calculate());e.forEach(function(c){console.log("child#"+
c.count+" cx:"+f);c.x=f;c.y=a.y+b;c.calculate();f+=b})}))}};Person.prototype.touch=function(a){var b=this.x-a.x;a=this.y-a.y;Math.sqrt(b*b+a*a)<Field.Instance.spacing&&(this.touched=!0);return this.touched};
Person.prototype.isHit=function(a,b){var c=this,d=this.x-a,e=this.y-b;this.hit=null;if(this.isMale){if(Math.abs(d)<this.radius&&Math.abs(e)<this.radius)return this.hit=this}else if(Math.sqrt(d*d+e*e)<this.radius)return this.hit=this;if(this.isMale||0==this.numOfPartner)return null;this.partnerList.forEach(function(d){d=new Relation(d,c);d.isHit(a,b)&&(c.hit=d)});return this.hit};
Person.prototype.drawSymbol=function(a){var b=.8*this.radius;a.lineWidth=this.hit==this?5:2;a.strokeStyle=this.strokeStyle;this.touched&&(a.strokeStyle="red");if("m"==this.gender){var c=2*this.radius;a.strokeRect(-this.radius,-this.radius,c,c);this.principal&&(c=2*b,a.strokeRect(-b,-b,c,c))}else a.beginPath(),a.arc(0,0,this.radius,0,2*Math.PI,!1),a.stroke(),this.principal&&(a.beginPath(),a.arc(0,0,b,0,2*Math.PI,!1),a.stroke())};
Person.prototype.drawName=function(a){var b=this.name,c=-a.measureText(b).width/2,d=20+this.radius;a.lineWidth=1;a.beginPath();a.strokeStyle="black";a.strokeText(b,c,d)};Person.prototype.drawPartnerLine=function(a){var b=this;this.isMale&&this.partnerList.forEach(function(c,d){(new Relation(b,c)).draw(a)})};
Person.prototype.drawChildLine=function(a){var b=this;if(0!=Object.keys(this.childrenMap).length){var c=Field.Instance.spacing/2,d=this.y+c;var e=this.x-c;c=this.y;a.beginPath();a.moveTo(e,c);a.lineTo(e,d);a.stroke();var f=!0,g=null;Object.keys(this.childrenMap).forEach(function(c){b.childrenMap[c].forEach(function(c){var h=c.x,k=c.y-b.radius;a.beginPath();f&&(a.moveTo(e,d),a.lineTo(h,d),f=!1);a.moveTo(h,d);a.lineTo(h,k);a.stroke();g=c})});a.beginPath();a.moveTo(e,d);a.lineTo(g.x,d);a.stroke()}};
Person.prototype.drawLine=function(a){this.drawPartnerLine(a);this.drawChildLine(a)};Person.prototype.draw=function(a){this.strokeStyle=this.hit==this?"aqua":"black";a.save();this.hit instanceof Relation&&this.hit.drawHighlight(a);this.drawLine(a);a.translate(this.x,this.y);this.drawSymbol(a);this.drawName(a);a.restore()};var Relation=function(a,b){a.isMale?(this.father=a,this.mother=b):(this.father=b,this.mother=a)};
Relation.prototype.isHit=function(a,b){var c=this.rect,d=c.left+c.width;return c.left<a&&a<d&&(a=c.top+c.height,c.top<b&&b<a)?!0:!1};Relation.prototype.draw=function(a,b){b=this.rect;a.strokeRect(b.left,b.top,b.width,b.height)};Relation.prototype.drawHighlight=function(a){a.save();a.strokeStyle="aqua";a.lineWidth=5;this.draw(a);a.restore()};
$jscomp.global.Object.defineProperties(Relation.prototype,{rect:{configurable:!0,enumerable:!0,get:function(){var a=this.father,b=a.radius,c=b/5;return{top:a.y-c/2,left:Math.min(a.x,this.mother.x)+b,width:Math.abs(a.x-this.mother.x)-2*b,height:c}}}});var RelationPanel=function(){this.panel=document.getElementById("relationPanel");this.relation=null;this.setupEvents()};
RelationPanel.prototype.setupEvents=function(){var a=this;document.getElementById("childButton").addEventListener("click",function(){var b=new Person;a.relation.mother.addChild(a.relation.father,b);Field.Instance.addActor(b)})};RelationPanel.prototype.setupForm=function(){var a=this.panel.querySelector('[name="father"]'),b=this.panel.querySelector('[name="mother"]');a.value=this.relation.father.name;b.value=this.relation.mother.name};
RelationPanel.prototype.open=function(a){this.relation=a;this.setupForm();$(this.panel).panel("open")};var Tally=function(){};Tally.reset=function(){Tally.val=0};Tally.increment=function(){return++Tally.val};Tally.val=0;var UUID=function(){};UUID.toString=function(){return UUID.Format.replace(/X|Y/g,function(a){var b=16*Math.random()|0;return("X"===a?b:b&3|8).toString(16)})};UUID.Format="XXXXXXXX-XXXX-4XXX-YXXX-XXXXXXXXXXXX";document.addEventListener("DOMContentLoaded",function(){new AppMain});
var AppMain=function(){console.log("AppMain")};
