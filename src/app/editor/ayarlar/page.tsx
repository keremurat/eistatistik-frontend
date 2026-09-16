import { AdminShell } from "../../admin/AdminShell";
import { RoleSettingsContent } from "../../components/RoleSettingsContent";

export default function EditorSettingsPage() { return <AdminShell><RoleSettingsContent role="editor" roleLabel="Editör hesabı" name="eistatistik Editör" email="editor@eistatistik.com" /></AdminShell>; }
