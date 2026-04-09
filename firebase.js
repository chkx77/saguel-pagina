/* ── Reset ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ── Design tokens ── */
:root {
  /* Dark industrial palette */
  --bg:       #0F0F0F;
  --surface:  #1A1A1A;
  --surface2: #222222;
  --border:   #2E2E2E;
  --border2:  #3A3A3A;

  /* Text */
  --ink:      #E8E8E4;
  --ink2:     #999990;
  --ink3:     #555550;

  /* Accents */
  --lime:     #C8FF40;
  --lime-dim: #8AB82A;
  --red:      #FF4444;
  --red-dim:  #CC2222;
  --amber:    #F59E0B;
  --green:    #22C55E;

  /* Status backgrounds */
  --red-bg:   rgba(255,68,68,0.08);
  --amber-bg: rgba(245,158,11,0.08);
  --green-bg: rgba(34,197,94,0.08);

  /* Fonts */
  --font-body: 'DM Sans', sans-serif;
  --font-mono: 'DM Mono', monospace;

  /* Spacing scale */
  --r-sm: 4px;
  --r:    6px;
  --r-lg: 10px;
}

html, body, #root {
  height: 100%;
  font-family: var(--font-body);
  background: var(--bg);
  color: var(--ink);
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
}

button, input, select, textarea { font-family: inherit; }
::-webkit-scrollbar { width: 2px; height: 2px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

/* ── Spinner ── */
.spinner {
  width: 22px; height: 22px;
  border: 2px solid var(--border2);
  border-top-color: var(--lime);
  border-radius: 50%;
  animation: spin .6s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Status pills ── */
.status-pill {
  font-family: var(--font-mono);
  font-size: 10px; font-weight: 500;
  padding: 2px 6px; border-radius: var(--r-sm);
  letter-spacing: .04em;
  display: inline-block;
  border: 1px solid;
}
.st-ok  { background: var(--green-bg); color: var(--green);  border-color: rgba(34,197,94,.25); }
.st-low { background: var(--amber-bg); color: var(--amber);  border-color: rgba(245,158,11,.25); }
.st-out { background: var(--red-bg);   color: var(--red);    border-color: rgba(255,68,68,.25); }

/* ── Alert bar ── */
.alert-bar {
  display: flex; align-items: center; gap: 8px;
  padding: 9px 12px; border-radius: var(--r);
  font-size: 13px; font-weight: 500;
  margin-bottom: 8px; border: 1px solid;
}
.alert-bar .alert-icon { font-size: 12px; flex-shrink: 0; }
.al-r { background: var(--red-bg);   border-color: rgba(255,68,68,.2);    color: #ff8080; }
.al-a { background: var(--amber-bg); border-color: rgba(245,158,11,.2);   color: #fbbf24; }
.al-g { background: var(--green-bg); border-color: rgba(34,197,94,.2);    color: var(--green); }

/* ── Tag ── */
.tag {
  font-family: var(--font-mono);
  display: inline-block; padding: 2px 7px;
  border-radius: var(--r-sm); font-size: 10px; font-weight: 500;
  border: 1px solid; letter-spacing: .04em;
}
.tag-pend { background: rgba(245,158,11,.1);  color: #fbbf24; border-color: rgba(245,158,11,.2); }
.tag-apro { background: var(--green-bg);       color: var(--green); border-color: rgba(34,197,94,.2); }
.tag-rech { background: var(--red-bg);         color: #ff8080; border-color: rgba(255,68,68,.2); }
.tag-norm { background: rgba(255,255,255,.04); color: var(--ink2); border-color: var(--border); }
.tag-alta { background: rgba(245,158,11,.1);   color: #fbbf24; border-color: rgba(245,158,11,.2); }
.tag-crit { background: var(--red-bg);         color: var(--red);  border-color: rgba(255,68,68,.2); }

/* ── Buttons ── */
.btn {
  display: inline-flex; align-items: center; justify-content: center;
  gap: 6px; padding: 8px 16px; border-radius: var(--r);
  font-size: 13px; font-weight: 600; cursor: pointer;
  border: 1px solid transparent; transition: all .12s; line-height: 1;
  white-space: nowrap; font-family: var(--font-body);
}
.btn:active { transform: scale(.97); }

.b-lime  { background: var(--lime); color: #0F0F0F; border-color: var(--lime); }
.b-lime:hover { background: #d8ff60; }

.b-ghost { background: transparent; color: var(--ink2); border-color: var(--border2); }
.b-ghost:hover { background: var(--surface2); color: var(--ink); border-color: var(--border2); }

.b-danger { background: var(--red-bg); color: var(--red); border-color: rgba(255,68,68,.2); }
.b-danger:hover { background: rgba(255,68,68,.15); }

.b-success { background: var(--green-bg); color: var(--green); border-color: rgba(34,197,94,.2); }
.b-success:hover { background: rgba(34,197,94,.15); }

.b-sm { font-size: 11px; padding: 5px 10px; }
.b-lg { font-size: 14px; padding: 10px 20px; }

/* ── Form ── */
.field { margin-bottom: 12px; }
.field label {
  display: block; font-size: 11px; font-weight: 600;
  color: var(--ink3); text-transform: uppercase; letter-spacing: .06em;
  margin-bottom: 5px;
}
.field input, .field select, .field textarea {
  width: 100%; padding: 8px 11px;
  border: 1px solid var(--border2); border-radius: var(--r);
  font-size: 13px; color: var(--ink); background: var(--surface2);
  outline: none; transition: border .12s;
  appearance: none;
}
.field input:focus, .field select:focus, .field textarea:focus {
  border-color: var(--lime);
  box-shadow: 0 0 0 2px rgba(200,255,64,.08);
}
.field select { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; padding-right: 30px; }
.field textarea { min-height: 64px; resize: vertical; }
.field-err { font-size: 11px; color: var(--red); font-weight: 500; margin-top: 3px; }

.row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.row3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
.btn-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }

/* ── Table ── */
.tbl-wrap { border-radius: var(--r-lg); border: 1px solid var(--border); overflow: hidden; }
table { width: 100%; border-collapse: collapse; font-size: 13px; }
thead tr { background: var(--surface2); }
th {
  padding: 8px 11px; text-align: left;
  font-family: var(--font-mono); font-size: 10px; font-weight: 500;
  color: var(--ink3); text-transform: uppercase; letter-spacing: .06em;
  border-bottom: 1px solid var(--border); white-space: nowrap;
}
td { padding: 8px 11px; border-bottom: 1px solid var(--border); vertical-align: middle; }
tbody tr:last-child td { border-bottom: none; }
tbody tr { transition: background .08s; }
tbody tr:hover td { background: var(--surface2); }

/* ── Inv item — ultra compact row ── */
.inv-row {
  display: flex; align-items: center; gap: 10px;
  padding: 6px 10px; border-bottom: 1px solid var(--border);
  transition: background .08s;
}
.inv-row:last-child { border-bottom: none; }
.inv-row:hover { background: var(--surface2); }
.inv-name { flex: 1; font-size: 12.5px; font-weight: 500; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.inv-min  { font-family: var(--font-mono); font-size: 10px; color: var(--ink3); flex-shrink: 0; }
.inv-controls { display: flex; align-items: center; gap: 3px; flex-shrink: 0; }
.ctrl-btn {
  width: 22px; height: 22px; border-radius: var(--r-sm);
  background: var(--surface2); border: 1px solid var(--border2);
  color: var(--ink2); font-size: 14px; line-height: 1;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: .1s; flex-shrink: 0;
}
.ctrl-btn:hover { background: var(--border2); color: var(--lime); border-color: var(--lime-dim); }
.ctrl-num {
  font-family: var(--font-mono); font-size: 13px; font-weight: 500;
  min-width: 28px; text-align: center; cursor: pointer; color: var(--ink);
  padding: 1px 3px; border-radius: var(--r-sm); transition: .1s;
}
.ctrl-num:hover { color: var(--lime); background: rgba(200,255,64,.08); }
.ctrl-input {
  width: 42px; text-align: center; font-family: var(--font-mono);
  font-size: 13px; font-weight: 500; padding: 2px 4px;
  border: 1px solid var(--lime); border-radius: var(--r-sm);
  background: var(--surface2); color: var(--lime); outline: none;
}

/* ── Cat group ── */
.cat-group { margin-bottom: 2px; }
.cat-header {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 10px 5px;
  font-family: var(--font-mono); font-size: 10px; font-weight: 500;
  color: var(--ink3); text-transform: uppercase; letter-spacing: .08em;
  border-bottom: 1px solid var(--border);
}
.cat-block { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-lg); overflow: hidden; margin-bottom: 6px; }

/* ── Pedido card ── */
.ped-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--r-lg); padding: 12px; margin-bottom: 6px;
}
.ped-card:hover { border-color: var(--border2); }
.ped-nombre {
  font-size: 14px; font-weight: 600; margin-bottom: 6px;
  display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
}
.ped-meta {
  font-size: 12px; color: var(--ink2); line-height: 1.7; margin-bottom: 10px;
  font-family: var(--font-mono);
}
.ped-meta b { color: var(--ink3); font-weight: 500; }

/* ── KPI strip ── */
.kpi-strip { display: grid; grid-template-columns: repeat(4,1fr); gap: 6px; margin-bottom: 16px; }
.kpi-box {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--r-lg); padding: 10px 8px; text-align: center;
}
.kpi-box.danger { border-color: rgba(255,68,68,.3); background: var(--red-bg); }
.kpi-n { font-family: var(--font-mono); font-size: 24px; font-weight: 500; color: var(--ink); line-height: 1; }
.kpi-box.danger .kpi-n { color: var(--red); }
.kpi-l { font-size: 9px; color: var(--ink3); text-transform: uppercase; letter-spacing: .06em; margin-top: 3px; font-family: var(--font-mono); }

/* ── Section label ── */
.sec-label {
  font-family: var(--font-mono); font-size: 10px; font-weight: 500;
  color: var(--ink3); text-transform: uppercase; letter-spacing: .08em;
  margin: 16px 0 6px; padding-bottom: 5px;
  border-bottom: 1px solid var(--border);
}
.sec-label:first-child { margin-top: 0; }

/* ── Page title ── */
.page-title { font-size: 20px; font-weight: 700; margin-bottom: 16px; letter-spacing: -.3px; }

/* ── Empty ── */
.empty {
  text-align: center; padding: 40px 20px;
  font-family: var(--font-mono); font-size: 12px; color: var(--ink3);
}

/* ── Modal ── */
.overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.7);
  backdrop-filter: blur(4px);
  z-index: 500; display: flex; align-items: center; justify-content: center; padding: 20px;
}
.modal {
  background: var(--surface); border: 1px solid var(--border2);
  border-radius: 14px; padding: 20px;
  width: 100%; max-width: 420px; max-height: 90vh; overflow-y: auto;
}
.modal-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.modal-title { font-size: 15px; font-weight: 700; }
.modal-x {
  background: var(--surface2); border: 1px solid var(--border);
  border-radius: var(--r-sm); width: 28px; height: 28px;
  font-size: 13px; cursor: pointer; color: var(--ink2);
  display: flex; align-items: center; justify-content: center;
  transition: .1s;
}
.modal-x:hover { color: var(--ink); }
.det-row {
  display: flex; justify-content: space-between; align-items: flex-start;
  padding: 8px 0; border-bottom: 1px solid var(--border);
}
.det-row:last-child { border-bottom: none; }
.det-l { font-size: 11px; color: var(--ink3); font-family: var(--font-mono); text-transform: uppercase; letter-spacing: .06em; }
.det-v { font-size: 13px; font-weight: 500; text-align: right; max-width: 65%; }
