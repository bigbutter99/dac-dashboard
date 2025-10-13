import { jsx as _jsx } from "react/jsx-runtime";
import * as ReactDOM from 'react-dom';
import App from './App';
const rootElement = document.getElementById('root');
if (rootElement) {
    ReactDOM.render(_jsx(App, {}), rootElement);
}
