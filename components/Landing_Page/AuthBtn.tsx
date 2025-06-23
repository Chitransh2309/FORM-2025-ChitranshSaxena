import React from 'react'
import { auth,signOut,signIn} from '../../auth';

export default async function AuthBtn({pos}:{pos:string}) {
    const session= await auth();
  return (
    <>
      {session&&session?.user?(
                    <form action={async()=>{
                        "use server";
                        await signOut({redirectTo:'/'})   
                    }}>
                        <button type='submit' className={`cursor-pointer w-[100px] mb-2 rounded-2xl border-solid border-3 box-border h-7 text-sm ${pos=="nav"?"shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] bg-[#61a986] border-[#61a986] text-white":((pos=="hero")?"border-black text-black mt-2":"border-white bg-white text-[#61a986] mt-2")}`}>Sign out</button>
                    </form>
            ):(
                <form action={async ()=>{
                    "use server";
                    await signIn('google',{redirectTo:'/'})
                }}>
                    <button type='submit' className={`cursor-pointer w-[100px] mb-2 rounded-2xl border-solid border-3 box-border h-7 text-sm ${pos=="nav"?"shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] bg-[#61a986] border-[#61a986] text-white":((pos=="hero")?"border-black text-black mt-2":"border-white bg-white text-[#61a986] mt-2")}`}>Sign in</button>
                </form>
            )}
    </>
  )
}
