import PricingCard from './components/PricingCard';

function App() {
  const pricingData = [
    {
      plan: 'Standard',
      price: '$100',
      features: [
        '50,000 Requests',
        '4 contributors',
        'Up to 3 GB storage space'
      ]
    },
    {
      plan: 'Pro',
      price: '$200',
      features: [
        '100,000 Requests',
        '7 contributors',
        'Up to 6 GB storage space'
      ],
      isFeatured: true
    },
    {
      plan: 'Expert',
      price: '$500',
      features: [
        '200,000 Requests',
        '11 contributors',
        'Up to 10 GB storage space'
      ]
    }
  ];

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center-safe p-4 sm:p-6 md:p-8 font-sans overflow-auto">
      <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-medium m-0 mb-6 sm:mb-8 md:mb-12 text-center">
        Pricing
      </h1>
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 justify-center items-center sm:items-stretch w-full max-w-sm sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-[1400px] mx-auto px-2 sm:px-4 md:px-6 lg:px-8 pb-8 sm:pb-0">
        {pricingData.map((pricing, index) => (
          <PricingCard
            key={index}
            plan={pricing.plan}
            price={pricing.price}
            features={pricing.features}
            isFeatured={pricing.isFeatured}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
