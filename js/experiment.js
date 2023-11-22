var frontsLeft=[],frontsRight=[];
var maxNoOfFronts=120;

var originalNoOfFronts=1;
var noOfFronts=originalNoOfFronts;
var dt=2;
var source1Y=200;
var source2Y=200;
var source2AdditionalSteps=0;

var externalView=false;
var tracks=document.getElementById("tracks");
var wagon=document.getElementById("wagon");
var observer=document.getElementById("observer");
var observerInside=document.getElementById("observerInside");
var trackTop=0;
var wagonTop=0;
var wagonLeft=0;
var wagonLeftWall=36,wagonRightWall=363;
var observerLeft=(canvas.width-observer.width)/2;
var observerTop=canvas.height-observer.height+1;
var observerInsideLeft=(canvas.width-observerInside.width)/2;
var observerInsideTop=canvas.height-trackTop-observerInside.height+1;

var moveWagon=false;

var clockXOffset=50,clockYOffset=50;
var clock1=new clock(clockXOffset,clockYOffset,context);
var clock2=new clock(canvas.width-clockXOffset,clockYOffset,context);

function initialiseExperiment(){
	experimentInitialised=false;
	initGUI();
	//drawWidth.value=1;
	reset();
	initialiseBackground();
	drawBackground();
	drawObserver();
	drawClocks();
	experimentInitialised=true;
}

function initialiseFronts(){
	var i=0;
	for (i=frontsLeft.length-1;i>-1;i--){
		frontsLeft.splice(i,1);
	}
	for (i=frontsRight.length-1;i>-1;i--){
		frontsRight.splice(i,1);
	}
}

function previousFrame(){
	var i=0;
	clock1.setValue(clock1.m_Value-1);
	clock2.setValue(clock2.m_Value-1);
	if(frontsLeft.length>1){//πρέπει να υπάρχουν τουλάχιστον δύο μέτωπα
		frontsLeft.splice(frontsLeft[frontsLeft.length-1],1);
		for(i=0;i<frontsLeft.length;i++){
			if(frontsLeft[i].edgeReached) frontsLeft[i].edgeReached=false;
			frontsLeft[i].setCurrentStep(frontsLeft[i].mCurrentStep-2);
		}
	}
	if(frontsRight.length>1){//πρέπει να υπάρχουν τουλάχιστον δύο μέτωπα
		for(i=0;i<frontsRight.length;i++){
			if(frontsRight[i].edgeReached) frontsRight[i].edgeReached=false;
			frontsRight[i].setCurrentStep(frontsRight[i].mCurrentStep-2);
		}
	}
	drawScene();
}

function nextFrame(){
	var i=0;
	//1. ΑΡΙΣΤΕΡΗ ΠΗΓΗ
	if (frontsLeft.length>0 && !frontsLeft[0].edgeReached) clock1.setValue(clock1.m_Value+1);
	//Δημιουργία επόμενου μετώπου (αν προβλέπεται)
	if(frontsLeft.length==0 || frontsLeft.length>0 && !frontsLeft[0].edgeReached && frontsLeft.length<noOfFronts){
		var newFrontLeft=new waveFront(source1X(),source1Y,context,noOfFronts);
		newFrontLeft.setDirection(0);
		newFrontLeft.setFrontColor(frontRed,frontGreen,frontBlue);
		frontsLeft.push(newFrontLeft);
	}
	//Διάδοση μετώπων
	for(i=0;i<frontsLeft.length;i++){
		frontsLeft[i].propagate();		
	}
	if(Math.abs(frontsLeft[0].xCenter+frontsLeft[0].R-wagonMiddle())<=2){
		for(i=0;i<frontsLeft.length;i++){
			frontsLeft[i].edgeReached=true;
		}
	}

	//2. ΔΕΞΙΑ ΠΗΓΗ
	if (frontsRight.length>0 && !frontsRight[0].edgeReached) clock2.setValue(clock2.m_Value+1);
	//Δημιουργία επόμενου μετώπου (αν προβλέπεται)
	if(frontsRight.length==0 || frontsRight.length>0 && !frontsRight[0].edgeReached && frontsRight.length<noOfFronts){
		var newFrontRight=new waveFront(source2X(),source2Y,context,noOfFronts);
		newFrontRight.setDirection(newFrontRight.maxDirections/2);
		newFrontRight.setFrontColor(frontRed,frontGreen,frontBlue);
		frontsRight.push(newFrontRight);
	}
	//Διάδοση μετώπων
	for(i=0;i<frontsRight.length;i++){
		frontsRight[i].propagate();
	}
	if(Math.abs(frontsRight[0].xCenter-frontsRight[0].R-wagonMiddle())<=2){
		for(i=0;i<frontsRight.length;i++){
			frontsRight[i].edgeReached=true;
		}
	}
	drawScene();
}

