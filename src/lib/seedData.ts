export const categoriesData = [
  {
    name: 'Foundations of Biology',
    description: 'Core concepts from cell theory to energy systems',
    icon: '🧬',
    order_index: 1,
  },
  {
    name: 'Genetics & Molecular Biology',
    description: 'DNA, inheritance, and genetic engineering',
    icon: '🧪',
    order_index: 2,
  },
  {
    name: 'Human Anatomy & Physiology',
    description: 'Body systems and their functions',
    icon: '🧠',
    order_index: 3,
  },
  {
    name: 'Microbiology & Virology',
    description: 'Bacteria, viruses, and microorganisms',
    icon: '🧫',
    order_index: 4,
  },
  {
    name: 'Immunology & Host Defense',
    description: 'Immune system and disease protection',
    icon: '🛡️',
    order_index: 5,
  },
  {
    name: 'Plant Biology & Ecology',
    description: 'Plant systems and environmental science',
    icon: '🌱',
    order_index: 6,
  },
  {
    name: 'Biochemistry & Metabolism',
    description: 'Molecular processes and energy pathways',
    icon: '⚗️',
    order_index: 7,
  },
  {
    name: 'Developmental & Evolutionary Biology',
    description: 'Growth, development, and evolution',
    icon: '🦕',
    order_index: 8,
  },
  {
    name: 'Biotechnology & Modern Biology',
    description: 'Genetic engineering and applied biology',
    icon: '🔬',
    order_index: 9,
  },
  {
    name: 'Special Topics & Applications',
    description: 'Advanced topics and real-world applications',
    icon: '🧭',
    order_index: 10,
  },
];

