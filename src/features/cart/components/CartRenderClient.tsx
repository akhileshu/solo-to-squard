"use client";

import { AppCard } from "@/components/app/card";
import { renderStatusMessage } from "@/components/app/status-message/renderStatusMessage";
import { getCarts, getCartById } from "@/features/cart/actions/cartActions";
import { cn } from "@/lib/utils";

type RenderCartsProps = {
  className?: string;
  cartsResult: Awaited<ReturnType<typeof getCarts>>;
};

type RenderCartProps = {
  className?: string;
  cartResult: Awaited<ReturnType<typeof getCartById>>;
};

// For List
export function RenderCarts({
  cartsResult,
  className,
}: RenderCartsProps) {
  const cardTitle = "Cart List";

  const statusMessage = renderStatusMessage(cartsResult, cardTitle);
  if (statusMessage || !cartsResult.ok) return statusMessage;

  const { data } = cartsResult;

  return (
    <AppCard title={cardTitle} className={cn("", className)}>
      <div className="divide-y">
        {data.map((item) => (
          <div key={item.id} className="">
            {/* Render your item here */}
          </div>
        ))}
      </div>
    </AppCard>
  );
}

// For Single Item
export function RenderCart({
  cartResult,
  className,
}: RenderCartProps) {
  const cardTitle = "Cart";

  const statusMessage = renderStatusMessage(cartResult, cardTitle);
  if (statusMessage || !cartResult.ok) return statusMessage;

  const { data } = cartResult;

  return (
    <AppCard title={cardTitle} className={cn("", className)}>
      <div className="divide-y">
        <div key={data.id} className="">
          {/* Render your item here */}
        </div>
      </div>
    </AppCard>
  );
}
