import {Provider} from "react-redux";
import {configureStore, combineReducers} from "@reduxjs/toolkit";
import thunk from "redux-thunk";

import boardReducer from "./reducers/boardReducer";
import gameReducer from "./reducers/gameReducer";

const allReducers = combineReducers({
    boardReducer, gameReducer
});


const store = configureStore({
    reducer: allReducers,
    middleware: [thunk],
});

export default function Store (props) {
    return (
        <>
            <Provider store={store}>
                    {props.children}
            </Provider>
        </>
    )
}


