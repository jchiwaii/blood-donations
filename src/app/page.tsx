import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Home = () => {
  return (
    <div className="p-5">
      <h1>Home</h1>
      <Button variant={"default"} className="p-5 m-4">
        {" "}
        Shadcn Default
      </Button>
      <Input placeholder="Sample Input" />
    </div>
  );
};

export default Home;
