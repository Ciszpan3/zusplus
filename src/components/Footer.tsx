import React from 'react';
import zusLogo from "@/assets/zus-logo.png";
const Footer: React.FC = () => {
  return <footer className="bg-gray-900 w-full mt-[40px] pt-8 pb-[18px] px-20 max-md:max-w-full max-md:mt-10 max-md:px-5">
      <div className="bg-[rgba(0,0,0,0)] w-full max-md:max-w-full max-md:pr-5">
        <div className="bg-[rgba(0,0,0,0)] flex w-full items-stretch gap-5 flex-wrap justify-between max-md:max-w-full">
          <div className="bg-[rgba(0,0,0,0)] pb-3.5">
            <div className="flex items-center gap-[18px]">
              <img src={zusLogo} className="aspect-[1.82] object-contain w-[62px] self-stretch shrink-0 my-auto" alt="ZUSight Logo" />
              <div className="bg-[rgba(0,0,0,0)] self-stretch flex flex-col items-stretch w-[124px] my-auto">
                <div className="text-white text-lg font-bold leading-loose">ZUS PLUS</div>
                <div className="text-gray-500 text-sm font-normal leading-5 z-10 mt-2.5 max-md:-mr-2">
                  Twoja przyszłość Twoje oszczędności
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[rgba(0,0,0,0)] flex items-stretch gap-6 text-base text-white font-normal flex-wrap my-auto max-md:max-w-full">
            <button className="bg-[rgba(0,0,0,0)] flex items-stretch gap-2 text-center underline px-[5px] py-0.5 hover:text-gray-300 transition-colors">
              <img src="https://api.builder.io/api/v1/image/assets/4fa82c39fade496f8994c11eefe8d01e/22ce5b11d16ddeb83dea833256827e47e3bd716a?placeholderIfAbsent=true" className="aspect-[0.8] object-contain w-4 shrink-0" alt="Help icon" />
              <div className="basis-auto">Pomoc i wsparcie</div>
            </button>
            <div className="flex flex-col relative aspect-[4.583] w-[110px] text-center underline px-[17px]">
              <div className="relative flex gap-[7px]">
                <div className="w-[53px]">O ZUS</div>
              </div>
            </div>
            <div className="bg-[rgba(0,0,0,0)] text-sm my-auto pt-px pb-2 px-0.5">
              <div>© 2024 ZUS Social Insurance Institution</div>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;