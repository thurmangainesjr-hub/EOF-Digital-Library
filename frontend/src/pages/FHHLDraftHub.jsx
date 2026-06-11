import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiChevronLeft, FiSearch, FiPlus, FiCheck,
  FiUsers, FiX, FiSettings, FiChevronDown, FiChevronUp,
} from 'react-icons/fi';

// ── DRAFT RULES ───────────────────────────────────────────────────────────────
const SEASONAL_PICKS    = 3;             // new picks per team per season (upgrades)
const TEAM_SIZES        = [12, 16, 20];  // pro (fantasy owner) team count options
const POOL_SIZES        = [20, 25, 30];  // non-pro team count in pool
const ROSTER_MAIN       = 5;            // mainstream slots per pro team
const ROSTER_NONMAIN    = 5;            // non-mainstream slots per pro team
const ROSTER_SIZE       = ROSTER_MAIN + ROSTER_NONMAIN; // 10 total

const TIER_COLOR = { S:'#D4AF37', A:'#8B5CF6', B:'#3B82F6', C:'#10B981' };
const TIER_BG    = { S:'rgba(212,175,55,0.12)', A:'rgba(139,92,246,0.12)', B:'rgba(59,130,246,0.12)', C:'rgba(16,185,129,0.12)' };

// ── NON-PRO TEAM SQUADS ───────────────────────────────────────────────────────
// These are the squads in the draft pool. Each has exactly 8 artists.
// pool size setting (20/25/30) controls how many total squads are visible.
// 8 named squads below + placeholder squads generated to fill up to 30.
const NAMED_SQUADS = [
  {
    id:'np01', name:'East Coast Legends', type:'classic', color:'#EF4444',
    region:'NYC / Tri-State', record:'12-4', pts:2890,
    artists:[
      { id:'a03', name:'Jay-Z',         emoji:'🎤', tier:'S', proj:260, mainstream:false, genre:'East Coast' },
      { id:'a05', name:'Biggie Smalls', emoji:'🎤', tier:'S', proj:252, mainstream:false, genre:'NYC' },
      { id:'a07', name:'Nas',           emoji:'🎤', tier:'S', proj:244, mainstream:false, genre:'Queens' },
      { id:'a17', name:'Rakim',         emoji:'🎤', tier:'A', proj:195, mainstream:false, genre:'Old School' },
      { id:'a22', name:'Busta Rhymes',  emoji:'🎤', tier:'B', proj:189, mainstream:false, genre:'NYC' },
      { id:'a23', name:'DMX',           emoji:'🎤', tier:'B', proj:185, mainstream:false, genre:'Yonkers' },
      { id:'a20', name:'Big L',         emoji:'🎤', tier:'B', proj:178, mainstream:false, genre:'Harlem' },
      { id:'a25', name:'KRS-One',       emoji:'🎤', tier:'C', proj:168, mainstream:false, genre:'Bronx' },
    ],
  },
  {
    id:'np02', name:'West & Conscious', type:'classic', color:'#3B82F6',
    region:'LA / Chicago', record:'11-5', pts:2841,
    artists:[
      { id:'a01', name:'Kendrick Lamar', emoji:'🎤', tier:'S', proj:301, mainstream:false, genre:'West Coast' },
      { id:'a04', name:'Tupac Shakur',   emoji:'🎤', tier:'S', proj:258, mainstream:false, genre:'West Coast' },
      { id:'a06', name:'J. Cole',        emoji:'🎤', tier:'S', proj:248, mainstream:false, genre:'Conscious' },
      { id:'a08', name:'Eminem',         emoji:'🎤', tier:'S', proj:241, mainstream:false, genre:'Detroit' },
      { id:'a21', name:'Ice Cube',       emoji:'🎤', tier:'B', proj:194, mainstream:false, genre:'West Coast' },
      { id:'a14', name:'Common',         emoji:'🎤', tier:'A', proj:210, mainstream:false, genre:'Chicago' },
      { id:'a18', name:'Lupe Fiasco',    emoji:'🎤', tier:'B', proj:188, mainstream:false, genre:'Chicago' },
      { id:'a16', name:'Mos Def',        emoji:'🎤', tier:'A', proj:198, mainstream:false, genre:'Brooklyn' },
    ],
  },
  {
    id:'np03', name:'Soul Royalty', type:'classic', color:'#EC4899',
    region:'Nationwide', record:'10-6', pts:2780,
    artists:[
      { id:'a02', name:'Lauryn Hill',      emoji:'🎤', tier:'S', proj:270, mainstream:false, genre:'Neo Soul' },
      { id:'a09', name:'Andre 3000',       emoji:'🎤', tier:'A', proj:238, mainstream:false, genre:'ATL' },
      { id:'a10', name:'Missy Elliott',    emoji:'🎤', tier:'A', proj:235, mainstream:false, genre:'Hip-Hop R&B' },
      { id:'a15', name:'Queen Latifah',    emoji:'🎤', tier:'A', proj:204, mainstream:false, genre:'Jersey' },
      { id:'a24', name:'Pharrell Williams',emoji:'🎤', tier:'B', proj:183, mainstream:false, genre:'Virginia' },
      { id:'a19', name:'Eve',              emoji:'🎤', tier:'B', proj:182, mainstream:false, genre:'Philly' },
      { id:'a30', name:'J Dilla',          emoji:'🎤', tier:'C', proj:162, mainstream:false, genre:'Detroit' },
      { id:'a27', name:'Wyclef Jean',      emoji:'🎤', tier:'C', proj:165, mainstream:false, genre:'Haiti' },
    ],
  },
  {
    id:'np04', name:'Lyrical Fire', type:'classic', color:'#F97316',
    region:'Nationwide', record:'9-7', pts:2710,
    artists:[
      { id:'a11', name:'Lil Wayne',         emoji:'🎤', tier:'A', proj:228, mainstream:false, genre:'New Orleans' },
      { id:'a12', name:'Drake',             emoji:'🎤', tier:'A', proj:225, mainstream:false, genre:'Toronto' },
      { id:'a13', name:'Nicki Minaj',       emoji:'🎤', tier:'A', proj:220, mainstream:false, genre:'Queens' },
      { id:'a26', name:'Chance the Rapper', emoji:'🎤', tier:'C', proj:172, mainstream:false, genre:'Chicago' },
      { id:'a28', name:'Cardi B',           emoji:'🎤', tier:'C', proj:178, mainstream:false, genre:'Bronx' },
      { id:'a29', name:'Mac Miller',        emoji:'🎤', tier:'C', proj:174, mainstream:false, genre:'Pittsburgh' },
      { id:'a06b',name:'J. Cole',           emoji:'🎤', tier:'S', proj:245, mainstream:false, genre:'Conscious' },
      { id:'a16b',name:'Mos Def',           emoji:'🎤', tier:'A', proj:196, mainstream:false, genre:'Brooklyn' },
    ],
  },
  {
    id:'np05', name:'Trap Dynasty', type:'mainstream', color:'#10B981',
    region:'Atlanta / South', record:'8-8', pts:2640,
    artists:[
      { id:'f05', name:'Lil Baby',    emoji:'🎤', tier:'A', proj:201, mainstream:true, genre:'Atlanta' },
      { id:'f06', name:'Future',      emoji:'🎤', tier:'A', proj:198, mainstream:true, genre:'Atlanta' },
      { id:'f11', name:'Polo G',      emoji:'🎤', tier:'B', proj:182, mainstream:true, genre:'Chicago' },
      { id:'f12', name:'Lil Durk',    emoji:'🎤', tier:'B', proj:179, mainstream:true, genre:'Chicago' },
      { id:'f13', name:'Gunna',       emoji:'🎤', tier:'B', proj:176, mainstream:true, genre:'Atlanta' },
      { id:'f19', name:'Kevin Gates', emoji:'🎤', tier:'C', proj:159, mainstream:true, genre:'Louisiana' },
      { id:'f20', name:'Roddy Ricch', emoji:'🎤', tier:'C', proj:157, mainstream:true, genre:'Compton' },
      { id:'f25', name:'YG',          emoji:'🎤', tier:'C', proj:146, mainstream:true, genre:'Compton' },
    ],
  },
  {
    id:'np06', name:'Empire State Current', type:'mainstream', color:'#8B5CF6',
    region:'NYC / East', record:'8-8', pts:2605,
    artists:[
      { id:'f07', name:'A$AP Rocky',   emoji:'🎤', tier:'A', proj:196, mainstream:true, genre:'Harlem' },
      { id:'f08', name:'Pusha T',      emoji:'🎤', tier:'A', proj:193, mainstream:true, genre:'Virginia' },
      { id:'f10', name:'Jack Harlow',  emoji:'🎤', tier:'B', proj:185, mainstream:true, genre:'Louisville' },
      { id:'f14', name:'Meek Mill',    emoji:'🎤', tier:'B', proj:173, mainstream:true, genre:'Philly' },
      { id:'f15', name:'Rick Ross',    emoji:'🎤', tier:'B', proj:171, mainstream:true, genre:'Miami' },
      { id:'f16', name:'Big Sean',     emoji:'🎤', tier:'B', proj:169, mainstream:true, genre:'Detroit' },
      { id:'f23', name:'Isaiah Rashad',emoji:'🎤', tier:'C', proj:150, mainstream:true, genre:'Chattanooga' },
      { id:'f24', name:'Joyner Lucas', emoji:'🎤', tier:'C', proj:148, mainstream:true, genre:'Worcester' },
    ],
  },
  {
    id:'np07', name:'Femme Royale', type:'mainstream', color:'#F59E0B',
    region:'Nationwide', record:'7-9', pts:2555,
    artists:[
      { id:'f02', name:'Travis Scott', emoji:'🎤', tier:'A', proj:214, mainstream:true, genre:'Houston' },
      { id:'f03', name:'SZA',          emoji:'🎤', tier:'A', proj:209, mainstream:true, genre:'NJ Alt-R&B' },
      { id:'f04', name:'Doja Cat',     emoji:'🎤', tier:'A', proj:206, mainstream:true, genre:'LA Pop-Rap' },
      { id:'f09', name:'Rod Wave',     emoji:'🎤', tier:'B', proj:188, mainstream:true, genre:'FL Emo-Trap' },
      { id:'f17', name:'Baby Keem',    emoji:'🎤', tier:'C', proj:164, mainstream:true, genre:'Vegas' },
      { id:'f18', name:'Don Toliver',  emoji:'🎤', tier:'C', proj:161, mainstream:true, genre:'Houston' },
      { id:'f21', name:'Vince Staples',emoji:'🎤', tier:'C', proj:155, mainstream:true, genre:'Long Beach' },
      { id:'f22', name:'Freddie Gibbs',emoji:'🎤', tier:'C', proj:152, mainstream:true, genre:'Gary, IN' },
    ],
  },
  {
    id:'np08', name:'Avant-Garde Collective', type:'mainstream', color:'#14B8A6',
    region:'LA / New York', record:'6-10', pts:2490,
    artists:[
      { id:'f01', name:'Tyler the Creator', emoji:'🎤', tier:'A', proj:218, mainstream:true, genre:'LA Avant-Rap' },
      { id:'f07b',name:'A$AP Rocky',        emoji:'🎤', tier:'A', proj:194, mainstream:true, genre:'Harlem' },
      { id:'f17b',name:'Baby Keem',         emoji:'🎤', tier:'C', proj:162, mainstream:true, genre:'Vegas' },
      { id:'f18b',name:'Don Toliver',       emoji:'🎤', tier:'C', proj:159, mainstream:true, genre:'Houston' },
      { id:'f21b',name:'Vince Staples',     emoji:'🎤', tier:'C', proj:153, mainstream:true, genre:'Long Beach' },
      { id:'f22b',name:'Freddie Gibbs',     emoji:'🎤', tier:'C', proj:150, mainstream:true, genre:'Gary' },
      { id:'f23b',name:'Isaiah Rashad',     emoji:'🎤', tier:'C', proj:148, mainstream:true, genre:'Chattanooga' },
      { id:'f24b',name:'Joyner Lucas',      emoji:'🎤', tier:'C', proj:146, mainstream:true, genre:'Worcester' },
    ],
  },
];

