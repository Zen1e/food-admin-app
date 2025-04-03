import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    TableCell,
  } from "@/components/ui/table";

export default function Setting() {

    const router = useRouter();

    const [users,  setUsers] = useState([]);

    useEffect(()=>{
        const getUsers = async() => {
            try{
                const response = await axios.get("https://food-service-app-ciba.onrender.com/users/",{
                    headers: {Authorization: `Bearer ${window.localStorage.authToken}` }
                }) 

                setUsers(response.data.users)

                console.log(response.data.users);
                
            }catch(err){
                err.status === 403 ? router.push("login") : console.log(err);
            }
        }
        getUsers()
    },[])


  return (
    <div className="w-[calc(100vw-205px)] bg-gray-100">
      <div className="w-full h-[60px] flex"></div>
      <div className="h-screen w-full p-[30px]">
        <div className="w-full h-fit bg-white rounded-[15px]">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No.</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>User role</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Created at</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((el,index)=>(
                      <TableRow key={index}>
                        <TableCell>{index+1}</TableCell>
                        <TableCell>{el.name}</TableCell>
                        <TableCell>{el.role}</TableCell>
                        <TableCell>{el.location}</TableCell>
                        <TableCell className="whitespace-pre">{el.createdAt.split("T")[0]}      {Number(el.createdAt.split("T")[1].substring(0,2))+8}{el.createdAt.split("T")[1].substring(2,8)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
            </Table>
        </div>
      </div>
    </div>
  );
}
