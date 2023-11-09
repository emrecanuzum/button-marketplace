import Image from "next/image";
import { ProtectedComponent } from "./components/protector";
import SignIn from "./components/sign";

export default function Home() {
  return (
    <main className="">
      <SignIn></SignIn>
      <ProtectedComponent></ProtectedComponent>
    </main>
  );
}
