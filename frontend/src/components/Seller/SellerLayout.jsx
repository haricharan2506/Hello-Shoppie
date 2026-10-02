import SellerSidebar from "./SellerSidebar";

function SellerLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#FFF3E6]">
      <SellerSidebar />

      <main className="ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}

export default SellerLayout;