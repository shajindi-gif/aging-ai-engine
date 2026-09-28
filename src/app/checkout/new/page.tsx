"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/layout/Header";
import { Loader2 } from "lucide-react";

export default function CheckoutEntryPage() {
  const router = useRouter();
  const params = useSearchParams();
  const product = params.get("product") || "pro-monthly";
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/pay/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product }),
        });
        const json = await res.json().catch(() => ({}));
        if (res.status === 401) {
          router.replace(`/login?callbackUrl=${encodeURIComponent(`/checkout/new?product=${product}`)}`);
          return;
        }
        if (res.ok && json.success) {
          router.replace(`/checkout/${json.data.orderNo}`);
        } else {
          setError(json.error || "下单失败，请通过联系表单咨询开通");
        }
      } catch {
        setError("网络异常，请重试");
      }
    })();
  }, [product, router]);

  return (
    <>
      <Header />
      <main className="flex min-h-[60vh] flex-1 items-center justify-center">
        {error ? (
          <div className="text-center">
            <p className="rounded-xl bg-red-50 px-5 py-3 text-sm text-red-700">{error}</p>
            <button onClick={() => router.push("/pricing")} className="yc-btn-secondary mt-4">返回定价页</button>
          </div>
        ) : (
          <p className="flex items-center gap-2 text-sm text-text-secondary"><Loader2 className="h-4 w-4 animate-spin" /> 正在创建订单…</p>
        )}
      </main>
    </>
  );
}
