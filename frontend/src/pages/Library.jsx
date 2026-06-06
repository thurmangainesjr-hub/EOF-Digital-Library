import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  FiSearch, FiUpload, FiX, FiPlay, FiBookOpen, FiHeart,
  FiBookmark, FiShare2, FiDownload, FiStar, FiChevronLeft,
  FiChevronRight, FiPlus, FiCheck, FiImage, FiFile,
  FiTrendingUp, FiAward, FiClock, FiUsers, FiLock, FiInfo,
  FiBook, FiZap
} from 'react-icons/fi';

// ─────────────────────────────────────────────────────────────────────────────
// COVER THEMES
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  crimsonGold:   { a: '#3d0000', b: '#1a0505', accent: '#C0392B', text: '#D4AF37' },
  royalNavy:     { a: '#0A2040', b: '#020B18', accent: '#4A90E2', text: '#FFFFFF' },
  forestSage:    { a: '#1A3A1A', b: '#0A1F0A', accent: '#52B788', text: '#D4E9C8' },
  sunsetAmber:   { a: '#3D1A00', b: '#1F0A00', accent: '#F4A261', text: '#FFECD2' },
  cosmicPurple:  { a: '#1E0040', b: '#0D0020', accent: '#9B59B6', text: '#E8D5F5' },
  oceanTeal:     { a: '#003340', b: '#001A1F', accent: '#1ABC9C', text: '#A8EDD6' },
  goldenSerif:   { a: '#241800', b: '#0D0800', accent: '#D4AF37', text: '#FFF8E7' },
  roseCopper:    { a: '#3D0020', b: '#1F0810', accent: '#E8698A', text: '#F5C6D0' },
  midnightSlate: { a: '#141430', b: '#0A0A14', accent: '#7F8C8D', text: '#BDC3C7' },
  earthBrown:    { a: '#2A1800', b: '#100800', accent: '#C0804B', text: '#E8C9A0' },
  steelBlue:     { a: '#10213A', b: '#080C12', accent: '#2E86AB', text: '#A8C8E0' },
  lushMaroon:    { a: '#250010', b: '#0F0005', accent: '#8E1A2E', text: '#F5A0B5' },
};

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────
const bk = (id, title, author, theme, genre, year, rating, pages, desc, tags = [], isNew = false, hot = false) => ({
  id: String(id), title, author, theme, genre, year, rating, pages, desc, tags, isNew, hot, type: 'book',
});

const HERO_BOOKS = [
  bk(1, 'The Freedom Blueprint', 'Marcus J. Freeman', 'crimsonGold', 'Self-Help', 2024, 4.9, 312,
    'A revolutionary guide to designing a life of total freedom — financial, mental, and spiritual. The system that changed 100,000 lives.',
    ['bestseller', 'featured'], false, true),
  bk(2, 'Black Excellence Code', 'Dr. Nia Washington', 'royalNavy', 'Culture & History', 2024, 4.8, 428,
    'An exploration of the hidden codes, principles, and systems that have driven Black excellence across centuries. Uncover the blueprint.',
    ['award-winner', 'featured'], true),
  bk(3, 'The Wealth Architect', 'Devon A. Cross', 'goldenSerif', 'Business & Finance', 2024, 4.7, 356,
    'Step-by-step framework for building generational wealth from scratch. Cross reveals the exact strategies the top 1% use — now available to everyone.',
    ['bestseller', 'featured'], false, true),
];

const CONTINUE_READING = [
  { ...bk(10, 'Atomic Focus', 'James Westbrook', 'steelBlue', 'Self-Help', 2023, 4.6, 280, ''), progress: 67, lastRead: '2 days ago' },
  { ...bk(11, 'The Morning Rituals', 'Serena Bridges', 'forestSage', 'Self-Help', 2023, 4.5, 195, ''), progress: 43, lastRead: 'Yesterday' },
  { ...bk(12, 'Limitless Mind', 'Dr. Kyle Chambers', 'cosmicPurple', 'Psychology', 2024, 4.8, 342, ''), progress: 12, lastRead: '1 week ago' },
  { ...bk(13, 'Digital Empire', 'Reginald T. Moore', 'goldenSerif', 'Business', 2023, 4.7, 388, ''), progress: 89, lastRead: 'Today' },
  { ...bk(14, 'The Black Millionaire', 'Denise R. Coleman', 'crimsonGold', 'Finance', 2024, 4.9, 315, ''), progress: 55, lastRead: '3 days ago' },
];

const NEW_RELEASES = [
  bk(20, 'Elevation', 'Isaiah T. Banks', 'royalNavy', 'Spirituality', 2024, 4.7, 224, 'Rise above every limitation.', [], true),
  bk(21, 'Quantum Success', 'Dr. Maya Pierce', 'cosmicPurple', 'Self-Help', 2024, 4.8, 298, 'Science-backed success principles.', [], true),
  bk(22, 'The Daily Warrior', 'Terrence J. Phillips', 'crimsonGold', 'Motivation', 2024, 4.6, 186, '365 days of warrior wisdom.', [], true),
  bk(23, 'Her Legacy', 'Jasmine A. Carter', 'roseCopper', 'Biography', 2024, 4.9, 412, 'A powerful memoir of resilience.', [], true),
  bk(24, "The Entrepreneur's Bible", 'Kevin R. Strong', 'goldenSerif', 'Business', 2024, 4.7, 524, 'Every answer an entrepreneur needs.', [], true),
  bk(25, 'Unbreakable', 'Dr. Marcus Williams', 'steelBlue', 'Psychology', 2024, 4.8, 276, 'Building mental fortitude for life.', [], true),
  bk(26, 'The Focus Formula', 'Lisa Chen-Wright', 'forestSage', 'Productivity', 2024, 4.5, 201, 'Master deep focus in the digital age.', [], true),
  bk(27, 'Beyond Average', 'Darius A. King', 'earthBrown', 'Motivation', 2024, 4.6, 264, 'The extraordinary is your birthright.', [], true),
  bk(28, "The Creator's Manifesto", 'Amara Osei', 'sunsetAmber', 'Creativity', 2024, 4.9, 318, 'A rallying cry for creative souls.', [], true),
  bk(29, 'Silent Strength', 'Pastor David Monroe', 'midnightSlate', 'Spirituality', 2024, 4.7, 232, 'Finding power in stillness and faith.', [], true),
  bk(30, 'The Grind Never Sleeps', 'Tony J. Rawls', 'crimsonGold', 'Business', 2024, 4.5, 289, 'Hustle, strategy, and legacy.', [], true),
  bk(31, 'Infinite Potential', 'Dr. Alicia M. Ford', 'oceanTeal', 'Self-Help', 2024, 4.8, 348, 'Unlock the genius within you.', [], true),
  bk(32, 'Rise and Execute', 'Coach T. Daniels', 'forestSage', 'Discipline', 2024, 4.6, 198, 'Execution is the missing piece.', [], true),
  bk(33, 'The Pivot', 'Sandra L. Mitchell', 'roseCopper', 'Career', 2024, 4.7, 256, 'How to reinvent yourself at any stage.', [], true),
];

