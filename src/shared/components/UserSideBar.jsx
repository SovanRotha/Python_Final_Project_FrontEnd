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
    <aside className="fixed inset-x-0 bottom-0 z-50 flex h-16 w-full flex-row border-t border-slate-200 bg-white md:sticky md:top-0 md:h-screen md:w-64 md:flex-col md:border-r md:border-t-0">
      {/* Brand Logo Section */}
      <div className="hidden h-20 w-full items-center px-15 md:flex">
        <img src={Logo} alt="TripOS" className="h-14 w-auto object-contain" />
      </div>

      {/* Workspace Header */}
      <div className="hidden px-5 pb-3 md:block">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Workspace
        </p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex h-full min-w-0 flex-1 items-center gap-1 overflow-x-auto px-2 md:block md:space-y-1 md:px-3 md:py-0">
        {menuItems.map((item) => {
          const IconComponent = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              aria-label={item.name}
              title={item.name}
              className={({ isActive }) =>
                `group relative flex h-full min-w-12 flex-1 items-center justify-center rounded-lg px-2 py-2 text-sm font-medium transition-all duration-200 md:h-auto md:w-full md:justify-start md:gap-3 md:rounded-xl md:px-3 md:py-3 ${
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
                    <span className="absolute left-0 hidden h-6 w-1 rounded-r-full bg-blue-500 md:block" />
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
                  <span className="hidden flex-1 text-left md:flex">{item.name}</span>

                  {/* PRO Badge */}
                  {item.badge && (
                    <span
                      className={`hidden rounded-md px-1.5 py-0.5 text-[9px] font-bold tracking-wide md:inline-flex ${
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
                    <span className="absolute right-2 top-2 flex h-2.5 w-2.5 items-center justify-center md:relative md:right-auto md:top-auto">
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
      <div className="hidden border-t border-slate-200 p-4 md:block">
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
