/**
 * 
 */

function clock(x,y,context){
	var HandLength=0.9;
	this.m_X=x;
	this.m_Y=y;
	this.m_Radius=40;
	this.m_Value=0;
	this.m_Cycles=0;
	this.m_MinValue=0;
	this.m_MaxValue=60;
	this.m_DiscColor;
	this.m_OtherColor;
	this.m_DataColor;
	this.cntx=context;
	this.m_CyclesValueOnTopLeft=false;
	this.m_FilledSurface=true;
	
	this.setValue=function(vNewValue){
		var NewValue,additionalCycles=0;
		NewValue=vNewValue;
		if(NewValue>this.m_MaxValue){
			additionalCycles=parseInt(NewValue/this.m_MaxValue);
			NewValue=NewValue % this.m_MaxValue;
			this.m_Cycles+=additionalCycles;
		}
		else if(NewValue<this.m_MinValue){
			additionalCycles=parseInt(Math.abs(NewValue)/this.m_MaxValue);
			NewValue=Math.abs(NewValue) % this.m_MaxValue;
			this.m_Cycles-=additionalCycles;
			if(this.m_Cycles<0){
				this.m_Cycles=0;
				NewValue=this.m_MinValue;
			}
		}
		this.m_Value=NewValue;
		this.show();
	};
	
	this.setDiscColor=function(vNewValue){
	  this.m_DiscColor=vNewValue;
	  this.show();
	};

	this.setDataColor=function(vNewValue){
	  //Hide
	  this.m_DataColor=vNewValue;
	  this.show();
	};
	
	this.show=function(){
	  var NoOfLines=12,Angle,i;
	  //Περίγραμμα ρολογιού
	  this.cntx.beginPath();
	  this.cntx.strokeStyle="#000000";
	  this.cntx.fillStyle = "#faeb00";	  
	  this.cntx.arc(this.m_X,this.m_Y,this.m_Radius,0,2*Math.PI);
	  this.cntx.stroke();
	  if(this.m_FilledSurface) this.cntx.fill();
	  //Σαρωμένη επιφάνεια ρολογιού
	  Angle=Math.PI*(parseInt(360*this.m_Value/(this.m_MaxValue-this.m_MinValue)+90) % 360)/180;
	  if(Angle==0) Angle=0.0001; //Αυτή η εντολή χρειάζεται γιατί στα 15 sec γεμίζει όλο τον κύκλο και όχι μόνο το πρώτο τεταρτημόριο
	  if(this.m_FilledSurface){
	    this.cntx.beginPath();
	    this.cntx.fillStyle="#ff004b";//e39e9e
	    this.cntx.arc(this.m_X,this.m_Y,this.m_Radius,-Math.PI/2,Angle-Math.PI);
	    this.cntx.lineTo(this.m_X,this.m_Y);
	    this.cntx.fill();
	  }
	  //Δείκτης ρολογιού
	  this.cntx.strokeStyle="#000000";
	  this.cntx.beginPath();
	  this.cntx.moveTo(this.m_X,this.m_Y);
	  this.cntx.lineTo(this.m_X-HandLength*this.m_Radius*Math.cos(Angle),this.m_Y-HandLength*this.m_Radius*Math.sin(Angle));
	  this.cntx.stroke();
	  //Κλίμακα ρολογιού
	  this.cntx.strokeStyle="#000000";
	  this.cntx.beginPath();
	  for(i=0;i<NoOfLines;i++){
	    Angle=2*Math.PI*i/NoOfLines;
	    this.cntx.moveTo(this.m_X+HandLength*this.m_Radius*Math.cos(Angle),this.m_Y+HandLength*this.m_Radius*Math.sin(Angle));
	    this.cntx.lineTo(this.m_X+this.m_Radius*Math.cos(Angle),this.m_Y+this.m_Radius*Math.sin(Angle));
	  }
	  this.cntx.stroke();
	  //Εμφάνιση περιστροφών ρολογιού
	  this.cntx.font="16px Georgia";
	  this.cntx.fillStyle="#0000ff";
	  var offset=0;
	  if(this.m_CyclesValueOnTopLeft) offset=-this.m_Radius;
	  this.cntx.fillText(this.m_Cycles,this.m_X+offset,this.m_Y+offset);
	};
}