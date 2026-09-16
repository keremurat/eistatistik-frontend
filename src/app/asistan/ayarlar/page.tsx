import { AssistantHeader } from "../AssistantHeader";
import { RoleSettingsContent } from "../../components/RoleSettingsContent";

export default function AssistantSettingsPage() { return <div className="app-shell assistant-shell"><AssistantHeader /><main className="admin-dash"><RoleSettingsContent role="asistan" roleLabel="Asistan hesabı" name="eistatistik Asistan" email="asistan@eistatistik.com" /></main></div>; }
