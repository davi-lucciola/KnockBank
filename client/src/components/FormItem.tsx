import React from "react"

type FormItemProps = {
  children: React.ReactNode
  errorMessage: string | undefined 
}

export const FormItem: React.FC<FormItemProps> = ({ children, errorMessage }: FormItemProps) => {
  return (
    <div className="flex flex-col gap-1">
      {children}
      <small className="text-red h-1"> 
        {errorMessage} 
      </small>
    </div>
  )
}