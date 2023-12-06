import  {createContext, useState} from "react";

export const languagesContext  = createContext();

export default function DisplayLanguagesContextContainer ({children}) {
    const [language, setLanguage] = useState('ukr')
    return (
        <languagesContext.Provider value={{language, setLanguage}}>
            {children}
        </languagesContext.Provider>
    )
}
