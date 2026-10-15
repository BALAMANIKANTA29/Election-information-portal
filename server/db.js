import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'data.db');
export const db = new DatabaseSync(dbPath);

export function initDatabase() {
  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS elections (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      state TEXT NOT NULL,
      type TEXT NOT NULL,
      status TEXT NOT NULL,
      year INTEGER NOT NULL,
      totalSeats INTEGER NOT NULL,
      notificationDate TEXT,
      pollingDate TEXT,
      countingDate TEXT,
      sourceUrl TEXT,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS parties (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      shortName TEXT NOT NULL,
      symbol TEXT NOT NULL,
      foundedYear INTEGER NOT NULL,
      headquarters TEXT NOT NULL,
      ideology TEXT NOT NULL,
      description TEXT,
      sourceUrl TEXT,
      badgeBg TEXT
    );

    CREATE TABLE IF NOT EXISTS constituencies (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      district TEXT NOT NULL,
      state TEXT NOT NULL,
      category TEXT NOT NULL,
      totalVoters INTEGER NOT NULL,
      electionId TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS candidates (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      partyId TEXT NOT NULL,
      constituencyId TEXT NOT NULL,
      electionId TEXT NOT NULL,
      education TEXT,
      declaredAssets TEXT,
      criminalCases INTEGER NOT NULL,
      photo TEXT,
      biography TEXT
    );

    CREATE TABLE IF NOT EXISTS policies (
      id TEXT PRIMARY KEY,
      candidateId TEXT NOT NULL,
      topic TEXT NOT NULL,
      position TEXT NOT NULL,
      sourceName TEXT,
      sourceUrl TEXT,
      publishedDate TEXT
    );

    CREATE TABLE IF NOT EXISTS resources (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      sourceName TEXT,
      sourceUrl TEXT,
      fileType TEXT,
      lastUpdated TEXT
    );

    CREATE TABLE IF NOT EXISTS enquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      constituency TEXT,
      message TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      status TEXT DEFAULT 'Pending'
    );
  `);

  // Seed default data if elections table is empty
  const countRow = db.prepare('SELECT count(*) as count FROM elections').get();
  if (countRow.count === 0) {
    seedData();
  }
}

function seedData() {
  const insertElection = db.prepare(`
    INSERT INTO elections (id, name, state, type, status, year, totalSeats, notificationDate, pollingDate, countingDate, sourceUrl, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const initialElections = [
    {
      id: "ap-2024",
      name: "Andhra Pradesh Legislative Assembly Election 2024",
      state: "Andhra Pradesh",
      type: "Assembly",
      status: "Completed",
      year: 2024,
      totalSeats: 175,
      notificationDate: "18 Apr 2024",
      pollingDate: "13 May 2024",
      countingDate: "4 Jun 2024",
      sourceUrl: "https://eci.gov.in",
      description: "General election to constitute the 16th Legislative Assembly of Andhra Pradesh across all 175 constituencies."
    },
    {
      id: "tg-2023",
      name: "Telangana Legislative Assembly Election 2023",
      state: "Telangana",
      type: "Assembly",
      status: "Completed",
      year: 2023,
      totalSeats: 119,
      notificationDate: "03 Nov 2023",
      pollingDate: "30 Nov 2023",
      countingDate: "3 Dec 2023",
      sourceUrl: "https://eci.gov.in",
      description: "General statutory election to elect all 119 members of the Telangana Legislative Assembly."
    },
    {
      id: "tn-2026",
      name: "Tamil Nadu Legislative Assembly Election 2026",
      state: "Tamil Nadu",
      type: "Assembly",
      status: "Upcoming",
      year: 2026,
      totalSeats: 234,
      notificationDate: "25 Mar 2026",
      pollingDate: "19 Apr 2026",
      countingDate: "2 May 2026",
      sourceUrl: "https://eci.gov.in",
      description: "Upcoming statutory election to elect 234 members of the 17th Tamil Nadu Legislative Assembly."
    },
    {
      id: "ls-2024",
      name: "Lok Sabha Parliamentary General Election 2024",
      state: "National",
      type: "Parliament",
      status: "Completed",
      year: 2024,
      totalSeats: 543,
      notificationDate: "20 Mar 2024",
      pollingDate: "19 Apr - 1 Jun 2024",
      countingDate: "4 Jun 2024",
      sourceUrl: "https://eci.gov.in",
      description: "National general elections held in 7 phases to elect 543 members of the 18th Lok Sabha."
    }
  ];

  for (const e of initialElections) {
    insertElection.run(e.id, e.name, e.state, e.type, e.status, e.year, e.totalSeats, e.notificationDate, e.pollingDate, e.countingDate, e.sourceUrl, e.description);
  }

  // Parties
  const insertParty = db.prepare(`
    INSERT INTO parties (id, name, shortName, symbol, foundedYear, headquarters, ideology, description, sourceUrl, badgeBg)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const initialParties = [
    {
      id: "party-a",
      name: "Party A (Progressive Civic Alliance)",
      shortName: "Party A",
      symbol: "🪔",
      foundedYear: 1985,
      headquarters: "Vijayawada, Andhra Pradesh",
      ideology: "Social Welfare, Public Education, Infrastructure Modernization",
      description: "Focuses on public school upgrades, subsidized medicine, and urban transit expansion.",
      sourceUrl: "https://eci.gov.in",
      badgeBg: "bg-blue-50 text-blue-700 border-blue-200"
    },
    {
      id: "party-b",
      name: "Party B (National Democratic Coalition)",
      shortName: "Party B",
      symbol: "✋",
      foundedYear: 1998,
      headquarters: "Hyderabad, Telangana",
      ideology: "Economic Decentralization, Digital Governance, Green Infrastructure",
      description: "Emphasizes digital public services, youth venture loans, and urban green spaces.",
      sourceUrl: "https://eci.gov.in",
      badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200"
    },
    {
      id: "party-c",
      name: "Party C (United Agrarian Front)",
      shortName: "Party C",
      symbol: "🚲",
      foundedYear: 2004,
      headquarters: "Guntur, Andhra Pradesh",
      ideology: "Rural Agrarian Development, Farmer Livelihoods, Soil & Water Stewardship",
      description: "Champions minimum support prices for farmers, cold-storage chains, and agro-processing clusters.",
      sourceUrl: "https://eci.gov.in",
      badgeBg: "bg-amber-50 text-amber-700 border-amber-200"
    },
    {
      id: "party-d",
      name: "Party D (Citizens Action & Transparency Forum)",
      shortName: "Party D",
      symbol: "⚖️",
      foundedYear: 2012,
      headquarters: "Hyderabad, Telangana",
      ideology: "Civic Transparency, Participatory Budgeting, Public Accountability",
      description: "Grassroots anti-corruption movement promoting open municipal budgeting and town halls.",
      sourceUrl: "https://eci.gov.in",
      badgeBg: "bg-purple-50 text-purple-700 border-purple-200"
    }
  ];

  for (const p of initialParties) {
    insertParty.run(p.id, p.name, p.shortName, p.symbol, p.foundedYear, p.headquarters, p.ideology, p.description, p.sourceUrl, p.badgeBg);
  }

  // Constituencies
  const insertConst = db.prepare(`
    INSERT INTO constituencies (id, name, district, state, category, totalVoters, electionId)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const initialConstituencies = [
    { id: "const-1", name: "Kakinada City (AC-41)", district: "Kakinada", state: "Andhra Pradesh", category: "General", totalVoters: 258410, electionId: "ap-2024" },
    { id: "const-2", name: "Visakhapatnam East (AC-21)", district: "Visakhapatnam", state: "Andhra Pradesh", category: "General", totalVoters: 271890, electionId: "ap-2024" },
    { id: "const-3", name: "Khairatabad (AC-59)", district: "Hyderabad", state: "Telangana", category: "General", totalVoters: 284120, electionId: "tg-2023" },
    { id: "const-4", name: "Coimbatore South (AC-120)", district: "Coimbatore", state: "Tamil Nadu", category: "General", totalVoters: 251340, electionId: "tn-2026" },
    { id: "const-5", name: "New Delhi (PC-04)", district: "New Delhi", state: "National", category: "General", totalVoters: 1520000, electionId: "ls-2024" }
  ];

  for (const c of initialConstituencies) {
    insertConst.run(c.id, c.name, c.district, c.state, c.category, c.totalVoters, c.electionId);
  }

  // Candidates
  const insertCand = db.prepare(`
    INSERT INTO candidates (id, name, age, partyId, constituencyId, electionId, education, declaredAssets, criminalCases, photo, biography)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const initialCandidates = [
    {
      id: "ravi-kumar",
      name: "Ravi Kumari",
      age: 48,
      partyId: "party-a",
      constituencyId: "const-1",
      electionId: "ap-2024",
      education: "M.Sc. Physics, Andhra University",
      declaredAssets: "₹4.25 Crores",
      criminalCases: 0,
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face",
      biography: "Former government high school physics teacher and educational administrator who entered public civic life in 2018. Focuses on government school modernization, public library networks, and coastal infrastructure resilience."
    },
    {
      id: "sita-devi",
      name: "Sita Devi",
      age: 52,
      partyId: "party-b",
      constituencyId: "const-1",
      electionId: "ap-2024",
      education: "B.A. Political Science, Osmania University",
      declaredAssets: "₹2.10 Crores",
      criminalCases: 0,
      photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face",
      biography: "Grassroots organizer and women microfinance cooperative leader for over 15 years. Advocate for primary healthcare access, community solar microgrids, and self-help group entrepreneurial credit."
    },
    {
      id: "arjun-varma",
      name: "Arjun Varma",
      age: 44,
      partyId: "party-c",
      constituencyId: "const-1",
      electionId: "ap-2024",
      education: "B.Com, Osmania University",
      declaredAssets: "₹8.90 Crores",
      criminalCases: 0,
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      biography: "Agricultural entrepreneur and regional cold-storage logistics operator. Champion of direct farmer market links, fair crop minimum support pricing, and subsidized irrigation electrification."
    },
    {
      id: "ananya-sen",
      name: "Ananya Sen",
      age: 39,
      partyId: "party-d",
      constituencyId: "const-3",
      electionId: "tg-2023",
      education: "LL.B., National Law School",
      declaredAssets: "₹1.45 Crores",
      criminalCases: 0,
      photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face",
      biography: "Public interest environmental attorney defending wetland conservation and urban green spaces. Strong advocate for RTI compliance, civic transparency, and participatory municipal budgeting."
    },
    {
      id: "vikram-reddy",
      name: "Vikram Reddy",
      age: 46,
      partyId: "party-a",
      constituencyId: "const-3",
      electionId: "tg-2023",
      education: "B.Tech Mechanical Engineering, JNTU",
      declaredAssets: "₹3.80 Crores",
      criminalCases: 0,
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
      biography: "Civic activist and IT professional turned community worker. Passionate about improving municipal civic services, urban water management, and youth technical employment."
    },
    {
      id: "k-lakshmi",
      name: "K. Lakshmi",
      age: 51,
      partyId: "party-b",
      constituencyId: "const-3",
      electionId: "tg-2023",
      education: "M.A. Public Administration, Kakatiya University",
      declaredAssets: "₹1.85 Crores",
      criminalCases: 0,
      photo: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=300&h=300&fit=crop&crop=face",
      biography: "Longtime municipal counselor with deep roots in urban governance. Strong track record in establishing Anganwadi centers, slum redevelopment, and municipal sanitation drives."
    },
    {
      id: "venkat-rao",
      name: "Venkat Rao",
      age: 55,
      partyId: "party-a",
      constituencyId: "const-2",
      electionId: "ap-2024",
      education: "B.Com, Andhra University",
      declaredAssets: "₹5.60 Crores",
      criminalCases: 0,
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      biography: "Prominent business association president and harbor trade representative. Advancing sustainable coastal aquaculture, fisherfolk welfare schemes, and industrial port connectivity."
    },
    {
      id: "soundararajan-tn",
      name: "C. Soundararajan",
      age: 53,
      partyId: "party-a",
      constituencyId: "const-4",
      electionId: "tn-2026",
      education: "M.Tech Industrial Engineering, PSG Tech Coimbatore",
      declaredAssets: "₹6.15 Crores",
      criminalCases: 0,
      photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=face",
      biography: "Textile engineering industrialist and former president of South India Small Mills Association. Focused on modernizing textile export clusters, renewable solar parks, and technical vocational training."
    },
    {
      id: "m-selvi-tn",
      name: "Dr. M. Selvi",
      age: 47,
      partyId: "party-b",
      constituencyId: "const-4",
      electionId: "tn-2026",
      education: "M.B.B.S., M.D. Community Medicine, Coimbatore Medical College",
      declaredAssets: "₹3.40 Crores",
      criminalCases: 0,
      photo: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=300&h=300&fit=crop&crop=face",
      biography: "Public health physician who ran urban slum primary clinics for 14 years. Pioneered maternal nutrition monitoring programs and free dialysis centers across western Tamil Nadu."
    },
    {
      id: "rajesh-malhotra-ls",
      name: "Rajesh Malhotra",
      age: 58,
      partyId: "party-a",
      constituencyId: "const-5",
      electionId: "ls-2024",
      education: "M.A. Economics, Delhi School of Economics",
      declaredAssets: "₹9.80 Crores",
      criminalCases: 0,
      photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face",
      biography: "Senior financial policy analyst and parliamentary economic affairs advisor. Specializes in national infrastructure bond financing, trade deregulation, and commercial market redevelopment."
    },
    {
      id: "sunita-banerjee-ls",
      name: "Sunita Banerjee",
      age: 49,
      partyId: "party-b",
      constituencyId: "const-5",
      electionId: "ls-2024",
      education: "M.Phil Sociology, Jawaharlal Nehru University (JNU)",
      declaredAssets: "₹2.95 Crores",
      criminalCases: 0,
      photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&h=300&fit=crop&crop=face",
      biography: "Consumer rights advocate, former National Commission for Women advisory member, and author on urban welfare rights. Focuses on social safety nets, air pollution mitigation, and public transport access."
    }
  ];

  for (const c of initialCandidates) {
    insertCand.run(c.id, c.name, c.age, c.partyId, c.constituencyId, c.electionId, c.education, c.declaredAssets, c.criminalCases, c.photo, c.biography);
  }

  // Policies
  const insertPolicy = db.prepare(`
    INSERT INTO policies (id, candidateId, topic, position, sourceName, sourceUrl, publishedDate)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const initialPolicies = [
    { id: "pol-1", candidateId: "ravi-kumar", topic: "Education", position: "Increase public capital investment in government schools, equip rural high schools with interactive digital smart classrooms, and hire 5,000 certified STEM teachers.", sourceName: "Official Party Manifesto 2024", sourceUrl: "https://eci.gov.in", publishedDate: "15 Jan 2024" },
    { id: "pol-2", candidateId: "sita-devi", topic: "Education", position: "Focus on digital education equity, free educational tablet distribution for secondary students, and doubling merit-cum-means higher education scholarships.", sourceName: "Party Manifesto & Policy Charter", sourceUrl: "https://eci.gov.in", publishedDate: "12 Jan 2024" },
    { id: "pol-3", candidateId: "arjun-varma", topic: "Education", position: "Revitalize rural agricultural polytechnic institutes, expand vocational farm apprenticeships, and fund regional agricultural research universities.", sourceName: "Public Address & Press Statement", sourceUrl: "https://eci.gov.in", publishedDate: "28 Jan 2024" },
    { id: "pol-4", candidateId: "ravi-kumar", topic: "Healthcare", position: "Improve rural healthcare infrastructure by upgrading all Primary Health Centres (PHCs) into 24/7 comprehensive emergency clinics with telemedicine support.", sourceName: "Public Campaign Statement", sourceUrl: "https://eci.gov.in", publishedDate: "5 Feb 2024" },
    { id: "pol-5", candidateId: "sita-devi", topic: "Healthcare", position: "Expand community primary health centres, provide 100% subsidized essential generic medicines, and establish neighborhood wellness diagnostic kiosks.", sourceName: "Press Release on Health Strategy", sourceUrl: "https://eci.gov.in", publishedDate: "18 Jan 2024" },
    { id: "pol-6", candidateId: "arjun-varma", topic: "Healthcare", position: "Deploy fleet of mobile diagnostic vans for remote farm hamlets and provide comprehensive health insurance coverage up to ₹5 Lakhs for all farming families.", sourceName: "Constituency Press Meet", sourceUrl: "https://eci.gov.in", publishedDate: "14 Feb 2024" },
    { id: "pol-7", candidateId: "ravi-kumar", topic: "Employment", position: "Create skill development incubators and establish a 500-acre coastal IT & electronics industrial park in Kakinada to generate 25,000 youth employment opportunities.", sourceName: "Public Statement at Chamber of Commerce", sourceUrl: "https://eci.gov.in", publishedDate: "20 Mar 2024" },
    { id: "pol-8", candidateId: "sita-devi", topic: "Employment", position: "Targeted support for small and micro businesses, zero-interest seed loans up to ₹2 Lakhs for youth-led ventures, and skill upgrading stipends for women artisans.", sourceName: "Party Economic Whitepaper", sourceUrl: "https://eci.gov.in", publishedDate: "24 Feb 2024" },
    { id: "pol-9", candidateId: "arjun-varma", topic: "Employment", position: "Establish 10 farmer producer agro-processing hubs guaranteeing direct local procurement, cold storage, and non-farm employment for rural youth.", sourceName: "State Economic Convention Address", sourceUrl: "https://eci.gov.in", publishedDate: "2 Mar 2024" },
    { id: "pol-10", candidateId: "ravi-kumar", topic: "Infrastructure", position: "Complete four-lane highway connectivity between port corridors, construct underground storm water drainage in flood-prone wards, and upgrade municipal LED lighting.", sourceName: "Official Municipal Vision Document", sourceUrl: "https://eci.gov.in", publishedDate: "15 Jan 2024" },
    { id: "pol-11", candidateId: "sita-devi", topic: "Infrastructure", position: "Prioritize green public bus transit, expand piped potable tap water to every household, and construct covered walkways and public community parks.", sourceName: "Civic Infrastructure Charter", sourceUrl: "https://eci.gov.in", publishedDate: "12 Jan 2024" },
    { id: "pol-12", candidateId: "ananya-sen", topic: "Governance", position: "Mandatory quarterly ward sabhas, real-time public audit of municipal contractor payments, and an open civic grievance redressing dashboard.", sourceName: "Civic Transparency Manifesto", sourceUrl: "https://eci.gov.in", publishedDate: "10 Feb 2024" },
    { id: "pol-13", candidateId: "soundararajan-tn", topic: "Education", position: "Upgrade regional technical and polytechnic institutes into advanced AI and industrial robotics training hubs.", sourceName: "Tamil Nadu Party A Manifesto", sourceUrl: "https://eci.gov.in", publishedDate: "15 Feb 2026" },
    { id: "pol-14", candidateId: "m-selvi-tn", topic: "Education", position: "Establish free neighborhood community evening learning centers and subsidized STEM education for girl students.", sourceName: "Tamil Nadu Party B Charter", sourceUrl: "https://eci.gov.in", publishedDate: "18 Feb 2026" },
    { id: "pol-15", candidateId: "soundararajan-tn", topic: "Healthcare", position: "Expand government super-specialty hospital beds by 500 and create 24x7 trauma care centers along industrial corridors.", sourceName: "Press Release on Coimbatore Healthcare", sourceUrl: "https://eci.gov.in", publishedDate: "20 Feb 2026" },
    { id: "pol-16", candidateId: "m-selvi-tn", topic: "Healthcare", position: "Strengthen urban primary clinics with free maternity care, pediatric diagnostics, and subsidized generic pharmacies.", sourceName: "Public Address at Coimbatore Townhall", sourceUrl: "https://eci.gov.in", publishedDate: "22 Feb 2026" },
    { id: "pol-17", candidateId: "rajesh-malhotra-ls", topic: "Education", position: "Universal digital literacy programs and modern research libraries across every municipal ward in Central Delhi.", sourceName: "National Election Vision 2024", sourceUrl: "https://eci.gov.in", publishedDate: "10 Mar 2024" },
    { id: "pol-18", candidateId: "sunita-banerjee-ls", topic: "Education", position: "Double municipal primary school budget allocation and guarantee free nutritious meals and textbooks up to secondary levels.", sourceName: "Party B National Policy Paper", sourceUrl: "https://eci.gov.in", publishedDate: "12 Mar 2024" },
    { id: "pol-19", candidateId: "rajesh-malhotra-ls", topic: "Healthcare", position: "Equip all government dispensaries with digital diagnostic testing and automated medicine dispensing kiosks.", sourceName: "National Public Health Address", sourceUrl: "https://eci.gov.in", publishedDate: "15 Mar 2024" },
    { id: "pol-20", candidateId: "sunita-banerjee-ls", topic: "Healthcare", position: "Universal health coverage with zero-cost hospitalization up to ₹10 Lakhs for low and middle-income families.", sourceName: "Public Press Conference", sourceUrl: "https://eci.gov.in", publishedDate: "16 Mar 2024" },
    { id: "pol-21", candidateId: "venkat-rao", topic: "Employment", position: "Establish dedicated seafood processing and export clusters to create 10,000 local port-allied jobs in Visakhapatnam East.", sourceName: "Visakhapatnam Development Charter", sourceUrl: "https://eci.gov.in", publishedDate: "25 Feb 2024" }
  ];

  for (const pol of initialPolicies) {
    insertPolicy.run(pol.id, pol.candidateId, pol.topic, pol.position, pol.sourceName, pol.sourceUrl, pol.publishedDate);
  }

  // Resources
  const insertResource = db.prepare(`
    INSERT INTO resources (id, title, description, category, sourceName, sourceUrl, fileType, lastUpdated)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const initialResources = [
    { id: "res-1", title: "Model Code of Conduct (MCC)", description: "Statutory guidelines and directives issued for the conduct of political parties, candidates, and ruling governments from the announcement of election dates until conclusion.", category: "Model Code of Conduct", sourceName: "Election Commission of India", sourceUrl: "https://eci.gov.in/mcc/", fileType: "Official Document", lastUpdated: "16 Mar 2024" },
    { id: "res-2", title: "Voter Registration & Identification Guidelines", description: "Comprehensive guidelines on Form 6 submission, checking name in Electoral Roll, overseas voter enrollment, and accepted identification documents at polling stations.", category: "Voter Guidelines", sourceName: "Election Commission of India", sourceUrl: "https://voters.eci.gov.in/", fileType: "Portal & Handbook", lastUpdated: "01 Jan 2024" },
    { id: "res-3", title: "Conduct of Elections Rules, 1961", description: "Statutory rules governing nomination procedures, scrutiny of papers, EVM & VVPAT verification protocols, counting processes, and declaration of election results.", category: "Election Rules", sourceName: "Legislative Department / ECI", sourceUrl: "https://eci.gov.in/files/file/7437-the-conduct-of-elections-rules-1961/", fileType: "PDF Reference", lastUpdated: "Updated 2024" },
    { id: "res-4", title: "Candidate Affidavit Disclosure Handbook (Form 26)", description: "Legal framework and compliance protocols for candidates to publicly declare criminal antecedents, assets, liabilities, and educational qualifications under Article 324.", category: "Affidavits & Disclosures", sourceName: "Election Commission of India", sourceUrl: "https://affidavit.eci.gov.in/", fileType: "Public Database", lastUpdated: "Apr 2024" },
    { id: "res-5", title: "Voter Helpline App & 1950 Toll-Free Citizen Support", description: "Official citizen voter assistance tools for verifying polling booth location, BLO contacts, downloadable digital EPIC cards, and filing cVIGIL violation complaints.", category: "Voter Guidelines", sourceName: "ECI Citizen Services", sourceUrl: "https://voters.eci.gov.in/help", fileType: "Helpline Service", lastUpdated: "Active 24x7" }
  ];

  for (const r of initialResources) {
    insertResource.run(r.id, r.title, r.description, r.category, r.sourceName, r.sourceUrl, r.fileType, r.lastUpdated);
  }

  console.log('Database successfully initialized and seeded with all election data.');
}
