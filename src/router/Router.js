import {BrowserRouter, useRoutes, Navigate} from 'react-router-dom';
import HomePage from '../pages/HomePage';
import GamePages from "../pages/GamePages";


function Routes() {
    return useRoutes([
            {
                path: '/',
                children: [
                    {
                        path: '',
                        element: <Navigate to="chartae/"/>,
                    },
                    {
                        path: 'chartae/',
                        element: <HomePage/>,
                    },
                ]
            },
            {
                path: 'chartae/game',
                element: <GamePages/>
            }
        ]
    )
}

export default function Router() {
    return (
        <BrowserRouter>
            <Routes/>
        </BrowserRouter>
    )
}