// import React from 'react'
// import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

// const PayPalButton = ({ amount, onSuccess, onError }) => {
//   return (
//     <PayPalScriptProvider options={{ "client-id": "Aa2Y8aT_hKqwvuQXB8Mta6LQr5DFZBP0GiVbx7IxHk01x_kra-6siAcV6XUnq_g-WUaLP66gvRRgHToB" }}>
//       <PayPalButtons
//         style={{ layout: "vertical" }}
//         createOrder={(data, actions) => {
//           return actions.order.create({
//             purchase_units: [{
//               amount: {
//                 value: amount.toString(),   // ✅ Always a string
//                 currency_code: "USD"        // ✅ Safe for sandbox
//               }
//             }]
//           });
//         }}
//         onApprove={(data, actions) => {
//           return actions.order.capture().then(onSuccess);
//         }}
//         onError={onError}
//       />
//     </PayPalScriptProvider>
//   );
// };

// export default PayPalButton;
