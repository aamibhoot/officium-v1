import { MoonLoader } from "react-spinners";

export default function DashboardLoading() {
  return (
    <div className="flex h-full min-h-[calc(100vh-10rem)] w-full items-center justify-center">
      <MoonLoader color="#414c65ff" size={40} />
    </div>
  );
}
