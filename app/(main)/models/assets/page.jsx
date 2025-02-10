import { Suspense } from "react";
import ModelDetailPage from "@/components/model-detail";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ModelDetailPage />
    </Suspense>
  );
}
