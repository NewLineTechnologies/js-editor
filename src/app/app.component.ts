import {Component, OnInit, ViewEncapsulation, ViewChild} from '@angular/core';
import {WorkerService} from "app/worker.service";

@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  template: `
    <div id="content">

      <div id="inputs">
        <label for="data">Sample:</label>
        <input id="data" name="data" type="text" [(ngModel)]="form.data" #data="ngModel"
               (ngModelChange)="onSampleChange()"/>
      </div>

      <ace-editor id="editor" #editor
                  [mode]="'javascript'"
                  [theme]="'chrome'"
                  [readOnly]="false"
                  [autoUpdateContent]="true"
                  [durationBeforeCallback]="100"
                  (textChanged)="onCodeChanged($event)">

      </ace-editor>

      <div id="errors" [hidden]="!error">
        {{error}}
      </div>

      <div id="output" [hidden]="!output">
        {{output}}
      </div>


    </div>`,
  styleUrls: ['./app.component.styles.css']
})
export class AppComponent implements OnInit {

  @ViewChild('editor') editor;

  private code = "function(sample, output) {\n output.a = sample;  \n}";
  private safeData: string;

  public error: string;
  public output: string;
  public form = {data: 'This is a test message'};

  constructor(private workerService: WorkerService) {
    this.workerService.onError.subscribe((err) => this.error = err.message);
    this.workerService.onSuccess.subscribe((result) => this.output = JSON.stringify(result));
    this.workerService.onTimeout.subscribe((err) => this.error = err.message);
  }

  ngOnInit(): void {
    this.editor.getEditor().setValue(this.code, -1);
    this.editor.getEditor().commands.on("exec", (e) => this.onEditorExec(e));
    this.safeData = this.escapeQuotes(this.form.data);

    this.rerunCode();
  }

  onCodeChanged($event) {
    this.code = $event;
    this.rerunCode();
  }

  onSampleChange() {
    this.safeData = this.escapeQuotes(this.form.data);
    this.rerunCode();
  }

  rerunCode() {
    this.error = this.output = '';
    const code = 'var output = {}; (' + this.code + ')(\'' + this.safeData + '\', output);  postMessage(output);';
    this.workerService.runWorker(code);
  }

  escapeQuotes(str: string) {
    return str.replace(/\\([\s\S])|(')/g, "\\$1$2");
  }

  onEditorExec(e){
    const rowCol = this.editor.getEditor().selection.getCursor();
    if ((rowCol.row == 0) || ((rowCol.row + 1) ==  this.editor.getEditor().session.getLength())) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

}
