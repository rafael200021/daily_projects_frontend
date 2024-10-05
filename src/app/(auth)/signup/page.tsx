"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import useAxios from "../../../../hooks/useAxios";
import { FormikErrors, useFormik } from "formik";
import { error } from "console";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const axios = useAxios();
  const navigate = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      name: "",
      confirmPassword: "",
    },
    validate: (data) => {
      const errors: FormikErrors<any> = {};

      if (errors.password != errors.confirmPassword) {
        errors.confirmPassword = "Password is different from Confirm Password!";
      }

      return errors;
    },
    onSubmit: async (data) => {
      setLoading(true);
      try {
        let userData = {
          name: data.name,
          email: data.email,
          password: data.password,
        };

        await axios.post("User", userData);

        toast.success("User registered with success !");

        navigate.push("/");
      } catch (e) {
        console.log("Auth Error: ", e);
      }
      setLoading(false);
    },
  });

  return (
    <form className="flex flex-col gap-2" onSubmit={formik.handleSubmit}>
      <h1 className="font-bold text-2xl mb-10">Sign Up</h1>
      <div className="flex flex-col">
        <label className="mb-2">Name</label>
        <input
          type="text"
          placeholder={"Name"}
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          className={`p-3 border w-full border-gray-400 rounded-lg focus:outline-none  focus:border-neutral-900 `}
        />
      </div>
      <div className="flex flex-col">
        <label className="mb-2">Email</label>
        <input
          type="text"
          placeholder={"Email"}
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          className={`p-3 border w-full border-gray-400 rounded-lg focus:outline-none  focus:border-neutral-900 `}
        />
      </div>
      <div className="flex flex-col">
        <label className="mb-2">Password</label>
        <input
          autoComplete="on"
          type="password"
          placeholder={"Password"}
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          className={`p-3 border w-full border-gray-400 rounded-lg focus:outline-none  focus:border-neutral-900 `}
        />
      </div>
      <div className="flex flex-col">
        <label className="mb-2">Confirm Password</label>
        <input
          autoComplete="off"
          type="password"
          placeholder={"Confirm Password"}
          name="confirmPassword"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          className={`p-3 border w-full border-gray-400 rounded-lg focus:outline-none  focus:border-neutral-900 `}
        />
      </div>

      <button
        type="submit"
        className="rounded-full hover:scale-105 w-full bg-neutral-900 p-3 mt-4 text-white font-bold hover:bg-neutral-950 transition-all duration-200"
      >
        {loading == true ? (
          <ClipLoader loading={loading} color="white" size={15} />
        ) : (
          "Sign Up"
        )}
      </button>
      <div className="text-center mt-5">
        <p className="text-sm">
          Already have an account ? <Link
            className="hover:underline text-blue-600 hover:font-bold hover:text-blue-700 duration-300 transition-all"
            href="/"
          >
            Sign In
          </Link>
        </p>
      </div>
    </form>
  );
}
