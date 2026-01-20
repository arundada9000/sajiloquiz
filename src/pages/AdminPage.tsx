import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Download, Upload, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { useData, Question, AppConfig, Round } from '../context/DataContext';

export default function AdminPage() {
    const { appConfig, allQuestions, updateConfig, addQuestion, editQuestion, deleteQuestion, resetData, importData } = useData();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'questions' | 'data' | 'help'>('questions');

    // --- Local State for Forms ---
    // We bind forms directly to config updates or keep local buffer if validaton needed
    // For simplicity in this v1, we will update directly or use simple local state for questions

    return (
        <div className="min-h-screen p-4 md:p-8 text-white pb-32">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <ArrowLeft />
                        </Link>
                        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => navigate('/')} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-bold">
                            Launch Quiz
                        </button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                    {/* Sidebar / Mobile Tabs */}
                    <div className="w-full md:w-64 shrink-0 overflow-x-auto pb-2 md:pb-0 md:sticky md:top-8 md:self-start">
                        <div className="flex md:flex-col gap-2 min-w-max">
                            <TabButton id="questions" label="Questions" active={activeTab} onClick={setActiveTab} />
                            <TabButton id="general" label="Settings" active={activeTab} onClick={setActiveTab} />
                            <TabButton id="appearance" label="Appearance" active={activeTab} onClick={setActiveTab} />
                            <TabButton id="data" label="Backup" active={activeTab} onClick={setActiveTab} />
                            <TabButton id="help" label="Help" active={activeTab} onClick={setActiveTab} />
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 glass-panel p-4 md:p-8 min-h-[500px]">
                        {activeTab === 'general' && <GeneralSettings tabConfig={appConfig} onUpdate={updateConfig} />}
                        {activeTab === 'appearance' && <AppearanceSettings tabConfig={appConfig} onUpdate={updateConfig} />}
                        {activeTab === 'questions' && <QuestionManager questions={allQuestions} rounds={appConfig.rounds} enableRounds={appConfig.enableRounds} onAdd={addQuestion} onEdit={editQuestion} onDelete={deleteQuestion} />}
                        {activeTab === 'data' && <DataActions onReset={resetData} onImport={importData} config={appConfig} questions={allQuestions} />}
                        {activeTab === 'help' && <HelpGuide />}
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Sub-Components ---

function TabButton({ id, label, active, onClick }: { id: any, label: string, active: string, onClick: (id: any) => void }) {
    return (
        <button
            onClick={() => onClick(id)}
            className={`text-left px-4 py-3 rounded-lg transition-colors ${active === id ? 'bg-white/20 text-white font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
        >
            {label}
        </button>
    );
}

function GeneralSettings({ tabConfig, onUpdate }: { tabConfig: AppConfig, onUpdate: (c: Partial<AppConfig>) => void }) {
    const handleRoundUpdate = (idx: number, field: keyof Round, value: any) => {
        const newRounds = [...tabConfig.rounds];
        if (field === 'range') {
            // value should be [start, end]
            newRounds[idx] = { ...newRounds[idx], range: value };
        } else {
            newRounds[idx] = { ...newRounds[idx], [field]: value };
        }
        onUpdate({ rounds: newRounds });
    }

    const addRound = () => {
        const lastRound = tabConfig.rounds[tabConfig.rounds.length - 1];
        const newStart = lastRound ? lastRound.range[1] + 1 : 1;
        const newRound: Round = { title: `Round ${tabConfig.rounds.length + 1}`, range: [newStart, newStart + 10] };
        onUpdate({ rounds: [...tabConfig.rounds, newRound] });
    }

    const deleteRound = (idx: number) => {
        if (confirm("Delete this round? Questions in this range will remain but won't belong to a round.")) {
            onUpdate({ rounds: tabConfig.rounds.filter((_, i) => i !== idx) });
        }
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <SectionTitle title="Identity" />
            <div className="grid gap-4">
                <InputGroup label="App Name" value={tabConfig.appName} onChange={(v) => onUpdate({ appName: v })} />
                <InputGroup label="Company Name" value={tabConfig.companyName} onChange={(v) => onUpdate({ companyName: v })} />
            </div>

            <SectionTitle title="Timer Defaults" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputGroup type="number" label="Question Timer (seconds)" value={tabConfig.timer.defaultDuration} onChange={(v) => onUpdate({ timer: { ...tabConfig.timer, defaultDuration: Number(v) } })} />
                <InputGroup type="number" label="Pass Duration (seconds)" value={tabConfig.timer.passDuration} onChange={(v) => onUpdate({ timer: { ...tabConfig.timer, passDuration: Number(v) } })} />
            </div>
            <div className="flex flex-col gap-2">
                <Checkbox label="Auto-start timer when question opens" checked={tabConfig.timer.autoStartOnOpen} onChange={(c) => onUpdate({ timer: { ...tabConfig.timer, autoStartOnOpen: c } })} />
                <Checkbox label="Auto-start timer after passing" checked={tabConfig.timer.autoStartOnPass} onChange={(c) => onUpdate({ timer: { ...tabConfig.timer, autoStartOnPass: c } })} />
            </div>

            <SectionTitle title="Rounds Configuration" />
            <div className="flex justify-between items-center mb-4">
                <Checkbox label="Enable Round Grouping" checked={tabConfig.enableRounds} onChange={(c) => onUpdate({ enableRounds: c })} />
                {tabConfig.enableRounds && (
                    <button onClick={addRound} className="text-xs px-2 py-1 bg-emerald-600/30 text-emerald-400 rounded hover:bg-emerald-600/50 flex items-center gap-1">
                        <Plus size={14} /> Add Round
                    </button>
                )}
            </div>

            {tabConfig.enableRounds && (
                <div className="space-y-4 mt-2">
                    {tabConfig.rounds.map((round, idx) => (
                        <div key={idx} className="p-4 rounded bg-white/5 border border-white/10 flex flex-col gap-4 relative group">
                            <div className="flex justify-between items-start">
                                <h4 className="text-sm font-bold text-gray-400">Round {idx + 1}</h4>
                                <button onClick={() => deleteRound(idx)} className="p-1 text-red-400 hover:bg-red-500/20 rounded md:opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputGroup label="Title" value={round.title} onChange={(v) => handleRoundUpdate(idx, 'title', v)} />
                                <div className="flex gap-2">
                                    <div className="flex-1"><InputGroup type="number" label="Start ID" value={round.range[0]} onChange={(v) => handleRoundUpdate(idx, 'range', [Number(v), round.range[1]])} /></div>
                                    <div className="flex-1"><InputGroup type="number" label="End ID" value={round.range[1]} onChange={(v) => handleRoundUpdate(idx, 'range', [round.range[0], Number(v)])} /></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

function AppearanceSettings({ tabConfig, onUpdate }: { tabConfig: AppConfig, onUpdate: (c: Partial<AppConfig>) => void }) {
    const updateFont = (key: keyof AppConfig['fonts'], val: string) => {
        onUpdate({ fonts: { ...tabConfig.fonts, [key]: val } });
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <SectionTitle title="Font Sizes (Use px, rem, em)" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Main Grid Numbers" value={tabConfig.fonts.gridNumber} onChange={(v) => updateFont('gridNumber', v)} />
                <InputGroup label="Round Headers" value={tabConfig.fonts.roundTitle} onChange={(v) => updateFont('roundTitle', v)} />

                <InputGroup label="Question Text" value={tabConfig.fonts.questionTitle} onChange={(v) => updateFont('questionTitle', v)} />
                <InputGroup label="Answer Text" value={tabConfig.fonts.answerTitle} onChange={(v) => updateFont('answerTitle', v)} />

                <InputGroup label="Timer Display" value={tabConfig.fonts.timerTime} onChange={(v) => updateFont('timerTime', v)} />
                <InputGroup label="Stats Numbers" value={tabConfig.fonts.statsValue} onChange={(v) => updateFont('statsValue', v)} />
            </div>
        </div>
    )
}

function QuestionManager({ questions, rounds, enableRounds, onAdd, onEdit, onDelete }: { questions: Question[], rounds: Round[], enableRounds: boolean, onAdd: any, onEdit: any, onDelete: any }) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Partial<Question>>({});
    const [isAdding, setIsAdding] = useState(false);
    const [addForm, setAddForm] = useState<Partial<Question> & { roundIdx: number }>({ text: '', answer: '', roundIdx: -1 });

    // Helper to find Round for an ID
    const getRoundForId = (id: number) => {
        if (!enableRounds) return null;
        return rounds.find(r => id >= r.range[0] && id <= r.range[1]);
    }

    // Helper to get next available ID in a round
    const getNextIdInRound = (roundIdx: number) => {
        if (roundIdx === -1) return undefined;
        const round = rounds[roundIdx];
        if (!round) return undefined;

        let candidate = round.range[0];
        while (questions.some(q => q.id === candidate) && candidate <= round.range[1]) {
            candidate++;
        }
        return candidate > round.range[1] ? undefined : candidate; // Return undefined if full
    }

    const startEdit = (q: Question) => {
        setEditingId(q.id);
        setEditForm({ ...q, id: q.id }); // Ensure ID is part of form
    };

    const saveEdit = () => {
        if (editingId && editForm.text && editForm.answer && editForm.id) {
            onEdit(editingId, { id: Number(editForm.id), text: editForm.text, answer: editForm.answer });
            setEditingId(null);
        }
    };

    const handleAdd = () => {
        if (addForm.text && addForm.answer) {
            let specificId = undefined;
            if (enableRounds && addForm.roundIdx !== -1) {
                specificId = getNextIdInRound(addForm.roundIdx);
                if (!specificId) {
                    alert("That round is full! adjusting range or picking another.");
                    return;
                }
            }

            onAdd({
                text: addForm.text,
                answer: addForm.answer,
                mediaType: addForm.mediaType,
                mediaUrl: addForm.mediaUrl
            }, specificId);
            setIsAdding(false);
            setAddForm({ text: '', answer: '', roundIdx: -1 });
            setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 100);
        }
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <SectionTitle title={`Questions (${questions.length})`} />
                <button onClick={() => setIsAdding(true)} className="btn-primary flex gap-2 items-center px-3 py-1.5 text-sm whitespace-nowrap">
                    <Plus size={16} /> Add New
                </button>
            </div>

            {isAdding && (
                <div className="p-4 mb-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 animate-scale-in">
                    <h4 className="font-bold text-emerald-400 mb-2">New Question</h4>
                    <div className="space-y-3">
                        {enableRounds && (
                            <select
                                value={addForm.roundIdx}
                                onChange={e => setAddForm(prev => ({ ...prev, roundIdx: Number(e.target.value) }))}
                                className="w-full bg-black/30 border border-white/10 rounded p-2 text-white"
                            >
                                <option value={-1}>Auto-Assign Round / ID</option>
                                {rounds.map((r, idx) => (
                                    <option key={idx} value={idx}>{r.title} ({r.range[0]}-{r.range[1]})</option>
                                ))}
                            </select>
                        )}
                        <textarea placeholder="Question Text" className="w-full bg-black/30 border border-white/10 rounded p-2 text-white" rows={2} value={addForm.text} onChange={e => setAddForm(prev => ({ ...prev, text: e.target.value }))} />
                        <input type="text" placeholder="Answer" className="w-full bg-black/30 border border-white/10 rounded p-2 text-white" value={addForm.answer} onChange={e => setAddForm(prev => ({ ...prev, answer: e.target.value }))} />

                        {/* Media Inputs */}
                        <div className="flex flex-col gap-2 p-3 rounded bg-white/5 border border-white/10">
                            <label className="text-xs uppercase font-bold text-gray-400">Attachment (Optional)</label>
                            <div className="flex gap-2">
                                <select
                                    className="bg-black/30 border border-white/10 rounded p-2 text-white text-sm"
                                    value={addForm.mediaType || ''}
                                    onChange={e => setAddForm(prev => ({ ...prev, mediaType: e.target.value as 'image' | 'audio' | undefined }))}
                                >
                                    <option value="">No Media</option>
                                    <option value="image">Image</option>
                                    <option value="audio">Audio</option>
                                </select>

                                {addForm.mediaType && (
                                    <div className="flex-1 flex gap-2">
                                        <input
                                            type="text"
                                            placeholder={addForm.mediaType === 'image' ? "Image URL or Path" : "Audio URL or Path"}
                                            className="flex-1 bg-black/30 border border-white/10 rounded p-2 text-white text-sm"
                                            value={addForm.mediaUrl || ''}
                                            onChange={e => setAddForm(prev => ({ ...prev, mediaUrl: e.target.value }))}
                                        />
                                        <label className="cursor-pointer px-3 py-2 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 rounded text-xs font-bold flex items-center gap-1 whitespace-nowrap">
                                            <Upload size={14} /> Upload File
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept={addForm.mediaType === 'image' ? "image/*" : "audio/*"}
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;

                                                    if (addForm.mediaType === 'audio') {
                                                        // Audio Compression Logic
                                                        try {
                                                            const compressed = await compressAudio(file);
                                                            setAddForm(prev => ({ ...prev, mediaUrl: compressed }));
                                                        } catch (err) {
                                                            alert("Failed to process audio");
                                                            console.error(err);
                                                        }
                                                    } else {
                                                        // Image Compression Logic
                                                        try {
                                                            const compressed = await compressImage(file);
                                                            setAddForm(prev => ({ ...prev, mediaUrl: compressed }));
                                                        } catch (err) {
                                                            alert("Failed to process image");
                                                            console.error(err);
                                                        }
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>
                                )}
                            </div>
                            {addForm.mediaUrl && <p className="text-[10px] text-gray-500 truncate">Source: {addForm.mediaUrl.substring(0, 50)}...</p>}
                        </div>

                        <div className="flex gap-2 justify-end">
                            <button onClick={() => setIsAdding(false)} className="px-3 py-1 text-sm text-gray-400 hover:text-white">Cancel</button>
                            <button onClick={handleAdd} className="px-3 py-1 bg-emerald-600 rounded text-sm font-bold hover:bg-emerald-500">Save Question</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-2">
                {questions.map((q) => {
                    const round = getRoundForId(q.id);
                    return (
                        <div key={q.id} className="p-3 md:p-4 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors flex flex-col md:flex-row gap-4 items-start group">
                            <div className="flex items-center gap-2 w-full md:w-auto">
                                <div className="font-mono text-gray-500 w-8 shrink-0">#{q.id}</div>
                                {round && <div className="md:hidden text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300">{round.title}</div>}
                            </div>

                            {editingId === q.id ? (
                                <div className="flex-1 space-y-2 w-full">
                                    <div className="flex gap-2 items-center">
                                        <label className="text-xs text-gray-400">ID:</label>
                                        <input type="number" className="bg-black/50 border border-white/20 rounded p-1 text-white w-20" value={editForm.id} onChange={e => setEditForm(prev => ({ ...prev, id: Number(e.target.value) }))} />
                                    </div>
                                    <textarea className="w-full bg-black/50 border border-white/20 rounded p-2 text-white" value={editForm.text} onChange={e => setEditForm(prev => ({ ...prev, text: e.target.value }))} />
                                    <input className="w-full bg-black/50 border border-white/20 rounded p-2 text-white" value={editForm.answer} onChange={e => setEditForm(prev => ({ ...prev, answer: e.target.value }))} />
                                    <div className="flex gap-2 mt-2">
                                        <button onClick={saveEdit} className="flex items-center gap-1 px-3 py-1 bg-green-600/20 text-green-400 rounded hover:bg-green-600/40"><Check size={14} /> Save</button>
                                        <button onClick={() => setEditingId(null)} className="flex items-center gap-1 px-3 py-1 bg-red-600/20 text-red-400 rounded hover:bg-red-600/40"><X size={14} /> Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex-1 min-w-0 md:border-l md:border-white/10 md:pl-4">
                                        <p className="font-medium text-white mb-1 break-words">{q.text}</p>
                                        <p className="text-sm text-emerald-400 font-mono break-words">{q.answer}</p>
                                        {round && <div className="hidden md:inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300">{round.title}</div>}
                                    </div>
                                    <div className="flex gap-2 self-end md:self-start opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => startEdit(q)} className="p-2 hover:bg-blue-500/20 text-blue-400 rounded"><Edit2 size={16} /></button>
                                        <button onClick={() => { if (confirm(`Delete Question ${q.id}?`)) onDelete(q.id); }} className="p-2 hover:bg-red-500/20 text-red-400 rounded"><Trash2 size={16} /></button>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

function DataActions({ onReset, onImport, config, questions }: { onReset: any, onImport: any, config: any, questions: any }) {
    const [fileName, setFileName] = useState("sajilo-quiz-data");
    const [showSample, setShowSample] = useState(false);

    const handleDownload = () => {
        const name = fileName.endsWith('.json') ? fileName : `${fileName}.json`;
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ config, questions }, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", name);
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            if (evt.target?.result && typeof evt.target.result === 'string') {
                const success = onImport(evt.target.result);
                if (success) alert('Data Imported Successfully!');
                else alert('Failed to import data. Check file format.');
            }
        };
        reader.readAsText(file);
    }

    const SAMPLE_JSON = `{
  "config": {
    "appName": "My Quiz",
    "rounds": [
      { "title": "Round 1", "range": [1, 10] }
    ],
    ...
  },
  "questions": [
    { "id": 1, "text": "What is 2+2?", "answer": "4" }
  ]
}`;

    // Calculate Storage Usage
    const [usage, setUsage] = useState({ used: 0, percent: 0 });
    useEffect(() => {
        const calculateUsage = () => {
            let total = 0;
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    total += (localStorage[key].length * 2); // 2 bytes per char
                }
            }
            const usedMB = total / 1024 / 1024;
            // Assuming 5MB limit for safe cross-browser estimation
            const percent = Math.min((usedMB / 5) * 100, 100);
            setUsage({ used: usedMB, percent });
        };
        calculateUsage();
        // Recalculate periodically or on render
        const interval = setInterval(calculateUsage, 2000);
        return () => clearInterval(interval);
    }, [questions, config]); // Re-run when data changes

    return (
        <div className="space-y-8 animate-fade-in">
            <SectionTitle title="Backup & Restore" />

            {/* Storage Indicator */}
            <div className="p-4 rounded-lg bg-gray-800/50 border border-white/10">
                <div className="flex justify-between text-xs mb-2 text-gray-400">
                    <span className="font-bold uppercase tracking-wider">Browser Storage Left</span>
                    <span>{usage.used.toFixed(2)} MB used / ~5.00 MB limit</span>
                </div>
                <div className="w-full bg-black/50 h-3 rounded-full overflow-hidden border border-white/5">
                    <div
                        className={`h-full transition-all duration-500 ${usage.percent > 90 ? 'bg-red-500' : usage.percent > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${usage.percent}%` }}
                    />
                </div>
                <p className="text-[10px] text-gray-500 mt-2">
                    *Limit depends on the browser (usually 5MB-10MB). For large media, please put files in the <code>/public</code> folder and use relative paths.
                </p>
            </div>

            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <h4 className="font-bold text-blue-300 mb-4 flex items-center gap-2"><Download size={18} /> Export Data</h4>
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <InputGroup label="Filename" value={fileName} onChange={setFileName} />
                    </div>
                    <button onClick={handleDownload} className="w-full md:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded font-bold transition-colors">
                        Download JSON
                    </button>
                </div>
            </div>

            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <h4 className="font-bold text-purple-300 mb-4 flex items-center gap-2"><Upload size={18} /> Import Data</h4>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <label className="cursor-pointer px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded font-bold text-sm transition-colors inline-flex items-center gap-2">
                            <Upload size={16} /> Choose File
                            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
                        </label>
                        <button onClick={() => setShowSample(!showSample)} className="text-sm text-purple-400 hover:text-white underline">
                            {showSample ? "Hide Sample" : "Show Sample Format"}
                        </button>
                    </div>

                    {showSample && (
                        <div className="mt-2 p-3 bg-black/50 rounded border border-white/10 text-xs font-mono text-gray-400 overflow-x-auto">
                            <pre>{SAMPLE_JSON}</pre>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <button onClick={onReset} className="w-full md:w-auto px-4 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-300 rounded flex items-center justify-center gap-2 transition-colors">
                    <RotateCcw size={18} /> Factory Reset (Clear All Changes)
                </button>
            </div>
        </div>
    )
}

function HelpGuide() {
    return (
        <div className="space-y-8 animate-fade-in text-gray-300">
            <SectionTitle title="Keyboard Shortcuts" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ShortcutItem keyBind="SPACE" action="Reveal / Hide Answer" />
                <ShortcutItem keyBind="ESC" action="Back to Grid (Main Menu)" />
                <ShortcutItem keyBind="T" action="Start / Pause Timer" />
                <ShortcutItem keyBind="R" action="Reset Timer" />
                <ShortcutItem keyBind="] or +" action="Increase Text Size" />
                <ShortcutItem keyBind="[ or -" action="Decrease Text Size" />
                <ShortcutItem keyBind="0" action="Reset Text Size" />
            </div>

            <SectionTitle title="Quick Tips" />
            <ul className="space-y-2 list-disc pl-5">
                <li><strong className="text-white">Rounds:</strong> You can add logic for Rounds in the Settings tab. Assign questions to rounds to auto-generate IDs (e.g., Round 1 starts at 1, Round 2 starts at 11).</li>
                <li><strong className="text-white">Exporting:</strong> Always export your data ("Backup") before clearing browsing data or switching devices.</li>
                <li><strong className="text-white">Offline:</strong> This app works offline! You can disconnect from the internet after loading it.</li>
            </ul>
        </div>
    )
}

function ShortcutItem({ keyBind, action }: { keyBind: string, action: string }) {
    return (
        <div className="flex items-center justify-between p-3 rounded bg-white/5 border border-white/10">
            <span className="font-mono text-purple-400 bg-black/40 px-2 py-1 rounded text-sm">{keyBind}</span>
            <span className="text-sm font-medium">{action}</span>
        </div>
    )
}

// --- Generic UI Helpers ---

function SectionTitle({ title }: { title: string }) {
    return <h3 className="text-xl font-bold text-white/80 mb-4 border-b border-white/10 pb-2">{title}</h3>;
}

function InputGroup({ label, value, onChange, type = "text" }: { label: string, value: any, onChange: (v: string) => void, type?: string }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="bg-black/20 border border-white/10 rounded px-3 py-2 text-white focus:border-purple-500 outline-none transition-colors"
            />
        </div>
    )
}

function Checkbox({ label, checked, onChange }: { label: string, checked: boolean, onChange: (c: boolean) => void }) {
    return (
        <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white/5 rounded select-none">
            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${checked ? 'bg-purple-600 border-purple-500' : 'border-gray-500'}`}>
                {checked && <Check size={14} className="text-white" />}
            </div>
            <span className="text-sm text-gray-300">{label}</span>
            <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="hidden" />
        </label>
    )
}

// --- Helpers ---

const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 800;
                const MAX_HEIGHT = 800;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                // Compress to JPEG at 0.7 quality
                const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                resolve(dataUrl);
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
};

const compressAudio = async (file: File): Promise<string> => {
    // 1. Read File
    const arrayBuffer = await file.arrayBuffer();

    // 2. Decode Audio
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

    // 3. Offline Render to Mono @ 16kHz
    const TARGET_RATE = 16000;
    const offlineCtx = new OfflineAudioContext(1, audioBuffer.duration * TARGET_RATE, TARGET_RATE);
    const source = offlineCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(offlineCtx.destination);
    source.start();

    const renderedBuffer = await offlineCtx.startRendering();

    // 4. Encode to WAV
    const wavBlob = bufferToWav(renderedBuffer);

    // 5. Convert to Base64
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(wavBlob);
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
    });
};

