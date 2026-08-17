import { AdminShell } from "../../../admin/AdminShell";
import { EducationListContent } from "../../../admin/egitim-talepleri/egitim-listesi/page";

export default function EditorEducationListPage() {
  return <AdminShell><EducationListContent basePath="/editor/egitim-talepleri/egitim-listesi" /></AdminShell>;
}
