import { Component, OnDestroy, AfterViewInit, Output, EventEmitter, ElementRef, Input, SimpleChanges, SimpleChange } from '@angular/core';

@Component({
  selector: 'ngx-tiny-mce',
  template: '',
})
export class TinyMCEComponent implements OnDestroy, AfterViewInit {

  @Output() editorKeyup = new EventEmitter<any>();
  @Input('data') data;
  editor: any;
  constructor(private host: ElementRef) { }
  ngAfterViewInit() {
    tinymce.init({
      target: this.host.nativeElement,
      plugins: ['link', 'paste', 'table'],
      skin_url: 'assets/skins/lightgray',
      setup: editor => {
        this.editor = editor;
        editor.on('keyup', () => {
          this.editorKeyup.emit(editor.getContent());
        });
        setTimeout(() => {
          editor.setContent(this.data);
        }, 500);
      },
      height: '320',
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    const data: SimpleChange = changes.data;
    this.data = data.currentValue;
    setTimeout(() => {
      this.editor.setContent(this.data);
    }, 500);
  }

  ngOnDestroy() {
    tinymce.remove(this.editor);
  }
}
