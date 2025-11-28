import React from "react";
import PublicHeader from "@/components/layout/public-header";
import PublicFooter from "@/components/layout/public-footer";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex min-h-screen flex-col bg-background font-sans text-foreground selection:bg-primary selection:text-primary-foreground">
            <PublicHeader />
            <main className="flex-1">{children}</main>
            <PublicFooter />
        </div>
    );
};

export default PublicLayout;
