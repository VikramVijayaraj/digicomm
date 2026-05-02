export default function ProductDownloadEmail({ orders, email }) {
  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: 600, margin: "0 auto" }}>
      <h2>Your purchase is ready 🎉</h2>
      <p>Hi {email}, thank you for your purchase! Here are your downloads:</p>

      {orders.map((item) => (
        <div
          key={item.order_item_id}
          style={{
            border: "1px solid #eee",
            borderRadius: 8,
            padding: 16,
            marginBottom: 12,
          }}
        >
          <p style={{ fontWeight: "bold", margin: "0 0 4px" }}>
            {item.product_name}
            {item.quantity > 1 && (
              <span style={{ color: "#888", fontWeight: "normal" }}>
                {" "}
                (x{item.quantity})
              </span>
            )}
          </p>
          <p style={{ fontSize: 12, color: "#888", margin: "0 0 12px" }}>
            {item.category_name}
          </p>

          {item.files.map((fileUrl, i) => (
            <a
              key={i}
              href={fileUrl}
              style={{
                display: "inline-block",
                backgroundColor: "#000",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: 6,
                textDecoration: "none",
                fontSize: 14,
                marginRight: 8,
              }}
            >
              Download {item.files.length > 1 ? `File ${i + 1}` : "File"}
            </a>
          ))}
        </div>
      ))}

      <div
        style={{
          marginTop: 24,
          padding: 16,
          backgroundColor: "#f9f9f9",
          borderRadius: 8,
        }}
      >
        <p style={{ margin: "0 0 8px", fontWeight: "bold" }}>
          Want to access your orders anytime?
        </p>
        <p style={{ margin: "0 0 12px", fontSize: 14, color: "#555" }}>
          Create an account with this email and your purchases will be linked
          automatically.
        </p>
        <a
          href={`${process.env.NEXT_PUBLIC_APP_URL}/register?email=${email}`}
          style={{
            display: "inline-block",
            backgroundColor: "#000",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: 6,
            textDecoration: "none",
            fontSize: 14,
          }}
        >
          Create an Account
        </a>
      </div>

      <p style={{ fontSize: 12, color: "#aaa", marginTop: 24 }}>
        © Crelands. All rights reserved.
      </p>
    </div>
  );
}
