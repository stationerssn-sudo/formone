import { useEffect, useState } from "react";
import { Brand } from "../components/Brand";
import { Footer } from "../components/Footer";
import { LoginModal } from "../features/auth/LoginModal";
import { RegisterModal } from "../features/auth/RegisterModal";
import { ResetPasswordModal } from "../features/auth/ResetPasswordModal";
import { apiGet } from "../lib/api";
import type { Batch, Language, User } from "../types";

type LandingPageProps = {
  onLoggedIn: (user: User) => void;
};

function getWeeksInBatch(batch: Batch): number | null {
  const start = new Date(`${batch.starts.slice(0, 10)}T00:00:00`);
  const end = new Date(`${batch.ends.slice(0, 10)}T00:00:00`);
  const durationInDays = (end.getTime() - start.getTime()) / 86_400_000;

  if (!Number.isFinite(durationInDays) || durationInDays <= 0) return null;

  return Math.ceil(durationInDays / 7);
}

export function LandingPage({ onLoggedIn }: LandingPageProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [language, setLanguage] = useState<Language>("SW");
  const [programmeWeeks, setProgrammeWeeks] = useState<number | null>(null);

  useEffect(() => {
    const currentYear = new Date().getFullYear();

    apiGet<Batch[]>("/api/batch")
      .then((batches) => {
        const currentBatch = batches.find(
          (batch) => Number(batch.year) === currentYear,
        );
        setProgrammeWeeks(currentBatch ? getWeeksInBatch(currentBatch) : null);
      })
      .catch(() => setProgrammeWeeks(null));
  }, []);

  return (
    <div className="site-shell">
      <header className="topbar">
        <Brand useInstitution={false} />
        <div className="top-actions">
          <div className="language-switch">
            <button
              className={language === "SW" ? "active" : ""}
              onClick={() => setLanguage("SW")}
            >
              SW
            </button>
            <button
              className={language === "EN" ? "active" : ""}
              onClick={() => setLanguage("EN")}
            >
              EN
            </button>
          </div>
        </div>
      </header>
      <main id="top">
        <section className="hero" id="program">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="live-dot" /> Usajili wa 2026 umefunguliwa
            </div>
            <h1>
              {language === "SW" ? (
                <>
                  Msingi imara wa kuingia <em>Kidato cha Kwanza.</em>
                </>
              ) : (
                <>
                  A confident start to <em>secondary school.</em>
                </>
              )}
            </h1>
            <p>
              {language === "SW"
                ? programmeWeeks
                  ? `Programu ya wiki ${programmeWeeks} inayowasaidia wanafunzi wa darasa la saba kuvuka kwa kujiamini kutoka msingi kwenda sekondari.`
                  : "Programu ya maandalizi inayowasaidia wanafunzi wa darasa la saba kuvuka kwa kujiamini kutoka msingi kwenda sekondari."
                : programmeWeeks
                  ? `A ${programmeWeeks}-week transition programme helping Standard Seven learners move into secondary school with confidence.`
                  : "A transition programme helping Standard Seven learners move into secondary school with confidence."}
            </p>
            <div className="hero-actions">
              <button
                className="button button-primary"
                onClick={() => setIsLoginOpen(true)}
              >
                Ingia kwenye mfumo <span>→</span>
              </button>
            </div>
            <div className="trust-row">
              <span>✓ Walimu mahiri</span>
              {programmeWeeks && (
                <span>✓ Wiki {programmeWeeks} za maandalizi</span>
              )}
              <span>✓ Ripoti ya maendeleo</span>
            </div>
          </div>
        </section>
      </main>
      <Footer useInstitution={false} />
      {isLoginOpen && (
        <LoginModal
          onClose={() => setIsLoginOpen(false)}
          onLoggedIn={onLoggedIn}
          onForgotPassword={() => {
            setIsLoginOpen(false);
            setIsResetOpen(true);
          }}
        />
      )}
      {isResetOpen && (
        <ResetPasswordModal
          onClose={() => setIsResetOpen(false)}
          onBackToLogin={() => {
            setIsResetOpen(false);
            setIsLoginOpen(true);
          }}
        />
      )}
      {isRegisterOpen && (
        <RegisterModal
          onClose={() => setIsRegisterOpen(false)}
          onSwitchToLogin={() => {
            setIsRegisterOpen(false);
            setIsLoginOpen(true);
          }}
        />
      )}
    </div>
  );
}
