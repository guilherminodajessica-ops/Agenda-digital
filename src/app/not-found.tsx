import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 p-6 text-center">
      <p className="text-6xl font-extrabold text-navy-900">404</p>
      <p className="text-navy-800/70">Página não encontrada.</p>
      <Link href="/" className="mt-2 rounded-xl bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-800">
        Voltar para o início
      </Link>
    </div>
  );
}
