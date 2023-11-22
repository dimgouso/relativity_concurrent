/**
 * 
 */
function waveFront(x,y,cntx,attenuationSteps){
	this.xCenter=x;
	this.yCenter=y;
	this.maxDirections=36;
	this.mDirection=0;
	this.mCntx=cntx;
	this.dR=4;
	this.mRed=255;
	this.mGreen=0;
	this.mBlue=0;
	this.mSteps=attenuationSteps;
	this.mCurrentStep=0;
	this.mColorSteps=this.mSteps;
	this.mCurrentColorStep=0;
	this.R=this.mCurrentStep*this.dR;
	this.attenuation=frontsAttenuation;
	this.edgeReached=false;
	
	var shiftR=0;
	var frontApperture=Math.PI/12;
	var angleToUse=this.mDirection*2*Math.PI/this.maxDirections;
	
	this.setDirection=function(newDirection){
		this.mDirection=newDirection % this.maxDirections;
		angleToUse=this.mDirection*2*Math.PI/this.maxDirections;
	};

	this.propagate=function(){
		if(!this.edgeReached){
			if(shiftR==0){
				shiftR=1;
				this.R=this.R+this.dR/2;
			}
			else{
				shiftR=0;
				this.setCurrentStep(this.mCurrentStep+2);
			}
		}
		else{
			if(shiftR==0){
				shiftR=1;
				this.R=this.R+this.dR/2;
			}
			else{
				shiftR=0;
				this.R=this.R-this.dR/2;
			}
		}
	};
	
	this.setCurrentStep=function(currentStep){
		this.mCurrentStep=currentStep;
		this.mCurrentColorStep=currentStep;
		this.R=this.mCurrentStep*this.dR;
	};

	this.show=function(){
		if (this.R>0){
			this.setDrawingColor();
			this.mCntx.beginPath();
			var th1=-frontApperture+angleToUse;
			var th2=frontApperture+angleToUse;
			this.mCntx.arc(this.xCenter, this.yCenter, this.R, th1, th2);
			this.mCntx.stroke();
		}
	};

	this.setDrawingColor=function(){
		var RedToUse=this.mRed;
		var GreenToUse=this.mGreen;
		var BlueToUse=this.mBlue;			
		if (this.attenuation){
			RedToUse=Math.min(255,parseInt(this.mCurrentColorStep*(255-this.mRed)/this.mColorSteps)+this.mRed);
			GreenToUse=Math.min(255,parseInt(this.mCurrentColorStep*(255-this.mGreen)/this.mColorSteps)+this.mGreen);
			BlueToUse=Math.min(255,parseInt(this.mCurrentColorStep*(255-this.mBlue)/this.mColorSteps)+this.mBlue);			
		}
		this.mCntx.strokeStyle="rgb("+RedToUse+","+GreenToUse+","+BlueToUse+")";
	};
	
	this.setFrontColor=function(newRed,newGreen,newBlue){
		this.mRed=newRed;
		this.mGreen=newGreen;
		this.mBlue=newBlue;
	};
}