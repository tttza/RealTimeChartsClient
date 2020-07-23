/// <reference lib="webworker" />

// import {signalR} from 'signalR.js';
// import * as signalR from '@microsoft/signalr/dist/webworker/signalr';
import { ChartModel } from '../_interfaces/chart-model';
import { Observable } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { AnonymousSubject } from 'rxjs/internal/Subject';
// import { HubConnection } from '@microsoft/signalr';



export class StreamingClass {
    private hubConnection: signalR.HubConnection;

    private workerInstance;
    private href = 'https://localhost:5001/chart';

    private streamingSubscription: signalR.ISubscription<[]>;
    data: ChartModel[];


    dataChanged = new signalR.Subject<ChartModel[]>();


    constructor(workerInstance) {
        this.workerInstance = workerInstance;

        this.connectHub()
            .subscribe({
                next(data) {
                    this.data = data;
                    this.workerInstance.postMessage(this.data);
                },
                error() {

                },
                complete() {

                }
            });

        this.workerInstance.onmessage = (event) => {
            const streamingId = '1';
            const requestData = event.data as StreamingWorkerRequest;
            if (requestData.action === StreamingWorkerAction.StartStreaming) {
                this.clearCurrentSubscription();
                this.streamingSubscription = this.startStreaming(streamingId);
            }
        };
    }

    private clearCurrentSubscription() {
        if (this.streamingSubscription) {
            this.streamingSubscription.dispose();
        }
    }

    private startStreaming(streamingId: string): signalR.ISubscription<ChartModel[]> {
        return this.hubConnection.stream<ChartModel[]>('Stream', streamingId).subscribe({
            next: data => {
                this.workerInstance.postMessage({
                    type: ResponseMessageType.StreamingSuccessResult,
                    data
                } as StreamingWorkerResponse);
            },
            complete: () => {
                console.log('complete');
            },
            error: error => {
                this.workerInstance.postMessage({
                    type: ResponseMessageType.StreamingError,
                    error
                } as StreamingWorkerResponse);
            }
        });
    }

    private connectHub(): signalR.Subject<ChartModel[]> {
        // standard connection to hub...
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(this.href)
            .build();


        connection.on('transferchartdata', (data) => {
            this.data = data;
            console.log(data);
            this.dataChanged.next(data);
        });
        connection.start();
        return this.dataChanged;
    }

}

// web worker event listener
addEventListener('message', event => {
    // const requestData = event.data as StreamingWorkerRequest;
    // console.log(event);
    // if (requestData.action === StreamingWorkerAction.EstablishConnection) {
    // requestData.workerInstance = self;
    const streamingClass = new StreamingClass(self);
}
    // }
);

addEventListener('transferchartdata', (event: any) => {

    const streamingClass = new StreamingClass(event);
});

const streamingClass = new StreamingClass(self);

class StreamingWorkerRequest {
    public data: ChartModel[];
    action = 'data';
    workerInstance: typeof globalThis;
    baseHref: string;



}
class StreamingWorkerAction {
    static EstablishConnection = 'data';
    static StartStreaming: string;
}

class ResponseMessageType {
    static StreamingSuccessResult: any;
    static ConnectingError: any;
    static StreamingError: any;

}

class StreamingWorkerResponse {
    type: any;
    error?: any;
    data?: any;

}
