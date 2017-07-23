import { Directive, ElementRef, Renderer, HostListener } from '@angular/core';

/*
  Generated class for the ImageThumbGallery directive.

  See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
  for more info on Angular 2 Directives.
*/
@Directive({
  selector: '[image-thumb-gallery]' // Attribute selector
})
export class ImageThumbGallery {

  th:number;
  tw:number;
  ih:number;
  iw:number;
  nh:number;
  nw:number;
  hd:number;
  wd:number;

  constructor(public element: ElementRef, public renderer: Renderer) {
    // console.log('Hello ImageThumbGallery Directive');
  }
  @HostListener('window:resize', ['$event.target']) 
  onResize() {
  	this.setHeight();
  }
  ngOnInit() {
  	this.setHeight();
  }
  setHeight() {
	this.th = this.tw = this.element.nativeElement.parentNode.offsetWidth;
    this.renderer.setElementStyle(this.element.nativeElement.parentNode, 'height', this.th + 'px');
  }

}
