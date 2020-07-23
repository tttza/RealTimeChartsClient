import { Injectable } from '@angular/core';
// import * as signalR from '@microsoft/signalr/dist/webworker/signalr';
import * as signalR from '@microsoft/signalr';
// importScripts('script.js');
import { ChartModel } from '../_interfaces/chart-model';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  public data: ChartModel[];

  private hubConnection: signalR.HubConnection;

  async startWorker() {
    if (typeof Worker !== 'undefined') {
      // Create a new
      // const worker = new Worker('../workers/chart.worker.ts', { type: 'module' });
      const worker = new Worker('../workers/chart2.worker.ts', { type: 'module' });
      // const worker = new Worker('../../../node_modules/@microsoft/signalr/dist/webworker/signalr.js', { type: 'module' });
      // const worker = new Worker('../../../node_modules/@microsoft/signalr/dist/webworker/signalr.js', { type: 'module' });

      // worker.onmessage = ({ data }) => {
      //   this.data = data;
      // };
      // worker.postMessage('hello');
    } else {
      // Web Workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
  }
  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5001/chart')
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err));
  }

  public addTransferChartDataListener = () => {
    this.hubConnection.on('transferchartdata', (data) => {
      this.data = data;
      console.log(data);
    });
  }
}
