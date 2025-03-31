"use client";

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import FoodMenu from "../features/(food_menu)/FoodMenu";
import OrderList from "../features/(orders)/OrderList";
import { useRouter } from "next/navigation";
import { DropdownMenu,DropdownMenuContent,DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import jwt from "jsonwebtoken";

export default function Home() {
  const router = useRouter();
  
  const [pageStatus, setPageStatus] = useState(1);
  const [currUser, setCurrUser] = useState({
    name: ""
  });

  useEffect(() => {
    !window.localStorage.authToken ? router.push("/login") : setCurrUser(jwt.decode(window.localStorage.authToken))
  }, []);

  const signout = () =>{
    router.push("/login");
  }

  return (
    <div className="flex">
      <Sidebar pageStatus={pageStatus} setPageStatus={setPageStatus} />
      <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-full outline-none transition duration-[.1s] border overflow-hidden right-[50px] top-[20px] absolute">
          <img
            src="./profile.jpg"
            className="w-[45px] h-[45px]"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[188px] h-[104px] p-[16px] border absolute ml-[-100px] mt-[20px] bg-white rounded-[5px] flex flex-col items-center">
          <div>{currUser.name}</div>
          <div
            className="border mt-[10px] w-fit px-[5px] rounded-[5px] cursor-pointer"
            onClick={signout}
          >
            Sign out
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      {pageStatus === 1 && <FoodMenu />}
      {pageStatus === 2 && <OrderList />}
    </div>
    </div>
  );
}
