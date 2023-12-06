import Router from "./router/Router";
import "./scss/index.scss"
import {useEffect} from "react";
import DisplayLanguagesContextContainer from '../src/context/index'
import Store from '../src/store'

function App() {
    useEffect(() => {
    }, [])

    return (
        <div className="App">
            <Store>
                <DisplayLanguagesContextContainer>
                    <Router/>
                </DisplayLanguagesContextContainer>
            </Store>
        </div>
    );
}

export default App;
