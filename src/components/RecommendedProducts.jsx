import React from 'react';
import { ShoppingCart, ExternalLink, Leaf, Sprout, Droplets } from 'lucide-react';

const productsData = {
  tomato: [
    {
      name: 'Imidacloprid 17.8% SL',
      type: 'Insecticide',
      useCase: 'Controls aphids & whiteflies',
      price: '₹280 – ₹350',
      link: 'https://www.amazon.in/s?k=Imidacloprid+17.8%25+SL',
      image: 'https://picsum.photos/seed/Imi/150',
      icon: <Sprout size={16} className="text-yellow-400" />
    },
    {
      name: 'Mancozeb 75% WP',
      type: 'Fungicide',
      useCase: 'Prevents leaf spot & blight',
      price: '₹220 – ₹300',
      link: 'https://www.flipkart.com/search?q=Mancozeb+75%25+WP',
      image: 'https://picsum.photos/seed/Man/150',
      icon: <Leaf size={16} className="text-red-400" />
    },
    {
      name: 'NPK 19:19:19',
      type: 'Fertilizer',
      useCase: 'Balanced crop nutrition',
      price: '₹950 – ₹1100',
      link: 'https://www.indiamart.com/search.mp?ss=NPK+19%3A19%3A19',
      image: 'https://picsum.photos/seed/NPK/150',
      icon: <Droplets size={16} className="text-blue-400" />
    }
  ],
  default: [
    {
      name: 'Neem Oil Concentrate',
      type: 'Pesticide',
      useCase: 'Broad-spectrum pest control',
      price: '₹350 – ₹450',
      link: 'https://example.com/neem-oil',
      image: 'https://picsum.photos/seed/Neem/150',
      icon: <Sprout size={16} className="text-yellow-400" />
    },
  ]
};

const ProductCard = ({ product }) => (
  <div className="bg-white/5 rounded-xl p-3 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-teal-500/20 border border-white/10">
    <img src={product.image} alt={product.name} className="w-full h-20 object-cover rounded-md mb-3" />
    <h4 className="font-bold text-base text-[#e8f1ff] truncate">{product.name}</h4>
    <div className="flex items-center space-x-2 text-xs text-[#9fb3c8] mb-1">
      {product.icon}
      <span>{product.type}</span>
    </div>
    <p className="text-sm text-[#9fb3c8] mb-2 h-10">{product.useCase}</p>
    <p className="font-semibold text-lg text-[#34e89e] mb-3">{product.price}</p>
    <a
      href={product.link}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full text-sm flex items-center justify-center space-x-2 bg-teal-600/50 text-white font-semibold py-2 px-3 rounded-lg transition-all duration-300 hover:bg-teal-500 hover:shadow-lg hover:shadow-teal-500/40 transform hover:-translate-y-0.5"
    >
      <span>View on Store</span>
      <ExternalLink size={14} />
    </a>
  </div>
);

const RecommendedProducts = ({ cropId }) => {
  const products = productsData[cropId] || productsData.default;

  return (
    <div className="mt-6 border-t border-teal-300/20 pt-4">
      <h3 className="flex items-center space-x-2 text-lg font-bold text-[#e8f1ff] mb-1">
        <ShoppingCart size={20} className="text-[#34e89e]" />
        <span>Recommended Products</span>
      </h3>
      <p className="text-sm text-[#9fb3c8] mb-4">Trusted inputs for your crop</p>
      <div className="grid grid-cols-1 gap-4">
        {products.map((product) => (
          <ProductCard key={product.name} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RecommendedProducts;
