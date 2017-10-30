import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {WorkerService} from "./worker.service";
import {FormsModule} from "@angular/forms";
import { AceEditorModule } from 'ng2-ace-editor';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AceEditorModule
  ],
  bootstrap: [AppComponent],
  providers: [
    WorkerService,
    { provide: APP_BASE_HREF, useValue: '/' },
  ],
})
export class AppModule {
}
