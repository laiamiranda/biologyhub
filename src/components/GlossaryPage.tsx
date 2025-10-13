import { useEffect, useState } from 'react';
import { Search, BookOpen, Eye, Brain, Lightbulb, ArrowRight, Filter, Star, Tag, ExternalLink } from 'lucide-react';
import { NavigationProps } from '../types/navigation';
import { getTracks, getLessons } from '../lib/api';

interface GlossaryPageProps extends NavigationProps {}

interface BiologyTerm {
  id: string;
  term: string;
  definition: string;
  category: 'foundations-biology' | 'genetics-molecular' | 'human-anatomy-physiology' | 'microbiology-virology' | 'immunology-host-defense' | 'plant-biology-ecology' | 'biochemistry-metabolism' | 'developmental-evolutionary' | 'biotechnology-modern' | 'special-topics';
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
      console.log('Loading glossary data...');
      const [tracksData] = await Promise.all([
        getTracks(),
      ]);

      console.log('Glossary tracks loaded:', tracksData.length, 'tracks');
      setTracks(tracksData);
      
      // Generate mock lessons for each track
      const allLessons: any[] = [];
      for (const track of tracksData) {
        const trackLessons = await getLessons(track.id);
        allLessons.push(...trackLessons);
      }
      setLessons(allLessons);
      console.log('Generated lessons:', allLessons.length);

