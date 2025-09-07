import { Button } from "@/components/ui/button";
import { FiMail } from "react-icons/fi";

export default function OutlookButton() {
  const handleClick = () => {
    window.location.href = "ms-outlook://"; // Try to launch Outlook desktop
  };

  return (
    <div className="flex w-full items-center justify-center">
      <Button
        onClick={handleClick}
        variant="outline"
        className="flex items-center justify-center gap-1 h-6 rounded-xl px-3 py-1 font-semibold bg-gray-50 text-blue-700 border-blue-300 hover:bg-blue-700 hover:text-white transition-all"
      >
        <FiMail className="h-4 w-4" />
        <span>Open Outlook</span>
      </Button>
    </div>
  );
}
