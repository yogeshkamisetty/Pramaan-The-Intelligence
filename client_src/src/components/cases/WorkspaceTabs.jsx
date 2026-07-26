import React, { useState } from 'react';
import { Plus, Trash2, Upload, MapPin, Download, Save } from 'lucide-react';

export function OverviewTab({ caseData }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 rounded-lg bg-pramaan-elevated border border-pramaan-border font-mono text-xs">
        <div>
          <span className="text-pramaan-text-secondary block text-[10px]">FIR NUMBER:</span>
          <span className="text-pramaan-text font-bold">{caseData?.fir || 'Pending'}</span>
        </div>
        <div>
          <span className="text-pramaan-text-secondary block text-[10px]">STATION:</span>
          <span className="text-pramaan-text font-bold">{caseData?.station || 'Unknown'}</span>
        </div>
        <div>
          <span className="text-pramaan-text-secondary block text-[10px]">INVESTIGATION LEAD:</span>
          <span className="text-pramaan-text font-bold">{caseData?.lead || 'Unassigned'}</span>
        </div>
        <div>
          <span className="text-pramaan-text-secondary block text-[10px]">CRIME SEVERITY:</span>
          <span className="text-pramaan-critical font-bold capitalize">{caseData?.priority || 'Unknown'}</span>
        </div>
      </div>
      <div className="p-4 rounded-lg bg-pramaan-elevated border border-pramaan-border space-y-2">
        <span className="text-[10px] font-mono text-pramaan-secondary font-semibold uppercase tracking-wider">
          FIR Narrative:
        </span>
        <p className="text-pramaan-text font-kannada leading-relaxed text-xs">
          {caseData?.fullData?.narrative || 'No narrative provided.'}
        </p>
      </div>
    </div>
  );
}

export function ComplainantTab({ caseData }) {
  return (
    <div className="p-4 rounded-lg border border-pramaan-border bg-pramaan-elevated space-y-4">
      <h3 className="text-xs font-bold text-pramaan-text border-b border-pramaan-border pb-2">Complainant Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-mono text-pramaan-text-secondary uppercase">Full Name</label>
          <input type="text" defaultValue={caseData?.fullData?.complainantName} className="bg-pramaan-surface border border-pramaan-border rounded p-2 text-pramaan-text outline-none focus:border-pramaan-primary" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-mono text-pramaan-text-secondary uppercase">Mobile Number</label>
          <input type="text" defaultValue={caseData?.fullData?.complainantMobile} className="bg-pramaan-surface border border-pramaan-border rounded p-2 text-pramaan-text outline-none focus:border-pramaan-primary" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-mono text-pramaan-text-secondary uppercase">Aadhaar</label>
          <input type="text" placeholder="Enter Aadhaar" className="bg-pramaan-surface border border-pramaan-border rounded p-2 text-pramaan-text outline-none focus:border-pramaan-primary" />
        </div>
        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="text-[10px] font-mono text-pramaan-text-secondary uppercase">Address</label>
          <input type="text" placeholder="Enter full address" className="bg-pramaan-surface border border-pramaan-border rounded p-2 text-pramaan-text outline-none focus:border-pramaan-primary" />
        </div>
      </div>
      <div className="flex justify-end pt-2">
        <button className="px-3 py-1.5 bg-pramaan-surface border border-pramaan-border rounded text-xs font-bold text-pramaan-text hover:text-pramaan-primary transition-colors flex items-center gap-2 cursor-pointer">
          <Save size={14} /> Save Details
        </button>
      </div>
    </div>
  );
}

