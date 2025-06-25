'use client';

import { handleSignIn, handleSignOut } from '../../app/action/auth-actions';

export default function AuthBtn({ session, pos }: { session: any; pos: string }) {
  return (
    <>
      {session?.user ? (
        <form action={handleSignOut}>
          <button type="submit" className={`...`}>Sign out</button>
        </form>
      ) : (
        <form action={handleSignIn}>
          <button type="submit" className={`...`}>Sign in</button>
        </form>
      )}
    </>
  );
}
