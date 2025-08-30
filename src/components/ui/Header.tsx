import { ChevronDown, Share2, MoreHorizontal } from "lucide-react";
import clsx from "clsx"; 

interface ChatHeaderProps {
  title?: string;
  onShare?: () => void;
  onMenuClick?: () => void;
  className?: string; 
}

export default function ChatHeader({
  title = "ChatGPT",
  onShare,
  onMenuClick,
  className,
}: ChatHeaderProps) {
  return (
    <header
      className={clsx(
        "w-full flex items-center justify-between px-4 py-4 border-b border-zinc-800 bg-teal-600 text-white",
        className 
      )}
    >
      {/* Left Section: Title + Dropdown */}
      <div className="flex items-center space-x-1 cursor-pointer hover:opacity-80 translate-x-4">
        <h1 className="text-sm font-medium">{title}</h1>
      </div>

      {/* Right Section: Share + More */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onShare}
          className="flex items-center text-sm font-medium hover:opacity-80"
        >
          <Share2 className="w-4 h-4 mr-1" />
          Share
        </button>

        <button onClick={onMenuClick} className="hover:opacity-80">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
