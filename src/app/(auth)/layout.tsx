export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full flex h-screen ">
      <div className="w-full lg:w-5/12 flex justify-between flex-col px-20 lg:px-30 xl:px-40 py-10">
        <div className="flex text-center gap-4">
          <img src="/assets/images/Logo.png" width={100} />
        </div>

        <div>{children}</div>
        <div></div>
      </div>
      <div className="hidden lg:flex flex-col w-7/12 bg-neutral-900  justify-center items-center">
        <img src="/assets/images/inicio.png" width={400} />
        <div className="w-2/4 flex flex-col justify-center items-center">
          <h1 className="font-bold text-2xl text-white mt-4">
            Lorem Lorem Lorem
          </h1>
          <h2 className="text-sm text-white mt-4 text-center">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam
            eligendi nihil soluta inventore iusto vel, enim quis rerum
            exercitationem eius repudiandae dolorem officiis quisquam! Error
            porro maxime nobis deserunt voluptate?
          </h2>
        </div>
      </div>
    </div>
  );
}