// Placeholder squads to fill pool up to 30
const PLACEHOLDER_SQUADS = Array.from({ length: 22 }, (_, i) => {
  const idx = i + 9;
  const colors = ['#6366F1','#A855F7','#D97706','#059669','#DC2626','#0891B2','#65A30D','#9333EA','#C2410C','#0F766E','#1D4ED8'];
  const names  = [
    'Chi-Town Boom Bap','Southern Smoke','Pacific Rim Rap','Midwest Grind',
    'Afrobeats Alliance','Trap Gospel','Brooklyn Renaissance','Harlem Renaissance',
    'New Wave Collective','Philly Grime','Houston Legends','Detroit Cypher',
    'Oakland Artillery','ATL Classic','Jersey Hip-Hop','Dirty South Elite',
    'Empire Wave','Crown Rap','Bay Area Finest','Underground Kings',
    'West Side Story','East Side Riders',
  ];
  return {
    id:`np${String(idx).padStart(2,'0')}`,
    name: names[i] || `Squad ${idx}`,
    type: i % 2 === 0 ? 'mainstream' : 'classic',
    color: colors[i % colors.length],
    region:'Various',
    record:`${Math.floor(Math.random()*12)}-${Math.floor(Math.random()*12)}`,
    pts: 2400 - (i * 40),
    artists: Array.from({ length: 8 }, (_, j) => ({
      id:`g${idx}_${j}`,
      name:`Artist ${j+1}`,
      emoji:'🎤',
      tier: ['S','A','B','C'][Math.floor(j/2)],
      proj: 240 - (i*8) - (j*10),
      mainstream: i % 2 === 0,
      genre:'Hip-Hop',
    })),
  };
});

const ALL_SQUADS = [...NAMED_SQUADS, ...PLACEHOLDER_SQUADS];

// ── FREE AGENTS — mainstream artists on the waiver wire ───────────────────────
const FREE_AGENTS = [
  { id:'f01', name:'Tyler the Creator', emoji:'🎤', genre:'LA / Avant-Rap',      era:'2010s–Present', tier:'A', proj:218, hot:true,  owned:8,
    stats:{ albums:7, grammys:2, streams:'4.8B', peak:1 }, songs:['EARFQUAKE','NEW MAGIC WAND','See You Again','IGOR\'S THEME'] },
  { id:'f02', name:'Travis Scott',      emoji:'🎤', genre:'Houston / Astro-Rap', era:'2010s–Present', tier:'A', proj:214, hot:true,  owned:15,
    stats:{ albums:4, grammys:0, streams:'10.2B',peak:1 }, songs:['SICKO MODE','GOOSEBUMPS','Antidote','MY EYES'] },
  { id:'f03', name:'SZA',              emoji:'🎤', genre:'NJ / Alt-R&B-Rap',    era:'2010s–Present', tier:'A', proj:209, hot:true,  owned:22,
    stats:{ albums:2, grammys:2, streams:'7.1B', peak:1 }, songs:['Kill Bill','Good Days','Snooze','Nobody Gets Me'] },
  { id:'f04', name:'Doja Cat',          emoji:'🎤', genre:'LA / Pop-Rap',        era:'2010s–Present', tier:'A', proj:206, hot:true,  owned:19,
    stats:{ albums:3, grammys:3, streams:'8.4B', peak:1 }, songs:['Kiss Me More','Need to Know','Say So','Planet Her'] },
  { id:'f05', name:'Lil Baby',          emoji:'🎤', genre:'Atlanta / Trap',      era:'2010s–Present', tier:'A', proj:201, hot:false, owned:31,
    stats:{ albums:3, grammys:0, streams:'9.3B', peak:1 }, songs:['Drip Too Hard','Woah','The Bigger Picture','On Me'] },
  { id:'f06', name:'Future',            emoji:'🎤', genre:'Atlanta / Trap',      era:'2010s–Present', tier:'A', proj:198, hot:false, owned:28,
    stats:{ albums:9, grammys:0, streams:'8.7B', peak:1 }, songs:['Mask Off','Low Life','March Madness','Jumpman'] },
  { id:'f07', name:'A$AP Rocky',        emoji:'🎤', genre:'Harlem / Cloud-Rap',  era:'2010s–Present', tier:'A', proj:196, hot:true,  owned:12,
    stats:{ albums:3, grammys:0, streams:'5.2B', peak:1 }, songs:['Praise the Lord','Fashion Killa','F**kin\' Problems'] },
  { id:'f08', name:'Pusha T',           emoji:'🎤', genre:'VA / Coke-Rap',       era:'2000s–Present', tier:'A', proj:193, hot:false, owned:9,
    stats:{ albums:4, grammys:0, streams:'1.9B', peak:1 }, songs:['Infrared','Santeria','If You Know You Know'] },
  { id:'f09', name:'Rod Wave',          emoji:'🎤', genre:'FL / Emo-Trap',       era:'2010s–Present', tier:'B', proj:188, hot:true,  owned:25,
    stats:{ albums:5, grammys:0, streams:'5.6B', peak:1 }, songs:['Heart on Ice','Tombstone','Richer','Dark Clouds'] },
  { id:'f10', name:'Jack Harlow',       emoji:'🎤', genre:'Louisville / Pop-Rap',era:'2010s–Present', tier:'B', proj:185, hot:false, owned:18,
    stats:{ albums:2, grammys:0, streams:'3.8B', peak:1 }, songs:["What's Poppin",'First Class','Churchill Downs'] },
  { id:'f11', name:'Polo G',            emoji:'🎤', genre:'Chicago / Drill',     era:'2010s–Present', tier:'B', proj:182, hot:false, owned:21,
    stats:{ albums:3, grammys:0, streams:'4.1B', peak:1 }, songs:['Pop Out','Rapstar','Through da Storm','Martin & Gina'] },
  { id:'f12', name:'Lil Durk',          emoji:'🎤', genre:'Chicago / Drill',     era:'2010s–Present', tier:'B', proj:179, hot:false, owned:34,
    stats:{ albums:7, grammys:0, streams:'5.9B', peak:1 }, songs:['Broadway Girls','The Voice','Still Trappin'] },
  { id:'f13', name:'Gunna',             emoji:'🎤', genre:'Atlanta / Melodic',   era:'2010s–Present', tier:'B', proj:176, hot:false, owned:16,
    stats:{ albums:4, grammys:0, streams:'4.4B', peak:1 }, songs:['Drip Season','Sold Out Dates','Banking on Me'] },
  { id:'f14', name:'Meek Mill',         emoji:'🎤', genre:'Philly / Trap',       era:'2010s–Present', tier:'B', proj:173, hot:false, owned:11,
    stats:{ albums:5, grammys:0, streams:'3.2B', peak:1 }, songs:['Ima Boss','All Eyes on You','Going Bad'] },
  { id:'f15', name:'Rick Ross',         emoji:'🎤', genre:'Miami / Boss-Rap',    era:'2000s–Present', tier:'B', proj:171, hot:false, owned:8,
    stats:{ albums:12, grammys:0, streams:'2.8B', peak:1 }, songs:['Hustlin\'','BMF','Aston Martin Music'] },
  { id:'f16', name:'Big Sean',          emoji:'🎤', genre:'Detroit / Pop-Rap',   era:'2010s–Present', tier:'B', proj:169, hot:false, owned:14,
    stats:{ albums:5, grammys:0, streams:'3.4B', peak:1 }, songs:['Bounce Back','IDFWU','Blessings'] },
  { id:'f17', name:'Baby Keem',         emoji:'🎤', genre:'Vegas / New-Wave',    era:'2020s–Present', tier:'C', proj:164, hot:true,  owned:7,
    stats:{ albums:1, grammys:1, streams:'2.1B', peak:1 }, songs:['family ties','LOST SOULS','16','The Hillbillies'] },
  { id:'f18', name:'Don Toliver',       emoji:'🎤', genre:'Houston / Melodic',   era:'2010s–Present', tier:'C', proj:161, hot:true,  owned:6,
    stats:{ albums:3, grammys:0, streams:'3.0B', peak:1 }, songs:['No Idea','After Party','Cardigan','Way Bigger'] },
  { id:'f19', name:'Kevin Gates',       emoji:'🎤', genre:'Louisiana / Street',  era:'2010s–Present', tier:'C', proj:159, hot:false, owned:10,
    stats:{ albums:4, grammys:0, streams:'2.6B', peak:2 }, songs:['2 Phones','Paper Chasers','I\'m Him'] },
  { id:'f20', name:'Roddy Ricch',       emoji:'🎤', genre:'Compton / Melodic',   era:'2010s–Present', tier:'C', proj:157, hot:false, owned:20,
    stats:{ albums:2, grammys:1, streams:'4.8B', peak:1 }, songs:['The Box','Heartless','High Fashion'] },
  { id:'f21', name:'Vince Staples',     emoji:'🎤', genre:'Long Beach / Conscious',era:'2010s–Present',tier:'C', proj:155, hot:false, owned:5,
    stats:{ albums:5, grammys:0, streams:'1.4B', peak:4 }, songs:['Norf Norf','Lift Me Up','FUN!'] },
  { id:'f22', name:'Freddie Gibbs',     emoji:'🎤', genre:'Gary / Gangsta-Rap',  era:'2000s–Present', tier:'C', proj:152, hot:false, owned:4,
    stats:{ albums:6, grammys:0, streams:'1.1B', peak:3 }, songs:['Scottie Beam','Fake Names','Crime Pays'] },
  { id:'f23', name:'Isaiah Rashad',     emoji:'🎤', genre:'Chattanooga / Cali',  era:'2010s–Present', tier:'C', proj:150, hot:false, owned:6,
    stats:{ albums:3, grammys:0, streams:'1.3B', peak:3 }, songs:['Free Lunch','Headshots','Lay Wit Ya'] },
  { id:'f24', name:'Joyner Lucas',      emoji:'🎤', genre:'Worcester / Storytelling',era:'2010s–Present',tier:'C',proj:148,hot:false,owned:5,
    stats:{ albums:2, grammys:0, streams:'1.2B', peak:5 }, songs:['I Love','ADHD','Keep It 100'] },
  { id:'f25', name:'YG',                emoji:'🎤', genre:'Compton / G-Funk',    era:'2010s–Present', tier:'C', proj:146, hot:false, owned:8,
    stats:{ albums:5, grammys:0, streams:'2.3B', peak:1 }, songs:['My Hitta','FDT','Who Do You Love?'] },
];

