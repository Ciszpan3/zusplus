import React from 'react';

interface FormSectionProps {
  icon: string;
  title: string;
  description: string;
  children: React.ReactNode;
  iconAlt?: string;
}

const FormSection: React.FC<FormSectionProps> = ({ 
  icon, 
  title, 
  description, 
  children, 
  iconAlt = "Section icon" 
}) => {
  return (
    <section className="bg-[rgba(0,0,0,0)] w-full mt-8 max-md:max-w-full">
      <div className="bg-[rgba(0,0,0,0)] flex items-stretch gap-3 flex-wrap pr-20 max-md:pr-5">
        <img
          src={icon}
          className="aspect-[1] object-contain w-10 shrink-0 my-auto rounded-full"
          alt={iconAlt}
        />
        <div className="bg-[rgba(0,0,0,0)] flex flex-col pr-9 pb-[9px]">
          <h3 className="text-[rgba(0,65,110,1)] text-lg font-semibold leading-loose">
            {title}
          </h3>
          <p className="text-gray-500 text-sm font-normal leading-none mt-2.5">
            {description}
          </p>
        </div>
      </div>
      <div className="mt-4">
        {children}
      </div>
    </section>
  );
};

export default FormSection;
