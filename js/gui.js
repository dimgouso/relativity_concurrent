//controls
var gui=new dat.GUI();
var simSwitch,simulationSpeed,showGrd,grdStep,lftSourcePos,rigtSourcePos,attenuation,
    noOfFrnts,frntColor,extView,moveCar;

var controls=function() {
	this.simulationSwitch=false;
	this.simulationSpeed=simSpeed;
	this.showGrid=gridVisible;
	this.gridStep=gridStep;
	this.leftSourcePosition=10;
	this.rightSourcePosition=10;
	this.attenuation=frontsAttenuation;	
    this.noOfFronts=originalNoOfFronts;
    this.frontsColor=[frontRed,frontGreen,frontBlue];
    this.externalView=false;
    this.moveWagon=false;
};
var cntrls=new controls();

function initGUI(){
	cntrls.moveWagon=moveWagon;
	
	if (simSwitch){
		gui.remove(simSwitch);
		simSwitch=null;
	}
	if (simulationSpeed){
		gui.remove(simulationSpeed);
		simulationSpeed=null;
	}
	if (showGrd){
		gui.remove(showGrd);
		showGrd=null;
	}
	if (grdStep){
		gui.remove(grdStep);
		grdStep=null;
	}
	if (lftSourcePos){
		gui.remove(lftSourcePos);
		lftSourcePos=null;
	}
	if (rigtSourcePos){
		gui.remove(rigtSourcePos);
		rigtSourcePos=null;
	}
	if (attenuation){
		gui.remove(attenuation);
		attenuation=null;
	}
	if (noOfFrnts){
		gui.remove(noOfFrnts);
		noOfFrnts=null;
	}
	if (frntColor){
		gui.remove(frntColor);
		frntColor=null;
	}
	if (extView){
		gui.remove(extView);
		extView=null;
	}
	if (moveCar){
		gui.remove(moveCar);
		moveCar=null;
	}
    
	gui.width=350;	

    simSwitch=gui.add(cntrls,"simulationSwitch").listen().name("Προσομοίωση");
    simSwitch.onChange(function(newValue){
    	simulating=newValue;
    	handleTimer(false);
    });

	simulationSpeed=gui.add(cntrls,"simulationSpeed",1,20).step(1).name("Βραδύτητα προσομοίωσης");
	simulationSpeed.onChange(function(newValue){
		simSpeed=newValue;
		defineSimulationSpeed();
    });
	
	showGrd=gui.add(cntrls,"showGrid").listen().name("Πλέγμα");
	showGrd.onChange(function(newValue){
		gridVisible=newValue;
		drawScene();
	});
	
	grdStep=gui.add(cntrls,"gridStep",1,5).step(1).name("Βήμα πλέγματος");
	grdStep.onChange(function(newValue){
		gridStep=newValue;
		drawScene();
    });

	lftSourcePos=gui.add(cntrls,"leftSourcePosition",1,20).step(1).name("Θέση αριστερής πηγής");
	lftSourcePos.onChange(function(newValue){
		source1X=source1Xcenter+(newValue-10)*20;
		setSource1Xpos();
    });

	rigtSourcePos=gui.add(cntrls,"rightSourcePosition",1,20).step(1).name("Θέση δεξιάς πηγής");
	rigtSourcePos.onChange(function(newValue){
		source2X=source2Xcenter+(newValue-10)*20;
		setSource2Xpos();
    });

	attenuation=gui.add(cntrls,"attenuation").listen().name("Εξασθένιση");
	attenuation.onChange(function(value){
		for(var i=0;i<fronts.length;i++){
			fronts[i].attenuation=value;
		}
		effectsOn=value;
	});
    
	noOfFrnts=gui.add(cntrls,"noOfFronts",1,maxNoOfFronts).step(1).name("Πλήθος μετώπων");
	noOfFrnts.onChange(function(newValue){
		noOfFronts=newValue;
		reset();
    });
	
    frntColor=gui.addColor(cntrls,"frontsColor").name("Χρώμα μετώπων");
    frntColor.onChange(function(value){
    	try{
		frontRed=parseInt(value[0]);
		frontGreen=parseInt(value[1]);
		frontBlue=parseInt(value[2]);
		showDebugInfo("Red="+parseInt(value[0])+" Green="+parseInt(value[1])+" Blue="+parseInt(value[2]));
    	}
    	catch(err){
    		alert(err.message);
    	}
		setFrontsColor();
		drawScene();
    });
    
    extView=gui.add(cntrls,"externalView").listen().name("Εξωτερικός παρατηρητής");
    extView.onChange(function(newValue){
    	externalView=newValue;
    	moveWagon=newValue && moveWagon;//if car on the move and externalView=false then stop movement
    	reset();
    	initGUI();
    });

    if(externalView){
        moveCar=gui.add(cntrls,"moveWagon").listen().name("Κίνηση βαγονιού");
        moveCar.onChange(function(newValue){
        	moveWagon=newValue;
        	if (moveWagon){
        		source2AdditionalSteps=30;
        	}
        	else{
        		source2AdditionalSteps=0;
        	}
        	reset();
        });
    }
}