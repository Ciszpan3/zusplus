import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <aside className="bg-white w-full mx-auto pt-6 pb-[894px] px-6 max-md:mt-10 max-md:pb-[100px] max-md:px-5">
      <div className="bg-[rgba(0,0,0,0)] w-full">
        <div className="bg-[rgba(0,0,0,0)] flex items-stretch gap-3 pr-[54px] max-md:pr-5">
          <img
            src="https://api.builder.io/api/v1/image/assets/4fa82c39fade496f8994c11eefe8d01e/4957a6f51ab6872319d9e9e679936686dcaf8809?placeholderIfAbsent=true"
            className="aspect-[1] object-contain w-12 shrink-0 rounded-full"
            alt="User avatar"
          />
          <div className="bg-[rgba(0,0,0,0)] flex flex-col items-stretch pb-1.5">
            <div className="text-[rgba(0,65,110,1)] text-lg font-semibold leading-loose">
              Twoje Dane
            </div>
            <div className="text-gray-500 text-sm font-normal leading-none mt-[11px]">
              Stopień ukończenia
            </div>
          </div>
        </div>
        <div className="bg-gray-200 flex flex-col mt-4 rounded-full max-md:pr-5">
          <div className="border flex w-[54px] shrink-0 h-2 bg-[#FFB34F] rounded-full border-0 border-solid" />
        </div>
      </div>
      <div className="border w-full mt-[31px] px-4 py-[13px] rounded-xl border-0 border-solid bg-gradient-to-r from-blue-500 to-blue-600">
        <div className="bg-[rgba(0,0,0,0)] flex items-stretch gap-3 text-base text-white font-semibold whitespace-nowrap">
          <img
            src="https://api.builder.io/api/v1/image/assets/4fa82c39fade496f8994c11eefe8d01e/96e8f4a5624ec7cf8269d74a9de9166f9744f140?placeholderIfAbsent=true"
            className="aspect-[0.5] object-contain w-3.5 shrink-0"
            alt="Tip icon"
          />
          <div className="grow shrink w-[210px]">
            Wskazówka
          </div>
        </div>
        <div className="text-white text-sm font-normal leading-5 mt-1">
          Podane przez Ciebie informacje pomogą Ci stworzyć
          dokładną symulację Twojej przyszłej emerytury. Wszystkie
          dane są przetwarzane w sposób bezpieczny.
        </div>
      </div>
      <button className="bg-gray-100 flex items-stretch gap-5 text-sm text-gray-500 font-normal whitespace-nowrap text-center justify-between mt-[31px] px-[54px] py-2.5 rounded-lg max-md:px-5 w-full hover:bg-gray-200 transition-colors">
        <img
          src="https://api.builder.io/api/v1/image/assets/4fa82c39fade496f8994c11eefe8d01e/bda759021497dcbb5b494aed69077b8cfe1c014e?placeholderIfAbsent=true"
          className="aspect-[0.71] object-contain w-3 shrink-0"
          alt="Back arrow"
        />
        <div>Powrót</div>
      </button>
      <div className="bg-[rgba(0,0,0,0)] flex shrink-0 h-9 mt-[306px] max-md:mt-10" />
    </aside>
  );
};

export default Sidebar;
