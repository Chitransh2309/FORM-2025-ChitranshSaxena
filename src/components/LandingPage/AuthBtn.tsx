<<<<<<< HEAD
import React from 'react'
import { auth,signOut,signIn} from '../../../auth';

export default async function AuthBtn({pos}:{pos:string}) {
    const session= await auth();
  return  (
    <>
      {session&&session?.user?(
                    <form action={async()=>{
                        "use server";
                        await signOut({redirectTo:'/'})   
                    }}>
                        <button type='submit' className={`cursor-pointer w-[100px] mb-2 rounded-2xl border-solid border-3 box-border h-7 text-sm ${pos=="nav"?"shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] bg-[#61a986] border-[#61a986] text-white":((pos=="hero")?"border-black text-black mt-2 dark:border-white dark:text-white":"border-white bg-white text-[#61a986] mt-2")}`}>Sign out</button>
                    </form>
            ):(
                <form action={async ()=>{
                    "use server";
                    await signIn('google',{redirectTo:'/'})
                }}>
                    <button type='submit' className={`cursor-pointer w-[100px] mb-2 rounded-2xl border-solid border-3 box-border h-7 text-sm ${pos=="nav"?"shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] bg-[#61a986] border-[#61a986] text-white":((pos=="hero")?"border-black text-black mt-2 dark:border-white dark:text-white":"border-white bg-white text-[#61a986] mt-2")}`}>Sign in</button>
                </form>
            )}
=======
import { auth } from "../../../auth";
import { handleSignIn, handleSignOut } from "@/app/action/AuthActions";

export default async function AuthBtn({ pos }: { pos: string }) {
  const session = await auth();

  return (
    <>
      {session?.user ? (
        <form action={handleSignOut}>
          <button
            type="submit"
            className={`cursor-pointer w-[100px] mb-2 rounded-2xl border-solid border-3 box-border h-7 text-sm ${
              pos == "nav"
                ? "shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] bg-[#61a986] border-[#61a986] text-white"
                : pos == "hero"
                ? "border-black text-black mt-2 dark:border-white dark:text-white"
                : "border-white bg-white text-[#61a986] mt-2"
            }`}
          >
            Sign out
          </button>
        </form>
      ) : (
        <form action={handleSignIn}>
          <button
            type="submit"
            className={`cursor-pointer w-[100px] mb-2 rounded-2xl border-solid border-3 box-border h-7 text-sm ${
              pos == "nav"
                ? "shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] bg-[#61a986] border-[#61a986] text-white"
                : pos == "hero"
                ? "border-black text-black mt-2 dark:border-white dark:text-white"
                : "border-white bg-white text-[#61a986] mt-2"
            }`}
          >
            Sign in
          </button>
        </form>
      )}
>>>>>>> cdbf50f (created a hamburger menu for landing page.)
    </>
  )  
}
