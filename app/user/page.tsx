"use client"

import { useSession } from 'next-auth/react';
import React from 'react'

function page() {
    const {data:section} =useSession()

    if(section){
      console.log(section.user);
      return (
        <div>
          {section.user?"have user":"dont have user"}
        </div>
    )
    }else{
      console.log("no user logged in");
      return(
        <div>no user logged in</div>
      )
    }
  
}

export default page