export const tracksData = [
  // 🧬 1. Foundations of Biology (10 tracks)
  { track_number: 1, title: 'What is Life? Introduction to Biology', category_idx: 0, difficulty_level: 'beginner', estimated_hours: 2, description: 'Explore the fundamental characteristics of living organisms and the scope of biological sciences.' },
  { track_number: 2, title: 'Cell Theory & Cell Types', category_idx: 0, difficulty_level: 'beginner', estimated_hours: 3, description: 'Understand the cell theory and distinguish between different types of cells.' },
  { track_number: 3, title: 'Microscopy and Cell Observation', category_idx: 0, difficulty_level: 'beginner', estimated_hours: 2, description: 'Learn microscopy techniques and how to observe cellular structures.' },
  { track_number: 4, title: 'Prokaryotic vs. Eukaryotic Cells', category_idx: 0, difficulty_level: 'beginner', estimated_hours: 3, description: 'Compare and contrast prokaryotic and eukaryotic cell structures.' },
  { track_number: 5, title: 'Organelles and Their Functions', category_idx: 0, difficulty_level: 'beginner', estimated_hours: 4, description: 'Deep dive into cellular organelles and their specific roles.' },
  { track_number: 6, title: 'DNA Structure & Function', category_idx: 0, difficulty_level: 'intermediate', estimated_hours: 4, description: 'Master the structure of DNA and its role as genetic material.' },
  { track_number: 7, title: 'RNA, Transcription & Translation', category_idx: 0, difficulty_level: 'intermediate', estimated_hours: 5, description: 'Understand how genetic information flows from DNA to proteins.' },
  { track_number: 8, title: 'Proteins & Enzymes', category_idx: 0, difficulty_level: 'intermediate', estimated_hours: 4, description: 'Explore protein structure, function, and enzymatic catalysis.' },
  { track_number: 9, title: 'Membranes & Transport Mechanisms', category_idx: 0, difficulty_level: 'intermediate', estimated_hours: 3, description: 'Learn how substances move across cell membranes.' },
  { track_number: 10, title: 'Energy in Cells (ATP, Metabolism, Photosynthesis, Respiration)', category_idx: 0, difficulty_level: 'intermediate', estimated_hours: 5, description: 'Study ATP production, photosynthesis, and cellular respiration.' },

  // 🧪 2. Genetics & Molecular Biology (10 tracks)
  { track_number: 11, title: 'Mendelian Genetics', category_idx: 1, difficulty_level: 'beginner', estimated_hours: 4, description: 'Master the principles of inheritance discovered by Gregor Mendel.' },
  { track_number: 12, title: 'Non-Mendelian Inheritance', category_idx: 1, difficulty_level: 'intermediate', estimated_hours: 3, description: 'Explore inheritance patterns beyond simple Mendelian genetics.' },
  { track_number: 13, title: 'Chromosomes & Cell Division (Mitosis/Meiosis)', category_idx: 1, difficulty_level: 'intermediate', estimated_hours: 4, description: 'Understand mitosis, meiosis, and chromosome behavior.' },
  { track_number: 14, title: 'Mutations & DNA Repair', category_idx: 1, difficulty_level: 'intermediate', estimated_hours: 4, description: 'Learn about genetic mutations and cellular repair mechanisms.' },
  { track_number: 15, title: 'Gene Regulation & Epigenetics', category_idx: 1, difficulty_level: 'advanced', estimated_hours: 5, description: 'Study how gene expression is controlled and modified.' },
  { track_number: 16, title: 'Molecular Techniques (PCR, Gel Electrophoresis, etc.)', category_idx: 1, difficulty_level: 'intermediate', estimated_hours: 4, description: 'Master PCR, gel electrophoresis, and other lab techniques.' },
  { track_number: 17, title: 'Genetic Engineering & CRISPR', category_idx: 1, difficulty_level: 'advanced', estimated_hours: 5, description: 'Explore cutting-edge gene editing technologies.' },
  { track_number: 18, title: 'Population Genetics', category_idx: 1, difficulty_level: 'advanced', estimated_hours: 4, description: 'Understand genetic variation in populations.' },
  { track_number: 19, title: 'Human Genetics & Inherited Diseases', category_idx: 1, difficulty_level: 'intermediate', estimated_hours: 4, description: 'Study human genetic disorders and their inheritance.' },
  { track_number: 20, title: 'Ethical Issues in Genetics', category_idx: 1, difficulty_level: 'intermediate', estimated_hours: 2, description: 'Explore ethical considerations in genetic research and applications.' },

  // 🧠 3. Human Anatomy & Physiology (10 tracks)
  { track_number: 21, title: 'Introduction to Human Body Systems', category_idx: 2, difficulty_level: 'beginner', estimated_hours: 3, description: 'Overview of organ systems and body organization.' },
  { track_number: 22, title: 'Skeletal & Muscular System', category_idx: 2, difficulty_level: 'beginner', estimated_hours: 4, description: 'Learn about bones, joints, and muscle function.' },
  { track_number: 23, title: 'Circulatory & Cardiovascular System', category_idx: 2, difficulty_level: 'intermediate', estimated_hours: 5, description: 'Understand heart function and blood circulation.' },
  { track_number: 24, title: 'Respiratory System', category_idx: 2, difficulty_level: 'beginner', estimated_hours: 3, description: 'Study breathing and gas exchange mechanisms.' },
  { track_number: 25, title: 'Digestive System', category_idx: 2, difficulty_level: 'beginner', estimated_hours: 4, description: 'Explore nutrient breakdown and absorption.' },
  { track_number: 26, title: 'Nervous System', category_idx: 2, difficulty_level: 'intermediate', estimated_hours: 6, description: 'Master brain function and neural communication.' },
  { track_number: 27, title: 'Endocrine System & Hormones', category_idx: 2, difficulty_level: 'intermediate', estimated_hours: 4, description: 'Learn about hormonal regulation and glands.' },
  { track_number: 28, title: 'Reproductive System', category_idx: 2, difficulty_level: 'intermediate', estimated_hours: 4, description: 'Understand human reproduction and development.' },
  { track_number: 29, title: 'Sensory Organs & Perception', category_idx: 2, difficulty_level: 'intermediate', estimated_hours: 3, description: 'Study vision, hearing, and other senses.' },
  { track_number: 30, title: 'Homeostasis & Integration of Systems', category_idx: 2, difficulty_level: 'advanced', estimated_hours: 4, description: 'Explore how body systems work together.' },

  // 🧫 4. Microbiology & Virology (10 tracks)
  { track_number: 31, title: 'Introduction to Microorganisms', category_idx: 3, difficulty_level: 'beginner', estimated_hours: 3, description: 'Explore the diverse world of microorganisms and their classification.' },
  { track_number: 32, title: 'Bacteria: Structure & Function', category_idx: 3, difficulty_level: 'beginner', estimated_hours: 4, description: 'Study bacterial cell structure, metabolism, and ecological roles.' },
  { track_number: 33, title: 'Archaea & Extremophiles', category_idx: 3, difficulty_level: 'intermediate', estimated_hours: 3, description: 'Learn about archaea and organisms that thrive in extreme environments.' },
  { track_number: 34, title: 'Viruses: Structure, Replication, Evolution', category_idx: 3, difficulty_level: 'intermediate', estimated_hours: 4, description: 'Understand viral structure, life cycles, and evolutionary significance.' },
  { track_number: 35, title: 'Fungi & Parasites', category_idx: 3, difficulty_level: 'intermediate', estimated_hours: 4, description: 'Study fungal biology and parasitic organisms.' },
  { track_number: 36, title: 'Microbial Genetics & Recombination', category_idx: 3, difficulty_level: 'intermediate', estimated_hours: 4, description: 'Explore genetic mechanisms in microorganisms.' },
  { track_number: 37, title: 'Microbiomes & Symbiosis', category_idx: 3, difficulty_level: 'intermediate', estimated_hours: 3, description: 'Understand microbial communities and symbiotic relationships.' },
  { track_number: 38, title: 'Pathogenic Microbes & Diseases', category_idx: 3, difficulty_level: 'intermediate', estimated_hours: 4, description: 'Study disease-causing microorganisms and pathogenesis.' },
  { track_number: 39, title: 'Antimicrobial Resistance', category_idx: 3, difficulty_level: 'advanced', estimated_hours: 3, description: 'Learn about antibiotic resistance and its global impact.' },
  { track_number: 40, title: 'Laboratory Techniques in Microbiology', category_idx: 3, difficulty_level: 'intermediate', estimated_hours: 4, description: 'Master microbiological laboratory methods and safety.' },

  // 🧬 5. Immunology & Host Defense (10 tracks)
  { track_number: 41, title: 'Innate Immune System', category_idx: 4, difficulty_level: 'intermediate', estimated_hours: 4, description: 'Study the body\'s first line of defense against pathogens.' },
  { track_number: 42, title: 'Adaptive Immune System', category_idx: 4, difficulty_level: 'intermediate', estimated_hours: 5, description: 'Learn about specific immune responses and memory.' },
  { track_number: 43, title: 'Antigens, Antibodies, and Receptors', category_idx: 4, difficulty_level: 'intermediate', estimated_hours: 4, description: 'Understand immune recognition and response mechanisms.' },
  { track_number: 44, title: 'Lymphatic System & Cells of Immunity', category_idx: 4, difficulty_level: 'intermediate', estimated_hours: 3, description: 'Study immune cell types and lymphatic circulation.' },
  { track_number: 45, title: 'Immune Response to Infection', category_idx: 4, difficulty_level: 'intermediate', estimated_hours: 4, description: 'Learn how the immune system responds to different pathogens.' },
  { track_number: 46, title: 'Vaccines & Immunization', category_idx: 4, difficulty_level: 'intermediate', estimated_hours: 3, description: 'Understand vaccine mechanisms and immunization strategies.' },
  { track_number: 47, title: 'Autoimmune Disorders', category_idx: 4, difficulty_level: 'advanced', estimated_hours: 4, description: 'Study diseases where the immune system attacks the body.' },
  { track_number: 48, title: 'Allergies & Hypersensitivity', category_idx: 4, difficulty_level: 'intermediate', estimated_hours: 3, description: 'Learn about allergic reactions and hypersensitivity responses.' },
  { track_number: 49, title: 'Tumor Immunology', category_idx: 4, difficulty_level: 'advanced', estimated_hours: 4, description: 'Explore how the immune system interacts with cancer.' },
  { track_number: 50, title: 'Immunotherapy & Cutting-Edge Research', category_idx: 4, difficulty_level: 'advanced', estimated_hours: 4, description: 'Study modern immunotherapeutic approaches and research.' },

  // 🌱 6. Plant Biology & Ecology (10 tracks)
  { track_number: 51, title: 'Plant Cells & Tissues', category_idx: 5, difficulty_level: 'beginner', estimated_hours: 3, description: 'Study plant cell structure and tissue organization.' },
  { track_number: 52, title: 'Photosynthesis & Energy Conversion', category_idx: 5, difficulty_level: 'intermediate', estimated_hours: 4, description: 'Master the process of photosynthesis and energy conversion.' },
  { track_number: 53, title: 'Plant Transport Systems', category_idx: 5, difficulty_level: 'intermediate', estimated_hours: 3, description: 'Learn about water and nutrient transport in plants.' },
  { track_number: 54, title: 'Plant Reproduction & Development', category_idx: 5, difficulty_level: 'intermediate', estimated_hours: 4, description: 'Study plant life cycles and reproductive strategies.' },
  { track_number: 55, title: 'Plant Hormones & Growth', category_idx: 5, difficulty_level: 'intermediate', estimated_hours: 3, description: 'Understand plant growth regulation and hormone signaling.' },
  { track_number: 56, title: 'Ecology Basics', category_idx: 5, difficulty_level: 'beginner', estimated_hours: 3, description: 'Introduction to ecological principles and relationships.' },
  { track_number: 57, title: 'Ecosystem Dynamics & Energy Flow', category_idx: 5, difficulty_level: 'intermediate', estimated_hours: 4, description: 'Study energy flow and nutrient cycling in ecosystems.' },
  { track_number: 58, title: 'Biomes & Biodiversity', category_idx: 5, difficulty_level: 'intermediate', estimated_hours: 4, description: 'Explore different biomes and biodiversity patterns.' },
  { track_number: 59, title: 'Conservation Biology', category_idx: 5, difficulty_level: 'intermediate', estimated_hours: 3, description: 'Learn about species conservation and habitat protection.' },
  { track_number: 60, title: 'Climate Change & Biological Impact', category_idx: 5, difficulty_level: 'intermediate', estimated_hours: 3, description: 'Study the biological effects of climate change.' },

  // 🧬 7. Biochemistry & Metabolism (10 tracks)
  { track_number: 61, title: 'Biochemical Molecules (Carbs, Lipids, Proteins)', category_idx: 6, difficulty_level: 'beginner', estimated_hours: 4, description: 'Study the structure and function of major biomolecules.' },
  { track_number: 62, title: 'Enzyme Kinetics & Catalysis', category_idx: 6, difficulty_level: 'intermediate', estimated_hours: 4, description: 'Learn about enzyme mechanisms and kinetic principles.' },
  { track_number: 63, title: 'Bioenergetics & Thermodynamics', category_idx: 6, difficulty_level: 'intermediate', estimated_hours: 3, description: 'Understand energy principles in biological systems.' },
  { track_number: 64, title: 'Glycolysis & Cellular Respiration', category_idx: 6, difficulty_level: 'intermediate', estimated_hours: 5, description: 'Master cellular energy production pathways.' },
  { track_number: 65, title: 'Photosynthesis Detailed Pathways', category_idx: 6, difficulty_level: 'intermediate', estimated_hours: 4, description: 'Study the detailed mechanisms of photosynthesis.' },
  { track_number: 66, title: 'Lipid & Protein Metabolism', category_idx: 6, difficulty_level: 'intermediate', estimated_hours: 4, description: 'Learn about lipid and protein breakdown and synthesis.' },
  { track_number: 67, title: 'Signal Transduction', category_idx: 6, difficulty_level: 'advanced', estimated_hours: 4, description: 'Understand cellular signaling mechanisms.' },
  { track_number: 68, title: 'Metabolic Regulation & Integration', category_idx: 6, difficulty_level: 'advanced', estimated_hours: 4, description: 'Study how metabolic pathways are coordinated.' },
  { track_number: 69, title: 'Redox Reactions & Oxidative Stress', category_idx: 6, difficulty_level: 'intermediate', estimated_hours: 3, description: 'Learn about oxidation-reduction in biological systems.' },
  { track_number: 70, title: 'Experimental Biochemistry Techniques', category_idx: 6, difficulty_level: 'intermediate', estimated_hours: 4, description: 'Master laboratory techniques in biochemistry.' },

  // 🧬 8. Developmental & Evolutionary Biology (10 tracks)
  { track_number: 71, title: 'Principles of Developmental Biology', category_idx: 7, difficulty_level: 'intermediate', estimated_hours: 4, description: 'Study how organisms develop from single cells to complex forms.' },
  { track_number: 72, title: 'Fertilization & Early Embryogenesis', category_idx: 7, difficulty_level: 'intermediate', estimated_hours: 4, description: 'Learn about early developmental processes.' },
  { track_number: 73, title: 'Gene Regulation in Development', category_idx: 7, difficulty_level: 'advanced', estimated_hours: 4, description: 'Understand how genes control development.' },
  { track_number: 74, title: 'Morphogenesis & Patterning', category_idx: 7, difficulty_level: 'advanced', estimated_hours: 4, description: 'Study how body plans and structures form.' },
  { track_number: 75, title: 'Evolutionary Theory & Natural Selection', category_idx: 7, difficulty_level: 'intermediate', estimated_hours: 4, description: 'Master the principles of evolution and natural selection.' },
  { track_number: 76, title: 'Speciation & Phylogenetics', category_idx: 7, difficulty_level: 'intermediate', estimated_hours: 4, description: 'Learn about species formation and evolutionary relationships.' },
  { track_number: 77, title: 'Evolution of Multicellularity', category_idx: 7, difficulty_level: 'advanced', estimated_hours: 3, description: 'Study the transition from single to multicellular life.' },
  { track_number: 78, title: 'Comparative Anatomy & Evolution', category_idx: 7, difficulty_level: 'intermediate', estimated_hours: 4, description: 'Compare anatomical structures across species.' },
  { track_number: 79, title: 'Human Evolution', category_idx: 7, difficulty_level: 'intermediate', estimated_hours: 4, description: 'Study the evolutionary history of humans.' },
  { track_number: 80, title: 'Evo-Devo: Linking Development & Evolution', category_idx: 7, difficulty_level: 'advanced', estimated_hours: 4, description: 'Explore the connection between development and evolution.' },

  // 🧬 9. Biotechnology & Modern Biology (10 tracks)
  { track_number: 81, title: 'Recombinant DNA Technology', category_idx: 8, difficulty_level: 'intermediate', estimated_hours: 4, description: 'Learn about DNA manipulation and recombinant techniques.' },
  { track_number: 82, title: 'Gene Editing & CRISPR', category_idx: 8, difficulty_level: 'advanced', estimated_hours: 4, description: 'Master modern gene editing technologies.' },
  { track_number: 83, title: 'Stem Cells & Regenerative Medicine', category_idx: 8, difficulty_level: 'advanced', estimated_hours: 4, description: 'Study stem cell biology and therapeutic applications.' },
  { track_number: 84, title: 'Bioprocessing & Bioreactors', category_idx: 8, difficulty_level: 'intermediate', estimated_hours: 3, description: 'Learn about industrial biotechnology processes.' },
  { track_number: 85, title: 'Biopharmaceuticals & Vaccines', category_idx: 8, difficulty_level: 'intermediate', estimated_hours: 4, description: 'Study biological drug development and production.' },
  { track_number: 86, title: 'Synthetic Biology', category_idx: 8, difficulty_level: 'advanced', estimated_hours: 4, description: 'Explore engineering biological systems.' },
  { track_number: 87, title: 'Bioinformatics & Genomic Data', category_idx: 8, difficulty_level: 'intermediate', estimated_hours: 4, description: 'Learn computational approaches to biological data.' },
  { track_number: 88, title: 'Systems Biology & Modelling', category_idx: 8, difficulty_level: 'advanced', estimated_hours: 4, description: 'Study biological systems as integrated networks.' },
  { track_number: 89, title: 'Biosensors & Lab-on-a-Chip', category_idx: 8, difficulty_level: 'intermediate', estimated_hours: 3, description: 'Learn about miniaturized biological detection systems.' },
  { track_number: 90, title: 'Ethical & Regulatory Aspects of Biotech', category_idx: 8, difficulty_level: 'intermediate', estimated_hours: 3, description: 'Explore ethical considerations in biotechnology.' },

  // 🧭 10. Special Topics & Applications (10 tracks)
  { track_number: 91, title: 'Cancer Biology & Oncology', category_idx: 9, difficulty_level: 'advanced', estimated_hours: 5, description: 'Study cancer mechanisms and treatment approaches.' },
  { track_number: 92, title: 'Neurobiology & Brain Function', category_idx: 9, difficulty_level: 'advanced', estimated_hours: 5, description: 'Explore brain structure and neural mechanisms.' },
  { track_number: 93, title: 'Endocrinology & Metabolism Disorders', category_idx: 9, difficulty_level: 'intermediate', estimated_hours: 4, description: 'Study hormonal disorders and metabolic diseases.' },
  { track_number: 94, title: 'Cardiovascular Physiology in Disease', category_idx: 9, difficulty_level: 'intermediate', estimated_hours: 4, description: 'Learn about heart and blood vessel diseases.' },
  { track_number: 95, title: 'Infectious Diseases & Emerging Pathogens', category_idx: 9, difficulty_level: 'intermediate', estimated_hours: 4, description: 'Study infectious diseases and emerging threats.' },
  { track_number: 96, title: 'Aging & Longevity', category_idx: 9, difficulty_level: 'intermediate', estimated_hours: 3, description: 'Explore biological aging processes and longevity research.' },
  { track_number: 97, title: 'Human Microbiome & Health', category_idx: 9, difficulty_level: 'intermediate', estimated_hours: 3, description: 'Study the role of microbes in human health.' },
  { track_number: 98, title: 'Personalized Medicine & Genomics', category_idx: 9, difficulty_level: 'advanced', estimated_hours: 4, description: 'Learn about individualized medical approaches.' },
  { track_number: 99, title: 'Space Biology & Extremophysiology', category_idx: 9, difficulty_level: 'advanced', estimated_hours: 3, description: 'Study biology in extreme environments and space.' },
  { track_number: 100, title: 'Big Questions in Biology & Future Trends', category_idx: 9, difficulty_level: 'advanced', estimated_hours: 3, description: 'Explore major unanswered questions and future directions in biology.' },
];