const TRENDING = [
  bk(40, 'Think Different, Win Different', 'Robert J. Ellis', 'goldenSerif', 'Mindset', 2023, 4.9, 302, 'The mental shift that changes everything.', ['bestseller'], false, true),
  bk(41, 'The 5AM Brotherhood', 'Coach Marcus Stone', 'steelBlue', 'Discipline', 2023, 4.8, 245, 'Winners start before the world wakes.', [], false, true),
  bk(42, 'Legacy Over Currency', 'Nathan D. Phillips', 'royalNavy', 'Finance', 2023, 4.7, 388, 'What you leave matters more than what you earn.', [], false, true),
  bk(43, 'The Black CEO', 'Dr. Rochelle Grant', 'midnightSlate', 'Leadership', 2023, 4.9, 434, 'Leading from the top with purpose and power.', ['award-winner'], false, true),
  bk(44, 'Kingdom Mindset', 'Bishop T. Crawford', 'crimsonGold', 'Spirituality', 2022, 4.8, 312, 'Living with the authority of your calling.', ['bestseller'], false, true),
  bk(45, 'The Digital Hustler', 'DeShawn M. Brooks', 'earthBrown', 'Tech/Business', 2023, 4.6, 276, 'Make money online. No fluff, just results.', [], false, true),
  bk(46, 'Her Success Blueprint', 'Monica J. Hayes', 'roseCopper', 'Women/Business', 2023, 4.8, 318, 'The female founder playbook, reimagined.', [], false, true),
  bk(47, 'Unstoppable', 'Tyrone K. Lawson', 'forestSage', 'Motivation', 2023, 4.7, 224, 'Nothing can stop a decided mind.', ['bestseller'], false, true),
  bk(48, 'The Wealth Principle', 'Sandra M. Cruz', 'goldenSerif', 'Finance', 2022, 4.9, 356, 'Ancient wealth laws for modern success.', [], false, true),
  bk(49, 'Next Level Thinking', 'Dr. James A. Powell', 'royalNavy', 'Psychology', 2023, 4.6, 289, 'Upgrade your cognitive operating system.', [], false, true),
  bk(50, 'Built to Last', 'Christopher N. Evans', 'steelBlue', 'Business', 2022, 4.7, 412, 'Building companies that outlive their founders.', ['bestseller'], false, true),
  bk(51, 'The Purpose Playbook', 'Rev. Angela M. Simmons', 'cosmicPurple', 'Spirituality', 2023, 4.8, 264, 'Your purpose is a strategy, not a feeling.', [], false, true),
  bk(52, 'Grind to Gold', 'Damien R. Clarke', 'sunsetAmber', 'Entrepreneurship', 2023, 4.7, 298, 'From the streets to the boardroom.', ['bestseller'], false, true),
];

const BLACK_EXCELLENCE = [
  bk(60, 'Roots to Riches', 'Dr. Kofi Asante', 'earthBrown', 'Culture', 2023, 4.9, 456, 'Tracing the lineage of Black wealth.', ['award-winner']),
  bk(61, 'The Harlem Renaissance Decoded', 'Dr. Patricia Hughes', 'goldenSerif', 'History', 2022, 4.8, 512, 'The art, music, and power of an era.', []),
  bk(62, 'Black Wall Street: Rebuilt', 'Marcus T. Johnson', 'crimsonGold', 'History/Business', 2023, 4.9, 388, 'From Tulsa to the future. Rebuild stronger.', ['bestseller']),
  bk(63, 'Queens of the Diaspora', 'Aminata Diallo', 'roseCopper', 'Biography', 2024, 4.8, 342, 'Ten women who reshaped our world.', ['award-winner'], true),
  bk(64, "The Freedman's Legacy", 'Dr. Samuel E. Brooks', 'royalNavy', 'History', 2022, 4.7, 478, 'The untold story of post-emancipation success.', []),
  bk(65, 'Melanin and Money', 'Kezia R. Thompson', 'sunsetAmber', 'Finance', 2023, 4.8, 298, 'Building wealth as an act of resistance.', ['bestseller']),
  bk(66, 'Pan-African Dreams', 'Dr. Kwame Oduya', 'forestSage', 'Politics/Culture', 2022, 4.6, 534, 'Unity as the ultimate power strategy.', []),
  bk(67, 'She Built This City', 'Naomi J. Reynolds', 'roseCopper', 'Biography', 2023, 4.9, 312, 'Black women architects of modern America.', ['award-winner']),
  bk(68, 'The Ancestral Blueprint', 'Dr. Asha T. Carter', 'cosmicPurple', 'Culture', 2024, 4.8, 289, 'Wisdom encoded in generations.', [], true),
  bk(69, 'Ebony Excellence', 'Professor L. M. Brown', 'midnightSlate', 'Education', 2022, 4.7, 398, 'The pursuit of knowledge as liberation.', []),
  bk(70, 'The New Black Renaissance', 'Isaiah A. Washington', 'goldenSerif', 'Culture', 2023, 4.9, 356, 'Art, tech, and culture converging.', ['bestseller']),
  bk(71, 'Freedom Papers', 'Dr. Mia L. Freeman', 'steelBlue', 'History', 2023, 4.8, 424, 'Documents that changed the course of history.', []),
  bk(72, 'The Talented Tenth 2.0', 'Prof. Jamal K. Rivers', 'royalNavy', 'Culture', 2024, 4.7, 368, 'Redefining excellence for a new generation.', [], true),
];

const SELF_HELP = [
  bk(80, 'Atomic Discipline', 'Carter J. Wells', 'steelBlue', 'Self-Help', 2023, 4.8, 264, 'Tiny habits, massive results.', ['bestseller']),
  bk(81, 'The Mindset Reset', 'Dr. Layla M. Brooks', 'forestSage', 'Psychology', 2023, 4.7, 298, 'Rewiring your brain for success.', []),
  bk(82, 'Morning Magic', 'Serena T. Vaughan', 'sunsetAmber', 'Productivity', 2024, 4.6, 186, 'The first hour sets the tone for everything.', [], true),
  bk(83, 'The Anxiety Cure', 'Dr. Michael C. Rivers', 'oceanTeal', 'Mental Health', 2023, 4.9, 312, 'Evidence-based relief from modern anxiety.', ['bestseller']),
  bk(84, "Unf*ck Your Mind", 'Alex P. Jordan', 'crimsonGold', 'Self-Help', 2022, 4.7, 234, 'Raw, real, and relentlessly effective.', ['bestseller']),
  bk(85, 'The Confidence Code', 'Brittany A. Monroe', 'roseCopper', 'Self-Help', 2023, 4.8, 256, 'Confidence is a skill, not a trait.', []),
  bk(86, 'Deep Focus', 'Benjamin T. Reeves', 'midnightSlate', 'Productivity', 2022, 4.6, 201, 'Cal Newport-level deep work mastery.', []),
  bk(87, 'The Power of No', 'Dr. Sarah K. Williams', 'royalNavy', 'Self-Help', 2023, 4.7, 178, 'Boundaries are the new success strategy.', []),
  bk(88, 'Love Yourself First', 'Candice M. Hall', 'roseCopper', 'Mental Health', 2024, 4.9, 289, 'The radical act of self-prioritization.', [], true),
  bk(89, 'The Energy Architect', 'Dr. Zara Osei', 'goldenSerif', 'Wellness', 2023, 4.8, 312, 'Design your days around energy, not time.', ['bestseller']),
  bk(90, '21 Days to a New You', 'Coach Denise Fuller', 'forestSage', 'Self-Help', 2023, 4.5, 156, 'Three weeks to transformation.', []),
  bk(91, 'The Inner Work', 'Dr. Christopher J. Love', 'cosmicPurple', 'Psychology', 2022, 4.8, 356, 'The deep dive that changes everything.', ['bestseller']),
  bk(92, 'Reprogram & Rise', 'Nina T. Baldwin', 'oceanTeal', 'Mindset', 2024, 4.7, 278, 'Rewire your subconscious for success.', [], true),
];

