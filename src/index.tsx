import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import App from './App';
import * as serviceWorker from './serviceWorker';
import {InstagramEmbed} from "./InstagramEmbed";
/*
ReactDOM.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
    document.getElementById('root')
);*/

function renderToElements(elements: HTMLCollectionOf<Element>) {
    Array.prototype.slice.call(elements).forEach(function (e: Element, _i) {
        ReactDOM.render(<InstagramEmbed shouldShowCaption={false} url={e.getAttribute('data-instagram-post-url') ?? ''} width={400} height={400}/>, e);
    })
}

renderToElements(document.getElementsByClassName('instagram-embed'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
