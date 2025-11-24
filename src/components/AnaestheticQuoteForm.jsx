import React, { useState } from "react";

const AnaestheticQuoteForm = ({ client }) => {
  const [patientName, setPatientName] = useState("");
  const [procedureName, setProcedureName] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [icd10, setIcd10] = useState("");
  const [theatreIn, setTheatreIn] = useState("");
  const [theatreOut, setTheatreOut] = useState("");
  const [emergency, setEmergency] = useState("no");
  const [notes, setNotes] = useState("");
  const [baseUnits, setBaseUnits] = useState(10);
  const [unitRate, setUnitRate] = useState(250);
  const [modifiers, setModifiers] = useState(0);
  const [bmiExtra, setBmiExtra] = useState(0);

  const bmi = (() => {
    const w = Number(weight);
    const h = Number(height) / 100;
    if (!w || !h) return null;
    const v = w / (h * h);
    if (!isFinite(v)) return null;
    return v;
  })();

  const timeMinutes = (() => {
    if (!theatreIn || !theatreOut) return null;
    try {
      const [hIn, mIn] = theatreIn.split(":").map(Number);
      const [hOut, mOut] = theatreOut.split(":").map(Number);
      const start = hIn * 60 + mIn;
      const end = hOut * 60 + mOut;
      const diff = end - start;
      return diff > 0 ? diff : null;
    } catch {
      return null;
    }
  })();

  const timeUnits = timeMinutes ? Math.ceil(timeMinutes / 15) : 0;

  const baseAmount = baseUnits * unitRate;
  const timeAmount = timeUnits * unitRate;
  const emergencyExtra = emergency === "yes" ? 0.25 * (baseAmount + timeAmount) : 0;
  const total =
    baseAmount + timeAmount + emergencyExtra + Number(modifiers || 0) + Number(bmiExtra || 0);

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

  const bmiCategory =
    bmi == null
      ? ""
      : bmi < 18.5
      ? "Underweight"
      : bmi < 25
      ? "Normal"
      : bmi < 30
      ? "Overweight"
      : "Obese";

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
            Anaesthetic Quote
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
          Procedure name
          <input
            value={procedureName}
            onChange={(e) => setProcedureName(e.target.value)}
            placeholder="e.g. TKR / C-section"
          />
        </label>
        <label>
          Weight (kg)
          <input
            type="number"
            min="0"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </label>
        <label>
          Height (cm)
          <input
            type="number"
            min="0"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
        </label>
        <label>
          ICD-10 (required to submit)
          <input
            value={icd10}
            onChange={(e) => setIcd10(e.target.value.toUpperCase())}
            placeholder="e.g. M16.0"
          />
        </label>
        <label>
          Theatre in (HH:MM)
          <input
            value={theatreIn}
            onChange={(e) => setTheatreIn(e.target.value)}
            placeholder="08:15"
          />
        </label>
        <label>
          Theatre out (HH:MM)
          <input
            value={theatreOut}
            onChange={(e) => setTheatreOut(e.target.value)}
            placeholder="10:45"
          />
        </label>
        <label>
          Emergency
          <select
            value={emergency}
            onChange={(e) => setEmergency(e.target.value)}
          >
            <option value="no">No</option>
            <option value="yes">Yes (25% extra)</option>
          </select>
        </label>
      </section>

      <section className="quote-grid">
        <label>
          Base units
          <input
            type="number"
            min="0"
            value={baseUnits}
            onChange={(e) => setBaseUnits(e.target.value)}
          />
        </label>
        <label>
          Unit rate (R)
          <input
            type="number"
            min="0"
            value={unitRate}
            onChange={(e) => setUnitRate(e.target.value)}
          />
        </label>
        <label>
          Other modifiers (R)
          <input
            type="number"
            min="0"
            value={modifiers}
            onChange={(e) => setModifiers(e.target.value)}
          />
        </label>
        <label>
          BMI-related extra (R)
          <input
            type="number"
            min="0"
            value={bmiExtra}
            onChange={(e) => setBmiExtra(e.target.value)}
          />
        </label>
      </section>

      <table className="quote-table">
        <thead>
          <tr>
            <th>Component</th>
            <th>Detail</th>
            <th style={{ width: "25%" }}>Amount (R)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Base units</td>
            <td>
              {baseUnits} × R{unitRate}
            </td>
            <td>R {baseAmount.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Theatre time</td>
            <td>
              {timeMinutes
                ? `${timeMinutes} min (${timeUnits} × 15min units)`
                : "No time captured"}
            </td>
            <td>R {timeAmount.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Emergency</td>
            <td>{emergency === "yes" ? "25% surcharge" : "No emergency"}</td>
            <td>R {emergencyExtra.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Other modifiers</td>
            <td>Blocks / add-ons / special items</td>
            <td>R {Number(modifiers || 0).toFixed(2)}</td>
          </tr>
          <tr>
            <td>BMI-related extra</td>
            <td>
              {bmi == null
                ? "Enter weight & height"
                : `BMI ${bmi.toFixed(1)} (${bmiCategory})`}
            </td>
            <td>R {Number(bmiExtra || 0).toFixed(2)}</td>
          </tr>
          <tr>
            <th colSpan={2}>Estimated total</th>
            <th>R {total.toFixed(2)}</th>
          </tr>
        </tbody>
      </table>

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
          ICD-10 is required before a quote can be submitted to schemes. This
          quote is an estimate based on current theatre times and unit rates and
          may change if the actual time or codes differ.
        </p>
      </div>
    </div>
  );
};

export default AnaestheticQuoteForm;
