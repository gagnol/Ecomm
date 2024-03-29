 "use client"
import { useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { checkoutOrder, createOrder } from '@/lib/order-actions';
import { useEffect } from "react";
import Link from "next/link";

interface CartItem {
  discountPrice: number;
  quantity: number;
  shipping: number;
  importFees: number;
  totalPrice: number;
}


const CartPayment = () => {
 
  const router = useRouter();

  const { productData, countryData,userInfo } = useSelector(
    (state: any) => state.next
  );

  const subTotal = (
    productData.reduce(
      (acc: number, item: CartItem) =>
        acc + item.discountPrice * item.quantity,
      0
    )
  );
  const shipping = (
    productData.reduce(
      (acc: number, item: any) => acc + countryData[0].shipping * item.quantity,
      0
    )
  );
  const importFees = (
    productData.reduce(
      (acc: number, item: any) => acc + countryData[0].importFees * item.quantity,
      0
    )
  );
  const totalAmount = subTotal + shipping + importFees
  

  
// Stripe payment
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);
const { data: session } = useSession();

useEffect(() => {
  if (!session || !session.user) {
    router.push('/signin');
  }
  if(!userInfo){
    router.push('/signin');
  }
  if (userInfo.user?.address === "") {
   
    router.push('/profile')
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [session]);
 
const onCheckout = async () => {
  const order  = {
    quantity:productData.map((item:any) => item.quantity),
    productId:productData.map((item:any) => item._id),
    productImage:productData.map((item:any) => item.image),
    productName:productData.map((item:any) => item.name.substring(0,10)),
    subTotal,
    shipping,
    importFees,
    totalAmount,
    email: session?.user?.email || "",
    userId:session?.user?.name || "",
    shippingInfo:userInfo.user.address+","+userInfo.user.city+","+userInfo.user.postal+","+userInfo.user.country|| ""
  }

  await checkoutOrder(order);
  await createOrder(order)
}

  return (
    <div className="flex flex-wrap flex-col gap-3 min-w-full bg-neutral">
      <div className="rounded-md border mt-5 p-2">      
      <h2>Address:&nbsp;{userInfo?.user.address}</h2>
      <h2>City:&nbsp;{userInfo?.user.city}</h2>
      <h2>Postal:&nbsp;{userInfo?.user.postal}</h2>
      <h2>Shipping to {countryData[0]?.country}</h2>
      <Link href="/profile">
        <p className="text-primary cursor hover:text-secondary">Update shipping info</p>
      </Link>
      </div>
      <p className="flex items-center justify-between px-1 font-semibold text-white">
        SubTotal: {" "}(
        {Math.ceil(
          productData.reduce((a: number, c: CartItem) => a + c.quantity, 0)
        )}{" "}
        items)
        <span className="font-bold text-xl">${subTotal}</span>
      </p>
      <p>
        Shipping:<span className="float-right pr-1">${shipping}</span>
      </p>
      <p>
        Import Fees:<span className="float-right pr-1">${importFees}</span>
      </p>
      <p className="flex items-center justify-between px-1 font-semibold border-t">
        Total:{" "}
        <span className="font-bold text-xl pt-1">${Math.ceil(totalAmount)}</span>
      </p>
      <div className="flex flex-col items-center">
      <form action={onCheckout} method="post">
        <button
          type="submit"
          className="btn btn-primary btn-outline w-full"
        >
          Proceed to Buy
        </button>
        </form>
      </div>
    </div>
  );
};

export default CartPayment;
