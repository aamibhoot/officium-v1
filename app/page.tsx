import Image from "next/image";

export default function Page() {
  return (
    <div className="relative flex flex-col h-screen">
      {/* Full-screen Background Image */}
      <main className="flex flex-1 items-center justify-center text-gray-100">
        <h1 className="text-4xl font-bold">Welcome to</h1>
        <Image
          src="/officium_logo.svg"
          alt="Officium Logo"
          height={70}
          width={200}
          className="ml-4"
        />
      </main>
 <Image
        src="/smart-bg.png"
        alt="Background"
        fill
        className="object-cover -z-10 mb-50"
        priority
      />

      <footer className="flex justify-center items-center h-16">
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} {
            process.env.NEXT_PUBLIC_APP_NAME
          } (v1-Beta). Made with ❤️ by{" "}
          <a
            href="https://github.com/aamibhoot"
            className="text-blue-400 hover:underline"
          >
            Aami Bhoot
          </a>
        </p>
      </footer>
    </div>
  );
}
