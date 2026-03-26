import { TooltipProvider } from "@/components/ui/tooltip";
import AdminLayout from "@/layout/AdminLayout";
import Categories from "@/pages/Categories";
import Dashboard from "@/pages/Dashboard";
import Products from "@/pages/Products";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

function AppRoutes() {
  return (
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin" replace />} />
            <Route path="admin" element={<Dashboard />} />
            <Route path="admin/categories" element={<Categories />} />
            <Route path="admin/products" element={<Products />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
}

export default AppRoutes;
