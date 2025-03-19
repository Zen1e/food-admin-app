import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import axios from "axios";
import { useEffect, useState } from "react";

export default function OrderList() {
  const [orders, setOrders] = useState();
  const [sending, setSending] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:3001/order/");
        setOrders(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = (index,e) => {
    const newStatus = e.target.value;
    setSending(index);

    setOrders((prevOrders) => {
        const updatedOrders = prevOrders.map((order, i) =>
          i === index ? { ...order, status: newStatus } : order
        );
    
        updateStatus(updatedOrders[index]);
        return updatedOrders;
      });

    
  }
  const updateStatus = async(el) => {
    const response = await axios.put("http://localhost:3001/order/status",{
        id: el._id,
        status: el.status,
    })
    console.log(response);
    setSending(null);
  }
  
  return (
    <div className="w-[calc(100vw-205px)] bg-gray-100">
      <div className="w-full h-[60px] flex">
        <img
          src="./profile.jpg"
          className="rounded-full absolute w-[50px] mt-[10px] right-[30px]"
        />
      </div>
      <div className="w-full h-fit p-[30px]">
        <div className="bg-white w-full h-screen rounded-[20px] border">
          <div className="border-b flex w-full justify-between py-[10px] px-[20px] items-center">
            <div className="flex flex-col">
              <div className="text-[25px] font-bold">Orders</div>
              <div className="text-[13px] text-gray-500">X items</div>
            </div>
            <div className="flex h-full gap-[20px]">
              <div className="py-[10px] px-[20px] border rounded-full">
                Date filter
              </div>
              <div className="py-[10px] px-[20px] bg-black text-white rounded-full">
                Change delivery state
              </div>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <input
                    type="checkbox"
                    className="mt-[4px] ml-[10px]"
                    name="select_all"
                  />
                </TableHead>
                <TableHead className="w-[80px]">№</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Food</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Delivery address</TableHead>
                <TableHead>Delivery state</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                {orders && orders.map((el,index) => (
                    <TableRow key={index} className="w-[50px]">
                        <TableCell><input type="checkbox" className="mt-[4px] ml-[10px]"/></TableCell>
                        <TableCell>{index}</TableCell>
                        <TableCell>{el.username}</TableCell>
                        <TableCell>{el.foodOrderItems.length} foods</TableCell>
                        <TableCell>{el.createdAt.substring(0,10).split("-").join("/")}</TableCell>
                        <TableCell>${el.totalPrice}</TableCell>
                        <TableCell>{el.location}</TableCell>
                        <TableCell className="flex gap-[20px] items-center"><select name="options" onChange={(e)=>handleStatusChange(index,e)} value={el.status} className={`border rounded-full py-[5px] px-[10px] outline-none ${el.status==="PENDING" ? "border-red-500" : el.status==="DELIVERED" ? "border-green-500" : ""}`}>
                            <option value="PENDING">PENDING</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                            </select>
                            {sending === index && <div className="absolute ml-[140px]">Updating...</div>}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