// Simple WAV Encoder
function bufferToWav(buffer: AudioBuffer) {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2 + 44;
    const outBuffer = new ArrayBuffer(length);
    const view = new DataView(outBuffer);
    const channels = [];
    let i;
    let sample;
    let offset = 0;
    let pos = 0;

    // write RIFF chunk descriptor
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + buffer.length * numOfChan * 2, true);
    writeString(view, 8, 'WAVE');

    // write fmt sub-chunk
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numOfChan, true);
    view.setUint32(24, buffer.sampleRate, true);
    view.setUint32(28, buffer.sampleRate * 2 * numOfChan, true);
    view.setUint16(32, numOfChan * 2, true);
    view.setUint16(34, 16, true);

    // write data sub-chunk
    writeString(view, 36, 'data');
    view.setUint32(40, buffer.length * numOfChan * 2, true);

    // write interleaved data
    for (i = 0; i < buffer.numberOfChannels; i++)
        channels.push(buffer.getChannelData(i));

    offset = 44;
    while (pos < buffer.length) {
        for (i = 0; i < numOfChan; i++) {
            sample = Math.max(-1, Math.min(1, channels[i][pos]));
            sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
            view.setInt16(offset, sample, true);
            offset += 2;
        }
        pos++;
    }

    return new Blob([outBuffer], { type: 'audio/wav' });

    function writeString(view: DataView, offset: number, string: string) {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }
}
