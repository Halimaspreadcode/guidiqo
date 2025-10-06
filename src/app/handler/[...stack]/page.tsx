import { StackHandler } from "@stackframe/stack";
import { stackServerApp } from "@/lib/stack";

export default function Handler(props: any) {
  return (
    <div className="min-h-screen bg-white">
      <style jsx global>{`
        /* Conteneur principal */
        .stack-scope {
          @apply min-h-screen bg-white flex items-center justify-center p-4;
        }

        /* Carte principale */
        .stack-scope > div {
          @apply w-full max-w-md mx-auto bg-white rounded-3xl p-8 md:p-10;
        }

        /* Titres */
        .stack-scope h1,
        .stack-scope h2 {
          @apply text-2xl md:text-3xl font-bold text-black mb-4 text-center;
        }

        /* Paragraphes */
        .stack-scope p {
          @apply text-gray-600 text-base mb-6 text-center;
        }

        /* Inputs */
        .stack-scope input[type="email"],
        .stack-scope input[type="password"],
        .stack-scope input[type="text"] {
          width: 100% !important;
          padding: 16px 24px !important;
          background: white !important;
          border: 2px solid #e5e7eb !important;
          border-radius: 24px !important;
          font-size: 16px !important;
          transition: all 0.2s !important;
          outline: none !important;
          color: black !important;
        }

        .stack-scope input:focus {
          border-color: #000 !important;
          box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1) !important;
        }

        /* Boutons principaux */
        .stack-scope button[type="submit"],
        .stack-scope button:not([type="button"]) {
          width: 100% !important;
          padding: 16px 24px !important;
          background: #000 !important;
          color: white !important;
          border: none !important;
          border-radius: 24px !important;
          font-weight: 600 !important;
          font-size: 16px !important;
          cursor: pointer !important;
          transition: all 0.2s !important;
          margin-top: 16px !important;
        }

        .stack-scope button[type="submit"]:hover,
        .stack-scope button:not([type="button"]):hover {
          background: #333 !important;
        }

        .stack-scope button:disabled {
          opacity: 0.5 !important;
          cursor: not-allowed !important;
        }

        /* Bouton Cancel/Secondaire */
        .stack-scope button[type="button"] {
          background: transparent !important;
          color: #6b7280 !important;
          border: 2px solid #e5e7eb !important;
        }

        .stack-scope button[type="button"]:hover {
          background: #f9fafb !important;
          border-color: #d1d5db !important;
        }

        /* Labels */
        .stack-scope label {
          display: block !important;
          font-weight: 500 !important;
          color: #111827 !important;
          margin-bottom: 12px !important;
          font-size: 14px !important;
        }

        /* Groupes de champs */
        .stack-scope form > div {
          margin-bottom: 20px !important;
        }

        /* Messages d'erreur */
        .stack-scope [role="alert"],
        .stack-scope .error {
          padding: 12px 20px !important;
          background: #fef2f2 !important;
          border: 2px solid #fecaca !important;
          border-radius: 16px !important;
          color: #dc2626 !important;
          font-size: 14px !important;
          margin-bottom: 16px !important;
        }

        /* Liens */
        .stack-scope a {
          color: #000 !important;
          font-weight: 600 !important;
          text-decoration: underline !important;
        }

        .stack-scope a:hover {
          color: #333 !important;
        }

        /* Container des boutons */
        .stack-scope [style*="display: flex"] {
          gap: 12px !important;
        }

        /* Espacement */
        .stack-scope > div > div {
          margin-bottom: 24px !important;
        }

        /* Checkbox et radio */
        .stack-scope input[type="checkbox"],
        .stack-scope input[type="radio"] {
          width: 20px !important;
          height: 20px !important;
          border: 2px solid #d1d5db !important;
          border-radius: 4px !important;
        }
      `}</style>
      <StackHandler fullPage app={stackServerApp} routeProps={props} />
    </div>
  );
}

