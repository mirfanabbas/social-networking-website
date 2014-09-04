// (c)2009

var SmoothCalendar=new Class({events:[],daysInMonth:[31,28,31,30,31,30,31,31,30,31,30,31],weekDays:["sunday","monday","tuesday","wednesday","thursday","friday","saturday"],monthsOfYear:["January","February","March","April","May","June","July","August","September","October","November","December"],dayNumbers:{"sunday":0,"monday":1,"tuesday":2,"wednesday":3,"thursday":4,"friday":5,"saturday":6},isIE6:(Browser.Engine.trident&&Browser.Engine.version==4),isIE:(Browser.Engine.trident),container:null,currentDate:null,dateBeingViewed:null,dayBeingViewed:null,boxingWidth:null,EVENTBOARD_PADDING:30,initialize:function(container,startDate){this.container=container;this.currentDate=(startDate)?startDate:new Date();if($type(this.container)!='element')
this.container=$(this.container)
this.container.set('class','smoothcalendar');var eventElements=this.container.getElements('div');var date,node;for(var i=0;i<eventElements.length;i++){node=eventElements[i];date=node.getProperty('class');if(date){date=new Date(date);this.events.push({date:date,content:node.get('html'),title:node.get('title')})}}
this.sortEvents();this.generateCalendar();},numberOfDaysInMonth:function(dateObject){var month=dateObject.getMonth();if(month==1){var leapYear=(new Date(dateObject.getYear(),1,29).getDate())==29;if(leapYear)
return 29
else
return 28;}else return this.daysInMonth[month];},dayHasEvents:function(dayOfMonth){var year=this.currentDate.getFullYear();var month=this.currentDate.getMonth();var date;for(var i=0;i<this.events.length;i++){date=this.events[i].date;if(date.getFullYear()==year&&date.getMonth()==month&&date.getDate()==dayOfMonth){return true;}}
return false;},getEventsOfDay:function(dayOfMonth){var year=this.currentDate.getFullYear();var month=this.currentDate.getMonth();var event,result=[];for(var i=0;i<this.events.length;i++){event=this.events[i];if(event.date.getFullYear()==year&&event.date.getMonth()==month&&event.date.getDate()==dayOfMonth){result.push(event);}}
return result;},sortEvents:function(){var j,tmp,events=this.events;for(var i=1;i<events.length;i++){tmp=this.events[i];for(j=i;j>0&&events[j-1].date>tmp.date;j--)
events[j]=events[j-1];events[j]=tmp;}},firstDayOfMonth:function(dateObject){dateObject.setDate(1);return dateObject.getDay();},getDayContent:function(dayNumber){var eventCount=this.getEventsOfDay(dayNumber).length;var dayNumberEl=new Element("p",{'class':'day_number','html':((dayNumber<10)?'0'+dayNumber:dayNumber)});var dayCountEl=new Element("p",{'class':'day_event_count','html':((eventCount!=0)?eventCount+' Event(s)':'&nbsp;')});return[dayNumberEl,dayCountEl];},getNavigationRow:function(){var row=new Element('div',{'class':'navigations'});var center=new Element('div',{'class':((!this.isIE6)?'current_date':'current_date_IE6')});var left=new Element('div');var right=new Element('div');var width=Math.floor(this.container.offsetWidth/3);left.setStyle('width',width+'px');right.setStyle('width',width+'px');center.setStyle('width',width+'px');var dateString=this.monthsOfYear[this.currentDate.getMonth()]+', '+this.currentDate.getFullYear();var prevYear=new Element("a",{id:'previousYear',html:"&nbsp;",href:"Previous Year",title:"Previous Year"});var prevMonth=new Element("a",{id:'previousMonth',html:"&nbsp;",href:"Previous Month",title:"Previous Month"});var nextMonth=new Element("a",{id:'nextMonth',html:"&nbsp;",href:"Next Month",title:"Next Month"});var nextYear=new Element("a",{id:'nextYear',html:"&nbsp;",href:"Next Year",title:"Next Year"});prevYear.addEvent('click',this.prevYear.bind(this));prevMonth.addEvent('click',this.prevMonth.bind(this));nextYear.addEvent('click',this.nextYear.bind(this));nextMonth.addEvent('click',this.nextMonth.bind(this));center.set('html',dateString);left.adopt([prevYear,new Element('span',{'html':'&nbsp;&nbsp;'}),prevMonth]);right.adopt([nextMonth,new Element('span',{'html':'&nbsp;&nbsp;'}),nextYear]);row.adopt([left,center,right]);return row;},adjustWidthOfBox:function(element){var value=(this.container.offsetWidth/7)-1;element.setStyles({'width':(this.container.offsetWidth/7)-1+'px'});},getDayNames:function(){var days=[];var day=null;for(var i=0;i<this.weekDays.length;i++){days.push(new Element('div',{'html':this.weekDays[i],'class':'dayNames'}));}
return days;},getWeekDaysRow:function(){var row=new Element("div",{'class':'weekDays'});var firstDayOfMonth=this.firstDayOfMonth(this.currentDate);var totalDaysInMonth=this.numberOfDaysInMonth(this.currentDate);var dayBox=null;var currentPrintedDays=0;var actualPrintedDays=0;var columns=[];for(var i=0;i<7;i++){columns.push(new Element('div',{'class':'columns'}));this.adjustWidthOfBox(columns[i]);}
var weekDays=this.getDayNames();for(i=0;i<weekDays.length;i++){columns[i].adopt(weekDays[i]);}
var ownerColumnIndex=0;while(actualPrintedDays!=totalDaysInMonth&&currentPrintedDays!=(totalDaysInMonth+firstDayOfMonth+Math.ceil(totalDaysInMonth/7))){dayBox=new Element('div');columnIndex=(currentPrintedDays%7==0)?0:columnIndex+1;if(currentPrintedDays>=firstDayOfMonth&&actualPrintedDays<=totalDaysInMonth-1){dayBox.adopt(this.getDayContent(actualPrintedDays+1));if(this.dayHasEvents(actualPrintedDays+1)){dayBox.addEvent('mouseover',this.onCalendarDayMouseOver.bind(this));dayBox.addEvent('mouseout',this.onCalendarDayMouseOut.bind(this));dayBox.addEvent('click',this.onCalendarDayMouseClick.bind(this));dayBox.set('class','day_content_with_event');}else{dayBox.set('class','day_content');}
actualPrintedDays++;}else{dayBox.set('html','<p class="day_number">&nbsp</p><p class="day_event_count">&nbsp</p>');dayBox.set('class','emptyBox');}
currentPrintedDays++;columns[columnIndex].adopt(dayBox);}
row.adopt(columns);return row;},generateCalendar:function(){this.container.empty();this.container.adopt(this.getNavigationRow());this.container.adopt(this.getWeekDaysRow());},extractTargetFromEvent:function(event){var container=((event.target.nodeName=='P')?event.target.parentNode:event.target);return container;},onCalendarDayMouseOver:function(event){if(this.dayBeingViewed)
return;var container=this.extractTargetFromEvent(event);if(!container)
return;var day=container.getFirst();container.morph(".day_content_with_event_mouseover");},onCalendarDayMouseOut:function(event){if(this.dayBeingViewed)
return;var container=this.extractTargetFromEvent(event);if(!container)
return;var day=container.getFirst();container.morph(".day_content_with_event");},onCalendarDayMouseClick:function(event){if(this.dayBeingViewed)
return;var container=this.extractTargetFromEvent(event);if(!container)
return;var day=container.getFirst();var dayNumber=day.get('text');dayNumber=(dayNumber[0]=='0')?dayNumber.substr(1,dayNumber.length).toInt():dayNumber.toInt();this.dateBeingViewed=this.currentDate;this.dateBeingViewed.setDate(dayNumber);this.animateOpenningDayEvents(dayNumber);},animateOpenningDayEvents:function(dayNumber,target){var eventsOfDay=this.getEventsOfDay(dayNumber);if(eventsOfDay&&eventsOfDay.length==0)
return;if(!target){var paragraphs=this.container.getElements('p');for(var i=0;i<paragraphs.length;i++){target=(paragraphs[i].get('text')==dayNumber)?paragraphs[i].parentNode:null;if(target)
break;}
if(!target)return;}
var eventList=target.clone();this.container.adopt(eventList);eventList.set('class','events_list_box');var width=target.offsetWidth-(eventList.getStyle('border-width').toInt()+eventList.getStyle('padding').toInt()*2);var height=target.offsetHeight-(eventList.getStyle('border-width').toInt()+eventList.getStyle('padding').toInt()*2);var targetPosition=this.getRelativePosition(target);eventList.setStyles({width:width+'px',height:height+'px',borderColor:"#000",backgroundColor:'#000',left:targetPosition.left+'px',top:targetPosition.top+'px'});target.setStyles({'visibility':'hidden'});var leftToBe,topToBe,widthToBe,heightToBe=0;leftToBe=this.EVENTBOARD_PADDING;topToBe=this.EVENTBOARD_PADDING;widthToBe=this.container.offsetWidth-(leftToBe*2)-(eventList.getStyle('border-width').toInt()+eventList.getStyle('padding').toInt());heightToBe=this.container.offsetHeight-(topToBe*2)-(eventList.getStyle('border-width').toInt()+eventList.getStyle('padding').toInt());this.dayBeingViewed={day:dayNumber,target:target,animationEl:eventList,originals:{left:targetPosition.left,top:targetPosition.top,width:width,height:height}};var morph=eventList.get('morph');morph.set({transitions:Fx.Transitions.Elastic.easeIn})
morph.onComplete=this.onOpenningDayEventAnimationComplete.bind(this);morph.start({'width':widthToBe+'px','height':heightToBe+'px','left':leftToBe+'px','top':topToBe+'px'});},onOpenningDayEventAnimationComplete:function(){with(this.dateBeingViewed){var dayText=this.weekDays[getDay()]+' '+
this.monthsOfYear[getMonth()]+' '+
getDate()+', '+
getFullYear();}
var animationPanel=this.dayBeingViewed.animationEl;var dayNumber=animationPanel.getFirst();var eventCountText=animationPanel.childNodes[1];var fullDayText=dayNumber.cloneNode(true);fullDayText.set({html:dayText.toUpperCase(),'id':'fullDateText','style':'','class':''});var div=new Element('div');animationPanel.insertBefore(div,animationPanel.getFirst());div.setStyles({'height':dayNumber.offsetHeight+'px','overflow':'hidden','position':'relative'});div.adopt([dayNumber,fullDayText]);dayNumber.setStyles({'position':'absolute','top':'0px','left':'0px'});fullDayText.setStyles({'position':'absolute','top':dayNumber.offsetHeight+'px','left':'0px'});var eventListContainer=new Element('div',{id:'eventListContainer'});var eventDetailContainer=new Element('div',{id:'eventDetailContainer'});var eventsOfDay=this.getEventsOfDay(this.dateBeingViewed.getDate());eventListContainer.setStyles({'visibility':'hidden','opacity':'0','overflow':'auto'});eventDetailContainer.setStyle('overflow','auto');for(var i=0;i<eventsOfDay.length;i++){var listItem=new Element('div');eventListContainer.adopt(listItem);listItem.addEvent('mouseover',this.onEventMouseOver.bind(this));listItem.addEvent('mouseout',this.onEventMouseOut.bind(this));listItem.addEvent('click',this.onEventMouseClick.bind(this));listItem.set('class','smoothcalendar_listItem');listItem.set('html',(i+1)+'. '+eventsOfDay[i].title);}
this.dayBeingViewed.listContainer=eventListContainer;this.dayBeingViewed.detailContainer=eventDetailContainer;this.dayBeingViewed.eventsOfDay=eventsOfDay;this.dayBeingViewed.eventCountText=eventCountText;animationPanel.adopt([eventListContainer,eventDetailContainer]);eventListContainer.setStyle('height',(animationPanel.getStyle('height').toInt()-eventListContainer.offsetTop)+'px');eventDetailContainer.setStyles({'position':'absolute','top':eventListContainer.offsetTop+'px','left':animationPanel.offsetWidth+'px','width':eventListContainer.getStyle('width'),'height':eventListContainer.getStyle('height')});var closeElement=new Element('a',{'id':'smoothcalendarclose','html':'&times;','href':'javascript:;'});closeElement.addEvent('click',this.onCloseClick.bind(this));animationPanel.adopt(closeElement);var fx=new Fx.Morph(dayNumber,{duration:300}).start({'top':-dayNumber.offsetHeight+'px'});var fx=new Fx.Morph(fullDayText,{duration:300}).start({'top':'0px'});eventListContainer.fade('in');},onEventMouseOver:function(event){event.target.morph('.smoothcalendar_listItem_mouseover');},onEventMouseOut:function(event){event.target.morph('.smoothcalendar_listItem');},getIndexOfNode:function(child){var parent=child.parentNode;if(!parent)
return null;for(var i=0;i<parent.childNodes.length;i++){if(parent.childNodes[i]==child)
return i;}
return null;},onGoBackClick:function(event){var listContainer=this.dayBeingViewed.listContainer;var detailContainer=this.dayBeingViewed.detailContainer;with(listContainer.get('morph')){set({transition:Fx.Transitions.Elastic.easeOut});options.duration=300;start({'left':'0px'});}
with(detailContainer.get('morph')){set({transition:Fx.Transitions.Elastic.easeOut});options.duration=300;start({'left':listContainer.parentNode.offsetWidth+'px'});}
event.target.setStyle('display','none');},onEventMouseClick:function(event){var listItem=event.target;var listContainer=this.dayBeingViewed.listContainer;var detailContainer=this.dayBeingViewed.detailContainer;var eventIndex=this.getIndexOfNode(listItem);var thisEvent=this.dayBeingViewed.eventsOfDay[eventIndex];var goBackLink=this.dayBeingViewed.animationEl.getElementById('smoothcalendargoBackLink');if(!goBackLink){goBackLink=new Element('a',{'id':'smoothcalendargoBackLink','html':'&lsaquo; Back','href':'javascript:;'});goBackLink.setStyles({'top':this.dayBeingViewed.eventCountText.offsetTop+'px','left':this.dayBeingViewed.eventCountText.offsetLeft+'px','padding-top':this.dayBeingViewed.eventCountText.getStyle('padding-top')});goBackLink.addEvent('click',this.onGoBackClick.bind(this));this.dayBeingViewed.animationEl.adopt(goBackLink);}else{goBackLink.setStyle('display','block');}
var title=new Element('h2',{'html':thisEvent.title});var detail=new Element('div',{'html':thisEvent.content});detailContainer.empty();detailContainer.adopt([title,detail]);with(detailContainer.get('morph')){set({transition:Fx.Transitions.Elastic.easeOut});options.duration=300;onStart=function(){listContainer.setStyle('overflow','hidden');detailContainer.setStyle('overflow','hidden');};onComplete=function(){listContainer.setStyle('overflow','auto');detailContainer.setStyle('overflow','auto');};start({'left':listContainer.offsetLeft+'px'});}
with(listContainer.get('morph')){set({transition:Fx.Transitions.Elastic.easeOut});options.duration=300;start({'left':-listContainer.parentNode.offsetWidth+'px'});}},onCloseClick:function(event){this.dayBeingViewed.closingStage=0;this.animateClosingDayEvents(event);},animateClosingDayEvents:function(event){var animationPanel=this.dayBeingViewed.animationEl;var detailContainer=this.dayBeingViewed.detailContainer;var listContainer=this.dayBeingViewed.listContainer;var dayNumber=animationPanel.getFirst().getFirst();var dayName=dayNumber.getNext();this.dayBeingViewed.closingStage++;switch(this.dayBeingViewed.closingStage){case 1:if(listContainer.getStyle('left')&&listContainer.getStyle('left').toInt()<0)
detailContainer.fade('out');else
listContainer.fade('out');event.target.fade('out');var fx=new Fx.Morph(dayNumber,{duration:300});fx.onComplete=this.animateClosingDayEvents.bind(this);fx.start({'top':'0px'});var fx=new Fx.Morph(dayName,{duration:300});fx.start({'top':dayNumber.offsetHeight+'px'});break;case 2:detailContainer.destroy();listContainer.destroy();var fx=animationPanel.get('morph');fx.onComplete=this.animateClosingDayEvents.bind(this);fx.start({'left':this.dayBeingViewed.originals.left+'px','top':this.dayBeingViewed.originals.top+'px','height':this.dayBeingViewed.originals.height+'px','width':this.dayBeingViewed.originals.width+'px'});break;case 3:animationPanel.parentNode.removeChild(animationPanel);this.dayBeingViewed.target.setStyle('borderColor','');this.dayBeingViewed.target.fade('in');this.dayBeingViewed=null;break;}},getRelativePosition:function(element){var result={left:0,top:0};do{result.left+=element.offsetLeft;result.top+=element.offsetTop;element=element.offsetParent;}while(element&&element!=this.container);return result;},nextMonth:function(event){if(event)event.stop();if(this.dayBeingViewed)return;this.currentDate.setMonth(this.currentDate.getMonth()+1);this.generateCalendar();},nextYear:function(event){if(event)event.stop();if(this.dayBeingViewed)return;this.currentDate.setYear(this.currentDate.getFullYear()+1);this.generateCalendar();},prevMonth:function(event){if(event)event.stop();if(this.dayBeingViewed)return;this.currentDate.setMonth(this.currentDate.getMonth()-1);this.generateCalendar();},prevYear:function(event){if(event)event.stop();if(this.dayBeingViewed)return;this.currentDate.setYear(this.currentDate.getFullYear()-1);this.generateCalendar();}});