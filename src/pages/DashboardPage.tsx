import { useEffect, useState } from "react";
import { Brand } from "../components/Brand";
import { Footer } from "../components/Footer";
import { PaymentModal } from "../features/students/PaymentModal";
import { StudentRegistrationModal } from "../features/students/StudentRegistrationModal";
import { StudentsTable } from "../features/students/StudentsTable";
import { apiGet } from "../lib/api";
import type { Batch, Student, User } from "../types";

type DashboardPageProps = {
  user: User;
  onLogout: () => void;
};

export function DashboardPage({ user, onLogout }: DashboardPageProps) {
  const [studentSearch, setStudentSearch] = useState("");
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [studentRegistrationMessage, setStudentRegistrationMessage] =
    useState("");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [paymentMessage, setPaymentMessage] = useState("");
  const [batches, setBatches] = useState<Batch[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const normalizedPosition = user.position.trim().toLowerCase();
  const canRegisterStudents = normalizedPosition === "academic";
  const canRecordPayments = ["mhasibu", "treasurer"].includes(
    normalizedPosition,
  );

  async function loadStudents() {
    setStudents(await apiGet<Student[]>("/api/wanafunzi"));
  }

  useEffect(() => {
    apiGet<Batch[]>("/api/batch")
      .then(setBatches)
      .catch(() =>
        setStudentRegistrationMessage("Imeshindikana kupakia batch."),
      );
  }, []);

  useEffect(() => {
    loadStudents().catch(() =>
      setStudentRegistrationMessage("Imeshindikana kupakia wanafunzi."),
    );
  }, []);

  const paidStudents = students.filter(
    (student) => Number(student.paid_amount) > 0,
  ).length;
  const paidAmount = students.reduce(
    (total, student) => total + Number(student.paid_amount),
    0,
  );
  const studentsWithArrears = students.filter(
    (student) => Number(student.remaining_amount) > 0,
  ).length;
  const outstandingAmount = students.reduce(
    (total, student) => total + Number(student.remaining_amount),
    0,
  );

  return (
    <div className="dashboard-shell">
      <header className="dashboard-header">
        <Brand href="#dashboard" />
        <div className="dashboard-user">
          <span>
            <strong>{user.name}</strong>
            <small>{user.position}</small>
          </span>
          <div className="user-menu">
            <button
              aria-expanded={isUserMenuOpen}
              aria-haspopup="menu"
              aria-label="Fungua menyu ya mtumiaji"
              className="user-menu-trigger"
              onClick={() => setIsUserMenuOpen((isOpen) => !isOpen)}
              type="button"
            >
              <svg aria-hidden="true" viewBox="0 0 16 16">
                <path d="m4 6 4 4 4-4" />
              </svg>
            </button>
            {isUserMenuOpen && (
              <div
                aria-label="Menyu ya mtumiaji"
                className="user-menu-panel"
                role="menu"
              >
                <button onClick={onLogout} role="menuitem" type="button">
                  Ondoka
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="dashboard-main" id="dashboard">
        <div className="dashboard-heading">
          <div>
            <h1>Usimamizi wa Wanafunzi</h1>
            <p>Orodha ya wanafunzi wa Pre-Form One na hali ya usajili wao.</p>
          </div>
          {canRegisterStudents && (
            <button
              className="button button-primary"
              onClick={() => {
                setStudentRegistrationMessage("");
                setIsStudentModalOpen(true);
              }}
            >
              + Sajili mwanafunzi
            </button>
          )}
        </div>
        <section className="dashboard-stats">
          <article>
            <span>Jumla waliosajiliwa</span>
            <strong>{students.length}</strong>
            <small>Wanafunzi</small>
          </article>
          <article className="dashboard-finance-card">
            <span>Ada zilizolipwa</span>
            <div className="finance-card-values">
              <div>
                <strong className="teal-number">{paidStudents}</strong>
                <small>Wanafunzi waliolipa</small>
              </div>
              <div className="finance-card-amount">
                <strong className="teal-number">
                  {paidAmount.toLocaleString()}
                </strong>
                <small>TZS zimelipwa</small>
              </div>
            </div>
          </article>
          <article className="dashboard-finance-card">
            <span>Wenye malimbikizo</span>
            <div className="finance-card-values">
              <div>
                <strong className="amber-number">{studentsWithArrears}</strong>
                <small>Wanafunzi wenye deni</small>
              </div>
              <div className="finance-card-amount">
                <strong className="amber-number">
                  {outstandingAmount.toLocaleString()}
                </strong>
                <small>TZS hazijalipwa</small>
              </div>
            </div>
          </article>
        </section>
        <StudentsTable
          students={students}
          search={studentSearch}
          onSearch={setStudentSearch}
          canRecordPayments={canRecordPayments}
          onPay={(student) => {
            setSelectedStudent(student);
            setPaymentMessage("");
            setIsPaymentModalOpen(true);
          }}
        />
      </main>
      <Footer />
      {isStudentModalOpen && (
        <StudentRegistrationModal
          batches={batches}
          message={studentRegistrationMessage}
          onMessage={setStudentRegistrationMessage}
          onClose={() => setIsStudentModalOpen(false)}
          onRegistered={loadStudents}
        />
      )}
      {isPaymentModalOpen && selectedStudent && (
        <PaymentModal
          student={selectedStudent}
          message={paymentMessage}
          onMessage={setPaymentMessage}
          onClose={() => setIsPaymentModalOpen(false)}
          onPaid={loadStudents}
        />
      )}
    </div>
  );
}
