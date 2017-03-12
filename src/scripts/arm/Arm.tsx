// -------------------------------------------------------------------------- //
declare let module: { hot: any };
// -------------------------------------------------------------------------- //
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {AppContainer} from 'react-hot-loader';

import App from '../app/App';

const render = (Component) => {
    ReactDOM.render(
        <AppContainer>
            <Component/>
        </AppContainer>,
        document.getElementById('root')
    );
};

render(App);

if (module.hot) {
    module.hot.accept('../app/App', () => {
        render(App)
    });
}