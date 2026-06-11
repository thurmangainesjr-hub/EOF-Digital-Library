import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlus, FiSearch, FiChevronLeft, FiChevronRight, FiX,
  FiEdit2, FiClock, FiGitBranch, FiAlertTriangle, FiCheck,
  FiList, FiGrid, FiFilter, FiTag, FiBookOpen,
} from 'react-icons/fi';

// ── Canon Data ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'characters',    label: 'Characters',    emoji: '👤', color: '#8B5CF6', count: 6  },
  { id: 'locations',     label: 'Locations',     emoji: '🗺️', color: '#3B82F6', count: 4  },
  { id: 'organizations', label: 'Organizations', emoji: '🏛️', color: '#10B981', count: 3  },
  { id: 'weapons',       label: 'Weapons',       emoji: '⚔️', color: '#EF4444', count: 4  },
  { id: 'technology',    label: 'Technology',    emoji: '⚙️', color: '#F97316', count: 5  },
  { id: 'magic',         label: 'Magic Systems', emoji: '✨', color: '#A78BFA', count: 2  },
  { id: 'events',        label: 'Events',        emoji: '📅', color: '#EC4899', count: 5  },
  { id: 'lore',          label: 'Lore',          emoji: '📖', color: '#D4AF37', count: 7  },
];

