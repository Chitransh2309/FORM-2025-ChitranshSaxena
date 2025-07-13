import { auth } from '../../../auth';
import { handleSignIn, handleSignOut } from '@/app/action/AuthActions';
import { Outfit } from 'next/font/google';

const outfit = Outfit({ subsets: ['latin'], weight: ['700'] });

export default async function AuthBtn({ pos }: { pos: string }) {
  const session = await auth();

  const baseStyle = `cursor-pointer w-[90px] h-[22px] sm:w-[100px] sm:h-[24px] md:w-[113px] md:h-[25px]  rounded-[55px] px-4 py-2 flex justify-center items-center gap-[10px] box-border
    shadow-[0px_4px_4px_rgba(0,0,0,0.25)] 
    bg-[linear-gradient(180deg,rgba(0,0,0,0.3)_0%,rgba(0,0,0,0)_100%),linear-gradient(90deg,#6182A5_0%,#61A986_100%)]
    bg-blend-plus-darker`;

  const textColor =
    pos === 'nav'
      ? 'text-white dark:text-white'
      : pos === 'hero'
      ? 'text-black dark:text-white'
      : 'text-[#61A986] dark:text-white';

  return (
    <>
      {session?.user ? (
        <form action={handleSignOut}>
          <button type="submit" className={`${baseStyle} ${textColor}`}>
            <span
              className={`${outfit.className} text-[10px] sm:text-[11px] md:text-[12px]
 leading-[15px] font-bold`}
            >
              SIGN OUT
            </span>
          </button>
        </form>
      ) : (
        <form action={handleSignIn}>
          <button type="submit" className={`${baseStyle} ${textColor}`}>
            <span
              className={`${outfit.className} text-[12px] leading-[15px] font-bold`}
            >
              SIGN IN
            </span>
          </button>
        </form>
      )}
    </>
  );
}
