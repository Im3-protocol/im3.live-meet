import { useEffect, useState } from "react";
import { axiosInstance } from "../pages/api/base";


const useGetConfigData = (slug : string | string[] ) => {
    const [ configData, setConfigData ] = useState<any>();
    
    useEffect(() => {
        fetchConfigData(slug);
    }, [slug])
    
    const fetchConfigData = async (slug : string | string[] ) => {
        try {
            console.log("This is Slug in Hook, ", slug);
            const response = await axiosInstance.get(`/api/v1/rooms/getUiConfig/${slug}`);
            setConfigData(response.data);
            console.log("This is Response from Hook, ", response);
         } catch (error) {
             console.log(error);
         }
    }
    return configData;
}

export default useGetConfigData;