import React, { InputHTMLAttributes, SelectHTMLAttributes, forwardRef } from "react"


type InputPropsBase = { 
  label: string | undefined 
  children?: React.ReactNode
};

type InputPropsInput = InputHTMLAttributes<HTMLInputElement> & InputPropsBase;
type InputPropsSelect = SelectHTMLAttributes<HTMLSelectElement> & InputPropsBase;

type RefElement = HTMLInputElement | HTMLSelectElement;

export const Input: React.FC<InputPropsInput | InputPropsSelect> = 
  forwardRef<RefElement, InputPropsInput | InputPropsSelect>(
  ({ name, label, children, ...rest }, ref) => {
  return (
    <>
      {label && (<label htmlFor={name}> {label} </label>)}
      {!children ?  
        <input 
          id={name} 
          name={name}
          ref={ref as React.Ref<HTMLInputElement>}
          className="border border-gray-100 rounded-lg py-2 px-2 focus:outline-blue text-lg "
          {...rest as InputPropsInput} 
        /> :
        <select 
          id={name} 
          name={name} 
          ref={ref as React.Ref<HTMLSelectElement>}
          className="border border-gray-100 rounded-lg py-2 px-2 focus:outline-blue text-lg"
          {...rest as InputPropsSelect} 
        >
          {children}
        </select>
      }
    </>
  )
})
