import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Header from '@/components/Header';
import FormSection from '@/components/FormSection';
import Footer from '@/components/Footer';
import { AlertCircle, Rocket } from 'lucide-react';

interface FormData {
  age: string;
  gender: 'female' | 'male';
  monthlyIncome: string;
  careerStartYear: string;
  retirementYear: string;
  zusBalance: string;
  ofeBalance: string;
  sickLeaveDays: string;
  postalCode: string;
  optionalDataEnabled: boolean;
}

const Index: React.FC = () => {
  const [optionalDataEnabled, setOptionalDataEnabled] = useState(true);
  const [salaryComparison, setSalaryComparison] = useState(0);
  const [yearsOfExperience, setYearsOfExperience] = useState(0);
  const [yearsToRetirement, setYearsToRetirement] = useState(0);
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      age: '25',
      gender: 'male',
      monthlyIncome: '8500',
      careerStartYear: '',
      retirementYear: '',
      zusBalance: '8500',
      ofeBalance: '8500',
      sickLeaveDays: '0',
      postalCode: '',
      optionalDataEnabled: true
    }
  });

  const watchedGender = watch('gender');
  const watchedIncome = watch('monthlyIncome');
  const watchedAge = watch('age');
  const watchedCareerStart = watch('careerStartYear');
  const watchedRetirementYear = watch('retirementYear');

  // Calculate dynamic values
  useEffect(() => {
    if (watchedIncome) {
      const income = parseFloat(watchedIncome);
      const minimumWage = 4242; // Polish minimum wage
      const difference = ((income - minimumWage) / minimumWage) * 100;
      setSalaryComparison(Math.round(difference));
    }
  }, [watchedIncome]);

  useEffect(() => {
    if (watchedCareerStart) {
      const currentYear = new Date().getFullYear();
      const experience = currentYear - parseInt(watchedCareerStart);
      setYearsOfExperience(experience > 0 ? experience : 0);
    }
  }, [watchedCareerStart]);

  useEffect(() => {
    if (watchedAge && watchedRetirementYear) {
      const retirementYear = parseInt(watchedRetirementYear);
      const currentYear = new Date().getFullYear();
      const age = parseInt(watchedAge);
      const yearsUntilRetirement = retirementYear - currentYear;
      setYearsToRetirement(yearsUntilRetirement > 0 ? yearsUntilRetirement : 0);
    } else if (watchedAge && watchedGender) {
      const age = parseInt(watchedAge);
      const retirementAge = watchedGender === 'female' ? 60 : 65;
      const years = retirementAge - age;
      setYearsToRetirement(years > 0 ? years : 0);
    }
  }, [watchedAge, watchedRetirementYear, watchedGender]);

  const blockInvalid = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["e", "E", "+", "-", "."].includes(e.key)) e.preventDefault();
  };

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
  };

  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^\d]/g, '');
    if (value.length > 2) {
      value = value.slice(0, 2) + '-' + value.slice(2, 5);
    }
    e.target.value = value;
  };

  return (
    <div className="bg-white overflow-hidden rounded-lg border-[rgba(206,212,218,1)] border-solid border-2">
      <div className="bg-gray-50 w-full max-md:max-w-full">
        <div className="bg-gray-50 w-full max-md:max-w-full">
          <Header />
          
          <main className="bg-[rgba(0,0,0,0)] w-full max-md:max-w-full">
            <div className="w-full max-w-[1000px] mx-auto max-md:max-w-full">
              <div className="w-full max-md:w-full max-md:ml-0">
                  <div className="bg-[rgba(0,0,0,0)] grow w-full mt-8 pb-[25px] px-[15px] max-md:max-w-full max-md:mt-10">
                    <div className="bg-[rgba(0,0,0,0)] flex flex-col items-center text-center pb-[7px] px-20 max-md:max-w-full max-md:px-5">
                      <div className="bg-green-100 p-5 rounded-full">
                        <Rocket className="w-10 h-10 text-green-600" />
                      </div>
                      <h1 className="text-[rgba(0,65,110,1)] text-3xl font-bold leading-[1.2] mt-4">
                        Zbudujmy twoją przyszłość
                      </h1>
                      <p className="text-gray-600 text-lg font-normal leading-7 self-stretch mt-[19px] max-md:max-w-full">
                        Opowiedz nam o sobie, a następnie zobacz jak może
                        wyglądać twoja emerytura
                      </p>
                    </div>
                    
                    <div className="bg-white shadow-[0px_8px_24px_rgba(0,0,0,0.15)] flex w-full flex-col items-stretch mt-[7px] px-8 py-[41px] rounded-2xl max-md:max-w-full max-md:px-5">
                      <form onSubmit={handleSubmit(onSubmit)} className="bg-[rgba(0,0,0,0)] max-md:max-w-full">
                        
                        {/* Age Section */}
                        <FormSection
                          icon="https://api.builder.io/api/v1/image/assets/4fa82c39fade496f8994c11eefe8d01e/7dbaecad2b7293cf774579bc4912846654214643?placeholderIfAbsent=true"
                          title="Twój wiek"
                          description="Ile masz teraz lat?"
                          iconAlt="Age icon"
                        >
                          <div className="bg-[rgba(0,0,0,0)] flex items-stretch gap-6 flex-wrap max-md:max-w-full">
                            <div className="bg-[rgba(0,0,0,0)] w-[340px] max-w-full pb-1.5">
                              <label className="bg-[rgba(0,0,0,0)] flex flex-col text-sm text-gray-700 font-medium justify-center py-1 max-md:pr-5">
                                <div>Aktualny wiek</div>
                              </label>
                              <input
                                {...register('age', { 
                                  required: 'Wiek jest wymagany',
                                  min: { value: 18, message: 'Wiek nie może być mniejszy niż 18' },
                                  max: { value: 100, message: 'Maksymalny wiek to 100' }
                                })}
                                type="number"
                                min="18"
                                max="100"
                                inputMode="numeric"
                                onKeyDown={blockInvalid}
                                onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, ''); }}
                                onBlur={(e) => {
                                  const n = parseInt(e.currentTarget.value || '0', 10);
                                  const clamped = Math.max(18, Math.min(100, isNaN(n) ? 18 : n));
                                  setValue('age', String(clamped), { shouldValidate: true, shouldDirty: true });
                                }}
                                className="bg-white border-gray-400 border flex flex-col text-base text-gray-600 font-normal whitespace-nowrap justify-center mt-2 px-4 py-[19px] rounded-lg border-solid max-md:pr-5 w-full"
                                placeholder="25"
                              />
                              {errors.age && <span className="text-red-500 text-sm">{errors.age.message}</span>}
                            </div>
                            <div className="bg-[rgba(0,0,0,0)] flex flex-col items-center text-center flex-1 grow shrink-0 basis-0 w-fit px-[68px] max-md:px-5">
                              <div className={`w-[180px] max-w-full p-4 rounded-lg ${yearsToRetirement === 0 ? 'bg-[rgba(22,163,74,0.05)]' : 'bg-[rgba(63,132,210,0.05)]'}`}>
                                <div className="bg-[rgba(0,0,0,0)] flex flex-col text-2xl text-[rgba(0,65,110,1)] font-bold whitespace-nowrap pt-px pb-[13px] px-4 max-md:px-5">
                                  <div>{yearsToRetirement > 0 ? yearsToRetirement : '✓'}</div>
                                </div>
                                <div className="bg-[rgba(0,0,0,0)] text-sm text-gray-600 font-normal pt-px pb-2 px-0.5">
                                  <div>{yearsToRetirement > 0 ? 'Lat do emerytury' : 'Gotowy na emeryturę'}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </FormSection>

                        {/* Gender Section */}
                        <FormSection
                          icon="https://api.builder.io/api/v1/image/assets/4fa82c39fade496f8994c11eefe8d01e/506dd5b5d7294787dfc6385301f4619dec43a58b?placeholderIfAbsent=true"
                          title="Płeć"
                          description="Wpływa na kalkulacje lat do emerytury"
                          iconAlt="Gender icon"
                        >
                          <div className="bg-[rgba(0,0,0,0)] flex w-full items-stretch gap-4 flex-wrap max-md:max-w-full">
                            <label className={`bg-[rgba(0,0,0,0)] border flex items-stretch gap-3 flex-1 grow shrink basis-auto p-[18px] rounded-lg border-solid border-2 cursor-pointer ${watchedGender === 'female' ? 'bg-[rgba(0,153,63,0.05)] border-[#00993F]' : 'border-gray-300'}`}>
                              <div className={`flex w-6 shrink-0 h-6 my-auto rounded-full border-solid border-2 items-center justify-center ${watchedGender === 'female' ? 'border-[#00993F]' : 'border-gray-300'}`}>
                                {watchedGender === 'female' && (
                                  <div className="border flex w-3 shrink-0 h-3 bg-[#00993F] rounded-full border-0 border-solid" />
                                )}
                              </div>
                              <input
                                {...register('gender')}
                                type="radio"
                                value="female"
                                className="sr-only"
                              />
                              <div className="flex items-stretch grow shrink basis-auto">
                                <div className="bg-[rgba(0,0,0,0)] grow shrink-0 basis-0 w-fit">
                                  <div className="bg-[rgba(0,0,0,0)] flex flex-col text-base text-gray-800 font-medium whitespace-nowrap pt-0.5 pb-2.5 max-md:pr-5">
                                    <div>Kobieta</div>
                                  </div>
                                  <div className="bg-[rgba(0,0,0,0)] flex flex-col text-sm text-gray-500 font-normal justify-center py-[3px] max-md:pr-5">
                                    <div>Rok przejścia na emeryturę: 60</div>
                                  </div>
                                </div>
                                <img
                                  src="https://api.builder.io/api/v1/image/assets/4fa82c39fade496f8994c11eefe8d01e/a03889dd9bbd809d036cb1a10caa001806e743fe?placeholderIfAbsent=true"
                                  className="aspect-[0.54] object-contain w-[15px] shrink-0 my-auto"
                                  alt="Female icon"
                                />
                              </div>
                            </label>
                            
                            <label className={`flex items-stretch gap-3 flex-1 grow shrink basis-auto p-[18px] rounded-lg border-2 border-solid cursor-pointer ${watchedGender === 'male' ? 'bg-[rgba(0,153,63,0.05)] border-[#00993F]' : 'bg-[rgba(0,0,0,0)] border-gray-300'}`}>
                              <div className={`justify-center items-center bg-[rgba(0,0,0,0.00)] flex flex-col w-6 h-6 my-auto px-[5px] rounded-full border-2 border-solid ${watchedGender === 'male' ? 'border-[#00993F]' : 'border-gray-300'}`}>
                                {watchedGender === 'male' && (
                                  <div className="border flex w-3 shrink-0 h-3 bg-[#00993F] rounded-full border-0 border-solid" />
                                )}
                              </div>
                              <input
                                {...register('gender')}
                                type="radio"
                                value="male"
                                className="sr-only"
                              />
                              <div className="flex items-stretch grow shrink basis-auto">
                                <div className="bg-[rgba(0,0,0,0)] grow shrink-0 basis-0 w-fit">
                                  <div className="bg-[rgba(0,0,0,0)] flex flex-col text-base text-gray-800 font-medium whitespace-nowrap justify-center py-[5px] max-md:pr-5">
                                    <div>Mężczyzna</div>
                                  </div>
                                  <div className="bg-[rgba(0,0,0,0)] flex flex-col text-sm text-gray-500 font-normal justify-center py-[3px] max-md:pr-5">
                                    <div>Rok przejścia na emeryturę: 65</div>
                                  </div>
                                </div>
                                <img
                                  src="https://api.builder.io/api/v1/image/assets/4fa82c39fade496f8994c11eefe8d01e/dd95deee18ea78a9e0fc52aac3a776f1469af8a2?placeholderIfAbsent=true"
                                  className="aspect-[0.61] object-contain w-[17px] shrink-0 my-auto"
                                  alt="Male icon"
                                />
                              </div>
                            </label>
                          </div>
                        </FormSection>

                        {/* Monthly Income Section */}
                        <FormSection
                          icon="https://api.builder.io/api/v1/image/assets/4fa82c39fade496f8994c11eefe8d01e/fff86fb993934c7b1aa6ec72309c315340810acd?placeholderIfAbsent=true"
                          title="Miesięczny przychód"
                          description="Twoje obecne miesięczne wynagrodzenie brutto"
                          iconAlt="Income icon"
                        >
                          <div className="bg-[rgba(0,0,0,0)] mt-4 max-md:max-w-full">
                            <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
                              <div className="w-[68%] max-md:w-full max-md:ml-0">
                                <div className="bg-[rgba(0,0,0,0)] grow w-full pb-7 max-md:max-w-full max-md:mt-6">
                                   <label className="bg-[rgba(0,0,0,0)] flex flex-col text-sm text-gray-700 font-medium justify-center py-[3px] max-md:max-w-full max-md:pr-5">
                                    <div>Wynagrodzenie Brutto (PLN)</div>
                                  </label>
                                  <div className="bg-[rgba(0,0,0,0)] w-full text-base whitespace-nowrap mt-2 max-md:max-w-full">
                                    <div className="bg-white border-gray-400 border flex gap-5 justify-between p-4 rounded-lg border-solid max-md:max-w-full">
                                      <input
                                        {...register('monthlyIncome', { 
                                          required: 'Wynagrodzenie jest wymagane',
                                          min: { value: 4242, message: 'Wynagrodzenie nie może być niższe niż minimalne' }
                                        })}
                                        type="number"
                                        min="4242"
                                        inputMode="numeric"
                                        onKeyDown={blockInvalid}
                                        onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, ''); }}
                                        onBlur={(e) => {
                                          const n = parseInt(e.currentTarget.value || '0', 10);
                                          const clamped = Math.max(4242, isNaN(n) ? 4242 : n);
                                          setValue('monthlyIncome', String(clamped), { shouldValidate: true, shouldDirty: true });
                                        }}
                                        className="text-gray-600 font-normal bg-transparent border-none outline-none flex-1"
                                        placeholder="8500"
                                      />
                                      <div className="text-gray-500 font-medium">PLN</div>
                                    </div>
                                  </div>
                                  {errors.monthlyIncome && <span className="text-red-500 text-sm">{errors.monthlyIncome.message}</span>}
                                </div>
                              </div>
                              <div className="w-[32%] ml-5 max-md:w-full max-md:ml-0">
                                <div className="bg-[rgba(0,0,0,0)] flex grow flex-col items-stretch text-center justify-center w-full py-[13px] max-md:mt-6">
                                  <div className={`p-4 rounded-lg ${salaryComparison >= 0 ? 'bg-[rgba(0,153,63,0.05)]' : 'bg-[rgba(196,48,48,0.05)]'}`}>
                                    <div className="bg-[rgba(0,0,0,0)] flex flex-col text-lg text-[rgba(0,65,110,1)] font-bold whitespace-nowrap pt-[3px] pb-[11px] px-[70px] max-md:px-5">
                                      <div>{salaryComparison > 0 ? '+' : ''}{salaryComparison}%</div>
                                    </div>
                                    <div className="bg-[rgba(0,0,0,0)] flex flex-col items-stretch text-sm text-gray-600 font-normal justify-center px-1.5 py-[3px]">
                                      <div>{salaryComparison >= 0 ? 'Powyżej' : 'Poniżej'} minimalnego</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </FormSection>

                        {/* Career Start Section */}
                        <FormSection
                          icon="https://api.builder.io/api/v1/image/assets/4fa82c39fade496f8994c11eefe8d01e/0d46a18b5509779029ce0bc9dcd5ef68390a0a45?placeholderIfAbsent=true"
                          title="Rozpoczęcie kariery zawodowej"
                          description="When did you start working full-time?"
                          iconAlt="Career start icon"
                        >
                          <div className="bg-[rgba(0,0,0,0)] flex items-stretch gap-6 flex-wrap max-md:max-w-full">
                            <div className="bg-[rgba(0,0,0,0)] flex-1 grow shrink-0 basis-0 w-fit pb-1.5">
                              <label className="bg-[rgba(0,0,0,0)] flex flex-col text-sm text-gray-700 font-medium justify-center py-1 max-md:pr-5">
                                <div>Rok rozpoczęcia pracy</div>
                              </label>
                              <div className="bg-white border-gray-400 border flex items-stretch gap-5 text-base text-black font-normal justify-between mt-2 px-4 py-3 rounded-lg border-solid">
                                <select
                                  {...register('careerStartYear')}
                                  className="my-auto bg-transparent border-none outline-none flex-1"
                                >
                                  <option value="">Wybierz rok</option>
                                  {Array.from({ length: 50 }, (_, i) => {
                                    const year = new Date().getFullYear() - i;
                                    return (
                                      <option key={year} value={year}>
                                        {year}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                            </div>
                            <div className="bg-[rgba(0,0,0,0)] flex flex-col items-center text-center flex-1 grow shrink-0 basis-0 w-fit px-[68px] max-md:px-5">
                              <div className="bg-[rgba(63,132,210,0.05)] w-[164px] max-w-full p-4 rounded-lg">
                                <div className="bg-[rgba(0,0,0,0)] flex flex-col text-2xl text-[rgba(0,65,110,1)] font-bold whitespace-nowrap pt-px pb-[13px] px-4 max-md:px-5">
                                  <div>{yearsOfExperience}</div>
                                </div>
                                <div className="bg-[rgba(0,0,0,0)] text-sm text-gray-600 font-normal pt-px pb-2 px-0.5">
                                  <div>Lata doświadczenia</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </FormSection>

                        {/* Planned Retirement Section */}
                        <FormSection
                          icon="https://api.builder.io/api/v1/image/assets/4fa82c39fade496f8994c11eefe8d01e/6211bf26ac6a72f6ecd02a2279b0bf7c6123ba37?placeholderIfAbsent=true"
                          title="Planowana emerytura"
                          description="Kiedy planujesz przejść na emeryture?"
                          iconAlt="Retirement icon"
                        >
                          <div className="bg-[rgba(0,0,0,0)] flex items-stretch gap-6 flex-wrap max-md:max-w-full">
                            <div className="bg-[rgba(0,0,0,0)] flex-1 grow shrink-0 basis-0 w-fit pb-1.5">
                              <label className="bg-[rgba(0,0,0,0)] flex flex-col text-sm text-gray-700 font-medium justify-center py-[3px] max-md:pr-5">
                                <div>Przewidywany rok przejścia na emeryture</div>
                              </label>
                              <div className="bg-white border-gray-400 border flex items-stretch gap-5 text-base text-black font-normal justify-between mt-2 px-4 py-3 rounded-lg border-solid">
                                <select
                                  {...register('retirementYear')}
                                  className="my-auto bg-transparent border-none outline-none flex-1"
                                >
                                  <option value="">Wybierz rok</option>
                                  {Array.from({ length: 50 }, (_, i) => {
                                    const year = new Date().getFullYear() + i;
                                    return (
                                      <option key={year} value={year}>
                                        {year}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                            </div>
                            <div className="bg-[rgba(0,0,0,0)] flex flex-col items-center text-center flex-1 grow shrink-0 basis-0 w-fit px-[68px] max-md:px-5">
                              <div className="bg-[rgba(22,163,74,0.05)] w-[158px] max-w-full p-4 rounded-lg">
                                <div className="bg-[rgba(0,0,0,0)] flex flex-col text-2xl text-[rgba(0,65,110,1)] font-bold whitespace-nowrap pt-px pb-[13px] px-4 max-md:px-5">
                                  <div>{yearsToRetirement}</div>
                                </div>
                                <div className="bg-[rgba(0,0,0,0)] flex flex-col items-stretch text-sm text-gray-600 font-normal justify-center p-1">
                                  <div>Lata do emerytury</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </FormSection>

                        {/* Optional Data Toggle */}
                        <div className="bg-[rgba(0,0,0,0)] flex w-full flex-col mt-[29px] px-[11px] max-md:max-w-full max-md:mr-2.5 max-md:pr-5">
                          <div className="flex items-center">
                            <div className="bg-[rgba(0,0,0,0)] self-stretch flex flex-col w-[182px] my-auto pr-9 pb-1.5">
                              <div className="text-[rgba(0,65,110,1)] text-lg font-semibold leading-loose">
                                Opcjonalne dane
                              </div>
                              <div className="text-gray-500 text-sm font-normal leading-none mt-[11px]">
                                Które warto podać!
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setOptionalDataEnabled(!optionalDataEnabled)}
                              className={`items-center aspect-[53/27] self-stretch flex min-h-[27px] gap-2.5 w-[53px] my-auto px-1 py-[3px] rounded-[45px] transition-colors ${
                                optionalDataEnabled ? 'bg-[#00993F]' : 'bg-gray-300'
                              }`}
                            >
                              <div className={`bg-white shadow-[0px_0px_4px_rgba(0,0,0,0.25)] self-stretch flex min-h-[22px] w-[22px] h-[22px] my-auto rounded-[50%] transition-transform ${
                                optionalDataEnabled ? 'translate-x-[26px]' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>
                        </div>

                        {/* Optional Data Sections */}
                        <div className={`transition-all duration-500 ease-in-out overflow-hidden mt-6 ${
                          optionalDataEnabled 
                            ? 'max-h-[2000px] opacity-100' 
                            : 'max-h-0 opacity-0'
                        }`}>
                          {optionalDataEnabled && (
                            <div className="animate-fade-in">
                            {/* ZUS Balance Section */}
                            <FormSection
                              icon="https://api.builder.io/api/v1/image/assets/4fa82c39fade496f8994c11eefe8d01e/5f70b7e2df99e5163513911aa4307cd9ad5ecc66?placeholderIfAbsent=true"
                              title="Saldo ZUS"
                              description="Aktualne saldo ZUS"
                              iconAlt="ZUS icon"
                            >
                              <div className="bg-[rgba(0,0,0,0)] w-[461px] max-w-full pb-7">
                                <label className="bg-[rgba(0,0,0,0)] flex flex-col text-sm text-gray-500 font-normal leading-none pt-px pb-2 max-md:max-w-full max-md:pr-5">
                                  <div>Aktualne saldo ZUS</div>
                                </label>
                                <div className="bg-[rgba(0,0,0,0)] w-full text-base whitespace-nowrap mt-2 max-md:max-w-full">
                                  <div className="bg-white border-gray-400 border flex gap-5 justify-between p-4 rounded-lg border-solid max-md:max-w-full">
                                    <input
                                      {...register('zusBalance', {
                                        min: { value: 0, message: 'Saldo nie może być ujemne' }
                                      })}
                                      type="number"
                                      min="0"
                                      inputMode="numeric"
                                      onKeyDown={blockInvalid}
                                      onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, ''); }}
                                      onBlur={(e) => {
                                        const n = parseInt(e.currentTarget.value || '0', 10);
                                        const clamped = Math.max(0, isNaN(n) ? 0 : n);
                                        setValue('zusBalance', String(clamped), { shouldValidate: true, shouldDirty: true });
                                      }}
                                      className="text-gray-600 font-normal bg-transparent border-none outline-none flex-1"
                                      placeholder="8500"
                                    />
                                    <div className="text-gray-500 font-medium">PLN</div>
                                  </div>
                                </div>
                                {errors.zusBalance && <span className="text-red-500 text-sm mt-1">{errors.zusBalance.message}</span>}
                              </div>
                            </FormSection>

                            {/* OFE Balance Section */}
                            <FormSection
                              icon="https://api.builder.io/api/v1/image/assets/4fa82c39fade496f8994c11eefe8d01e/5f70b7e2df99e5163513911aa4307cd9ad5ecc66?placeholderIfAbsent=true"
                              title="Saldo OFE"
                              description="Aktualne saldo OFE"
                              iconAlt="OFE icon"
                            >
                              <div className="bg-[rgba(0,0,0,0)] w-[461px] max-w-full pb-7">
                                <label className="bg-[rgba(0,0,0,0)] flex flex-col text-sm text-gray-500 font-normal leading-none pt-px pb-2 max-md:max-w-full max-md:pr-5">
                                  <div>Aktualne saldo OFE</div>
                                </label>
                                <div className="bg-[rgba(0,0,0,0)] w-full text-base whitespace-nowrap mt-2 max-md:max-w-full">
                                  <div className="bg-white border-gray-400 border flex gap-5 justify-between p-4 rounded-lg border-solid max-md:max-w-full">
                                    <input
                                      {...register('ofeBalance', {
                                        min: { value: 0, message: 'Saldo nie może być ujemne' }
                                      })}
                                      type="number"
                                      min="0"
                                      inputMode="numeric"
                                      onKeyDown={blockInvalid}
                                      onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, ''); }}
                                      onBlur={(e) => {
                                        const n = parseInt(e.currentTarget.value || '0', 10);
                                        const clamped = Math.max(0, isNaN(n) ? 0 : n);
                                        setValue('ofeBalance', String(clamped), { shouldValidate: true, shouldDirty: true });
                                      }}
                                      className="text-gray-600 font-normal bg-transparent border-none outline-none flex-1"
                                      placeholder="8500"
                                    />
                                    <div className="text-gray-500 font-medium">PLN</div>
                                  </div>
                                </div>
                                {errors.ofeBalance && <span className="text-red-500 text-sm mt-1">{errors.ofeBalance.message}</span>}
                              </div>
                            </FormSection>

                            {/* Sick Leave Days Section */}
                            <div className="bg-[rgba(0,0,0,0)] w-full mt-[25px] max-md:max-w-full">
                              <div className="bg-[rgba(0,0,0,0)] flex items-stretch gap-3 flex-wrap pr-20 max-md:pr-5">
                                <div className="bg-[rgba(196,48,48,0.15)] flex items-center justify-center w-10 h-10 my-auto rounded-full">
                                  <AlertCircle className="w-5 h-5 text-[rgba(196,48,48,1)]" />
                                </div>
                                <div className="bg-[rgba(0,0,0,0)] flex flex-col items-stretch grow shrink-0 basis-0 w-fit pb-1.5">
                                  <div className="text-[rgba(0,65,110,1)] text-lg font-semibold leading-loose">
                                    Ilość dni opuszczonych - Zwolnienia lekarskie
                                  </div>
                                  <div className="text-gray-500 text-sm font-normal leading-none mt-2.5">
                                    Posiedziało się w domu? Warto o tym wspomnieć
                                  </div>
                                </div>
                              </div>
                              <div className="bg-[rgba(0,0,0,0)] flex flex-col mt-4 max-md:max-w-full max-md:pr-5">
                                <div className="bg-[rgba(0,0,0,0)] w-[461px] max-w-full pb-7">
                                  <label className="bg-[rgba(0,0,0,0)] flex flex-col text-sm text-gray-500 font-normal leading-none justify-center py-[3px] max-md:max-w-full max-md:pr-5">
                                    <div>Ilość dni poza pracą</div>
                                  </label>
                                  <div className="bg-[rgba(0,0,0,0)] w-full text-base whitespace-nowrap mt-2 max-md:max-w-full">
                                    <div className="bg-white border-gray-400 border flex gap-5 justify-between p-4 rounded-lg border-solid max-md:max-w-full">
                                      <input
                                        {...register('sickLeaveDays', {
                                          min: { value: 0, message: 'Ilość dni nie może być ujemna' }
                                        })}
                                        type="number"
                                        min="0"
                                        inputMode="numeric"
                                        onKeyDown={blockInvalid}
                                        onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, ''); }}
                                        onBlur={(e) => {
                                          const n = parseInt(e.currentTarget.value || '0', 10);
                                          const clamped = Math.max(0, isNaN(n) ? 0 : n);
                                          setValue('sickLeaveDays', String(clamped), { shouldValidate: true, shouldDirty: true });
                                        }}
                                        className="text-gray-600 font-normal bg-transparent border-none outline-none flex-1"
                                        placeholder="0"
                                      />
                                      <div className="text-gray-500 font-medium">DNI</div>
                                    </div>
                                  </div>
                                  {errors.sickLeaveDays && <span className="text-red-500 text-sm mt-1">{errors.sickLeaveDays.message}</span>}
                                </div>
                              </div>
                            </div>

                            {/* Postal Code Section */}
                            <div className="bg-[rgba(0,0,0,0)] flex gap-[13px] text-lg text-[rgba(0,65,110,1)] font-semibold leading-loose flex-wrap mt-[15px] pr-20 py-0.5 max-md:max-w-full max-md:pr-5">
                              <img
                                src="https://api.builder.io/api/v1/image/assets/4fa82c39fade496f8994c11eefe8d01e/59edbd2ecba2ebbd7bf467378dd57accac1863e9?placeholderIfAbsent=true"
                                className="aspect-[1] object-contain w-10 shrink-0 rounded-full"
                                alt="Postal code icon"
                              />
                              <div className="bg-[rgba(0,0,0,0)] flex flex-col mt-1 pb-[31px]">
                                <div>Kod pocztowy</div>
                              </div>
                            </div>
                            <div className="bg-[rgba(0,0,0,0)] flex flex-col font-normal mt-2 pb-[39px] max-md:max-w-full max-md:pr-5">
                              <div className="bg-[rgba(0,0,0,0)] w-[461px] max-w-full pb-7">
                                <label className="bg-[rgba(0,0,0,0)] flex flex-col text-sm text-gray-500 leading-none justify-center py-1 max-md:max-w-full max-md:pr-5">
                                  <div>Kod pocztowy</div>
                                </label>
                                <div className="bg-[rgba(0,0,0,0)] text-base text-gray-600 whitespace-nowrap mt-2 max-md:max-w-full">
                                  <input
                                    {...register('postalCode', {
                                      pattern: {
                                        value: /^\d{2}-\d{3}$/,
                                        message: 'Kod pocztowy musi być w formacie XX-XXX'
                                      }
                                    })}
                                    type="text"
                                    maxLength={6}
                                    onChange={handlePostalCodeChange}
                                    className="bg-white border-gray-400 border flex flex-col justify-center px-4 py-[19px] rounded-lg border-solid max-md:max-w-full max-md:pr-5 w-full"
                                    placeholder="00-000"
                                  />
                                  {errors.postalCode && <span className="text-red-500 text-sm mt-1">{errors.postalCode.message}</span>}
                                </div>
                              </div>
                            </div>
                            </div>
                          )}
                        </div>

                        {/* Submit Button */}
                        <button
                          type="submit"
                          className="justify-center items-center border self-center z-10 flex w-[608px] max-w-full flex-col text-xl text-white font-bold text-center -mt-2 px-[70px] py-4 rounded-xl border-0 border-solid max-md:px-5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all"
                        >
                          <div className="flex gap-3 items-center">
                            <Rocket className="w-5 h-5" />
                            <div>
                              Zbuduj swoją przyszłość
                            </div>
                          </div>
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
            </div>
            
            <Footer />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
