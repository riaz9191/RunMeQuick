import { useEffect } from "react"

const useTitle = title =>{
    useEffect(()=>{
        document.title = `RunMeQuick | ${title}`;
    },[title])
}
export default useTitle;