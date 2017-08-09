import {Injectable} from "@angular/core"; 


@Injectable()
export class ScrollProvider {    
  node;    
  previousScrollHeightMinusTop: number;    
  readyFor: string;    
  toReset: boolean = false;    
  constructor() {            
  } 

  init(node) {    
    this.node = node;    
    this.previousScrollHeightMinusTop = 0;    
    this.readyFor = 'up';  
  } 

  restore() {    
    if(this.toReset) {      
         if (this.readyFor === 'up') {  
              this.node.scrollTop = this.node.scrollHeight - this.previousScrollHeightMinusTop; 
         }        
         this.toReset = false;    
    }  
  } 
   
  prepareFor(direction) {    
    this.toReset = true;    
    this.readyFor = direction || 'up'; 
    this.previousScrollHeightMinusTop = this.node.scrollHeight - this.node.scrollTop; 
  }
}