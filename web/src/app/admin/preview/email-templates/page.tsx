import { PreviewEmailWorkspace } from "@/components/preview-email-workspace";
export default async function EmailTemplatesPage({ searchParams }: PageProps<"/admin/preview/email-templates">) {
  const { inquiry } = await searchParams;
  return <PreviewEmailWorkspace mode="templates" inquiryId={typeof inquiry === "string" ? inquiry : undefined} />;
}
