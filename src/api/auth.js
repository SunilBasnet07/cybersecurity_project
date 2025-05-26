import baseApiUrl from "@/config/apiUrl";
import axios from "axios";

const signIn = async(data)=>{
    console.log(data);
    console.log(baseApiUrl);
    const response = await axios.post(`${baseApiUrl}/api/auth/login`,data);
    return response;
}
const signUp = async(data)=>{
    const response = await axios.post(`${baseApiUrl}/api/auth/register`,data);
    return response;
}

export {signIn,signUp}