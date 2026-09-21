import PageLayout from "@/layout/PageLayout";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageLayout title="Admin Configuration">
      {children}
    </PageLayout>
  );
}