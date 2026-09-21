import { Link } from "react-router-dom";

export default function AdminHome() {
  return (
    <div>
      <h2>Admin Configuration</h2>

      <ul>
        <li><Link to="/admin/client-types">Client Types</Link></li>
        {/* Future: /admin/brokers, /admin/insurers, /admin/policy-types */}
      </ul>
    </div>
  );
}