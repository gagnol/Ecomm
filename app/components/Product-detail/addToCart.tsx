"use client"
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addCart } from '@/store/nextSlice';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';


interface AddToCartProps {
  product: any;
  discountPrice:number
}
const AddCart: React.FC<AddToCartProps> = ({ product,discountPrice }) => {

  const { countryData } = useSelector((state: any) => state.next);
  
  const dispatch = useDispatch();
  return (
    <>
      <button className="w-full bg-[#f7ca00] p-2 rounded-[25px] 
          text-neutral font-bold cursor-pointer mb-2 hover:opacity-75"
        onClick={() =>
          dispatch(
            addCart({
              _id: product._id,
              brand: product.brand,
              category: product.category,
              description: product.description,
              image: product.image[0],
              price: product.price,
              name: product.name,
              video: [""],
              slug: "",
              subcategory: "",
              rating: 0,
              numReviews: 0,
              countInStock:product.countInStock,
              isFeature: "",
              discount: 0,
              topDeal: "",
              bestSeller: "",
              colors: [""],
              quantity: 1,
              discountPrice:Number(discountPrice),
              countryData:[countryData]
            }),
            toast.success('Product add to your cart', { duration: 4000, position: "top-center", })
          )
        } >
        Add to Cart
      </button>

    </>
  )
}

export default AddCart
