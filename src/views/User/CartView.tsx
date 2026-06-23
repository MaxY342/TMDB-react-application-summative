import { ImageOverlay } from "@/components";
import { calculateSubtotal, calculateTax, calculateTotal, cartAction, favoriteAction, type ImageCell } from "@/core";
import { useFirebaseContext } from "@/hooks";

export const CartView = () => {
  const { cart, favorites, toggleCart, toggleFavorite, clearCart } = useFirebaseContext();
  const subtotal = calculateSubtotal(Array.from(cart.values()).map((item) => Number(item.secondaryText?.replace("$", ""))));
  const taxRate = 0.13;
  const taxAmount = calculateTax(subtotal, taxRate);
  const total = calculateTotal(subtotal, taxAmount);

  return (
    <section className="mx-auto max-w-7xl space-y-5 p-5">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-3xl">Cart</h1>
        {cart.size > 0 && (
          <button className="rounded bg-red-500 p-2 text-white hover:bg-red-600" onClick={() => clearCart()}>
            Empty Cart
          </button>
        )}
      </div>
      {cart.size === 0 ? (
        <p className="mt-10 text-gray-400">Your cart is empty.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-700">
          <table className="min-w-full table-auto border-collapse">
            <thead className="border-gray-700 border-b">
              <tr className="m-0 bg-gray-800 p-0">
                <th className="p-5 text-left text-gray-300">Item</th>
                <th className="p-5 text-left text-gray-300">Type</th>
                <th className="p-5 text-left text-gray-300">Price</th>
                <th className="p-5 text-left text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.from(cart.values()).map((image) => (
                <tr className="border-gray-700 border-t" key={image.id}>
                  <td className="flex items-center gap-4 p-5 py-4">
                    <img alt={image.primaryText} className="w-20 object-cover" src={image.imageUrl} />
                    <p>{image.primaryText}</p>
                  </td>
                  <td className="p-5">
                    <p>{image.mediaType === "movie" ? "Movie" : "TV Show"}</p>
                  </td>
                  <td className="p-5">
                    <p>{image.secondaryText}</p>
                  </td>
                  <td className="p-5">
                    <div className="relative mb-11">
                      <ImageOverlay
                        actions={[
                          cartAction((image: ImageCell) => cart.has(image.id), toggleCart),
                          favoriteAction((image: ImageCell) => favorites.has(image.id), toggleFavorite),
                        ]}
                        image={image}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              <tr className="border-gray-700 border-t">
                <td className="p-5 text-center font-bold text-2xl" colSpan={2}>
                  Subtotal
                </td>
                <td className="p-5 text-left font-bold" colSpan={2}>
                  ${subtotal}
                </td>
              </tr>
              <tr className="border-gray-700 border-t">
                <td className="p-5 text-center font-bold text-2xl" colSpan={2}>
                  Tax
                </td>
                <td className="p-5 text-left font-bold" colSpan={2}>
                  ${taxAmount}
                </td>
              </tr>
              <tr className="border-gray-700 border-t bg-gray-800">
                <td className="p-5 text-center font-bold text-2xl" colSpan={2}>
                  Total
                </td>
                <td className="p-5 text-left font-bold" colSpan={2}>
                  ${total}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
