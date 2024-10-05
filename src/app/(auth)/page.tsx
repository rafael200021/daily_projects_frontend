"use client";

import React, { useState } from "react";
import Link from "next/link";
import useAxios from "../../../hooks/useAxios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { on } from "events";
import { useFormik } from "formik";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const axios = useAxios();
  const navigate = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (data) => {
      setLoading(true);
      let dados = {
        email: data.email,
        password: data.password,
      };

      await axios
        .post("Auth", dados)
        .then((res) => {
          localStorage.setItem("token", res.data.token);
          navigate.push("/sistema/");
        })
        .catch((e) => {
          toast.error("Email or password incorrect!");
        });

      setLoading(false);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <h1 className="font-bold text-2xl mb-10">Sign In</h1>
      <div className="flex flex-col">
        <label className="mb-2">Email</label>
        <input
          type="text"
          name="email"
          id="email"
          placeholder={"Email"}
          value={formik.values.email}
          onChange={formik.handleChange}
          className={`p-3 border w-full border-gray-400 rounded-lg focus:outline-none  focus:border-neutral-900 `}
        />
      </div>
      <div className="flex flex-col mt-4">
        <label className="mb-2">Password</label>
        <input
          autoComplete="on"
          type="password"
          name="password"
          id="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          placeholder={"Password"}
          className={`p-3 border w-full border-gray-400 rounded-lg focus:outline-none  focus:border-neutral-900 `}
        />
      </div>

      <button
        type="submit"
        className="rounded-full hover:scale-105 w-full bg-neutral-900 p-3 mt-8 text-white font-bold hover:bg-neutral-950 transition-all duration-200"
      >
        {loading == true ? (
          <ClipLoader loading={loading} color="white" size={15} />
        ) : (
          "Sign In"
        )}
      </button>
      <div className="text-center mt-5">
        <p className="text-sm">
          Dont have an account ? <Link
            className="hover:underline text-blue-600 hover:font-bold hover:text-blue-700 duration-300 transition-all"
            href="/signup"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </form>
  );
}
