import React from "react";
import { Download, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onDownloadPDF?: () => void;
  showDownloadButton?: boolean;
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onDownloadPDF,
  showDownloadButton = false,
  showBackButton = false,
}) => {
  const navigate = useNavigate();

  return (
    <header className="bg-[rgba(255,255,255,0.95)] border flex w-full flex-col items-stretch justify-center px-[70px] py-px border-b max-md:max-w-full max-md:px-5">
      <div className="bg-[rgba(0,0,0,0)] flex w-full max-w-[1280px] mx-auto items-center gap-5 justify-between pl-px pr-6 py-2 max-md:pr-5">
        <div className="bg-[rgba(0,0,0,0)] flex flex-col">
          <div className="flex items-center gap-[17px]">
            <img
              src="https://api.builder.io/api/v1/image/assets/4fa82c39fade496f8994c11eefe8d01e/87d3a42ba1845afa2ddbc508f801908312c27032?placeholderIfAbsent=true"
              className="aspect-[1.82] object-contain w-[62px] self-stretch shrink-0 my-auto"
              alt="ZUSight Logo"
            />
            <div className="bg-[rgba(0,0,0,0)] self-stretch flex flex-col w-[143px] my-auto pb-1.5">
              <div className="text-[rgba(0,65,110,1)] text-xl font-bold leading-[1.4]">
                ZUS PLUS
              </div>
              <div className="text-gray-500 text-sm font-normal leading-none mr-[-106px] mt-2">
                Twoja przyszłość Twoje oszczędności
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {showBackButton && (
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors font-medium text-xs whitespace-nowrap"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Powrót
            </button>
          )}
          {showDownloadButton && onDownloadPDF && (
            <button
              onClick={onDownloadPDF}
              className="flex items-center gap-1.5 bg-[hsl(var(--blue-primary))] text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity font-medium text-xs whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              Pobierz raport
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
export default Header;
