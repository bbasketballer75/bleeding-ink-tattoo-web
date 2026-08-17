// Stub — replaced in T2.2
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <main>Artist: {slug}</main>;
}