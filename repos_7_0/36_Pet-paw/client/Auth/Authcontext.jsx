import { createContext, useState } from "react";

const Authcontext = createContext()
export default Authcontext

export const AuthProvider =  ({ children }) => {

    const [ user, setUser ] = useState(null)

    const data = { user }

    return (
        <Authcontext.Provider value={data}>
            {children}
        </Authcontext.Provider>
    )
}