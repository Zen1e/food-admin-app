"use client";

import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function login() {
  const [wrongAttempt, setWrongAttempt] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const router = useRouter();

  
  if (typeof window !== 'undefined') {
    localStorage.clear();;
  }

  const handleEmail = (e) => {
    setEmailInput(e.target.value);
  };
  const handlePassword = (e) => {
    setPasswordInput(e.target.value);
  };

  const login = async () => {
    const response = await axios.post(
      "https://food-service-app-ciba.onrender.com/users/login",
      {
        name: emailInput,
        password: passwordInput,
      }
    );
    if (response.data.error) {
      setWrongAttempt(true);
    } else {
      console.log(response);
      if(response.data.role === "user"){
        window.location.href = "http://localhost:3000/login"
      }
      else{
        localStorage.setItem("authToken", response.data.token);
        router.push("/");
      }
    }
  };

  return (
    <div className="flex flex-row w-screen h-screen items-center">
      <div className="h-screen w-full flex justify-center items-center">
        <div className="flex flex-col w-[400px]">
          <div className="font-bold text-[30px]">Admin log in</div>
          <div
            className={
              !wrongAttempt
                ? "text-gray-600 mb-[40px]"
                : "text-gray-600 mb-[20px]"
            }
          >

          </div>
          {wrongAttempt && (
            <div className="w-[400px] h-[40px] border border-red-300 bg-red-200 text-red-500 text-center pt-[7px] mb-[10px] rounded-[5px]">
              Invalid username or password
            </div>
          )}
          <input
            type="text"
            className="border border-gray-500 rounded-[5px] px-[10px] py-[5px] outline-none text-[17px]"
            onChange={handleEmail}
            value={emailInput}
            placeholder="Enter your email address"
          />
          <input
            type="password"
            className="mt-[20px] border border-gray-500 rounded-[5px] px-[10px] py-[5px] outline-none text-[17px]"
            onChange={handlePassword}
            value={passwordInput}
            placeholder="Password"
          />
          <button
            className="bg-black text-white rounded-[5px] py-[8px] mt-[40px]"
            onClick={login}
          >
            Let's go
          </button>
          <div className="flex gap-[15px] mt-[30px] w-full justify-center">
          </div>
        </div>
      </div>
      <div className="mr-[3vw]">
        <img src="./home_pic.png" alt="" />
      </div>
    </div>
  );
}
