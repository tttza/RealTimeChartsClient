/// <reference lib="webworker" />

// import {signalR} from 'signalR.js';
// import * as signalR from '@microsoft/signalr/dist/esm/';
import * as signalR from '@microsoft/signalr';



addEventListener('transferchartdata', (data) => {
    this.data = data;
    console.log(data);
});

const connection = new signalR.HubConnectionBuilder()
    .withUrl('https://localhost:5001/chart')
    .build();

// connection.on('send', data => {
//     console.log(data);
// });

connection.on('transferchartdata', (data) => {
    this.data = data;
    console.log(data);
});

// connection.start();
    // .then(() => connection.invoke('send', 'Hello'));
// const streamingSubscription= new Observavle();
