import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
};

function AdminSectionHeader({ eyebrow, title, description, icon, action }: Props) {
  const navigate = useNavigate();
  const { slug } = useParams();

  return (
    <header className="mb-8 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
      <button onClick={() => navigate(`/${slug}/admin`)} className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900">
        <ArrowLeft size={17} /> Volver al panel
      </button>
      <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-pink-600">{icon}{eyebrow}</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">{description}</p>
        </div>
        {action}
      </div>
    </header>
  );
}

export default AdminSectionHeader;
