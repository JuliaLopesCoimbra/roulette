"use client";
import React, { Suspense } from "react";

import SignIn from "./pages/user/signIn/page";

export default function Home() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
            <SignIn />
        </Suspense>
    );
}
