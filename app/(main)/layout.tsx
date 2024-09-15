import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import SessionProvider from "./SessionProvider";
import { NavBar } from "./NavBar";
import Menubar from "./MenuBar";
import Homepage from "./homepage";
import AdSidebar from "@/components/AdSidebar";

export default async function Layout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const session = await validateRequest();

    if (!session.user) {
      // If there's no session, render the Homepage component
      return <Homepage />;
    }

    return (<SessionProvider
    value={session}
    >
      <div className="flex min-h-screen flex-col">
            <NavBar />
        <div className="mx-auto max-w-8xl p-5 flex w-full grow gap-5">
          <Menubar className="sticky top-[5.25rem] h-fit hidden sm:block flex-none space-y-3 rounded-2xl bg-card px-3 py-5 lg:px-5 shadow-sm xl:w-80"/>
              {children}
        </div>
        <AdSidebar />
        <Menubar className="sticky bottom-0 flex w-full justify-center gap-5 border-t bg-card p-3 sm:hidden" />
      </div>
        
    </SessionProvider>
    );
  }