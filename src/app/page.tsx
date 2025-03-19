"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import FoodMenu from "../features/(food_menu)/FoodMenu";
import OrderList from "../features/(orders)/OrderList";

export default function Home() {

  const [pageStatus, setPageStatus] = useState(2);

  return(
    <div className="flex">
      <Sidebar pageStatus={pageStatus} setPageStatus={setPageStatus}/>
      {pageStatus === 1 && (
        <FoodMenu />
      )}
      {pageStatus === 2 && (
        <OrderList />
      )}
    </div>
  )
}