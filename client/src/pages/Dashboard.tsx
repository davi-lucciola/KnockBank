import { useEffect } from "react"


export function DashboardPage() {
  // Tab Title
  useEffect(() => { document.title = 'Dashboard' }, [])
  
  return (
    <>
      <h1 className="">
        Dashboard
      </h1>
    </>
  ) 
}