import React from "react";
import TwCard from "../components/TwCard";
import HomeCarousel from "../components/HomeCarousel";

function Home() 
{
    const icon1 = (
      <svg
        className="w-7 h-7 text-gray-500 dark:text-gray-400 fill-white"
        version="1.1" 
        viewBox="0 0 422.518 422.518" 
        xmlSpace="preserve">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M422.512,215.424c0-0.079-0.004-0.158-0.005-0.237c-0.116-5.295-4.368-9.514-9.727-9.514h-2.554l-39.443-76.258 c-1.664-3.22-4.983-5.225-8.647-5.226l-67.34-0.014l2.569-20.364c0.733-8.138-1.783-15.822-7.086-21.638 c-5.293-5.804-12.683-9.001-20.81-9.001h-209c-5.255,0-9.719,4.066-10.22,9.308l-2.095,16.778h119.078 c7.732,0,13.836,6.268,13.634,14c-0.203,7.732-6.635,14-14.367,14H126.78c0.007,0.02,0.014,0.04,0.021,0.059H10.163 c-5.468,0-10.017,4.432-10.16,9.9c-0.143,5.468,4.173,9.9,9.641,9.9H164.06c7.168,1.104,12.523,7.303,12.326,14.808 c-0.216,8.242-7.039,14.925-15.267,14.994H54.661c-5.523,0-10.117,4.477-10.262,10c-0.145,5.523,4.215,10,9.738,10h105.204 c7.273,1.013,12.735,7.262,12.537,14.84c-0.217,8.284-7.109,15-15.393,15H35.792v0.011H25.651c-5.523,0-10.117,4.477-10.262,10 c-0.145,5.523,4.214,10,9.738,10h8.752l-3.423,35.818c-0.734,8.137,1.782,15.821,7.086,21.637c5.292,5.805,12.683,9.001,20.81,9.001 h7.55C69.5,333.8,87.3,349.345,109.073,349.345c21.773,0,40.387-15.545,45.06-36.118h94.219c7.618,0,14.83-2.913,20.486-7.682 c5.172,4.964,12.028,7.682,19.514,7.682h1.55c3.597,20.573,21.397,36.118,43.171,36.118c21.773,0,40.387-15.545,45.06-36.118h6.219 c16.201,0,30.569-13.171,32.029-29.36l6.094-67.506c0.008-0.091,0.004-0.181,0.01-0.273c0.01-0.139,0.029-0.275,0.033-0.415 C422.52,215.589,422.512,215.508,422.512,215.424z M109.597,329.345c-13.785,0-24.707-11.214-24.346-24.999 c0.361-13.786,11.87-25.001,25.655-25.001c13.785,0,24.706,11.215,24.345,25.001C134.89,318.131,123.382,329.345,109.597,329.345z M333.597,329.345c-13.785,0-24.706-11.214-24.346-24.999c0.361-13.786,11.87-25.001,25.655-25.001 c13.785,0,24.707,11.215,24.345,25.001C358.89,318.131,347.382,329.345,333.597,329.345z M396.457,282.588 c-0.52,5.767-5.823,10.639-11.58,10.639h-6.727c-4.454-19.453-21.744-33.882-42.721-33.882c-20.977,0-39.022,14.429-44.494,33.882 h-2.059c-2.542,0-4.81-0.953-6.389-2.685c-1.589-1.742-2.337-4.113-2.106-6.676l12.609-139.691l28.959,0.006l-4.59,50.852 c-0.735,8.137,1.78,15.821,7.083,21.637c5.292,5.806,12.685,9.004,20.813,9.004h56.338L396.457,282.588z"></path> </g>
      </svg>
    );
    const icon2 = (
      <svg 
        className="w-7 h-7 text-gray-500 dark:text-gray-400 fill-white"
        viewBox="0 0 24 24" 
        version="1.1" 
        xmlSpace="preserve">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <path d="M17.33,5.67c-0.08-0.55-0.19-1.23-0.71-1.76c-0.53-0.52-1.21-0.63-1.76-0.71c-0.23-0.03-0.46-0.07-0.6-0.13 c-0.12-0.05-0.3-0.19-0.48-0.32C13.35,2.44,12.77,2,12,2s-1.35,0.44-1.78,0.76c-0.18,0.13-0.36,0.27-0.48,0.32 C9.6,3.13,9.37,3.17,9.14,3.2C8.59,3.28,7.91,3.39,7.39,3.91C6.86,4.44,6.76,5.12,6.67,5.67C6.64,5.9,6.6,6.13,6.55,6.27 C6.5,6.39,6.36,6.57,6.23,6.74C5.91,7.17,5.47,7.76,5.47,8.53s0.44,1.35,0.76,1.78c0.13,0.18,0.27,0.36,0.32,0.48 c0.06,0.14,0.09,0.37,0.13,0.6c0.08,0.55,0.19,1.23,0.71,1.76c0.53,0.52,1.21,0.63,1.76,0.71c0.23,0.03,0.46,0.07,0.6,0.13 c0.12,0.05,0.3,0.19,0.48,0.32c0.43,0.32,1.01,0.76,1.78,0.76c0.77,0,1.35-0.44,1.78-0.76c0.17-0.13,0.36-0.27,0.48-0.32 c0.14-0.06,0.37-0.09,0.6-0.13c0.55-0.08,1.23-0.19,1.76-0.71c0.53-0.52,0.63-1.21,0.71-1.76c0.03-0.23,0.07-0.46,0.13-0.6 c0.05-0.12,0.19-0.3,0.32-0.48c0.32-0.43,0.76-1.01,0.76-1.78s-0.44-1.35-0.76-1.78c-0.13-0.18-0.27-0.36-0.32-0.48 C17.4,6.13,17.36,5.9,17.33,5.67z M16.17,9.11c-0.2,0.26-0.42,0.56-0.56,0.91c-0.15,0.36-0.21,0.74-0.26,1.07 c-0.03,0.21-0.08,0.56-0.15,0.64c-0.08,0.07-0.43,0.12-0.64,0.15c-0.33,0.05-0.7,0.11-1.07,0.26c-0.35,0.15-0.65,0.37-0.91,0.56 c-0.17,0.13-0.48,0.36-0.58,0.36s-0.42-0.23-0.58-0.36c-0.26-0.2-0.56-0.42-0.91-0.56c-0.36-0.15-0.74-0.21-1.07-0.26 c-0.21-0.03-0.56-0.08-0.64-0.14c-0.07-0.08-0.12-0.44-0.15-0.65c-0.05-0.33-0.11-0.7-0.26-1.07C8.25,9.67,8.03,9.37,7.83,9.11 C7.71,8.94,7.47,8.63,7.47,8.53s0.23-0.42,0.36-0.58c0.2-0.26,0.42-0.56,0.56-0.91C8.54,6.67,8.6,6.3,8.65,5.97 C8.68,5.76,8.74,5.41,8.8,5.33c0.08-0.07,0.43-0.12,0.64-0.15c0.33-0.05,0.7-0.11,1.06-0.26c0.35-0.15,0.65-0.37,0.91-0.56 C11.58,4.23,11.9,4,12,4s0.42,0.23,0.58,0.36c0.26,0.2,0.56,0.42,0.91,0.56c0.36,0.15,0.74,0.21,1.07,0.26 c0.21,0.03,0.56,0.08,0.64,0.14c0.07,0.08,0.12,0.44,0.15,0.65c0.05,0.33,0.11,0.7,0.26,1.07c0.15,0.35,0.37,0.65,0.56,0.91 c0.13,0.17,0.36,0.48,0.36,0.58S16.29,8.94,16.17,9.11z"></path><path d="M2.76,17.97l3.51,0.88l1.04,2.53c0.13,0.31,0.41,0.54,0.74,0.6c0.33,0.06,0.68-0.05,0.91-0.3L12,18.46l3.04,3.23 c0.19,0.2,0.46,0.31,0.73,0.31c0.06,0,0.12-0.01,0.18-0.02c0.33-0.06,0.61-0.29,0.74-0.6l1.04-2.53l3.51-0.88 c0.37-0.09,0.65-0.38,0.73-0.75s-0.05-0.75-0.35-0.99l-2.95-2.38c-0.43-0.35-1.06-0.28-1.41,0.15c-0.35,0.43-0.28,1.06,0.15,1.41 l1.39,1.12l-2.05,0.51c-0.31,0.08-0.56,0.3-0.68,0.59l-0.65,1.57l-2.7-2.87c-0.38-0.4-1.08-0.4-1.46,0l-2.7,2.87l-0.65-1.57 c-0.12-0.29-0.37-0.51-0.68-0.59l-2.05-0.51l1.39-1.12c0.43-0.35,0.5-0.98,0.15-1.41c-0.35-0.43-0.97-0.5-1.41-0.15l-2.95,2.38 c-0.29,0.24-0.43,0.62-0.35,0.99S2.39,17.88,2.76,17.97z"></path>
          <polygon points="12,5.62 11.19,7.27 9,7.62 10.69,8.81 10,10.62 12,9.77 14,10.62 13.31,8.81 15,7.62 12.81,7.27 ">
          </polygon>
        </g>
      </svg>
    );
    const icon3 = (
      <svg
        className="w-7 h-7 text-gray-500 dark:text-gray-400 fill-white"
        version="1.1"
        viewBox="0 0 32 32"
        xmlSpace="preserve"
        >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <path className="linesandangles_een" d="M20,20.854c0-1.136,0.642-2.175,1.658-2.683L24,17L17,3h-2L8,17l2.342,1.171 C11.358,18.679,12,19.718,12,20.854V21h-2v8h12v-8h-2V20.854z M11.236,16.382l-0.553-0.276L15,7.472V15h2V7.472l4.317,8.633 l-0.553,0.276C19.059,17.234,18,18.948,18,20.854V21h-4v-0.146C14,18.948,12.941,17.234,11.236,16.382z M20,27h-8v-4h8V27z"></path>
        </g>
      </svg>
    );

    return (
        <>
          <HomeCarousel/>
          <div id="pageBottom" className="flex flex-row flex-wrap w-full gap-5 justify-center mt-0 lg:mt-96 md:mt-72 px-[40px] lg:px-0 md:px-0">
              <div className="w-full">
                <h1 className="text-3xl font-bold text-center bg-red-700 text-white w-72 mx-auto py-2 px-4 rounded-xl">Hakkımızda</h1>
                <div className="flex flex-wrap align-center justify-center gap-5 p-2 mt-4">
                  <div className="flex flex-col gap-5 lg:w-[40%] sm:w-full">
                    <p className="text-xl text-gray-700 mt-5 p-2">TabelaSign, 2021 yılında kurulmuş bir dijital tabela üretim firmasıdır. 
                      Amacımız, müşterilerimize en kaliteli hizmeti sunarak, onların ihtiyaçlarını karşılamaktır. 
                      Tabelanızı 3D editörümüzü kullanarak dakikalar içinde tasarlama ve sipariş verme imkanına sahip olmanızı sağlayan TabelaSign, 1 hafta içinde tabelanızı teslim eder.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 text-xl">
                        <i className="fab fa-facebook text-[#316FF6]"> TABELASIGN</i>
                        <i className="fab fa-instagram text-[#833AB4]"> TABELASIGN</i>
                        <i className="fab fa-linkedin text-[#0e76a8]"> TABELASIGN</i>
                        <i className="fab fa-youtube text-[#FF0000]"> TABELASIGN</i>
                    </div>
                  </div>
                  <iframe className="border-0 grayscale-[100%]" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24086.526203575704!2d28.679701840937863!3d41.00740525971905!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cabb2963692d35%3A0xc14cd028ea3247d!2zRW5kZW1hbiBVbHVzbGFyYXJhc8SxIEZ1YXJjxLFsxLFr!5e0!3m2!1str!2str!4v1735139323868!5m2!1str!2str" width="600" height="450" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                </div>
              </div>
              
              <div className="flex flex-col gap-5">
                <h1 className="text-3xl font-bold text-center bg-red-700 text-white w-72 mx-auto py-2 px-4 rounded-xl">Neden Biz?</h1>

                <div className="flex flex-wrap gap-5 justify-center">
                  <TwCard icon={icon1} title={"Hızlı Teslim"} content={"Tabelanız en geç 1 haftada elinizde!"} />
                  <TwCard icon={icon2} title={"Kalite"} content={"Tabelanız son derece özenli şekilde ustalarımız tarafından hazırlanır"} />
                  <TwCard icon={icon3} title={"Özgün Tasarım İmkanı"} content={"Tabelanızı 3D editörümüzü kullanarak dakikalar içinde hazırlayabilirsiniz!"} />
                </div>
              </div>
          </div>
        </>
    )
}

export default Home;