import { Badge } from "@/components/ui/badge";
import { FaBangladeshiTakaSign, FaDollarSign } from "react-icons/fa6";

interface RateBadgeProps {
  rate: number;
  type: "bdt" | "usd";
}

export function CurrentBCRateCompoment({ rate, type }: RateBadgeProps) {
  return (
    <div className="flex w-full items-center justify-center">
      <Badge
        variant="outline"
        className="flex items-center justify-center gap-1 h-6 rounded-xl px-3 py-1 font-semibold bg-gray-50 text-gray-700 border-gray-300"
      >
        {type === "bdt" ? (
          <FaBangladeshiTakaSign className="h-4 w-4" />
        ) : (
          <FaDollarSign className="h-4 w-4" />
        )}
        <span>{rate.toFixed(2)}</span>
      </Badge>
    </div>
  );
}