const FA_ACTIVITY = [
  { team:'Lyric Empire',     action:'claimed',  artist:'SZA',           dropped:'Big L',        time:'2h ago' },
  { team:'Crown Council',    action:'claimed',  artist:'Travis Scott',  dropped:'KRS-One',      time:'4h ago' },
  { team:'Thread Runners',   action:'claimed',  artist:'Lil Baby',      dropped:'Wyclef Jean',  time:'6h ago' },
  { team:'Bars & Bonds',     action:'dropped',  artist:'Chance the Rapper', dropped:null,       time:'8h ago' },
  { team:'Archive Breakers', action:'claimed',  artist:'Rod Wave',      dropped:'DMX',          time:'12h ago' },
  { team:'Sankofa Squad',    action:'claimed',  artist:'Future',        dropped:'Cardi B',      time:'1d ago' },
];

const WAIVER_PRIORITY = [
  'Kingdom Verses','Afrobeat United','Third Eye FC','Infinite Keys',
  'The Frequency','Meridian Flow','Crown Council','Soul Circuit',
  'Fire & Finesse','Bars & Bonds','The Cyphers','Lyric Empire',
  'Archive Breakers','Ancestor Walk','Thread Runners','Sankofa Squad',
  'Legacy Grid','Afrofuture FC','Crown Cypher','Griot Nation',
];

// ── PRO TEAMS ─────────────────────────────────────────────────────────────────
// Each has a `mainstream` array (5 slots) and `nonMainstream` array (5 slots)
const ALL_PRO_TEAMS = [
  {
    id:'t01', name:'Griot Nation', owner:'Thurman G.', color:'#8B5CF6', isMe:true,
    nonMainstream:['a01','a03','a07','a02','a09'],   // Kendrick, Jay-Z, Nas, Lauryn Hill, Andre 3000
    mainstream:   ['f03','f02','f01','f07','f09'],   // SZA, Travis Scott, Tyler, A$AP Rocky, Rod Wave
    seasonPicks:  3,
  },
  {
    id:'t02', name:'Crown Cypher', owner:'Marcus O.', color:'#EF4444', isMe:false,
    nonMainstream:['a05','a08','a06','a04','a22'],
    mainstream:   ['f05','f06','f11','f04','f12'],
    seasonPicks:  2,
  },
  {
    id:'t03', name:'Afrofuture FC', owner:'Zara M.', color:'#F59E0B', isMe:false,
    nonMainstream:['a10','a17','a16','a11','a14'],
    mainstream:   ['f10','f13','f14','f19','f16'],
    seasonPicks:  3,
  },
  {
    id:'t04', name:'Legacy Grid', owner:'Elder K.', color:'#10B981', isMe:false,
    nonMainstream:['a12','a13','a15','a24','a19'],
    mainstream:   ['f15','f08','f20','f23','f24'],
    seasonPicks:  1,
  },
  {
    id:'t05', name:'Sankofa Squad', owner:'Seun A.', color:'#EC4899', isMe:false,
    nonMainstream:['a21','a18','a20','a25','a26'],
    mainstream:   ['f06','f17','f18','f25','f21'],
    seasonPicks:  3,
  },
  {
    id:'t06', name:'Thread Runners', owner:'Amara D.', color:'#06B6D4', isMe:false,
    nonMainstream:['a23','a27','a30','a28','a29'],
    mainstream:   ['f09','f22','f19','f12','f13'],
    seasonPicks:  2,
  },
  {
    id:'t07', name:'Ancestor Walk', owner:'Kweku T.', color:'#F97316', isMe:false,
    nonMainstream:['a01','a02','a08','a11','a12'],
    mainstream:   ['f01','f04','f07','f16','f10'],
    seasonPicks:  3,
  },
  {
    id:'t08', name:'Archive Breakers', owner:'Nana B.', color:'#14B8A6', isMe:false,
    nonMainstream:['a03','a04','a06','a13','a14'],
    mainstream:   ['f02','f05','f08','f11','f15'],
    seasonPicks:  2,
  },
  {
    id:'t09', name:'Lyric Empire', owner:'Jide A.', color:'#A855F7', isMe:false,
    nonMainstream:['a05','a07','a09','a15','a16'],
    mainstream:   ['f03','f06','f09','f12','f17'],
    seasonPicks:  3,
  },
  {
    id:'t10', name:'The Cyphers', owner:'Adaeze N.', color:'#D97706', isMe:false,
    nonMainstream:['a10','a17','a18','a19','a20'],
    mainstream:   ['f04','f07','f10','f13','f18'],
    seasonPicks:  1,
  },
  {
    id:'t11', name:'Bars & Bonds', owner:'Femi O.', color:'#059669', isMe:false,
    nonMainstream:['a21','a22','a23','a24','a25'],
    mainstream:   ['f05','f08','f11','f14','f19'],
    seasonPicks:  2,
  },
  {
    id:'t12', name:'Fire & Finesse', owner:'Ayo D.', color:'#DC2626', isMe:false,
    nonMainstream:['a26','a27','a28','a29','a30'],
    mainstream:   ['f02','f06','f12','f16','f20'],
    seasonPicks:  3,
  },
  {
    id:'t13', name:'Soul Circuit', owner:'Ife W.', color:'#7C3AED', isMe:false,
    nonMainstream:['a01','a05','a10','a15','a20'],
    mainstream:   ['f01','f05','f09','f13','f17'],
    seasonPicks:  2,
  },
  {
    id:'t14', name:'Crown Council', owner:'Dami O.', color:'#B45309', isMe:false,
    nonMainstream:['a02','a06','a11','a16','a21'],
    mainstream:   ['f02','f06','f10','f14','f18'],
    seasonPicks:  3,
  },
  {
    id:'t15', name:'Meridian Flow', owner:'Temi A.', color:'#0891B2', isMe:false,
    nonMainstream:['a03','a07','a12','a17','a22'],
    mainstream:   ['f03','f07','f11','f15','f19'],
    seasonPicks:  1,
  },
  {
    id:'t16', name:'The Frequency', owner:'Chidi E.', color:'#65A30D', isMe:false,
    nonMainstream:['a04','a08','a13','a18','a23'],
    mainstream:   ['f04','f08','f12','f16','f20'],
    seasonPicks:  2,
  },
  {
    id:'t17', name:'Infinite Keys', owner:'Sola B.', color:'#9333EA', isMe:false,
    nonMainstream:['a09','a14','a19','a24','a29'],
    mainstream:   ['f05','f09','f13','f17','f21'],
    seasonPicks:  3,
  },
  {
    id:'t18', name:'Third Eye FC', owner:'Kemi R.', color:'#C2410C', isMe:false,
    nonMainstream:['a25','a26','a27','a28','a30'],
    mainstream:   ['f06','f10','f14','f18','f22'],
    seasonPicks:  2,
  },
  {
    id:'t19', name:'Afrobeat United', owner:'Ola M.', color:'#0F766E', isMe:false,
    nonMainstream:['a01','a04','a07','a10','a13'],
    mainstream:   ['f01','f04','f07','f10','f13'],
    seasonPicks:  3,
  },
  {
    id:'t20', name:'Kingdom Verses', owner:'Dele F.', color:'#1D4ED8', isMe:false,
    nonMainstream:['a02','a05','a08','a11','a14'],
    mainstream:   ['f02','f05','f08','f11','f14'],
    seasonPicks:  1,
  },
];

