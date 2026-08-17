import { AdminShell } from "../../admin/AdminShell";
import { UserListContent } from "../../admin/kullanici-yonetimi/page";

export default function EditorUsersPage() {
  return <AdminShell><UserListContent basePath="/editor/kullanici-yonetimi" /></AdminShell>;
}
