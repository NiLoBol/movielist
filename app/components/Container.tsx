import React from 'react'
type PropsType ={
    children: React.ReactNode
};
export default function Container(props:PropsType) {
  return (
    <div className='container mx-auto'>{props.children}</div>
  )
}
