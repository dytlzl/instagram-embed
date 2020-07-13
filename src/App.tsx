import React from 'react';
import './App.css';
import {InstagramEmbed} from "./InstagramEmbed";

function App() {
    const urls = [
        'https://www.instagram.com/p/CBhwoMXFSMn/',
        'https://www.instagram.com/p/CBR8TspnElF/',
        'https://www.instagram.com/p/ByH0AN1jwBi/'
    ]
    let elements = []
    for (const _url of urls) {
        elements.push(
            <div key={_url} className={'column'}>
                <InstagramEmbed shouldShowCaption={false} url={_url} width={400} height={400}/>
            </div>
        )
    }
    return (
        <div className={'grid'}>
            <div className={'row'}>
                {elements}
            </div>
        </div>
    );
}

export default App;　