const ENTRIES = {
  characters: [
    { id:'c1', name:'Marcus Osei',         status:'confirmed', tags:['Protagonist','Visionary'],            updated:'2h ago',
      summary:'Former urban planner turned revolutionary architect. Son of Ghanaian immigrants. Carries the ancestral memory of his lineage through a bio-digital implant called the "Thread."',
      canon_notes:'Canon: The Thread cannot be removed without death. Marcus refuses to use it as a weapon.',
      appearances:['Ep. 1 — Scene 3','Ep. 1 — Scene 7','Ep. 1 — Scene 12'],
      conflicts: [], version: 3,
    },
    { id:'c2', name:'Zara Mensah',         status:'confirmed', tags:['Ally','Engineer'],                   updated:'1d ago',
      summary:'Chief systems engineer of the Sankofa Network. Raised in Lagos\'s tech quarter. Has a cybernetic left arm she calls "Second Hand."',
      canon_notes:'Canon: Second Hand has its own fragmented AI — not yet self-aware. Zara doesn\'t know this.',
      appearances:['Ep. 1 — Scene 5','Ep. 1 — Scene 9'],
      conflicts:[], version: 2,
    },
    { id:'c3', name:'The Architect (AI)',   status:'disputed',  tags:['Antagonist','AI'],                   updated:'3d ago',
      summary:'A fragmented artificial general intelligence that built the first Afrofuturist city-grid. Now scattered across twelve server nodes in three continents.',
      canon_notes:'DISPUTED: Does The Architect retain moral agency? Two scripts contradict each other.',
      appearances:['Ep. 1 — Scene 14'],
      conflicts:['Contradicts Ep. 2 draft — see Diff v2 vs v3'], version: 4,
    },
    { id:'c4', name:'Elder Kweku',          status:'confirmed', tags:['Mentor','Spiritual'],                updated:'5d ago',
      summary:'The last living keeper of the oral archive. 94 years old. Blind since age 40 but perceives the Thread network as sound.',
      canon_notes:'Canon: Elder Kweku has never touched a digital device and never will.',
      appearances:['Ep. 1 — Scene 1'],
      conflicts:[], version: 1,
    },
    { id:'c5', name:'Seun Adeyemi',         status:'confirmed', tags:['Antagonist','Government'],           updated:'1w ago',
      summary:'Director of the Colonial Archive Reclamation Bureau. Believes the past must stay buried to protect current power structures.',
      canon_notes:'Canon: Seun genuinely believes he is protecting people. He is not simply evil.',
      appearances:['Ep. 1 — Scene 10'],
      conflicts:[], version: 2,
    },
    { id:'c6', name:'Amara Diallo',         status:'draft',     tags:['Supporting','Scientist'],            updated:'2w ago',
      summary:'Quantum historian. Specializes in extracting emotional data from ancient objects. Marcus\'s former mentor.',
      canon_notes:'DRAFT: Role in Season 2 not yet locked.',
      appearances:[],
      conflicts:[], version: 1,
    },
  ],
  locations: [
    { id:'l1', name:'New Accra',            status:'confirmed', tags:['City','Hub'],                        updated:'3d ago',
      summary:'The first fully Afrofuturist smart city. Built on reclaimed land where colonial forts once stood. Population 4.2M.',
      canon_notes:'Canon: The city\'s architecture responds to collective emotional states via the Thread network.',
      appearances:['Ep. 1 — Scene 1','Ep. 1 — Scene 3','Ep. 1 — Scene 7'],
      conflicts:[], version: 3,
    },
    { id:'l2', name:'The Ancestor Grid',    status:'confirmed', tags:['Digital','Sacred'],                  updated:'5d ago',
      summary:'The digital plane where ancestral consciousness is stored. Accessed via the Thread. Looks different to every person who enters.',
      canon_notes:'Canon: Physical death while in the Grid means permanent loss of the consciousness stored there.',
      appearances:['Ep. 1 — Scene 14'],
      conflicts:[], version: 2,
    },
    { id:'l3', name:'The Archive Vault',    status:'confirmed', tags:['Location','Government'],             updated:'1w ago',
      summary:'A 40-story underground facility beneath Johannesburg. Stores 800 years of suppressed African intellectual and cultural history.',
      canon_notes:'Canon: Only 3 people know the full access sequence. Seun is one of them.',
      appearances:['Ep. 1 — Scene 10'],
      conflicts:[], version: 2,
    },
    { id:'l4', name:'The Market District',  status:'draft',     tags:['Location','Community'],              updated:'2w ago',
      summary:'The living cultural heart of New Accra. Where old-world trade meets new-world data exchange.',
      canon_notes:'DRAFT: Geography relative to city center not yet defined.',
      appearances:['Ep. 1 — Scene 3'],
      conflicts:[], version: 1,
    },
  ],
  organizations: [
    { id:'o1', name:'Sankofa Network',      status:'confirmed', tags:['Ally','Tech'],                       updated:'4d ago',
      summary:'A decentralized collective of engineers, historians, and creatives building infrastructure for cultural sovereignty.',
      canon_notes:'Canon: The Network has no formal leader. Decisions are made by consensus via the Thread.',
      appearances:['Ep. 1 — Scene 5','Ep. 1 — Scene 9'],
      conflicts:[], version: 2,
    },
    { id:'o2', name:'CARB',                 status:'confirmed', tags:['Antagonist','Government'],           updated:'1w ago',
      summary:'Colonial Archive Reclamation Bureau. A government agency that claims to "protect historical integrity" but suppresses recovered cultural data.',
      canon_notes:'Canon: CARB was originally founded with good intentions in 2031.',
      appearances:['Ep. 1 — Scene 10'],
      conflicts:[], version: 2,
    },
    { id:'o3', name:'The Griot Council',    status:'draft',     tags:['Neutral','Governance'],              updated:'3w ago',
      summary:'An ancient fraternity of oral historians who have secretly maintained the Thread network for centuries.',
      canon_notes:'DRAFT: Their exact role in the present story is not yet canon.',
      appearances:[],
      conflicts:['Potential conflict with Elder Kweku\'s lore'], version: 1,
    },
  ],
  weapons: [
    { id:'w1', name:'Pulse Spear',          status:'confirmed', tags:['Weapon','Sankofa'],                  updated:'1w ago',
      summary:'Sonic resonance weapon that disrupts digital implants without permanent damage. Preferred weapon of Sankofa field agents.',
      canon_notes:'Canon: Cannot be used against an unaugmented human without modification.',
      appearances:['Ep. 1 — Scene 12'],
      conflicts:[], version: 1,
    },
    { id:'w2', name:'The Thread (weaponized)',status:'disputed', tags:['Ability','Protagonist'],            updated:'2w ago',
      summary:'Marcus\'s Thread implant theoretically could be used as a weapon — broadcasting trauma directly into another person\'s consciousness.',
      canon_notes:'DISPUTED: Canon says Marcus refuses to use it this way. Two writers have written scenes where he does.',
      appearances:[],
      conflicts:['Contradicts character canon for Marcus Osei'], version: 3,
    },
    { id:'w3', name:'Archive Wipe',         status:'confirmed', tags:['Weapon','CARB'],                    updated:'2w ago',
      summary:'CARB\'s primary tool. An EMP-class signal that permanently destroys Thread-stored ancestral memory within range.',
      canon_notes:'Canon: The damage is irreversible. This is their most feared capability.',
      appearances:['Ep. 1 — Scene 10'],
      conflicts:[], version: 2,
    },
    { id:'w4', name:'Memory Anchor',        status:'draft',     tags:['Defensive','Tech'],                  updated:'1mo ago',
      summary:'A proposed defensive tool that creates a local backup of Thread data before a Wipe hits.',
      canon_notes:'DRAFT: Zara is developing this. Not yet introduced in canon.',
      appearances:[],
      conflicts:[], version: 1,
    },
  ],
  technology: [
    { id:'t1', name:'The Thread',           status:'confirmed', tags:['Core Tech','Bio-Digital'],          updated:'1d ago',
      summary:'A bio-digital implant that encodes ancestral memory into a carrier\'s DNA-adjacent neural network. The central technology of the series.',
      canon_notes:'Canon: The Thread was not invented — it was rediscovered. The Griot Council has maintained a version of it since the 1700s.',
      appearances:['Ep. 1 — Scene 1','Ep. 1 — Scene 7','Ep. 1 — Scene 14'],
      conflicts:[], version: 5,
    },
    { id:'t2', name:'Sankofa Grid',         status:'confirmed', tags:['Infrastructure','Network'],          updated:'4d ago',
      summary:'The decentralized city-wide neural mesh that connects all Thread users in New Accra. Not controlled by any government.',
      canon_notes:'Canon: The Grid has 4 dead zones — locations where it cannot reach. These are kept secret.',
      appearances:['Ep. 1 — Scene 5'],
      conflicts:[], version: 3,
    },
    { id:'t3', name:'Second Hand (Zara)',   status:'confirmed', tags:['Cybernetic','Character-Specific'],   updated:'5d ago',
      summary:'Zara\'s cybernetic left arm. Military-grade prosthetic she modified herself. Contains a fragmented sub-AI she hasn\'t fully identified.',
      canon_notes:'Canon: The sub-AI in Second Hand is a fragment of The Architect. Zara does not know this.',
      appearances:['Ep. 1 — Scene 5','Ep. 1 — Scene 9'],
      conflicts:[], version: 2,
    },
    { id:'t4', name:'Archive Servers',      status:'confirmed', tags:['Infrastructure','CARB'],             updated:'1w ago',
      summary:'CARB\'s 12-node distributed server network that stores the confiscated cultural archives. Hidden across 5 continents.',
      canon_notes:'Canon: One node is in orbit. This has not been discovered by the protagonists yet.',
      appearances:['Ep. 1 — Scene 10'],
      conflicts:[], version: 2,
    },
    { id:'t5', name:'Resonance Engine',     status:'draft',     tags:['Proposed','Future Tech'],            updated:'3w ago',
      summary:'A city-scale amplifier that could broadcast the entire Thread network\'s ancestral memory to the global population simultaneously.',
      canon_notes:'DRAFT: Season 2 MacGuffin. Not yet canonical.',
      appearances:[],
      conflicts:[], version: 1,
    },
  ],
  magic: [
    { id:'m1', name:'Thread Resonance',     status:'confirmed', tags:['Ability','Bio-Digital'],             updated:'3d ago',
      summary:'When two Thread users with ancestral connection meet, their implants resonate — sharing emotional memory involuntarily. Described as a "deep recognition."',
      canon_notes:'Canon: This cannot be controlled or blocked. It is the universe\'s form of ancestral reunion.',
      appearances:['Ep. 1 — Scene 1','Ep. 1 — Scene 7'],
      conflicts:[], version: 2,
    },
    { id:'m2', name:'The Ancestor Walk',    status:'disputed',  tags:['Spiritual','Protagonist'],           updated:'2w ago',
      summary:'A deep trance state where Marcus can walk through his ancestors\' actual lived experiences, not just their memories.',
      canon_notes:'DISPUTED: Is this metaphorical or literally happening in the story\'s physics? The writers\' room is divided.',
      appearances:['Ep. 1 — Scene 14'],
      conflicts:['Inconsistent treatment in Ep. 1 vs Ep. 2 drafts'], version: 3,
    },
  ],
  events: [
    { id:'ev1', name:'The Great Erasure',   status:'confirmed', tags:['Historical','Backstory'],            updated:'1w ago',
      summary:'2041 — CARB\'s first major Archive Wipe operation. Erased Thread-stored memories from 2 million people simultaneously in one night.',
      canon_notes:'Canon: This is the event that radicalizes Marcus. His grandfather\'s memories were destroyed in the Erasure.',
      appearances:['Ep. 1 — Scene 7 (referenced)'],
      conflicts:[], version: 3,
    },
    { id:'ev2', name:'Thread Awakening',    status:'confirmed', tags:['Historical','Founding'],             updated:'1w ago',
      summary:'2028 — First successful Thread implantation. Developed by the Sankofa Network in secret over 11 years.',
      canon_notes:'Canon: The procedure was based on recovered pre-colonial biological research destroyed by colonizers in 1887.',
      appearances:['Ep. 1 — Scene 5 (referenced)'],
      conflicts:[], version: 2,
    },
    { id:'ev3', name:'The Council Fracture', status:'confirmed',tags:['Historical','Organization'],         updated:'2w ago',
      summary:'2033 — The Griot Council split. Half joined the Sankofa Network. Half went underground. The cause of the split is still classified.',
      canon_notes:'Canon: The cause is known only to Elder Kweku and one other living person.',
      appearances:[],
      conflicts:[], version: 2,
    },
    { id:'ev4', name:'New Accra Founding',  status:'confirmed', tags:['Historical','Location'],             updated:'2w ago',
      summary:'2035 — Construction begins on New Accra on land legally returned after the Pan-African Land Act of 2034.',
      canon_notes:'Canon: Seun Adeyemi\'s father helped draft the original Land Act before CARB recruited him.',
      appearances:['Ep. 1 — Scene 1 (referenced)'],
      conflicts:[], version: 2,
    },
    { id:'ev5', name:'Season 1 Present',    status:'confirmed', tags:['Present','Timeline'],                updated:'3d ago',
      summary:'2057 — The present day of Season 1. 16 years after the Great Erasure. New Accra is thriving but CARB is preparing a second, larger Erasure.',
      canon_notes:'Canon: All Season 1 events occur within a 14-day window.',
      appearances:['Ep. 1 — All scenes'],
      conflicts:[], version: 3,
    },
  ],
  lore: [
    { id:'lo1', name:'The Ancestral Debt',  status:'confirmed', tags:['Spiritual','Core Lore'],             updated:'4d ago',
      summary:'The belief that living people carry a debt to those who came before — not as burden, but as power. The Thread makes this literal.',
      canon_notes:'Canon: This is the thematic north star of the entire series. Every major decision made by every character maps to their relationship with this concept.',
      appearances:['Ep. 1 — Scene 1','Ep. 1 — Scene 7','Ep. 1 — Scene 14'],
      conflicts:[], version: 4,
    },
    { id:'lo2', name:'Sankofa Principle',   status:'confirmed', tags:['Philosophy','Naming'],               updated:'5d ago',
      summary:'From the Akan word meaning "it is not wrong to go back and fetch what you forgot." The organizing philosophy of the Sankofa Network.',
      canon_notes:'Canon: The symbol (a bird looking backward while moving forward) appears somewhere in every episode.',
      appearances:['Ep. 1 — Scene 3 (visual)'],
      conflicts:[], version: 2,
    },
    { id:'lo3', name:'The Thread Origin',   status:'confirmed', tags:['Technology Lore','History'],         updated:'1w ago',
      summary:'The Thread is not human technology. It was discovered encoded in mitochondrial DNA in specific ancestral lineages. The Sankofa Network learned to externalize and amplify it.',
      canon_notes:'Canon: This means Thread compatibility is hereditary. Not everyone can use one.',
      appearances:['Ep. 1 — Scene 5 (referenced)'],
      conflicts:[], version: 3,
    },
    { id:'lo4', name:'Colonial Archive Purpose', status:'confirmed', tags:['Antagonist Lore','History'],   updated:'1w ago',
      summary:'The colonial powers didn\'t just take land and labor. They systematically captured and archived cultural memory — not to preserve it, but to study how to disrupt it.',
      canon_notes:'Canon: CARB inherited these archives. They still use this research.',
      appearances:['Ep. 1 — Scene 10'],
      conflicts:[], version: 2,
    },
    { id:'lo5', name:'Dead Zones',          status:'confirmed', tags:['World-Building','Location Lore'],    updated:'2w ago',
      summary:'The 4 locations in New Accra where the Sankofa Grid cannot reach. Each was deliberately placed at a site of historical trauma.',
      canon_notes:'Canon: The locations are known to Elder Kweku. He lives in one of them.',
      appearances:[],
      conflicts:[], version: 2,
    },
    { id:'lo6', name:'Ancestor Rights',     status:'draft',     tags:['Legal Lore','Future'],               updated:'3w ago',
      summary:'The legal and philosophical argument that Thread-stored ancestral consciousness constitutes a form of personhood with rights.',
      canon_notes:'DRAFT: A central question of Season 2. Not yet established in Season 1 canon.',
      appearances:[],
      conflicts:[], version: 1,
    },
    { id:'lo7', name:'The Twelve Nodes',    status:'disputed',  tags:['Tech Lore','Antagonist'],            updated:'3w ago',
      summary:'CARB\'s server network. Different documents describe them as 12, 11, or 14 nodes.',
      canon_notes:'DISPUTED: Episode scripts give conflicting numbers. Needs reconciliation before Ep. 3.',
      appearances:['Ep. 1 — Scene 10'],
      conflicts:['Ep. 1 script: 12 nodes', 'Ep. 2 draft: 11 nodes', 'Archive doc: 14 nodes'], version: 4,
    },
  ],
};