const BUSINESS = [
  bk(100, 'Build an Empire', 'Ricky T. Pearson', 'goldenSerif', 'Business', 2023, 4.9, 456, 'From zero to empire in 5 years.', ['bestseller']),
  bk(101, 'The Six-Figure Side Hustle', 'Monica L. Davis', 'sunsetAmber', 'Finance', 2024, 4.8, 312, 'Real strategies, real income, real freedom.', [], true),
  bk(102, 'Crypto, Stocks & Real Estate', 'Derek A. Grant', 'steelBlue', 'Investing', 2023, 4.7, 388, 'The triple portfolio that builds wealth.', ['bestseller']),
  bk(103, 'The Startup Playbook', 'Dr. Kevin M. Wright', 'royalNavy', 'Entrepreneurship', 2022, 4.8, 478, 'From idea to IPO.', []),
  bk(104, 'Cash Flow Mastery', 'Angela R. Stone', 'earthBrown', 'Finance', 2023, 4.9, 298, 'Money in > Money out. Master the gap.', ['bestseller']),
  bk(105, 'The Real Estate Blueprint', 'Marcus J. Edwards', 'forestSage', 'Real Estate', 2023, 4.7, 412, 'Building a property portfolio from scratch.', []),
  bk(106, 'Brand or Be Branded', 'Tiffany N. Cross', 'roseCopper', 'Marketing', 2024, 4.8, 267, 'Own your narrative. Build your brand.', [], true),
  bk(107, 'The Negotiation Master', 'Dr. James L. Porter', 'midnightSlate', 'Business', 2022, 4.6, 289, 'Never lose a deal again.', []),
  bk(108, 'Scale to 7 Figures', 'Darius T. Banks', 'crimsonGold', 'Entrepreneurship', 2023, 4.9, 356, 'The systems separating 6 and 7-figure businesses.', ['bestseller']),
  bk(109, 'E-Commerce Empire', 'Lisa M. Jackson', 'oceanTeal', 'E-Commerce', 2024, 4.7, 312, 'Build a million-dollar store from anywhere.', [], true),
  bk(110, 'The Investment Bible', 'Professor Robert N. Clarke', 'goldenSerif', 'Investing', 2022, 4.8, 534, 'Every investment principle you need.', ['bestseller']),
  bk(111, 'Side Hustle to Empire', 'Tamara J. Reynolds', 'sunsetAmber', 'Entrepreneurship', 2023, 4.7, 289, 'From employee to empire builder.', []),
  bk(112, 'The Profit Blueprint', 'Isaiah M. Grant', 'steelBlue', 'Business', 2024, 4.6, 322, 'Profit is not optional — it\'s a system.', [], true),
];

const EOF_ORIGINALS = [
  bk(120, 'The EOF Manuscript', 'The Founders', 'crimsonGold', 'EOF Exclusive', 2024, 5.0, 512, 'The foundational text of the EOF movement. Members only.', ['exclusive', 'featured'], true, true),
  bk(121, 'Encrypted Wisdom', 'EOF Editorial Team', 'cosmicPurple', 'EOF Exclusive', 2024, 4.9, 388, 'Coded knowledge for those ready to receive it.', ['exclusive'], true),
  bk(122, 'The Digital Scroll', 'EOF Collective', 'goldenSerif', 'EOF Exclusive', 2023, 4.8, 298, 'Ancient wisdom for the digital age. EOF edition.', ['exclusive']),
  bk(123, 'Vault of Knowledge', 'EOF Archives', 'midnightSlate', 'EOF Exclusive', 2023, 4.9, 634, 'The complete EOF knowledge archive. Vol. 1.', ['exclusive']),
  bk(124, 'The Alpha Collection', 'EOF Press', 'royalNavy', 'EOF Exclusive', 2024, 4.8, 456, 'Premium content curated for EOF Alpha members.', ['exclusive'], true),
  bk(125, 'Forbidden Pages', 'EOF Studio', 'lushMaroon', 'EOF Exclusive', 2023, 5.0, 289, 'The content too powerful for other platforms.', ['exclusive', 'featured']),
  bk(126, 'The Library Within', 'EOF Authors Guild', 'earthBrown', 'EOF Exclusive', 2024, 4.7, 376, 'A curated collection from EOF authors.', ['exclusive'], true),
  bk(127, 'Chronicles of the Mind', 'EOF Elite', 'steelBlue', 'EOF Exclusive', 2023, 4.9, 412, 'Elite thinking for EOF premium members.', ['exclusive']),
  bk(128, 'The Inner Circle Codex', 'EOF Founders', 'crimsonGold', 'EOF Exclusive', 2024, 5.0, 298, 'Insider knowledge from those who built EOF.', ['exclusive', 'featured'], true, true),
  bk(129, 'Wisdom Unlocked', 'EOF Premium', 'forestSage', 'EOF Exclusive', 2023, 4.8, 334, 'Premium wisdom for premium minds.', ['exclusive']),
  bk(130, 'The Mastermind Files', 'EOF Research', 'goldenSerif', 'EOF Exclusive', 2024, 4.9, 478, 'Research-backed insights from the EOF think tank.', ['exclusive'], true),
  bk(131, 'The Sacred Texts Collection', 'EOF Originals', 'cosmicPurple', 'EOF Exclusive', 2023, 5.0, 756, 'The complete collection. Members only.', ['exclusive', 'featured'], false, true),
];

