import { useDispatch } from "react-redux";
import { setCheckout } from "../../redux/slices/checkoutSlice";

const RazorpayButton = ({ amount, shippingAddress, onSuccess, products }) => {
  const dispatch = useDispatch();
  const handlePayment = async () => {
    const options = {
      key: "rzp_test_RVJdKYSZFlpemW", // Test key
      amount: amount * 100,
      currency: "INR",
      name: "Buydora",
      description: products
        .map(
          (item) =>
            `${item.name} (Qty: ${item.quantity || 1}, Size: ${item.size}, Color: ${item.color})`
        )
        .join(" | "),
      image: "razorpay.png",

      handler: async function (response) {
        try {
          const token = localStorage.getItem("userToken");

          if (!token) {
            alert("❌ User not authenticated. Please login.");
            return;
          }

          const filledProducts = await Promise.all(
            products.map(async (item) => {
              if (!item._id || !item.name || !item.price) {
                try {
                  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products/${item.productId}`);
                  if (!res.ok) throw new Error("Failed to fetch product details");
                  const fullData = await res.json();
                  return {...item, ...fullData };
                
                } catch (error) {
                  console.warn("⚠️ Error fetching product details:", item.productId, error);
                  return item;
                }
              }
              return item;
            })
          );
          const validProducts = filledProducts.filter(item => item._id && item.name && item.price);

          if (validProducts.length < products.length) {
            console.warn("⚠️ Removed items missing product IDs:", products.filter(item => !item._id));
            alert("⚠️ Some items were removed from your order because they’re missing product IDs.");
          }

          if (validProducts.length === 0) {
            alert("❌ No valid products in the cart. Please add items before paying.");
            return;
          }

          const orderPayload = {
            orderItems: validProducts.map((item) => ({
              productId: item._id,
              name: item.name,
              quantity: item.quantity || 1,
              size: item.size,
              color: item.color,
              price: item.price,
              image: item.image,
            })),
            shippingAddress: {
              address: shippingAddress.address,
              city: shippingAddress.city,
              postalCode: shippingAddress.postalCode,
              country: shippingAddress.country,
            },
            totalPrice: amount,
            paymentMethod: "Razorpay",
          };

          console.log("🛒 Final Order Payload:", orderPayload);

          const res = await fetch("http://localhost:9000/api/orders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(orderPayload),
          });


          if (res.ok) {
            const data = await res.json();
            console.log("✅ Order saved:", data);
            dispatch(setCheckout(data));
            alert("✅ Payment successful! Order saved.");
            onSuccess(data);
          } else {
            const errorData = await res.json();
            throw new Error(errorData.message || "Order save failed");
          }
        } catch (err) {
          console.error("❌ Payment succeeded but order saving failed:", err);
          alert("❌ Payment succeeded, but saving order failed.");
        }
      },

      prefill: {
        name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
        email: "test@example.com",
        contact: shippingAddress.phone,
      },
      notes: {
        address: shippingAddress.address,
      },
      theme: {
        color: "#3399cc",
      },
    };
    try {

      const rzp = new window.Razorpay(options);
      rzp.set('enable_telemetry', false);
      rzp.open();
      rzp.on("payment.failed", function (response) {
        alert("Payment failed, please try again.");
        console.error("Payment error", response.error);
      });
    } catch (error) {
      console.error("❌ Razorpay window couldn’t open:", error);
      alert("❌ Unable to open payment window. Please refresh and try again.");
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="w-full bg-green-600 text-white py-3 rounded"
    >
      Pay ₹{amount.toLocaleString()} with Razorpay
    </button>
  );
};

export default RazorpayButton;
