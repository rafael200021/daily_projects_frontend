"use client";
import React, { useEffect } from "react";
import Menu from "../components/Menu";
import useAxios from "../../../hooks/useAxios";
import { useRecoilState } from "recoil";
import { userState } from "../../../atom/userState";
import SideMenu from "../components/SideMenu";
import { useRouter } from "next/navigation";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const axios = useAxios();
  const [user, setUser] = useRecoilState(userState);
  const navigate = useRouter();
  useEffect(() => {
    axios
      .get("User/Auth")
      .then((res) => {
        setUser(res.data);
      })
      .catch((e) => {
        navigate.push("/");
      });
  }, []);

  return (
    <div className="bg-white flex w-full   min-h-screen">
      <SideMenu />

      <div className="w-full">{children}</div>
    </div>
  );
}
