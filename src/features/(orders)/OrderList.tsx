import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { ChevronDown } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [sending, setSending] = useState([]);
  const [selected, setSelected] = useState([]);
  const [isSelectedAll, setIsSelectedAll] = useState(false);
  const [showChangeState, setShowChangeState] = useState(false);
  const [chooseState, setChooseState] = useState("PENDING");

  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("https://food-service-app-ciba.onrender.com/order/", {
          headers: { Authorization: `Bearer ${window.localStorage.authToken}` },
        });
        setOrders(response.data);
      } catch (err) {
        err.status === 403
          ? router.push("login")
          : console.log(err.response.data);
      }
    };
    fetchOrders();
  }, []);

  const handleSelect = (i) => {
    if (selected.includes(i)) {
      setSelected((prev) => selected.filter((item) => item != i));
      setIsSelectedAll(false);
    } else {
      setSelected([...selected, i]);
      if (selected.length + 1 === orders.length) {
        setIsSelectedAll(true);
      }
    }
  };

  const handleSelectAll = () => {
    if (isSelectedAll) {
      setSelected([]);
      setIsSelectedAll(false);
    } else {
      setSelected(orders?.map((el) => el._id));
      setIsSelectedAll(true);
    }
  };
  const handleStatusChange = (id, newValue: String) => (e) => {
    const newStatus = e?.target?.value || newValue;

    if (sending.includes(id)) {
      return;
    } else {
      setSending((prevSending) => [...prevSending, id]);
    }

    // setSending(index);

    setOrders((prevOrders) => {
      const updatedOrders = prevOrders.map((order) =>
        order._id === id ? { ...order, status: newStatus } : order
      );

      updateStatus(id, newStatus);
      return updatedOrders;
    });
  };
  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(
        "https://food-service-app-ciba.onrender.com/order/status",
        {
          id: id,
          status: newStatus,
        },
        {
          headers: { Authorization: `Bearer ${window.localStorage.authToken}` },
        }
      );
    } catch (err) {
      err.status === 403 ? router.push("login") : console.log(err);
    }
    setSending((prev) => prev.filter((item) => item != id));
  };

  const changeState = (state: String) => {
    selected.forEach((el) => {
      handleStatusChange(el, state)(null);
    });
    setSelected([]);
    setIsSelectedAll(false);
    setShowChangeState(false);
  };

  return (
    <div className="w-[calc(100vw-205px)] bg-gray-100">
      <div className="w-full h-[60px] flex">
        {/* <img
          src="./profile.jpg"
          className="rounded-full absolute w-[50px] mt-[10px] right-[30px]"
        /> */}
      </div>
      <div className="w-full h-fit p-[30px]">
        <div className="bg-white w-full h-screen rounded-[20px] border">
          <div className="border-b flex w-full justify-between py-[10px] px-[20px] items-center">
            <div className="flex flex-col">
              <div className="text-[25px] font-bold">Orders</div>
              <div className="text-[13px] text-gray-500">X items</div>
            </div>
            <div className="flex h-full gap-[20px]">
              {/* <div className="py-[10px] px-[20px] border rounded-full">
                Date filter
              </div> */}
              <button
                className={`py-[10px] px-[20px] bg-black text-white rounded-full flex gap-[10px] ${selected.length === 0 ? "opacity-30 text-[#AAAAAA]" : ""}`}
                disabled={selected.length === 0}
                onClick={() => setShowChangeState(true)}
              >
                <div>Change delivery state</div>
                {selected.length > 0 && (
                  <div className="bg-white text-black rounded-full py-[1px] h-fit w-fit text-[14px] px-[12px] font-bold">
                    {selected.length}
                  </div>
                )}
              </button>
              {showChangeState && (
                <div className="w-screen h-screen fixed top-0 left-0 bg-black/25 z-20 flex justify-center items-center">
                  <div className="bg-white w-[500px] h-[300px] rounded-[20px] p-[30px]">
                    <div className="flex justify-between">
                      <div className="font-bold text-[25px]">
                        Change delivery state
                      </div>
                      <div
                        className="h-fit w-fit bg-gray-100 rounded-full p-[5px]"
                        onClick={() => setShowChangeState(false)}
                      >
                        <img
                          className="w-[20px] h-[20px] opacity-50"
                          src="./x.svg"
                        />
                      </div>
                    </div>
                    <div className="flex w-full justify-between mt-[40px]">
                      <div
                        className={`text-black rounded-full py-[8px] px-[25px] bg-gray-100 cursor-pointer ${
                          chooseState === "PENDING"
                            ? "border border-red-500 text-red-500 bg-red-100"
                            : ""
                        }`}
                        onClick={() => setChooseState("PENDING")}
                      >
                        Pending
                      </div>
                      <div
                        className={`text-black rounded-full py-[8px] px-[25px] bg-gray-100 cursor-pointer ${
                          chooseState === "DELIVERED"
                            ? "border border-green-500 text-green-500 bg-green-100"
                            : ""
                        }`}
                        onClick={() => setChooseState("DELIVERED")}
                      >
                        Delivered
                      </div>
                      <div
                        className={`text-black rounded-full py-[8px] px-[25px] bg-gray-100 cursor-pointer ${
                          chooseState === "CANCELLED"
                            ? "border border-red-500 text-red-500 bg-red-100"
                            : ""
                        }`}
                        onClick={() => setChooseState("CANCELLED")}
                      >
                        Cancelled
                      </div>
                    </div>
                    <button
                      className="bg-black w-full py-[10px] text-white mt-[60px] rounded-full"
                      onClick={() => changeState(chooseState)}
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
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
                    disabled={!orders}
                    checked={isSelectedAll}
                    onChange={handleSelectAll}
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
              {orders &&
                orders.map((el, index) => (
                  <TableRow key={index} className="w-[50px]">
                    <TableCell>
                      <input
                        type="checkbox"
                        className="mt-[4px] ml-[10px]"
                        onChange={() => handleSelect(el._id)}
                        checked={selected.includes(el._id)}
                      />
                    </TableCell>
                    <TableCell>{index}</TableCell>
                    <TableCell>{el.username}</TableCell>
                    <TableCell>
                      <div className="flex gap-[20px]">
                        {el.foodOrderItems.length} foods{" "}
                        <Popover>
                          <PopoverTrigger>
                            <ChevronDown />
                          </PopoverTrigger>
                          <PopoverContent>
                            <div className="bg-gray-100 border rounded-[10px] p-[10px] mt-[10px] max-w-[350px] flex flex-wrap gap-[14px]">
                              {el.foodOrderItems.map((elem, i) => (
                                <div
                                  className="w-[100px] h-[100px] bg-white"
                                  key={i}
                                >
                                  <div className="w-full h-[60%] rounded-[5px] overflow-hidden">
                                    <img
                                      src={elem[0].image}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex flex-col">
                                    <div className="line-clamp-1">
                                      {elem[0].foodName}
                                    </div>
                                    <div className="text-end">x{elem[1]}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TableCell>
                    <TableCell>
                      {el.createdAt.substring(0, 10).split("-").join("/")}
                    </TableCell>
                    <TableCell>${el.totalPrice}</TableCell>
                    <TableCell>{el.location}</TableCell>
                    <TableCell className="flex gap-[20px] items-center">
                      <select
                        name="options"
                        onChange={handleStatusChange(el._id, null)}
                        value={el.status}
                        className={`border rounded-full py-[5px] px-[10px] outline-none ${
                          el.status === "PENDING"
                            ? "border-red-500"
                            : el.status === "DELIVERED"
                            ? "border-green-500"
                            : ""
                        }`}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                      {sending.includes(el._id) && (
                        <div className="absolute ml-[140px]">Updating...</div>
                      )}
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
