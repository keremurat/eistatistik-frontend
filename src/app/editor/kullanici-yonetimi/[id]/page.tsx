import { AdminShell } from "../../../admin/AdminShell";
import { UserDetailContent } from "../../../admin/kullanici-yonetimi/[id]/page";

export default function EditorUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <AdminShell><UserDetailContent params={params} basePath="/editor/kullanici-yonetimi" /></AdminShell>;
}
