"use client"

import React, { useEffect } from 'react'
import { backupuser } from '../data/action/serversubmit';

function page() {
 
  useEffect(() => {
    async function name() {
      const user: any =await backupuser()
      console.log(user);
      
    }
    name()
  }, [])
  
  
  return (
    <div>
      
    </div>
  )
}

export default page
