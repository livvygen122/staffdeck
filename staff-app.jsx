import { useState, useEffect, useRef, useCallback } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #F5F3EE; --surface: #FFFFFF; --surface2: #F0EDE6;
    --border: rgba(0,0,0,0.08); --border-strong: rgba(0,0,0,0.15);
    --text: #1A1814; --text-muted: #7A7670; --text-hint: #B0ADA8;
    --accent: #2D6A4F; --accent-light: #E8F4EE; --accent-dark: #1B4332;
    --amber: #B5621A; --amber-light: #FDF0E6;
    --red: #C0392B; --red-light: #FDECEA;
    --blue: #1A4A7A; --blue-light: #E8F0FA;
    --purple: #5B3FA6; --purple-light: #F0ECFA;
    --radius: 12px; --radius-sm: 8px;
    --shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04);
    --shadow-lg: 0 4px 16px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06);
    --font: 'DM Sans', sans-serif; --mono: 'DM Mono', monospace;
  }
  body { font-family: var(--font); background: var(--bg); color: var(--text); min-height: 100vh; }
  .app { min-height: 100vh; display: flex; flex-direction: column; }
  .topbar { background: var(--surface); border-bottom: 1px solid var(--border); padding: 0 20px; height: 56px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; }
  .topbar-brand { font-size: 15px; font-weight: 600; color: var(--accent-dark); letter-spacing: -0.3px; display: flex; align-items: center; gap: 8px; }
  .topbar-logo { width: 28px; height: 28px; background: var(--accent); border-radius: 7px; color: white; font-size: 13px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
  .topbar-right { display: flex; align-items: center; gap: 12px; }
  .avatar-pill { display: flex; align-items: center; gap: 8px; background: var(--surface2); border-radius: 99px; padding: 4px 12px 4px 4px; font-size: 13px; font-weight: 500; }
  .avatar-circle { border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; color: white; flex-shrink: 0; }
  .main { flex: 1; padding: 24px 20px; max-width: 900px; margin: 0 auto; width: 100%; }
  .nav-tabs { display: flex; gap: 4px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 4px; margin-bottom: 24px; overflow-x: auto; }
  .nav-tab { flex: 1; min-width: fit-content; padding: 8px 14px; border-radius: var(--radius-sm); font-size: 13px; font-weight: 500; color: var(--text-muted); cursor: pointer; border: none; background: none; transition: all 0.15s; white-space: nowrap; font-family: var(--font); }
  .nav-tab.active { background: var(--accent); color: white; }
  .nav-tab:hover:not(.active) { background: var(--surface2); color: var(--text); }
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; margin-bottom: 16px; box-shadow: var(--shadow); }
  .card-title { font-size: 15px; font-weight: 600; color: var(--text); }
  .card-subtitle { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
  .btn { display: inline-flex; align-items: center; gap: 6px; padding: 9px 16px; border-radius: var(--radius-sm); font-size: 13px; font-weight: 500; cursor: pointer; border: none; transition: all 0.15s; font-family: var(--font); }
  .btn-primary { background: var(--accent); color: white; }
  .btn-primary:hover { background: var(--accent-dark); }
  .btn-secondary { background: var(--surface2); color: var(--text); border: 1px solid var(--border-strong); }
  .btn-secondary:hover { background: #e2ded6; }
  .btn-ghost { background: transparent; color: var(--text-muted); padding: 6px 10px; border: none; }
  .btn-ghost:hover { background: var(--surface2); color: var(--text); }
  .btn-sm { padding: 6px 12px; font-size: 12px; }
  .btn-full { width: 100%; justify-content: center; }
  .btn:disabled { opacity: 0.45; cursor: not-allowed; }
  .badge { display: inline-flex; align-items: center; padding: 3px 8px; border-radius: 99px; font-size: 11px; font-weight: 600; }
  .badge-green { background: var(--accent-light); color: var(--accent-dark); }
  .badge-amber { background: var(--amber-light); color: var(--amber); }
  .badge-red { background: var(--red-light); color: var(--red); }
  .badge-blue { background: var(--blue-light); color: var(--blue); }
  .badge-purple { background: var(--purple-light); color: var(--purple); }
  .badge-gray { background: var(--surface2); color: var(--text-muted); }
  .form-group { margin-bottom: 14px; }
  .form-label { display: block; font-size: 11px; font-weight: 600; color: var(--text-muted); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em; }
  .form-input { width: 100%; padding: 10px 12px; border: 1px solid var(--border-strong); border-radius: var(--radius-sm); font-size: 14px; font-family: var(--font); color: var(--text); background: var(--surface); transition: border 0.15s; outline: none; }
  .form-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(45,106,79,0.1); }
  .form-input::placeholder { color: var(--text-hint); }
  .form-input:read-only { background: var(--surface2); color: var(--text-muted); cursor: default; }
  .form-select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%237A7670' d='M6 8L1 3h10z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 32px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .form-hint { font-size: 11px; color: var(--text-muted); margin-top: 4px; }
  .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px; margin-bottom: 20px; }
  .metric { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px; box-shadow: var(--shadow); }
  .metric-label { font-size: 11px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
  .metric-value { font-size: 24px; font-weight: 600; color: var(--text); letter-spacing: -0.5px; font-family: var(--mono); }
  .metric-sub { font-size: 11px; color: var(--text-muted); margin-top: 3px; }
  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { text-align: left; padding: 8px 12px; font-size: 11px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em; border-bottom: 1px solid var(--border); }
  td { padding: 12px; border-bottom: 1px solid var(--border); color: var(--text); vertical-align: middle; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: var(--surface2); }
  .clock-btn { width: 100%; padding: 20px; border-radius: var(--radius); border: none; font-family: var(--font); font-size: 18px; font-weight: 600; cursor: pointer; transition: all 0.2s; letter-spacing: -0.3px; }
  .clock-in { background: var(--accent); color: white; }
  .clock-in:hover { background: var(--accent-dark); transform: translateY(-1px); box-shadow: var(--shadow-lg); }
  .clock-out { background: var(--red-light); color: var(--red); border: 1.5px solid #f5c6c3; }
  .clock-out:hover { background: #f5c6c3; }
  .clock-time { font-family: var(--mono); font-size: 36px; font-weight: 500; color: var(--text); text-align: center; margin: 16px 0 6px; letter-spacing: -1px; }
  .clock-date { text-align: center; font-size: 13px; color: var(--text-muted); margin-bottom: 20px; }
  .alert { padding: 12px 14px; border-radius: var(--radius-sm); font-size: 13px; margin-bottom: 14px; display: flex; align-items: flex-start; gap: 8px; line-height: 1.5; }
  .alert-green { background: var(--accent-light); color: var(--accent-dark); }
  .alert-amber { background: var(--amber-light); color: var(--amber); }
  .alert-red { background: var(--red-light); color: var(--red); }
  .alert-blue { background: var(--blue-light); color: var(--blue); }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .modal { background: var(--surface); border-radius: 16px; padding: 28px; width: 100%; max-width: 480px; box-shadow: var(--shadow-lg); max-height: 90vh; overflow-y: auto; }
  .modal-footer { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }
  .doc-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--border); }
  .doc-row:last-child { border-bottom: none; }
  .doc-icon { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
  .leave-bar { height: 6px; background: var(--surface2); border-radius: 99px; overflow: hidden; margin: 6px 0; }
  .leave-fill { height: 100%; background: var(--accent); border-radius: 99px; transition: width 0.4s; }
  .emp-card { display: flex; align-items: center; gap: 14px; padding: 14px 16px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); margin-bottom: 10px; cursor: pointer; transition: all 0.15s; box-shadow: var(--shadow); }
  .emp-card:hover { border-color: var(--accent); box-shadow: var(--shadow-lg); }
  .section-title { font-size: 18px; font-weight: 700; letter-spacing: -0.4px; margin-bottom: 4px; }
  .section-sub { font-size: 13px; color: var(--text-muted); margin-bottom: 20px; }

  /* Aadhaar onboarding */
  .ob-wrap { min-height: 100vh; display: flex; align-items: flex-start; justify-content: center; background: var(--bg); padding: 40px 20px; }
  .ob-card { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 36px 32px; width: 100%; max-width: 500px; box-shadow: var(--shadow-lg); }
  .stepper { display: flex; align-items: flex-start; gap: 0; margin-bottom: 32px; }
  .step-item { display: flex; flex-direction: column; align-items: center; flex: 1; position: relative; }
  .step-item:not(:last-child)::after { content: ''; position: absolute; top: 14px; left: 60%; right: -40%; height: 2px; background: var(--border); z-index: 0; transition: background 0.3s; }
  .step-item.done::after { background: var(--accent); }
  .step-dot { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; border: 2px solid var(--border); background: var(--surface); color: var(--text-muted); z-index: 1; transition: all 0.25s; }
  .step-dot.active { border-color: var(--accent); background: var(--accent); color: white; }
  .step-dot.done { border-color: var(--accent); background: var(--accent); color: white; }
  .step-label { font-size: 10px; font-weight: 600; color: var(--text-muted); margin-top: 5px; text-transform: uppercase; letter-spacing: 0.04em; text-align: center; }
  .step-label.active { color: var(--accent-dark); }
  .upload-zone { border: 2px dashed var(--border-strong); border-radius: var(--radius); padding: 36px 20px; text-align: center; cursor: pointer; transition: all 0.2s; position: relative; }
  .upload-zone:hover, .upload-zone.drag { border-color: var(--accent); background: var(--accent-light); }
  .upload-zone input[type=file] { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
  .img-preview { width: 100%; max-height: 180px; object-fit: cover; border-radius: var(--radius-sm); display: block; margin-bottom: 12px; border: 1px solid var(--border); }
  .extracted-row { display: flex; justify-content: space-between; align-items: center; padding: 9px 0; border-bottom: 1px solid rgba(45,106,79,0.12); }
  .extracted-row:last-child { border-bottom: none; }
  .scan-item { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text-muted); padding: 3px 0; }
  .scan-item.done { color: var(--accent-dark); }

  /* Login */
  .login-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--bg); padding: 20px; }
  .login-card { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 36px 32px; width: 100%; max-width: 420px; box-shadow: var(--shadow-lg); }
  .otp-inputs { display: flex; gap: 8px; justify-content: center; margin: 20px 0; }
  .otp-input { width: 44px; height: 52px; border: 1.5px solid var(--border-strong); border-radius: var(--radius-sm); text-align: center; font-size: 20px; font-weight: 600; font-family: var(--mono); color: var(--text); background: var(--surface); outline: none; transition: border 0.15s; }
  .otp-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(45,106,79,0.1); }
  .divider { display: flex; align-items: center; gap: 12px; color: var(--text-hint); font-size: 12px; margin: 16px 0; }
  .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner { width: 22px; height: 22px; border: 2.5px solid var(--accent-light); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  .fade-up { animation: fadeUp 0.25s ease forwards; }
  @media (max-width: 600px) {
    .main { padding: 16px 12px; }
    .form-row { grid-template-columns: 1fr; }
    .metrics { grid-template-columns: 1fr 1fr; }
    .login-card, .ob-card { padding: 28px 20px; }
  }
`;

// ─── DATA ─────────────────────────────────────────────────────────────────────
const today = new Date();
const fmt = d => d.toISOString().slice(0,10);
const fmtTime = d => d.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"});

const EMPLOYEES = [
  { id:"praveen", name:"Praveen Kumar", phone:"+91 98765 43210", role:"Senior Staff", department:"Operations", startDate:"2023-01-15", workDays:6, salaryHistory:[{amount:30000,effectiveFrom:"2023-01-15",effectiveTo:null}], dob:"1990-05-12", gender:"Male", bloodGroup:"O+", emergency:"Sujata Kumar +91 98765 11111", bankName:"SBI", accountNo:"xxxx xxxx 4521", ifsc:"SBIN0001234", aadhaarLast4:"7823", panNumber:"ABCPK1234D", address:"12 Gandhi Nagar, Vizag 530002", status:"active", onboarded:true },
  { id:"prudvi",  name:"Prudvi Raj",    phone:"+91 87654 32109", role:"Staff",        department:"Operations", startDate:"2025-04-01", workDays:6, salaryHistory:[{amount:8000,effectiveFrom:"2025-04-01",effectiveTo:"2025-04-30"},{amount:12000,effectiveFrom:"2025-05-01",effectiveTo:null}], dob:"1995-11-20", gender:"Male", bloodGroup:"A+", emergency:"Ramesh Raj +91 87654 22222", bankName:"HDFC", accountNo:"xxxx xxxx 8834", ifsc:"HDFC0002345", aadhaarLast4:"4512", panNumber:"", address:"45 Lawsons Bay, Vizag 530017", status:"active", onboarded:true },
  { id:"staff3",  name:"Ananya Sharma", phone:"+91 76543 21098", role:"Staff",        department:"Support",    startDate:"2025-02-10", workDays:6, salaryHistory:[{amount:15000,effectiveFrom:"2025-02-10",effectiveTo:null}], dob:"", gender:"", bloodGroup:"", emergency:"", bankName:"", accountNo:"", ifsc:"", aadhaarLast4:"", panNumber:"", address:"", status:"active", onboarded:false },
  { id:"staff4",  name:"Ravi Teja",     phone:"+91 65432 10987", role:"Junior Staff",  department:"Support",    startDate:"2025-03-01", workDays:6, salaryHistory:[{amount:10000,effectiveFrom:"2025-03-01",effectiveTo:null}], dob:"", gender:"", bloodGroup:"", emergency:"", bankName:"", accountNo:"", ifsc:"", aadhaarLast4:"", panNumber:"", address:"", status:"active", onboarded:false },
];
const TIMESHEETS = [
  {id:1,empId:"praveen",date:fmt(new Date(today.getFullYear(),today.getMonth(),today.getDate()-1)),clockIn:"09:02",clockOut:"18:05",hours:9.05,status:"complete"},
  {id:2,empId:"praveen",date:fmt(new Date(today.getFullYear(),today.getMonth(),today.getDate()-2)),clockIn:"08:55",clockOut:"18:10",hours:9.25,status:"complete"},
  {id:3,empId:"prudvi", date:fmt(new Date(today.getFullYear(),today.getMonth(),today.getDate()-1)),clockIn:"09:10",clockOut:"18:00",hours:8.83,status:"complete"},
  {id:4,empId:"staff3",date:fmt(new Date(today.getFullYear(),today.getMonth(),today.getDate()-1)),clockIn:"09:00",clockOut:"17:55",hours:8.92,status:"complete"},
];
const LEAVES = [
  {id:1,empId:"praveen",date:fmt(new Date(today.getFullYear(),today.getMonth(),today.getDate()+3)),type:"personal",reason:"Family function",status:"pending",appliedOn:fmt(today)},
  {id:2,empId:"staff3",date:fmt(new Date(today.getFullYear(),today.getMonth(),today.getDate()-5)),type:"sick",reason:"Fever",status:"approved",appliedOn:fmt(new Date(today.getFullYear(),today.getMonth(),today.getDate()-6))},
];
const EXPENSES = [
  {id:1,empId:"praveen",type:"advance",amount:2000,description:"Travel advance for client visit",status:"settled",date:fmt(new Date(today.getFullYear(),today.getMonth(),today.getDate()-10))},
  {id:2,empId:"prudvi",type:"reimbursement",amount:450,description:"Office supplies",status:"pending",date:fmt(new Date(today.getFullYear(),today.getMonth(),today.getDate()-2))},
  {id:3,empId:"staff4",type:"advance",amount:1500,description:"Petty cash advance",status:"pending",date:fmt(today)},
];
const DOCS_INIT = {
  praveen:[{id:1,type:"aadhaar",name:"Aadhaar Card",status:"uploaded",uploadedOn:"2023-01-20",size:"1.2 MB"},{id:2,type:"pan",name:"PAN Card",status:"uploaded",uploadedOn:"2023-01-20",size:"0.8 MB"},{id:3,type:"offer",name:"Offer Letter",status:"uploaded",uploadedOn:"2023-01-15",size:"0.3 MB"},{id:4,type:"bank",name:"Bank Passbook",status:"uploaded",uploadedOn:"2023-01-20",size:"1.5 MB"}],
  prudvi:[{id:5,type:"aadhaar",name:"Aadhaar Card",status:"uploaded",uploadedOn:"2025-04-03",size:"1.1 MB"},{id:6,type:"offer",name:"Offer Letter",status:"uploaded",uploadedOn:"2025-04-01",size:"0.3 MB"}],
  staff3:[], staff4:[],
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const AC = name => { const c=["#2D6A4F","#1A4A7A","#5B3FA6","#B5621A","#A0522D","#2E6B8A"]; let s=0; for(let x of (name||"?"))s+=x.charCodeAt(0); return c[s%c.length]; };
const INI = name => (name||"?").split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase();
const SAL = emp => { const n=fmt(today); const c=emp.salaryHistory.find(s=>s.effectiveFrom<=n&&(!s.effectiveTo||s.effectiveTo>=n)); return c?c.amount:emp.salaryHistory.at(-1).amount; };
const INR = n => "₹"+Number(n).toLocaleString("en-IN");
const NP  = p => p.replace(/[\s\-()]/g,"").replace(/^(\+91|0)/,"");
const DOC_ICONS  = {aadhaar:"🪪",pan:"📄",offer:"📋",bank:"🏦",address:"🏠",appointment:"📝",payslip:"💰",relieving:"📤"};
const DOC_LABELS = {aadhaar:"Aadhaar Card",pan:"PAN Card",offer:"Offer Letter",bank:"Bank Proof",address:"Address Proof",appointment:"Appointment Letter",payslip:"Pay Slip",relieving:"Relieving Letter"};

// Demo OCR simulation — in production calls AWS Textract / Surepass Aadhaar OCR API
const fakeOCR = id => ({
  praveen: {name:"Praveen Kumar",dob:"1990-05-12",gender:"Male",address:"12 Gandhi Nagar, Rushikonda, Visakhapatnam, Andhra Pradesh 530045",aadhaarNo:"XXXX XXXX 7823",uid:"7823"},
  prudvi:  {name:"Prudvi Raj",   dob:"1995-11-20",gender:"Male",address:"45 Lawsons Bay Colony, Visakhapatnam, Andhra Pradesh 530017",aadhaarNo:"XXXX XXXX 4512",uid:"4512"},
  staff3:  {name:"Ananya Sharma",dob:"1998-03-08",gender:"Female",address:"22 MVP Colony Sector 6, Visakhapatnam, Andhra Pradesh 530017",aadhaarNo:"XXXX XXXX 9034",uid:"9034"},
  staff4:  {name:"Ravi Teja",    dob:"2000-07-15",gender:"Male",address:"78 Seethammadhara, Visakhapatnam, Andhra Pradesh 530013",aadhaarNo:"XXXX XXXX 2267",uid:"2267"},
}[id] || {name:"",dob:"",gender:"",address:"",aadhaarNo:"XXXX XXXX ????",uid:""});

// ─── LIVE CLOCK ───────────────────────────────────────────────────────────────
function LiveClock() {
  const [t,setT]=useState(new Date());
  useEffect(()=>{const id=setInterval(()=>setT(new Date()),1000);return()=>clearInterval(id);},[]);
  return (
    <>
      <div className="clock-time">{t.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}</div>
      <div className="clock-date">{t.toLocaleDateString("en-IN",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</div>
    </>
  );
}

// ─── AADHAAR ONBOARDING FLOW ──────────────────────────────────────────────────
function AadhaarOnboarding({ employee, onComplete }) {
  const [step, setStep]       = useState(1);  // 1=upload 2=scanning 3=review 4=done
  const [preview, setPreview] = useState(null);
  const [file, setFile]       = useState(null);
  const [drag, setDrag]       = useState(false);
  const [parsed, setParsed]   = useState(null);
  const [scanSteps, setScanSteps] = useState([]);
  const [form, setForm]       = useState({name:"",dob:"",gender:"",address:"",aadhaarLast4:"",bloodGroup:"",emergency:""});

  const SCAN_LABELS = ["Detecting document edges","Extracting text with OCR","Reading embedded QR code","Verifying Aadhaar layout","Masking sensitive digits"];

  const handleFile = f => {
    if (!f) return;
    setFile(f);
    const r = new FileReader();
    r.onload = e => setPreview(e.target.result);
    r.readAsDataURL(f);
    setStep(2);
    setScanSteps([]);
    // Animate scan steps then resolve
    SCAN_LABELS.forEach((_, i) => {
      setTimeout(() => setScanSteps(p => [...p, i]), i * 420);
    });
    setTimeout(() => {
      const result = fakeOCR(employee.id);
      setParsed(result);
      setForm({ name:result.name, dob:result.dob, gender:result.gender, address:result.address, aadhaarLast4:result.uid, bloodGroup:employee.bloodGroup||"", emergency:employee.emergency||"" });
      setStep(3);
    }, SCAN_LABELS.length * 420 + 400);
  };

  const handleConfirm = () => {
    setStep(4);
    setTimeout(() => onComplete({ ...form, onboarded:true }), 1200);
  };

  const STEPS = ["Upload","Scanning","Review","Complete"];

  return (
    <div className="ob-wrap">
      <div className="ob-card">

        {/* Header */}
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:28}}>
          <div className="topbar-logo" style={{width:40,height:40,borderRadius:10,fontSize:18,flexShrink:0}}>S</div>
          <div>
            <div style={{fontSize:16,fontWeight:700,letterSpacing:"-0.3px"}}>Welcome, {employee.name.split(" ")[0]}!</div>
            <div style={{fontSize:12,color:"var(--text-muted)"}}>Complete your Aadhaar verification to get started</div>
          </div>
        </div>

        {/* Stepper */}
        <div className="stepper">
          {STEPS.map((s,i)=>(
            <div key={s} className={`step-item ${i<step-1?"done":""}`}>
              <div className={`step-dot ${i===step-1?"active":i<step-1?"done":""}`}>{i<step-1?"✓":i+1}</div>
              <div className={`step-label ${i===step-1?"active":""}`}>{s}</div>
            </div>
          ))}
        </div>

        {/* ── STEP 1: Upload ── */}
        {step===1&&(
          <div className="fade-up">
            <div style={{fontSize:15,fontWeight:600,marginBottom:6}}>Upload your Aadhaar card</div>
            <div style={{fontSize:13,color:"var(--text-muted)",marginBottom:20,lineHeight:1.6}}>
              We'll scan it to automatically fill your name, date of birth, gender and address. Only the <strong>last 4 digits</strong> of your Aadhaar number are stored — your full number is never saved.
            </div>
            <div
              className={`upload-zone ${drag?"drag":""}`}
              onDragOver={e=>{e.preventDefault();setDrag(true)}}
              onDragLeave={()=>setDrag(false)}
              onDrop={e=>{e.preventDefault();setDrag(false);const f=e.dataTransfer.files[0];if(f)handleFile(f);}}
            >
              <input type="file" accept="image/*,application/pdf" onChange={e=>handleFile(e.target.files[0])}/>
              <div style={{fontSize:40,marginBottom:8,pointerEvents:"none"}}>🪪</div>
              <div style={{fontSize:14,fontWeight:600,marginBottom:4,pointerEvents:"none"}}>Tap to upload Aadhaar</div>
              <div style={{fontSize:12,color:"var(--text-muted)",pointerEvents:"none"}}>or drag and drop · JPG, PNG or PDF · max 5 MB</div>
            </div>
            <div className="alert alert-blue" style={{marginTop:16}}>
              <span style={{flexShrink:0}}>🔒</span>
              <span>Your document is encrypted and stored securely. Only your employer's admin can view it.</span>
            </div>
          </div>
        )}

        {/* ── STEP 2: Scanning ── */}
        {step===2&&(
          <div className="fade-up">
            {preview&&<img src={preview} alt="Aadhaar" className="img-preview"/>}
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
              <div className="spinner"/>
              <div><div style={{fontSize:14,fontWeight:600}}>Scanning your Aadhaar…</div><div style={{fontSize:12,color:"var(--text-muted)"}}>This takes a few seconds</div></div>
            </div>
            <div style={{background:"var(--surface2)",borderRadius:"var(--radius-sm)",padding:"12px 14px"}}>
              {SCAN_LABELS.map((l,i)=>(
                <div key={l} className={`scan-item ${scanSteps.includes(i)?"done":""}`}>
                  <span style={{fontSize:13,minWidth:16}}>{scanSteps.includes(i)?"✓":"·"}</span>
                  <span>{l}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 3: Review & complete ── */}
        {step===3&&(
          <div className="fade-up">
            <div style={{fontSize:15,fontWeight:600,marginBottom:4}}>Review extracted details</div>
            <div style={{fontSize:13,color:"var(--text-muted)",marginBottom:16}}>We've pre-filled your profile from your Aadhaar. Check everything and add the remaining details below.</div>

            {/* Extracted summary card */}
            <div style={{background:"var(--accent-light)",borderRadius:"var(--radius-sm)",padding:"14px 16px",marginBottom:20}}>
              <div style={{fontSize:11,fontWeight:700,color:"var(--accent-dark)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
                <span>✓</span> Extracted from Aadhaar
              </div>
              {[["Name",parsed?.name],["Date of birth",parsed?.dob],["Gender",parsed?.gender],["Aadhaar no.",parsed?.aadhaarNo],["Address",parsed?.address]].map(([l,v])=>(
                <div key={l} className="extracted-row">
                  <span style={{fontSize:12,color:"var(--accent-dark)",opacity:0.7}}>{l}</span>
                  <span style={{fontSize:12,fontWeight:600,color:"var(--accent-dark)",fontFamily:l==="Aadhaar no."?"var(--mono)":"var(--font)",maxWidth:"58%",textAlign:"right"}}>{v||"—"}</span>
                </div>
              ))}
            </div>

            {/* Editable fields */}
            <div style={{fontSize:11,fontWeight:700,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:12}}>Complete your profile</div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full name</label>
                <input className="form-input" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/>
              </div>
              <div className="form-group">
                <label className="form-label">Date of birth</label>
                <input className="form-input" type="date" value={form.dob} onChange={e=>setForm(f=>({...f,dob:e.target.value}))}/>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select className="form-input form-select" value={form.gender} onChange={e=>setForm(f=>({...f,gender:e.target.value}))}>
                  <option value="">Select</option>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Blood group</label>
                <select className="form-input form-select" value={form.bloodGroup} onChange={e=>setForm(f=>({...f,bloodGroup:e.target.value}))}>
                  <option value="">Select</option>
                  {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(b=><option key={b}>{b}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Current address</label>
              <input className="form-input" value={form.address} onChange={e=>setForm(f=>({...f,address:e.target.value}))}/>
            </div>
            <div className="form-group">
              <label className="form-label">Emergency contact</label>
              <input className="form-input" placeholder="Name and phone number" value={form.emergency} onChange={e=>setForm(f=>({...f,emergency:e.target.value}))}/>
            </div>

            <button className="btn btn-primary btn-full" onClick={handleConfirm} disabled={!form.name} style={{marginTop:4}}>
              Confirm & go to dashboard
            </button>
            <div style={{fontSize:11,color:"var(--text-muted)",textAlign:"center",marginTop:10}}>
              You can update these details anytime from your Profile tab
            </div>
          </div>
        )}

        {/* ── STEP 4: Done ── */}
        {step===4&&(
          <div className="fade-up" style={{textAlign:"center",padding:"24px 0"}}>
            <div style={{fontSize:52,marginBottom:14}}>✅</div>
            <div style={{fontSize:18,fontWeight:700,marginBottom:6}}>All set, {form.name.split(" ")[0]}!</div>
            <div style={{fontSize:13,color:"var(--text-muted)",marginBottom:20}}>Your profile has been saved. Loading your dashboard…</div>
            <div className="spinner" style={{margin:"0 auto"}}/>
          </div>
        )}

      </div>
    </div>
  );
}

// ─── OTP LOGIN ────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin, employees }) {
  const [step,setStep]         = useState("phone");
  const [phone,setPhone]       = useState("");
  const [resolved,setResolved] = useState(null);
  const [otp,setOtp]           = useState(["","","","","",""]);
  const [pin,setPin]           = useState(["","","",""]);
  const [error,setError]       = useState("");
  const otpR = useRef([]); const pinR = useRef([]);

  const submitPhone = () => {
    if (phone.replace(/\D/g,"").length<10){setError("Enter a valid 10-digit number.");return;}
    const n=NP(phone);
    const found=employees.find(e=>NP(e.phone)===n);
    if(found){setResolved(found);setError("");setStep("otp");}
    else setError("Number not registered. Ask your admin to add you.");
  };
  const changeOtp = (i,v,refs,arr,setArr) => {
    if(!/^\d?$/.test(v))return;
    const a=[...arr];a[i]=v;setArr(a);
    if(v&&i<arr.length-1)refs.current[i+1]?.focus();
  };
  const keyOtp=(e,i,refs,arr)=>{if(e.key==="Backspace"&&!arr[i]&&i>0)refs.current[i-1]?.focus();};

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:28}}>
          <div className="topbar-logo" style={{width:40,height:40,borderRadius:10,fontSize:18}}>S</div>
          <div><div style={{fontSize:18,fontWeight:700,letterSpacing:"-0.3px"}}>StaffDesk</div><div style={{fontSize:12,color:"var(--text-muted)"}}>Your workplace, simplified.</div></div>
        </div>

        {step==="phone"&&<div className="fade-up">
          <div className="form-group">
            <label className="form-label">Mobile number</label>
            <input className="form-input" placeholder="+91 98765 43210" value={phone} style={{fontSize:16}} autoFocus
              onChange={e=>{setPhone(e.target.value);setError("");}}
              onKeyDown={e=>e.key==="Enter"&&submitPhone()}/>
            <div className="form-hint">The number your admin registered you with</div>
          </div>
          {error&&<div className="alert alert-red">{error}</div>}
          <button className="btn btn-primary btn-full" onClick={submitPhone}>Send OTP</button>
          <div className="divider">or</div>
          <button className="btn btn-secondary btn-full" onClick={()=>{setStep("admin");setError("");}}>Admin login</button>
        </div>}

        {step==="otp"&&<div className="fade-up">
          <div style={{display:"flex",alignItems:"center",gap:10,background:"var(--accent-light)",borderRadius:"var(--radius-sm)",padding:"10px 14px",marginBottom:16}}>
            <div className="avatar-circle" style={{background:AC(resolved.name),width:36,height:36,fontSize:13,borderRadius:9}}>{INI(resolved.name)}</div>
            <div><div style={{fontSize:13,fontWeight:600}}>{resolved.name}</div><div style={{fontSize:11,color:"var(--text-muted)"}}>OTP sent to {resolved.phone} · demo code: 123456</div></div>
          </div>
          <div className="otp-inputs">
            {otp.map((v,i)=><input key={i} ref={el=>otpR.current[i]=el} className="otp-input" maxLength={1} value={v} inputMode="numeric" autoFocus={i===0}
              onChange={e=>changeOtp(i,e.target.value,otpR,otp,setOtp)} onKeyDown={e=>keyOtp(e,i,otpR,otp)}/>)}
          </div>
          {error&&<div className="alert alert-red">{error}</div>}
          <button className="btn btn-primary btn-full" onClick={()=>{const c=otp.join("");if(c.length<6){setError("Enter full 6-digit code.");return;}if(c==="123456"||c==="000000")onLogin(resolved);else setError("Invalid code. Use 123456 for demo.");}}>Verify & Sign In</button>
          <button className="btn btn-ghost btn-full" style={{marginTop:8}} onClick={()=>{setStep("phone");setOtp(["","","","","",""]);setError("");}}>← Change number</button>
        </div>}

        {step==="admin"&&<div className="fade-up">
          <div style={{fontSize:14,fontWeight:600,marginBottom:4}}>Admin PIN</div>
          <div style={{fontSize:12,color:"var(--text-muted)",marginBottom:4}}>4-digit PIN · demo: 1234</div>
          <div className="otp-inputs">
            {pin.map((v,i)=><input key={i} ref={el=>pinR.current[i]=el} className="otp-input" maxLength={1} value={v} type="password" inputMode="numeric" autoFocus={i===0}
              onChange={e=>changeOtp(i,e.target.value,pinR,pin,setPin)} onKeyDown={e=>keyOtp(e,i,pinR,pin)}/>)}
          </div>
          {error&&<div className="alert alert-red">{error}</div>}
          <button className="btn btn-primary btn-full" onClick={()=>{if(pin.join()==="1234")onLogin({id:"admin",name:"Admin",isAdmin:true,onboarded:true});else setError("Wrong PIN. Use 1234 for demo.");}}>Sign In as Admin</button>
          <button className="btn btn-ghost btn-full" style={{marginTop:8}} onClick={()=>{setStep("phone");setPin(["","","",""]);setError("");}}>← Back</button>
        </div>}
      </div>
    </div>
  );
}

// ─── TIMESHEET ────────────────────────────────────────────────────────────────
function TimesheetTab({user,timesheets,setTimesheets}) {
  const my=timesheets.filter(t=>t.empId===user.id);
  const ts=fmt(today); const ent=my.find(t=>t.date===ts); const ci=ent&&!ent.clockOut;
  const mo=my.filter(t=>t.date.startsWith(ts.slice(0,7)));
  const hrs=mo.reduce((s,t)=>s+(t.hours||0),0); const days=mo.filter(t=>t.status==="complete").length;
  const clockIn=()=>setTimesheets(p=>[...p,{id:Date.now(),empId:user.id,date:ts,clockIn:fmtTime(new Date()),clockOut:null,hours:null,status:"open"}]);
  const clockOut=()=>setTimesheets(p=>p.map(t=>{if(t.id!==ent.id)return t;const[ih,im]=ent.clockIn.split(":").map(Number);const n=new Date();return{...t,clockOut:fmtTime(n),hours:parseFloat(((n.getHours()-ih)+(n.getMinutes()-im)/60).toFixed(2)),status:"complete"};}));
  return (
    <div>
      <div className="section-title">Timesheet</div><div className="section-sub">Daily clock-in and attendance</div>
      <div className="metrics">
        <div className="metric"><div className="metric-label">Days this month</div><div className="metric-value">{days}</div><div className="metric-sub">of 26 scheduled</div></div>
        <div className="metric"><div className="metric-label">Hours logged</div><div className="metric-value">{hrs.toFixed(1)}</div><div className="metric-sub">this month</div></div>
        <div className="metric"><div className="metric-label">Today</div><div style={{marginTop:6}}>{ci?<span className="badge badge-green">In</span>:ent?<span className="badge badge-gray">Done</span>:<span className="badge badge-amber">Not started</span>}</div></div>
      </div>
      <div className="card">
        <LiveClock/>
        {!ent&&<button className="clock-btn clock-in" onClick={clockIn}>Clock In</button>}
        {ci&&<><div className="alert alert-green">Clocked in at {ent.clockIn}</div><button className="clock-btn clock-out" onClick={clockOut}>Clock Out</button></>}
        {ent?.clockOut&&<div className="alert alert-green">Today: {ent.clockIn} → {ent.clockOut} · {ent.hours}h worked</div>}
      </div>
      <div className="card">
        <div className="card-title" style={{marginBottom:14}}>Recent entries</div>
        <div className="table-wrap"><table>
          <thead><tr><th>Date</th><th>In</th><th>Out</th><th>Hours</th><th>Status</th></tr></thead>
          <tbody>
            {my.slice(-8).reverse().map(t=><tr key={t.id}><td style={{fontFamily:"var(--mono)",fontSize:12}}>{t.date}</td><td>{t.clockIn}</td><td>{t.clockOut||"—"}</td><td style={{fontFamily:"var(--mono)"}}>{t.hours?t.hours+"h":"—"}</td><td><span className={`badge ${t.status==="complete"?"badge-green":"badge-amber"}`}>{t.status}</span></td></tr>)}
            {!my.length&&<tr><td colSpan={5} style={{textAlign:"center",color:"var(--text-muted)",padding:24}}>No entries yet</td></tr>}
          </tbody>
        </table></div>
      </div>
    </div>
  );
}

// ─── TIME OFF ─────────────────────────────────────────────────────────────────
function TimeOffTab({user,leaves,setLeaves}) {
  const [show,setShow]=useState(false);
  const [form,setForm]=useState({date:"",type:"personal",reason:""});
  const my=leaves.filter(l=>l.empId===user.id);
  const app=my.filter(l=>l.status==="approved").length;
  const pend=my.filter(l=>l.status==="pending").length;
  const bal=Math.max(0,6-app);
  const sub=()=>{if(!form.date)return;setLeaves(p=>[...p,{id:Date.now(),empId:user.id,...form,status:"pending",appliedOn:fmt(today)}]);setShow(false);setForm({date:"",type:"personal",reason:""});};
  return (
    <div>
      <div className="section-title">Time Off</div><div className="section-sub">Leave requests and balance</div>
      <div className="metrics">
        <div className="metric"><div className="metric-label">Balance</div><div className="metric-value" style={{color:"var(--accent)"}}>{bal}</div><div className="metric-sub">days left</div></div>
        <div className="metric"><div className="metric-label">Approved</div><div className="metric-value">{app}</div><div className="metric-sub">this year</div></div>
        <div className="metric"><div className="metric-label">Pending</div><div className="metric-value" style={{color:"var(--amber)"}}>{pend}</div></div>
      </div>
      <div className="card">
        <div style={{fontSize:13,fontWeight:500,marginBottom:6}}>Leave accrual — 2 days/month</div>
        <div className="leave-bar"><div className="leave-fill" style={{width:`${Math.min(100,(app/6)*100)}%`}}/></div>
        <div style={{fontSize:12,color:"var(--text-muted)",marginBottom:14}}>{app} of 6 days used this quarter</div>
        <button className="btn btn-primary" onClick={()=>setShow(true)}>+ Request Time Off</button>
      </div>
      <div className="card">
        <div className="card-title" style={{marginBottom:14}}>Leave history</div>
        <div className="table-wrap"><table>
          <thead><tr><th>Date</th><th>Type</th><th>Reason</th><th>Status</th></tr></thead>
          <tbody>
            {my.slice().reverse().map(l=><tr key={l.id}><td style={{fontFamily:"var(--mono)",fontSize:12}}>{l.date}</td><td><span className={`badge ${l.type==="sick"?"badge-red":l.type==="personal"?"badge-blue":"badge-purple"}`}>{l.type}</span></td><td>{l.reason}</td><td><span className={`badge ${l.status==="approved"?"badge-green":l.status==="pending"?"badge-amber":"badge-red"}`}>{l.status}</span></td></tr>)}
            {!my.length&&<tr><td colSpan={4} style={{textAlign:"center",color:"var(--text-muted)",padding:24}}>No leaves yet</td></tr>}
          </tbody>
        </table></div>
      </div>
      {show&&<div className="modal-overlay" onClick={()=>setShow(false)}><div className="modal" onClick={e=>e.stopPropagation()}>
        <div style={{fontSize:17,fontWeight:600,marginBottom:4}}>Request Time Off</div>
        <div style={{fontSize:13,color:"var(--text-muted)",marginBottom:20}}>Sent to admin for approval</div>
        <div className="form-group"><label className="form-label">Date</label><input className="form-input" type="date" value={form.date} min={fmt(today)} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/></div>
        <div className="form-group"><label className="form-label">Type</label><select className="form-input form-select" value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}><option value="personal">Personal</option><option value="sick">Sick</option><option value="holiday">Holiday</option></select></div>
        <div className="form-group"><label className="form-label">Reason</label><input className="form-input" placeholder="Brief reason…" value={form.reason} onChange={e=>setForm(f=>({...f,reason:e.target.value}))}/></div>
        <div className="modal-footer"><button className="btn btn-secondary" onClick={()=>setShow(false)}>Cancel</button><button className="btn btn-primary" onClick={sub} disabled={!form.date}>Submit</button></div>
      </div></div>}
    </div>
  );
}

// ─── EXPENSES ─────────────────────────────────────────────────────────────────
function ExpensesTab({user,expenses,setExpenses}) {
  const [show,setShow]=useState(false);
  const [form,setForm]=useState({type:"reimbursement",amount:"",description:"",file:null});
  const my=expenses.filter(e=>e.empId===user.id);
  const pend=my.filter(e=>e.status==="pending").reduce((s,e)=>s+Number(e.amount),0);
  const set_=my.filter(e=>e.status==="settled").reduce((s,e)=>s+Number(e.amount),0);
  const sub=()=>{if(!form.amount||!form.description)return;setExpenses(p=>[...p,{id:Date.now(),empId:user.id,type:form.type,amount:Number(form.amount),description:form.description,status:"pending",date:fmt(today)}]);setShow(false);setForm({type:"reimbursement",amount:"",description:"",file:null});};
  return (
    <div>
      <div className="section-title">Expenses</div><div className="section-sub">Advances and reimbursements</div>
      <div className="metrics">
        <div className="metric"><div className="metric-label">Pending</div><div className="metric-value" style={{color:"var(--amber)",fontSize:18}}>{INR(pend)}</div><div className="metric-sub">to settle</div></div>
        <div className="metric"><div className="metric-label">Settled</div><div className="metric-value" style={{fontSize:18}}>{INR(set_)}</div><div className="metric-sub">all time</div></div>
      </div>
      <div className="card">
        <button className="btn btn-primary" onClick={()=>setShow(true)}>+ Log Expense</button>
        <div style={{fontSize:12,color:"var(--text-muted)",marginTop:8}}>Log a reimbursement request or acknowledge an advance</div>
      </div>
      <div className="card">
        <div className="card-title" style={{marginBottom:14}}>Expense history</div>
        <div className="table-wrap"><table>
          <thead><tr><th>Date</th><th>Type</th><th>Description</th><th>Amount</th><th>Status</th></tr></thead>
          <tbody>
            {my.slice().reverse().map(e=><tr key={e.id}><td style={{fontFamily:"var(--mono)",fontSize:12}}>{e.date}</td><td><span className={`badge ${e.type==="advance"?"badge-blue":"badge-purple"}`}>{e.type}</span></td><td style={{maxWidth:150,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.description}</td><td style={{fontFamily:"var(--mono)",fontWeight:600}}>{INR(e.amount)}</td><td><span className={`badge ${e.status==="settled"?"badge-green":"badge-amber"}`}>{e.status}</span></td></tr>)}
            {!my.length&&<tr><td colSpan={5} style={{textAlign:"center",color:"var(--text-muted)",padding:24}}>No expenses yet</td></tr>}
          </tbody>
        </table></div>
      </div>
      {show&&<div className="modal-overlay" onClick={()=>setShow(false)}><div className="modal" onClick={e=>e.stopPropagation()}>
        <div style={{fontSize:17,fontWeight:600,marginBottom:4}}>Log Expense</div>
        <div style={{fontSize:13,color:"var(--text-muted)",marginBottom:20}}>Submit a reimbursement or acknowledge an advance</div>
        <div className="form-group"><label className="form-label">Type</label><select className="form-input form-select" value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}><option value="reimbursement">Reimbursement (I spent my own money)</option><option value="advance">Advance (I received money from employer)</option></select></div>
        <div className="form-group"><label className="form-label">Amount (₹)</label><input className="form-input" type="number" placeholder="0" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))}/></div>
        <div className="form-group"><label className="form-label">Description</label><input className="form-input" placeholder="What was it for?" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}/></div>
        <div className="modal-footer"><button className="btn btn-secondary" onClick={()=>setShow(false)}>Cancel</button><button className="btn btn-primary" onClick={sub} disabled={!form.amount||!form.description}>Submit</button></div>
      </div></div>}
    </div>
  );
}

// ─── DOCUMENTS ────────────────────────────────────────────────────────────────
function DocumentsTab({user,docs,setDocs}) {
  const my=docs[user.id]||[];
  const [up,setUp]=useState(null);
  const get=t=>my.find(d=>d.type===t);
  const upload=(t,f)=>{if(!f)return;setUp(t);setTimeout(()=>{setDocs(p=>({...p,[user.id]:[...(p[user.id]||[]).filter(d=>d.type!==t),{id:Date.now(),type:t,name:DOC_LABELS[t],status:"uploaded",uploadedOn:fmt(today),size:(f.size/1024/1024).toFixed(1)+" MB"}]}));setUp(null);},1000);};
  const selfT=["aadhaar","pan","bank","address"]; const adminT=["offer","appointment","payslip","relieving"];
  return (
    <div>
      <div className="section-title">My Documents</div><div className="section-sub">KYC and employment documents</div>
      <div className="card">
        <div className="card-title" style={{marginBottom:4}}>KYC documents</div>
        <div className="card-subtitle" style={{marginBottom:16}}>Upload your own identity documents below</div>
        {selfT.map(t=>{const d=get(t);return(
          <div key={t} className="doc-row">
            <div style={{display:"flex",alignItems:"center",gap:12,flex:1}}>
              <div className="doc-icon" style={{background:d?"var(--accent-light)":"var(--surface2)"}}>{DOC_ICONS[t]}</div>
              <div><div style={{fontSize:13,fontWeight:500}}>{DOC_LABELS[t]}</div><div style={{fontSize:11,color:"var(--text-muted)"}}>{d?`Uploaded ${d.uploadedOn} · ${d.size}`:"Not uploaded yet"}</div></div>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              {d&&<span className="badge badge-green">✓</span>}
              <label style={{cursor:"pointer"}}><input type="file" style={{display:"none"}} accept="image/*,application/pdf" onChange={e=>upload(t,e.target.files[0])}/><span className={`btn btn-sm ${d?"btn-secondary":"btn-primary"}`}>{up===t?"Uploading…":d?"Replace":"Upload"}</span></label>
            </div>
          </div>
        );})}
      </div>
      <div className="card">
        <div className="card-title" style={{marginBottom:4}}>From admin</div>
        <div className="card-subtitle" style={{marginBottom:16}}>Offer letters, pay slips and appointment letters</div>
        {adminT.map(t=>{const d=get(t);return(
          <div key={t} className="doc-row">
            <div style={{display:"flex",alignItems:"center",gap:12,flex:1}}>
              <div className="doc-icon" style={{background:d?"var(--blue-light)":"var(--surface2)"}}>{DOC_ICONS[t]}</div>
              <div><div style={{fontSize:13,fontWeight:500}}>{DOC_LABELS[t]}</div><div style={{fontSize:11,color:"var(--text-muted)"}}>{d?`Uploaded ${d.uploadedOn} · ${d.size}`:"Not uploaded by admin yet"}</div></div>
            </div>
            {d&&<button className="btn btn-secondary btn-sm">Download</button>}
          </div>
        );})}
      </div>
    </div>
  );
}

// ─── PROFILE ──────────────────────────────────────────────────────────────────
function ProfileTab({user}) {
  return (
    <div>
      <div className="section-title">My Profile</div><div className="section-sub">Personal and employment details</div>
      <div className="card">
        <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:20}}>
          <div className="avatar-circle" style={{background:AC(user.name),width:56,height:56,fontSize:20,borderRadius:14}}>{INI(user.name)}</div>
          <div><div style={{fontSize:18,fontWeight:700}}>{user.name}</div><div style={{fontSize:13,color:"var(--text-muted)"}}>{user.role} · {user.department}</div><span className="badge badge-green" style={{marginTop:4}}>{user.status}</span></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px 24px"}}>
          {[["Phone",user.phone],["Date of birth",user.dob||"—"],["Gender",user.gender||"—"],["Blood group",user.bloodGroup||"—"],["Address",user.address||"—"],["Emergency contact",user.emergency||"—"],["Start date",user.startDate],["Work days/week",user.workDays]].map(([l,v])=>(
            <div key={l}><div style={{fontSize:11,color:"var(--text-muted)",marginBottom:2,textTransform:"uppercase",letterSpacing:"0.04em"}}>{l}</div><div style={{fontSize:13,fontWeight:500}}>{v}</div></div>
          ))}
        </div>
      </div>
      <div className="card">
        <div className="card-title" style={{marginBottom:14}}>Salary history</div>
        <div className="table-wrap"><table>
          <thead><tr><th>Amount</th><th>From</th><th>To</th><th></th></tr></thead>
          <tbody>{user.salaryHistory.slice().reverse().map((s,i)=><tr key={i}><td style={{fontFamily:"var(--mono)",fontWeight:600}}>{INR(s.amount)}</td><td style={{fontFamily:"var(--mono)",fontSize:12}}>{s.effectiveFrom}</td><td style={{fontFamily:"var(--mono)",fontSize:12}}>{s.effectiveTo||"Present"}</td><td><span className={`badge ${!s.effectiveTo?"badge-green":"badge-gray"}`}>{!s.effectiveTo?"Current":"Past"}</span></td></tr>)}</tbody>
        </table></div>
      </div>
    </div>
  );
}

// ─── ADMIN EMPLOYEE DETAIL ────────────────────────────────────────────────────
function EmpDetail({emp,docs,setDocs,expenses,leaves,timesheets,onBack}) {
  const [tab,setTab]=useState("profile");
  const ed=docs[emp.id]||[]; const el=leaves.filter(l=>l.empId===emp.id);
  const ee=expenses.filter(e=>e.empId===emp.id); const et=timesheets.filter(t=>t.empId===emp.id);
  const upload=(t,f)=>{if(!f)return;setTimeout(()=>setDocs(p=>({...p,[emp.id]:[...(p[emp.id]||[]).filter(d=>d.type!==t),{id:Date.now(),type:t,name:DOC_LABELS[t],status:"uploaded",uploadedOn:fmt(today),size:(f.size/1024/1024).toFixed(1)+" MB"}]})),800);};
  return (
    <div>
      <button className="btn btn-ghost" style={{marginBottom:16}} onClick={onBack}>← All employees</button>
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20,flexWrap:"wrap"}}>
        <div className="avatar-circle" style={{background:AC(emp.name),width:52,height:52,fontSize:18,borderRadius:13}}>{INI(emp.name)}</div>
        <div style={{flex:1}}><div style={{fontSize:18,fontWeight:700}}>{emp.name}</div><div style={{fontSize:13,color:"var(--text-muted)"}}>{emp.role} · {emp.phone}</div></div>
        <div style={{textAlign:"right"}}><div style={{fontSize:20,fontWeight:700,fontFamily:"var(--mono)",color:"var(--accent-dark)"}}>{INR(SAL(emp))}<span style={{fontSize:12,fontWeight:400,color:"var(--text-muted)"}}>/mo</span></div><span className={`badge ${emp.onboarded?"badge-green":"badge-amber"}`} style={{marginTop:4}}>{emp.onboarded?"Onboarded":"Pending onboarding"}</span></div>
      </div>
      <div className="nav-tabs" style={{marginBottom:20}}>
        {["profile","documents","timesheets","leaves","expenses"].map(t=><button key={t} className={`nav-tab ${tab===t?"active":""}`} onClick={()=>setTab(t)} style={{textTransform:"capitalize"}}>{t}</button>)}
      </div>

      {tab==="profile"&&<div className="card">
        {!emp.onboarded&&<div className="alert alert-amber" style={{marginBottom:16}}>⚠ This employee hasn't completed Aadhaar onboarding yet.</div>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px 24px"}}>
          {[["Phone",emp.phone],["DOB",emp.dob||"—"],["Gender",emp.gender||"—"],["Blood group",emp.bloodGroup||"—"],["Address",emp.address||"—"],["Emergency",emp.emergency||"—"],["Aadhaar (last 4)",emp.aadhaarLast4?"XXXX XXXX "+emp.aadhaarLast4:"—"],["PAN",emp.panNumber||"—"],["Bank",emp.bankName||"—"],["IFSC",emp.ifsc||"—"],["Start date",emp.startDate],["Work days/wk",emp.workDays]].map(([l,v])=>(
            <div key={l}><div style={{fontSize:11,color:"var(--text-muted)",marginBottom:2,textTransform:"uppercase",letterSpacing:"0.04em"}}>{l}</div><div style={{fontSize:13,fontWeight:500}}>{v}</div></div>
          ))}
        </div>
      </div>}

      {tab==="documents"&&<div className="card">
        <div className="card-title" style={{marginBottom:16}}>{ed.length} documents on record</div>
        {["aadhaar","pan","bank","address","offer","appointment","payslip","relieving"].map(t=>{
          const d=ed.find(x=>x.type===t); const isA=["offer","appointment","payslip","relieving"].includes(t);
          return <div key={t} className="doc-row">
            <div style={{display:"flex",alignItems:"center",gap:12,flex:1}}>
              <div className="doc-icon" style={{background:d?"var(--accent-light)":"var(--surface2)"}}>{DOC_ICONS[t]}</div>
              <div><div style={{fontSize:13,fontWeight:500}}>{DOC_LABELS[t]}</div><div style={{fontSize:11,color:"var(--text-muted)"}}>{d?`${d.uploadedOn} · ${d.size}`:isA?"Admin uploads":"Awaiting employee"}</div></div>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              {d?<><span className="badge badge-green">✓</span><button className="btn btn-secondary btn-sm">View</button></>:isA?<label style={{cursor:"pointer"}}><input type="file" style={{display:"none"}} accept=".pdf,image/*" onChange={e=>upload(t,e.target.files[0])}/><span className="btn btn-primary btn-sm">Upload</span></label>:<span className="badge badge-amber">Pending</span>}
            </div>
          </div>;
        })}
      </div>}

      {tab==="timesheets"&&<div className="card">
        <div className="card-title" style={{marginBottom:14}}>Attendance log</div>
        <div className="table-wrap"><table><thead><tr><th>Date</th><th>In</th><th>Out</th><th>Hours</th><th>Status</th></tr></thead><tbody>
          {et.slice().reverse().map(t=><tr key={t.id}><td style={{fontFamily:"var(--mono)",fontSize:12}}>{t.date}</td><td>{t.clockIn}</td><td>{t.clockOut||"—"}</td><td style={{fontFamily:"var(--mono)"}}>{t.hours?t.hours+"h":"—"}</td><td><span className={`badge ${t.status==="complete"?"badge-green":"badge-amber"}`}>{t.status}</span></td></tr>)}
          {!et.length&&<tr><td colSpan={5} style={{textAlign:"center",color:"var(--text-muted)",padding:24}}>No entries</td></tr>}
        </tbody></table></div>
      </div>}

      {tab==="leaves"&&<div className="card">
        <div className="card-title" style={{marginBottom:14}}>Leave requests</div>
        <div className="table-wrap"><table><thead><tr><th>Date</th><th>Type</th><th>Reason</th><th>Status</th><th>Action</th></tr></thead><tbody>
          {el.slice().reverse().map(l=><tr key={l.id}><td style={{fontFamily:"var(--mono)",fontSize:12}}>{l.date}</td><td><span className={`badge ${l.type==="sick"?"badge-red":"badge-blue"}`}>{l.type}</span></td><td>{l.reason}</td><td><span className={`badge ${l.status==="approved"?"badge-green":l.status==="pending"?"badge-amber":"badge-red"}`}>{l.status}</span></td><td>{l.status==="pending"&&<button className="btn btn-primary btn-sm">Approve</button>}</td></tr>)}
          {!el.length&&<tr><td colSpan={5} style={{textAlign:"center",color:"var(--text-muted)",padding:24}}>No leaves</td></tr>}
        </tbody></table></div>
      </div>}

      {tab==="expenses"&&<div className="card">
        <div className="card-title" style={{marginBottom:14}}>Expense log</div>
        <div className="table-wrap"><table><thead><tr><th>Date</th><th>Type</th><th>Description</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead><tbody>
          {ee.slice().reverse().map(e=><tr key={e.id}><td style={{fontFamily:"var(--mono)",fontSize:12}}>{e.date}</td><td><span className={`badge ${e.type==="advance"?"badge-blue":"badge-purple"}`}>{e.type}</span></td><td style={{maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.description}</td><td style={{fontFamily:"var(--mono)",fontWeight:600}}>{INR(e.amount)}</td><td><span className={`badge ${e.status==="settled"?"badge-green":"badge-amber"}`}>{e.status}</span></td><td>{e.status==="pending"&&<button className="btn btn-primary btn-sm">Settle</button>}</td></tr>)}
          {!ee.length&&<tr><td colSpan={6} style={{textAlign:"center",color:"var(--text-muted)",padding:24}}>No expenses</td></tr>}
        </tbody></table></div>
      </div>}
    </div>
  );
}

// ─── ADMIN EMPLOYEES ──────────────────────────────────────────────────────────
function AdminEmployees({employees,setEmployees,docs,setDocs,expenses,leaves,timesheets}) {
  const [sel,setSel]=useState(null);
  const [showAdd,setShowAdd]=useState(false);
  const [form,setForm]=useState({name:"",phone:"",role:"",department:"",startDate:"",workDays:6,salary:""});
  const add=()=>{if(!form.name||!form.phone||!form.salary)return;const id=form.name.toLowerCase().replace(/\s+/g,"-")+"-"+Date.now();setEmployees(p=>[...p,{id,name:form.name,phone:form.phone,role:form.role,department:form.department,startDate:form.startDate,workDays:Number(form.workDays),salaryHistory:[{amount:Number(form.salary),effectiveFrom:form.startDate,effectiveTo:null}],dob:"",gender:"",bloodGroup:"",emergency:"",bankName:"",accountNo:"",ifsc:"",aadhaarLast4:"",panNumber:"",address:"",status:"active",onboarded:false}]);setDocs(p=>({...p,[id]:[]}));setShowAdd(false);setForm({name:"",phone:"",role:"",department:"",startDate:"",workDays:6,salary:""});};
  if(sel)return <EmpDetail emp={employees.find(e=>e.id===sel)} docs={docs} setDocs={setDocs} expenses={expenses} leaves={leaves} timesheets={timesheets} onBack={()=>setSel(null)}/>;
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
        <div><div className="section-title">Employees</div><div className="section-sub">{employees.length} staff members</div></div>
        <button className="btn btn-primary" onClick={()=>setShowAdd(true)}>+ Add Employee</button>
      </div>
      {employees.map(emp=>(
        <div key={emp.id} className="emp-card" onClick={()=>setSel(emp.id)}>
          <div className="avatar-circle" style={{background:AC(emp.name),width:44,height:44,fontSize:15,borderRadius:11}}>{INI(emp.name)}</div>
          <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600}}>{emp.name}</div><div style={{fontSize:12,color:"var(--text-muted)"}}>{emp.role} · {emp.department} · {emp.phone}</div></div>
          <div style={{textAlign:"right"}}><div style={{fontSize:14,fontWeight:700,fontFamily:"var(--mono)",color:"var(--accent-dark)"}}>{INR(SAL(emp))}/mo</div><span className={`badge ${emp.onboarded?"badge-green":"badge-amber"}`} style={{marginTop:4}}>{emp.onboarded?"Onboarded":"Pending"}</span></div>
        </div>
      ))}
      {showAdd&&<div className="modal-overlay" onClick={()=>setShowAdd(false)}><div className="modal" onClick={e=>e.stopPropagation()}>
        <div style={{fontSize:17,fontWeight:600,marginBottom:4}}>Add new employee</div>
        <div style={{fontSize:13,color:"var(--text-muted)",marginBottom:20}}>They'll upload their Aadhaar and complete their profile on first login</div>
        <div className="form-row"><div className="form-group"><label className="form-label">Full name</label><input className="form-input" placeholder="Full name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></div><div className="form-group"><label className="form-label">Phone</label><input className="form-input" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))}/></div></div>
        <div className="form-row"><div className="form-group"><label className="form-label">Role</label><input className="form-input" placeholder="e.g. Staff" value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))}/></div><div className="form-group"><label className="form-label">Department</label><input className="form-input" placeholder="e.g. Operations" value={form.department} onChange={e=>setForm(f=>({...f,department:e.target.value}))}/></div></div>
        <div className="form-row"><div className="form-group"><label className="form-label">Start date</label><input className="form-input" type="date" value={form.startDate} onChange={e=>setForm(f=>({...f,startDate:e.target.value}))}/></div><div className="form-group"><label className="form-label">Monthly salary (₹)</label><input className="form-input" type="number" placeholder="0" value={form.salary} onChange={e=>setForm(f=>({...f,salary:e.target.value}))}/></div></div>
        <div className="modal-footer"><button className="btn btn-secondary" onClick={()=>setShowAdd(false)}>Cancel</button><button className="btn btn-primary" onClick={add} disabled={!form.name||!form.phone||!form.salary}>Add Employee</button></div>
      </div></div>}
    </div>
  );
}

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
function AdminDashboard({employees,timesheets,leaves,expenses}) {
  const ts=fmt(today);
  const ci=timesheets.filter(t=>t.date===ts&&t.clockIn).length;
  const pl=leaves.filter(l=>l.status==="pending").length;
  const pe=expenses.filter(e=>e.status==="pending").reduce((s,e)=>s+e.amount,0);
  const pay=employees.reduce((s,e)=>s+SAL(e),0);
  const no=employees.filter(e=>!e.onboarded).length;
  return (
    <div>
      <div className="section-title">Dashboard</div>
      <div className="section-sub">{today.toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</div>
      {no>0&&<div className="alert alert-amber"><span>⚠</span><span>{no} employee{no>1?"s":""} haven't completed Aadhaar onboarding yet.</span></div>}
      <div className="metrics">
        <div className="metric"><div className="metric-label">Clocked in</div><div className="metric-value" style={{color:"var(--accent)"}}>{ci}</div><div className="metric-sub">of {employees.length} today</div></div>
        <div className="metric"><div className="metric-label">Pending leaves</div><div className="metric-value" style={{color:"var(--amber)"}}>{pl}</div></div>
        <div className="metric"><div className="metric-label">Pending expenses</div><div className="metric-value" style={{color:"var(--amber)",fontSize:16}}>{INR(pe)}</div></div>
        <div className="metric"><div className="metric-label">Monthly payroll</div><div className="metric-value" style={{color:"var(--blue)",fontSize:16}}>{INR(pay)}</div></div>
      </div>
      <div className="card">
        <div className="card-title" style={{marginBottom:14}}>Today's attendance</div>
        <div className="table-wrap"><table><thead><tr><th>Employee</th><th>In</th><th>Out</th><th>Aadhaar</th><th>Status</th></tr></thead><tbody>
          {employees.map(emp=>{const e=timesheets.find(t=>t.empId===emp.id&&t.date===ts);return(
            <tr key={emp.id}><td><div style={{display:"flex",alignItems:"center",gap:8}}><div className="avatar-circle" style={{background:AC(emp.name),width:28,height:28,fontSize:11,borderRadius:7}}>{INI(emp.name)}</div><span style={{fontWeight:500}}>{emp.name}</span></div></td>
            <td>{e?.clockIn||"—"}</td><td>{e?.clockOut||"—"}</td>
            <td><span className={`badge ${emp.onboarded?"badge-green":"badge-amber"}`}>{emp.onboarded?"Verified":"Pending"}</span></td>
            <td><span className={`badge ${e?.clockOut?"badge-green":e?.clockIn?"badge-amber":"badge-red"}`}>{e?.clockOut?"Done":e?.clockIn?"In progress":"Absent"}</span></td></tr>
          );})}
        </tbody></table></div>
      </div>
      {pl>0&&<div className="card">
        <div className="card-title" style={{marginBottom:14}}>Pending leave requests</div>
        <div className="table-wrap"><table><thead><tr><th>Employee</th><th>Date</th><th>Type</th><th>Reason</th><th>Action</th></tr></thead><tbody>
          {leaves.filter(l=>l.status==="pending").map(l=>{const emp=employees.find(e=>e.id===l.empId);return(
            <tr key={l.id}><td style={{fontWeight:500}}>{emp?.name}</td><td style={{fontFamily:"var(--mono)",fontSize:12}}>{l.date}</td><td><span className={`badge ${l.type==="sick"?"badge-red":"badge-blue"}`}>{l.type}</span></td><td>{l.reason}</td><td><button className="btn btn-primary btn-sm">Approve</button></td></tr>
          );})}
        </tbody></table></div>
      </div>}
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [user,setUser]           = useState(null);
  const [tab,setTab]             = useState("timesheet");
  const [employees,setEmployees] = useState(EMPLOYEES);
  const [timesheets,setTimesheets]=useState(TIMESHEETS);
  const [leaves,setLeaves]       = useState(LEAVES);
  const [expenses,setExpenses]   = useState(EXPENSES);
  const [docs,setDocs]           = useState(DOCS_INIT);

  const login = useCallback(incoming => {
    if(incoming.isAdmin){setUser(incoming);setTab("dashboard");return;}
    const full = employees.find(e=>e.id===incoming.id)||incoming;
    setUser(full); setTab("timesheet");
  },[employees]);

  const onboardDone = useCallback(fields => {
    setEmployees(p=>p.map(e=>e.id===user.id?{...e,...fields,onboarded:true}:e));
    setDocs(p=>({...p,[user.id]:[...(p[user.id]||[]).filter(d=>d.type!=="aadhaar"),{id:Date.now(),type:"aadhaar",name:"Aadhaar Card",status:"uploaded",uploadedOn:fmt(today),size:"1.1 MB"}]}));
    setUser(p=>({...p,...fields,onboarded:true}));
  },[user]);

  const empData = employees.find(e=>e.id===user?.id)||user;
  const staffTabs=[{id:"timesheet",label:"Timesheet"},{id:"timeoff",label:"Time Off"},{id:"expenses",label:"Expenses"},{id:"documents",label:"Documents"},{id:"profile",label:"Profile"}];
  const adminTabs=[{id:"dashboard",label:"Dashboard"},{id:"employees",label:"Employees"}];

  return (
    <>
      <style>{STYLES}</style>
      {!user && <LoginScreen onLogin={login} employees={employees}/>}
      {user && !user.isAdmin && !empData?.onboarded && <AadhaarOnboarding employee={empData} onComplete={onboardDone}/>}
      {user && (user.isAdmin || empData?.onboarded) && (
        <div className="app">
          <div className="topbar">
            <div className="topbar-brand"><div className="topbar-logo">S</div>StaffDesk</div>
            <div className="topbar-right">
              <div className="avatar-pill">
                <div className="avatar-circle" style={{background:user.isAdmin?"#1A4A7A":AC(user.name),width:28,height:28,fontSize:11}}>{user.isAdmin?"AD":INI(user.name)}</div>
                <span>{user.isAdmin?"Admin":user.name.split(" ")[0]}</span>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={()=>setUser(null)}>Sign out</button>
            </div>
          </div>
          <div className="main">
            <div className="nav-tabs">
              {(user.isAdmin?adminTabs:staffTabs).map(t=><button key={t.id} className={`nav-tab ${tab===t.id?"active":""}`} onClick={()=>setTab(t.id)}>{t.label}</button>)}
            </div>
            {!user.isAdmin&&tab==="timesheet"&&<TimesheetTab user={empData} timesheets={timesheets} setTimesheets={setTimesheets}/>}
            {!user.isAdmin&&tab==="timeoff"&&<TimeOffTab user={empData} leaves={leaves} setLeaves={setLeaves}/>}
            {!user.isAdmin&&tab==="expenses"&&<ExpensesTab user={empData} expenses={expenses} setExpenses={setExpenses}/>}
            {!user.isAdmin&&tab==="documents"&&<DocumentsTab user={empData} docs={docs} setDocs={setDocs}/>}
            {!user.isAdmin&&tab==="profile"&&<ProfileTab user={empData}/>}
            {user.isAdmin&&tab==="dashboard"&&<AdminDashboard employees={employees} timesheets={timesheets} leaves={leaves} expenses={expenses}/>}
            {user.isAdmin&&tab==="employees"&&<AdminEmployees employees={employees} setEmployees={setEmployees} docs={docs} setDocs={setDocs} expenses={expenses} leaves={leaves} timesheets={timesheets}/>}
          </div>
        </div>
      )}
    </>
  );
}
