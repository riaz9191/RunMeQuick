import { useEffect } from "react"

const useTitle = title =>{
    useEffect(()=>{
        document.title = `GitFormed | ${title}`;
    },[title])
}
export default useTitle;