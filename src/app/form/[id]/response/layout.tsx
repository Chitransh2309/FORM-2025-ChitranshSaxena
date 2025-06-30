import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";


export default function ResponseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return(
    <SessionProvider>
      <Toaster />
      {children}
    </SessionProvider>
  )
}