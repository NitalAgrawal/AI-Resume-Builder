import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";
import Login from "./Login";
import Sidebar from "../components/dashboard/Sidebar";

const Layout = () => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      {user ? (
        <div className="min-h-screen bg-slate-50 flex">
          <Sidebar />
          <main className="flex-1 ml-64 p-8 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default Layout;
