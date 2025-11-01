import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SignInButton from "./_components/signin-button";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-5">
      <div>
        Header
        <div>
          <SignInButton />
        </div>
      </div>

      <div>
        <div>donate blood, save lives</div>
        <img src="/path/to/image.jpg" alt="Donate Blood" />

        <Button variant={"default"} className="p-5 m-4">
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default Home;
