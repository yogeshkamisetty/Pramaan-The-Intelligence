import React, { useState } from 'react';
import { useForm, useFieldArray, FormProvider, useFormContext } from 'react-hook-form';
import { X, Save, Plus, Trash2, MapPin, Wand2, CheckCircle2, ChevronRight, Upload, AlertCircle } from 'lucide-react';
import { cases } from '../../data/mock.js';

const SECTIONS = [
  'Basic Information',
  'Location',
  'Incident Details',
  'Investigation',
  'Complainant',
  'Victims',
  'Suspects',
  'Witnesses',
  'Evidence',
  'Crime Description',
  'AI Summary',
  'Tags & Attachments'
];

export function NewCaseRegistration({ isOpen, onClose, onCaseRegistered }) {
  const [activeSection, setActiveSection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const methods = useForm({
    defaultValues: {
      title: '',
      category: '',
      sub_category: '',
      severity: 'Medium',
      status: 'Active',
      state: 'Karnataka',
      district: 'Bengaluru',
      station: 'STATION-BGLR-CENTRAL',
      address: '',
      pincode: '',
      latitude: '',
      longitude: '',
      incident_date: '',
      incident_time: '',
      io_name: 'SI Kavya Rao',
      io_rank: 'Sub-Inspector',
      io_badge: 'BGLR-492',
      io_unit: 'Central Crime Branch',
      io_supervisor: 'ACP Ramesh Bhat',
      complainant: { name: '', mobile: '', email: '', address: '', aadhaar: '', gender: '', age: '' },
      victims: [],
      suspects: [],
      witnesses: [],
      evidence: [],
      crime_description_en: '',
      crime_description_kn: '',
      ai_summary: { incident_summary: '', crime_type: '', modus_operandi: '', keywords: [], investigation_suggestions: [], risk_score: 0 },
      tags: [],
      attachments: []
    }
  });

  const { handleSubmit, reset, getValues, setValue, watch, control } = methods;

  const handleGenerateAI = async () => {
    const narrative = getValues('crime_description_en');
    if (!narrative || narrative.length < 10) {
      alert("Please enter a detailed Crime Description first.");
      return;
    }
    
    setIsAiGenerating(true);
    try {
      // Get base URL for dynamic routing in case we run on a different port/host
      const baseUrl = window.location.origin;
      const res = await fetch(`${baseUrl}/server/case_fn/generate-summary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ narrative })
      });
      
      if (!res.ok) throw new Error("AI Generation failed");
      const data = await res.json();
      setValue('ai_summary', data.data, { shouldDirty: true });
      setActiveSection(SECTIONS.indexOf('AI Summary'));
    } catch (err) {
      console.error(err);
      alert("Failed to generate AI summary. Ensure backend is running and Gemini API key is configured.");
    } finally {
      setIsAiGenerating(false);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const baseUrl = window.location.origin;
      const res = await fetch(`${baseUrl}/server/case_fn/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!res.ok) throw new Error("Registration failed");
      const responseData = await res.json();
      
      setSuccessData(responseData);
      setShowSuccess(true);
      
      const newCase = responseData.data.case;
      cases.unshift(newCase);
      
      if (onCaseRegistered) {
        onCaseRegistered(newCase);
      }
    } catch (err) {
      console.error(err);
      alert("Registration failed. Please check the network console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setShowSuccess(false);
    setActiveSection(0);
    onClose();
  };

  if (!isOpen) return null;

  if (showSuccess && successData) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-pramaan-surface p-8 rounded-xl border border-pramaan-border max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-pramaan-success/20 rounded-full flex items-center justify-center">
              <CheckCircle2 size={32} className="text-pramaan-success" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-pramaan-text">Case Registered Successfully</h2>
            <p className="text-xs text-pramaan-text-secondary mt-2">The case has been added to the Case Register and AI Indexing is complete.</p>
          </div>
          <div className="bg-pramaan-elevated rounded-lg p-4 text-left space-y-2 border border-pramaan-border">
            <div className="flex justify-between">
              <span className="text-xs text-pramaan-text-secondary">Case ID:</span>
              <span className="text-xs font-mono font-bold text-pramaan-primary">{successData.case_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-pramaan-text-secondary">FIR Number:</span>
              <span className="text-xs font-mono font-bold text-pramaan-text">{successData.fir_no}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-pramaan-text-secondary">Officer:</span>
              <span className="text-xs font-mono font-bold text-pramaan-text">{successData.data.case.io_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-pramaan-text-secondary">AI Status:</span>
              <span className="text-xs font-mono font-bold text-pramaan-success">Indexed</span>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-full py-3 bg-pramaan-primary hover:bg-pramaan-primary-cyan text-pramaan-bg font-bold rounded-lg transition-colors cursor-pointer"
          >
            Open Case Workspace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-6xl bg-pramaan-surface h-full shadow-2xl flex flex-col border-l border-pramaan-border animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-pramaan-border flex items-center justify-between bg-pramaan-elevated/50 sticky top-0 z-20">
          <div>
            <h2 className="text-lg font-bold text-pramaan-text flex items-center gap-3">
              <span className="bg-pramaan-primary text-pramaan-bg px-2 py-0.5 rounded text-xs">NEW</span>
              Comprehensive Case Registration
            </h2>
            <p className="text-[11px] text-pramaan-text-secondary font-mono mt-1">FIR-AUTO • Create empty Dossier & Enable Twin Analysis</p>
          </div>
          <button onClick={onClose} className="p-2 text-pramaan-text-secondary hover:text-pramaan-text cursor-pointer transition-colors rounded-lg hover:bg-pramaan-elevated">
            <X size={20} />
          </button>
        </div>

        <FormProvider {...methods}>
          <form id="massive-case-form" onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-hidden flex">
            
            {/* Left Sidebar Navigation */}
            <div className="w-64 bg-pramaan-elevated/30 border-r border-pramaan-border flex flex-col overflow-y-auto">
              <div className="p-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-pramaan-text-secondary">Registration Steps</span>
              </div>
              <div className="flex-1 flex flex-col px-3 pb-4 space-y-1">
                {SECTIONS.map((sec, idx) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setActiveSection(idx)}
                    className={`text-left px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between group cursor-pointer ${
                      activeSection === idx
                        ? 'bg-pramaan-primary/10 text-pramaan-primary'
                        : 'text-pramaan-text-secondary hover:bg-pramaan-surface hover:text-pramaan-text'
                    }`}
                  >
                    <span>{idx + 1}. {sec}</span>
                    <ChevronRight size={14} className={`opacity-0 group-hover:opacity-100 transition-opacity ${activeSection === idx ? 'opacity-100 text-pramaan-primary' : ''}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Main Form Area */}
            <div className="flex-1 bg-pramaan-surface overflow-y-auto p-8 custom-scrollbar">
              <div className="max-w-3xl space-y-8 pb-20">
                {activeSection === 0 && <BasicInformationSection />}
                {activeSection === 1 && <LocationSection />}
                {activeSection === 2 && <IncidentDetailsSection />}
                {activeSection === 3 && <InvestigationSection />}
                {activeSection === 4 && <ComplainantSection />}
                {activeSection === 5 && <VictimsSection />}
                {activeSection === 6 && <SuspectsSection />}
                {activeSection === 7 && <WitnessesSection />}
                {activeSection === 8 && <EvidenceSection />}
                {activeSection === 9 && <CrimeDescriptionSection onGenerateAI={handleGenerateAI} isGenerating={isAiGenerating} />}
                {activeSection === 10 && <AISummarySection />}
                {activeSection === 11 && <TagsAttachmentsSection />}

                {/* Next/Prev Navigation */}
                <div className="flex items-center justify-between pt-8 border-t border-pramaan-border mt-12">
                  <button
                    type="button"
                    onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
                    disabled={activeSection === 0}
                    className="px-4 py-2 text-xs font-bold text-pramaan-text-secondary hover:text-pramaan-text bg-pramaan-elevated border border-pramaan-border rounded-lg disabled:opacity-30 cursor-pointer"
                  >
                    Previous Step
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSection(Math.min(SECTIONS.length - 1, activeSection + 1))}
                    disabled={activeSection === SECTIONS.length - 1}
                    className="px-4 py-2 text-xs font-bold text-pramaan-text bg-pramaan-elevated border border-pramaan-border hover:border-pramaan-primary rounded-lg transition-colors disabled:opacity-30 cursor-pointer"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            </div>

          </form>
        </FormProvider>

        {/* Footer Actions */}
        <div className="p-4 border-t border-pramaan-border bg-pramaan-elevated/80 backdrop-blur flex items-center justify-between sticky bottom-0 z-20">
          <div className="flex items-center gap-2 text-[10px] text-pramaan-text-secondary font-mono">
            <AlertCircle size={12} /> Fields marked * are required
          </div>
          <div className="flex items-center gap-3">
            <button 
              type="button"
              className="px-4 py-2 text-xs font-bold text-pramaan-text-secondary hover:text-pramaan-text bg-transparent transition-colors cursor-pointer"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button 
              type="button"
              className="px-4 py-2 text-xs font-bold text-pramaan-secondary hover:text-pramaan-text bg-pramaan-surface border border-pramaan-border rounded-lg transition-colors cursor-pointer"
            >
              Save Draft
            </button>
            <button 
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="px-6 py-2 text-xs font-bold text-pramaan-bg bg-pramaan-primary hover:bg-pramaan-primary-cyan rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-[0_0_15px_rgba(0,194,255,0.3)]"
            >
              {isSubmitting ? 'Registering System...' : <><Save size={14} /> Register Case</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Sub-components for each section to keep code modular
// ----------------------------------------------------------------------

const Input = ({ label, name, required, type="text", placeholder }) => {
  const { register, formState: { errors } } = useFormContext();
  // Name might be nested like 'victims.0.name'
  const errorObj = name.split('.').reduce((acc, part) => acc && acc[part], errors);
  
  return (
    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
      <label className="text-[10px] font-mono font-semibold uppercase text-pramaan-text-secondary">
        {label} {required && <span className="text-pramaan-critical">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        {...register(name, { required })}
        className="bg-pramaan-elevated border border-pramaan-border rounded-lg px-3 py-2 text-xs text-pramaan-text outline-none focus:border-pramaan-primary transition-colors"
      />
      {errorObj && <span className="text-[9px] text-pramaan-critical">Required</span>}
    </div>
  );
};

const Select = ({ label, name, options, required }) => {
  const { register, formState: { errors } } = useFormContext();
  const errorObj = name.split('.').reduce((acc, part) => acc && acc[part], errors);
  return (
    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
      <label className="text-[10px] font-mono font-semibold uppercase text-pramaan-text-secondary">
        {label} {required && <span className="text-pramaan-critical">*</span>}
      </label>
      <select
        {...register(name, { required })}
        className="bg-pramaan-elevated border border-pramaan-border rounded-lg px-3 py-2 text-xs text-pramaan-text outline-none focus:border-pramaan-primary transition-colors appearance-none"
      >
        <option value="">Select...</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      {errorObj && <span className="text-[9px] text-pramaan-critical">Required</span>}
    </div>
  );
};

const Textarea = ({ label, name, required, placeholder, rows=4 }) => {
  const { register, formState: { errors } } = useFormContext();
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-[10px] font-mono font-semibold uppercase text-pramaan-text-secondary">
        {label} {required && <span className="text-pramaan-critical">*</span>}
      </label>
      <textarea
        rows={rows}
        placeholder={placeholder}
        {...register(name, { required })}
        className="w-full bg-pramaan-elevated border border-pramaan-border rounded-lg p-3 text-xs text-pramaan-text outline-none focus:border-pramaan-primary transition-colors resize-y custom-scrollbar"
      />
      {errors[name] && <span className="text-[9px] text-pramaan-critical">Required</span>}
    </div>
  );
};

// 1. Basic Information
const BasicInformationSection = () => (
  <div className="space-y-5 animate-in fade-in">
    <h3 className="text-sm font-bold text-pramaan-text border-b border-pramaan-border pb-2">1. Basic Information</h3>
    <Input label="Case Title" name="title" required placeholder="E.g., Rear window burglary using crowbar" />
    <div className="grid grid-cols-2 gap-4">
      <Select label="Crime Category" name="category" required options={['Burglary', 'Theft', 'Assault', 'Robbery', 'Cyber Crime', 'Missing Person', 'Murder', 'Fraud', 'Others']} />
      <Input label="Sub Category" name="sub_category" placeholder="E.g., Night-time residential" />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <Select label="Crime Severity" name="severity" required options={['Low', 'Medium', 'High', 'Critical']} />
      <Select label="Current Status" name="status" required options={['Active', 'Review', 'Escalated', 'Closed']} />
    </div>
  </div>
);

// 2. Location
const LocationSection = () => (
  <div className="space-y-5 animate-in fade-in">
    <h3 className="text-sm font-bold text-pramaan-text border-b border-pramaan-border pb-2">2. Location</h3>
    <div className="grid grid-cols-2 gap-4">
      <Select label="State" name="state" required options={['Karnataka', 'Maharashtra', 'Tamil Nadu']} />
      <Select label="District" name="district" required options={['Bengaluru', 'Mysuru', 'Mangaluru', 'Tumakuru']} />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <Select label="Police Station" name="station" required options={['STATION-BGLR-CENTRAL', 'STATION-BGLR-NORTH', 'STATION-BGLR-SOUTH', 'STATION-MYS-CENTRAL', 'STATION-JAYANAGAR-CYBER']} />
      <Input label="Pincode" name="pincode" />
    </div>
    <Textarea label="Address / Landmark" name="address" required rows={2} />
    
    <div className="mt-4">
      <label className="text-[10px] font-mono font-semibold uppercase text-pramaan-text-secondary mb-2 block">Interactive Map Location</label>
      <div className="w-full h-48 bg-pramaan-elevated border border-pramaan-border rounded-lg flex flex-col items-center justify-center text-pramaan-text-secondary">
        <MapPin size={24} className="mb-2 text-pramaan-primary" />
        <span className="text-xs">Map Integration (React-Leaflet)</span>
        <span className="text-[10px] font-mono mt-1">Click to drop pin</span>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-3">
        <Input label="Latitude" name="latitude" type="number" />
        <Input label="Longitude" name="longitude" type="number" />
      </div>
    </div>
  </div>
);

// 3. Incident Details
const IncidentDetailsSection = () => (
  <div className="space-y-5 animate-in fade-in">
    <h3 className="text-sm font-bold text-pramaan-text border-b border-pramaan-border pb-2">3. Incident Details</h3>
    <div className="grid grid-cols-2 gap-4">
      <Input label="Date of Incident" name="incident_date" type="date" required />
      <Input label="Time of Incident" name="incident_time" type="time" required />
    </div>
    <div className="p-4 bg-pramaan-primary/5 border border-pramaan-primary/20 rounded-lg">
      <p className="text-xs text-pramaan-text-secondary">
        <span className="font-bold text-pramaan-text">Note:</span> Reported Date and FIR Registered Date will be automatically stamped at the time of submission.
      </p>
    </div>
  </div>
);

// 4. Investigation
const InvestigationSection = () => (
  <div className="space-y-5 animate-in fade-in">
    <h3 className="text-sm font-bold text-pramaan-text border-b border-pramaan-border pb-2">4. Investigation Details</h3>
    <div className="grid grid-cols-2 gap-4">
      <Input label="Investigation Officer (IO)" name="io_name" required />
      <Input label="Rank" name="io_rank" />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <Input label="Badge Number" name="io_badge" />
      <Input label="Assigned Unit" name="io_unit" />
    </div>
    <Input label="Supervisor" name="io_supervisor" />
  </div>
);

// 5. Complainant
const ComplainantSection = () => (
  <div className="space-y-5 animate-in fade-in">
    <h3 className="text-sm font-bold text-pramaan-text border-b border-pramaan-border pb-2">5. Complainant Details</h3>
    <div className="grid grid-cols-2 gap-4">
      <Input label="Full Name" name="complainant.name" required />
      <Input label="Aadhaar / Gov ID" name="complainant.aadhaar" />
    </div>
    <div className="grid grid-cols-3 gap-4">
      <Input label="Age" name="complainant.age" type="number" />
      <Select label="Gender" name="complainant.gender" options={['Male', 'Female', 'Other']} />
      <Input label="Mobile Number" name="complainant.mobile" required />
    </div>
    <Input label="Email Address" name="complainant.email" type="email" />
    <Textarea label="Address" name="complainant.address" rows={2} />
  </div>
);

// 6. Victims (Dynamic)
const VictimsSection = () => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: 'victims' });
  return (
    <div className="space-y-5 animate-in fade-in">
      <div className="flex items-center justify-between border-b border-pramaan-border pb-2">
        <h3 className="text-sm font-bold text-pramaan-text">6. Victim Details</h3>
        <button type="button" onClick={() => append({ name: '', age: '', gender: '', mobile: '', address: '', injuries: '' })} className="text-xs font-bold text-pramaan-primary hover:text-pramaan-primary-cyan flex items-center gap-1 cursor-pointer bg-pramaan-primary/10 px-2 py-1 rounded">
          <Plus size={14} /> Add Victim
        </button>
      </div>
      {fields.length === 0 && <p className="text-xs text-pramaan-text-secondary italic">No victims added.</p>}
      {fields.map((item, index) => (
        <div key={item.id} className="p-4 bg-pramaan-elevated border border-pramaan-border rounded-lg space-y-4 relative">
          <button type="button" onClick={() => remove(index)} className="absolute top-3 right-3 text-pramaan-critical hover:text-red-400 p-1 cursor-pointer">
            <Trash2 size={16} />
          </button>
          <h4 className="text-xs font-bold text-pramaan-secondary">Victim {index + 1}</h4>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Name" name={`victims.${index}.name`} required />
            <Input label="Mobile" name={`victims.${index}.mobile`} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Age" name={`victims.${index}.age`} type="number" />
            <Select label="Gender" name={`victims.${index}.gender`} options={['Male', 'Female', 'Other']} />
          </div>
          <Input label="Injuries / Status" name={`victims.${index}.injuries`} />
        </div>
      ))}
    </div>
  );
};

// 7. Suspects (Dynamic)
const SuspectsSection = () => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: 'suspects' });
  return (
    <div className="space-y-5 animate-in fade-in">
      <div className="flex items-center justify-between border-b border-pramaan-border pb-2">
        <h3 className="text-sm font-bold text-pramaan-text">7. Suspect Details</h3>
        <button type="button" onClick={() => append({ name: '', alias: '', age: '', gender: '', mobile: '', address: '', known_associates: '', identification_marks: '' })} className="text-xs font-bold text-pramaan-warning hover:text-yellow-400 flex items-center gap-1 cursor-pointer bg-pramaan-warning/10 px-2 py-1 rounded">
          <Plus size={14} /> Add Suspect
        </button>
      </div>
      {fields.length === 0 && <p className="text-xs text-pramaan-text-secondary italic">No suspects added.</p>}
      {fields.map((item, index) => (
        <div key={item.id} className="p-4 bg-pramaan-elevated border border-pramaan-border rounded-lg space-y-4 relative border-l-2 border-l-pramaan-warning">
          <button type="button" onClick={() => remove(index)} className="absolute top-3 right-3 text-pramaan-critical hover:text-red-400 p-1 cursor-pointer">
            <Trash2 size={16} />
          </button>
          <h4 className="text-xs font-bold text-pramaan-warning">Suspect {index + 1}</h4>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Name" name={`suspects.${index}.name`} required />
            <Input label="Alias / Nickname" name={`suspects.${index}.alias`} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Age" name={`suspects.${index}.age`} type="number" />
            <Select label="Gender" name={`suspects.${index}.gender`} options={['Male', 'Female', 'Other']} />
            <Input label="Mobile" name={`suspects.${index}.mobile`} />
          </div>
          <Input label="Identification Marks" name={`suspects.${index}.identification_marks`} />
          <Textarea label="Known Associates & Previous Records" name={`suspects.${index}.known_associates`} rows={2} />
        </div>
      ))}
    </div>
  );
};

// 8. Witnesses (Dynamic)
const WitnessesSection = () => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: 'witnesses' });
  return (
    <div className="space-y-5 animate-in fade-in">
      <div className="flex items-center justify-between border-b border-pramaan-border pb-2">
        <h3 className="text-sm font-bold text-pramaan-text">8. Witnesses</h3>
        <button type="button" onClick={() => append({ name: '', mobile: '', address: '', statement: '' })} className="text-xs font-bold text-pramaan-success hover:text-green-400 flex items-center gap-1 cursor-pointer bg-pramaan-success/10 px-2 py-1 rounded">
          <Plus size={14} /> Add Witness
        </button>
      </div>
      {fields.length === 0 && <p className="text-xs text-pramaan-text-secondary italic">No witnesses added.</p>}
      {fields.map((item, index) => (
        <div key={item.id} className="p-4 bg-pramaan-elevated border border-pramaan-border rounded-lg space-y-4 relative border-l-2 border-l-pramaan-success">
          <button type="button" onClick={() => remove(index)} className="absolute top-3 right-3 text-pramaan-critical hover:text-red-400 p-1 cursor-pointer">
            <Trash2 size={16} />
          </button>
          <h4 className="text-xs font-bold text-pramaan-success">Witness {index + 1}</h4>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Name" name={`witnesses.${index}.name`} required />
            <Input label="Mobile" name={`witnesses.${index}.mobile`} />
          </div>
          <Textarea label="Statement Summary" name={`witnesses.${index}.statement`} rows={2} />
        </div>
      ))}
    </div>
  );
};

// 9. Evidence (Dynamic)
const EvidenceSection = () => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: 'evidence' });
  return (
    <div className="space-y-5 animate-in fade-in">
      <div className="flex items-center justify-between border-b border-pramaan-border pb-2">
        <h3 className="text-sm font-bold text-pramaan-text">9. Evidence Collection</h3>
        <button type="button" onClick={() => append({ type: '', description: '', collected_by: '' })} className="text-xs font-bold text-pramaan-secondary hover:text-purple-400 flex items-center gap-1 cursor-pointer bg-pramaan-secondary/10 px-2 py-1 rounded">
          <Plus size={14} /> Add Evidence
        </button>
      </div>
      {fields.length === 0 && <p className="text-xs text-pramaan-text-secondary italic">No evidence logged yet.</p>}
      {fields.map((item, index) => (
        <div key={item.id} className="p-4 bg-pramaan-elevated border border-pramaan-border rounded-lg space-y-4 relative">
          <button type="button" onClick={() => remove(index)} className="absolute top-3 right-3 text-pramaan-critical hover:text-red-400 p-1 cursor-pointer">
            <Trash2 size={16} />
          </button>
          <div className="grid grid-cols-2 gap-4 mr-6">
            <Select label="Evidence Type" name={`evidence.${index}.type`} options={['Physical', 'Digital', 'Documentary', 'Biological', 'Other']} required />
            <Input label="Collected By" name={`evidence.${index}.collected_by`} />
          </div>
          <Textarea label="Description" name={`evidence.${index}.description`} rows={2} required />
        </div>
      ))}
    </div>
  );
};

// 10. Crime Description
const CrimeDescriptionSection = ({ onGenerateAI, isGenerating }) => (
  <div className="space-y-5 animate-in fade-in">
    <div className="flex items-center justify-between border-b border-pramaan-border pb-2">
      <h3 className="text-sm font-bold text-pramaan-text">10. Crime Description (FIR Narrative)</h3>
      <button 
        type="button" 
        onClick={onGenerateAI} 
        disabled={isGenerating}
        className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-900/50 disabled:opacity-50 cursor-pointer transition-all"
      >
        <Wand2 size={14} />
        {isGenerating ? 'AI is Analyzing...' : 'Generate AI Summary'}
      </button>
    </div>
    
    <div className="bg-pramaan-elevated p-1 rounded-lg border border-pramaan-border">
      <div className="border-b border-pramaan-border px-3 py-2 bg-pramaan-surface rounded-t-lg flex items-center gap-2">
        <span className="text-[10px] font-mono font-bold text-pramaan-text-secondary uppercase">Rich Text Editor (English)</span>
      </div>
      <Textarea label="" name="crime_description_en" rows={8} placeholder="Enter full detailed FIR narrative here..." required />
    </div>
    
    <div className="bg-pramaan-elevated p-1 rounded-lg border border-pramaan-border opacity-70">
      <div className="border-b border-pramaan-border px-3 py-2 bg-pramaan-surface rounded-t-lg flex items-center gap-2">
        <span className="text-[10px] font-mono font-bold text-pramaan-text-secondary uppercase">Translation (Kannada)</span>
      </div>
      <Textarea label="" name="crime_description_kn" rows={6} placeholder="ಕನ್ನಡ ಅನುವಾದ ಇಲ್ಲಿ (Optional)" />
    </div>
  </div>
);

// 11. AI Summary
const AISummarySection = () => {
  const { watch } = useFormContext();
  const aiData = watch('ai_summary');

  if (!aiData || !aiData.incident_summary) {
    return (
      <div className="space-y-5 animate-in fade-in">
        <h3 className="text-sm font-bold text-pramaan-text border-b border-pramaan-border pb-2">11. AI Generated Insights</h3>
        <div className="p-8 text-center border border-dashed border-pramaan-border rounded-xl bg-pramaan-elevated/50 flex flex-col items-center justify-center space-y-3">
          <Wand2 size={32} className="text-pramaan-text-secondary opacity-50" />
          <p className="text-xs text-pramaan-text-secondary">AI Insights have not been generated yet.</p>
          <p className="text-[10px] font-mono text-pramaan-text-secondary/70">Go to step 10 to input the narrative and click Generate.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in">
      <h3 className="text-sm font-bold text-pramaan-text border-b border-pramaan-border pb-2 flex items-center gap-2">
        <Wand2 size={16} className="text-purple-400" />
        11. AI Generated Insights
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-pramaan-elevated p-4 rounded-xl border border-pramaan-border space-y-2">
          <span className="text-[10px] font-mono font-bold text-pramaan-secondary uppercase">Incident Summary</span>
          <p className="text-xs text-pramaan-text leading-relaxed">{aiData.incident_summary}</p>
        </div>
        
        <div className="space-y-4">
          <div className="bg-pramaan-elevated p-4 rounded-xl border border-pramaan-border flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-pramaan-secondary uppercase">Crime Type</span>
            <span className="text-xs font-bold text-pramaan-primary bg-pramaan-primary/10 px-2 py-1 rounded">{aiData.crime_type}</span>
          </div>
          
          <div className="bg-pramaan-elevated p-4 rounded-xl border border-pramaan-border flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-pramaan-secondary uppercase">Risk Score</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-pramaan-surface rounded-full overflow-hidden">
                <div className={`h-full ${aiData.risk_score > 70 ? 'bg-pramaan-critical' : aiData.risk_score > 40 ? 'bg-pramaan-warning' : 'bg-pramaan-success'}`} style={{ width: `${aiData.risk_score}%` }}></div>
              </div>
              <span className="text-xs font-bold text-pramaan-text font-mono">{aiData.risk_score}/100</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-pramaan-elevated p-4 rounded-xl border border-pramaan-border space-y-2">
        <span className="text-[10px] font-mono font-bold text-pramaan-secondary uppercase">Detected Modus Operandi (MO)</span>
        <p className="text-xs text-pramaan-text">{aiData.modus_operandi}</p>
      </div>

      <div className="bg-pramaan-elevated p-4 rounded-xl border border-pramaan-border space-y-3">
        <span className="text-[10px] font-mono font-bold text-pramaan-secondary uppercase">Investigation Suggestions</span>
        <ul className="list-disc list-inside text-xs text-pramaan-text-secondary space-y-1">
          {aiData.investigation_suggestions?.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>

      <div className="bg-pramaan-elevated p-4 rounded-xl border border-pramaan-border space-y-2">
        <span className="text-[10px] font-mono font-bold text-pramaan-secondary uppercase">Extracted Keywords / Entities</span>
        <div className="flex flex-wrap gap-2 mt-2">
          {aiData.keywords?.map((k, i) => (
            <span key={i} className="px-2 py-1 bg-pramaan-surface border border-pramaan-border rounded text-[10px] font-mono text-pramaan-text">
              {k}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// 12. Tags & Attachments
const TagsAttachmentsSection = () => (
  <div className="space-y-6 animate-in fade-in">
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-pramaan-text border-b border-pramaan-border pb-2">12. Classification Tags</h3>
      <Input label="Add Tags (comma separated)" name="tags" placeholder="E.g., Night Crime, Repeat Offender, Cyber Fraud" />
    </div>
    
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-pramaan-text border-b border-pramaan-border pb-2">File Attachments</h3>
      <div className="w-full h-32 border-2 border-dashed border-pramaan-border rounded-xl bg-pramaan-elevated/30 hover:bg-pramaan-elevated/60 transition-colors flex flex-col items-center justify-center cursor-pointer">
        <Upload size={24} className="text-pramaan-text-secondary mb-2" />
        <span className="text-xs font-bold text-pramaan-text">Click or drag files to upload</span>
        <span className="text-[10px] font-mono text-pramaan-text-secondary mt-1">Images, Videos, PDFs, Audio</span>
      </div>
    </div>
  </div>
);
