import {Injectable, EventEmitter} from '@angular/core';

@Injectable()
export class WorkerService {
  private timeout = 3000;
  private worker: any;
  private timer;

  public onError = new EventEmitter<any>();
  public onSuccess = new EventEmitter<any>();
  public onTimeout = new EventEmitter<any>();

  runWorker(code) {
    if (this.worker) {
      this.worker.terminate();
      clearTimeout(this.timer);
    }

    const blobURL = URL.createObjectURL(new Blob([code], {type: 'application/javascript'}));
    this.worker = new Worker(blobURL);

    this.timer = setTimeout(() => {
      this.onTimeout.emit({message: 'Code never completes'});
      this.worker.terminate();
    }, this.timeout);

    this.worker.onmessage = (e) => {
      this.onSuccess.emit(e.data);
      clearTimeout(this.timer);
    };

    this.worker.onerror = (err) => {
      this.onError.emit({message: err.message});
      clearTimeout(this.timer);
    };
  }

}


