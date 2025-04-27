import { AppCard } from "@/components/app/card";
import { renderStatusMessage } from "@/components/app/status-message/renderStatusMessage";
import { getCarts, getCartById } from "@/features/cart/actions/cartActions";
import { cn, formatDate } from "@/lib/utils";

// Render List of Carts
export async function RenderCarts({ className }: { className?: string }) {
  const cartsResult = await getCarts();
  const cardTitle = "Cart List";
  
  const statusMessage = renderStatusMessage(cartsResult, cardTitle);
  if (statusMessage || !cartsResult.ok) return statusMessage;

  const { data } = cartsResult;

  return (
    <AppCard title={cardTitle} className={cn("", className)}>
      {data.map((item) => (
        <div key={item.id}>
          {/* Render your item here */}
        </div>
      ))}
    </AppCard>
  );
}

// Render Single Cart
export async function RenderCart({ id, className }: { id: string; className?: string }) {
  const cartResult = await getCartById(id);
  const cardTitle = "Cart";
  
  const statusMessage = renderStatusMessage(cartResult, cardTitle);
  if (statusMessage || !cartResult.ok) return statusMessage;

  const { data } = cartResult;

  return (
    <AppCard title={cardTitle} className={cn("", className)}>
      <div key={data.id}>
        {/* Render your item here */}
      </div>
    </AppCard>
  );
}