export const lessonsData = [
  // Track 1: What is Life? Introduction to Biology
  {
    track_number: 1,
    lessons: [
      {
        title: 'Characteristics of Life',
        content: '<h2>What Makes Something Alive?</h2><p>Living organisms share several fundamental characteristics that distinguish them from non-living matter. These include:</p><ul><li><strong>Organization:</strong> All living things are composed of one or more cells, the basic units of life.</li><li><strong>Metabolism:</strong> Living organisms carry out chemical reactions to maintain life, including obtaining and using energy.</li><li><strong>Growth and Development:</strong> Organisms increase in size and complexity according to instructions encoded in their DNA.</li><li><strong>Reproduction:</strong> Living things produce offspring of the same species.</li><li><strong>Response to Stimuli:</strong> Organisms react to environmental changes.</li><li><strong>Homeostasis:</strong> The ability to maintain stable internal conditions.</li><li><strong>Evolution:</strong> Populations of organisms change over time through natural selection.</li></ul><h3>The Biological Hierarchy</h3><p>Life is organized at multiple levels, from atoms and molecules to cells, tissues, organs, organ systems, organisms, populations, communities, ecosystems, and the biosphere.</p>',
        content_type: 'article',
        duration_minutes: 20,
        order_index: 1,
      },
      {
        title: 'The Scientific Method in Biology',
        content: '<h2>How Biologists Study Life</h2><p>The scientific method is a systematic approach to understanding the natural world. It involves several key steps:</p><ol><li><strong>Observation:</strong> Carefully observing phenomena in nature</li><li><strong>Question:</strong> Asking questions about what you observe</li><li><strong>Hypothesis:</strong> Proposing a testable explanation</li><li><strong>Prediction:</strong> Making predictions based on your hypothesis</li><li><strong>Experimentation:</strong> Testing predictions through controlled experiments</li><li><strong>Analysis:</strong> Analyzing data and drawing conclusions</li><li><strong>Communication:</strong> Sharing results with the scientific community</li></ol><h3>Types of Studies</h3><p>Biologists use different types of studies including controlled experiments, observational studies, and comparative studies. Each has advantages for answering different types of questions.</p>',
        content_type: 'article',
        duration_minutes: 25,
        order_index: 2,
      },
      {
        title: 'Branches of Biology',
        content: '<h2>The Diverse Fields of Biological Science</h2><p>Biology encompasses many specialized fields, each focusing on different aspects of life:</p><ul><li><strong>Molecular Biology:</strong> Studies biological processes at the molecular level</li><li><strong>Genetics:</strong> Examines heredity and genetic variation</li><li><strong>Ecology:</strong> Investigates relationships between organisms and their environment</li><li><strong>Evolutionary Biology:</strong> Studies the origins and changes in life over time</li><li><strong>Physiology:</strong> Explores how living systems function</li><li><strong>Anatomy:</strong> Studies the structure of organisms</li><li><strong>Microbiology:</strong> Focuses on microscopic organisms</li><li><strong>Botany:</strong> The study of plants</li><li><strong>Zoology:</strong> The study of animals</li></ul><p>These fields often overlap and complement each other, providing a comprehensive understanding of life.</p>',
        content_type: 'article',
        duration_minutes: 15,
        order_index: 3,
      },
    ],
  },
  // Track 2: Cell Theory & Cell Types
  {
    track_number: 2,
    lessons: [
      {
        title: 'The Cell Theory',
        content: '<h2>The Foundation of Modern Biology</h2><p>The cell theory is one of the fundamental principles of biology. It consists of three main tenets:</p><ol><li>All living organisms are composed of one or more cells</li><li>The cell is the basic unit of life</li><li>All cells arise from pre-existing cells</li></ol><h3>Historical Development</h3><p>The cell theory developed over centuries through the work of many scientists:</p><ul><li><strong>Robert Hooke (1665):</strong> First observed and named cells while examining cork under a microscope</li><li><strong>Anton van Leeuwenhoek (1670s):</strong> Observed living cells and microorganisms</li><li><strong>Matthias Schleiden (1838):</strong> Proposed that all plants are made of cells</li><li><strong>Theodor Schwann (1839):</strong> Extended the idea to animals</li><li><strong>Rudolf Virchow (1855):</strong> Stated that all cells come from pre-existing cells</li></ul><p>This theory revolutionized our understanding of life and remains central to biology today.</p>',
        content_type: 'article',
        duration_minutes: 25,
        order_index: 1,
      },
      {
        title: 'Types of Cells',
        content: '<h2>Cellular Diversity</h2><p>Cells come in many shapes and sizes, but can be broadly categorized into two main types:</p><h3>Prokaryotic Cells</h3><ul><li>Lack a membrane-bound nucleus</li><li>DNA is located in a nucleoid region</li><li>Generally smaller and simpler</li><li>Include bacteria and archaea</li><li>Have a cell wall</li></ul><h3>Eukaryotic Cells</h3><ul><li>Have a membrane-bound nucleus</li><li>Contain membrane-bound organelles</li><li>Generally larger and more complex</li><li>Include plants, animals, fungi, and protists</li><li>More compartmentalized structure</li></ul><h3>Cell Specialization</h3><p>In multicellular organisms, cells specialize to perform specific functions. Examples include nerve cells, muscle cells, red blood cells, and plant guard cells. This specialization allows for greater efficiency and complexity.</p>',
        content_type: 'article',
        duration_minutes: 20,
        order_index: 2,
      },
    ],
  },
  // Track 3: Microscopy and Cell Observation
  {
    track_number: 3,
    lessons: [
      {
        title: 'Types of Microscopes',
        content: '<h2>Tools for Observing Cells</h2><p>Microscopes are essential tools for studying cellular structures. There are several types:</p><h3>Light Microscopes</h3><ul><li>Use visible light to illuminate specimens</li><li>Can magnify up to 1000x</li><li>Good for observing living cells</li><li>Relatively inexpensive and easy to use</li></ul><h3>Electron Microscopes</h3><ul><li>Use electron beams instead of light</li><li>Can magnify up to 1,000,000x</li><li>Provide much higher resolution</li><li>Require dead, prepared specimens</li></ul><h3>Confocal Microscopes</h3><ul><li>Use laser light to create 3D images</li><li>Excellent for fluorescent labeling</li><li>Can observe living cells in real-time</li></ul>',
        content_type: 'article',
        duration_minutes: 20,
        order_index: 1,
      },
      {
        title: 'Microscopy Techniques',
        content: '<h2>Methods for Cell Observation</h2><p>Various techniques enhance our ability to observe cellular structures:</p><h3>Staining</h3><ul><li>Dyes that highlight specific structures</li><li>Common stains: methylene blue, iodine, crystal violet</li><li>Fluorescent dyes for specific molecules</li></ul><h3>Phase Contrast</h3><ul><li>Enhances contrast in transparent specimens</li><li>Useful for observing living cells</li><li>No staining required</li></ul><h3>Fluorescence Microscopy</h3><ul><li>Uses fluorescent molecules to label structures</li><li>Can track specific proteins or DNA</li><li>Allows real-time observation</li></ul>',
        content_type: 'article',
        duration_minutes: 25,
        order_index: 2,
      },
    ],
  },
  // Track 4: Prokaryotic vs. Eukaryotic Cells
  {
    track_number: 4,
    lessons: [
      {
        title: 'Prokaryotic Cell Structure',
        content: '<h2>Simple but Effective</h2><p>Prokaryotic cells are characterized by their simplicity and efficiency:</p><h3>Key Features</h3><ul><li><strong>No nucleus:</strong> DNA floats freely in cytoplasm</li><li><strong>No membrane-bound organelles</strong></li><li><strong>Cell wall:</strong> Provides structure and protection</li><li><strong>Ribosomes:</strong> Smaller than eukaryotic ribosomes</li><li><strong>Flagella:</strong> For movement</li><li><strong>Pili:</strong> For attachment and DNA transfer</li></ul><h3>Examples</h3><p>Bacteria and archaea are the two domains of prokaryotic life. Despite their simple structure, they are incredibly diverse and successful.</p>',
        content_type: 'article',
        duration_minutes: 25,
        order_index: 1,
      },
      {
        title: 'Eukaryotic Cell Structure',
        content: '<h2>Complex and Compartmentalized</h2><p>Eukaryotic cells are more complex with membrane-bound organelles:</p><h3>Key Features</h3><ul><li><strong>Nucleus:</strong> Contains DNA and controls cell activities</li><li><strong>Mitochondria:</strong> Powerhouses of the cell</li><li><strong>Endoplasmic Reticulum:</strong> Protein and lipid synthesis</li><li><strong>Golgi Apparatus:</strong> Protein processing and packaging</li><li><strong>Lysosomes:</strong> Cellular waste disposal</li><li><strong>Chloroplasts:</strong> Photosynthesis (in plants)</li></ul><h3>Examples</h3><p>Plants, animals, fungi, and protists are all eukaryotic organisms.</p>',
        content_type: 'article',
        duration_minutes: 30,
        order_index: 2,
      },
      {
        title: 'Comparing Prokaryotes and Eukaryotes',
        content: '<h2>Key Differences</h2><p>Understanding the differences helps explain the evolution of life:</p><h3>Size</h3><ul><li>Prokaryotes: 1-10 micrometers</li><li>Eukaryotes: 10-100 micrometers</li></ul><h3>DNA Organization</h3><ul><li>Prokaryotes: Circular DNA in nucleoid</li><li>Eukaryotes: Linear DNA in nucleus</li></ul><h3>Reproduction</h3><ul><li>Prokaryotes: Binary fission</li><li>Eukaryotes: Mitosis and meiosis</li></ul><h3>Evolutionary Significance</h3><p>Eukaryotes likely evolved from prokaryotes through endosymbiosis, where one cell engulfed another.</p>',
        content_type: 'article',
        duration_minutes: 20,
        order_index: 3,
      },
    ],
  },
  // Track 5: Organelles and Their Functions
  {
    track_number: 5,
    lessons: [
      {
        title: 'The Nucleus',
        content: '<h2>Control Center of the Cell</h2><p>The nucleus is the most prominent organelle in eukaryotic cells:</p><h3>Structure</h3><ul><li><strong>Nuclear envelope:</strong> Double membrane with pores</li><li><strong>Chromatin:</strong> DNA and proteins</li><li><strong>Nucleolus:</strong> Site of ribosome assembly</li></ul><h3>Functions</h3><ul><li>Stores genetic information</li><li>Controls gene expression</li><li>Coordinates cellular activities</li><li>Site of DNA replication and transcription</li></ul><h3>Nuclear Pores</h3><p>Allow selective transport of molecules between nucleus and cytoplasm, regulating what enters and exits.</p>',
        content_type: 'article',
        duration_minutes: 25,
        order_index: 1,
      },
      {
        title: 'Energy-Producing Organelles',
        content: '<h2>Mitochondria and Chloroplasts</h2><p>These organelles are responsible for energy production:</p><h3>Mitochondria</h3><ul><li><strong>Function:</strong> Cellular respiration and ATP production</li><li><strong>Structure:</strong> Double membrane, inner folds (cristae)</li><li><strong>DNA:</strong> Has its own circular DNA</li><li><strong>Endosymbiotic theory:</strong> Evolved from ancient bacteria</li></ul><h3>Chloroplasts (Plants Only)</h3><ul><li><strong>Function:</strong> Photosynthesis</li><li><strong>Structure:</strong> Double membrane, thylakoids</li><li><strong>Pigments:</strong> Chlorophyll captures light energy</li><li><strong>Endosymbiotic theory:</strong> Also evolved from bacteria</li></ul>',
        content_type: 'article',
        duration_minutes: 30,
        order_index: 2,
      },
      {
        title: 'Protein Processing Organelles',
        content: '<h2>Endoplasmic Reticulum and Golgi Apparatus</h2><p>These organelles work together to process and transport proteins:</p><h3>Endoplasmic Reticulum (ER)</h3><ul><li><strong>Rough ER:</strong> Has ribosomes, synthesizes proteins</li><li><strong>Smooth ER:</strong> No ribosomes, synthesizes lipids</li><li><strong>Functions:</strong> Protein folding, lipid synthesis, detoxification</li></ul><h3>Golgi Apparatus</h3><ul><li><strong>Structure:</strong> Stack of flattened membranes</li><li><strong>Functions:</strong> Protein modification, packaging, sorting</li><li><strong>Vesicles:</strong> Transport materials to destinations</li></ul><h3>Protein Pathway</h3><p>Proteins move from ER → Golgi → vesicles → final destination (secretion or membrane insertion).</p>',
        content_type: 'article',
        duration_minutes: 25,
        order_index: 3,
      },
    ],
  },
  // Track 6: DNA Structure & Function
  {
    track_number: 6,
    lessons: [
      {
        title: 'DNA Structure',
        content: '<h2>The Double Helix</h2><p>DNA has a unique structure that enables it to store and transmit genetic information:</p><h3>Components</h3><ul><li><strong>Nucleotides:</strong> Building blocks of DNA</li><li><strong>Phosphate group:</strong> Forms the backbone</li><li><strong>Deoxyribose sugar:</strong> 5-carbon sugar</li><li><strong>Nitrogenous bases:</strong> A, T, G, C</li></ul><h3>Base Pairing Rules</h3><ul><li>Adenine (A) pairs with Thymine (T)</li><li>Guanine (G) pairs with Cytosine (C)</li><li>Hydrogen bonds hold base pairs together</li></ul><h3>Double Helix</h3><p>Two strands run in opposite directions (antiparallel) and twist around each other, creating the iconic double helix shape.</p>',
        content_type: 'article',
        duration_minutes: 30,
        order_index: 1,
      },
      {
        title: 'DNA Replication',
        content: '<h2>Copying Genetic Information</h2><p>DNA replication ensures each new cell gets a complete copy of genetic material:</p><h3>Process Overview</h3><ol><li><strong>Unwinding:</strong> Helicase separates the two strands</li><li><strong>Priming:</strong> RNA primers are added</li><li><strong>Elongation:</strong> DNA polymerase adds nucleotides</li><li><strong>Proofreading:</strong> Errors are corrected</li><li><strong>Ligation:</strong> Fragments are joined together</li></ol><h3>Semiconservative Replication</h3><p>Each new DNA molecule contains one original strand and one new strand, ensuring genetic continuity.</p>',
        content_type: 'article',
        duration_minutes: 35,
        order_index: 2,
      },
      {
        title: 'DNA Function and Gene Expression',
        content: '<h2>From Genes to Proteins</h2><p>DNA serves as the blueprint for all cellular activities:</p><h3>Gene Structure</h3><ul><li><strong>Promoter:</strong> Region where transcription begins</li><li><strong>Coding region:</strong> Contains the gene sequence</li><li><strong>Terminator:</strong> Region where transcription ends</li></ul><h3>Central Dogma</h3><p>DNA → RNA → Protein</p><ul><li><strong>Transcription:</strong> DNA is copied to RNA</li><li><strong>Translation:</strong> RNA is used to make proteins</li></ul><h3>Gene Regulation</h3><p>Not all genes are active at once. Cells regulate which genes are expressed based on needs and environmental conditions.</p>',
        content_type: 'article',
        duration_minutes: 25,
        order_index: 3,
      },
    ],
  },
  // Track 7: RNA, Transcription & Translation
  {
    track_number: 7,
    lessons: [
      {
        title: 'RNA Structure and Types',
        content: '<h2>RNA: The Messenger Molecule</h2><p>RNA plays crucial roles in protein synthesis and gene regulation:</p><h3>RNA vs DNA</h3><ul><li><strong>Ribose sugar:</strong> Instead of deoxyribose</li><li><strong>Uracil (U):</strong> Instead of thymine (T)</li><li><strong>Single-stranded:</strong> Usually not double helix</li><li><strong>Shorter:</strong> Typically much shorter than DNA</li></ul><h3>Types of RNA</h3><ul><li><strong>mRNA (messenger):</strong> Carries genetic code from DNA</li><li><strong>tRNA (transfer):</strong> Brings amino acids to ribosomes</li><li><strong>rRNA (ribosomal):</strong> Component of ribosomes</li><li><strong>miRNA (micro):</strong> Regulates gene expression</li></ul>',
        content_type: 'article',
        duration_minutes: 25,
        order_index: 1,
      },
      {
        title: 'Transcription Process',
        content: '<h2>From DNA to RNA</h2><p>Transcription is the first step in gene expression:</p><h3>Steps of Transcription</h3><ol><li><strong>Initiation:</strong> RNA polymerase binds to promoter</li><li><strong>Elongation:</strong> RNA polymerase adds nucleotides</li><li><strong>Termination:</strong> RNA polymerase reaches terminator</li></ol><h3>Key Players</h3><ul><li><strong>RNA Polymerase:</strong> Enzyme that synthesizes RNA</li><li><strong>Promoter:</strong> DNA sequence that starts transcription</li><li><strong>Template strand:</strong> DNA strand being copied</li><li><strong>Coding strand:</strong> DNA strand with same sequence as RNA</li></ul><h3>Processing</h3><p>In eukaryotes, pre-mRNA undergoes processing including capping, tailing, and splicing before leaving the nucleus.</p>',
        content_type: 'article',
        duration_minutes: 30,
        order_index: 2,
      },
      {
        title: 'Translation Process',
        content: '<h2>From RNA to Protein</h2><p>Translation converts the genetic code into functional proteins:</p><h3>Steps of Translation</h3><ol><li><strong>Initiation:</strong> Ribosome assembles on mRNA</li><li><strong>Elongation:</strong> Amino acids are added to growing chain</li><li><strong>Termination:</strong> Stop codon signals completion</li></ol><h3>Genetic Code</h3><ul><li><strong>Codons:</strong> 3-nucleotide sequences</li><li><strong>64 possible codons:</strong> 61 code for amino acids, 3 are stop codons</li><li><strong>Universal:</strong> Same code in almost all organisms</li><li><strong>Redundant:</strong> Multiple codons for most amino acids</li></ul><h3>Key Components</h3><ul><li><strong>Ribosomes:</strong> Protein synthesis machinery</li><li><strong>tRNA:</strong> Carries amino acids and recognizes codons</li><li><strong>mRNA:</strong> Template for protein sequence</li></ul>',
        content_type: 'article',
        duration_minutes: 35,
        order_index: 3,
      },
    ],
  },
  // Track 8: Proteins & Enzymes
  {
    track_number: 8,
    lessons: [
      {
        title: 'Protein Structure',
        content: '<h2>Building Blocks of Life</h2><p>Proteins are complex molecules with multiple levels of structure:</p><h3>Primary Structure</h3><ul><li>Linear sequence of amino acids</li><li>Determined by DNA sequence</li><li>Peptide bonds connect amino acids</li></ul><h3>Secondary Structure</h3><ul><li><strong>Alpha helix:</strong> Spiral structure</li><li><strong>Beta sheet:</strong> Pleated structure</li><li>Stabilized by hydrogen bonds</li></ul><h3>Tertiary Structure</h3><ul><li>3D folding of the protein</li><li>Determines function</li><li>Stabilized by various bonds</li></ul><h3>Quaternary Structure</h3><ul><li>Multiple protein subunits</li><li>Not all proteins have this level</li></ul>',
        content_type: 'article',
        duration_minutes: 30,
        order_index: 1,
      },
      {
        title: 'Enzyme Function',
        content: '<h2>Biological Catalysts</h2><p>Enzymes are proteins that speed up chemical reactions:</p><h3>How Enzymes Work</h3><ul><li><strong>Active site:</strong> Where substrate binds</li><li><strong>Lock and key model:</strong> Perfect fit between enzyme and substrate</li><li><strong>Induced fit model:</strong> Enzyme changes shape when substrate binds</li><li><strong>Lower activation energy:</strong> Make reactions happen faster</li></ul><h3>Enzyme Properties</h3><ul><li><strong>Specificity:</strong> Each enzyme works on specific substrates</li><li><strong>Reusability:</strong> Not consumed in reactions</li><li><strong>Regulation:</strong> Activity can be controlled</li><li><strong>Optimal conditions:</strong> Work best at specific pH and temperature</li></ul>',
        content_type: 'article',
        duration_minutes: 25,
        order_index: 2,
      },
      {
        title: 'Enzyme Regulation',
        content: '<h2>Controlling Enzyme Activity</h2><p>Cells regulate enzyme activity to control metabolic processes:</p><h3>Types of Regulation</h3><ul><li><strong>Allosteric regulation:</strong> Molecules bind to sites other than active site</li><li><strong>Competitive inhibition:</strong> Inhibitor competes with substrate</li><li><strong>Non-competitive inhibition:</strong> Inhibitor binds elsewhere, changes enzyme shape</li><li><strong>Feedback inhibition:</strong> End product inhibits earlier enzyme</li></ul><h3>Environmental Factors</h3><ul><li><strong>Temperature:</strong> Higher temperature increases activity (up to a point)</li><li><strong>pH:</strong> Each enzyme has optimal pH</li><li><strong>Concentration:</strong> More enzyme = more activity</li></ul><h3>Clinical Applications</h3><p>Understanding enzyme regulation helps develop drugs and treat diseases.</p>',
        content_type: 'article',
        duration_minutes: 25,
        order_index: 3,
      },
    ],
  },
  // Track 9: Membranes & Transport Mechanisms
  {
    track_number: 9,
    lessons: [
      {
        title: 'Cell Membrane Structure',
        content: '<h2>The Fluid Mosaic Model</h2><p>The cell membrane is a dynamic, complex structure:</p><h3>Components</h3><ul><li><strong>Phospholipid bilayer:</strong> Two layers of phospholipids</li><li><strong>Proteins:</strong> Embedded in or attached to membrane</li><li><strong>Cholesterol:</strong> Maintains membrane fluidity</li><li><strong>Carbohydrates:</strong> Cell recognition and signaling</li></ul><h3>Phospholipid Structure</h3><ul><li><strong>Hydrophilic head:</strong> Attracted to water</li><li><strong>Hydrophobic tail:</strong> Repels water</li><li><strong>Bilayer formation:</strong> Tails face inward, heads face outward</li></ul><h3>Membrane Fluidity</h3><p>The membrane is not rigid but fluid, allowing proteins to move and the membrane to change shape.</p>',
        content_type: 'article',
        duration_minutes: 25,
        order_index: 1,
      },
      {
        title: 'Passive Transport',
        content: '<h2>Movement Without Energy</h2><p>Passive transport moves molecules down their concentration gradient:</p><h3>Simple Diffusion</h3><ul><li>Molecules move from high to low concentration</li><li>No energy required</li><li>Small, nonpolar molecules (O₂, CO₂)</li></ul><h3>Facilitated Diffusion</h3><ul><li>Uses transport proteins</li><li>Still no energy required</li><li>Larger molecules or charged ions</li><li>Channel proteins and carrier proteins</li></ul><h3>Osmosis</h3><ul><li>Movement of water across membrane</li><li>From low solute to high solute concentration</li><li>Important for cell volume regulation</li></ul>',
        content_type: 'article',
        duration_minutes: 30,
        order_index: 2,
      },
      {
        title: 'Active Transport',
        content: '<h2>Movement Against the Gradient</h2><p>Active transport requires energy to move molecules against their concentration gradient:</p><h3>Primary Active Transport</h3><ul><li>Uses ATP directly</li><li>Example: Sodium-potassium pump</li><li>Maintains concentration gradients</li></ul><h3>Secondary Active Transport</h3><ul><li>Uses energy from concentration gradient</li><li>Symport: Two molecules move same direction</li><li>Antiport: Two molecules move opposite directions</li></ul><h3>Bulk Transport</h3><ul><li><strong>Endocytosis:</strong> Cell takes in large particles</li><li><strong>Exocytosis:</strong> Cell releases large particles</li><li>Uses vesicles</li></ul>',
        content_type: 'article',
        duration_minutes: 25,
        order_index: 3,
      },
    ],
  },
  // Track 10: Energy in Cells
  {
    track_number: 10,
    lessons: [
      {
        title: 'ATP: The Energy Currency',
        content: '<h2>Adenosine Triphosphate</h2><p>ATP is the primary energy carrier in cells:</p><h3>ATP Structure</h3><ul><li><strong>Adenosine:</strong> Adenine + ribose sugar</li><li><strong>Three phosphate groups:</strong> High-energy bonds</li><li><strong>Energy release:</strong> When phosphate bonds break</li></ul><h3>ATP Cycle</h3><ul><li><strong>ATP hydrolysis:</strong> ATP → ADP + Pi + energy</li><li><strong>ATP synthesis:</strong> ADP + Pi + energy → ATP</li><li><strong>Continuous cycle:</strong> Energy is constantly recycled</li></ul><h3>Energy Uses</h3><ul><li>Muscle contraction</li><li>Active transport</li><li>Protein synthesis</li><li>Nerve impulses</li></ul>',
        content_type: 'article',
        duration_minutes: 25,
        order_index: 1,
      },
      {
        title: 'Cellular Respiration',
        content: '<h2>Breaking Down Glucose for Energy</h2><p>Cellular respiration converts glucose into ATP:</p><h3>Three Stages</h3><ol><li><strong>Glycolysis:</strong> Glucose → 2 pyruvate (cytoplasm)</li><li><strong>Krebs Cycle:</strong> Pyruvate → CO₂ + energy carriers (mitochondria)</li><li><strong>Electron Transport Chain:</strong> Energy carriers → ATP (mitochondria)</li></ol><h3>Energy Yield</h3><ul><li><strong>Glycolysis:</strong> 2 ATP + 2 NADH</li><li><strong>Krebs Cycle:</strong> 2 ATP + 6 NADH + 2 FADH₂</li><li><strong>ETC:</strong> ~28 ATP</li><li><strong>Total:</strong> ~32 ATP per glucose</li></ul><h3>Aerobic vs Anaerobic</h3><p>With oxygen: complete breakdown. Without oxygen: fermentation (less efficient).</p>',
        content_type: 'article',
        duration_minutes: 35,
        order_index: 2,
      },
      {
        title: 'Photosynthesis',
        content: '<h2>Capturing Light Energy</h2><p>Photosynthesis converts light energy into chemical energy:</p><h3>Two Stages</h3><ol><li><strong>Light reactions:</strong> Light → ATP + NADPH (thylakoids)</li><li><strong>Calvin cycle:</strong> CO₂ + ATP + NADPH → glucose (stroma)</li></ol><h3>Light Reactions</h3><ul><li><strong>Photosystem II:</strong> Splits water, releases oxygen</li><li><strong>Photosystem I:</strong> Produces NADPH</li><li><strong>Electron transport:</strong> Generates ATP</li></ul><h3>Calvin Cycle</h3><ul><li><strong>Carbon fixation:</strong> CO₂ + RuBP</li><li><strong>Reduction:</strong> Uses ATP and NADPH</li><li><strong>Regeneration:</strong> RuBP is reformed</li></ul><h3>Overall Equation</h3><p>6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂</p>',
        content_type: 'article',
        duration_minutes: 30,
        order_index: 3,
      },
    ],
  },
];

