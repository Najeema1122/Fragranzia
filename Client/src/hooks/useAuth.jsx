import { useContext } from "react" 
import { AuthContext } from "../Context/AuthContext.js"

const useAuth = () => {
    return useContext(AuthContext)
}

export default useAuth
