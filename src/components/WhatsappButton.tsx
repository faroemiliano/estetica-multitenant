import { FaWhatsapp } from "react-icons/fa";

function WhatsappButton({ whatsapp }: { whatsapp: string }) {
  if (!whatsapp) return null;

  return (
    <a
      href={`https://wa.me/${whatsapp}`}
      target="_blank"
      rel="noreferrer"
      className="
        fixed
        bottom-6
        right-6
        z-[9999]
        flex
        h-16
        w-16
        items-center
        justify-center
        rounded-full
        bg-green-500
        text-white
        shadow-xl
        hover:scale-110
        transition
      "
    >
      <FaWhatsapp size={34} />
    </a>
  );
}

export default WhatsappButton;
