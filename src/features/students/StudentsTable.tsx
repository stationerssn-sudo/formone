import type { Student } from '../../types'

type StudentsTableProps = {
  students: Student[]
  search: string
  onSearch: (value: string) => void
  canRecordPayments: boolean
  onPay: (student: Student) => void
}

export function StudentsTable({
  students,
  search,
  onSearch,
  canRecordPayments,
  onPay,
}: StudentsTableProps) {
  const visibleStudents = students.filter((student) =>
    `${student.student_name} ${student.idwanafunzi} ${student.address}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  )

  return (
    <section className="students-panel">
      <div className="students-toolbar">
        <div>
          <h2>Wanafunzi waliosajiliwa</h2>
          <p>Data kutoka database ya ElimuBora.</p>
        </div>
        <input
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Tafuta mwanafunzi, namba au anwani..."
        />
      </div>
      <div className="students-table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Jina la mwanafunzi</th>
              <th>Anwani</th>
              <th>Batch / Mwaka</th>
              <th>Kiasi kilicholipwa</th>
              <th>Kiasi kilichobaki</th>
              <th>Malipo</th>
            </tr>
          </thead>
          <tbody>
            {visibleStudents.map((student) => (
              <tr key={student.idwanafunzi}>
                <td className="student-id">{student.idwanafunzi}</td>
                <td>
                  <span className="student-name">{student.student_name}</span>
                  <small className="student-phone">{student.parent_phone}</small>
                </td>
                <td>{student.address}</td>
                <td>
                  <span className="stream-tag">{student.year ?? 'N/A'}</span>
                </td>
                <td>{Number(student.paid_amount).toLocaleString()} TZS</td>
                <td>
                  {Number(student.remaining_amount).toLocaleString()} TZS
                </td>
                <td>
                  {canRecordPayments && (
                    <button
                      className="button button-quiet pay-button"
                      onClick={() => onPay(student)}
                    >
                      Jaza malipo
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