const CREATOR_SPOTLIGHT = [
  bk(140, 'My Grind, My Story', 'Darius King', 'earthBrown', 'Memoir', 2024, 4.8, 312, 'Creator and community builder shares his raw journey.', ['creator'], true),
  bk(141, 'Code to Canvas', 'Priya Sharma', 'oceanTeal', 'Creativity', 2024, 4.7, 256, 'From developer to creative entrepreneur.', ['creator'], true),
  bk(142, 'The Podcast Blueprint', 'Jerome T. Ellis', 'royalNavy', 'Media', 2023, 4.9, 289, 'Build a podcast empire from your bedroom.', ['creator']),
  bk(143, 'Social Gold', 'Brianna M. Parks', 'sunsetAmber', 'Marketing', 2024, 4.8, 234, 'Turning social media into a real income stream.', ['creator'], true),
  bk(144, 'The Content Empire', 'Marcus J. Lee', 'goldenSerif', 'Business', 2023, 4.7, 312, 'Scale your content to scale your income.', ['creator']),
  bk(145, 'Behind the Lens', 'Sofia Okonkwo', 'roseCopper', 'Photography', 2024, 4.6, 198, 'Visual storytelling as a business.', ['creator'], true),
  bk(146, 'The Newsletter King', 'Calvin T. Brooks', 'steelBlue', 'Marketing', 2023, 4.8, 267, 'Build an audience, build a business.', ['creator']),
  bk(147, 'Viral by Design', 'Keisha R. Monroe', 'cosmicPurple', 'Marketing', 2024, 4.9, 289, 'The formula for content that spreads.', ['creator'], true),
];

const DIY_COURSES = [
  { id: 'c1', title: 'Build Your Own App', instructor: 'EOF Tech Team', lessons: 24, hours: 8, students: 1240, rating: 4.9, level: 'Beginner', theme: 'steelBlue', badge: 'Popular' },
  { id: 'c2', title: 'Real Estate Investing 101', instructor: 'Marcus J. Edwards', lessons: 18, hours: 6, students: 890, rating: 4.8, level: 'Beginner', theme: 'earthBrown', badge: 'New' },
  { id: 'c3', title: 'YouTube Channel Growth', instructor: 'Jerome T. Ellis', lessons: 30, hours: 12, students: 2100, rating: 4.9, level: 'All Levels', theme: 'crimsonGold', badge: 'Bestseller' },
  { id: 'c4', title: 'E-Commerce Masterclass', instructor: 'Lisa M. Jackson', lessons: 22, hours: 9, students: 1560, rating: 4.7, level: 'Intermediate', theme: 'oceanTeal', badge: '' },
  { id: 'c5', title: 'Public Speaking Mastery', instructor: 'Angela R. Stone', lessons: 15, hours: 5, students: 780, rating: 4.8, level: 'All Levels', theme: 'goldenSerif', badge: 'New' },
  { id: 'c6', title: 'Social Media Marketing', instructor: 'Brianna M. Parks', lessons: 28, hours: 10, students: 3200, rating: 4.9, level: 'Beginner', theme: 'sunsetAmber', badge: 'Popular' },
  { id: 'c7', title: 'Financial Freedom Blueprint', instructor: 'Devon A. Cross', lessons: 20, hours: 7, students: 1890, rating: 4.9, level: 'All Levels', theme: 'forestSage', badge: 'Bestseller' },
  { id: 'c8', title: 'Content Creator Academy', instructor: 'Darius King', lessons: 35, hours: 14, students: 2450, rating: 4.8, level: 'All Levels', theme: 'cosmicPurple', badge: 'Popular' },
];

// ─────────────────────────────────────────────────────────────────────────────
// TOAST HOOK
// ─────────────────────────────────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);
  return { toasts, add };
}

