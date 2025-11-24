import React, { useState } from "react";

const defaultLines = [
  { code: "503", description: "Initial Assessment", units: 1, tariff: 350 },
  { code: "505", description: "Follow-up Treatment", units: 1, tariff: 280 },
];

const PhysiotherapyQuoteBuilder = ({ client }) => {
  const [patientName, setPatientName] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [lines, setLines] = useState(defaultLines);

  const addLine = () => {
    setLines((prev) => [
      ...prev,
      { code: "", description: "", units: 1, tariff: 0 },
    ]);
  };

  const updateLine = (index, field, value) => {
    setLines((prev) =>
      prev.map((l, i) => (i === index ? { ...l, [field]: value } : l))
    );
  };

  const removeLine = (index) => {
    setLines((prev) => prev.filter((_, i) => i !== index));
  };

  const lineTotal = (line) => {
    const units = Number(line.units) || 0;
    const tariff = Number(line.tariff) || 0;
    return units * tariff;
  };

  const grandTotal = lines.reduce((sum, l) => sum + lineTotal(l), 0);

  const {
    practice_name,
    contact_name,
    email,
    phone,
    address,
    registration_no,
    bank_name,
    bank_account,
    bank_branch,
  } = client;

  return (
    <div className="quote-card">
      <header>
        <h2>{practice_name}</h2>
        <div className="sub">
          <div>{address}</div>
          <div>
            {phone} • {email}
          </div>
          {registration_no && <div>Practice no: {registration_no}</div>}
        </div>
        <div style={{ marginTop: "0.5rem" }}>
          <span className="badge">
            <span className="badge-dot" />
            Physiotherapy Quote
          </span>
        </div>
      </header>

      <section className="quote-grid">
        <label>
          Patient name
          <input
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Patient full name"
          />
        </label>
        <label>
          Diagnosis / Area
          <input
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="e.g. Shoulder impingement"
          />
        </label>
      </section>

      <table className="quote-table">
        <thead>
          <tr>
            <th style={{ width: "10%" }}>Code</th>
            <th>Description</th>
            <th style={{ width: "10%" }}>Units</th>
            <th style={{ width: "15%" }}>Tariff (R)</th>
            <th style={{ width: "15%" }}>Total (R)</th>
            <th style={{ width: "8%" }}></th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line, idx) => (
            <tr key={idx}>
              <td>
                <input
                  value={line.code}
                  onChange={(e) => updateLine(idx, "code", e.target.value)}
                />
              </td>
              <td>
                <input
                  value={line.description}
                  onChange={(e) =>
                    updateLine(idx, "description", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  min="1"
                  value={line.units}
                  onChange={(e) => updateLine(idx, "units", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  min="0"
                  value={line.tariff}
                  onChange={(e) => updateLine(idx, "tariff", e.target.value)}
                />
              </td>
              <td>R {lineTotal(line).toFixed(2)}</td>
              <td>
                <button
                  type="button"
                  className="secondary"
                  onClick={() => removeLine(idx)}
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
          {lines.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", color: "#6b7280" }}>
                No items – add a line below.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="quote-actions">
        <button type="button" onClick={addLine}>
          + Add line
        </button>
        <button type="button" className="secondary">
          Export / Email (wire later)
        </button>
      </div>

      <div style={{ marginTop: "0.75rem", textAlign: "right" }}>
        <strong>Estimated Total: R {grandTotal.toFixed(2)}</strong>
      </div>

      <div className="quote-footer">
        <p>
          <strong>Bank details</strong>
          <br />
          {bank_name && (
            <>
              {bank_name}
              <br />
            </>
          )}
          {bank_account && (
            <>
              Account: {bank_account}
              <br />
            </>
          )}
          {bank_branch && <>Branch: {bank_branch}</>}
        </p>
        <p>
          Quote valid for 7 days and subject to change due to unforeseen
          circumstances. This is just the quote.
        </p>
      </div>
    </div>
  );
};

export default PhysiotherapyQuoteBuilder;
