import { Button } from '@/components/ui/button';

import { CheckCircle, ShoppingCart, Store, Wrench } from 'lucide-react';
import Link from 'next/link';
import ResponsiveWidth from '@/components/shared/ResponsiveWidth';

function OurServices() {
  const userTypeCardInfo = [
    {
      id: 'buyer',
      borderColor: 'border-blue-200 hover:border-blue-400 hover:shadow-blue-500/25',
      iconBg: 'from-blue-500 to-blue-600',
      Icon: ShoppingCart,
      title: "I'm a Buyer",
      description:
        'Looking for quality computer chips? Browse thousands of listings from trusted sellers and find the perfect components for your build.',
      features: [
        'Verified sellers & quality products',
        'Competitive prices & great deals',
        'Secure transactions & fast delivery',
      ],
      featureColor: 'text-blue-700',
      buttonClass: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-blue-500/25',
      buttonLabel: 'Start Shopping 🛒',
      buttonLink: '/our-services/buy-products',
    },
    {
      id: 'seller',
      borderColor: 'border-green-200 hover:border-green-400 hover:shadow-green-500/25',
      iconBg: 'from-green-500 to-emerald-600',
      Icon: Store,
      title: "I'm a Seller",
      description:
        'Got unused computer chips? List your hardware and connect with buyers looking for quality components at great prices.',
      features: [
        'Reach thousands of buyers',
        'Easy listing with price guidance',
        'Secure platform & fast payments',
      ],
      featureColor: 'text-green-700',
      buttonClass: 'from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:shadow-green-500/25',
      buttonLabel: 'Create Sell Post 💰',
      buttonLink: '/dashboard/user/create-sell-post',
    },
    {
      id: 'repair',
      borderColor: 'border-orange-200 hover:border-orange-400 hover:shadow-orange-500/25',
      iconBg: 'from-orange-500 to-red-600',
      Icon: Wrench,
      title: 'Repair Product',
      description:
        'Need to repair a device? Enter diagnosis and get automated repair time estimation with our smart system.',
      features: [
        'Smart repair time estimation',
        'Expert diagnosis support',
        'Track or recycle options',
      ],
      featureColor: 'text-orange-700',
      buttonClass: 'from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 hover:shadow-orange-500/25',
      buttonLabel: 'Start Repair 🔧',
      buttonLink: '/dashboard/user/track-product',
    },
  ]

  return (
    <ResponsiveWidth>
      <div className="min-h-screen relative">

        {/* Floating Icons */}
        <div className="absolute top-5 left-5 sm:top-10 md:top-20 md:left-20 animate-bounce">
          <Store className="h-8 w-8 md:w-10 md:h-10 text-green-400 opacity-60" />
        </div>
        <div className="absolute top-5 right-5 sm:top-10 md:top-40 md:right-32 animate-bounce" style={{ animationDelay: '1s' }}>
          <ShoppingCart className="h-8 w-8 md:w-10 md:h-10 text-emerald-400 opacity-60" />
        </div>

        <div className="relative z-10 py-12 sm:px-4">
          {/* Hero Section */}
          <div className="text-center mb-8 md:mb-16">
            <div className='flex justify-center'>
              <div className="w-fit flex justify-center items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-6 border-2 border-green-500">
                <span className="text-lg">🔧</span>
                Welcome to Cheap Chip Marketplace
              </div>
            </div>

            <h1 className="text-3xl md:text-6xl font-bold mb-6 bg-linear-to-r from-green-600 via-emerald-600 to-green-800 bg-clip-text text-transparent leading-tight">
              What brings you here today?
            </h1>

            <p className="md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join our thriving community of tech enthusiasts. Whether you're looking to buy quality computer chips
              or sell your unused hardware, we've got you covered!
            </p>
          </div>

          {/* Service Selection */}
          <div className="max-w-7xl mx-auto">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-12 auto-rows-fr">
              {userTypeCardInfo.map((card) => (
                <div
                  key={card.id}
                  className="group cursor-pointer"
                >

                  <div className={`bg-white/90 backdrop-blur-sm rounded-xl  shadow-lg md:shadow-xl border-2 ${card.borderColor} py-8 p-4 md:p-12 lg:p-8 transition-all duration-300 transform hover:scale-102 h-full`}>
                    <div className="text-center flex flex-col justify-between h-full">
                      <div className='mb-6'>
                        <div className={`w-20 h-20 bg-linear-to-r ${card.iconBg} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                          <card.Icon className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{card.title}</h3>
                        <p className="text-gray-600">{card.description}</p>

                      </div>
                      <div className="space-y-3 mb-8 text-start">
                        {card.features.map((feature) => (
                          <div key={feature} className={`flex text-sm md:text-base sm:items-center gap-3 ${card.featureColor}`}>
                            <CheckCircle className="w-5 h-5" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                      <div>
                        <Link href={card.buttonLink} className="block h-full">
                          <Button className={`w-full py-4 text-lg bg-linear-to-r ${card.buttonClass} text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg`}>
                            {card.buttonLabel}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}


            </div>



            {/* Stats Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-green-600 mb-2">5,000+</div>
                  <div className="text-gray-600">Active Sellers</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-blue-600 mb-2">15,000+</div>
                  <div className="text-gray-600">Computer Chips Listed</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-emerald-600 mb-2">50,000+</div>
                  <div className="text-gray-600">Happy Customers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ResponsiveWidth>
  );
}

export default OurServices