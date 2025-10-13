import { useEffect, useState } from 'react';
import { Search, BookOpen, Eye, Brain, Lightbulb, ArrowRight, Filter, Star, Tag, ExternalLink } from 'lucide-react';
import { NavigationProps } from '../types/navigation';
import { getTracks, getLessons } from '../lib/api';

interface GlossaryPageProps extends NavigationProps {}

interface BiologyTerm {
  id: string;
  term: string;
  definition: string;
  category: 'cell-biology' | 'genetics' | 'anatomy' | 'ecology' | 'biochemistry' | 'evolution' | 'microbiology' | 'physiology';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  pronunciation?: string;
  etymology?: string;
  relatedTerms: string[];
  lessonIds: string[];
  trackIds: string[];
  visualAid?: {
    type: 'diagram' | 'image' | 'animation' | 'formula';
    description: string;
    url?: string;
  };
  mnemonic?: string;
  examples: string[];
  synonyms: string[];
  antonyms: string[];
  usageNotes?: string;
  lastUpdated: string;
}

interface CategoryInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  termCount: number;
}

export default function GlossaryPage({ onNavigate }: GlossaryPageProps) {
  const [terms, setTerms] = useState<BiologyTerm[]>([]);
  const [tracks, setTracks] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedTerm, setSelectedTerm] = useState<BiologyTerm | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'overview' | 'term-detail'>('overview');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tracksData] = await Promise.all([
        getTracks(),
      ]);

      setTracks(tracksData);
      
      // Generate mock lessons for each track
      const allLessons: any[] = [];
      for (const track of tracksData) {
        const trackLessons = await getLessons(track.id);
        allLessons.push(...trackLessons);
      }
      setLessons(allLessons);

      // Generate mock biology terms
      const mockTerms = generateMockBiologyTerms(tracksData, allLessons);
      setTerms(mockTerms);
    } catch (error) {
      console.error('Failed to load glossary data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockBiologyTerms = (tracks: any[], lessons: any[]): BiologyTerm[] => {
    const termData = [
      // Cell Biology
      {
        term: 'Mitochondria',
        definition: 'The powerhouse of the cell, responsible for producing ATP through cellular respiration.',
        category: 'cell-biology' as const,
        difficulty: 'beginner' as const,
        pronunciation: 'my-toh-KON-dree-uh',
        etymology: 'From Greek "mitos" (thread) + "chondrion" (granule)',
        relatedTerms: ['ATP', 'Cellular Respiration', 'Cristae', 'Matrix'],
        examples: ['Found in muscle cells for energy', 'Present in all eukaryotic cells'],
        synonyms: ['Powerhouse of the cell'],
        antonyms: [],
        mnemonic: 'Mitochondria = "Mighty Powerhouse" - think of it as the cell\'s energy factory',
        visualAid: {
          type: 'diagram' as const,
          description: 'Double-membrane organelle with inner folds called cristae',
        },
        usageNotes: 'Always plural: "mitochondria" (not "mitochondrion" for multiple)',
      },
      {
        term: 'Chloroplast',
        definition: 'Organelle found in plant cells that conducts photosynthesis.',
        category: 'cell-biology' as const,
        difficulty: 'beginner' as const,
        pronunciation: 'KLOR-oh-plast',
        etymology: 'From Greek "chloros" (green) + "plastos" (formed)',
        relatedTerms: ['Photosynthesis', 'Chlorophyll', 'Thylakoid', 'Stroma'],
        examples: ['Found in leaf cells', 'Contains chlorophyll for photosynthesis'],
        synonyms: ['Photosynthetic organelle'],
        antonyms: [],
        mnemonic: 'Chloroplast = "Chloro" (green) + "plast" (container) - the green container for photosynthesis',
        visualAid: {
          type: 'diagram' as const,
          description: 'Green organelle with stacked thylakoids containing chlorophyll',
        },
      },
      {
        term: 'Ribosome',
        definition: 'Cellular structure responsible for protein synthesis.',
        category: 'cell-biology' as const,
        difficulty: 'beginner' as const,
        pronunciation: 'RYE-boh-sohm',
        etymology: 'From "ribose" (sugar) + "soma" (body)',
        relatedTerms: ['Protein Synthesis', 'mRNA', 'tRNA', 'Translation'],
        examples: ['Found in cytoplasm and on rough ER', 'Reads mRNA to build proteins'],
        synonyms: ['Protein factory'],
        antonyms: [],
        mnemonic: 'Ribosome = "Rib" (like ribs of a boat) + "some" - the boat that builds proteins',
        visualAid: {
          type: 'diagram' as const,
          description: 'Small spherical structure made of RNA and proteins',
        },
      },

      // Genetics
      {
        term: 'DNA',
        definition: 'Deoxyribonucleic acid - the molecule that carries genetic information.',
        category: 'genetics' as const,
        difficulty: 'beginner' as const,
        pronunciation: 'DEE-en-AY',
        etymology: 'Deoxyribonucleic Acid',
        relatedTerms: ['Gene', 'Chromosome', 'Nucleotide', 'Double Helix'],
        examples: ['Found in cell nucleus', 'Contains genetic instructions'],
        synonyms: ['Genetic material', 'Hereditary molecule'],
        antonyms: [],
        mnemonic: 'DNA = "DeoxyriboNucleic Acid" - the blueprint of life',
        visualAid: {
          type: 'diagram' as const,
          description: 'Double helix structure with base pairs (A-T, G-C)',
        },
      },
      {
        term: 'Gene',
        definition: 'A segment of DNA that codes for a specific protein or trait.',
        category: 'genetics' as const,
        difficulty: 'beginner' as const,
        pronunciation: 'JEEN',
        etymology: 'From Greek "genos" (race, kind)',
        relatedTerms: ['Allele', 'Genotype', 'Phenotype', 'Mutation'],
        examples: ['Eye color gene', 'Height gene', 'Blood type gene'],
        synonyms: ['Genetic unit', 'Hereditary unit'],
        antonyms: [],
        mnemonic: 'Gene = "Genetic ENcoding" - the code for traits',
        visualAid: {
          type: 'diagram' as const,
          description: 'Specific sequence of DNA nucleotides on a chromosome',
        },
      },
      {
        term: 'Allele',
        definition: 'Different versions of the same gene that can produce different traits.',
        category: 'genetics' as const,
        difficulty: 'intermediate' as const,
        pronunciation: 'uh-LEEL',
        etymology: 'From Greek "allelon" (one another)',
        relatedTerms: ['Gene', 'Dominant', 'Recessive', 'Homozygous', 'Heterozygous'],
        examples: ['Blue vs. brown eye alleles', 'A vs. B blood type alleles'],
        synonyms: ['Gene variant', 'Gene form'],
        antonyms: [],
        mnemonic: 'Allele = "ALternative LEvel" - different levels of the same gene',
        visualAid: {
          type: 'diagram' as const,
          description: 'Different forms of the same gene at the same location',
        },
      },

      // Anatomy
      {
        term: 'Homeostasis',
        definition: 'The maintenance of stable internal conditions despite external changes.',
        category: 'anatomy' as const,
        difficulty: 'intermediate' as const,
        pronunciation: 'hoh-mee-oh-STAY-sis',
        etymology: 'From Greek "homoios" (similar) + "stasis" (standing)',
        relatedTerms: ['Feedback Loop', 'Negative Feedback', 'Positive Feedback', 'Regulation'],
        examples: ['Body temperature regulation', 'Blood sugar control', 'pH balance'],
        synonyms: ['Internal balance', 'Stable state'],
        antonyms: ['Dysregulation', 'Imbalance'],
        mnemonic: 'Homeostasis = "HOME" + "STAY" - keeping things stable at home',
        visualAid: {
          type: 'diagram' as const,
          description: 'Balance scale showing internal vs. external factors',
        },
      },
      {
        term: 'Synapse',
        definition: 'The junction between two neurons where nerve impulses are transmitted.',
        category: 'anatomy' as const,
        difficulty: 'intermediate' as const,
        pronunciation: 'SIN-aps',
        etymology: 'From Greek "synapsis" (connection)',
        relatedTerms: ['Neuron', 'Neurotransmitter', 'Axon', 'Dendrite'],
        examples: ['Between brain cells', 'At muscle-nerve junctions'],
        synonyms: ['Neural junction', 'Nerve connection'],
        antonyms: [],
        mnemonic: 'Synapse = "SYN" (together) + "APSE" (connection) - where neurons connect',
        visualAid: {
          type: 'diagram' as const,
          description: 'Gap between axon terminal and dendrite with neurotransmitters',
        },
      },

      // Ecology
      {
        term: 'Ecosystem',
        definition: 'A community of living organisms and their physical environment interacting as a system.',
        category: 'ecology' as const,
        difficulty: 'beginner' as const,
        pronunciation: 'EE-koh-sis-tem',
        etymology: 'From Greek "oikos" (house) + "systema" (system)',
        relatedTerms: ['Biotic', 'Abiotic', 'Community', 'Habitat', 'Niche'],
        examples: ['Forest ecosystem', 'Ocean ecosystem', 'Desert ecosystem'],
        synonyms: ['Ecological system', 'Natural community'],
        antonyms: [],
        mnemonic: 'Ecosystem = "ECO" (house) + "SYSTEM" - the house system of nature',
        visualAid: {
          type: 'diagram' as const,
          description: 'Interconnected web of living and non-living components',
        },
      },
      {
        term: 'Biodiversity',
        definition: 'The variety of life in all its forms, levels, and combinations.',
        category: 'ecology' as const,
        difficulty: 'beginner' as const,
        pronunciation: 'by-oh-dy-VER-si-tee',
        etymology: 'From "bio" (life) + "diversity" (variety)',
        relatedTerms: ['Species', 'Genetic Diversity', 'Ecosystem Diversity', 'Conservation'],
        examples: ['Tropical rainforests', 'Coral reefs', 'Species richness'],
        synonyms: ['Biological diversity', 'Life variety'],
        antonyms: ['Monoculture', 'Uniformity'],
        mnemonic: 'Biodiversity = "BIO" (life) + "DIVERSITY" - the variety of life',
        visualAid: {
          type: 'image' as const,
          description: 'Colorful array of different species and habitats',
        },
      },

      // Biochemistry
      {
        term: 'Enzyme',
        definition: 'A protein that acts as a biological catalyst, speeding up chemical reactions.',
        category: 'biochemistry' as const,
        difficulty: 'intermediate' as const,
        pronunciation: 'EN-zym',
        etymology: 'From Greek "en" (in) + "zyme" (leaven)',
        relatedTerms: ['Catalyst', 'Substrate', 'Active Site', 'Protein'],
        examples: ['Digestive enzymes', 'DNA polymerase', 'Catalase'],
        synonyms: ['Biological catalyst', 'Protein catalyst'],
        antonyms: [],
        mnemonic: 'Enzyme = "EN" (in) + "ZYME" (change) - changes things in the cell',
        visualAid: {
          type: 'diagram' as const,
          description: 'Lock-and-key model showing enzyme-substrate interaction',
        },
      },
      {
        term: 'ATP',
        definition: 'Adenosine triphosphate - the energy currency of the cell.',
        category: 'biochemistry' as const,
        difficulty: 'intermediate' as const,
        pronunciation: 'AY-TEE-PEE',
        etymology: 'Adenosine TriPhosphate',
        relatedTerms: ['ADP', 'Cellular Respiration', 'Mitochondria', 'Energy'],
        examples: ['Muscle contraction', 'Active transport', 'Protein synthesis'],
        synonyms: ['Energy currency', 'Cellular energy'],
        antonyms: [],
        mnemonic: 'ATP = "Adenosine TriPhosphate" - the cell\'s energy money',
        visualAid: {
          type: 'diagram' as const,
          description: 'Molecule with three phosphate groups, high-energy bonds',
        },
      },

      // Evolution
      {
        term: 'Natural Selection',
        definition: 'The process by which organisms with favorable traits survive and reproduce more successfully.',
        category: 'evolution' as const,
        difficulty: 'intermediate' as const,
        pronunciation: 'NAT-ur-ul se-LEK-shun',
        etymology: 'Natural + Selection',
        relatedTerms: ['Adaptation', 'Fitness', 'Mutation', 'Survival'],
        examples: ['Peppered moth evolution', 'Antibiotic resistance', 'Darwin\'s finches'],
        synonyms: ['Survival of the fittest', 'Selective pressure'],
        antonyms: [],
        mnemonic: 'Natural Selection = "NATURE SELECTS" - nature chooses the best',
        visualAid: {
          type: 'diagram' as const,
          description: 'Process showing variation, selection, and inheritance',
        },
      },
      {
        term: 'Adaptation',
        definition: 'A trait that helps an organism survive and reproduce in its environment.',
        category: 'evolution' as const,
        difficulty: 'beginner' as const,
        pronunciation: 'ad-ap-TAY-shun',
        etymology: 'From Latin "adaptare" (to fit)',
        relatedTerms: ['Natural Selection', 'Evolution', 'Fitness', 'Environment'],
        examples: ['Camouflage', 'Mimicry', 'Hibernation', 'Migration'],
        synonyms: ['Adjustment', 'Modification'],
        antonyms: ['Maladaptation'],
        mnemonic: 'Adaptation = "ADAPT" + "ATION" - the act of adapting',
        visualAid: {
          type: 'image' as const,
          description: 'Examples of organisms with adaptive traits',
        },
      },

      // Microbiology
      {
        term: 'Bacteria',
        definition: 'Single-celled prokaryotic microorganisms found in almost every environment.',
        category: 'microbiology' as const,
        difficulty: 'beginner' as const,
        pronunciation: 'bak-TEER-ee-uh',
        etymology: 'From Greek "bakterion" (small rod)',
        relatedTerms: ['Prokaryote', 'Cell Wall', 'Flagella', 'Binary Fission'],
        examples: ['E. coli', 'Lactobacillus', 'Streptococcus'],
        synonyms: ['Microbes', 'Prokaryotes'],
        antonyms: ['Eukaryotes'],
        mnemonic: 'Bacteria = "BACK" + "TERIA" - the backstage workers of life',
        visualAid: {
          type: 'diagram' as const,
          description: 'Simple cell structure without nucleus or organelles',
        },
      },
      {
        term: 'Virus',
        definition: 'A non-living infectious agent that can only replicate inside host cells.',
        category: 'microbiology' as const,
        difficulty: 'intermediate' as const,
        pronunciation: 'VY-rus',
        etymology: 'From Latin "virus" (poison)',
        relatedTerms: ['Host Cell', 'Replication', 'Capsid', 'Nucleic Acid'],
        examples: ['Influenza virus', 'HIV', 'COVID-19', 'Bacteriophage'],
        synonyms: ['Viral particle', 'Infectious agent'],
        antonyms: [],
        mnemonic: 'Virus = "VIR" (poison) + "US" - affects us like poison',
        visualAid: {
          type: 'diagram' as const,
          description: 'Protein coat (capsid) containing genetic material',
        },
      },

      // Physiology
      {
        term: 'Metabolism',
        definition: 'The sum of all chemical reactions that occur in an organism.',
        category: 'physiology' as const,
        difficulty: 'intermediate' as const,
        pronunciation: 'muh-TAB-uh-liz-um',
        etymology: 'From Greek "metabole" (change)',
        relatedTerms: ['Anabolism', 'Catabolism', 'ATP', 'Enzyme'],
        examples: ['Digestion', 'Respiration', 'Protein synthesis'],
        synonyms: ['Chemical processes', 'Biochemical reactions'],
        antonyms: [],
        mnemonic: 'Metabolism = "META" (change) + "BOLISM" - changing molecules',
        visualAid: {
          type: 'diagram' as const,
          description: 'Cycle showing anabolism (building up) and catabolism (breaking down)',
        },
      },
      {
        term: 'Osmosis',
        definition: 'The movement of water across a semipermeable membrane from high to low concentration.',
        category: 'physiology' as const,
        difficulty: 'intermediate' as const,
        pronunciation: 'oz-MOH-sis',
        etymology: 'From Greek "osmos" (push)',
        relatedTerms: ['Diffusion', 'Concentration Gradient', 'Membrane', 'Water'],
        examples: ['Plant root water uptake', 'Red blood cell behavior', 'Kidney function'],
        synonyms: ['Water diffusion', 'Membrane transport'],
        antonyms: [],
        mnemonic: 'Osmosis = "OS" (water) + "MOSIS" (movement) - water movement',
        visualAid: {
          type: 'diagram' as const,
          description: 'Water molecules moving through a semipermeable membrane',
        },
      },
    ];

    return termData.map((term, index) => {
      // Assign random lesson and track IDs
      const randomTrackIds = tracks.slice(0, Math.floor(Math.random() * 3) + 1).map(t => t.id);
      const randomLessonIds = lessons.slice(0, Math.floor(Math.random() * 5) + 1).map(l => l.id);

      return {
        id: `term-${index + 1}`,
        ...term,
        lessonIds: randomLessonIds,
        trackIds: randomTrackIds,
        lastUpdated: new Date().toISOString(),
      };
    });
  };

  const categories: CategoryInfo[] = [
    {
      id: 'cell-biology',
      name: 'Cell Biology',
      description: 'Cellular structures and processes',
      icon: '🔬',
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      termCount: terms.filter(t => t.category === 'cell-biology').length,
    },
    {
      id: 'genetics',
      name: 'Genetics',
      description: 'Heredity and genetic information',
      icon: '🧬',
      color: 'bg-purple-100 text-purple-700 border-purple-200',
      termCount: terms.filter(t => t.category === 'genetics').length,
    },
    {
      id: 'anatomy',
      name: 'Anatomy',
      description: 'Body structures and systems',
      icon: '🫀',
      color: 'bg-red-100 text-red-700 border-red-200',
      termCount: terms.filter(t => t.category === 'anatomy').length,
    },
    {
      id: 'ecology',
      name: 'Ecology',
      description: 'Environmental interactions',
      icon: '🌱',
      color: 'bg-green-100 text-green-700 border-green-200',
      termCount: terms.filter(t => t.category === 'ecology').length,
    },
    {
      id: 'biochemistry',
      name: 'Biochemistry',
      description: 'Chemical processes in living things',
      icon: '⚗️',
      color: 'bg-orange-100 text-orange-700 border-orange-200',
      termCount: terms.filter(t => t.category === 'biochemistry').length,
    },
    {
      id: 'evolution',
      name: 'Evolution',
      description: 'Change over time',
      icon: '🦕',
      color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      termCount: terms.filter(t => t.category === 'evolution').length,
    },
    {
      id: 'microbiology',
      name: 'Microbiology',
      description: 'Microscopic organisms',
      icon: '🦠',
      color: 'bg-cyan-100 text-cyan-700 border-cyan-200',
      termCount: terms.filter(t => t.category === 'microbiology').length,
    },
    {
      id: 'physiology',
      name: 'Physiology',
      description: 'How living systems function',
      icon: '💓',
      color: 'bg-pink-100 text-pink-700 border-pink-200',
      termCount: terms.filter(t => t.category === 'physiology').length,
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredTerms = terms.filter(term => {
    const matchesSearch = searchQuery === '' || 
      term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.relatedTerms.some(related => related.toLowerCase().includes(searchQuery.toLowerCase())) ||
      term.synonyms.some(synonym => synonym.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || term.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getTrackName = (trackId: string) => {
    const track = tracks.find(t => t.id === trackId);
    return track ? track.title : 'Unknown Track';
  };

  const getLessonName = (lessonId: string) => {
    const lesson = lessons.find(l => l.id === lessonId);
    return lesson ? lesson.title : 'Unknown Lesson';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (view === 'term-detail' && selectedTerm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setView('overview')}
                className="flex items-center text-teal-600 hover:text-teal-700 font-medium"
              >
                <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                Back to Glossary
              </button>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(selectedTerm.difficulty)}`}>
                  {selectedTerm.difficulty}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${categories.find(c => c.id === selectedTerm.category)?.color}`}>
                  {categories.find(c => c.id === selectedTerm.category)?.icon} {categories.find(c => c.id === selectedTerm.category)?.name}
                </span>
              </div>
            </div>

            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">{selectedTerm.term}</h1>
              {selectedTerm.pronunciation && (
                <p className="text-lg text-gray-600 mb-4">
                  <strong>Pronunciation:</strong> {selectedTerm.pronunciation}
                </p>
              )}
              {selectedTerm.etymology && (
                <p className="text-sm text-gray-500 mb-4">
                  <strong>Etymology:</strong> {selectedTerm.etymology}
                </p>
              )}
              <p className="text-xl text-gray-700 leading-relaxed mb-6">{selectedTerm.definition}</p>
            </div>

            {selectedTerm.examples.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                  Examples
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {selectedTerm.examples.map((example, index) => (
                    <li key={index}>{example}</li>
                  ))}
                </ul>
              </div>
            )}

            {selectedTerm.mnemonic && (
              <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-yellow-600" />
                  Memory Trick
                </h3>
                <p className="text-gray-700 italic">"{selectedTerm.mnemonic}"</p>
              </div>
            )}

            {selectedTerm.visualAid && (
              <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-blue-600" />
                  Visual Aid
                </h3>
                <p className="text-gray-700 mb-2">
                  <strong>Type:</strong> {selectedTerm.visualAid.type}
                </p>
                <p className="text-gray-700">{selectedTerm.visualAid.description}</p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {selectedTerm.relatedTerms.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Related Terms</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTerm.relatedTerms.map((term, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm hover:bg-teal-200 cursor-pointer"
                        onClick={() => {
                          const foundTerm = terms.find(t => t.term === term);
                          if (foundTerm) {
                            setSelectedTerm(foundTerm);
                          }
                        }}
                      >
                        {term}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedTerm.synonyms.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Synonyms</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTerm.synonyms.map((synonym, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {synonym}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {selectedTerm.usageNotes && (
              <div className="mb-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Usage Notes</h3>
                <p className="text-gray-700">{selectedTerm.usageNotes}</p>
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Appears in Lessons</h3>
              <div className="space-y-2">
                {selectedTerm.lessonIds.slice(0, 5).map((lessonId, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                    onClick={() => onNavigate('lesson', { id: lessonId })}
                  >
                    <div>
                      <p className="font-medium text-gray-800">{getLessonName(lessonId)}</p>
                      <p className="text-sm text-gray-600">{getTrackName(selectedTerm.trackIds[0])}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
                {selectedTerm.lessonIds.length > 5 && (
                  <p className="text-sm text-gray-500 text-center">
                    And {selectedTerm.lessonIds.length - 5} more lessons...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
      <section className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Biology Glossary & Concept Bank</h1>
            <p className="text-xl text-teal-100 mb-8">
              Master biology terminology with searchable definitions, visual aids, and memory tricks.
              Find terms quickly and see where they appear in your lessons.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-teal-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Searchable Index</h3>
            <p className="text-gray-600">Find any biology term quickly with our comprehensive search</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-cyan-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-cyan-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Lesson Links</h3>
            <p className="text-gray-600">See exactly where each term appears in your learning tracks</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Memory Aids</h3>
            <p className="text-gray-600">Visual aids and mnemonic tricks to help you remember</p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 lg:mb-0">Browse Terms</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search terms, definitions, or related concepts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full sm:w-80 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name} ({category.termCount})
                  </option>
                ))}
              </select>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTerms.map((term) => (
              <div
                key={term.id}
                onClick={() => {
                  setSelectedTerm(term);
                  setView('term-detail');
                }}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 overflow-hidden cursor-pointer group"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-teal-600 transition-colors">
                      {term.term}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getDifficultyColor(term.difficulty)}`}>
                        {term.difficulty}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${categories.find(c => c.id === term.category)?.color}`}>
                        {categories.find(c => c.id === term.category)?.icon}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{term.definition}</p>
                  
                  {term.pronunciation && (
                    <p className="text-xs text-gray-500 mb-2 italic">{term.pronunciation}</p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <BookOpen className="w-3 h-3 mr-1" />
                      <span>{term.lessonIds.length} lessons</span>
                    </div>
                    {term.mnemonic && (
                      <div className="flex items-center text-yellow-600">
                        <Brain className="w-3 h-3 mr-1" />
                        <span>Memory trick</span>
                      </div>
                    )}
                  </div>
                  
                  {term.relatedTerms.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {term.relatedTerms.slice(0, 3).map((relatedTerm, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded"
                        >
                          {relatedTerm}
                        </span>
                      ))}
                      {term.relatedTerms.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{term.relatedTerms.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredTerms.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No terms found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Browse by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-6 rounded-xl border-2 transition-all text-left ${
                  selectedCategory === category.id
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-200 hover:border-teal-300 hover:bg-teal-50'
                }`}
              >
                <div className="text-3xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-2">{category.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                <p className="text-xs text-gray-500">{category.termCount} terms</p>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
