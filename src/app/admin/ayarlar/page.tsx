import { AdminShell } from "../AdminShell";
import { RoleSettingsContent } from "../../components/RoleSettingsContent";

export default function AdminSettingsPage() { return <AdminShell><RoleSettingsContent role="admin" roleLabel="Yönetici" name="Kerem Murat" email="admin@eistatistik.com" /></AdminShell>; }
