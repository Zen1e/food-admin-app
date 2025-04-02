import { Dispatch, SetStateAction } from "react";
import {LayoutDashboard,Truck,Settings} from "lucide-react";

type Props = {
    pageStatus:number,
    setPageStatus:Dispatch<SetStateAction<number>>
}

export default function Sidebar(props:Props) {
    const {pageStatus, setPageStatus} = props;
  return (
    <div className="h-screen w-[205px] px-[20px] py-[36px]">
      <div className="flex gap-[15px]">
        <img src="./logo.svg" alt="" />
        <div>
          <div className="font-bold text-[20px]">
            <span className="text-black">Nom</span>
            <span className="text-red-500">Nom</span>
          </div>
          <div className="text-gray-400 text-[12px] mt-[-5px]">Swift delivery</div>
        </div>
      </div>

      <div className="mt-[100px] gap-[20px] flex flex-col">
        <div className="flex w-full h-[45px] border pl-[25px] items-center rounded-full gap-[10px] cursor-pointer" style={pageStatus === 1 ? {background: "#111111"} : {}} onClick={()=>setPageStatus(1)}>
            <LayoutDashboard stroke={pageStatus === 1 ? "white" : "black"} strokeWidth={1}/>
            <div className={pageStatus === 1 ? "text-white" : "text-black"}>Food Menu</div>
        </div>
        <div className="flex w-full h-[45px] border pl-[25px] items-center rounded-full gap-[10px] cursor-pointer" style={pageStatus === 2 ? {background: "#111111"} : {}} onClick={()=>setPageStatus(2)}>
            <Truck stroke={pageStatus === 2 ? "white" : "black"} strokeWidth={1}/>
            <div className={pageStatus === 2 ? "text-white" : "text-black"}>Orders</div>
        </div>
        <div className="flex w-full h-[45px] border pl-[25px] items-center rounded-full gap-[10px] cursor-pointer" style={pageStatus === 3 ? {background: "#111111"} : {}} onClick={()=>setPageStatus(3)}>
            <Settings stroke={pageStatus === 3 ? "white" : "black"} strokeWidth={1}/>
            <div className={pageStatus === 3 ? "text-white" : "text-black"}>Settings</div>
        </div>
      </div>

    </div>
  );
}
