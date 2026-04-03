import { TooltipProvider } from "@/components/ui/tooltip";
import AuthProvider from "@/context/authProvider";
import AdminLayout from "@/layout/AdminLayout";
import AddCategory from "@/pages/categories/AddCategory";
import Categories from "@/pages/categories/Categories";
import EditCategory from "@/pages/categories/EditCategory";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import AddProduct from "@/pages/products/AddProduct";
import EditProduct from "@/pages/products/EditProduct";
import Products from "@/pages/products/Products";
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
                <Route path="products/:id" element={<EditProduct />} />
                <Route path="categories/new" element={<AddCategory />} />
                <Route path="categories/:id" element={<EditCategory />} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  );
}

export default AppRoutes;
