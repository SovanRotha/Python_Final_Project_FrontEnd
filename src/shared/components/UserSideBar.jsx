import Logo from "../../assets/Logo/logo.png";
import {
  Compass,
  Globe,
  Bookmark,
  Plane,
  Wallet,
  Sparkles,
  Bell,
} from "lucide-react";
import { NavLink } from "react-router-dom";

function UserSideBar() {
  const menuItems = [
    {
      name: "Home",
      icon: Compass,
      path: "/",
    },
    {
      name: "Explore",
      icon: Globe,
      path: "/explore",
    },
    {
      name: "Saved Places",
      icon: Bookmark,
      path: "/saved",
    },
    {
      name: "My Trips",
      icon: Plane,
      path: "/trips",
    },
    {
      name: "Budget & Wallet",
      icon: Wallet,
      path: "/budget",
    },
    {
      name: "AI Assistant",
      icon: Sparkles,
      path: "/ai",
      badge: "PRO",
    },
    {
      name: "Notifications",
      icon: Bell,
      path: "/notifications",
      dot: true,
    },
  ];

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-200 bg-white">
      {/* Brand Logo Section */}
      <div className="flex h-20 w-full items-center px-15">
        <img src={Logo} alt="TripOS" className="h-14 w-auto object-contain" />
      </div>

      {/* Workspace Header */}
      <div className="px-5 pb-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Workspace
        </p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-1 px-3">
        {menuItems.map((item) => {
          const IconComponent = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `group relative flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active Indicator */}
                  {isActive && (
                    <span className="absolute left-0 h-6 w-1 rounded-r-full bg-blue-500" />
                  )}

                  {/* Icon */}
                  <IconComponent
                    size={19}
                    strokeWidth={isActive ? 2.3 : 2}
                    className={
                      isActive
                        ? "shrink-0 text-white"
                        : "shrink-0 text-slate-400 group-hover:text-slate-700"
                    }
                  />

                  {/* Menu Name */}
                  <span className="flex-1 text-left">{item.name}</span>

                  {/* PRO Badge */}
                  {item.badge && (
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold tracking-wide ${
                        isActive
                          ? "bg-white/15 text-white"
                          : "bg-violet-100 text-violet-600"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Notification Dot */}
                  {item.dot && (
                    <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                      <span className="absolute h-2.5 w-2.5 animate-ping rounded-full bg-blue-400 opacity-40" />
                      <span className="relative h-2 w-2 rounded-full bg-blue-500" />
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom User Section */}
      <div className="border-t border-slate-200 p-4">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          {/* Avatar */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
            SR
          </div>

          {/* User Info */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-800">
              Sovan Rotha
            </p>

            <p className="truncate text-xs text-slate-400">
              Personal Workspace
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default UserSideBar;
