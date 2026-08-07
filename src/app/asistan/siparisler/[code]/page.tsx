import { Suspense } from "react";
import { AssistantHeader } from "../../AssistantHeader";
import { SharedOrderDetail } from "../../../admin/siparisler/DS260723008/OrderDetailContent";

export default async function AssistantOrderDetailPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  return (
    <div className="app-shell assistant-shell">
      <AssistantHeader />
      <Suspense>
        <SharedOrderDetail
          audience="asistan"
          orderCode={code}
          orderTitle="Yüksek lisans tezi veri analizi"
        />
      </Suspense>
    </div>
  );
}
