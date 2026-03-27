import { TooltipProvider } from "@/components/ui/tooltip";
import AuthProvider from "@/context/authProvider";
import AdminLayout from "@/layout/AdminLayout";
import AddCategory from "@/pages/AddCategory";
import AddProduct from "@/pages/AddProduct";
import Categories from "@/pages/Categories";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Products from "@/pages/Products";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";

function AppRoutes() {
  return (
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="categories" element={<Categories />} />
                <Route path="products" element={<Products />} />
                <Route path="products/new" element={<AddProduct />} />
                <Route path="categories/new" element={<AddCategory />} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  );
}

export default AppRoutes;