export const quizQuestionsData = [
  // Track 1, Lesson 1: Characteristics of Life
  {
    track_number: 1,
    lesson_index: 1,
    questions: [
      {
        question_text: 'Which of the following is NOT a characteristic of life?',
        options: [
          { id: 'a', text: 'Ability to reproduce' },
          { id: 'b', text: 'Response to stimuli' },
          { id: 'c', text: 'Ability to fly' },
          { id: 'd', text: 'Maintenance of homeostasis' },
        ],
        correct_answer: 'c',
        explanation: 'While some organisms can fly, it is not a universal characteristic of life. All living things must reproduce, respond to stimuli, and maintain homeostasis.',
        order_index: 1,
      },
      {
        question_text: 'What is the most basic unit of life?',
        options: [
          { id: 'a', text: 'Atom' },
          { id: 'b', text: 'Cell' },
          { id: 'c', text: 'Tissue' },
          { id: 'd', text: 'Organ' },
        ],
        correct_answer: 'b',
        explanation: 'The cell is considered the most basic unit of life. While atoms and molecules make up cells, cells are the smallest structures that can carry out all life processes.',
        order_index: 2,
      },
      {
        question_text: 'Which process allows organisms to maintain stable internal conditions?',
        options: [
          { id: 'a', text: 'Evolution' },
          { id: 'b', text: 'Reproduction' },
          { id: 'c', text: 'Homeostasis' },
          { id: 'd', text: 'Growth' },
        ],
        correct_answer: 'c',
        explanation: 'Homeostasis is the ability to maintain stable internal conditions despite changes in the external environment.',
        order_index: 3,
      },
    ],
  },
  // Track 1, Lesson 2: The Scientific Method
  {
    track_number: 1,
    lesson_index: 2,
    questions: [
      {
        question_text: 'What is the first step in the scientific method?',
        options: [
          { id: 'a', text: 'Form a hypothesis' },
          { id: 'b', text: 'Make observations' },
          { id: 'c', text: 'Design an experiment' },
          { id: 'd', text: 'Analyze data' },
        ],
        correct_answer: 'b',
        explanation: 'The scientific method begins with careful observation of phenomena in nature.',
        order_index: 1,
      },
      {
        question_text: 'A testable explanation for a phenomenon is called a:',
        options: [
          { id: 'a', text: 'Theory' },
          { id: 'b', text: 'Hypothesis' },
          { id: 'c', text: 'Law' },
          { id: 'd', text: 'Fact' },
        ],
        correct_answer: 'b',
        explanation: 'A hypothesis is a testable explanation for a phenomenon that can be tested through experimentation.',
        order_index: 2,
      },
    ],
  },
  // Track 2, Lesson 1: The Cell Theory
  {
    track_number: 2,
    lesson_index: 1,
    questions: [
      {
        question_text: 'Who first observed and named cells?',
        options: [
          { id: 'a', text: 'Anton van Leeuwenhoek' },
          { id: 'b', text: 'Robert Hooke' },
          { id: 'c', text: 'Matthias Schleiden' },
          { id: 'd', text: 'Rudolf Virchow' },
        ],
        correct_answer: 'b',
        explanation: 'Robert Hooke first observed and named cells in 1665 while examining cork under a microscope.',
        order_index: 1,
      },
      {
        question_text: 'According to cell theory, where do all cells come from?',
        options: [
          { id: 'a', text: 'Spontaneous generation' },
          { id: 'b', text: 'Pre-existing cells' },
          { id: 'c', text: 'Non-living matter' },
          { id: 'd', text: 'DNA molecules' },
        ],
        correct_answer: 'b',
        explanation: 'One of the three main tenets of cell theory states that all cells arise from pre-existing cells.',
        order_index: 2,
      },
      {
        question_text: 'Which scientist proposed that all plants are made of cells?',
        options: [
          { id: 'a', text: 'Robert Hooke' },
          { id: 'b', text: 'Matthias Schleiden' },
          { id: 'c', text: 'Theodor Schwann' },
          { id: 'd', text: 'Rudolf Virchow' },
        ],
        correct_answer: 'b',
        explanation: 'Matthias Schleiden proposed in 1838 that all plants are made of cells.',
        order_index: 3,
      },
    ],
  },
  // Track 2, Lesson 2: Types of Cells
  {
    track_number: 2,
    lesson_index: 2,
    questions: [
      {
        question_text: 'Which type of cell lacks a membrane-bound nucleus?',
        options: [
          { id: 'a', text: 'Eukaryotic' },
          { id: 'b', text: 'Prokaryotic' },
          { id: 'c', text: 'Plant' },
          { id: 'd', text: 'Animal' },
        ],
        correct_answer: 'b',
        explanation: 'Prokaryotic cells lack a membrane-bound nucleus, while eukaryotic cells have one.',
        order_index: 1,
      },
      {
        question_text: 'Which of the following is NOT a characteristic of prokaryotic cells?',
        options: [
          { id: 'a', text: 'Have a cell wall' },
          { id: 'b', text: 'Lack membrane-bound organelles' },
          { id: 'c', text: 'Have a nucleus' },
          { id: 'd', text: 'Are generally smaller' },
        ],
        correct_answer: 'c',
        explanation: 'Prokaryotic cells do not have a nucleus; their DNA is located in a nucleoid region.',
        order_index: 2,
      },
    ],
  },
  // Track 3, Lesson 1: Types of Microscopes
  {
    track_number: 3,
    lesson_index: 1,
    questions: [
      {
        question_text: 'Which type of microscope can magnify up to 1,000,000x?',
        options: [
          { id: 'a', text: 'Light microscope' },
          { id: 'b', text: 'Electron microscope' },
          { id: 'c', text: 'Confocal microscope' },
          { id: 'd', text: 'Compound microscope' },
        ],
        correct_answer: 'b',
        explanation: 'Electron microscopes use electron beams instead of light and can achieve much higher magnification than light microscopes.',
        order_index: 1,
      },
      {
        question_text: 'Which microscope is best for observing living cells?',
        options: [
          { id: 'a', text: 'Electron microscope' },
          { id: 'b', text: 'Light microscope' },
          { id: 'c', text: 'Scanning electron microscope' },
          { id: 'd', text: 'Transmission electron microscope' },
        ],
        correct_answer: 'b',
        explanation: 'Light microscopes are best for observing living cells because they don\'t require the specimen to be dead or heavily processed.',
        order_index: 2,
      },
    ],
  },
  // Track 4, Lesson 1: Prokaryotic Cell Structure
  {
    track_number: 4,
    lesson_index: 1,
    questions: [
      {
        question_text: 'Where is DNA located in prokaryotic cells?',
        options: [
          { id: 'a', text: 'In the nucleus' },
          { id: 'b', text: 'In the nucleoid region' },
          { id: 'c', text: 'In the cytoplasm' },
          { id: 'd', text: 'In the cell wall' },
        ],
        correct_answer: 'b',
        explanation: 'In prokaryotic cells, DNA is located in the nucleoid region, not in a membrane-bound nucleus.',
        order_index: 1,
      },
      {
        question_text: 'Which structures are used for movement in prokaryotic cells?',
        options: [
          { id: 'a', text: 'Cilia' },
          { id: 'b', text: 'Flagella' },
          { id: 'c', text: 'Pseudopodia' },
          { id: 'd', text: 'Microvilli' },
        ],
        correct_answer: 'b',
        explanation: 'Prokaryotic cells use flagella for movement, which are different from eukaryotic flagella in structure.',
        order_index: 2,
      },
    ],
  },
  // Track 5, Lesson 1: The Nucleus
  {
    track_number: 5,
    lesson_index: 1,
    questions: [
      {
        question_text: 'What is the function of the nucleolus?',
        options: [
          { id: 'a', text: 'DNA replication' },
          { id: 'b', text: 'Ribosome assembly' },
          { id: 'c', text: 'Protein synthesis' },
          { id: 'd', text: 'Energy production' },
        ],
        correct_answer: 'b',
        explanation: 'The nucleolus is the site where ribosomal RNA is synthesized and ribosomes are assembled.',
        order_index: 1,
      },
      {
        question_text: 'What allows selective transport between the nucleus and cytoplasm?',
        options: [
          { id: 'a', text: 'Nuclear pores' },
          { id: 'b', text: 'Nuclear envelope' },
          { id: 'c', text: 'Chromatin' },
          { id: 'd', text: 'Nucleolus' },
        ],
        correct_answer: 'a',
        explanation: 'Nuclear pores in the nuclear envelope allow selective transport of molecules between the nucleus and cytoplasm.',
        order_index: 2,
      },
    ],
  },
  // Track 6, Lesson 1: DNA Structure
  {
    track_number: 6,
    lesson_index: 1,
    questions: [
      {
        question_text: 'Which base pairs with adenine in DNA?',
        options: [
          { id: 'a', text: 'Guanine' },
          { id: 'b', text: 'Cytosine' },
          { id: 'c', text: 'Thymine' },
          { id: 'd', text: 'Uracil' },
        ],
        correct_answer: 'c',
        explanation: 'In DNA, adenine pairs with thymine through two hydrogen bonds.',
        order_index: 1,
      },
      {
        question_text: 'What type of bonds hold the two DNA strands together?',
        options: [
          { id: 'a', text: 'Covalent bonds' },
          { id: 'b', text: 'Ionic bonds' },
          { id: 'c', text: 'Hydrogen bonds' },
          { id: 'd', text: 'Peptide bonds' },
        ],
        correct_answer: 'c',
        explanation: 'Hydrogen bonds between complementary base pairs hold the two DNA strands together in the double helix.',
        order_index: 2,
      },
    ],
  },
  // Track 7, Lesson 1: RNA Structure and Types
  {
    track_number: 7,
    lesson_index: 1,
    questions: [
      {
        question_text: 'Which base is found in RNA but not in DNA?',
        options: [
          { id: 'a', text: 'Adenine' },
          { id: 'b', text: 'Guanine' },
          { id: 'c', text: 'Cytosine' },
          { id: 'd', text: 'Uracil' },
        ],
        correct_answer: 'd',
        explanation: 'RNA contains uracil (U) instead of thymine (T), which is found in DNA.',
        order_index: 1,
      },
      {
        question_text: 'Which type of RNA carries the genetic code from DNA to ribosomes?',
        options: [
          { id: 'a', text: 'tRNA' },
          { id: 'b', text: 'rRNA' },
          { id: 'c', text: 'mRNA' },
          { id: 'd', text: 'miRNA' },
        ],
        correct_answer: 'c',
        explanation: 'Messenger RNA (mRNA) carries the genetic code from DNA to ribosomes for protein synthesis.',
        order_index: 2,
      },
    ],
  },
  // Track 8, Lesson 1: Protein Structure
  {
    track_number: 8,
    lesson_index: 1,
    questions: [
      {
        question_text: 'What determines the primary structure of a protein?',
        options: [
          { id: 'a', text: 'The DNA sequence' },
          { id: 'b', text: 'The RNA sequence' },
          { id: 'c', text: 'The amino acid sequence' },
          { id: 'd', text: 'The protein folding' },
        ],
        correct_answer: 'c',
        explanation: 'The primary structure of a protein is determined by the linear sequence of amino acids.',
        order_index: 1,
      },
      {
        question_text: 'Which level of protein structure involves hydrogen bonds?',
        options: [
          { id: 'a', text: 'Primary' },
          { id: 'b', text: 'Secondary' },
          { id: 'c', text: 'Tertiary' },
          { id: 'd', text: 'Quaternary' },
        ],
        correct_answer: 'b',
        explanation: 'Secondary structure (alpha helices and beta sheets) is stabilized by hydrogen bonds between amino acids.',
        order_index: 2,
      },
    ],
  },
  // Track 9, Lesson 1: Cell Membrane Structure
  {
    track_number: 9,
    lesson_index: 1,
    questions: [
      {
        question_text: 'What is the main component of the cell membrane?',
        options: [
          { id: 'a', text: 'Proteins' },
          { id: 'b', text: 'Phospholipid bilayer' },
          { id: 'c', text: 'Cholesterol' },
          { id: 'd', text: 'Carbohydrates' },
        ],
        correct_answer: 'b',
        explanation: 'The phospholipid bilayer is the main structural component of the cell membrane.',
        order_index: 1,
      },
      {
        question_text: 'Which part of a phospholipid is hydrophilic?',
        options: [
          { id: 'a', text: 'The head' },
          { id: 'b', text: 'The tail' },
          { id: 'c', text: 'Both head and tail' },
          { id: 'd', text: 'Neither head nor tail' },
        ],
        correct_answer: 'a',
        explanation: 'The hydrophilic head of a phospholipid is attracted to water, while the hydrophobic tail repels water.',
        order_index: 2,
      },
    ],
  },
  // Track 10, Lesson 1: ATP: The Energy Currency
  {
    track_number: 10,
    lesson_index: 1,
    questions: [
      {
        question_text: 'What does ATP stand for?',
        options: [
          { id: 'a', text: 'Adenosine Triphosphate' },
          { id: 'b', text: 'Adenine Triphosphate' },
          { id: 'c', text: 'Adenosine Triphosphate' },
          { id: 'd', text: 'Adenine Triphosphate' },
        ],
        correct_answer: 'a',
        explanation: 'ATP stands for Adenosine Triphosphate, which is the primary energy currency of cells.',
        order_index: 1,
      },
      {
        question_text: 'How many phosphate groups does ATP have?',
        options: [
          { id: 'a', text: 'One' },
          { id: 'b', text: 'Two' },
          { id: 'c', text: 'Three' },
          { id: 'd', text: 'Four' },
        ],
        correct_answer: 'c',
        explanation: 'ATP has three phosphate groups, and energy is released when one phosphate group is removed.',
        order_index: 2,
      },
    ],
  },
];
