var $jscomp=$jscomp||{};$jscomp.scope={};$jscomp.getGlobal=function(a){return"undefined"!=typeof window&&window===a?a:"undefined"!=typeof global&&null!=global?global:a};$jscomp.global=$jscomp.getGlobal(this);$jscomp.inherits=function(a,b){function c(){}c.prototype=b.prototype;a.superClass_=b.prototype;a.prototype=new c;a.prototype.constructor=a;for(var d in b)if(Object.defineProperties){var e=Object.getOwnPropertyDescriptor(b,d);e&&Object.defineProperty(a,d,e)}else a[d]=b[d]};
$jscomp.defineProperty="function"==typeof Object.defineProperties?Object.defineProperty:function(a,b,c){a!=Array.prototype&&a!=Object.prototype&&(a[b]=c.value)};$jscomp.polyfill=function(a,b,c,d){if(b){c=$jscomp.global;a=a.split(".");for(d=0;d<a.length-1;d++){var e=a[d];e in c||(c[e]={});c=c[e]}a=a[a.length-1];d=c[a];b=b(d);b!=d&&null!=b&&$jscomp.defineProperty(c,a,{configurable:!0,writable:!0,value:b})}};
$jscomp.polyfill("Object.is",function(a){return a?a:function(a,c){return a===c?0!==a||1/a===1/c:a!==a&&c!==c}},"es6-impl","es3");$jscomp.polyfill("Array.prototype.includes",function(a){return a?a:function(a,c){var b=this;b instanceof String&&(b=String(b));var e=b.length;for(c=c||0;c<e;c++)if(b[c]==a||Object.is(b[c],a))return!0;return!1}},"es7","es3");
$jscomp.checkStringArgs=function(a,b,c){if(null==a)throw new TypeError("The 'this' value for String.prototype."+c+" must not be null or undefined");if(b instanceof RegExp)throw new TypeError("First argument to String.prototype."+c+" must not be a regular expression");return a+""};$jscomp.polyfill("String.prototype.includes",function(a){return a?a:function(a,c){return-1!==$jscomp.checkStringArgs(this,a,"includes").indexOf(a,c||0)}},"es6-impl","es3");
$jscomp.polyfill("Array.prototype.fill",function(a){return a?a:function(a,c,d){var b=this.length||0;0>c&&(c=Math.max(0,b+c));if(null==d||d>b)d=b;d=Number(d);0>d&&(d=Math.max(0,b+d));for(c=Number(c||0);c<d;c++)this[c]=a;return this}},"es6-impl","es3");$jscomp.SYMBOL_PREFIX="jscomp_symbol_";$jscomp.initSymbol=function(){$jscomp.initSymbol=function(){};$jscomp.global.Symbol||($jscomp.global.Symbol=$jscomp.Symbol)};$jscomp.symbolCounter_=0;
$jscomp.Symbol=function(a){return $jscomp.SYMBOL_PREFIX+(a||"")+$jscomp.symbolCounter_++};$jscomp.initSymbolIterator=function(){$jscomp.initSymbol();var a=$jscomp.global.Symbol.iterator;a||(a=$jscomp.global.Symbol.iterator=$jscomp.global.Symbol("iterator"));"function"!=typeof Array.prototype[a]&&$jscomp.defineProperty(Array.prototype,a,{configurable:!0,writable:!0,value:function(){return $jscomp.arrayIterator(this)}});$jscomp.initSymbolIterator=function(){}};
$jscomp.arrayIterator=function(a){var b=0;return $jscomp.iteratorPrototype(function(){return b<a.length?{done:!1,value:a[b++]}:{done:!0}})};$jscomp.iteratorPrototype=function(a){$jscomp.initSymbolIterator();a={next:a};a[$jscomp.global.Symbol.iterator]=function(){return this};return a};
$jscomp.iteratorFromArray=function(a,b){$jscomp.initSymbolIterator();a instanceof String&&(a+="");var c=0,d={next:function(){if(c<a.length){var e=c++;return{value:b(e,a[e]),done:!1}}d.next=function(){return{done:!0,value:void 0}};return d.next()}};d[Symbol.iterator]=function(){return d};return d};$jscomp.polyfill("Array.prototype.keys",function(a){return a?a:function(){return $jscomp.iteratorFromArray(this,function(a){return a})}},"es6-impl","es3");
$jscomp.polyfill("Number.isFinite",function(a){return a?a:function(a){return"number"!==typeof a?!1:!isNaN(a)&&Infinity!==a&&-Infinity!==a}},"es6-impl","es3");var Actor=function(a,b){this.x=void 0===a?0:a;this.y=void 0===b?0:b;this.radius=this.z=0;this.spawnList=[]};Actor.prototype.getDistance=function(a){var b=this.x-a.x;a=this.y-a.y;return Math.sqrt(b*b+a*a)};Actor.prototype.getRadian=function(a){return Math.atan2(this.y-a.y,this.x-a.x)};
Actor.prototype.getMidpoint=function(a){return new Actor((this.x+a.x)/2,(this.y+a.y)/2)};Actor.prototype.getInterimPoint=function(a,b,c){var d=this.x-a.x;a=this.y-a.y;b=Math.sqrt(d*d+a*a)*(void 0===b?1:b)/(void 0===c?1:c);d=Math.atan2(a,d);return new Actor(this.x-Math.cos(d)*b,this.y-Math.sin(d)*b)};Actor.prototype.includes=function(a,b,c){a=this.x-a;b=this.y-b;return Math.sqrt(a*a+b*b)<((void 0===c?0:c)|this.radius)};Actor.prototype.isHit=function(a,b){return this.includes(a,b)};
Actor.prototype.eject=function(){this.isGone=!0};Actor.prototype.react=function(){return[]};Actor.prototype.draw=function(a){};$jscomp.global.Object.defineProperties(Actor.prototype,{spawn:{configurable:!0,enumerable:!0,get:function(){var a=this.spawnList;this.spawnList=[];return a}}});var ActorHandle=function(a,b){Actor.call(this,a,b);this.radius=4;this.logicalRadius=2*this.radius;this.prev=this;this.next=this};$jscomp.inherits(ActorHandle,Actor);
ActorHandle.prototype.add=function(a){var b=this.next;this.next=a;a.prev=this;a.next=b;b.prev=a};ActorHandle.prototype.isHit=function(a,b){return this.hit=this.includes(a,b,this.logicalRadius)};
ActorHandle.prototype.isLineHit=function(a,b){if(this.includes(a,b,this.logicalRadius))return!1;for(var c=!1,d=this.nextCp,e=this.next.prevCp,f=this.getDistance(this.next)/this.radius,g=0;g<f;g++){var l=this.getInterimPoint(d,g,f),h=e.getInterimPoint(this.next,g,f),k=d.getInterimPoint(e,g,f),l=l.getInterimPoint(k,g,f),h=k.getInterimPoint(h,g,f),k=l.getInterimPoint(h,g,f),h=k.x-a,k=k.y-b;Math.sqrt(h*h+k*k)<this.radius&&(c=!0)}return c};
ActorHandle.prototype.draw=function(a){this.parent.selected&&(a.save(),a.beginPath(),a.fillStyle=this.hit?"aqua":"gray",a.arc(this.x,this.y,this.radius,0,2*Math.PI,!1),a.fill(),a.restore())};ActorHandle.prototype.drawGuide=function(a){var b=this.prevCp,c=this.nextCp;a.save();a.lineWidth=1;a.strokeStyle="cyan";a.beginPath();a.moveTo(this.x,this.y);a.lineTo(b.x,b.y);a.stroke();a.strokeStyle="lime";a.beginPath();a.moveTo(this.x,this.y);a.lineTo(c.x,c.y);a.stroke();a.restore()};
ActorHandle.prototype.drawSelfCurve=function(a){var b=this.nextCp,c=this.next.prevCp,d=this.getDistance(this.next)/this.radius;a.save();for(var e=0;e<d;e++){var f=this.getInterimPoint(b,e,d),g=c.getInterimPoint(this.next,e,d),l=b.getInterimPoint(c,e,d),f=f.getInterimPoint(l,e,d),g=l.getInterimPoint(g,e,d),g=f.getInterimPoint(g,e,d);a.strokeStyle="pink";a.beginPath();a.arc(g.x,g.y,this.radius,0,2*Math.PI,!1);a.stroke()}a.restore()};
ActorHandle.prototype.drawCurve=function(a){var b=this.nextCp,c=this.next.prevCp;a.beginPath();a.moveTo(this.x,this.y);a.bezierCurveTo(b.x,b.y,c.x,c.y,this.next.x,this.next.y);a.stroke()};
$jscomp.global.Object.defineProperties(ActorHandle.prototype,{list:{configurable:!0,enumerable:!0,get:function(){for(var a=[],b=this.next;b!=this;)a.push(b),b=b.next;return a}},listAll:{configurable:!0,enumerable:!0,get:function(){for(var a=[],b=this.next;;){a.push(b);if(b==this)break;b=b.next}return a}},radian:{configurable:!0,enumerable:!0,get:function(){var a=this.prev,b=this.next;return Math.atan2(b.y-a.y,b.x-a.x)}},prevCp:{configurable:!0,enumerable:!0,get:function(){var a=this.radian,b=.2*this.getDistance(this.prev);
return new Actor(this.x-Math.cos(a)*b,this.y-Math.sin(a)*b)}},nextCp:{configurable:!0,enumerable:!0,get:function(){var a=this.radian,b=.2*this.getDistance(this.next);return new Actor(this.x+Math.cos(a)*b,this.y+Math.sin(a)*b)}}});var Chain=function(a,b){a=void 0===a?null:a;Actor.call(this);this.id=null==a?UUID.toString():a;this.gender=b;this.parents=null;this.relationList=[];this.partnerOrder=0};$jscomp.inherits(Chain,Actor);Chain.prototype.attributeChanged=function(){};
Chain.prototype.listOccupancy=function(a){this.relationList.forEach(function(a){});return{left:1,right:1}};Chain.prototype.addParents=function(a){a.mother.addPartner(a);a.addChild(this);this.parents=a};Chain.prototype.addPartner=function(a){if(-1!=this.relationList.indexOf(a))return this.relationList.length;var b=this.relationList.push(a),c=a.getPartner(this);c.partnerOrder=b;c.addPartner(a);return b};Chain.prototype.remove=function(){this.parents&&this.parents.removeChild(this);this.eject()};
$jscomp.global.Object.defineProperties(Chain.prototype,{gender:{configurable:!0,enumerable:!0,get:function(){return this._gender},set:function(a){this._gender=a;this.attributeChanged()}},isMale:{configurable:!0,enumerable:!0,get:function(){return"m"==this.gender}},mother:{configurable:!0,enumerable:!0,get:function(){return this.parents?this.parents.mother:null}},father:{configurable:!0,enumerable:!0,get:function(){return this.parents?this.parents.father:null}},numOfPartner:{configurable:!0,enumerable:!0,
get:function(){return this.relationList.length}},partnerList:{configurable:!0,enumerable:!0,get:function(){var a=this,b=[];this.relationList.forEach(function(c){b.push(c.getPartner(a))});return b}},hasChild:{configurable:!0,enumerable:!0,get:function(){var a=!1;this.relationList.forEach(function(b){0<b.children.length&&(a=!0)});return a}}});var Controller=function(a){this.keys={};this.point={};this.touch=!1;this.init(void 0===a?!1:a);Controller.Instance=this};
Controller.prototype.init=function(a){a||window.addEventListener("contextmenu",function(a){a.preventDefault()});this.initKeys();this.initPointingDevice()};Controller.prototype.initKeys=function(){var a=this;window.addEventListener("keydown",function(b){b.key?a.keys[b.key]=!0:a.keys["k"+b.keyCode]=!0});window.addEventListener("keyup",function(b){b.key?delete a.keys[b.key]:delete a.keys["k"+b.keyCode]})};
Controller.prototype.initPointingDevice=function(){var a=this,b=document.getElementById("canvas"),c=function(){a.touch=!1;a.point=null};b.addEventListener("mousedown",function(b){a.touch=!0;a.point=FlexibleView.Instance.convert(b.clientX,b.clientY)});b.addEventListener("mousemove",function(b){a.touch&&(a.point=FlexibleView.Instance.convert(b.clientX,b.clientY))});b.addEventListener("mouseup",function(){return c()});b.addEventListener("mouseleave",function(){return c()});b.addEventListener("touchstart",
function(b){var c=b.touches[0];a.touch=!0;a.point=FlexibleView.Instance.convert(c.pageX,c.pageY);b.preventDefault()});b.addEventListener("touchmove",function(b){b=b.touches[0];a.touch=!0;a.point=FlexibleView.Instance.convert(b.pageX,b.pageY)});b.addEventListener("touchend",function(){return c()})};
var EnclosingLine=function(){ActorHandle.call(this,100,100);this.parent=this;this.addHandle(200,100);this.addHandle(200,200);this.addHandle(100,200);this.addHandle(50,150);this.addHandle(50,120);this.spawnList=this.list};$jscomp.inherits(EnclosingLine,ActorHandle);EnclosingLine.prototype.addHandle=function(a,b){a=new ActorHandle(a,b);a.parent=this;this.add(a)};
EnclosingLine.prototype.isHit=function(a,b){var c=this,d=ActorHandle.prototype.isHit.call(this,a,b);this.hit=d;this.lineHit=!1;this.listAll.forEach(function(d){d.isLineHit(a,b)&&(c.lineHit=!0)});return d|this.lineHit};EnclosingLine.prototype.drawLine=function(a){a.lineWidth=.5;a.strokeStyle="lightglay";a.beginPath();a.moveTo(this.x,this.y);this.listAll.forEach(function(b){a.lineTo(b.x,b.y)});a.stroke()};
EnclosingLine.prototype.drawAll=function(a){this.selected?(a.lineWidth=2,a.strokeStyle="navy"):this.lineHit?(a.lineWidth=2,a.strokeStyle="aqua"):a.lineWidth=1;this.listAll.forEach(function(b){b.drawCurve(a)})};EnclosingLine.prototype.draw=function(a){ActorHandle.prototype.draw.call(this,a);a.save();this.drawAll(a);a.restore()};
var Field=function(a,b){this.width=a;this.height=b;this.view=new FlexibleView(a,b);this.ty=this.tx=0;this.focus=null;this.targetList=[];this.actorList=[];this.dirty=!1;this.setupEvents();Field.Instance=this};Field.prototype.getRelationship=function(a,b){var c=null;this.actorList.forEach(function(d){!c&&d instanceof Relationship&&(d.person==a&&d.other==b||d.person==b&&d.other==a)&&(c=d)});return c};
Field.prototype.allowTarget=function(a){return a instanceof Person||a instanceof Relation||a instanceof Relationship||a instanceof EnclosingLine};
Field.prototype.setupEvents=function(){var a=this,b=this.view.view,c=Controller.Instance.keys;b.addEventListener("mousedown",function(b){b=a.view.convert(b.clientX,b.clientY);b=a.scan(b.x,b.y);c.Control||c.Shift||c.k16||c.k17||(a.targetList=[]);a.allowTarget(b)&&a.targetList.push(b);b instanceof ActorHandle&&(a.hold=b)});b.addEventListener("mouseup",function(b){a.dirty=!0;a.hold=null});b.addEventListener("mousemove",function(b){b=a.view.convert(b.clientX,b.clientY);if(a.hold){var c=b.y-a.ty;a.hold.x=
b.x-a.tx;a.hold.y=c}else a.scan(b.x,b.y)})};Field.prototype.setFocus=function(a){this.focus=a;this.dirty=!0};Field.prototype.addActor=function(a){for(var b=[],c=0;c<arguments.length;++c)b[c-0]=arguments[c];var d=this;b.forEach(function(a){d.actorList.push(a)});this.dirty=!0};Field.prototype.scan=function(a,b){var c=null,d=a-this.tx,e=b-this.ty;this.actorList.forEach(function(a){a.hit=!1;c||a.isHit(d,e)&&(c=a)});return c};
Field.prototype.clearSelection=function(){this.scan(Number.MAX_VALUE,Number.MAX_VALUE);this.targetList=[]};
Field.prototype.arrange=function(){if(this.dirty){this.dirty=!1;var a=0,b=0,c=0,d=0,e=[];this.focus.x=0;this.focus.y=0;this.focus.scanAll(e);console.log("list:"+e.length);Tally.reset();this.focus.calculate();e.forEach(function(a){e.forEach(function(b){a!=b&&a.touch(b)})});e.forEach(function(e){var f=e.x;e=e.y;a=Math.min(a,f);b=Math.min(b,e);c=Math.max(c,f);d=Math.max(d,e)});var f=(this.height-(d-b))/2;this.tx=(this.width-(c-a))/2-a;this.ty=f-b}};
Field.prototype.choiceActor=function(){var a=[];this.actorList.forEach(function(b){b.isGone||(a.push(b),b.spawn.forEach(function(b){a.push(b)}))});a.sort(function(a,c){return a.z-c.z});this.actorList.length!=a.length&&(this.actorList=a,this.dirty=!0)};
Field.prototype.drawGrid=function(a){if(this.showGrid){var b=this.width/2,c=this.height/2,d=this.spacing/2,e=-c,f=-b;a.save();a.lineWidth=.2;a.strokeStyle="aqua";a.translate(b,c);for(var g=0;g<b;g+=d)a.beginPath(),a.moveTo(g,e),a.lineTo(g,c),a.stroke(),0<g&&(a.beginPath(),a.moveTo(-g,e),a.lineTo(-g,c),a.stroke());for(e=0;e<c;e+=d)a.beginPath(),a.moveTo(f,e),a.lineTo(b,e),a.stroke(),0<e&&(a.beginPath(),a.moveTo(f,-e),a.lineTo(b,-e),a.stroke());a.restore()}};
Field.prototype.draw=function(){var a=this,b=this.view.ctx,c=this.fontSize;this.view.clear();this.choiceActor();this.drawGrid(b);b.save();b.font=c+"px 'Times New Roman'";b.textBaseline="middle";b.translate(this.tx,this.ty);this.actorList.forEach(function(d){d.fontSize=c;d.selected=-1!=a.targetList.indexOf(d);d.draw(b)});b.restore()};
$jscomp.global.Object.defineProperties(Field.prototype,{showGrid:{configurable:!0,enumerable:!0,get:function(){return document.querySelector('[name="grid"]').checked}},spacing:{configurable:!0,enumerable:!0,get:function(){var a=document.querySelector('[name="gridSpacing"]');(a=parseFloat(a.value))||(a=160);return a}},fontSize:{configurable:!0,enumerable:!0,get:function(){var a=document.querySelector('[name="fontSize"]');(a=parseFloat(a.value))||(a=12);return a}},lineStyle:{configurable:!0,enumerable:!0,
get:function(){return"gray"}}});var FlexibleView=function(a,b){this.view=document.getElementById("view");this.canvas=document.getElementById("canvas");this.ctx=this.canvas.getContext("2d");this.scale=1;this.init();this.setSize(a,b);FlexibleView.Instance=this};FlexibleView.prototype.setSize=function(a,b){this.width=a;this.height=b;this.canvas.width=a;this.canvas.height=b;this.resize()};
FlexibleView.prototype.init=function(){var a=this,b=document.querySelector('[data-role="header"]'),c=document.querySelector('[data-role="footer"]');this.headerHeight=b?b.offsetHeight:0;this.footerHeight=c?c.offsetHeight:0;this.margin=this.headerHeight+this.footerHeight;window.addEventListener("resize",function(){a.resize()});window.addEventListener("keydown",function(){view.classList.contains("addicting")||view.classList.add("addicting")});window.addEventListener("mousemove",function(){view.classList.remove("addicting")})};
FlexibleView.prototype.resize=function(){var a=document.body.clientWidth/this.width,b=(window.innerHeight-this.margin)/this.height;this.scale=b<a?b:a;this.view.setAttribute("style",["width:"+this.width+"px","height:"+this.height+"px","transform: scale("+this.scale+")"].join(";"))};FlexibleView.prototype.convert=function(a,b){return{x:a/this.scale,y:(b-this.headerHeight)/this.scale}};FlexibleView.prototype.clear=function(){this.ctx.clearRect(0,0,this.width,this.height)};
var GenoCalendar=function(a){this.day=this.month=this.year=null;a&&this.setupDate(new String(a))};GenoCalendar.prototype.setupDate=function(a){var b=a.split(/[-/]/g);a=(new Date).getFullYear()+1;var c=parseInt(b[0]);Number.isFinite(c)?c+1900<a&&(c+=1900):c=null;this.year=c;if(1<b.length){a=parseInt(b[1]);if(2<b.length)b=new Date(c,a-1,parseInt(b[2])),b.getFullYear(),a=b.getMonth()+1,this.day=b=b.getDate();else if(0>a||12<a)a=1;this.month=a}};
GenoCalendar.prototype.toString=function(){var a=[];this.year&&(a.push(this.year),this.month&&(a.push(this.month),this.day&&a.push(this.day)));return a.join("-")};
$jscomp.global.Object.defineProperties(GenoCalendar.prototype,{age:{configurable:!0,enumerable:!0,get:function(){if(!this.year)return null;var a=new Date,b=a.getFullYear();if(!this.month)return b-this.year;var c=a.getMonth()+1;if(!this.dd)return Math.floor((100*b+c-(100*this.year+this.month))/100);a=a.getDate();return Math.floor((1E4*b+100*c+a-(1E4*this.year+100*this.month+this.day))/1E4)}}});var InputPanel=function(){this.panel=document.getElementById("inputPanel");this.person=null;this.setupEvents()};
InputPanel.prototype.setupEvents=function(){var a=this,b=this.panel.querySelector('[name="name"]'),c=this.panel.querySelector('[name="description"]'),d=$('[name="gender"]'),e=this.panel.querySelector('[name="dob"]'),f=this.panel.querySelector('[name="dod"]'),g=this.panel.querySelector('[name="age"]'),l=document.getElementById("parentsButton"),h=document.getElementById("partnerButton"),k=this.panel.querySelector('[name="deleteButton"]');b.addEventListener("change",function(){a.person.name=b.value});
c.addEventListener("change",function(){a.person.description=c.value});d.click(function(b){a.person.gender=b.target.value;a.refreshControls()});e.addEventListener("keyup",function(){var b=(new GenoCalendar(e.value)).toString();a.person.dob=b;g.value=a.person.age});e.addEventListener("change",function(){var a=new GenoCalendar(e.value);e.value=a.toString()});f.addEventListener("keyup",function(){var b=(new GenoCalendar(f.value)).toString();a.person.dod=b;g.value=a.person.age});f.addEventListener("change",
function(){var a=new GenoCalendar(f.value);f.value=a.toString()});g.addEventListener("keyup",function(){return a.ageChanged()});l.addEventListener("click",function(){return a.addParents()});h.addEventListener("click",function(){return a.addPartner()});k.addEventListener("click",function(){return a.person.remove()});$(this.panel).panel({close:function(){Field.Instance.clearSelection()}})};
InputPanel.prototype.ageChanged=function(){var a=this.panel.querySelector('[name="dob"]');this.panel.querySelector('[name="dod"]');var b=this.panel.querySelector('[name="age"]'),b=parseInt(b.value);this.person.age=null;if(b){var c=(new Date).getFullYear()-b;a.value=c;this.person.dob=c;this.person.age=b}};InputPanel.prototype.addParents=function(){var a=new Person(null,"m"),b=new Person(null,"f"),c=new Relation(a,b);this.person.addParents(c);this.refreshControls();Field.Instance.addActor(a,b,c)};
InputPanel.prototype.addPartner=function(){var a=new Person(null,this.person.isMale?"f":"m"),b=new Relation(this.person,a);this.person.addPartner(b);this.refreshControls();Field.Instance.addActor(a,b)};
InputPanel.prototype.refreshControls=function(){var a=this.person.gender,b=this.person.relationList.length,c=document.getElementById("parentsButton"),d=document.getElementById("partnerButton"),e=this.panel.querySelector('[name="deleteButton"]');0==b?$('[name="gender"]').checkboxradio("enable"):$('[name="gender"]').checkboxradio("disable");this.person.parents?$(c).addClass("ui-state-disabled"):$(c).removeClass("ui-state-disabled");null==a||""==a?$(d).addClass("ui-state-disabled"):$(d).removeClass("ui-state-disabled");
this.person.principal||this.person.hasChild?$(e).addClass("ui-state-disabled"):$(e).removeClass("ui-state-disabled")};InputPanel.prototype.setupForm=function(){var a=this;$("#inputPanel form :input").each(function(b,c){var d=c.getAttribute("name");b=c.getAttribute("type");d=a.person[d];"radio"==b?$(c).val([d]).checkboxradio("refresh"):c.value=d});this.refreshControls()};InputPanel.prototype.open=function(a){this.person=a;this.setupForm();$(this.panel).panel("open")};
var PartnerPanel=function(){this.panel=document.getElementById("partnerPanel");this.childrenView=document.getElementById("childrenView");this.relation=null;this.setupEvents()};
PartnerPanel.prototype.setupEvents=function(){var a=this,b=document.getElementById("mChildButton"),c=document.getElementById("fChildButton"),d=function(b){b=new Person(null,b);a.relation.addChild(b);Field.Instance.addActor(b);a.setupChildren()};b.addEventListener("click",function(){d("m")});c.addEventListener("click",function(){d("f")});$(this.childrenView).sortable({stop:function(b,c){a.reorganizeChildren()}});$(this.panel).panel({close:function(){Field.Instance.clearSelection()}})};
PartnerPanel.prototype.reorganizeChildren=function(){var a=this,b=this.childrenView.querySelectorAll("li");this.relation.children=[];Array.prototype.forEach.call(b,function(b){(b=$(b).prop("child"))&&a.relation.addChild(b)});$(this.childrenView).listview("refresh");Field.Instance.dirty=!0};
PartnerPanel.prototype.setupChildren=function(){var a=this.childrenView;a.textContent=null;this.relation.children.forEach(function(b){var c=document.createElement("span"),d=document.createElement("p"),e=document.createElement("a"),f=document.createElement("li");c.textContent=b.info;d.textContent=b.description;e.appendChild(c);e.appendChild(d);f.appendChild(e);f.setAttribute("data-icon",!1);a.appendChild(f);$(f).prop("child",b)});$(a).listview("refresh")};
PartnerPanel.prototype.setupForm=function(){var a=this.panel.querySelector('[name="father"]'),b=this.panel.querySelector('[name="mother"]');a.value=this.relation.father.info;b.value=this.relation.mother.info};PartnerPanel.prototype.open=function(a){this.relation=a;this.setupForm();this.setupChildren();$(this.panel).panel("open")};var Person=function(a,b){Chain.call(this,void 0===a?null:a,void 0===b?"":b);this.dod=this.dob=this.description=this.name="";this.radius=32;this.principal=!1};
$jscomp.inherits(Person,Chain);Person.prototype.attributeChanged=function(){this.symbol=this.isMale?new MaleSymbol(this):new FemaleSymbol(this)};Person.prototype.scanAll=function(a,b){b=void 0===b?0:b;var c=this;-1===a.indexOf(this)&&(this.depth=b,this.touched=this.fixed=!1,a.push(this),this.mother&&this.mother.scanAll(a,b-1),this.relationList.forEach(function(d){d.getPartner(c).scanAll(a,b);d.children.forEach(function(c){c.scanAll(a,b+1)})}))};
Person.prototype.calculateChildren=function(a){var b=Field.Instance.spacing,c=a.children,d=1==c.length,e=a.allChildren,f=a.rect.center-b*(d?0:e.length-1)/2,g=this.y+b;c.forEach(function(a){var c=a.numOfPartner*b;console.log("child#"+a.count+" cx:"+f);a.isMale||d||(f+=c);a.x=f;a.y=g;a.calculate();a.isMale&&(f+=c);f+=b})};
Person.prototype.calculate=function(){var a=this;if(!this.fixed){var b=Field.Instance.spacing,c=b/2;if(this.mother&&!this.mother.fixed)this.mother.x=this.x+c,this.mother.y=this.y-b,this.mother.calculate();else{var d=[],e=1;this.count=Tally.increment();this.fixed=!0;this.relationList.forEach(function(c,g){var f=c.getPartner(a),h=c.occupancy;console.log("#"+a.count+" ch:"+c.children.length+"/"+c.allChildren.length);if(!f.fixed){var k=a.isMale?1:-1,m=0;0<h.left&&d.forEach(function(b,c){0!=b.left&&(c=
2*(g-c),a.isMale?c=h.left+b.right-c:(c=h.right+b.left-c,console.log("sum:"+c+"/right:"+h.right+"/left:"+b.left)),m=Math.max(m,c))});e+=m/2;f.x=a.x+e*k*b;f.y=a.y;f.calculate();e++}d.push(h);a.calculateChildren(c)})}}};Person.prototype.touch=function(a){var b=this.x-a.x;a=this.y-a.y;Math.sqrt(b*b+a*a)<Field.Instance.spacing&&(this.touched=!0);return this.touched};Person.prototype.isHit=function(a,b){return this.hit=this.symbol.isHit(a,b)};
Person.prototype.drawSymbol=function(a){this.selected?(this.strokeStyle="navy",a.lineWidth=5):this.hit?(this.strokeStyle="aqua",a.lineWidth=5):(this.strokeStyle="black",a.lineWidth=3);a.strokeStyle=this.strokeStyle;this.touched&&(a.strokeStyle="red");this.symbol.draw(a)};
Person.prototype.drawChildLine=function(a){var b=this,c=Field.Instance.spacing/2,d=this.y+c+c/4,e=!0,f=null;a.strokeStyle=Field.Instance.lineStyle;this.relationList.forEach(function(c){if(0!=c.children.length){var g=c.rect,h=g.center,g=g.bottom;a.beginPath();a.moveTo(h,g);a.lineTo(h,d);c.children.forEach(function(c){var g=c.x,h=c.y-b.radius;e&&(a.lineTo(g,d),a.stroke(),e=!1);a.beginPath();a.moveTo(g,d);a.lineTo(g,h);a.stroke();f=c});a.beginPath();a.moveTo(h,d);a.lineTo(f.x,d);a.stroke()}})};
Person.prototype.draw=function(a){a.save();this.drawChildLine(a);a.translate(this.x,this.y);this.drawSymbol(a);a.restore()};$jscomp.global.Object.defineProperties(Person.prototype,{age:{configurable:!0,enumerable:!0,get:function(){return(new GenoCalendar(this.dob)).age}},info:{configurable:!0,enumerable:!0,get:function(){var a=this.name,b=this.age;b&&(a+="("+b+")");return a}}});
var Relation=function(a,b){Actor.call(this);a.isMale?(this.father=a,this.mother=b):(this.father=b,this.mother=a);this.children=[];this.hit=!1};$jscomp.inherits(Relation,Actor);Relation.prototype.getPartner=function(a){return a==this.father?this.mother:this.father};Relation.prototype.addChild=function(a){a.parents=this;this.children.push(a)};Relation.prototype.removeChild=function(a){var b=this.children.indexOf(a);this.children.splice(b,1);a.eject()};
Relation.prototype.isHit=function(a,b){var c=this.rect;this.hit=!1;c.left<=a&&a<=c.right&&c.top<=b&&b<=c.bottom&&(this.hit=!0);return this.hit};Relation.prototype.drawOccupancy=function(a){var b=this.occupancy;if(0!=b.left){var c=Field.Instance.spacing,d=c/2,e=this.rect,f=e.center-b.left*d,e=e.bottom,b=(b.left+b.right)*d;a.strokeStyle="green";a.strokeRect(f,e,b,c)}};
Relation.prototype.drawNormal=function(a){var b=this.rect;a.beginPath();a.moveTo(b.left,b.top);a.lineTo(b.left,b.bottom);a.lineTo(b.right,b.bottom);a.lineTo(b.right,b.top);a.stroke()};Relation.prototype.drawText=function(a){var b=this.rect;a.fillText(this.partnerOrder,b.center,b.top)};Relation.prototype.draw=function(a,b){a.save();this.hit?(a.strokeStyle="aqua",a.lineWidth=5,this.drawNormal(a),this.drawText(a)):(a.strokeStyle=Field.Instance.lineStyle,this.drawNormal(a));a.restore()};
$jscomp.global.Object.defineProperties(Relation.prototype,{partnerOrder:{configurable:!0,enumerable:!0,get:function(){return Math.max(this.father.partnerOrder,this.mother.partnerOrder)}},rect:{configurable:!0,enumerable:!0,get:function(){var a=Field.Instance.spacing/2,b=this.father,c=this.mother,d=b.y+b.radius,e=Math.min(b.x,c.x),f=Math.abs(b.x-c.x),g=a/4+4*(this.partnerOrder-1);return{top:d,left:e,right:e+f,bottom:d+g,center:b.partnerOrder<c.partnerOrder?c.x-a:b.x+a,width:f,height:g}}},allChildren:{configurable:!0,
enumerable:!0,get:function(){var a=[];this.children.forEach(function(b){var c=b.partnerList;b.isMale?(a.push(b),a=a.concat(c)):(a=a.concat(c),a.push(b))});return a}},occupancy:{configurable:!0,enumerable:!0,get:function(){var a=this.allChildren.length;if(1==this.children.length){var b=2*a-1;this.children[0].isMale?a=1:(a=b,b=1)}else b=a;return{left:a,right:b}}}});
var RelationPanel=function(){this.panel=document.getElementById("relationPanel");this.deleteButton=this.panel.querySelector('[name="deleteButton"]');this.to=this.from=null;this.setupEvents()};RelationPanel.prototype.setupEvents=function(){var a=this;$('[name="emotion"]').click(function(){a.deleteRelationship();a.relationship=a.createRelationship();a.resetControls()});this.deleteButton.addEventListener("click",function(){a.deleteRelationship();a.resetControls()});$(this.panel).panel({close:function(){Field.Instance.clearSelection()}})};
RelationPanel.prototype.createRelationship=function(){var a=$('[name="emotion"]:checked'),a=Relationship.create(a.val(),this.from,this.to);a.hit=!0;Field.Instance.addActor(a);return a};RelationPanel.prototype.deleteRelationship=function(){this.relationship&&(this.relationship.eject(),this.relationship=null)};RelationPanel.prototype.resetControls=function(){this.relationship?$(this.deleteButton).removeClass("ui-state-disabled"):$(this.deleteButton).addClass("ui-state-disabled")};
RelationPanel.prototype.setupForm=function(){var a=this.panel.querySelector('[name="from"]'),b=this.panel.querySelector('[name="to"]'),c=$('[name="emotion"]');a.value=this.from.info;b.value=this.to.info;this.relationship?c.val([this.relationship.emotion]).checkboxradio("refresh"):c.removeAttr("checked").checkboxradio("refresh");this.resetControls()};
RelationPanel.prototype.open=function(a,b){(b=void 0===b?null:b)?(this.from=a,this.to=b,this.relationship=null,this.isNew=!0):(this.from=a.person,this.from.hit=!0,this.to=a.other,this.to.hit=!0,this.relationship=a,this.isNew=!1);this.setupForm();$(this.panel).panel("open")};var Tally=function(){};Tally.reset=function(){Tally.val=0};Tally.increment=function(){return++Tally.val};Tally.val=0;var UUID=function(){};
UUID.toString=function(){return UUID.Format.replace(/X|Y/g,function(a){var b=16*Math.random()|0;return("X"===a?b:b&3|8).toString(16)})};UUID.Format="XXXXXXXX-XXXX-4XXX-YXXX-XXXXXXXXXXXX";var GenoSymbol=function(a){this.person=a};GenoSymbol.prototype.drawSymbol=function(a){var b=2*this.radius;a.strokeRect(-this.radius,-this.radius,b,b);if(this.person.principal){var b=this.ir,c=2*b;a.strokeRect(-b,-b,c,c)}};
GenoSymbol.prototype.drawCross=function(a){var b=-this.radius,c=-this.radius,d=this.radius,e=this.radius;a.beginPath();a.moveTo(c,b);a.lineTo(d,e);a.stroke();a.beginPath();a.moveTo(d,b);a.lineTo(c,e);a.stroke()};GenoSymbol.prototype.drawYears=function(a){new GenoCalendar(this.person.dob);var b=new GenoCalendar(null);var c=new GenoCalendar(this.person.dod);b=[b.year,c.year].join("-");1>=b.length||a.fillText(b,0,-(this.textHh+this.radius))};
GenoSymbol.prototype.drawAge=function(a){var b=this.person.age;b&&(a.strokeText(b,0,0),a.fillText(b,0,0))};GenoSymbol.prototype.drawName=function(a){a.fillText(this.person.name,0,this.textHh+this.radius)};GenoSymbol.prototype.resetProperties=function(){this.radius=this.person.radius;this.width=2*this.radius;this.ir=.8*this.radius;this.fontSize=this.person.fontSize;this.textMargin=.2*this.fontSize;this.textHh=this.fontSize/2+this.textMargin};
GenoSymbol.prototype.draw=function(a){this.resetProperties();a.save();a.strokeStyle=this.person.strokeStyle;a.textAlign="center";this.drawSymbol(a);this.person.dod&&(a.lineWidth=1,this.drawCross(a));a.lineWidth=1;a.strokeStyle="black";a.fillStyle="black";this.drawAge(a);this.drawYears(a);this.drawName(a);a.restore()};var FemaleSymbol=function(a){GenoSymbol.apply(this,arguments)};$jscomp.inherits(FemaleSymbol,GenoSymbol);
FemaleSymbol.prototype.isHit=function(a,b){var c=this.person;a=c.x-a;b=c.y-b;return Math.sqrt(a*a+b*b)<c.radius};FemaleSymbol.prototype.drawSymbol=function(a){a.beginPath();a.arc(0,0,this.radius,0,2*Math.PI,!1);a.stroke();this.person.principal&&(a.beginPath(),a.arc(0,0,this.ir,0,2*Math.PI,!1),a.stroke())};
FemaleSymbol.prototype.drawCross=function(a){var b=Math.PI/2,c=b/2,d=Math.cos(c+b)*this.radius,b=-Math.sin(c+b)*this.radius,e=Math.sin(c)*this.radius,c=Math.cos(-c)*this.radius;a.beginPath();a.moveTo(b,d);a.lineTo(e,c);a.stroke();a.beginPath();a.moveTo(e,d);a.lineTo(b,c);a.stroke()};var MaleSymbol=function(a){GenoSymbol.apply(this,arguments)};$jscomp.inherits(MaleSymbol,GenoSymbol);
MaleSymbol.prototype.isHit=function(a,b){var c=this.person;b=c.y-b;var d=c.radius;return Math.abs(c.x-a)<d&&Math.abs(b)<d};var Relationship=function(a,b){Actor.call(this);this.person=a;this.other=b;this.createFillStyle()};$jscomp.inherits(Relationship,Actor);
Relationship.prototype.createFillStyle=function(a){a=void 0===a?null:a;var b=this,c=FlexibleView.Instance.ctx;this.height=16;this.fillStyle="rgba(200, 200, 255, 0.7)";this.img=new Image;this.img.onload=function(){b.height=b.img.height;b.fillStyle=c.createPattern(b.img,"repeat-x")};a&&(this.img.src=a)};
Relationship.prototype.calculatePosition=function(){this.bx=this.person.x;this.by=this.person.y;this.ex=this.other.x;this.ey=this.other.y;var a=this.ex-this.bx,b=this.ey-this.by;this.cx=this.bx+a/2;this.cy=this.by+b/2;this.radian=Math.atan2(b,a);this.length=Math.sqrt(a*a+b*b);this.width=this.length-(this.person.radius+this.other.radius)};
Relationship.prototype.isHit=function(a,b){a=this.cx-a;var c=this.cy-b,d=-this.radian;b=Math.cos(d)*a-Math.sin(d)*c;a=Math.sin(d)*a+Math.cos(d)*c;var c=-this.length/2+this.person.radius,d=-this.height/2,e=this.width+c,f=this.height+d;return this.hit=c<=b&&b<=e&&d<=a&&a<=f};
Relationship.prototype.drawAuxiliary=function(a){a.save();a.strokeStyle="blue";a.beginPath();a.moveTo(this.bx,this.by);a.lineTo(this.ex,this.ey);a.stroke();a.fillStyle="red";a.beginPath();a.arc(this.bx,this.by,4,0,2*Math.PI,!1);a.fill();a.beginPath();a.arc(this.ex,this.ey,4,0,2*Math.PI,!1);a.fill();a.beginPath();a.arc(this.cx,this.cy,4,0,2*Math.PI,!1);a.fill();a.restore()};
Relationship.prototype.draw=function(a){this.calculatePosition();var b=-this.length/2+this.person.radius,c=-this.height/2;a.save();a.translate(this.cx,this.cy);a.rotate(this.radian);a.translate(b,c);a.fillStyle=this.fillStyle;a.fillRect(0,0,this.width,this.height);this.hit&&(a.fillStyle="rgba(140, 255, 255, 0.5)",a.fillRect(0,0,this.width,this.height));a.restore()};
Relationship.create=function(a,b,c){b="fused"==a?new FusedRelation(b,c):"close"==a?new CloseRelation(b,c):"distant"==a?new DistantRelation(b,c):"hostile"==a?new HostileRelation(b,c):new Relationship(b,c);b.emotion=a;return b};var CloseRelation=function(a,b){Relationship.call(this,a,b);this.createFillStyle("img/relation.close.png")};$jscomp.inherits(CloseRelation,Relationship);CloseRelation.create=Relationship.create;var DistantRelation=function(a,b){Relationship.call(this,a,b);this.createFillStyle("img/relation.distant.png")};
$jscomp.inherits(DistantRelation,Relationship);DistantRelation.create=Relationship.create;var FusedRelation=function(a,b){Relationship.call(this,a,b);this.createFillStyle("img/ralation.fused.png")};$jscomp.inherits(FusedRelation,Relationship);FusedRelation.create=Relationship.create;var HostileRelation=function(a,b){Relationship.call(this,a,b);this.createFillStyle("img/relation.hostile.png")};$jscomp.inherits(HostileRelation,Relationship);HostileRelation.create=Relationship.create;
document.addEventListener("DOMContentLoaded",function(){new AppMain});var AppMain=function(){console.log("AppMain")};