function reset(){	
	initialiseBackground();
	setSource1Xpos(wagonLeftWall);
	setSource2Xpos(wagonRightWall);
	initialiseFronts();
	drawScene();
	clock1.setValue(clock1.m_MinValue);
	clock1.m_Cycles=0;
	clock2.setValue(clock2.m_MinValue);
	clock2.m_Cycles=0;
}

/*function resetClocks(){
	clock1.setValue(clock1.m_MinValue);
	clock1.m_Cycles=0;
	clock2.setValue(clock2.m_MinValue);
	clock2.m_Cycles=0;
	reset();
}*/

function drawScene(){
	var i=0;
	if (experimentInitialised){
		clearGraphics();
		drawBackground();
		showGrid();
		for(i=0;i<frontsLeft.length;i++){
			frontsLeft[i].show();
		}
		for(i=0;i<frontsRight.length;i++){
			frontsRight[i].show();
		}
		drawClocks();
		drawObserver();
	}
}

function setFrontsColor(){
	var i=0;
	for(i=0;i<frontsLeft.length;i++){
		frontsLeft[i].mRed=frontRed;
		frontsLeft[i].mGreen=frontGreen;
		frontsLeft[i].mBlue=frontBlue;
	}
	for(i=0;i<frontsRight.length;i++){
		frontsRight[i].mRed=frontRed;
		frontsRight[i].mGreen=frontGreen;
		frontsRight[i].mBlue=frontBlue;
	}
}

function setSource1Xpos(newValue){
	source1Xpos=newValue;
	initialiseFronts();
}

function setSource2Xpos(newValue){
	source2Xpos=newValue;
	initialiseFronts();
}

function initialiseBackground(){
	trackTop=canvas.height-tracks.height+1;
	if (externalView){
		wagonTop=trackTop-wagon.height;
		observerInsideTop=trackTop-observerInside.height-85;
	}
	else{
		wagonTop=canvas.height-wagon.height;
		observerInsideTop=canvas.height-observerInside.height-85;
	}
	source1Y=wagonTop+wagon.height/2;
	source2Y=source1Y;
	wagonLeft=parseInt((canvas.width-wagon.width)/2);
	observerInsideLeft=wagonLeft+(wagon.width-observerInside.width)/2;

}

function wagonMiddle(){
	return wagonLeft+wagon.width/2;
}

function source1X(){
	return wagonLeft+wagonLeftWall;
}

function source2X(){
	return wagonLeft+wagonRightWall;
}

function drawBackground(){
	if (externalView){
	    for (var i=0;i<canvas.width;i+=tracks.width){
	    	context.drawImage(tracks,i,trackTop);
	    }
	}
    if(moveWagon && !(frontsLeft.length>0 && frontsLeft[0].edgeReached && frontsRight.length>0 && frontsRight[0].edgeReached)){
    	wagonLeft++;
    	observerInsideLeft=wagonLeft+(wagon.width-observerInside.width)/2;
    }
    context.drawImage(wagon,wagonLeft,wagonTop);
}

function drawClocks(){
	clock1.show();
	clock2.show();
}

function drawObserver(){
	context.drawImage(observerInside,observerInsideLeft,observerInsideTop);
	if (externalView){
		context.drawImage(observer,observerLeft,observerTop);
	}
}