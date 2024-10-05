"use client";
import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { userState } from "../../../../atom/userState";
import { InputText } from "primereact/inputtext";
import { useFormik } from "formik";
import useAxios from "../../../../hooks/useAxios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";

export default function Page() {
  const user = useRecoilValue(userState);
  const axios = useAxios();
  const navigate = useRouter();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
    },
    onSubmit: (data) => {
      let dataForm = {
        name: data.name,
        email: data.email,
      };

      axios
        .put(`User/${user?.id}`, dataForm)
        .then((res) => {
          localStorage.removeItem("token");
          navigate.push("/");
          toast.success("User updated with success !");
        })
        .catch((e) => {
          console.log("Update User Error:", e);
          toast.error("Error updating user");
        });
    },
  });

  useEffect(() => {
    formik.setValues({
      name: user?.name ?? "",
      email: user?.email ?? "",
    });
  }, [user]);

  return (
    <form onSubmit={formik.handleSubmit} className="p-8 lg:p-20 w-full">
      <h1 className="text-2xl font-bold">Edit Profile</h1>
      <div className="w-full rounded mt-4 bg-white shadow-lg p-10">
        <div className="w-full flex flex-col">
          <div className="w-full flex lg:flex-row  gap-4 justify-between items-center">
            <h1 className="font-bold text-lg w-full">Personal Information</h1>
            <Button className="text-center" type="submit" label="Save" />
          </div>
          <div className="grid gap-4 mt-4 grid-cols-1 lg:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="font-bold text-sm">
                Name
              </label>
              <InputText
                value={formik.values.name}
                onChange={formik.handleChange}
                placeholder="Name"
                id="name"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="font-bold text-sm">
                Email
              </label>
              <InputText
                value={formik.values.email}
                onChange={formik.handleChange}
                placeholder="Email"
                id="email"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