// Build a flat artist lookup from all squads
function buildArtistLookup() {
  const map = {};
  NAMED_SQUADS.forEach(sq => sq.artists.forEach(a => { map[a.id] = a; }));
  FREE_AGENTS.forEach(a => { map[a.id] = a; });
  return map;
}
const ARTIST_LOOKUP = buildArtistLookup();

// ── ARTIST MINI CARD ──────────────────────────────────────────────────────────
function ArtistChip({ artistId, showSlot, isMainstream }) {
  const a = ARTIST_LOOKUP[artistId];
  if (!a) return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed"
         style={{ borderColor:'rgba(255,255,255,0.08)' }}>
      <span className="text-[9px] text-gray-700">— empty slot</span>
    </div>
  );
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg border"
         style={{ background:'rgba(255,255,255,0.02)', borderColor:`${TIER_COLOR[a.tier]}25` }}>
      <span className="text-xs">{a.emoji}</span>
      <span className="text-[10px] font-bold text-white flex-1 truncate">{a.name}</span>
      <span className="text-[8px] font-black px-1 py-px rounded"
            style={{ background:TIER_BG[a.tier], color:TIER_COLOR[a.tier] }}>{a.tier}</span>
      <span className="text-[9px] font-bold" style={{ color:TIER_COLOR[a.tier] }}>{a.proj}</span>
      {isMainstream !== undefined && (
        <span className={`text-[7px] font-bold px-1 py-px rounded-full ${isMainstream ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>
          {isMainstream ? 'MS' : 'NM'}
        </span>
      )}
    </div>
  );
}

// ── SQUAD CARD (non-pro team) ─────────────────────────────────────────────────
function SquadCard({ squad, draftedIds, onClick, isSelected }) {
  const available = squad.artists.filter(a => !draftedIds.has(a.id)).length;
  return (
    <motion.button layout onClick={onClick}
      className="w-full text-left rounded-xl border p-4 transition-all hover:brightness-105"
      style={{
        background: isSelected ? `${squad.color}08` : 'rgba(255,255,255,0.02)',
        borderColor: isSelected ? `${squad.color}40` : 'rgba(255,255,255,0.07)',
      }}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0"
             style={{ background:`${squad.color}20`, color:squad.color }}>
          {squad.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-black text-white truncate">{squad.name}</span>
            <span className="text-[8px] font-bold px-1.5 py-px rounded-full"
                  style={{ background:`${squad.color}15`, color:squad.color }}>
              {squad.type === 'mainstream' ? 'Current' : 'Classic'}
            </span>
          </div>
          <p className="text-[9px] text-gray-600">{squad.region} · {squad.record}</p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-[9px] font-bold" style={{ color:squad.color }}>{squad.pts} pts</span>
            <span className="text-[9px] text-green-400 font-bold">{available}/8 available</span>
            <span className="text-[9px] text-gray-700">8 artists</span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

// ── SQUAD DETAIL PANEL ────────────────────────────────────────────────────────
function SquadDetail({ squad, draftedIds, onClose }) {
  if (!squad) return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
      className="flex flex-col items-center justify-center h-full text-center px-8">
      <span className="text-4xl mb-3">🏟️</span>
      <p className="text-sm font-bold text-gray-500">Select a squad</p>
      <p className="text-xs text-gray-700 mt-1">View all 8 artists in each non-pro team. Draft individual artists to fill your pro team's roster.</p>
    </motion.div>
  );
  return (
    <motion.div key={squad.id} initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }}
      exit={{ opacity:0, x:16 }} transition={{ type:'spring', damping:26, stiffness:260 }}
      className="flex flex-col h-full border-l"
      style={{ background:'#0f0f0f', borderColor:'rgba(255,255,255,0.07)' }}>

      <div className="flex items-start justify-between px-5 py-4 border-b"
           style={{ borderColor:'rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg"
               style={{ background:`${squad.color}20`, color:squad.color }}>{squad.name[0]}</div>
          <div>
            <p className="text-sm font-black text-white">{squad.name}</p>
            <p className="text-[10px] text-gray-600">{squad.region} · {squad.record} · {squad.pts} pts</p>
            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full mt-0.5 inline-block"
                  style={{ background:`${squad.color}15`, color:squad.color }}>
              {squad.type === 'mainstream' ? 'Current Era' : 'Classic Legacy'}
            </span>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-700 hover:text-white transition-colors"><FiX size={14}/></button>
      </div>

      <div className="px-4 py-3 border-b flex items-center gap-4"
           style={{ borderColor:'rgba(255,255,255,0.06)', background:'rgba(255,255,255,0.01)' }}>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
          <span className="text-[10px] font-bold text-green-400">
            {squad.artists.filter(a => !draftedIds.has(a.id)).length} of 8 Available
          </span>
        </div>
        <span className="text-[9px] text-gray-700">·</span>
        <span className="text-[9px] text-amber-400">
          {squad.artists.filter(a => draftedIds.has(a.id)).length} Drafted
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <p className="text-[9px] font-bold tracking-widest uppercase text-gray-700 mb-3">8 Artist Roster</p>
        {squad.artists.map((artist, i) => {
          const isDrafted = draftedIds.has(artist.id);
          return (
            <div key={artist.id}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all"
              style={{
                background: isDrafted ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.03)',
                borderColor: isDrafted ? 'rgba(255,255,255,0.04)' : `${TIER_COLOR[artist.tier]}25`,
                opacity: isDrafted ? 0.45 : 1,
              }}>
              <span className="text-[9px] font-black text-gray-700 w-4">#{i+1}</span>
              <span className="text-base">{artist.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-white truncate">{artist.name}</span>
                  <span className="text-[7px] font-black px-1 py-px rounded"
                        style={{ background:TIER_BG[artist.tier], color:TIER_COLOR[artist.tier] }}>{artist.tier}</span>
                </div>
                <p className="text-[9px] text-gray-600">{artist.genre}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-black" style={{ color: isDrafted ? '#4B5563' : TIER_COLOR[artist.tier] }}>
                  {artist.proj}
                </p>
                <p className="text-[8px]" style={{ color: isDrafted ? '#374151' : '#6B7280' }}>
                  {isDrafted ? 'Drafted' : 'Available'}
                </p>
              </div>
              {!isDrafted && (
                <span className="text-[8px] font-bold text-amber-400 ml-1">
                  {artist.mainstream ? '📺 MS' : '🎤 NM'}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ── PRO TEAM ROW (collapsible, 5+5 roster) ───────────────────────────────────
function ProTeamRow({ team, rank }) {
  const [open, setOpen] = useState(false);
  const mainArtists    = (team.mainstream    || []).map(id => ARTIST_LOOKUP[id]).filter(Boolean);
  const nonMainArtists = (team.nonMainstream || []).map(id => ARTIST_LOOKUP[id]).filter(Boolean);
  const totalPts = [...mainArtists, ...nonMainArtists].reduce((s, a) => s + a.proj, 0);

  return (
    <div className="rounded-xl border overflow-hidden"
         style={{ borderColor: team.isMe ? `${team.color}40` : 'rgba(255,255,255,0.07)',
                  background:   team.isMe ? `${team.color}06` : 'rgba(255,255,255,0.015)' }}>
      <button className="w-full flex items-center gap-3 px-4 py-3 text-left"
              onClick={() => setOpen(o => !o)}>
        <span className="text-[10px] font-black text-gray-600 w-5">#{rank}</span>
        <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0"
             style={{ background:team.color, color:'#fff' }}>
          {team.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white truncate">{team.name}</span>
            {team.isMe && <span className="text-[8px] px-1.5 py-px rounded-full text-white font-bold" style={{ background:team.color }}>YOU</span>}
          </div>
          <p className="text-[9px] text-gray-600">{team.owner} · {team.seasonPicks} seasonal picks left</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-[9px] px-1.5 py-0.5 rounded font-bold"
                style={{ background:'rgba(245,158,11,0.10)', color:'#F59E0B' }}>
            {mainArtists.length}/5 MS
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded font-bold"
                style={{ background:'rgba(59,130,246,0.10)', color:'#3B82F6' }}>
            {nonMainArtists.length}/5 NM
          </span>
          <p className="text-xs font-black" style={{ color:team.color }}>{totalPts}</p>
        </div>
        {open ? <FiChevronUp size={12} className="text-gray-600"/> : <FiChevronDown size={12} className="text-gray-600"/>}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height:0 }} animate={{ height:'auto' }} exit={{ height:0 }}
                      className="overflow-hidden border-t" style={{ borderColor:'rgba(255,255,255,0.05)' }}>
            <div className="px-4 py-3 grid grid-cols-2 gap-4">
              {/* Mainstream column */}
              <div>
                <p className="text-[8px] font-black tracking-widest uppercase mb-2"
                   style={{ color:'#F59E0B' }}>📺 Mainstream (5 slots)</p>
                <div className="space-y-1">
                  {Array.from({ length: ROSTER_MAIN }).map((_, i) => (
                    <ArtistChip key={i} artistId={team.mainstream?.[i]} isMainstream={true} />
                  ))}
                </div>
              </div>
              {/* Non-mainstream column */}
              <div>
                <p className="text-[8px] font-black tracking-widest uppercase mb-2"
                   style={{ color:'#3B82F6' }}>🎤 Non-Mainstream (5 slots)</p>
                <div className="space-y-1">
                  {Array.from({ length: ROSTER_NONMAIN }).map((_, i) => (
                    <ArtistChip key={i} artistId={team.nonMainstream?.[i]} isMainstream={false} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── SETTINGS PANEL ────────────────────────────────────────────────────────────
function SettingsPanel({ leagueSize, poolSize, setLeagueSize, setPoolSize, onClose }) {
  return (
    <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
      className="absolute top-full left-0 right-0 z-20 border-b"
      style={{ background:'#111', borderColor:'rgba(255,255,255,0.1)' }}>
      <div className="max-w-xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white">League Format Settings</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-white transition-colors"><FiX size={14}/></button>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-gray-600 mb-2 flex items-center gap-2">
              <FiUsers size={10}/> Pro Teams (League Size)
            </p>
            <div className="flex gap-2">
              {TEAM_SIZES.map(n => (
                <button key={n} onClick={() => setLeagueSize(n)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold border transition-all"
                  style={leagueSize===n
                    ? { background:'rgba(245,158,11,0.15)', borderColor:'rgba(245,158,11,0.4)', color:'#F59E0B' }
                    : { background:'rgba(255,255,255,0.03)', borderColor:'rgba(255,255,255,0.08)', color:'#6B7280' }}>
                  {n}
                </button>
              ))}
            </div>
            <p className="text-[9px] text-gray-700 mt-1.5">{leagueSize} pro teams · {leagueSize * ROSTER_SIZE} total roster spots</p>
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-gray-600 mb-2">Non-Pro Teams in Pool</p>
            <div className="flex gap-2">
              {POOL_SIZES.map(n => (
                <button key={n} onClick={() => setPoolSize(n)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold border transition-all"
                  style={poolSize===n
                    ? { background:'rgba(139,92,246,0.15)', borderColor:'rgba(139,92,246,0.4)', color:'#8B5CF6' }
                    : { background:'rgba(255,255,255,0.03)', borderColor:'rgba(255,255,255,0.08)', color:'#6B7280' }}>
                  {n}
                </button>
              ))}
            </div>
            <p className="text-[9px] text-gray-700 mt-1.5">{poolSize} squads · {poolSize * 8} artists to draft from</p>
          </div>
        </div>
        <div className="mt-4 rounded-xl border px-4 py-3"
             style={{ background:'rgba(245,158,11,0.05)', borderColor:'rgba(245,158,11,0.15)' }}>
          <p className="text-xs font-bold text-white mb-0.5">📋 Draft Rules</p>
          <p className="text-[10px] text-gray-500">
            {leagueSize} pro teams · Roster: 5 mainstream + 5 non-mainstream (10 total) · {SEASONAL_PICKS} seasonal picks/team · {poolSize} non-pro squads × 8 artists = {poolSize * 8} pool artists · Snake draft format
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function FHHLDraftHub() {
  const [leagueSize,     setLeagueSize]     = useState(12);
  const [poolSize,       setPoolSize]       = useState(20);
  const [activeSection,  setActiveSection]  = useState('pool');
  const [showSettings,   setShowSettings]   = useState(false);
  const [selectedSquad,  setSelectedSquad]  = useState(null);
  const [squadSearch,    setSquadSearch]    = useState('');
  const [squadFilter,    setSquadFilter]    = useState('all'); // all | classic | mainstream
  // FA state
  const [faSearch,       setFaSearch]       = useState('');
  const [faTier,         setFaTier]         = useState('all');
  const [faView,         setFaView]         = useState('wire');
  const [claimTarget,    setClaimTarget]    = useState(null);
  const [dropTarget,     setDropTarget]     = useState(null);
  const [claimedIds,     setClaimedIds]     = useState([]);

  const activeProTeams = useMemo(() => ALL_PRO_TEAMS.slice(0, leagueSize), [leagueSize]);
  const activeSquads   = useMemo(() => ALL_SQUADS.slice(0, poolSize), [poolSize]);
  const myTeam         = activeProTeams.find(t => t.isMe);

  // Build set of already-drafted artist IDs
  const draftedIds = useMemo(() => {
    const s = new Set();
    activeProTeams.forEach(t => {
      (t.mainstream || []).forEach(id => s.add(id));
      (t.nonMainstream || []).forEach(id => s.add(id));
    });
    return s;
  }, [activeProTeams]);

  // My full roster
  const myMainArtists    = useMemo(() => (myTeam?.mainstream    || []).map(id => ARTIST_LOOKUP[id]).filter(Boolean), [myTeam]);
  const myNonMainArtists = useMemo(() => (myTeam?.nonMainstream || []).map(id => ARTIST_LOOKUP[id]).filter(Boolean), [myTeam]);
  const myTotalPts       = useMemo(() => [...myMainArtists, ...myNonMainArtists].reduce((s,a) => s+a.proj, 0), [myMainArtists, myNonMainArtists]);

  // Filtered squads for pool view
  const filteredSquads = useMemo(() => activeSquads
    .filter(sq => squadFilter === 'all' || sq.type === squadFilter)
    .filter(sq => !squadSearch || sq.name.toLowerCase().includes(squadSearch.toLowerCase()) || sq.region.toLowerCase().includes(squadSearch.toLowerCase())),
  [activeSquads, squadFilter, squadSearch]);

  return (
    <div className="flex flex-col h-screen" style={{ background:'#0a0a0a', color:'#fff', fontFamily:'system-ui, sans-serif' }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 h-12 flex-shrink-0 border-b relative z-10"
           style={{ background:'#111', borderColor:'rgba(255,255,255,0.08)' }}>
        <Link to="/fhhl/league" className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors flex-shrink-0">
          <FiChevronLeft size={14}/>
          <span className="text-xs font-bold hidden sm:block">League</span>
        </Link>
        <div className="w-px h-5 bg-white/10 flex-shrink-0"/>
        <span className="text-sm font-bold text-white flex-shrink-0">🎯 Draft Hub</span>

        <div className="flex items-center gap-1.5 ml-2">
          <span className="text-[9px] px-2 py-1 rounded-full font-bold border"
                style={{ background:'rgba(245,158,11,0.10)', borderColor:'rgba(245,158,11,0.25)', color:'#F59E0B' }}>
            {leagueSize} Pro Teams
          </span>
          <span className="text-[9px] px-2 py-1 rounded-full font-bold border"
                style={{ background:'rgba(139,92,246,0.10)', borderColor:'rgba(139,92,246,0.25)', color:'#8B5CF6' }}>
            {poolSize} Squads
          </span>
          <span className="text-[9px] px-2 py-1 rounded-full font-bold border"
                style={{ background:'rgba(59,130,246,0.10)', borderColor:'rgba(59,130,246,0.25)', color:'#3B82F6' }}>
            5+5 Roster
          </span>
          <span className="text-[9px] px-2 py-1 rounded-full font-bold border"
                style={{ background:'rgba(16,185,129,0.10)', borderColor:'rgba(16,185,129,0.25)', color:'#10B981' }}>
            {SEASONAL_PICKS} Season Picks
          </span>
        </div>

        <div className="flex-1"/>
        <button onClick={() => setShowSettings(s => !s)}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-[10px] font-semibold transition-all ${showSettings ? 'border-amber-500/40 bg-amber-500/12 text-amber-400' : 'border-white/10 text-gray-500 hover:text-white'}`}>
          <FiSettings size={11}/> Format
        </button>
      </div>

      {/* ── Settings Dropdown ───────────────────────────────────────────── */}
      <div className="relative">
        <AnimatePresence>
          {showSettings && (
            <SettingsPanel leagueSize={leagueSize} poolSize={poolSize}
              setLeagueSize={setLeagueSize} setPoolSize={setPoolSize}
              onClose={() => setShowSettings(false)}/>
          )}
        </AnimatePresence>
      </div>

      {/* ── Sub-nav ─────────────────────────────────────────────────────── */}
      <div className="flex border-b px-4 overflow-x-auto"
           style={{ background:'#0d0d0d', borderColor:'rgba(255,255,255,0.07)' }}>
        {[
          { id:'pool',    label:`Draft Pool (${poolSize} squads)` },
          { id:'my-team', label:`My Team (${myMainArtists.length + myNonMainArtists.length}/10)` },
          { id:'teams',   label:`All Teams (${leagueSize})` },
          { id:'order',   label:'Season Picks' },
          { id:'fa',      label:'🔥 Free Agency', hot:true },
        ].map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            className="px-3 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap flex-shrink-0"
            style={activeSection===s.id
              ? { color: s.id==='fa' ? '#EF4444' : '#F59E0B', borderBottomColor: s.id==='fa' ? '#EF4444' : '#F59E0B' }
              : { color: s.hot ? '#F87171' : '#6B7280', borderBottomColor:'transparent' }}>
            {s.label}
          </button>
        ))}
      </div>

      {/* ── DRAFT POOL — non-pro squads ──────────────────────────────────── */}
      {activeSection === 'pool' && (
        <div className="flex flex-1 overflow-hidden">
          {/* Left: squad list */}
          <div className="w-72 flex-shrink-0 flex flex-col border-r overflow-hidden"
               style={{ background:'#0d0d0d', borderColor:'rgba(255,255,255,0.07)' }}>
            <div className="px-3 py-2.5 border-b space-y-2" style={{ borderColor:'rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/8 bg-white/3">
                <FiSearch size={11} className="text-gray-600 flex-shrink-0"/>
                <input value={squadSearch} onChange={e => setSquadSearch(e.target.value)} placeholder="Search squads…"
                  className="bg-transparent text-[11px] text-white outline-none placeholder-gray-700 flex-1"/>
              </div>
              <div className="flex gap-1.5">
                {[['all','All'],['classic','Classic'],['mainstream','Current']].map(([val, label]) => (
                  <button key={val} onClick={() => setSquadFilter(val)}
                    className="flex-1 py-1 rounded-lg text-[9px] font-bold border transition-all"
                    style={squadFilter===val
                      ? { background:'rgba(245,158,11,0.12)', borderColor:'rgba(245,158,11,0.35)', color:'#F59E0B' }
                      : { background:'rgba(255,255,255,0.02)', borderColor:'rgba(255,255,255,0.07)', color:'#6B7280' }}>
                    {label}
                  </button>
                ))}
              </div>
              <p className="text-[9px] text-gray-700 px-1">
                {poolSize} squads × 8 artists = <span className="text-amber-400 font-bold">{poolSize * 8} draft-eligible artists</span>
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredSquads.map(sq => (
                <SquadCard key={sq.id} squad={sq} draftedIds={draftedIds}
                  isSelected={selectedSquad?.id === sq.id}
                  onClick={() => setSelectedSquad(s => s?.id === sq.id ? null : sq)}/>
              ))}
              {filteredSquads.length === 0 && (
                <p className="text-center text-gray-700 text-sm py-8">No squads match.</p>
              )}
            </div>
          </div>
          {/* Right: squad detail */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              {selectedSquad
                ? <SquadDetail key={selectedSquad.id} squad={selectedSquad} draftedIds={draftedIds} onClose={() => setSelectedSquad(null)}/>
                : <SquadDetail key="empty" squad={null} draftedIds={draftedIds} onClose={() => {}} />
              }
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* ── MY TEAM — 5 mainstream + 5 non-mainstream ───────────────────── */}
      {activeSection === 'my-team' && (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            {/* Team header card */}
            <div className="rounded-2xl border p-5 mb-6"
                 style={{ background:`${myTeam.color}08`, borderColor:`${myTeam.color}30` }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-lg font-black text-white">{myTeam.name}</p>
                  <p className="text-[10px] text-gray-600">Owner: Thurman G. · Season 1</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black" style={{ color:myTeam.color }}>{myTotalPts}</p>
                  <p className="text-[9px] text-gray-600">projected pts · #1 in league</p>
                </div>
              </div>

              {/* Roster completeness bars */}
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[9px] font-bold text-amber-400">📺 Mainstream</p>
                    <p className="text-[9px] font-black text-amber-400">{myMainArtists.length}/{ROSTER_MAIN}</p>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: ROSTER_MAIN }).map((_, i) => (
                      <div key={i} className="flex-1 h-2 rounded-full"
                           style={{ background: i < myMainArtists.length ? '#F59E0B' : 'rgba(255,255,255,0.06)' }}/>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[9px] font-bold text-blue-400">🎤 Non-Mainstream</p>
                    <p className="text-[9px] font-black text-blue-400">{myNonMainArtists.length}/{ROSTER_NONMAIN}</p>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: ROSTER_NONMAIN }).map((_, i) => (
                      <div key={i} className="flex-1 h-2 rounded-full"
                           style={{ background: i < myNonMainArtists.length ? '#3B82F6' : 'rgba(255,255,255,0.06)' }}/>
                    ))}
                  </div>
                </div>
              </div>

              {/* Seasonal picks indicator */}
              <div className="flex items-center gap-4 pt-3 border-t" style={{ borderColor:`${myTeam.color}20` }}>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-gray-600">Season Picks:</span>
                  <div className="flex gap-1">
                    {Array.from({ length: SEASONAL_PICKS }).map((_, i) => (
                      <div key={i} className="w-5 h-5 rounded-full flex items-center justify-center border text-[8px] font-black"
                           style={{ background:`${myTeam.color}15`, borderColor:`${myTeam.color}35`, color:myTeam.color }}>
                        {i+1}
                      </div>
                    ))}
                  </div>
                  <span className="text-[9px] font-bold text-green-400">{myTeam.seasonPicks} available this season</span>
                </div>
                <span className="text-[9px] text-gray-700 ml-auto">Roster full · 10/10 slots</span>
              </div>
            </div>

            {/* Two-column roster */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mainstream column */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-3 h-3 rounded-full bg-amber-400"/>
                  <p className="text-xs font-black text-amber-400 uppercase tracking-widest">Mainstream (5/5)</p>
                </div>
                <div className="space-y-2">
                  {myMainArtists.map((artist, i) => (
                    <motion.div key={artist.id} initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }}
                      transition={{ delay:i*0.05 }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl border"
                      style={{ background:'rgba(245,158,11,0.04)', borderColor:'rgba(245,158,11,0.18)' }}>
                      <span className="text-[9px] font-black text-amber-400 w-4">#{i+1}</span>
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                           style={{ background:TIER_BG[artist.tier] }}>{artist.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white">{artist.name}</span>
                          <span className="text-[8px] font-black px-1 py-px rounded"
                                style={{ background:TIER_BG[artist.tier], color:TIER_COLOR[artist.tier] }}>{artist.tier}</span>
                        </div>
                        <p className="text-[9px] text-gray-600">{artist.genre}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-black" style={{ color:TIER_COLOR[artist.tier] }}>{artist.proj}</p>
                        <p className="text-[8px] text-gray-700">proj pts</p>
                      </div>
                    </motion.div>
                  ))}
                  {Array.from({ length: ROSTER_MAIN - myMainArtists.length }).map((_, i) => (
                    <div key={`empty-ms-${i}`} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed"
                         style={{ borderColor:'rgba(245,158,11,0.15)' }}>
                      <span className="text-[9px] font-black text-gray-700 w-4">#{myMainArtists.length+i+1}</span>
                      <div className="w-8 h-8 rounded-xl border-2 border-dashed flex items-center justify-center"
                           style={{ borderColor:'rgba(245,158,11,0.15)' }}>
                        <FiPlus size={12} className="text-gray-700"/>
                      </div>
                      <span className="text-xs text-gray-700">Open mainstream slot</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Non-mainstream column */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-3 h-3 rounded-full bg-blue-400"/>
                  <p className="text-xs font-black text-blue-400 uppercase tracking-widest">Non-Mainstream (5/5)</p>
                </div>
                <div className="space-y-2">
                  {myNonMainArtists.map((artist, i) => (
                    <motion.div key={artist.id} initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }}
                      transition={{ delay:i*0.05 + 0.1 }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl border"
                      style={{ background:'rgba(59,130,246,0.04)', borderColor:'rgba(59,130,246,0.18)' }}>
                      <span className="text-[9px] font-black text-blue-400 w-4">#{i+1}</span>
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                           style={{ background:TIER_BG[artist.tier] }}>{artist.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white">{artist.name}</span>
                          <span className="text-[8px] font-black px-1 py-px rounded"
                                style={{ background:TIER_BG[artist.tier], color:TIER_COLOR[artist.tier] }}>{artist.tier}</span>
                        </div>
                        <p className="text-[9px] text-gray-600">{artist.genre}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-black" style={{ color:TIER_COLOR[artist.tier] }}>{artist.proj}</p>
                        <p className="text-[8px] text-gray-700">proj pts</p>
                      </div>
                    </motion.div>
                  ))}
                  {Array.from({ length: ROSTER_NONMAIN - myNonMainArtists.length }).map((_, i) => (
                    <div key={`empty-nm-${i}`} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed"
                         style={{ borderColor:'rgba(59,130,246,0.15)' }}>
                      <span className="text-[9px] font-black text-gray-700 w-4">#{myNonMainArtists.length+i+1}</span>
                      <div className="w-8 h-8 rounded-xl border-2 border-dashed flex items-center justify-center"
                           style={{ borderColor:'rgba(59,130,246,0.15)' }}>
                        <FiPlus size={12} className="text-gray-700"/>
                      </div>
                      <span className="text-xs text-gray-700">Open non-mainstream slot</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Roster summary */}
            <div className="mt-6 rounded-xl border p-4 flex items-center gap-6"
                 style={{ background:'rgba(255,255,255,0.02)', borderColor:'rgba(255,255,255,0.07)' }}>
              {[
                { label:'Total Pts',    value:myTotalPts, color:'#F59E0B' },
                { label:'Roster',       value:`${myMainArtists.length+myNonMainArtists.length}/10`, color:myTeam.color },
                { label:'Season Picks', value:myTeam.seasonPicks, color:'#10B981' },
                { label:'Avg Proj',     value:Math.round(myTotalPts/10), color:'#8B5CF6' },
              ].map(s => (
                <div key={s.label} className="text-center flex-1">
                  <p className="text-lg font-black" style={{ color:s.color }}>{s.value}</p>
                  <p className="text-[9px] text-gray-600">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── ALL TEAMS — 5+5 roster per team ─────────────────────────────── */}
      {activeSection === 'teams' && (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                {leagueSize} Pro Teams · 10 Artists Each (5 Mainstream + 5 Non-Mainstream)
              </p>
              <div className="flex items-center gap-3 text-[9px]">
                <span className="text-amber-400 font-bold">📺 MS = Mainstream</span>
                <span className="text-blue-400 font-bold">🎤 NM = Non-Mainstream</span>
              </div>
            </div>
            <div className="space-y-2">
              {activeProTeams.map((team, i) => (
                <ProTeamRow key={team.id} team={team} rank={i+1}/>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SEASON PICKS — 3 per team per season ────────────────────────── */}
      {activeSection === 'order' && (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-2xl border p-5 mb-6"
                 style={{ background:'rgba(245,158,11,0.05)', borderColor:'rgba(245,158,11,0.2)' }}>
              <p className="text-base font-black text-white mb-1">🗓️ Seasonal Draft Picks</p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Every season, each pro team gets <span className="text-amber-400 font-bold">{SEASONAL_PICKS} new draft picks</span> from the pool.
                Use these to upgrade your roster — swap out underperformers for new artists from the non-pro team squads.
                Picks are made in reverse standings order (worst record picks first within each round). Snake format.
              </p>
              <div className="flex items-center gap-6 mt-4">
                {[
                  { label:'Picks Per Team',  value:SEASONAL_PICKS,         color:'#F59E0B' },
                  { label:'Total Picks',     value:leagueSize * SEASONAL_PICKS, color:'#8B5CF6' },
                  { label:'Rounds',          value:SEASONAL_PICKS,         color:'#3B82F6' },
                  { label:'Format',          value:'Snake',                 color:'#10B981' },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <p className="text-xl font-black" style={{ color:s.color }}>{s.value}</p>
                    <p className="text-[9px] text-gray-600">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {Array.from({ length: SEASONAL_PICKS }).map((_, round) => {
              const isEven = round % 2 === 1;
              const order  = isEven ? [...activeProTeams].reverse() : activeProTeams;
              return (
                <div key={round} className="mb-6">
                  <p className="text-[10px] font-bold text-amber-400 mb-2 uppercase tracking-widest">
                    Season Pick Round {round + 1} {isEven ? '(reverse — worst to best)' : '(forward — worst to best)'}
                  </p>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-1.5">
                    {order.map((team, pickInRound) => {
                      const overallPick = round * leagueSize + pickInRound + 1;
                      return (
                        <div key={team.id} className="rounded-xl border px-2.5 py-2"
                             style={{ background: team.isMe ? `${team.color}08` : 'rgba(255,255,255,0.015)',
                                      borderColor: team.isMe ? `${team.color}35` : 'rgba(255,255,255,0.06)' }}>
                          <div className="flex items-center gap-1 mb-1">
                            <span className="text-[8px] font-black text-gray-700">#{overallPick}</span>
                            {team.isMe && <span className="text-[7px] font-bold text-amber-400">YOU</span>}
                          </div>
                          <p className="text-[9px] font-semibold text-white truncate">{team.name}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <span className={`text-[8px] font-bold ${team.seasonPicks > 0 ? 'text-green-400' : 'text-gray-700'}`}>
                              {team.seasonPicks > 0 ? `${team.seasonPicks} picks avail` : 'No picks left'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Rules summary */}
            <div className="rounded-xl border px-4 py-3 mt-2"
                 style={{ background:'rgba(255,255,255,0.02)', borderColor:'rgba(255,255,255,0.07)' }}>
              <p className="text-[10px] font-bold text-white mb-2">Draft Rules Reference</p>
              <div className="space-y-1">
                {[
                  '• Pro team roster cap: 10 artists (5 mainstream + 5 non-mainstream)',
                  `• ${SEASONAL_PICKS} seasonal upgrade picks per team — use to swap any roster spot`,
                  `• Draft from non-pro squads (${poolSize} squads × 8 artists each)`,
                  '• Mainstream slots can also be filled via Free Agency wire',
                  '• Non-mainstream artists come exclusively from draft pool squads',
                  '• Season picks order: reverse standings (worst record picks first, snake format)',
                ].map((rule, i) => (
                  <p key={i} className="text-[10px] text-gray-500">{rule}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── FREE AGENCY ─────────────────────────────────────────────────── */}
      {activeSection === 'fa' && (
        <div className="flex flex-1 overflow-hidden">
          {/* Left: FA list */}
          <div className="w-80 flex-shrink-0 flex flex-col border-r overflow-hidden"
               style={{ background:'#0d0d0d', borderColor:'rgba(255,255,255,0.07)' }}>
            <div className="px-4 py-3 border-b" style={{ borderColor:'rgba(255,255,255,0.06)' }}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-xs font-black text-white">Free Agency Wire</p>
                  <p className="text-[9px] text-gray-600">{FREE_AGENTS.length} mainstream artists · fills MS slots</p>
                </div>
                <span className="flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded-full border"
                      style={{ background:'rgba(239,68,68,0.10)', borderColor:'rgba(239,68,68,0.25)', color:'#EF4444' }}>
                  <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse"/>OPEN
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/8 bg-white/3 mb-2">
                <FiSearch size={11} className="text-gray-600 flex-shrink-0"/>
                <input value={faSearch} onChange={e => setFaSearch(e.target.value)} placeholder="Search free agents…"
                  className="bg-transparent text-[11px] text-white outline-none placeholder-gray-700 flex-1"/>
              </div>
              <div className="flex gap-1.5">
                {['all','A','B','C'].map(t => (
                  <button key={t} onClick={() => setFaTier(t)}
                    className="flex-1 py-1 rounded-lg text-[9px] font-bold border transition-all"
                    style={faTier===t
                      ? { background:`${TIER_COLOR[t]||'#EF4444'}15`, borderColor:`${TIER_COLOR[t]||'#EF4444'}35`, color:TIER_COLOR[t]||'#EF4444' }
                      : { background:'rgba(255,255,255,0.02)', borderColor:'rgba(255,255,255,0.07)', color:'#6B7280' }}>
                    {t==='all' ? 'All' : `Tier ${t}`}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
              {FREE_AGENTS
                .filter(a => faTier==='all' || a.tier===faTier)
                .filter(a => !faSearch || a.name.toLowerCase().includes(faSearch.toLowerCase()))
                .filter(a => !claimedIds.includes(a.id))
                .sort((a,b) => b.proj - a.proj)
                .map(fa => (
                  <motion.button key={fa.id} layout
                    onClick={() => setClaimTarget(ct => ct?.id===fa.id ? null : fa)}
                    className="w-full text-left rounded-xl border p-3 transition-all hover:brightness-105"
                    style={{ background:claimTarget?.id===fa.id ? TIER_BG[fa.tier] : 'rgba(255,255,255,0.02)',
                             borderColor:claimTarget?.id===fa.id ? `${TIER_COLOR[fa.tier]}45` : 'rgba(255,255,255,0.07)' }}>
                    <div className="flex items-start gap-2.5">
                      <div className="relative">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl"
                             style={{ background:`${TIER_COLOR[fa.tier]}15` }}>{fa.emoji}</div>
                        {fa.hot && <span className="absolute -top-1 -right-1 text-[8px]">🔥</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-xs font-black text-white truncate">{fa.name}</span>
                          <span className="text-[8px] font-black px-1 py-px rounded"
                                style={{ background:TIER_BG[fa.tier], color:TIER_COLOR[fa.tier] }}>{fa.tier}</span>
                        </div>
                        <p className="text-[9px] text-gray-600 truncate">{fa.genre}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] font-bold" style={{ color:TIER_COLOR[fa.tier] }}>Proj: {fa.proj}</span>
                          <span className="text-[8px] text-gray-700">{fa.owned}% owned</span>
                        </div>
                      </div>
                      <button onClick={e => { e.stopPropagation(); setClaimTarget(fa); }}
                        className="flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-bold border border-red-500/30 bg-red-500/10 text-red-400 hover:brightness-110 transition-all">
                        <FiPlus size={8}/> Claim
                      </button>
                    </div>
                  </motion.button>
                ))}
              {claimedIds.length > 0 && (
                <p className="text-center text-[10px] text-gray-700 pt-2">
                  {claimedIds.length} claimed this session
                </p>
              )}
            </div>
          </div>

          {/* Right: FA detail views */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="flex border-b px-4" style={{ borderColor:'rgba(255,255,255,0.07)', background:'#0a0a0a' }}>
              {[
                { id:'wire',     label:'Claim Center' },
                { id:'trending', label:'🔥 Trending' },
                { id:'activity', label:'Recent Activity' },
                { id:'waiver',   label:'Waiver Order' },
              ].map(v => (
                <button key={v.id} onClick={() => setFaView(v.id)}
                  className="px-4 py-2.5 text-[10px] font-semibold border-b-2 transition-all whitespace-nowrap"
                  style={faView===v.id ? { color:'#EF4444', borderBottomColor:'#EF4444' }
                                       : { color:'#6B7280', borderBottomColor:'transparent' }}>
                  {v.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Claim Center */}
              {faView==='wire' && (
                <div className="p-6 max-w-lg">
                  {claimTarget ? (
                    <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}>
                      <div className="rounded-2xl border p-4 mb-5"
                           style={{ background:TIER_BG[claimTarget.tier], borderColor:`${TIER_COLOR[claimTarget.tier]}30` }}>
                        <p className="text-[9px] font-bold tracking-widest uppercase mb-2"
                           style={{ color:TIER_COLOR[claimTarget.tier] }}>Claiming (Mainstream Slot)</p>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-3xl"
                               style={{ background:`${TIER_COLOR[claimTarget.tier]}20` }}>{claimTarget.emoji}</div>
                          <div>
                            <p className="text-sm font-black text-white">{claimTarget.name}</p>
                            <p className="text-[10px] text-gray-500">{claimTarget.genre} · {claimTarget.era}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[9px] font-black px-1.5 py-0.5 rounded"
                                    style={{ background:TIER_BG[claimTarget.tier], color:TIER_COLOR[claimTarget.tier] }}>
                                Tier {claimTarget.tier}
                              </span>
                              <span className="text-[9px] font-bold" style={{ color:TIER_COLOR[claimTarget.tier] }}>{claimTarget.proj} proj pts</span>
                              {claimTarget.hot && <span className="text-[9px]">🔥 Hot</span>}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t" style={{ borderColor:`${TIER_COLOR[claimTarget.tier]}20` }}>
                          <p className="text-[8px] text-gray-600 mb-1 uppercase tracking-widest">Top Songs</p>
                          <div className="flex flex-wrap gap-1.5">
                            {claimTarget.songs.map((s,i) => (
                              <span key={i} className="text-[9px] text-gray-400 bg-white/5 rounded px-2 py-0.5">{s}</span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                        Drop a Mainstream Artist to Claim
                      </p>
                      <p className="text-[9px] text-gray-700 mb-3">
                        FA claims replace your mainstream slots only (5/5 full). Select who to release.
                      </p>
                      <div className="space-y-2 mb-4">
                        {myMainArtists.map(artist => (
                          <button key={artist.id} onClick={() => setDropTarget(a => a?.id===artist.id ? null : artist)}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all"
                            style={{ background:dropTarget?.id===artist.id ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.02)',
                                     borderColor:dropTarget?.id===artist.id ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.07)' }}>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${dropTarget?.id===artist.id ? 'bg-red-500 border-red-500' : 'border-white/20'}`}>
                              {dropTarget?.id===artist.id && <FiCheck size={10} className="text-white"/>}
                            </div>
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                                 style={{ background:TIER_BG[artist.tier] }}>{artist.emoji}</div>
                            <div className="flex-1 min-w-0">
                              <span className="text-xs font-bold text-white">{artist.name}</span>
                              <p className="text-[9px] text-gray-600">{artist.genre}</p>
                            </div>
                            <p className="text-xs font-black" style={{ color:TIER_COLOR[artist.tier] }}>{artist.proj}</p>
                            {dropTarget?.id===artist.id && <span className="text-[9px] font-bold text-red-400">DROP</span>}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => { if(dropTarget){ setClaimedIds(ids=>[...ids,claimTarget.id]); setClaimTarget(null); setDropTarget(null); } }}
                          disabled={!dropTarget}
                          className="flex-1 py-3 rounded-xl text-sm font-black border transition-all disabled:opacity-30"
                          style={{ background:dropTarget ? 'rgba(239,68,68,0.15)' : undefined,
                                   borderColor:dropTarget ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.08)',
                                   color:dropTarget ? '#EF4444' : '#4B5563' }}>
                          {dropTarget ? `Drop ${dropTarget.name} · Claim ${claimTarget.name}` : 'Select artist to drop first'}
                        </button>
                        <button onClick={() => { setClaimTarget(null); setDropTarget(null); }}
                          className="px-4 py-3 rounded-xl text-sm font-bold border border-white/10 text-gray-500 hover:text-white transition-all">
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <span className="text-4xl mb-3">📋</span>
                      <p className="text-sm font-bold text-gray-500">Select a free agent to claim</p>
                      <p className="text-xs text-gray-700 mt-1 max-w-xs">FA claims fill your mainstream (MS) slots only. Drop one of your 5 mainstream artists to make room.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Trending */}
              {faView==='trending' && (
                <div className="p-6 max-w-lg">
                  <p className="text-xs font-black text-white mb-4">🔥 Trending Free Agents This Week</p>
                  <div className="space-y-2">
                    {FREE_AGENTS.filter(a => a.hot).sort((a,b) => b.proj - a.proj).map((fa, i) => (
                      <div key={fa.id} className="flex items-center gap-3 px-4 py-3 rounded-xl border"
                           style={{ background:'rgba(239,68,68,0.04)', borderColor:'rgba(239,68,68,0.15)' }}>
                        <span className="text-[10px] font-black text-red-400 w-5">#{i+1}</span>
                        <span className="text-base">{fa.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white">{fa.name}</span>
                            <span className="text-[8px] font-black px-1 py-px rounded"
                                  style={{ background:TIER_BG[fa.tier], color:TIER_COLOR[fa.tier] }}>{fa.tier}</span>
                            <span className="text-[9px]">🔥</span>
                          </div>
                          <p className="text-[9px] text-gray-600">{fa.genre} · {fa.owned}% owned</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black" style={{ color:TIER_COLOR[fa.tier] }}>{fa.proj}</p>
                          <p className="text-[8px] text-gray-700">proj pts</p>
                        </div>
                        <button onClick={() => setClaimTarget(fa)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[9px] font-bold border border-red-500/30 bg-red-500/10 text-red-400 transition-all">
                          <FiPlus size={8}/> Claim
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Activity */}
              {faView==='activity' && (
                <div className="p-6 max-w-lg">
                  <p className="text-xs font-black text-white mb-4">📰 League FA Activity</p>
                  <div className="space-y-2">
                    {FA_ACTIVITY.map((act, i) => (
                      <div key={i} className="flex items-start gap-3 px-4 py-3 rounded-xl border"
                           style={{ background:'rgba(255,255,255,0.02)', borderColor:'rgba(255,255,255,0.07)' }}>
                        <span className="text-lg">{act.action==='claimed' ? '⬆️' : '⬇️'}</span>
                        <div className="flex-1">
                          <p className="text-xs text-white">
                            <span className="font-bold">{act.team}</span>
                            {act.action==='claimed'
                              ? <> claimed <span className="text-green-400 font-bold">{act.artist}</span> · dropped <span className="text-red-400 font-bold">{act.dropped}</span></>
                              : <> dropped <span className="text-red-400 font-bold">{act.artist}</span></>
                            }
                          </p>
                          <p className="text-[9px] text-gray-700 mt-0.5">{act.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Waiver Order */}
              {faView==='waiver' && (
                <div className="p-6 max-w-lg">
                  <p className="text-xs font-black text-white mb-1">📋 Waiver Priority Order</p>
                  <p className="text-[10px] text-gray-600 mb-4">Reverse standings — last place has priority. Resets each Wednesday at midnight.</p>
                  <div className="space-y-1">
                    {WAIVER_PRIORITY.slice(0, leagueSize).map((teamName, i) => {
                      const isMe = teamName === 'Griot Nation';
                      return (
                        <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg border"
                             style={{ background: isMe ? 'rgba(139,92,246,0.06)' : 'rgba(255,255,255,0.015)',
                                      borderColor: isMe ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.06)' }}>
                          <span className="text-[9px] font-black w-5"
                                style={{ color: i < 3 ? '#10B981' : '#4B5563' }}>#{i+1}</span>
                          <span className="text-[10px] font-semibold flex-1"
                                style={{ color: isMe ? '#C084FC' : '#9CA3AF' }}>{teamName}</span>
                          {isMe && <span className="text-[8px] font-bold text-purple-400 px-1.5 py-0.5 rounded-full border border-purple-500/30 bg-purple-500/10">YOU</span>}
                          {i < 3 && <span className="text-[8px] text-green-400 font-bold">Priority</span>}
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 rounded-xl border px-4 py-3"
                       style={{ background:'rgba(255,255,255,0.02)', borderColor:'rgba(255,255,255,0.07)' }}>
                    <p className="text-[10px] font-bold text-white mb-1">Waiver Rules</p>
                    <div className="space-y-0.5">
                      {[
                        '• Only mainstream (MS) roster slots can be filled via FA wire',
                        '• Non-mainstream slots must be filled from the draft pool squads',
                        '• Drop-to-claim: must release one mainstream artist to add a new one',
                        '• Waiver resets every Wednesday at midnight ET',
                        '• Priority: last place claim → moves to end of list after using it',
                      ].map((r, i) => <p key={i} className="text-[9px] text-gray-600">{r}</p>)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