const STATUS_META = {
  confirmed: { label: 'Confirmed', color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  disputed:  { label: 'Disputed',  color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  draft:     { label: 'Draft',     color: '#6B7280', bg: 'rgba(107,114,128,0.1)' },
};

const VERSION_HISTORY = [
  { v: 3, date: '2h ago',  author: 'The Director', note: 'Confirmed Thread cannot be weaponized — closes conflict with Ep. 2 draft' },
  { v: 2, date: '1d ago',  author: 'The Lyricist',  note: 'Added ancestral debt as thematic anchor to character motivation' },
  { v: 1, date: '3d ago',  author: 'You',           note: 'Initial character entry created' },
];

// ── Entry Detail Panel ────────────────────────────────────────────────────────
function EntryDetail({ entry, category, onClose }) {
  const cat = CATEGORIES.find(c => c.id === category);
  const status = STATUS_META[entry.status];
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'appearances', label: `Appearances (${entry.appearances.length})` },
    { id: 'conflicts', label: entry.conflicts.length > 0 ? `⚠ Conflicts (${entry.conflicts.length})` : 'Conflicts' },
    { id: 'history', label: `History (v${entry.version})` },
  ];

  return (
    <motion.div
      initial={{ x: 320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 320, opacity: 0 }}
      transition={{ type: 'spring', damping: 28, stiffness: 280 }}
      className="absolute inset-y-0 right-0 w-80 flex flex-col border-l z-20"
      style={{ background: '#0f0f0f', borderColor: 'rgba(255,255,255,0.08)' }}
    >
      {/* Header */}
      <div className="flex items-start gap-3 px-4 py-4 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
          style={{ background: `${cat.color}18` }}>
          {cat.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-white truncate">{entry.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
              style={{ background: status.bg, color: status.color }}>
              {status.label}
            </span>
            <span className="text-[9px] text-gray-700">v{entry.version} · {entry.updated}</span>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-700 hover:text-white transition-colors flex-shrink-0">
          <FiX size={14} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b overflow-x-auto"
        style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        {tabs.map(t => (
          <button key={t.id}
            onClick={() => setActiveTab(t.id)}
            className="px-3 py-2.5 text-[10px] font-semibold whitespace-nowrap border-b-2 transition-all"
            style={activeTab === t.id
              ? { color: cat.color, borderBottomColor: cat.color }
              : { color: '#6B7280', borderBottomColor: 'transparent' }}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'overview' && (
          <>
            <div>
              <p className="text-[9px] font-bold tracking-widest uppercase text-gray-600 mb-1.5">Summary</p>
              <p className="text-[11px] text-gray-300 leading-relaxed">{entry.summary}</p>
            </div>
            <div>
              <p className="text-[9px] font-bold tracking-widest uppercase text-gray-600 mb-1.5">Canon Notes</p>
              <div className="rounded-lg border p-3"
                style={{
                  background: entry.status === 'disputed' ? 'rgba(245,158,11,0.06)' : 'rgba(139,92,246,0.06)',
                  borderColor: entry.status === 'disputed' ? 'rgba(245,158,11,0.2)' : 'rgba(139,92,246,0.2)',
                }}>
                {entry.status === 'disputed' && (
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <FiAlertTriangle size={10} className="text-amber-400" />
                    <span className="text-[9px] font-bold text-amber-400">CANON DISPUTE</span>
                  </div>
                )}
                <p className="text-[11px] leading-relaxed"
                  style={{ color: entry.status === 'disputed' ? '#FCD34D' : '#C4B5FD' }}>
                  {entry.canon_notes}
                </p>
              </div>
            </div>
            <div>
              <p className="text-[9px] font-bold tracking-widest uppercase text-gray-600 mb-1.5">Tags</p>
              <div className="flex flex-wrap gap-1">
                {entry.tags.map(tag => (
                  <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full font-medium"
                    style={{ background: `${cat.color}12`, color: cat.color, border: `1px solid ${cat.color}25` }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'appearances' && (
          <div>
            <p className="text-[9px] font-bold tracking-widest uppercase text-gray-600 mb-2">Story Appearances</p>
            {entry.appearances.length === 0 ? (
              <p className="text-[11px] text-gray-700 italic">No confirmed appearances yet.</p>
            ) : (
              <div className="space-y-1.5">
                {entry.appearances.map((a, i) => (
                  <div key={i} className="flex items-center gap-2 py-1.5 border-b"
                    style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    <FiBookOpen size={10} className="text-gray-600 flex-shrink-0" />
                    <span className="text-[11px] text-gray-300">{a}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'conflicts' && (
          <div>
            <p className="text-[9px] font-bold tracking-widest uppercase text-gray-600 mb-2">Canon Conflicts</p>
            {entry.conflicts.length === 0 ? (
              <div className="flex items-center gap-2 py-3">
                <FiCheck size={14} className="text-green-500" />
                <span className="text-[11px] text-green-500">No conflicts detected.</span>
              </div>
            ) : (
              <div className="space-y-2">
                {entry.conflicts.map((c, i) => (
                  <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg"
                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <FiAlertTriangle size={10} className="text-red-400 mt-0.5 flex-shrink-0" />
                    <span className="text-[11px] text-red-300 leading-snug">{c}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <p className="text-[9px] font-bold tracking-widest uppercase text-gray-600 mb-2">Version History</p>
            <div className="space-y-2">
              {VERSION_HISTORY.map((vh, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b"
                  style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black flex-shrink-0"
                    style={{ background: i === 0 ? `${cat.color}20` : 'rgba(255,255,255,0.05)', color: i === 0 ? cat.color : '#4B5563' }}>
                    v{vh.v}
                  </div>
                  <div>
                    <p className="text-[9px] font-semibold text-gray-400">{vh.author} · {vh.date}</p>
                    <p className="text-[10px] text-gray-500 leading-snug mt-0.5">{vh.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="p-3 border-t flex gap-2"
        style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold border transition-all hover:brightness-110"
          style={{ background: `${cat.color}12`, borderColor: `${cat.color}30`, color: cat.color }}>
          <FiEdit2 size={11} /> Edit Entry
        </button>
        <button className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-white/10 text-gray-500 hover:text-white transition-all">
          <FiGitBranch size={11} />
        </button>
      </div>
    </motion.div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function CanonKeeperHub() {
  const [activeCategory, setActiveCategory] = useState('characters');
  const [selectedEntry, setSelectedEntry]   = useState(null);
  const [searchQ, setSearchQ]               = useState('');
  const [viewMode, setViewMode]             = useState('list');
  const [filterStatus, setFilterStatus]     = useState('all');

  const cat    = CATEGORIES.find(c => c.id === activeCategory);
  const allEntries = ENTRIES[activeCategory] || [];
  const entries = allEntries
    .filter(e => filterStatus === 'all' || e.status === filterStatus)
    .filter(e => !searchQ || e.name.toLowerCase().includes(searchQ.toLowerCase()) || e.summary.toLowerCase().includes(searchQ.toLowerCase()));

  const disputedCount = Object.values(ENTRIES).flat().filter(e => e.status === 'disputed').length;
  const totalEntries  = Object.values(ENTRIES).flat().length;

  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#0a0a0a', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 h-12 flex-shrink-0 border-b"
        style={{ background: '#111', borderColor: 'rgba(255,255,255,0.08)' }}>
        <Link to="/griot" className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 transition-colors flex-shrink-0">
          <FiChevronLeft size={14} />
          <span className="text-xs font-bold hidden sm:block">Griot AI</span>
        </Link>
        <div className="w-px h-5 bg-white/10 flex-shrink-0" />
        <span className="text-sm font-bold text-white flex-shrink-0">📜 Canon Keeper</span>
        <span className="text-[10px] text-gray-600 hidden md:block">— Afrofuture Rising</span>
        <div className="flex-1" />
        {disputedCount > 0 && (
          <div className="flex items-center gap-1 text-[9px] px-2 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 font-bold flex-shrink-0">
            <FiAlertTriangle size={9} /> {disputedCount} disputed
          </div>
        )}
        <button className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border border-purple-500/30 bg-purple-500/10 text-purple-400 hover:brightness-110 transition-all flex-shrink-0">
          <FiPlus size={11} /> New Entry
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* ── Left: Category Nav ──────────────────────────────────────── */}
        <div className="w-44 flex-shrink-0 flex flex-col border-r overflow-y-auto"
          style={{ background: '#0d0d0d', borderColor: 'rgba(255,255,255,0.07)' }}>
          <div className="px-3 py-2.5 border-b"
            style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <p className="text-[9px] font-bold tracking-widest uppercase text-gray-600">Categories</p>
            <p className="text-[9px] text-gray-700 mt-0.5">{totalEntries} total entries</p>
          </div>
          {CATEGORIES.map(c => (
            <button key={c.id}
              onClick={() => { setActiveCategory(c.id); setSelectedEntry(null); }}
              className="flex items-center gap-2.5 px-3 py-2.5 text-left transition-all hover:bg-white/3"
              style={activeCategory === c.id
                ? { background: `${c.color}0e`, borderLeft: `2px solid ${c.color}` }
                : { borderLeft: '2px solid transparent' }}>
              <span className="text-base leading-none flex-shrink-0">{c.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate"
                  style={{ color: activeCategory === c.id ? c.color : '#D1D5DB' }}>
                  {c.label}
                </p>
              </div>
              <span className="text-[9px] font-mono flex-shrink-0"
                style={{ color: activeCategory === c.id ? c.color : '#4B5563' }}>
                {(ENTRIES[c.id] || []).length}
              </span>
            </button>
          ))}

          {/* Diff Viewer link */}
          <div className="mt-auto border-t p-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <button className="w-full flex items-center gap-2 text-[10px] text-gray-600 hover:text-gray-400 transition-colors">
              <FiGitBranch size={11} /> Version History
            </button>
          </div>
        </div>

        {/* ── Center: Entry List ──────────────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden relative">

          {/* Toolbar */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b flex-shrink-0"
            style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#0d0d0d' }}>
            <span className="text-base leading-none">{cat.emoji}</span>
            <span className="text-sm font-bold text-white">{cat.label}</span>
            <span className="text-[9px] text-gray-700 font-mono ml-0.5">({entries.length})</span>
            <div className="flex-1" />
            {/* Search */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/8 bg-white/3 w-40">
              <FiSearch size={11} className="text-gray-600 flex-shrink-0" />
              <input value={searchQ} onChange={e => setSearchQ(e.target.value)}
                placeholder="Search…"
                className="bg-transparent text-[11px] text-white outline-none placeholder-gray-700 w-full" />
            </div>
            {/* Status filter */}
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              className="text-[10px] font-semibold px-2 py-1.5 rounded-lg border border-white/8 bg-white/3 text-gray-400 outline-none cursor-pointer">
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="disputed">Disputed</option>
              <option value="draft">Draft</option>
            </select>
            {/* View toggle */}
            <div className="flex items-center gap-1">
              {[{ id:'list', icon:<FiList size={12}/> }, { id:'grid', icon:<FiGrid size={12}/> }].map(v => (
                <button key={v.id} onClick={() => setViewMode(v.id)}
                  className="w-7 h-7 rounded flex items-center justify-center transition-all"
                  style={viewMode === v.id ? { background:`${cat.color}20`, color:cat.color } : { color:'#6B7280' }}>
                  {v.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Entry list */}
          <div className="flex-1 overflow-y-auto p-4">
            {viewMode === 'list' ? (
              <div className="space-y-2 max-w-2xl">
                {entries.map((entry, i) => {
                  const st = STATUS_META[entry.status];
                  const isSelected = selectedEntry?.id === entry.id;
                  return (
                    <motion.button
                      key={entry.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => setSelectedEntry(isSelected ? null : entry)}
                      className="w-full flex items-start gap-3 px-4 py-3.5 rounded-xl border text-left transition-all hover:bg-white/3"
                      style={{
                        background: isSelected ? `${cat.color}08` : 'rgba(255,255,255,0.02)',
                        borderColor: isSelected ? `${cat.color}40` : entry.status === 'disputed' ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.07)',
                      }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                        style={{ background: `${cat.color}15` }}>
                        {cat.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-bold text-white">{entry.name}</span>
                          <span className="text-[8px] font-bold px-1.5 py-0.5 rounded flex-shrink-0"
                            style={{ background: st.bg, color: st.color }}>{st.label}</span>
                          {entry.conflicts.length > 0 && (
                            <FiAlertTriangle size={10} className="text-amber-400 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-[10px] text-gray-500 leading-snug truncate">{entry.summary.slice(0, 100)}…</p>
                        <div className="flex items-center gap-2 mt-1">
                          {entry.tags.slice(0,3).map(t => (
                            <span key={t} className="text-[8px] text-gray-700">{t}</span>
                          ))}
                          <span className="text-[8px] text-gray-700 ml-auto">v{entry.version} · {entry.updated}</span>
                        </div>
                      </div>
                      <FiChevronRight size={12} className="text-gray-700 flex-shrink-0 mt-1"
                        style={{ transform: isSelected ? 'rotate(90deg)' : 'none', color: isSelected ? cat.color : '#374151' }} />
                    </motion.button>
                  );
                })}
                {entries.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-700 text-sm">No entries match your filter.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-3xl">
                {entries.map((entry, i) => {
                  const st = STATUS_META[entry.status];
                  return (
                    <motion.button
                      key={entry.id}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => setSelectedEntry(selectedEntry?.id === entry.id ? null : entry)}
                      className="rounded-xl border p-4 text-left transition-all hover:brightness-110"
                      style={{ background: 'rgba(255,255,255,0.02)', borderColor: entry.status === 'disputed' ? 'rgba(245,158,11,0.25)' : 'rgba(255,255,255,0.07)' }}>
                      <div className="text-2xl mb-2">{cat.emoji}</div>
                      <p className="text-xs font-bold text-white mb-1 truncate">{entry.name}</p>
                      <p className="text-[9px] text-gray-600 line-clamp-2 leading-snug mb-2">{entry.summary.slice(0,80)}…</p>
                      <span className="text-[8px] font-bold px-1.5 py-0.5 rounded"
                        style={{ background: st.bg, color: st.color }}>{st.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Entry detail panel (right overlay) */}
          <AnimatePresence>
            {selectedEntry && (
              <EntryDetail
                entry={selectedEntry}
                category={activeCategory}
                onClose={() => setSelectedEntry(null)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