export function VictimsTab() {
  const [victims, setVictims] = useState([]);
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold text-pramaan-text">Victim Roster</h3>
        <button onClick={() => setVictims([...victims, {}])} className="text-[10px] font-bold text-pramaan-secondary hover:text-pramaan-primary flex items-center gap-1 uppercase tracking-wider cursor-pointer">
          <Plus size={12} /> Add Victim
        </button>
      </div>
      {victims.length === 0 ? (
        <div className="p-8 text-center text-xs text-pramaan-text-secondary bg-pramaan-elevated border border-pramaan-border rounded-lg border-dashed">No victims recorded yet.</div>
      ) : (
        victims.map((_, i) => (
          <div key={i} className="p-4 rounded-lg bg-pramaan-elevated border border-pramaan-border relative">
            <button onClick={() => setVictims(victims.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 text-pramaan-text-secondary hover:text-pramaan-critical cursor-pointer p-1"><Trash2 size={14}/></button>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-xs">
              <input placeholder="Name" className="bg-pramaan-surface border border-pramaan-border rounded p-2" />
              <input placeholder="Age" type="number" className="bg-pramaan-surface border border-pramaan-border rounded p-2" />
              <input placeholder="Mobile" className="bg-pramaan-surface border border-pramaan-border rounded p-2" />
              <input placeholder="Address" className="bg-pramaan-surface border border-pramaan-border rounded p-2" />
            </div>
            <input placeholder="Injury Details" className="w-full bg-pramaan-surface border border-pramaan-border rounded p-2 text-xs mb-3" />
            <div className="flex items-center justify-center p-3 rounded border border-dashed border-pramaan-border text-xs text-pramaan-text-secondary cursor-pointer hover:border-pramaan-primary">
              <Upload size={14} className="mr-2"/> Upload Medical Report
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export function SuspectsTab() {
  const [suspects, setSuspects] = useState([]);
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold text-pramaan-text">Suspects & Persons of Interest</h3>
        <button onClick={() => setSuspects([...suspects, {}])} className="text-[10px] font-bold text-pramaan-secondary hover:text-pramaan-primary flex items-center gap-1 uppercase tracking-wider cursor-pointer">
          <Plus size={12} /> Add Suspect
        </button>
      </div>
      {suspects.length === 0 ? (
        <div className="p-8 text-center text-xs text-pramaan-text-secondary bg-pramaan-elevated border border-pramaan-border rounded-lg border-dashed">Investigation active. No suspects added yet.</div>
      ) : (
        suspects.map((_, i) => (
          <div key={i} className="p-4 rounded-lg bg-pramaan-elevated border border-pramaan-border relative">
            <button onClick={() => setSuspects(suspects.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 text-pramaan-text-secondary hover:text-pramaan-critical cursor-pointer p-1"><Trash2 size={14}/></button>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-xs">
              <input placeholder="Name" className="bg-pramaan-surface border border-pramaan-border rounded p-2" />
              <input placeholder="Alias" className="bg-pramaan-surface border border-pramaan-border rounded p-2" />
              <input placeholder="Known Associates" className="bg-pramaan-surface border border-pramaan-border rounded p-2" />
              <input placeholder="Criminal History" className="bg-pramaan-surface border border-pramaan-border rounded p-2" />
            </div>
            <div className="flex items-center justify-center p-3 rounded border border-dashed border-pramaan-border text-xs text-pramaan-text-secondary cursor-pointer hover:border-pramaan-primary">
              <Upload size={14} className="mr-2"/> Upload Mugshot / Photo
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export function WitnessesTab() {
  const [witnesses, setWitnesses] = useState([]);
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold text-pramaan-text">Witness Statements</h3>
        <button onClick={() => setWitnesses([...witnesses, {}])} className="text-[10px] font-bold text-pramaan-secondary hover:text-pramaan-primary flex items-center gap-1 uppercase tracking-wider cursor-pointer">
          <Plus size={12} /> Add Witness
        </button>
      </div>
      {witnesses.length === 0 ? (
        <div className="p-8 text-center text-xs text-pramaan-text-secondary bg-pramaan-elevated border border-pramaan-border rounded-lg border-dashed">No witness statements recorded.</div>
      ) : (
        witnesses.map((_, i) => (
          <div key={i} className="p-4 rounded-lg bg-pramaan-elevated border border-pramaan-border relative">
            <button onClick={() => setWitnesses(witnesses.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 text-pramaan-text-secondary hover:text-pramaan-critical cursor-pointer p-1"><Trash2 size={14}/></button>
            <div className="grid grid-cols-3 gap-3 mb-3 text-xs">
              <input placeholder="Witness Name" className="bg-pramaan-surface border border-pramaan-border rounded p-2" />
              <input placeholder="Mobile" className="bg-pramaan-surface border border-pramaan-border rounded p-2" />
              <input placeholder="Address" className="bg-pramaan-surface border border-pramaan-border rounded p-2" />
            </div>
            <textarea placeholder="Statement..." className="w-full h-20 bg-pramaan-surface border border-pramaan-border rounded p-2 text-xs resize-y outline-none focus:border-pramaan-primary"></textarea>
          </div>
        ))
      )}
    </div>
  );
}

export function EvidenceTab() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold text-pramaan-text">Digital & Physical Evidence</h3>
        <button className="text-[10px] font-bold text-pramaan-secondary hover:text-pramaan-primary flex items-center gap-1 uppercase tracking-wider cursor-pointer">
          <Plus size={12} /> Log Evidence
        </button>
      </div>
      <div className="p-12 rounded-lg border-2 border-dashed border-pramaan-border bg-pramaan-elevated flex flex-col items-center justify-center hover:border-pramaan-primary transition-colors cursor-pointer group">
        <Upload size={24} className="text-pramaan-text-secondary group-hover:text-pramaan-primary mb-2 transition-colors" />
        <span className="text-sm font-bold text-pramaan-text mb-1">Upload Evidence Files</span>
        <span className="text-[10px] text-pramaan-text-secondary">Photos, CCTV, Documents, Fingerprints, Weapon Images</span>
      </div>
    </div>
  );
}

export function CrimeSceneTab() {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold text-pramaan-text">Crime Scene Investigation</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-8 rounded-lg border-2 border-dashed border-pramaan-border bg-pramaan-elevated flex flex-col items-center justify-center cursor-pointer hover:border-pramaan-primary">
           <Upload size={20} className="text-pramaan-text-secondary mb-2" />
           <span className="text-xs font-bold text-pramaan-text">Upload Scene Photos</span>
        </div>
        <div className="p-8 rounded-lg border-2 border-dashed border-pramaan-border bg-pramaan-elevated flex flex-col items-center justify-center cursor-pointer hover:border-pramaan-primary">
           <MapPin size={20} className="text-pramaan-text-secondary mb-2" />
           <span className="text-xs font-bold text-pramaan-text">Pin GPS Location</span>
        </div>
      </div>
    </div>
  );
}

export function TimelineTab({ caseData }) {
  const events = caseData?.fullData?.timeline || [];
  return (
    <div className="space-y-4 p-4 rounded-lg border border-pramaan-border bg-pramaan-elevated">
      <h3 className="text-xs font-bold text-pramaan-text border-b border-pramaan-border pb-2">Investigation Timeline</h3>
      <div className="space-y-6 py-4">
        {events.length === 0 && <p className="text-xs text-pramaan-text-secondary">No events recorded.</p>}
        {events.map((ev, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-pramaan-primary shrink-0" />
              {i !== events.length - 1 && <div className="w-px h-full bg-pramaan-border my-1" />}
            </div>
            <div className="pb-4">
              <p className="text-xs font-bold text-pramaan-text">{ev.event}</p>
              <p className="text-[10px] font-mono text-pramaan-text-secondary">{new Date(ev.timestamp).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function InvestigationNotesTab() {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold text-pramaan-text">Officer Notes (Internal)</h3>
        <span className="text-[10px] font-mono text-pramaan-text-secondary bg-pramaan-elevated px-2 py-0.5 rounded border border-pramaan-border">Visible to IO only</span>
      </div>
      <textarea 
        className="w-full h-40 bg-pramaan-elevated border border-pramaan-border rounded-lg p-3 text-xs text-pramaan-text outline-none focus:border-pramaan-primary resize-y"
        placeholder="Securely type your investigation notes here..."
      />
      <div className="flex justify-end">
        <button className="px-3 py-1.5 bg-pramaan-primary hover:bg-pramaan-primary-cyan rounded text-xs font-bold text-pramaan-bg transition-colors flex items-center gap-2 cursor-pointer">
          <Save size={14} /> Save Notes
        </button>
      </div>
    </div>
  );
}

export function AIAssistantTab({ caseData }) {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg border border-[#A98BD0]/30 bg-[#A98BD0]/5 shadow-[0_0_15px_rgba(169,139,208,0.1)]">
        <div className="flex items-center gap-2 mb-4 border-b border-[#A98BD0]/20 pb-3">
          <span className="w-2 h-2 rounded-full bg-[#A98BD0] animate-pulse" />
          <h4 className="text-xs font-bold text-[#A98BD0] tracking-widest uppercase">Pramaan Intelligence Engine</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-1">
            <span className="block text-[10px] text-pramaan-text-secondary font-mono uppercase">Case Summary</span>
            <p className="text-pramaan-text leading-relaxed">
              Based on the FIR narrative, this is a {caseData?.priority} priority {caseData?.fullData?.category || 'incident'}.
            </p>
          </div>
          <div className="space-y-1">
            <span className="block text-[10px] text-pramaan-text-secondary font-mono uppercase">Investigation Suggestions</span>
            <ul className="list-disc pl-4 text-pramaan-text space-y-1 text-pramaan-secondary">
              <li>Scan local CCTV within 1km radius of {caseData?.fullData?.location || 'scene'}.</li>
              <li>Check known repeat offenders for {caseData?.fullData?.category || 'this crime'}.</li>
              <li>Verify phone dumps around {caseData?.fullData?.incidentTime || 'the incident time'}.</li>
            </ul>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-[#A98BD0]/20 text-xs">
          <div>
             <span className="block text-[10px] text-pramaan-text-secondary font-mono uppercase mb-1">Predicted Modus Operandi</span>
             <span className="text-pramaan-text font-bold">Standard Break-in</span>
          </div>
          <div>
             <span className="block text-[10px] text-pramaan-text-secondary font-mono uppercase mb-1">Similar Historical Cases</span>
             <span className="text-pramaan-primary font-bold">3 Cases Found</span>
          </div>
          <div>
             <span className="block text-[10px] text-pramaan-text-secondary font-mono uppercase mb-1">Risk Score</span>
             <span className="text-pramaan-critical font-bold text-lg">82<span className="text-[10px]">/100</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
