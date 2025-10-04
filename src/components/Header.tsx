import React from 'react';
const Header: React.FC = () => {
  return <header className="bg-[rgba(255,255,255,0.95)] border flex w-full flex-col items-stretch justify-center px-[70px] py-px border-b max-md:max-w-full max-md:px-5">
      <div className="bg-[rgba(0,0,0,0)] flex w-[1280px] max-w-full items-stretch gap-5 flex-wrap justify-between pl-px pr-6 py-2 max-md:pr-5">
        <div className="bg-[rgba(0,0,0,0)] flex flex-col">
          <div className="flex items-center gap-[17px]">
            <img src="https://api.builder.io/api/v1/image/assets/4fa82c39fade496f8994c11eefe8d01e/87d3a42ba1845afa2ddbc508f801908312c27032?placeholderIfAbsent=true" className="aspect-[1.82] object-contain w-[62px] self-stretch shrink-0 my-auto" alt="ZUSight Logo" />
            <div className="bg-[rgba(0,0,0,0)] self-stretch flex flex-col w-[143px] my-auto pb-1.5">
              <div className="text-[rgba(0,65,110,1)] text-xl font-bold leading-[1.4]">ZUS PLUS</div>
              <div className="text-gray-500 text-sm font-normal leading-none mr-[-106px] mt-2">
                Twoja przyszłość Twoje oszczędności
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>;
};
export default Header;