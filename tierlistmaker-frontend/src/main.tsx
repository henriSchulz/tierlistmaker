

import App from './App.tsx'
import './index.css'
import {BrowserRouter} from 'react-router-dom'

import { hydrate, render } from "react-dom";

const _App = (<BrowserRouter>
    <App/>
</BrowserRouter>)

const rootElement = document.getElementById("root");
if (rootElement?.hasChildNodes()) {
    hydrate(_App, rootElement);
} else {
    render(_App, rootElement);
}

// ReactDOM.createRoot(document.getElementById('root')!).render(
//
//     ,
// )
