import React, { useState } from 'react';

interface PricingCardProps {
    plan: string;
    price: string;
    features: string[];
    isFeatured?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, price, features, isFeatured = false }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isButtonHovered, setIsButtonHovered] = useState(false);

    const cardBaseClasses = "text-center flex flex-col w-full sm:flex-1 sm:min-w-[200px] sm:max-w-[220px] md:max-w-[280px] lg:max-w-[320px] xl:max-w-[360px] 2xl:max-w-[400px] min-h-[480px] sm:min-h-[520px] md:min-h-[560px] lg:min-h-[600px] xl:min-h-[640px] 2xl:min-h-[680px] m-0 shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-transform duration-200 ease-in-out cursor-pointer rounded focus:outline-none focus:ring-4 focus:ring-blue-500/50";

    const cardVariantClasses = isFeatured
        ? "bg-dark-slate text-white"
        : "bg-white text-dark-slate";

    const transformClasses = isFeatured
        ? (isHovered ? "scale-105 -translate-y-1" : "scale-105")
        : (isHovered ? "-translate-y-2" : "");

    const separatorClasses = isFeatured
        ? "w-full h-0.5 bg-white"
        : "w-full h-0.5 bg-black/15";

    return (
        <div
            className={`${cardBaseClasses} ${cardVariantClasses} ${transformClasses} py-6 sm:py-8 md:py-10 lg:py-12`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            role="button"
            aria-label={`${plan} pricing plan for ${price}`}
        >
            <div className="px-4 sm:px-6 lg:px-8">
                <h2 className="text-xl sm:text-2xl lg:text-3xl m-0 font-medium">{plan}</h2>
            </div>
            <div className="flex flex-col items-center py-1 sm:py-2 lg:py-3 px-4 sm:px-6 lg:px-8">
                <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-none tracking-[-2px]">
                    {price}
                </div>
            </div>
            <div className={separatorClasses} />
            <div className="flex flex-col w-full mt-2 sm:mt-3 lg:mt-4">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="flex flex-col w-full"
                    >
                        <div className="py-2 sm:py-3 lg:py-4 px-4 sm:px-6 lg:px-8 text-xs sm:text-sm lg:text-base">
                            {feature}
                        </div>
                        <div className={separatorClasses} />
                    </div>
                ))}
            </div>
            <div className="px-4 sm:px-6 lg:px-8 mt-auto">
                <button
                    className={`
                        bg-transparent border-none p-2 sm:p-3 lg:p-4 rounded-sm cursor-pointer font-bold w-full text-xs sm:text-sm lg:text-base tracking-[0.5px] 
                        transition-all duration-200 ease-in-out
                        focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:ring-offset-2
                        ${isFeatured ? 'text-white focus:ring-offset-slate-800' : 'text-dark-slate focus:ring-offset-white'}
                        ${isButtonHovered ? 'opacity-90 -translate-y-0.5' : 'opacity-100'}
                    `}
                    onMouseEnter={() => setIsButtonHovered(true)}
                    onMouseLeave={() => setIsButtonHovered(false)}
                    aria-label={`Subscribe to ${plan} plan`}
                >
                    SUBSCRIBE
                </button>
            </div>
        </div>
    );
};

export default PricingCard; 