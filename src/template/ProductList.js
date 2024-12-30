import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import swal from "sweetalert";

function ProductList() {
    const API_URL = "https://teretryt.com/v1/api";
    const serverUrl = "https://teretryt.com";
    const { productType } = useParams();
    const { t } = useTranslation();
    const [filterOpen, setFilterOpen] = useState(false);

    const [ProductList, setProductList] = useState([]);

    const productMaterials = [
        "Galvaniz",
        "Krom",
        "Pleksi",
    ];
    const [filterIsLight, setFilterIsLight] = useState(true);
    const [filterNotLight, setFilterNotLight] = useState(true);

    const changeLightFilter = () => {
        setFilterIsLight(!filterIsLight);
        //copy list ProductList ten iscolored filterIsLight a eşit olanları al 
        const filteredList = ProductList.data.letterbox.filter((product) => {
            return product.props.iscolored === filterIsLight;
        });
        setProductList(filteredList);
    };

    const changeNotLightFilter = () => {
        setFilterNotLight(!filterNotLight);
        const filteredList = ProductList.data.letterbox.filter((product) => {
            return product.props.iscolored === filterNotLight;
        });
        setProductList(filteredList);
    }

    const changeMaterialFilter = (event, material) => {
        const mf = event.currentTarget.getAttribute("data-material-filter");

        if (mf === "1") {
            event.currentTarget.setAttribute("data-material-filter", "0");

            event.currentTarget.classList.remove("bg-black");
            event.currentTarget.classList.remove("text-gray-100");
            event.currentTarget.classList.add("text-black");
        } else {
            event.currentTarget.setAttribute("data-material-filter", "1");

            event.currentTarget.classList.remove("text-black");
            event.currentTarget.classList.add("bg-black");
            event.currentTarget.classList.add("text-gray-100");
        }

        const filteredList = ProductList.data.letterbox.filter((product) => {
            return product.props.material.includes(material);
        });
        setProductList(filteredList);
    }

    const handleFilterOpen = () => {
        setFilterOpen(!filterOpen);
    }

    const threeDPreview = () => {
        swal({
            title: "3D Önizleme",
            text: "Bu özellik çok yakında aktif olacak!",
            icon: "info",
            button: {
                text: "Tamam",
                closeModal: true,
                className: "bg-gray-800 text-gray-100",
            },
        });   
    }

    /* USE EFFECT İLE GRAPHQL API POST GÖNDERİP VERİLER ÇEKİLİP BURADAKİ ÖRNEKLER GİBİ LİSTELENECEK */
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`${API_URL}/${productType}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        query: `
                            query {
                                ${productType} {
                                    id
                                    name
                                    type
                                    sizes
                                    prices
                                    props
                                    files
                                    selected_image
                                }
                            }
                        `,
                    }),
                });
    
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
                const data = await response.json();
                
                /* data.data.letterbox = data.data.letterbox.slice(0, 2); */
                
                data.data.letterbox.map((product) => {
                    product.sizes = JSON.parse(product.sizes);
                    product.prices = JSON.parse(product.prices);
                    product.props = JSON.parse(product.props);
                    product.files = JSON.parse(product.files);
                    product.visibility = true;
                });

                console.log("API Yanıtı:", data);

                setProductList(data);
            } catch (error) {
                console.error("Error:", error);
            }
        }
    
        fetchData();
    }, [productType]); // productType bağımlılığını ekleyin

    return (
        <section className="py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h2 className="font-manrope font-bold text-3xl min-[400px]:text-4xl text-black mb-8 max-lg:text-center">{t("products." + productType + ".title")}</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                   {/*  <NavLink to="/product" className="max-w-[384px] mx-auto">
                        <div className="w-full max-w-sm aspect-square">
                            <img src="https://pagedone.io/asset/uploads/1701157806.png" alt="cream image" className="w-full h-full rounded-xl object-cover"/>
                        </div>
                        <div className="mt-5 flex items-center justify-between">
                            <div className="">
                                <h6 className="font-medium text-xl leading-8 text-black mb-2">Skin care cream</h6>
                                <h6 className="font-semibold text-xl leading-8 text-indigo-600">$74.99</h6>
                            </div>
                            <button
                                className="p-2 min-[400px]:p-4 rounded-full bg-white border border-gray-300 flex items-center justify-center group shadow-sm shadow-transparent transition-all duration-500 hover:shadow-gray-200 hover:border-gray-400 hover:bg-gray-50">
                                <svg className="stroke-gray-900 transition-all duration-500 group-hover:stroke-black"
                                    xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26"
                                    fill="none">
                                    <path
                                        d="M12.6892 21.125C12.6892 22.0225 11.9409 22.75 11.0177 22.75C10.0946 22.75 9.34632 22.0225 9.34632 21.125M19.3749 21.125C19.3749 22.0225 18.6266 22.75 17.7035 22.75C16.7804 22.75 16.032 22.0225 16.032 21.125M4.88917 6.5L6.4566 14.88C6.77298 16.5715 6.93117 17.4173 7.53301 17.917C8.13484 18.4167 8.99525 18.4167 10.7161 18.4167H18.0056C19.7266 18.4167 20.587 18.4167 21.1889 17.9169C21.7907 17.4172 21.9489 16.5714 22.2652 14.8798L22.8728 11.6298C23.3172 9.25332 23.5394 8.06508 22.8896 7.28254C22.2398 6.5 21.031 6.5 18.6133 6.5H4.88917ZM4.88917 6.5L4.33203 3.25"
                                        stroke="" strokeWidth="1.6" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>
                    </NavLink> */}

                    {/* IF PRODUCT LIST */}
                    {ProductList && ProductList.data && ProductList.data.letterbox ?
                     (ProductList.data.letterbox.filter(product => product.visibility).map((product) => (
                        <NavLink to={`/products/${productType}/` + product.id} key={product.id} className="max-w-[320px] mx-auto">
                            <div className="w-full max-w-sm aspect-square">
                                <img src={serverUrl + product.files[product.selected_image]} alt={product.name} className="w-full h-full rounded-xl object-cover"/>
                            </div>
                            {/* ETİKET GİBİ badge eklenecek */}
                            <div className="">
                                <div className="mt-5 flex items-center justify-between">
                                    {/* MATERİAL AND LİGHT */}
                                    <div className="flex justify-start gap-2">
                                        {product.props.material.map((material) => (
                                            <span className="bg-white text-gray-800 border-2 text-sm px-2 py-1 rounded-full">{material}</span>
                                        ))}
                                    </div>
                                    {/* COLORS */}
                                    <span className="border-2 text-gray-900 text-sm px-2 py-1 rounded-full">{(product.props.iscolored) ? 'IŞIKLI': 'IŞIKSIZ'}</span>
                                </div>
                                <div className="mt-5 flex items-center justify-between">
                                    <div className="">
                                        <h6 className="font-small text-xl leading-8 text-gray-900 mb-2">{product.name}</h6>
                                        <h6 className="font-semibold text-md leading-8 text-gray-900">{product.prices[0]}$</h6>
                                    </div>
                                    <div className="flex gap-2">
                                        {/* 3D ÖNİZLEME GELİNCE KOY */}
                                        {/* <button onClick={threeDPreview} className="p-3 rounded-full bg-gray-100 flex items-center justify-center group shadow-sm shadow-transparent transition-all duration-500 hover:shadow-gray-200 hover:border-gray-400 hover:bg-gray-50">
                                            <svg height="35" width="35" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 310.288 310.288" xmlSpace="preserve" className="fill-[#ffffff]" stroke="#ffffff" strokeWidth="3.1028800000000003"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <polygon className="fill-[#262626]" points="287.641,76.497 155.144,0 22.647,76.497 155.144,152.993 "></polygon> </g> <g> <polygon className="fill-[#262626]" points="155.144,310.288 22.647,233.792 22.647,76.497 155.144,152.993 "></polygon> </g> <g> <polygon className="fill-[#262626]" points="155.144,310.288 287.641,233.792 287.641,76.497 155.144,152.993 "></polygon> </g> <g> <path className="fill-[#ffffff]" d="M64.62,208.163c2.68,3.262,8.896,9.53,15.434,13.304c12.109,6.992,15.86,1.44,15.754-4.408 c-0.107-9.815-8.896-19.069-18.005-24.328l-5.251-3.032v-7.073l5.251,3.031c6.859,3.96,15.54,5.435,15.54-2.817 c0-5.573-3.537-12.546-12.218-17.558c-5.572-3.217-10.932-3.846-13.932-3.435l-2.466-8.283c3.645-0.576,10.718,0.829,18.219,5.16 c13.718,7.92,19.935,19.654,19.935,28.121c0,7.181-4.287,10.815-12.86,8.974v0.214c8.573,6.665,15.539,17.117,15.539,26.871 c0,11.146-8.681,15.888-25.398,6.235c-7.824-4.517-14.684-10.942-18.112-15.173L64.62,208.163z"></path> </g> <g> <path className="fill-[#ffffff]" d="M197.157,174.405c5.68-4.137,12.432-8.677,19.826-12.947c13.396-7.734,22.935-10.132,29.258-7.889 c6.43,2.182,10.181,8.376,10.181,20.059c0,11.79-3.644,23.539-10.396,34.083c-6.752,10.65-17.897,20.729-31.937,28.835 c-6.645,3.836-12.218,6.731-16.933,8.918L197.157,174.405L197.157,174.405z M206.48,232.9c2.358-0.933,5.787-2.805,9.431-4.909 c19.935-11.509,30.759-28.905,30.759-48.412c0.106-17.103-9.538-22.358-29.258-10.973c-4.822,2.784-8.466,5.315-10.932,7.275 V232.9z"></path> </g> </g> </g></svg>
                                        </button> */}
                                        <button className="p-2 min-[400px]:p-4 rounded-full bg-gray-100 flex items-center justify-center group shadow-sm shadow-transparent transition-all duration-500 hover:shadow-gray-200 hover:border-gray-400 hover:bg-gray-50">
                                            <svg height="26" width="26" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M30.051 45.6071L17.851 54.7401C17.2728 55.1729 16.5856 55.4363 15.8662 55.5008C15.1468 55.5652 14.4237 55.4282 13.7778 55.1049C13.1319 54.7817 12.5887 54.2851 12.209 53.6707C11.8293 53.0563 11.6281 52.3483 11.628 51.626V15.306C11.628 13.2423 12.4477 11.2631 13.9069 9.8037C15.3661 8.34432 17.3452 7.52431 19.409 7.52405H45.35C47.4137 7.52431 49.3929 8.34432 50.8521 9.8037C52.3112 11.2631 53.131 13.2423 53.131 15.306V51.625C53.1309 52.3473 52.9297 53.0553 52.55 53.6697C52.1703 54.2841 51.6271 54.7807 50.9812 55.1039C50.3353 55.4272 49.6122 55.5642 48.8928 55.4998C48.1734 55.4353 47.4862 55.1719 46.908 54.739L34.715 45.6071C34.0419 45.1031 33.2238 44.8308 32.383 44.8308C31.5422 44.8308 30.724 45.1031 30.051 45.6071V45.6071Z" stroke="#1c1c1c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                                        </button>
                                        <button className="p-2 min-[400px]:p-4 rounded-full bg-gray-100 flex items-center justify-center group shadow-sm shadow-transparent transition-all duration-500 hover:shadow-gray-200 hover:border-gray-400 hover:bg-gray-50">
                                            <svg className="stroke-gray-900 transition-all duration-500 group-hover:stroke-black"
                                                xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26"
                                                fill="none">
                                                <path
                                                    d="M12.6892 21.125C12.6892 22.0225 11.9409 22.75 11.0177 22.75C10.0946 22.75 9.34632 22.0225 9.34632 21.125M19.3749 21.125C19.3749 22.0225 18.6266 22.75 17.7035 22.75C16.7804 22.75 16.032 22.0225 16.032 21.125M4.88917 6.5L6.4566 14.88C6.77298 16.5715 6.93117 17.4173 7.53301 17.917C8.13484 18.4167 8.99525 18.4167 10.7161 18.4167H18.0056C19.7266 18.4167 20.587 18.4167 21.1889 17.9169C21.7907 17.4172 21.9489 16.5714 22.2652 14.8798L22.8728 11.6298C23.3172 9.25332 23.5394 8.06508 22.8896 7.28254C22.2398 6.5 21.031 6.5 18.6133 6.5H4.88917ZM4.88917 6.5L4.33203 3.25"
                                                    stroke="" strokeWidth="1.6" strokeLinecap="round" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </NavLink>
                    ))) : (<h1 className="text-gray-600 text-3xl">Yükleniyor...</h1>)}
                </div>
            </div>
        </section>
    );
}

export default ProductList;