      // Generate mock biology terms
      const mockTerms = generateMockBiologyTerms(tracksData, allLessons);
      console.log('Generated terms:', mockTerms.length);
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
        category: 'foundations-biology' as const,
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
        term: 'Nucleus',
        definition: 'The control center of the cell containing genetic material (DNA) and regulating cell activities.',
        category: 'foundations-biology' as const,
        difficulty: 'beginner' as const,
        pronunciation: 'NOO-klee-us',
        etymology: 'From Latin "nucleus" (kernel, core)',
        relatedTerms: ['DNA', 'Chromatin', 'Nuclear Envelope', 'Nucleolus'],
        examples: ['Found in eukaryotic cells', 'Contains chromosomes'],
        synonyms: ['Cell control center', 'Genetic headquarters'],
        antonyms: [],
        mnemonic: 'Nucleus = "NEW CLEAR" - the clear center of the cell',
        visualAid: {
          type: 'diagram' as const,
          description: 'Spherical organelle with nuclear membrane and chromatin',
        },
      },
      {
        term: 'Endoplasmic Reticulum',
        definition: 'A network of membranes in the cell involved in protein synthesis and lipid metabolism.',
        category: 'foundations-biology' as const,
        difficulty: 'intermediate' as const,
        pronunciation: 'en-doh-PLAZ-mik re-TIK-yoo-lum',
        etymology: 'From Greek "endon" (within) + "plasma" (formed) + Latin "reticulum" (little net)',
        relatedTerms: ['Ribosome', 'Rough ER', 'Smooth ER', 'Protein Synthesis'],
        examples: ['Rough ER has ribosomes', 'Smooth ER synthesizes lipids'],
        synonyms: ['ER', 'Cellular highway'],
        antonyms: [],
        mnemonic: 'ER = "Endoplasmic Reticulum" - the cell\'s internal highway system',
        visualAid: {
          type: 'diagram' as const,
          description: 'Network of interconnected membranes throughout the cytoplasm',
        },
      },
      {
        term: 'Golgi Apparatus',
        definition: 'An organelle that modifies, packages, and ships proteins and lipids to their destinations.',
        category: 'foundations-biology' as const,
        difficulty: 'intermediate' as const,
        pronunciation: 'GOL-jee ap-uh-RAT-us',
        etymology: 'Named after Camillo Golgi, Italian physician',
        relatedTerms: ['Vesicle', 'Protein Processing', 'Secretion', 'Endoplasmic Reticulum'],
        examples: ['Packages digestive enzymes', 'Modifies proteins from ER'],
        synonyms: ['Golgi Body', 'Golgi Complex'],
        antonyms: [],
        mnemonic: 'Golgi = "GO" + "LGI" - where things GO after being processed',
        visualAid: {
          type: 'diagram' as const,
          description: 'Stack of flattened membrane sacs with vesicles',
        },
      },
      {
        term: 'Lysosome',
        definition: 'A membrane-bound organelle containing digestive enzymes that break down cellular waste.',
        category: 'foundations-biology' as const,
        difficulty: 'intermediate' as const,
        pronunciation: 'LY-soh-sohm',
        etymology: 'From Greek "lysis" (loosening) + "soma" (body)',
        relatedTerms: ['Digestive Enzyme', 'Autophagy', 'Phagocytosis', 'Cellular Waste'],
        examples: ['Breaks down old organelles', 'Digests bacteria in white blood cells'],
        synonyms: ['Cellular stomach', 'Digestive bag'],
        antonyms: [],
        mnemonic: 'Lysosome = "LYSE" + "SOME" - lyses (breaks down) some things',
        visualAid: {
          type: 'diagram' as const,
          description: 'Small spherical organelle with digestive enzymes',
        },
      },
      {
        term: 'Vacuole',
        definition: 'A membrane-bound organelle that stores water, nutrients, and waste products.',
        category: 'foundations-biology' as const,
        difficulty: 'beginner' as const,
        pronunciation: 'VAK-yoo-ohl',
        etymology: 'From Latin "vacuus" (empty)',
        relatedTerms: ['Storage', 'Turgor Pressure', 'Plant Cell', 'Water'],
        examples: ['Large in plant cells', 'Stores water and nutrients'],
        synonyms: ['Storage compartment', 'Cellular warehouse'],
        antonyms: [],
        mnemonic: 'Vacuole = "VAC" + "U" + "OLE" - the empty space in the cell',
        visualAid: {
          type: 'diagram' as const,
          description: 'Large membrane-bound storage compartment',
        },
      },
      {
        term: 'Cytoplasm',
        definition: 'The gel-like substance that fills the cell and contains all organelles.',
        category: 'foundations-biology' as const,
        difficulty: 'beginner' as const,
        pronunciation: 'SY-toh-plaz-um',
        etymology: 'From Greek "kytos" (cell) + "plasma" (formed)',
        relatedTerms: ['Cytosol', 'Organelle', 'Cell Membrane', 'Cytoskeleton'],
        examples: ['Contains all cell organelles', 'Site of many chemical reactions'],
        synonyms: ['Cell gel', 'Cellular matrix'],
        antonyms: [],
        mnemonic: 'Cytoplasm = "CYTO" (cell) + "PLASM" (substance) - the cell\'s substance',
        visualAid: {
          type: 'diagram' as const,
          description: 'Gel-like substance filling the cell interior',
        },
      },
      {
        term: 'Cell Membrane',
        definition: 'A phospholipid bilayer that surrounds the cell and controls what enters and exits.',
        category: 'foundations-biology' as const,
        difficulty: 'beginner' as const,
        pronunciation: 'sel MEM-brayn',
        etymology: 'Cell + Membrane (from Latin "membrana" - skin)',
        relatedTerms: ['Phospholipid', 'Selective Permeability', 'Transport', 'Fluid Mosaic'],
        examples: ['Controls nutrient entry', 'Maintains cell shape'],
        synonyms: ['Plasma membrane', 'Cell boundary'],
        antonyms: [],
        mnemonic: 'Cell Membrane = "CELL" + "MEMBRANE" - the cell\'s skin',
        visualAid: {
          type: 'diagram' as const,
          description: 'Phospholipid bilayer with embedded proteins',
        },
      },
      {
        term: 'Cytoskeleton',
        definition: 'A network of protein filaments that provides structure and enables cell movement.',
        category: 'foundations-biology' as const,
        difficulty: 'intermediate' as const,
        pronunciation: 'sy-toh-SKEL-uh-ton',
        etymology: 'From Greek "kytos" (cell) + "skeleton" (dried body)',
        relatedTerms: ['Microtubule', 'Microfilament', 'Intermediate Filament', 'Cell Shape'],
        examples: ['Maintains cell shape', 'Enables cell division', 'Allows cell movement'],
        synonyms: ['Cellular skeleton', 'Protein framework'],
        antonyms: [],
        mnemonic: 'Cytoskeleton = "CYTO" (cell) + "SKELETON" - the cell\'s bones',
        visualAid: {
          type: 'diagram' as const,
          description: 'Network of protein filaments throughout the cell',
        },
      },
      {
        term: 'Ribosome',
        definition: 'Cellular structure responsible for protein synthesis.',
        category: 'foundations-biology' as const,
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
      {
        term: 'Chloroplast',
        definition: 'Organelle found in plant cells that conducts photosynthesis.',
        category: 'foundations-biology' as const,
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
        category: 'foundations-biology' as const,
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
        category: 'genetics-molecular' as const,
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
        category: 'genetics-molecular' as const,
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
        category: 'genetics-molecular' as const,
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
      {
        term: 'Chromosome',
        definition: 'A thread-like structure of DNA and protein that carries genetic information.',
        category: 'genetics-molecular' as const,
        difficulty: 'beginner' as const,
        pronunciation: 'KROH-muh-sohm',
        etymology: 'From Greek "chroma" (color) + "soma" (body)',
        relatedTerms: ['DNA', 'Gene', 'Centromere', 'Telomere', 'Karyotype'],
        examples: ['Humans have 46 chromosomes', 'X and Y chromosomes determine sex'],
        synonyms: ['Genetic thread', 'DNA package'],
        antonyms: [],
        mnemonic: 'Chromosome = "CHROMA" (color) + "SOME" - colored bodies in the cell',
        visualAid: {
          type: 'diagram' as const,
          description: 'X-shaped structure with two chromatids joined at centromere',
        },
      },
      {
        term: 'Genotype',
        definition: 'The genetic makeup of an organism, consisting of all its genes.',
        category: 'genetics-molecular' as const,
        difficulty: 'intermediate' as const,
        pronunciation: 'JEE-noh-type',
        etymology: 'From Greek "genos" (race) + "typos" (type)',
        relatedTerms: ['Phenotype', 'Allele', 'Homozygous', 'Heterozygous'],
        examples: ['BB, Bb, bb for eye color', 'AA, Aa, aa for blood type'],
        synonyms: ['Genetic constitution', 'Genetic makeup'],
        antonyms: ['Phenotype'],
        mnemonic: 'Genotype = "GENE" + "TYPE" - the type of genes you have',
        visualAid: {
          type: 'diagram' as const,
          description: 'Letters representing alleles (e.g., BB, Bb, bb)',
        },
      },
      {
        term: 'Phenotype',
        definition: 'The observable physical or biochemical characteristics of an organism.',
        category: 'genetics-molecular' as const,
        difficulty: 'intermediate' as const,
        pronunciation: 'FEE-noh-type',
        etymology: 'From Greek "phainein" (to show) + "typos" (type)',
        relatedTerms: ['Genotype', 'Trait', 'Expression', 'Environment'],
        examples: ['Brown eyes', 'Tall height', 'Blood type A'],
        synonyms: ['Physical appearance', 'Observable traits'],
        antonyms: ['Genotype'],
        mnemonic: 'Phenotype = "PHENO" (show) + "TYPE" - what you can see',
        visualAid: {
          type: 'image' as const,
          description: 'Visible characteristics like eye color, hair color, height',
        },
      },
      {
        term: 'Mutation',
        definition: 'A permanent change in the DNA sequence that can affect gene function.',
        category: 'genetics-molecular' as const,
        difficulty: 'intermediate' as const,
        pronunciation: 'myoo-TAY-shun',
        etymology: 'From Latin "mutare" (to change)',
        relatedTerms: ['DNA', 'Gene', 'Evolution', 'Genetic Variation'],
        examples: ['Sickle cell anemia', 'Color blindness', 'Antibiotic resistance'],
        synonyms: ['Genetic change', 'DNA alteration'],
        antonyms: ['Wild type'],
        mnemonic: 'Mutation = "MUTE" + "ATION" - changes that can silence genes',
        visualAid: {
          type: 'diagram' as const,
          description: 'DNA sequence showing before and after mutation',
        },
      },
      {
        term: 'Transcription',
        definition: 'The process of copying DNA into RNA in the nucleus.',
        category: 'genetics-molecular' as const,
        difficulty: 'intermediate' as const,
        pronunciation: 'tran-SKRIP-shun',
        etymology: 'From Latin "trans" (across) + "scribere" (to write)',
        relatedTerms: ['Translation', 'mRNA', 'RNA Polymerase', 'Promoter'],
        examples: ['DNA to mRNA conversion', 'First step in protein synthesis'],
        synonyms: ['RNA synthesis', 'Gene expression'],
        antonyms: [],
        mnemonic: 'Transcription = "TRANS" + "SCRIPTION" - writing across from DNA to RNA',
        visualAid: {
          type: 'diagram' as const,
          description: 'DNA being copied to form mRNA strand',
        },
      },
      {
        term: 'Translation',
        definition: 'The process of converting mRNA into proteins at ribosomes.',
        category: 'genetics-molecular' as const,
        difficulty: 'intermediate' as const,
        pronunciation: 'trans-LAY-shun',
        etymology: 'From Latin "trans" (across) + "latus" (carried)',
        relatedTerms: ['Transcription', 'mRNA', 'tRNA', 'Ribosome', 'Protein'],
        examples: ['mRNA to protein conversion', 'Occurs at ribosomes'],
        synonyms: ['Protein synthesis', 'Gene expression'],
        antonyms: [],
        mnemonic: 'Translation = "TRANS" + "LATION" - translating RNA language to protein',
        visualAid: {
          type: 'diagram' as const,
          description: 'Ribosome reading mRNA to build protein chain',
        },
      },
      {
        term: 'Heredity',
        definition: 'The passing of traits from parents to offspring through genes.',
        category: 'genetics-molecular' as const,
        difficulty: 'beginner' as const,
        pronunciation: 'huh-RED-i-tee',
        etymology: 'From Latin "hereditas" (inheritance)',
        relatedTerms: ['Genetics', 'Inheritance', 'Traits', 'Offspring'],
        examples: ['Eye color inheritance', 'Height from parents', 'Blood type patterns'],
        synonyms: ['Inheritance', 'Genetic transmission'],
        antonyms: [],
        mnemonic: 'Heredity = "HERED" (inherit) + "ITY" - the ability to inherit',
        visualAid: {
          type: 'diagram' as const,
          description: 'Family tree showing trait inheritance patterns',
        },
      },
      {
        term: 'Dominant',
        definition: 'An allele that is expressed even when only one copy is present.',
        category: 'genetics-molecular' as const,
        difficulty: 'intermediate' as const,
        pronunciation: 'DOM-uh-nunt',
        etymology: 'From Latin "dominans" (ruling)',
        relatedTerms: ['Recessive', 'Allele', 'Heterozygous', 'Phenotype'],
        examples: ['Brown eyes (B) over blue eyes (b)', 'Widow\'s peak over straight hairline'],
        synonyms: ['Strong allele', 'Expressed trait'],
        antonyms: ['Recessive'],
        mnemonic: 'Dominant = "DOM" (rule) + "INANT" - rules over recessive',
        visualAid: {
          type: 'diagram' as const,
          description: 'Punnett square showing dominant allele expression',
        },
      },
      {
        term: 'Recessive',
        definition: 'An allele that is only expressed when two copies are present.',
        category: 'genetics-molecular' as const,
        difficulty: 'intermediate' as const,
        pronunciation: 'ri-SES-iv',
        etymology: 'From Latin "recedere" (to go back)',
        relatedTerms: ['Dominant', 'Allele', 'Homozygous', 'Phenotype'],
        examples: ['Blue eyes (b) only with bb', 'Red hair requires two copies'],
        synonyms: ['Hidden allele', 'Masked trait'],
        antonyms: ['Dominant'],
        mnemonic: 'Recessive = "RE" (back) + "CESSIVE" - goes back, hidden by dominant',
        visualAid: {
          type: 'diagram' as const,
          description: 'Punnett square showing recessive allele hidden by dominant',
        },
      },
      {
        term: 'Homozygous',
        definition: 'Having two identical alleles for a particular gene.',
        category: 'genetics-molecular' as const,
        difficulty: 'intermediate' as const,
        pronunciation: 'hoh-moh-ZY-gus',
        etymology: 'From Greek "homo" (same) + "zygous" (yoked)',
        relatedTerms: ['Heterozygous', 'Allele', 'Genotype', 'Pure breeding'],
        examples: ['BB (homozygous dominant)', 'bb (homozygous recessive)'],
        synonyms: ['Pure', 'True breeding'],
        antonyms: ['Heterozygous'],
        mnemonic: 'Homozygous = "HOMO" (same) + "ZYGOUS" - same alleles',
        visualAid: {
          type: 'diagram' as const,
          description: 'Two identical alleles (BB or bb)',
        },
      },
      {
        term: 'Heterozygous',
        definition: 'Having two different alleles for a particular gene.',
        category: 'genetics-molecular' as const,
        difficulty: 'intermediate' as const,
        pronunciation: 'het-ur-oh-ZY-gus',
        etymology: 'From Greek "hetero" (different) + "zygous" (yoked)',
        relatedTerms: ['Homozygous', 'Allele', 'Genotype', 'Hybrid'],
        examples: ['Bb (heterozygous)', 'Aa (heterozygous)'],
        synonyms: ['Hybrid', 'Mixed'],
        antonyms: ['Homozygous'],
        mnemonic: 'Heterozygous = "HETERO" (different) + "ZYGOUS" - different alleles',
        visualAid: {
          type: 'diagram' as const,
          description: 'Two different alleles (Bb or Aa)',
        },
      },
      {
        term: 'RNA',
        definition: 'Ribonucleic acid - a molecule that helps carry out genetic instructions.',
        category: 'genetics-molecular' as const,
        difficulty: 'intermediate' as const,
        pronunciation: 'AR-en-AY',
        etymology: 'Ribonucleic Acid',
        relatedTerms: ['DNA', 'mRNA', 'tRNA', 'rRNA', 'Transcription'],
        examples: ['mRNA carries genetic code', 'tRNA brings amino acids'],
        synonyms: ['Ribonucleic acid', 'Genetic messenger'],
        antonyms: [],
        mnemonic: 'RNA = "RiboNucleic Acid" - the working copy of DNA',
        visualAid: {
          type: 'diagram' as const,
          description: 'Single-stranded molecule with uracil instead of thymine',
        },
      },
      {
        term: 'Protein',
        definition: 'A large molecule made of amino acids that performs various functions in cells.',
        category: 'genetics-molecular' as const,
        difficulty: 'beginner' as const,
        pronunciation: 'PROH-teen',
        etymology: 'From Greek "proteios" (primary)',
        relatedTerms: ['Amino Acid', 'Gene', 'Enzyme', 'Translation'],
        examples: ['Hemoglobin carries oxygen', 'Insulin regulates blood sugar'],
        synonyms: ['Polypeptide', 'Protein molecule'],
        antonyms: [],
        mnemonic: 'Protein = "PRO" + "TEIN" - the pro at doing cellular work',
        visualAid: {
          type: 'diagram' as const,
          description: 'Chain of amino acids folded into 3D structure',
        },
      },

      // Anatomy
      {
        term: 'Homeostasis',
        definition: 'The maintenance of stable internal conditions despite external changes.',
        category: 'human-anatomy-physiology' as const,
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
        category: 'human-anatomy-physiology' as const,
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
      {
        term: 'Heart',
        definition: 'A muscular organ that pumps blood throughout the body via the circulatory system.',
        category: 'human-anatomy-physiology' as const,
        difficulty: 'beginner' as const,
        pronunciation: 'HART',
        etymology: 'From Old English "heorte"',
        relatedTerms: ['Circulatory System', 'Atrium', 'Ventricle', 'Blood'],
        examples: ['Four-chambered in humans', 'Pumps oxygenated blood'],
        synonyms: ['Cardiac muscle', 'Pump'],
        antonyms: [],
        mnemonic: 'Heart = "HEART" - the center of circulation',
        visualAid: {
          type: 'diagram' as const,
          description: 'Four-chambered organ with atria and ventricles',
        },
      },
      {
        term: 'Lung',
        definition: 'A pair of organs responsible for gas exchange between blood and air.',
        category: 'human-anatomy-physiology' as const,
        difficulty: 'beginner' as const,
        pronunciation: 'LUNG',
        etymology: 'From Old English "lungen"',
        relatedTerms: ['Respiration', 'Alveoli', 'Bronchi', 'Oxygen'],
        examples: ['Right lung has 3 lobes', 'Left lung has 2 lobes'],
        synonyms: ['Pulmonary organ', 'Breathing organ'],
        antonyms: [],
        mnemonic: 'Lung = "LUNG" - where you breathe',
        visualAid: {
          type: 'diagram' as const,
          description: 'Spongy organ with branching airways and alveoli',
        },
      },
      {
        term: 'Brain',
        definition: 'The control center of the nervous system, responsible for thought, memory, and coordination.',
        category: 'human-anatomy-physiology' as const,
        difficulty: 'beginner' as const,
        pronunciation: 'BRAYN',
        etymology: 'From Old English "brægen"',
        relatedTerms: ['Nervous System', 'Neuron', 'Cerebrum', 'Cerebellum'],
        examples: ['Controls voluntary movements', 'Processes sensory information'],
        synonyms: ['Cerebrum', 'Mind'],
        antonyms: [],
        mnemonic: 'Brain = "BRAIN" - the main control center',
        visualAid: {
          type: 'diagram' as const,
          description: 'Complex organ with different regions and functions',
        },
      },
      {
        term: 'Liver',
        definition: 'A large organ that processes nutrients, filters toxins, and produces bile.',
        category: 'human-anatomy-physiology' as const,
        difficulty: 'beginner' as const,
        pronunciation: 'LIV-er',
        etymology: 'From Old English "lifer"',
        relatedTerms: ['Digestive System', 'Bile', 'Metabolism', 'Detoxification'],
        examples: ['Processes glucose', 'Removes toxins from blood'],
        synonyms: ['Hepatic organ', 'Metabolic factory'],
        antonyms: [],
        mnemonic: 'Liver = "LIVE" + "R" - keeps you alive',
        visualAid: {
          type: 'diagram' as const,
          description: 'Large reddish-brown organ with multiple lobes',
        },
      },
      {
        term: 'Kidney',
        definition: 'A pair of organs that filter waste products from blood and regulate water balance.',
        category: 'human-anatomy-physiology' as const,
        difficulty: 'beginner' as const,
        pronunciation: 'KID-nee',
        etymology: 'From Old English "cwið" (womb) + "ney" (kidney)',
        relatedTerms: ['Urinary System', 'Nephron', 'Filtration', 'Urine'],
        examples: ['Filters blood', 'Produces urine'],
        synonyms: ['Renal organ', 'Filter'],
        antonyms: [],
        mnemonic: 'Kidney = "KID" + "NEY" - filters like a kid sifting sand',
        visualAid: {
          type: 'diagram' as const,
          description: 'Bean-shaped organ with filtering units called nephrons',
        },
      },
      {
        term: 'Muscle',
        definition: 'Tissue that contracts to produce movement and maintain posture.',
        category: 'human-anatomy-physiology' as const,
        difficulty: 'beginner' as const,
        pronunciation: 'MUS-ul',
        etymology: 'From Latin "musculus" (little mouse)',
        relatedTerms: ['Contraction', 'Tendon', 'Skeletal Muscle', 'Smooth Muscle'],
        examples: ['Biceps flex the arm', 'Heart muscle pumps blood'],
        synonyms: ['Muscle tissue', 'Contractile tissue'],
        antonyms: [],
        mnemonic: 'Muscle = "MUS" + "CLE" - the muscle that moves you',
        visualAid: {
          type: 'diagram' as const,
          description: 'Bundles of muscle fibers that contract and relax',
        },
      },
      {
        term: 'Bone',
        definition: 'Hard connective tissue that provides structure, protection, and mineral storage.',
        category: 'human-anatomy-physiology' as const,
        difficulty: 'beginner' as const,
        pronunciation: 'BOHN',
        etymology: 'From Old English "ban"',
        relatedTerms: ['Skeleton', 'Calcium', 'Marrow', 'Osteocyte'],
        examples: ['Femur is the longest bone', 'Skull protects the brain'],
        synonyms: ['Osseous tissue', 'Skeletal element'],
        antonyms: [],
        mnemonic: 'Bone = "BONE" - the hard framework',
        visualAid: {
          type: 'diagram' as const,
          description: 'Hard, dense tissue with spongy and compact regions',
        },
      },
      {
        term: 'Artery',
        definition: 'A blood vessel that carries oxygenated blood away from the heart.',
        category: 'human-anatomy-physiology' as const,
        difficulty: 'intermediate' as const,
        pronunciation: 'AR-tuh-ree',
        etymology: 'From Greek "arteria" (windpipe)',
        relatedTerms: ['Vein', 'Capillary', 'Blood', 'Circulation'],
        examples: ['Aorta is the largest artery', 'Carotid arteries supply the brain'],
        synonyms: ['Arterial vessel', 'Oxygen carrier'],
        antonyms: ['Vein'],
        mnemonic: 'Artery = "ART" + "ERY" - carries art (oxygen) away from heart',
        visualAid: {
          type: 'diagram' as const,
          description: 'Thick-walled vessel with elastic tissue',
        },
      },
      {
        term: 'Vein',
        definition: 'A blood vessel that carries deoxygenated blood back to the heart.',
        category: 'human-anatomy-physiology' as const,
        difficulty: 'intermediate' as const,
        pronunciation: 'VAYN',
        etymology: 'From Latin "vena" (blood vessel)',
        relatedTerms: ['Artery', 'Capillary', 'Blood', 'Circulation'],
        examples: ['Superior vena cava', 'Jugular veins drain the head'],
        synonyms: ['Venous vessel', 'Blood returner'],
        antonyms: ['Artery'],
        mnemonic: 'Vein = "VEIN" - brings blood back to the heart',
        visualAid: {
          type: 'diagram' as const,
          description: 'Thin-walled vessel with valves to prevent backflow',
        },
      },
      {
        term: 'Capillary',
        definition: 'The smallest blood vessels where gas and nutrient exchange occurs.',
        category: 'human-anatomy-physiology' as const,
        difficulty: 'intermediate' as const,
        pronunciation: 'KAP-uh-ler-ee',
        etymology: 'From Latin "capillaris" (hair-like)',
        relatedTerms: ['Artery', 'Vein', 'Gas Exchange', 'Diffusion'],
        examples: ['Connect arteries to veins', 'Site of oxygen exchange'],
        synonyms: ['Microvessel', 'Exchange vessel'],
        antonyms: [],
        mnemonic: 'Capillary = "CAP" + "ILLARY" - caps the circulation',
        visualAid: {
          type: 'diagram' as const,
          description: 'Tiny, thin-walled vessels forming networks',
        },
      },
      {
        term: 'Neuron',
        definition: 'A specialized cell that transmits nerve impulses throughout the nervous system.',
        category: 'human-anatomy-physiology' as const,
        difficulty: 'intermediate' as const,
        pronunciation: 'NOOR-on',
        etymology: 'From Greek "neuron" (nerve)',
        relatedTerms: ['Synapse', 'Axon', 'Dendrite', 'Nervous System'],
        examples: ['Brain cells', 'Spinal cord cells', 'Sensory cells'],
        synonyms: ['Nerve cell', 'Neural cell'],
        antonyms: [],
        mnemonic: 'Neuron = "NEUR" (nerve) + "ON" - the nerve cell that\'s always on',
        visualAid: {
          type: 'diagram' as const,
          description: 'Cell with cell body, dendrites, and axon',
        },
      },
      {
        term: 'Spinal Cord',
        definition: 'A bundle of nerve tissue that connects the brain to the rest of the body.',
        category: 'human-anatomy-physiology' as const,
        difficulty: 'intermediate' as const,
        pronunciation: 'SPY-nul KORD',
        etymology: 'Spinal + Cord',
        relatedTerms: ['Brain', 'Nervous System', 'Vertebrae', 'Reflex'],
        examples: ['Transmits signals between brain and body', 'Controls reflex actions'],
        synonyms: ['Neural cord', 'Nerve bundle'],
        antonyms: [],
        mnemonic: 'Spinal Cord = "SPINAL" + "CORD" - the cord in your spine',
        visualAid: {
          type: 'diagram' as const,
          description: 'Long bundle of nerve tissue protected by vertebrae',
        },
      },
      {
        term: 'Digestive System',
        definition: 'The group of organs that break down food and absorb nutrients.',
        category: 'human-anatomy-physiology' as const,
        difficulty: 'beginner' as const,
        pronunciation: 'dy-JES-tiv SIS-tem',
        etymology: 'Digestive + System',
        relatedTerms: ['Stomach', 'Intestine', 'Liver', 'Pancreas'],
        examples: ['Breaks down food', 'Absorbs nutrients', 'Eliminates waste'],
        synonyms: ['Gastrointestinal system', 'GI tract'],
        antonyms: [],
        mnemonic: 'Digestive System = "DIGEST" + "IVE" + "SYSTEM" - the system that digests',
        visualAid: {
          type: 'diagram' as const,
          description: 'Tube from mouth to anus with accessory organs',
        },
      },
      {
        term: 'Respiratory System',
        definition: 'The group of organs responsible for gas exchange between the body and environment.',
        category: 'human-anatomy-physiology' as const,
        difficulty: 'beginner' as const,
        pronunciation: 'RES-puh-ruh-tor-ee SIS-tem',
        etymology: 'Respiratory + System',
        relatedTerms: ['Lung', 'Trachea', 'Bronchi', 'Alveoli'],
        examples: ['Brings in oxygen', 'Removes carbon dioxide', 'Enables breathing'],
        synonyms: ['Breathing system', 'Pulmonary system'],
        antonyms: [],
        mnemonic: 'Respiratory System = "RESPIR" (breathe) + "ATORY" + "SYSTEM" - the breathing system',
        visualAid: {
          type: 'diagram' as const,
          description: 'Airways from nose to lungs with gas exchange',
        },
      },
      {
        term: 'Circulatory System',
        definition: 'The system that transports blood, nutrients, and waste throughout the body.',
        category: 'human-anatomy-physiology' as const,
        difficulty: 'beginner' as const,
        pronunciation: 'SUR-kyoo-luh-tor-ee SIS-tem',
        etymology: 'Circulatory + System',
        relatedTerms: ['Heart', 'Blood', 'Artery', 'Vein'],
        examples: ['Pumps blood', 'Transports oxygen', 'Removes waste'],
        synonyms: ['Cardiovascular system', 'Blood system'],
        antonyms: [],
        mnemonic: 'Circulatory System = "CIRCUL" (circle) + "ATORY" + "SYSTEM" - the circular system',
        visualAid: {
          type: 'diagram' as const,
          description: 'Heart pumping blood through arteries and veins',
        },
      },

      // Ecology
      {
        term: 'Ecosystem',
        definition: 'A community of living organisms and their physical environment interacting as a system.',
        category: 'plant-biology-ecology' as const,
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
        category: 'plant-biology-ecology' as const,
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
      {
        term: 'Food Chain',
        definition: 'A linear sequence of organisms through which energy flows in an ecosystem.',
        category: 'plant-biology-ecology' as const,
        difficulty: 'beginner' as const,
        pronunciation: 'FOOD CHAYN',
        etymology: 'Food + Chain',
        relatedTerms: ['Food Web', 'Producer', 'Consumer', 'Decomposer'],
        examples: ['Grass → Rabbit → Fox', 'Algae → Fish → Shark'],
        synonyms: ['Trophic chain', 'Energy chain'],
        antonyms: [],
        mnemonic: 'Food Chain = "FOOD" + "CHAIN" - the chain of who eats whom',
        visualAid: {
          type: 'diagram' as const,
          description: 'Linear sequence showing energy flow from producer to top predator',
        },
      },
      {
        term: 'Food Web',
        definition: 'A complex network of interconnected food chains in an ecosystem.',
        category: 'plant-biology-ecology' as const,
        difficulty: 'intermediate' as const,
        pronunciation: 'FOOD WEB',
        etymology: 'Food + Web',
        relatedTerms: ['Food Chain', 'Trophic Level', 'Energy Flow', 'Ecosystem'],
        examples: ['Forest food web', 'Ocean food web', 'Multiple feeding relationships'],
        synonyms: ['Trophic web', 'Ecological network'],
        antonyms: [],
        mnemonic: 'Food Web = "FOOD" + "WEB" - the web of who eats whom',
        visualAid: {
          type: 'diagram' as const,
          description: 'Complex network showing multiple feeding relationships',
        },
      },
      {
        term: 'Producer',
        definition: 'An organism that makes its own food through photosynthesis or chemosynthesis.',
        category: 'plant-biology-ecology' as const,
        difficulty: 'beginner' as const,
        pronunciation: 'pruh-DOO-ser',
        etymology: 'From Latin "producere" (to bring forth)',
        relatedTerms: ['Consumer', 'Photosynthesis', 'Autotroph', 'Primary Producer'],
        examples: ['Plants', 'Algae', 'Cyanobacteria'],
        synonyms: ['Autotroph', 'Primary producer'],
        antonyms: ['Consumer'],
        mnemonic: 'Producer = "PRODUCE" + "R" - produces its own food',
        visualAid: {
          type: 'image' as const,
          description: 'Green plants using sunlight to make food',
        },
      },
      {
        term: 'Consumer',
        definition: 'An organism that obtains energy by eating other organisms.',
        category: 'plant-biology-ecology' as const,
        difficulty: 'beginner' as const,
        pronunciation: 'kun-SOO-mer',
        etymology: 'From Latin "consumere" (to use up)',
        relatedTerms: ['Producer', 'Heterotroph', 'Herbivore', 'Carnivore'],
        examples: ['Animals', 'Fungi', 'Bacteria'],
        synonyms: ['Heterotroph', 'Feeder'],
        antonyms: ['Producer'],
        mnemonic: 'Consumer = "CONSUME" + "R" - consumes other organisms',
        visualAid: {
          type: 'image' as const,
          description: 'Animals eating plants or other animals',
        },
      },
      {
        term: 'Decomposer',
        definition: 'An organism that breaks down dead organic matter and returns nutrients to the soil.',
        category: 'plant-biology-ecology' as const,
        difficulty: 'intermediate' as const,
        pronunciation: 'dee-kum-POH-zer',
        etymology: 'Decompose + -er',
        relatedTerms: ['Detritivore', 'Nutrient Cycling', 'Bacteria', 'Fungi'],
        examples: ['Bacteria', 'Fungi', 'Earthworms'],
        synonyms: ['Saprotroph', 'Recycler'],
        antonyms: [],
        mnemonic: 'Decomposer = "DECOMPOSE" + "R" - decomposes dead matter',
        visualAid: {
          type: 'image' as const,
          description: 'Fungi and bacteria breaking down dead leaves',
        },
      },
      {
        term: 'Habitat',
        definition: 'The natural environment where an organism lives and grows.',
        category: 'plant-biology-ecology' as const,
        difficulty: 'beginner' as const,
        pronunciation: 'HAB-i-tat',
        etymology: 'From Latin "habitare" (to dwell)',
        relatedTerms: ['Niche', 'Environment', 'Ecosystem', 'Home'],
        examples: ['Forest habitat', 'Ocean habitat', 'Desert habitat'],
        synonyms: ['Home', 'Environment'],
        antonyms: [],
        mnemonic: 'Habitat = "HABIT" + "AT" - where organisms habitually live',
        visualAid: {
          type: 'image' as const,
          description: 'Specific environment where organisms live',
        },
      },
      {
        term: 'Niche',
        definition: 'The role and position of an organism in its environment, including its habitat and behavior.',
        category: 'plant-biology-ecology' as const,
        difficulty: 'intermediate' as const,
        pronunciation: 'NICH',
        etymology: 'From French "niche" (recess)',
        relatedTerms: ['Habitat', 'Role', 'Competition', 'Adaptation'],
        examples: ['Predator niche', 'Pollinator niche', 'Scavenger niche'],
        synonyms: ['Ecological role', 'Function'],
        antonyms: [],
        mnemonic: 'Niche = "NICH" - the specific role in the ecosystem',
        visualAid: {
          type: 'diagram' as const,
          description: 'Organism\'s specific role and position in ecosystem',
        },
      },
      {
        term: 'Population',
        definition: 'A group of individuals of the same species living in the same area.',
        category: 'plant-biology-ecology' as const,
        difficulty: 'beginner' as const,
        pronunciation: 'pop-yoo-LAY-shun',
        etymology: 'From Latin "populatio" (people)',
        relatedTerms: ['Species', 'Community', 'Ecosystem', 'Density'],
        examples: ['Deer population in forest', 'Human population in city'],
        synonyms: ['Group', 'Collection'],
        antonyms: [],
        mnemonic: 'Population = "POPUL" (people) + "ATION" - a group of the same species',
        visualAid: {
          type: 'image' as const,
          description: 'Group of same species in specific area',
        },
      },
      {
        term: 'Community',
        definition: 'All the different populations living together in the same area.',
        category: 'plant-biology-ecology' as const,
        difficulty: 'intermediate' as const,
        pronunciation: 'kuh-MYOO-ni-tee',
        etymology: 'From Latin "communitas" (fellowship)',
        relatedTerms: ['Population', 'Ecosystem', 'Species', 'Interaction'],
        examples: ['Forest community', 'Pond community', 'Coral reef community'],
        synonyms: ['Biological community', 'Species assemblage'],
        antonyms: [],
        mnemonic: 'Community = "COMMUN" (common) + "ITY" - common living space',
        visualAid: {
          type: 'diagram' as const,
          description: 'Multiple populations interacting in same area',
        },
      },
      {
        term: 'Biome',
        definition: 'A large-scale community of organisms characterized by climate and vegetation.',
        category: 'plant-biology-ecology' as const,
        difficulty: 'intermediate' as const,
        pronunciation: 'BY-ohm',
        etymology: 'From Greek "bios" (life) + "ome" (mass)',
        relatedTerms: ['Ecosystem', 'Climate', 'Vegetation', 'Biogeography'],
        examples: ['Tropical rainforest', 'Tundra', 'Grassland', 'Desert'],
        synonyms: ['Ecosystem type', 'Life zone'],
        antonyms: [],
        mnemonic: 'Biome = "BIO" (life) + "OME" - a large life zone',
        visualAid: {
          type: 'image' as const,
          description: 'Large-scale ecosystem with characteristic climate and vegetation',
        },
      },
      {
        term: 'Climate',
        definition: 'The long-term weather patterns in a particular area.',
        category: 'plant-biology-ecology' as const,
        difficulty: 'beginner' as const,
        pronunciation: 'KLY-mit',
        etymology: 'From Greek "klima" (region)',
        relatedTerms: ['Weather', 'Temperature', 'Precipitation', 'Biome'],
        examples: ['Tropical climate', 'Temperate climate', 'Polar climate'],
        synonyms: ['Weather pattern', 'Environmental conditions'],
        antonyms: [],
        mnemonic: 'Climate = "CLIM" + "ATE" - the long-term weather state',
        visualAid: {
          type: 'diagram' as const,
          description: 'Long-term temperature and precipitation patterns',
        },
      },
      {
        term: 'Conservation',
        definition: 'The protection and preservation of natural resources and biodiversity.',
        category: 'plant-biology-ecology' as const,
        difficulty: 'beginner' as const,
        pronunciation: 'kon-ser-VAY-shun',
        etymology: 'From Latin "conservare" (to keep safe)',
        relatedTerms: ['Biodiversity', 'Sustainability', 'Protection', 'Preservation'],
        examples: ['Wildlife conservation', 'Habitat protection', 'Species recovery'],
        synonyms: ['Protection', 'Preservation'],
        antonyms: ['Destruction', 'Exploitation'],
        mnemonic: 'Conservation = "CONSERVE" + "ATION" - the act of conserving',
        visualAid: {
          type: 'image' as const,
          description: 'Protected areas and conservation efforts',
        },
      },
      {
        term: 'Sustainability',
        definition: 'The ability to maintain ecological processes and biodiversity over time.',
        category: 'plant-biology-ecology' as const,
        difficulty: 'intermediate' as const,
        pronunciation: 'suh-stay-nuh-BIL-i-tee',
        etymology: 'From "sustain" + "-ability"',
        relatedTerms: ['Conservation', 'Renewable', 'Ecosystem', 'Future'],
        examples: ['Sustainable agriculture', 'Renewable energy', 'Ecosystem health'],
        synonyms: ['Maintainability', 'Long-term viability'],
        antonyms: ['Unsustainability', 'Depletion'],
        mnemonic: 'Sustainability = "SUSTAIN" + "ABILITY" - the ability to sustain',
        visualAid: {
          type: 'diagram' as const,
          description: 'Balance between human needs and environmental health',
        },
      },

      // Biochemistry
      {
        term: 'Enzyme',
        definition: 'A protein that acts as a biological catalyst, speeding up chemical reactions.',
        category: 'biochemistry-metabolism' as const,
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
        category: 'biochemistry-metabolism' as const,
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
      {
        term: 'Glucose',
        definition: 'A simple sugar that is the primary energy source for cells.',
        category: 'biochemistry-metabolism' as const,
        difficulty: 'beginner' as const,
        pronunciation: 'GLOO-kohs',
        etymology: 'From Greek "glukus" (sweet)',
        relatedTerms: ['Sugar', 'Carbohydrate', 'Energy', 'Photosynthesis'],
        examples: ['Blood sugar', 'Plant energy storage', 'Cellular respiration'],
        synonyms: ['Blood sugar', 'Dextrose'],
        antonyms: [],
        mnemonic: 'Glucose = "GLU" (sweet) + "COSE" - the sweet energy source',
        visualAid: {
          type: 'diagram' as const,
          description: 'Six-carbon sugar molecule with ring structure',
        },
      },
      {
        term: 'Photosynthesis',
        definition: 'The process by which plants convert light energy into chemical energy.',
        category: 'biochemistry-metabolism' as const,
        difficulty: 'beginner' as const,
        pronunciation: 'foh-toh-SIN-thuh-sis',
        etymology: 'From Greek "photo" (light) + "synthesis" (putting together)',
        relatedTerms: ['Chlorophyll', 'Glucose', 'Oxygen', 'Light'],
        examples: ['Plants making food', 'Algae producing oxygen', 'Forest energy production'],
        synonyms: ['Light synthesis', 'Plant energy production'],
        antonyms: [],
        mnemonic: 'Photosynthesis = "PHOTO" (light) + "SYNTHESIS" - using light to synthesize',
        visualAid: {
          type: 'diagram' as const,
          description: 'Process showing light + CO2 + water → glucose + oxygen',
        },
      },
      {
        term: 'Cellular Respiration',
        definition: 'The process by which cells break down glucose to produce ATP energy.',
        category: 'biochemistry-metabolism' as const,
        difficulty: 'intermediate' as const,
        pronunciation: 'SEL-yoo-ler res-puh-RAY-shun',
        etymology: 'Cellular + Respiration',
        relatedTerms: ['ATP', 'Glucose', 'Mitochondria', 'Oxygen'],
        examples: ['Muscle energy production', 'Brain energy needs', 'Cell metabolism'],
        synonyms: ['Aerobic respiration', 'Energy production'],
        antonyms: [],
        mnemonic: 'Cellular Respiration = "CELLULAR" + "RESPIRATION" - breathing at the cellular level',
        visualAid: {
          type: 'diagram' as const,
          description: 'Process showing glucose + oxygen → ATP + CO2 + water',
        },
      },
      {
        term: 'Amino Acid',
        definition: 'The building blocks of proteins, containing an amino group and carboxyl group.',
        category: 'biochemistry-metabolism' as const,
        difficulty: 'intermediate' as const,
        pronunciation: 'uh-MEE-noh AS-id',
        etymology: 'Amino + Acid',
        relatedTerms: ['Protein', 'Peptide Bond', 'Translation', 'R Group'],
        examples: ['20 different types', 'Protein building blocks', 'Essential amino acids'],
        synonyms: ['Protein building block', 'Peptide unit'],
        antonyms: [],
        mnemonic: 'Amino Acid = "AMINO" + "ACID" - the acid with amino group',
        visualAid: {
          type: 'diagram' as const,
          description: 'Molecule with amino group, carboxyl group, and R group',
        },
      },
      {
        term: 'Lipid',
        definition: 'A diverse group of organic compounds that are insoluble in water.',
        category: 'biochemistry-metabolism' as const,
        difficulty: 'intermediate' as const,
        pronunciation: 'LIP-id',
        etymology: 'From Greek "lipos" (fat)',
        relatedTerms: ['Fat', 'Phospholipid', 'Cholesterol', 'Membrane'],
        examples: ['Fats and oils', 'Cell membranes', 'Energy storage'],
        synonyms: ['Fat', 'Oil'],
        antonyms: [],
        mnemonic: 'Lipid = "LIP" + "ID" - the fat that doesn\'t mix with water',
        visualAid: {
          type: 'diagram' as const,
          description: 'Hydrophobic molecules like fats and phospholipids',
        },
      },
      {
        term: 'Nucleotide',
        definition: 'The building blocks of DNA and RNA, consisting of a sugar, phosphate, and base.',
        category: 'biochemistry-metabolism' as const,
        difficulty: 'intermediate' as const,
        pronunciation: 'NOO-klee-oh-tyd',
        etymology: 'From "nucleus" + "-ide"',
        relatedTerms: ['DNA', 'RNA', 'Base', 'Sugar'],
        examples: ['Adenine, Thymine, Guanine, Cytosine', 'DNA building blocks'],
        synonyms: ['Nucleic acid unit', 'Genetic building block'],
        antonyms: [],
        mnemonic: 'Nucleotide = "NUCLEO" + "TIDE" - the tide of genetic building blocks',
        visualAid: {
          type: 'diagram' as const,
          description: 'Molecule with sugar, phosphate, and nitrogenous base',
        },
      },
      {
        term: 'pH',
        definition: 'A measure of acidity or alkalinity on a scale from 0 to 14.',
        category: 'biochemistry-metabolism' as const,
        difficulty: 'beginner' as const,
        pronunciation: 'PEE-AYCH',
        etymology: 'From German "Potenz" (power) + "H" (hydrogen)',
        relatedTerms: ['Acid', 'Base', 'Hydrogen Ion', 'Neutral'],
        examples: ['pH 7 is neutral', 'pH 1 is very acidic', 'pH 14 is very basic'],
        synonyms: ['Acidity scale', 'Alkalinity measure'],
        antonyms: [],
        mnemonic: 'pH = "P" + "H" - the power of hydrogen',
        visualAid: {
          type: 'diagram' as const,
          description: 'Scale from 0 (acidic) to 14 (basic) with 7 as neutral',
        },
      },
      {
        term: 'Catalyst',
        definition: 'A substance that speeds up a chemical reaction without being consumed.',
        category: 'biochemistry-metabolism' as const,
        difficulty: 'intermediate' as const,
        pronunciation: 'KAT-uh-list',
        etymology: 'From Greek "katalysis" (dissolution)',
        relatedTerms: ['Enzyme', 'Reaction Rate', 'Activation Energy', 'Substrate'],
        examples: ['Enzymes in cells', 'Industrial catalysts', 'Metallic catalysts'],
        synonyms: ['Reaction accelerator', 'Speed enhancer'],
        antonyms: [],
        mnemonic: 'Catalyst = "CAT" + "ALYST" - the cat that speeds up reactions',
        visualAid: {
          type: 'diagram' as const,
          description: 'Substance that lowers activation energy for reactions',
        },
      },
      {
        term: 'Substrate',
        definition: 'The molecule that an enzyme acts upon in a chemical reaction.',
        category: 'biochemistry-metabolism' as const,
        difficulty: 'intermediate' as const,
        pronunciation: 'SUB-strayt',
        etymology: 'From Latin "substratus" (laid under)',
        relatedTerms: ['Enzyme', 'Active Site', 'Product', 'Reaction'],
        examples: ['Glucose for hexokinase', 'Lactose for lactase', 'Starch for amylase'],
        synonyms: ['Reactant', 'Target molecule'],
        antonyms: ['Product'],
        mnemonic: 'Substrate = "SUB" (under) + "STRATE" - what goes under the enzyme',
        visualAid: {
          type: 'diagram' as const,
          description: 'Molecule that fits into enzyme\'s active site',
        },
      },
      {
        term: 'Active Site',
        definition: 'The specific region of an enzyme where the substrate binds and the reaction occurs.',
        category: 'biochemistry-metabolism' as const,
        difficulty: 'intermediate' as const,
        pronunciation: 'AK-tiv SYT',
        etymology: 'Active + Site',
        relatedTerms: ['Enzyme', 'Substrate', 'Lock and Key', 'Induced Fit'],
        examples: ['Where glucose binds to hexokinase', 'Catalytic center of enzyme'],
        synonyms: ['Catalytic site', 'Binding site'],
        antonyms: [],
        mnemonic: 'Active Site = "ACTIVE" + "SITE" - the active place where reactions happen',
        visualAid: {
          type: 'diagram' as const,
          description: 'Pocket or groove in enzyme where substrate fits',
        },
      },
      {
        term: 'Coenzyme',
        definition: 'A non-protein molecule that helps enzymes function properly.',
        category: 'biochemistry-metabolism' as const,
        difficulty: 'advanced' as const,
        pronunciation: 'koh-EN-zym',
        etymology: 'Co- + Enzyme',
        relatedTerms: ['Enzyme', 'Vitamin', 'Cofactor', 'Reaction'],
        examples: ['NAD+', 'FAD', 'Coenzyme A', 'Vitamin B derivatives'],
        synonyms: ['Enzyme helper', 'Cofactor'],
        antonyms: [],
        mnemonic: 'Coenzyme = "CO" + "ENZYME" - works with the enzyme',
        visualAid: {
          type: 'diagram' as const,
          description: 'Small molecule that binds to enzyme to help it work',
        },
      },
      {
        term: 'Metabolism',
        definition: 'The sum of all chemical reactions that occur in an organism.',
        category: 'biochemistry-metabolism' as const,
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
        term: 'Anabolism',
        definition: 'The building up of complex molecules from simpler ones, requiring energy.',
        category: 'biochemistry-metabolism' as const,
        difficulty: 'advanced' as const,
        pronunciation: 'uh-NAB-uh-liz-um',
        etymology: 'From Greek "anabole" (building up)',
        relatedTerms: ['Catabolism', 'Metabolism', 'ATP', 'Synthesis'],
        examples: ['Protein synthesis', 'DNA replication', 'Muscle building'],
        synonyms: ['Biosynthesis', 'Building up'],
        antonyms: ['Catabolism'],
        mnemonic: 'Anabolism = "ANA" (up) + "BOLISM" - building up molecules',
        visualAid: {
          type: 'diagram' as const,
          description: 'Process of combining small molecules to make larger ones',
        },
      },
      {
        term: 'Catabolism',
        definition: 'The breaking down of complex molecules into simpler ones, releasing energy.',
        category: 'biochemistry-metabolism' as const,
        difficulty: 'advanced' as const,
        pronunciation: 'kuh-TAB-uh-liz-um',
        etymology: 'From Greek "katabole" (throwing down)',
        relatedTerms: ['Anabolism', 'Metabolism', 'ATP', 'Digestion'],
        examples: ['Digestion', 'Cellular respiration', 'Muscle breakdown'],
        synonyms: ['Breakdown', 'Degradation'],
        antonyms: ['Anabolism'],
        mnemonic: 'Catabolism = "CATA" (down) + "BOLISM" - breaking down molecules',
        visualAid: {
          type: 'diagram' as const,
          description: 'Process of breaking large molecules into smaller ones',
        },
      },

      // Evolution
      {
        term: 'Natural Selection',
        definition: 'The process by which organisms with favorable traits survive and reproduce more successfully.',
        category: 'developmental-evolutionary' as const,
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
        category: 'developmental-evolutionary' as const,
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
        category: 'microbiology-virology' as const,
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
        category: 'microbiology-virology' as const,
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
        category: 'human-anatomy-physiology' as const,
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
        category: 'human-anatomy-physiology' as const,
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
      id: 'foundations-biology',
      name: 'Foundations of Biology',
      description: 'Core concepts from cell theory to energy systems',
      icon: '🧬',
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      termCount: terms.filter(t => t.category === 'foundations-biology').length,
    },
    {
      id: 'genetics-molecular',
      name: 'Genetics & Molecular Biology',
      description: 'DNA, inheritance, and genetic engineering',
      icon: '🧪',
      color: 'bg-purple-100 text-purple-700 border-purple-200',
      termCount: terms.filter(t => t.category === 'genetics-molecular').length,
    },
    {
      id: 'human-anatomy-physiology',
      name: 'Human Anatomy & Physiology',
      description: 'Body systems and their functions',
      icon: '🧠',
      color: 'bg-red-100 text-red-700 border-red-200',
      termCount: terms.filter(t => t.category === 'human-anatomy-physiology').length,
    },
    {
      id: 'microbiology-virology',
      name: 'Microbiology & Virology',
      description: 'Bacteria, viruses, and microorganisms',
      icon: '🧫',
      color: 'bg-green-100 text-green-700 border-green-200',
      termCount: terms.filter(t => t.category === 'microbiology-virology').length,
    },
    {
      id: 'immunology-host-defense',
      name: 'Immunology & Host Defense',
      description: 'Immune system and disease protection',
      icon: '🛡️',
      color: 'bg-orange-100 text-orange-700 border-orange-200',
      termCount: terms.filter(t => t.category === 'immunology-host-defense').length,
    },
    {
      id: 'plant-biology-ecology',
      name: 'Plant Biology & Ecology',
      description: 'Plant systems and environmental science',
      icon: '🌱',
      color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      termCount: terms.filter(t => t.category === 'plant-biology-ecology').length,
    },
    {
      id: 'biochemistry-metabolism',
      name: 'Biochemistry & Metabolism',
      description: 'Molecular processes and energy pathways',
      icon: '⚗️',
      color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      termCount: terms.filter(t => t.category === 'biochemistry-metabolism').length,
    },
    {
      id: 'developmental-evolutionary',
      name: 'Developmental & Evolutionary Biology',
      description: 'Growth, development, and evolution',
      icon: '🦕',
      color: 'bg-cyan-100 text-cyan-700 border-cyan-200',
      termCount: terms.filter(t => t.category === 'developmental-evolutionary').length,
    },
    {
      id: 'biotechnology-modern',
      name: 'Biotechnology & Modern Biology',
      description: 'Genetic engineering and applied biology',
      icon: '🔬',
      color: 'bg-pink-100 text-pink-700 border-pink-200',
      termCount: terms.filter(t => t.category === 'biotechnology-modern').length,
    },
    {
      id: 'special-topics',
      name: 'Special Topics & Applications',
      description: 'Advanced topics and real-world applications',
      icon: '🧭',
      color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      termCount: terms.filter(t => t.category === 'special-topics').length,
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
      {/* Modern Hero Section */}
      <section className="relative bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-700 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-16 lg:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium text-teal-100 mb-6">
              <BookOpen className="w-4 h-4 mr-2" />
              Biology Glossary
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Biology Glossary & Concept Bank
            </h1>
            
            <p className="text-xl text-teal-100 mb-8 max-w-3xl mx-auto">
              Find terms quickly and see where they appear in your lessons.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Modern Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            <div className="bg-gradient-to-br from-teal-100 to-teal-200 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Search className="w-8 h-8 text-teal-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Searchable Index</h3>
            <p className="text-gray-600 leading-relaxed">Find any biology term quickly with our comprehensive search and intelligent filtering system.</p>
          </div>
          <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            <div className="bg-gradient-to-br from-cyan-100 to-cyan-200 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="w-8 h-8 text-cyan-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Lesson Links</h3>
            <p className="text-gray-600 leading-relaxed">See exactly where each term appears in your learning tracks with direct navigation links.</p>
          </div>
          <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Brain className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Memory Aids</h3>
            <p className="text-gray-600 leading-relaxed">Visual aids, mnemonic tricks, and memory techniques to help you master complex terminology.</p>
          </div>
        </div>

        {/* Modern Search and Filter Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search terms, definitions, or related concepts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg transition-all duration-300 hover:border-gray-300"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-12 pr-10 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none bg-white text-lg transition-all duration-300 hover:border-gray-300 min-w-[200px]"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name} ({category.termCount})
                    </option>
                  ))}
                </select>
              </div>

              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none bg-white text-lg transition-all duration-300 hover:border-gray-300 min-w-[150px]"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Browse Terms</h2>
            <p className="text-gray-600">
              {searchQuery && `Searching for "${searchQuery}"`}
              {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
              {selectedDifficulty !== 'all' && ` at ${selectedDifficulty} level`}
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 mr-2" />
                <span>{filteredTerms.length} terms found</span>
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-2" />
                <span>Expert curated</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Terms Grid */}
        {filteredTerms.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTerms.map((term, index) => (
              <div
                key={term.id}
                onClick={() => {
                  setSelectedTerm(term);
                  setView('term-detail');
                }}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden cursor-pointer border border-gray-100"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-teal-600 transition-colors line-clamp-1">
                      {term.term}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-2 rounded-full text-xs font-semibold ${getDifficultyColor(term.difficulty)}`}>
                        {term.difficulty}
                      </span>
                      <span className={`px-3 py-2 rounded-full text-xs font-semibold ${categories.find(c => c.id === term.category)?.color}`}>
                        {categories.find(c => c.id === term.category)?.icon}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {term.definition}
                  </p>
                  
                  {term.pronunciation && (
                    <p className="text-sm text-gray-500 mb-4 italic bg-gray-50 px-3 py-2 rounded-lg">
                      <strong>Pronunciation:</strong> {term.pronunciation}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Tag className="w-4 h-4 mr-2 text-teal-500" />
                      <span className="font-medium">{categories.find(c => c.id === term.category)?.name}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <BookOpen className="w-4 h-4 mr-2 text-cyan-500" />
                      <span className="font-medium">{term.lessonIds.length} lessons</span>
                    </div>
                  </div>
                  
                  {term.mnemonic && (
                    <div className="flex items-center text-sm text-teal-600 bg-teal-50 px-3 py-2 rounded-lg mb-4">
                      <Brain className="w-4 h-4 mr-2" />
                      <span className="font-medium">Memory trick available</span>
                    </div>
                  )}
                  
                  {term.relatedTerms.length > 0 && (
                    <div className="mb-6">
                      <p className="text-sm font-medium text-gray-700 mb-2">Related Terms:</p>
                      <div className="flex flex-wrap gap-2">
                        {term.relatedTerms.slice(0, 3).map((relatedTerm, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700 text-xs rounded-full font-medium"
                          >
                            {relatedTerm}
                          </span>
                        ))}
                        {term.relatedTerms.length > 3 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                            +{term.relatedTerms.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-center">
                    <div className="flex items-center text-teal-600 font-semibold group-hover:text-teal-700 transition-colors">
                      <span>View Details</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">No terms found</h3>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              {searchQuery 
                ? `No terms match "${searchQuery}". Try adjusting your search terms.`
                : 'No terms match your current filters. Try changing your search criteria.'
              }
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedDifficulty('all');
              }}
              className="px-6 py-3 bg-teal-600 text-white rounded-2xl hover:bg-teal-700 transition-colors font-semibold"
            >
              Clear Filters
            </button>
          </div>
        )}
        </div>

        {/* Modern Category Browsing Section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Browse by Category</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore biology terms organized by subject area. Click on any category to filter terms.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden cursor-pointer border border-gray-100 ${
                  selectedCategory === category.id
                    ? 'border-teal-500 bg-gradient-to-br from-teal-50 to-cyan-50'
                    : 'hover:border-teal-300'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-700">
                        {category.termCount}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-teal-600 transition-colors line-clamp-2">
                    {category.name}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center justify-center">
                    <div className="flex items-center text-teal-600 font-semibold group-hover:text-teal-700 transition-colors text-sm">
                      <span>Browse</span>
                      <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
  );
}
