import { NavLink } from "react-router-dom";
import { 
  Settings, 
  Users, 
  Database,
  ListTodo,
  HardDrive,
  LayoutDashboard 
} from "lucide-react";

const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-background border-r h-full">
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                  isActive ? 'bg-primary/10 text-primary' : 'hover:bg-primary/5'
                }`
              }
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                  isActive ? 'bg-primary/10 text-primary' : 'hover:bg-primary/5'
                }`
              }
            >
              <Users className="w-5 h-5" />
              <span>Users</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/database"
              className={({ isActive }) =>
                `flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                  isActive ? 'bg-primary/10 text-primary' : 'hover:bg-primary/5'
                }`
              }
            >
              <Database className="w-5 h-5" />
              <span>Database</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/queue"
              className={({ isActive }) =>
                `flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                  isActive ? 'bg-primary/10 text-primary' : 'hover:bg-primary/5'
                }`
              }
            >
              <ListTodo className="w-5 h-5" />
              <span>Queue</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/cache"
              className={({ isActive }) =>
                `flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                  isActive ? 'bg-primary/10 text-primary' : 'hover:bg-primary/5'
                }`
              }
            >
              <HardDrive className="w-5 h-5" />
              <span>Cache</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/settings"
              className={({ isActive }) =>
                `flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                  isActive ? 'bg-primary/10 text-primary' : 'hover:bg-primary/5'
                }`
              }
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;