function ToastStack({ toasts }) {
  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-sm font-medium pointer-events-auto ${
              t.type === 'error' ? 'bg-red-900/95 text-red-100 border border-red-700' : 'bg-gray-900/98 text-white border border-white/10'
            }`}
            style={{ backdropFilter: 'blur(12px)' }}>
            <span className="text-base">{t.type === 'error' ? '✕' : '✓'}</span>
            <span>{t.msg}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BOOK COVER ART
// ─────────────────────────────────────────────────────────────────────────────
const SIZES = {
  xs:   { w: 80,  h: 120, ts: '8px',  as: '7px'  },
  sm:   { w: 110, h: 165, ts: '9px',  as: '8px'  },
  md:   { w: 148, h: 222, ts: '10px', as: '9px'  },
  lg:   { w: 176, h: 264, ts: '11px', as: '10px' },
  xl:   { w: 214, h: 321, ts: '13px', as: '11px' },
  hero: { w: 256, h: 384, ts: '15px', as: '12px' },
};

function BookCoverArt({ book, size = 'md', className = '' }) {
  const s = SIZES[size] || SIZES.md;
  const theme = T[book.theme] || T.goldenSerif;
  const pat = Number(book.id.replace(/\D/g, '') || 0) % 5;

  return (
    <div
      className={`relative overflow-hidden rounded-lg flex-shrink-0 select-none ${className}`}
      style={{
        width: s.w, height: s.h,
        background: `linear-gradient(150deg, ${theme.a} 0%, ${theme.b} 100%)`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.06)',
      }}>
      {/* Spine */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px]"
        style={{ background: `linear-gradient(to bottom, ${theme.accent}80, transparent 70%)` }} />
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: theme.accent, opacity: 0.75 }} />
      {/* Decorative ring outer */}
      <div className="absolute" style={{
        top: '14%', left: '50%', transform: 'translateX(-50%)',
        width: s.w * 0.6, height: s.w * 0.6,
        border: `1.5px solid ${theme.accent}35`,
        borderRadius: pat < 2 ? '50%' : pat === 2 ? '8px' : '2px',
      }} />
      {/* Decorative ring inner */}
      <div className="absolute" style={{
        top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: s.w * 0.38, height: s.w * 0.38,
        border: `1px solid ${theme.accent}25`,
        borderRadius: pat < 2 ? '50%' : pat === 2 ? '6px' : '2px',
      }} />
      {/* Center accent */}
      <div className="absolute rounded-full" style={{
        top: `calc(14% + ${s.w * 0.3 - 4}px)`, left: '50%', transform: 'translateX(-50%)',
        width: 8, height: 8,
        background: theme.accent, opacity: 0.9,
      }} />
      {/* Bottom text gradient */}
      <div className="absolute bottom-0 left-0 right-0" style={{
        height: '55%',
        background: `linear-gradient(to top, ${theme.b}ff 0%, ${theme.b}cc 40%, transparent 100%)`,
      }} />
      {/* Title & author */}
      <div className="absolute bottom-0 left-0 right-0 p-2.5">
        <p style={{ fontSize: s.ts, color: theme.text, fontFamily: 'Playfair Display, serif', fontWeight: 700, lineHeight: 1.25, marginBottom: 3, textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}
          className="line-clamp-3">
          {book.title}
        </p>
        <p style={{ fontSize: s.as, color: theme.text, opacity: 0.65 }}
          className="truncate">
          {book.author}
        </p>
      </div>
      {/* Badges */}
      {book.isNew && (
        <div className="absolute top-2 right-2 rounded font-bold uppercase"
          style={{ background: theme.accent, color: '#fff', fontSize: '7px', padding: '2px 5px', letterSpacing: '0.08em' }}>
          NEW
        </div>
      )}
      {book.hot && !book.isNew && (
        <div className="absolute top-2 right-2 rounded font-bold uppercase bg-orange-600 text-white"
          style={{ fontSize: '7px', padding: '2px 5px', letterSpacing: '0.08em' }}>
          HOT
        </div>
      )}
      {book.tags?.includes('exclusive') && (
        <div className="absolute top-2 left-3">
          <FiLock size={10} color={theme.accent} />
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BOOK DETAIL MODAL
// ─────────────────────────────────────────────────────────────────────────────
function BookDetailModal({ book, onClose, toast }) {
  const [shelfAdded, setShelfAdded] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();
  const theme = T[book.theme] || T.goldenSerif;

  useEffect(() => {
    const h = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const go = (msg, path) => { onClose(); toast.add(msg); if (path) navigate(path); };

  return (
    <motion.div key="modal-bg"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.87)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}>
      <motion.div key="modal-panel"
        initial={{ opacity: 0, scale: 0.9, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ type: 'spring', damping: 26, stiffness: 280 }}
        className="relative w-full max-w-2xl rounded-2xl overflow-hidden"
        style={{ background: '#141414', border: '1px solid #2A2A2A' }}
        onClick={e => e.stopPropagation()}>

        {/* Ambient glow */}
        <div className="absolute top-0 left-0 right-0 h-72 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 35% 0%, ${theme.accent}28 0%, transparent 65%)` }} />

        <button onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
          <FiX size={18} />
        </button>

        <div className="relative flex gap-6 p-6">
          {/* Cover */}
          <div className="flex-shrink-0 flex flex-col items-center">
            <BookCoverArt book={book} size="xl" />
            <div className="flex items-center gap-1 mt-3">
              {[1,2,3,4,5].map(i => (
                <FiStar key={i} size={12}
                  fill={i <= Math.round(book.rating) ? '#D4AF37' : 'none'}
                  color={i <= Math.round(book.rating) ? '#D4AF37' : '#444'} />
              ))}
              <span className="text-xs text-gray-500 ml-1">{book.rating}</span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="flex flex-wrap gap-1.5 mb-2">
              <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-md">{book.genre}</span>
              <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-md">{book.year}</span>
              {book.pages && <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-md">{book.pages} pg</span>}
            </div>

            <h2 className="font-serif text-2xl font-black text-white leading-tight mb-1">{book.title}</h2>
            <p className="text-sm text-gray-400 mb-4">by <span className="text-gray-200 font-medium">{book.author}</span></p>

            {book.desc && <p className="text-sm text-gray-400 leading-relaxed mb-4">{book.desc}</p>}

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {book.tags?.map(tag => (
                <span key={tag} className={`text-xs px-2.5 py-0.5 rounded-full border ${
                  tag === 'bestseller' ? 'bg-yellow-900/40 text-yellow-400 border-yellow-800/50' :
                  tag === 'exclusive'  ? 'bg-purple-900/40 text-purple-300 border-purple-800/50' :
                  tag === 'featured'   ? 'bg-blue-900/40 text-blue-300 border-blue-800/50' :
                  tag === 'award-winner'? 'bg-orange-900/40 text-orange-300 border-orange-800/50' :
                  'bg-gray-800/60 text-gray-400 border-gray-700/40'
                }`}>{tag}</span>
              ))}
            </div>

            {/* Primary actions */}
            <div className="flex flex-wrap gap-2 mb-3">
              <button onClick={() => go('📖 Opening book...', `/library/${book.id}`)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-black hover:brightness-110 transition-all"
                style={{ background: '#D4AF37' }}>
                <FiBookOpen size={14} /> Read Now
              </button>
              <button onClick={() => go('🎧 Starting audiobook player...')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-white/10 text-white hover:bg-white/15 transition-all">
                <FiPlay size={14} /> Listen
              </button>
              <button onClick={() => { setShelfAdded(true); toast.add('✓ Added to My Reading List'); }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${shelfAdded ? 'bg-green-900/40 text-green-400 border border-green-800/60' : 'bg-white/10 text-white hover:bg-white/15'}`}>
                {shelfAdded ? <FiCheck size={14} /> : <FiPlus size={14} />}
                {shelfAdded ? 'On Shelf' : 'Add to Shelf'}
              </button>
            </div>

            {/* Secondary actions */}
            <div className="flex gap-2">
              {[
                { label: 'Bookmark', icon: FiBookmark, active: bookmarked, color: 'text-yellow-400 bg-yellow-900/20',
                  action: () => { setBookmarked(b => !b); toast.add(bookmarked ? 'Bookmark removed' : '🔖 Bookmarked!'); } },
                { label: 'Like', icon: FiHeart, active: liked, color: 'text-red-400 bg-red-900/20',
                  action: () => { setLiked(l => !l); toast.add(liked ? 'Removed from favorites' : '❤️ Added to Favorites'); } },
                { label: 'Share', icon: FiShare2, active: false, color: '',
                  action: () => { navigator.clipboard?.writeText(`${window.location.origin}/library/${book.id}`); toast.add('🔗 Link copied!'); } },
                { label: 'Download', icon: FiDownload, active: false, color: '',
                  action: () => toast.add('📥 Preparing download...') },
              ].map(({ label, icon: Icon, active, color, action }) => (
                <button key={label} onClick={action}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all ${active ? color : 'text-gray-500 hover:text-gray-300 bg-white/5 hover:bg-white/10'}`}>
                  <Icon size={12} fill={active ? 'currentColor' : 'none'} /> {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// UPLOAD MODAL
// ─────────────────────────────────────────────────────────────────────────────
const GENRES = [
  'Self-Help', 'Business & Finance', 'Fiction', 'Non-Fiction', 'History',
  'Biography', 'Spirituality', 'Poetry', 'Psychology', 'Health & Wellness',
  'Education', 'DIY / How-To', "Children's", 'Culture', 'Marketing',
  'Productivity', 'Real Estate', 'Investing', 'Other',
];

function UploadModal({ onClose, toast }) {
  const [drag, setDrag] = useState(false);
  const [file, setFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [form, setForm] = useState({ title: '', author: '', genre: '', year: String(new Date().getFullYear()), pages: '', description: '' });
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const fileRef = useRef();
  const coverRef = useRef();

  useEffect(() => {
    const h = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const handleDrop = e => {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  const handleCoverChange = e => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = ev => setCoverPreview(ev.target.result);
    reader.readAsDataURL(f);
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.author.trim()) { toast.add('Title and Author are required', 'error'); return; }
    setUploading(true);
    try {
      await axios.post('/api/products', { ...form, type: 'book' });
    } catch { /* API may be offline — simulate success */ }
    await new Promise(r => setTimeout(r, 1400));
    setUploading(false);
    setDone(true);
  };

  const field = (label, key, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
      <input type={type} value={form[key]}
        onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
        placeholder={placeholder}
        className="w-full rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[130] flex items-start justify-center p-4 pt-10 overflow-y-auto"
      style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
        className="relative w-full max-w-xl rounded-2xl overflow-hidden mb-8"
        style={{ background: '#141414', border: '1px solid #2A2A2A' }}
        onClick={e => e.stopPropagation()}>

        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <div>
            <h2 className="font-serif text-xl font-black text-white">Upload a Book</h2>
            <p className="text-xs text-gray-500 mt-0.5">Add your book to the EOF Digital Library</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
            <FiX size={18} />
          </button>
        </div>

        {done ? (
          <div className="flex flex-col items-center py-16 px-6">
            <div className="w-16 h-16 rounded-full bg-green-900/40 border border-green-700/50 flex items-center justify-center mb-5">
              <FiCheck size={28} className="text-green-400" />
            </div>
            <h3 className="font-serif text-2xl text-white mb-2">Book Uploaded!</h3>
            <p className="text-sm text-gray-500 text-center mb-8">
              "{form.title}" has been added to the library and will appear in your collection shortly.
            </p>
            <div className="flex gap-3">
              <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-white/10 text-white text-sm hover:bg-white/15 transition-all">Close</button>
              <button onClick={() => { setDone(false); setFile(null); setCoverPreview(null); setForm({ title:'', author:'', genre:'', year: String(new Date().getFullYear()), pages:'', description:'' }); }}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-black hover:brightness-110 transition-all" style={{ background: '#D4AF37' }}>
                Upload Another
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Drop zone */}
            <div onDragOver={e => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)} onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-xl py-8 flex flex-col items-center gap-3 cursor-pointer transition-all ${drag ? 'border-yellow-500/60 bg-yellow-900/10' : 'border-white/10 hover:border-white/20'}`}>
              <input ref={fileRef} type="file" accept=".pdf,.epub,.mobi,.txt" className="hidden"
                onChange={e => e.target.files[0] && setFile(e.target.files[0])} />
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${drag ? 'bg-yellow-900/30' : 'bg-white/5'}`}>
                <FiFile size={22} className={drag ? 'text-yellow-400' : 'text-gray-500'} />
              </div>
              {file ? (
                <div className="text-center">
                  <p className="text-sm text-white font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{(file.size / 1024 / 1024).toFixed(2)} MB · Click to change</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-gray-300 font-medium">Drop your book file here</p>
                  <p className="text-xs text-gray-600 mt-1">PDF, EPUB, MOBI, TXT accepted</p>
                </div>
              )}
            </div>

            {/* Cover image */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">Cover Image <span className="text-gray-600">(optional)</span></label>
              <div className="flex items-center gap-4">
                <div onClick={() => coverRef.current?.click()}
                  className="w-16 h-24 rounded-lg border-2 border-dashed border-white/10 hover:border-white/20 flex items-center justify-center cursor-pointer overflow-hidden transition-all flex-shrink-0">
                  <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
                  {coverPreview
                    ? <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                    : <FiImage size={18} className="text-gray-600" />}
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Recommended: 400 × 600 px</p>
                  <p>JPG, PNG, or WebP</p>
                  {coverPreview && (
                    <button onClick={() => setCoverPreview(null)} className="text-red-400 hover:text-red-300 transition-colors">Remove</button>
                  )}
                </div>
              </div>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-2 gap-4">
              {field('Book Title *', 'title', 'text', 'Enter the full title')}
              {field('Author Name *', 'author', 'text', 'Author or Creator')}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Genre</label>
                <select value={form.genre} onChange={e => setForm(p => ({ ...p, genre: e.target.value }))}
                  className="w-full rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <option value="">Select genre...</option>
                  {GENRES.map(g => <option key={g} value={g} style={{ background: '#1a1a1a' }}>{g}</option>)}
                </select>
              </div>
              {field('Year', 'year', 'number', '2024')}
            </div>
            {field('Pages / Duration', 'pages', 'text', 'e.g. 320 pages  or  4hr 20min')}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Description</label>
              <textarea value={form.description} rows={3} placeholder="Write a compelling description of your book..."
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                className="w-full rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none resize-none transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
            </div>

            <div className="flex gap-3 pt-1">
              <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm text-gray-300 bg-white/5 hover:bg-white/10 transition-all">Cancel</button>
              <button onClick={handleSubmit} disabled={uploading}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-black flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-60 transition-all"
                style={{ background: '#D4AF37' }}>
                {uploading
                  ? <><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Uploading...</>
                  : <><FiUpload size={15} /> Upload Book</>}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BOOK CARD (with hover overlay)
// ─────────────────────────────────────────────────────────────────────────────
function BookCard({ book, onBook, toast, rank }) {
  const [hovered, setHovered] = useState(false);
  const [shelfAdded, setShelfAdded] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="relative flex-shrink-0 cursor-pointer" style={{ width: 148 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onBook(book)}>
      {/* Rank number */}
      {rank && (
        <div className="absolute -left-5 bottom-10 z-10 font-black leading-none select-none pointer-events-none"
          style={{ fontSize: 44, color: 'rgba(255,255,255,0.07)', WebkitTextStroke: '1px rgba(255,255,255,0.11)' }}>
          {rank}
        </div>
      )}

      <motion.div animate={{ scale: hovered ? 1.07 : 1, zIndex: hovered ? 10 : 1 }}
        transition={{ duration: 0.18, ease: 'easeOut' }} className="relative">
        <BookCoverArt book={book} size="md" />

        <AnimatePresence>
          {hovered && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.14 }}
              className="absolute inset-0 rounded-lg flex flex-col items-center justify-center gap-2 px-2"
              style={{ background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(3px)' }}
              onClick={e => e.stopPropagation()}>
              <button onClick={() => { navigate(`/library/${book.id}`); toast.add('📖 Opening book...'); }}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold text-black hover:brightness-110 transition-all"
                style={{ background: '#D4AF37' }}>
                <FiBookOpen size={12} /> Read
              </button>
              <button onClick={() => toast.add('🎧 Starting audiobook...')}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs text-white bg-white/15 hover:bg-white/25 transition-all">
                <FiPlay size={11} /> Listen
              </button>
              <div className="flex gap-2 mt-0.5">
                <button onClick={() => { setShelfAdded(true); toast.add('✓ Added to My Reading List'); }}
                  title="Add to shelf"
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${shelfAdded ? 'bg-green-600' : 'bg-white/15 hover:bg-white/25'}`}>
                  {shelfAdded ? <FiCheck size={12} className="text-white" /> : <FiPlus size={12} className="text-white" />}
                </button>
                <button onClick={() => { setBookmarked(b => !b); toast.add(bookmarked ? 'Bookmark removed' : '🔖 Bookmarked!'); }}
                  title="Bookmark"
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${bookmarked ? 'bg-yellow-700' : 'bg-white/15 hover:bg-white/25'}`}>
                  <FiBookmark size={12} className="text-white" fill={bookmarked ? 'currentColor' : 'none'} />
                </button>
                <button onClick={() => onBook(book)} title="More info"
                  className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-all">
                  <FiInfo size={12} className="text-white" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="mt-2 px-0.5">
        <p className="text-xs text-gray-300 font-medium leading-tight truncate">{book.title}</p>
        <p className="text-[11px] text-gray-600 truncate mt-0.5">{book.author}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTINUE READING CARD
// ─────────────────────────────────────────────────────────────────────────────
function ContinueCard({ book, onBook, toast }) {
  const r = 18;
  const circ = 2 * Math.PI * r;
  const dash = (book.progress / 100) * circ;

  return (
    <div className="flex-shrink-0 cursor-pointer group/cc" style={{ width: 248 }} onClick={() => onBook(book)}>
      <div className="rounded-xl overflow-hidden transition-all duration-200 group-hover/cc:scale-[1.03] group-hover/cc:shadow-xl"
        style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
        <div className="flex items-center gap-3 p-3">
          <BookCoverArt book={book} size="xs" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{book.title}</p>
            <p className="text-[11px] text-gray-500 truncate mt-0.5">{book.author}</p>
            <p className="text-[10px] text-gray-600 mt-1.5">Last read: {book.lastRead}</p>
          </div>
          {/* Progress ring */}
          <svg width="44" height="44" viewBox="0 0 44 44" className="flex-shrink-0">
            <circle cx="22" cy="22" r={r} fill="none" stroke="#2A2A2A" strokeWidth="3.5" />
            <circle cx="22" cy="22" r={r} fill="none" stroke="#D4AF37" strokeWidth="3.5"
              strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
              transform="rotate(-90 22 22)" />
            <text x="22" y="26.5" textAnchor="middle" fontSize="9" fill="#D4AF37" fontWeight="bold">
              {book.progress}%
            </text>
          </svg>
        </div>
        {/* Progress bar */}
        <div className="mx-3 h-[2px] rounded-full bg-white/5">
          <div className="h-full rounded-full transition-all" style={{ width: `${book.progress}%`, background: '#D4AF37' }} />
        </div>
        <div className="p-3">
          <button onClick={e => { e.stopPropagation(); toast.add('📖 Continuing where you left off...'); }}
            className="w-full py-2 rounded-lg text-xs font-bold text-black hover:brightness-110 transition-all"
            style={{ background: '#D4AF37' }}>
            Continue Reading
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HORIZONTAL SCROLL ROW
// ─────────────────────────────────────────────────────────────────────────────
function ScrollRow({ title, books, onBook, toast, showRank = false, badge, icon: Icon, continueMode = false }) {
  const ref = useRef();
  const [canL, setCanL] = useState(false);
  const [canR, setCanR] = useState(true);

  const update = () => {
    const el = ref.current;
    if (!el) return;
    setCanL(el.scrollLeft > 10);
    setCanR(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const go = dir => ref.current?.scrollBy({ left: dir * 620, behavior: 'smooth' });

  return (
    <section className="mb-6 group/row">
      <div className="flex items-center justify-between px-6 mb-4">
        <div className="flex items-center gap-2.5">
          {Icon && <Icon size={16} className="text-yellow-500 opacity-80" />}
          <h2 className="text-base font-bold text-white tracking-tight">{title}</h2>
          {badge && (
            <span className="text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest text-white"
              style={{ background: '#C0392B' }}>
              {badge}
            </span>
          )}
        </div>
        <button className="text-xs font-medium text-gray-600 hover:text-yellow-500 transition-colors flex items-center gap-1">
          See All <FiChevronRight size={13} />
        </button>
      </div>

      <div className="relative">
        <AnimatePresence>
          {canL && (
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => go(-1)}
              className="absolute left-0 top-8 z-10 w-12 h-28 flex items-center justify-center rounded-r-lg opacity-0 group-hover/row:opacity-100 transition-opacity"
              style={{ background: 'linear-gradient(to right, rgba(13,13,13,0.97) 0%, rgba(13,13,13,0) 100%)' }}>
              <FiChevronLeft size={24} className="text-white" />
            </motion.button>
          )}
        </AnimatePresence>

        <div ref={ref} onScroll={update}
          className="flex gap-5 overflow-x-auto scrollbar-hide px-6 pb-3" style={{ paddingRight: 24 }}>
          {continueMode
            ? books.map(b => <ContinueCard key={b.id} book={b} onBook={onBook} toast={toast} />)
            : books.map((b, i) => <BookCard key={b.id} book={b} onBook={onBook} toast={toast} rank={showRank ? i + 1 : undefined} />)}
        </div>

        <AnimatePresence>
          {canR && (
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => go(1)}
              className="absolute right-0 top-8 z-10 w-12 h-28 flex items-center justify-center rounded-l-lg opacity-0 group-hover/row:opacity-100 transition-opacity"
              style={{ background: 'linear-gradient(to left, rgba(13,13,13,0.97) 0%, rgba(13,13,13,0) 100%)' }}>
              <FiChevronRight size={24} className="text-white" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COURSE CARD
// ─────────────────────────────────────────────────────────────────────────────
function CourseCard({ course, toast }) {
  const theme = T[course.theme] || T.goldenSerif;
  return (
    <div className="flex-shrink-0 rounded-xl overflow-hidden cursor-pointer group/course transition-transform duration-200 hover:scale-[1.04]"
      style={{ width: 264, background: `linear-gradient(150deg, ${theme.a} 0%, ${theme.b} 100%)`, border: '1px solid rgba(255,255,255,0.06)' }}
      onClick={() => toast.add('🎓 Opening course...')}>
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between mb-3">
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: theme.accent }}>{course.level}</span>
          {course.badge && (
            <span className="text-[9px] font-black uppercase tracking-wide px-2 py-0.5 rounded"
              style={{ background: theme.accent + '2A', color: theme.accent, border: `1px solid ${theme.accent}40` }}>
              {course.badge}
            </span>
          )}
        </div>
        <h3 className="text-sm font-bold text-white leading-tight mb-1">{course.title}</h3>
        <p className="text-xs mb-4 truncate" style={{ color: theme.text, opacity: 0.65 }}>by {course.instructor}</p>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1"><FiBookOpen size={11} /> {course.lessons} lessons</span>
          <span className="flex items-center gap-1"><FiClock size={11} /> {course.hours}h</span>
          <span className="flex items-center gap-1"><FiUsers size={11} /> {course.students.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1 mt-2.5">
          {[1,2,3,4,5].map(i => (
            <FiStar key={i} size={11}
              fill={i <= Math.round(course.rating) ? theme.accent : 'none'}
              color={i <= Math.round(course.rating) ? theme.accent : '#444'} />
          ))}
          <span className="text-[11px] text-gray-500 ml-1">{course.rating}</span>
        </div>
      </div>
      <div className="px-5 pb-5">
        <button onClick={e => { e.stopPropagation(); toast.add('🎓 Enrolling in course...'); }}
          className="w-full py-2.5 rounded-lg text-xs font-black uppercase tracking-wide transition-all hover:brightness-110"
          style={{ background: theme.accent, color: '#fff' }}>
          Start Course
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO SECTION
// ─────────────────────────────────────────────────────────────────────────────
function HeroSection({ books, onBook, onUpload, toast }) {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const book = books[active];
  const theme = T[book.theme] || T.goldenSerif;

  useEffect(() => {
    const t = setInterval(() => setActive(i => (i + 1) % books.length), 6500);
    return () => clearInterval(t);
  }, [books.length]);

  return (
    <div className="relative w-full overflow-hidden" style={{ minHeight: '74vh', background: '#090909' }}>
      {/* Ambient background */}
      <AnimatePresence mode="sync">
        <motion.div key={`ambience-${active}`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 1.4 }}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at 15% 60%, ${theme.a}cc 0%, transparent 50%),
              radial-gradient(ellipse at 80% 15%, ${theme.accent}16 0%, transparent 45%),
              #090909
            `
          }} />
      </AnimatePresence>
      {/* Bottom fade into content */}
      <div className="absolute bottom-0 left-0 right-0 h-28 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #0D0D0D 0%, transparent 100%)' }} />

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-between px-6 md:px-14 lg:px-20" style={{ minHeight: '74vh' }}>
        {/* Text */}
        <AnimatePresence mode="wait">
          <motion.div key={`hero-text-${active}`}
            initial={{ opacity: 0, x: -28 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 28 }} transition={{ duration: 0.48 }}
            className="flex-1 max-w-xl py-20">

            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className="text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full"
                style={{ background: theme.accent + '22', color: theme.accent, border: `1px solid ${theme.accent}44` }}>
                {book.genre}
              </span>
              {book.hot && <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-orange-900/50 text-orange-400 border border-orange-800/60 font-semibold">🔥 Trending</span>}
              {book.isNew && <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-900/50 text-blue-300 border border-blue-800/60 font-semibold">✦ New</span>}
              {book.tags?.includes('bestseller') && <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-yellow-900/50 text-yellow-400 border border-yellow-800/60 font-semibold">★ Bestseller</span>}
            </div>

            <h1 className="font-serif text-4xl md:text-5xl font-black text-white leading-tight mb-3">{book.title}</h1>
            <p className="text-gray-400 text-sm mb-2">by <span className="text-gray-200 font-semibold">{book.author}</span></p>

            <div className="flex items-center gap-1.5 mb-5">
              {[1,2,3,4,5].map(i => (
                <FiStar key={i} size={14}
                  fill={i <= Math.round(book.rating) ? '#D4AF37' : 'none'}
                  color={i <= Math.round(book.rating) ? '#D4AF37' : '#3A3A3A'} />
              ))}
              <span className="text-sm text-gray-500 ml-1">{book.rating} · {book.pages} pages</span>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-md">{book.desc}</p>

            <div className="flex flex-wrap gap-3">
              <button onClick={() => { navigate(`/library/${book.id}`); toast.add('📖 Opening book...'); }}
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-black text-black hover:brightness-115 transition-all"
                style={{ background: '#D4AF37', boxShadow: `0 4px 24px ${theme.accent}50` }}>
                <FiBookOpen size={16} /> Read Now
              </button>
              <button onClick={() => onBook(book)}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-white/10 hover:bg-white/16 border border-white/10 transition-all">
                <FiPlay size={15} /> Preview
              </button>
              <button onClick={onUpload}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-medium text-gray-400 border border-white/12 hover:border-white/25 hover:text-white transition-all">
                <FiUpload size={14} /> Upload Book
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Cover */}
        <AnimatePresence mode="wait">
          <motion.div key={`hero-cover-${active}`}
            initial={{ opacity: 0, scale: 0.88, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -16 }}
            transition={{ duration: 0.52 }}
            className="hidden md:flex items-center justify-center flex-shrink-0 py-20 cursor-pointer"
            onClick={() => onBook(book)}>
            <div style={{ filter: `drop-shadow(0 32px 64px ${theme.accent}55)` }}>
              <BookCoverArt book={book} size="hero" />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Indicator pills */}
      <div className="absolute bottom-12 left-6 md:left-14 lg:left-20 z-20 flex gap-2">
        {books.map((_, i) => (
          <button key={i} onClick={() => setActive(i)}
            className="rounded-full transition-all duration-350"
            style={{ width: i === active ? 26 : 8, height: 8, background: i === active ? theme.accent : 'rgba(255,255,255,0.18)' }} />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SEARCH & UPLOAD BAR
// ─────────────────────────────────────────────────────────────────────────────
function SearchBar({ onUpload }) {
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  return (
    <div className="sticky top-16 z-20 flex items-center gap-3 px-6 py-3.5"
      style={{ background: 'rgba(13,13,13,0.94)', backdropFilter: 'blur(14px)', borderBottom: '1px solid rgba(42,42,42,0.6)' }}>
      <div className="relative flex-1 max-w-lg">
        <FiSearch size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
        <input value={q} onChange={e => setQ(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && q && navigate(`/library?search=${encodeURIComponent(q)}`)}
          placeholder="Search books, authors, genres..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none transition-colors"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }} />
      </div>
      <button onClick={onUpload}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-black flex-shrink-0 hover:brightness-110 transition-all"
        style={{ background: '#D4AF37' }}>
        <FiUpload size={14} /> Upload Book
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN LIBRARY PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function Library() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const toast = useToast();

  return (
    <div className="min-h-screen" style={{ background: '#0D0D0D' }}>
      {/* Hero */}
      <HeroSection books={HERO_BOOKS} onBook={setSelectedBook} onUpload={() => setShowUpload(true)} toast={toast} />

      {/* Sticky search + upload bar */}
      <SearchBar onUpload={() => setShowUpload(true)} />

      {/* Scroll rows */}
      <div className="pt-6 pb-16 space-y-2">
        <ScrollRow title="Continue Reading"       books={CONTINUE_READING}  onBook={setSelectedBook} toast={toast} continueMode icon={FiBook} />
        <ScrollRow title="New Releases"           books={NEW_RELEASES}      onBook={setSelectedBook} toast={toast} badge="NEW"       icon={FiAward} />
        <ScrollRow title="Trending Now"           books={TRENDING}          onBook={setSelectedBook} toast={toast} showRank badge="HOT" icon={FiTrendingUp} />
        <ScrollRow title="Black Excellence & History" books={BLACK_EXCELLENCE} onBook={setSelectedBook} toast={toast} />
        <ScrollRow title="Build Your Mind"        books={SELF_HELP}         onBook={setSelectedBook} toast={toast} icon={FiZap} />
        <ScrollRow title="Business & Finance"     books={BUSINESS}          onBook={setSelectedBook} toast={toast} />
        <ScrollRow title="EOF Originals"          books={EOF_ORIGINALS}     onBook={setSelectedBook} toast={toast} badge="EXCLUSIVE" />

        {/* DIY University */}
        <section className="mb-6">
          <div className="flex items-center justify-between px-6 mb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2.5">
              <span className="text-base">🎓</span> DIY University
            </h2>
            <button className="text-xs font-medium text-gray-600 hover:text-yellow-500 transition-colors flex items-center gap-1">
              See All <FiChevronRight size={13} />
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide px-6 pb-3">
            {DIY_COURSES.map(c => <CourseCard key={c.id} course={c} toast={toast} />)}
          </div>
        </section>

        <ScrollRow title="Creator Spotlight" books={CREATOR_SPOTLIGHT} onBook={setSelectedBook} toast={toast} />
      </div>

      {/* Modals */}
      <AnimatePresence>
        {selectedBook && (
          <BookDetailModal key="detail" book={selectedBook} onClose={() => setSelectedBook(null)} toast={toast} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showUpload && (
          <UploadModal key="upload" onClose={() => setShowUpload(false)} toast={toast} />
        )}
      </AnimatePresence>

      {/* Toast notifications */}
      <ToastStack toasts={toast.toasts} />
    </div>
  );
}
