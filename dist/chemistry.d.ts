/**
 * Peptide chemistry constants and pure functions: residue masses, net charge,
 * isoelectric point, hydropathy, extinction coefficients, counterion content,
 * MS/MS fragment ions and buffer composition.
 *
 * Maintained by Volta Peptides (https://voltapeptides.com/catalog). Sources are
 * named per table. Values are reproduced from published reference data, not
 * fitted or estimated, except where a function name says "estimate".
 */
/** The twenty proteinogenic amino acids, single-letter codes. */
export declare const STANDARD_RESIDUES: "ACDEFGHIKLMNPQRSTVWY";
/**
 * Average (chemical) residue masses in daltons: the free amino acid minus one
 * water. Add `WATER_AVERAGE` once for the free N- and C-termini of a chain.
 * Source: IUPAC 2021 standard atomic weights, as tabulated by ExPASy.
 */
export declare const RESIDUE_MASS_AVERAGE: Record<string, number>;
/**
 * Monoisotopic residue masses in daltons, for mass spectrometry. These use the
 * mass of the most abundant isotope of each element rather than the isotope
 * average, which is what a high-resolution instrument actually reports.
 */
export declare const RESIDUE_MASS_MONOISOTOPIC: Record<string, number>;
export declare const WATER_AVERAGE = 18.0153;
export declare const WATER_MONOISOTOPIC = 18.010565;
/** Mass of a proton (hydrogen atom less one electron), for m/z arithmetic. */
export declare const PROTON_MASS = 1.007276;
/** Two hydrogens leave when a cystine bridge forms. */
export declare const DISULFIDE_MASS_LOSS = 2.01565;
/** Free amino acid reference data, for composition read-outs. */
export interface AminoAcidInfo {
    code: string;
    three: string;
    name: string;
    /** Free amino acid average molecular weight, daltons. */
    freeMass: number;
    /** Side-chain class used for the composition grouping. */
    group: "nonpolar" | "polar" | "positive" | "negative" | "aromatic";
    /** Number of carbon atoms in the residue (chain form). */
    carbons: number;
    /** Number of nitrogen atoms in the residue (chain form). */
    nitrogens: number;
}
export declare const AMINO_ACIDS: Record<string, AminoAcidInfo>;
/**
 * Side-chain and terminal pKa values (EMBOSS / Lehninger set).
 *
 * Several published sets exist and they disagree by up to a pH unit on the
 * termini, which moves a calculated pI by a few tenths. This module uses one set
 * throughout, so the same sequence always gets the same isoelectric point, and
 * the result should be read as an estimate.
 */
export declare const PKA: {
    readonly nTerminus: 9.69;
    readonly cTerminus: 2.34;
    readonly D: 3.65;
    readonly E: 4.25;
    readonly C: 8.18;
    readonly Y: 10.07;
    readonly H: 6;
    readonly K: 10.53;
    readonly R: 12.48;
};
/** Kyte & Doolittle (1982) hydropathy index. */
export declare const HYDROPATHY_KYTE_DOOLITTLE: Record<string, number>;
/** Hopp & Woods (1981) hydrophilicity scale. Higher is more hydrophilic. */
export declare const HYDROPATHY_HOPP_WOODS: Record<string, number>;
/** Eisenberg consensus normalised hydrophobicity scale (1984). */
export declare const HYDROPATHY_EISENBERG: Record<string, number>;
/** Molar absorptivity contributions at 280 nm, Pace et al. (1995). */
export declare const EXTINCTION_TRP = 5500;
export declare const EXTINCTION_TYR = 1490;
export declare const EXTINCTION_CYSTINE = 125;
/** Keep only the twenty standard single-letter codes, upper-cased. */
export declare function cleanSequence(input: string): string;
/** Characters that were dropped by `cleanSequence`, de-duplicated, in order. */
export declare function invalidResidues(input: string): string[];
export declare function countResidue(sequence: string, residue: string): number;
/**
 * Average molecular weight of the linear, unmodified peptide with a free
 * N-terminal amine and a free C-terminal acid.
 *
 * A published catalogue weight often differs from this by a small, explainable
 * amount: an amidated C-terminus is 0.98 Da lighter, an acetylated N-terminus is
 * 42.01 Da heavier, and every disulfide bridge removes 2.02 Da.
 */
export declare function averageMolecularWeight(sequence: string): number;
/** Monoisotopic mass of the linear, unmodified peptide. */
export declare function monoisotopicMass(sequence: string): number;
/** Amino acid counts, keyed by single-letter code. */
export declare function composition(sequence: string): Record<string, number>;
/**
 * Net charge at a given pH from the Henderson-Hasselbalch equation, treating
 * every ionisable group as independent.
 *
 * Real charge deviates from this because neighbouring groups shift each other's
 * pKa, which is why the result is an estimate.
 */
export declare function netCharge(sequence: string, pH: number): number;
/** pH at which `netCharge` crosses zero, found by bisection over pH 0-14. */
export declare function isoelectricPoint(sequence: string): number;
/** Grand average of hydropathy: the mean Kyte-Doolittle value per residue. */
export declare function gravy(sequence: string): number;
/**
 * Aliphatic index (Ikai 1980): the relative volume occupied by aliphatic side
 * chains, and a documented correlate of thermostability.
 */
export declare function aliphaticIndex(sequence: string): number;
export interface ExtinctionResult {
    /** Molar extinction coefficient at 280 nm, M⁻¹cm⁻¹. */
    extinction: number;
    /** Absorbance of a 1 mg/mL solution in a 1 cm cell. */
    absorptivity: number;
    trp: number;
    tyr: number;
    cys: number;
    cystines: number;
}
/**
 * Molar extinction coefficient at 280 nm by the Pace method.
 *
 * `cystines` is the number of disulfide bridges. Passing 0 gives the reduced
 * (denatured) value, which is what a sample in DTT or TCEP actually reads.
 */
export declare function extinctionCoefficient(sequence: string, cystines?: number): ExtinctionResult;
/**
 * Beer-Lambert concentration from an absorbance reading.
 *
 * Returns molar and mass concentration. A molar concentration multiplied by a
 * molecular weight in g/mol is already g/L, and g/L and mg/mL are the same
 * number, so no further factor of 1000 is applied.
 */
export declare function beerLambertConcentration(params: {
    absorbance: number;
    extinction: number;
    pathLengthCm: number;
    molecularWeight: number;
    dilutionFactor?: number;
}): {
    molar: number;
    mgPerMl: number;
} | null;
/** A counterion that a peptide is commonly supplied as a salt of. */
export interface CounterionInfo {
    id: string;
    name: string;
    /** Short label for the acid or anion added per basic site. */
    formula: string;
    /**
     * Mass added to the free-base peptide per counterion, daltons.
     *
     * The convention here is "free base plus free acid", the way a certificate of
     * analysis states it: acetate salts add acetic acid (60.05), TFA salts add
     * trifluoroacetic acid (114.02). Every entry below uses that one
     * convention.
     */
    mass: number;
    /** Typical peptide-content range seen on certificates, as percentages. */
    typicalContent: [number, number];
    description: string;
}
export declare const COUNTERIONS: CounterionInfo[];
export declare function getCounterion(id: string): CounterionInfo;
/**
 * Fraction of a salt's mass that is peptide, from molecular weights.
 *
 * This is the number a certificate calls "peptide content" when it is derived
 * from the salt stoichiometry rather than measured by amino acid analysis.
 */
export declare function peptideContentFraction(freeBaseMw: number, counterion: CounterionInfo, counterionCount?: number): number;
/**
 * Net peptide in a labelled mass, after purity, salt and water.
 *
 * Each factor removes a different part of the powder, so they multiply. A
 * certificate that already reports "net peptide content" by amino acid analysis
 * has folded the salt and the water in already: applying them again here would
 * double-count, so check which figure the certificate reports first.
 */
export declare function netPeptideMass(params: {
    labelledMass: number;
    purityPercent: number;
    peptideContentFraction: number;
    waterPercent?: number;
}): number;
/** Singly- or multiply-protonated m/z from a neutral monoisotopic mass. */
export declare function mzFromMass(neutralMass: number, charge: number): number;
export interface FragmentIons {
    residues: string[];
    /** Neutral b-ion masses, b1 first. */
    b: number[];
    /** Neutral y-ion masses, y1 first. */
    y: number[];
    /** Neutral monoisotopic mass of the intact peptide. */
    precursor: number;
}
/**
 * b- and y-ion series for a CID/HCD fragmentation table.
 *
 * b ions keep the N-terminus and carry no extra water; y ions keep the
 * C-terminus and do. Both are returned as neutral masses so the caller decides
 * the charge state.
 */
export declare function fragmentIons(sequence: string, options?: {
    oxidisedMet?: boolean;
}): FragmentIons | null;
/** Common mass shifts seen when an observed mass misses the expected one. */
export declare const MASS_MODIFICATIONS: readonly [{
    readonly name: "Oxidation (Met, Trp)";
    readonly delta: 15.9949;
    readonly description: "One oxygen added; methionine sulfoxide is the usual culprit.";
}, {
    readonly name: "Di-oxidation";
    readonly delta: 31.9898;
    readonly description: "Two oxygens, e.g. methionine sulfone or dioxidised tryptophan.";
}, {
    readonly name: "Deamidation (Asn, Gln)";
    readonly delta: 0.984;
    readonly description: "Amide hydrolysed to a carboxylic acid; adds one mass unit.";
}, {
    readonly name: "Phosphorylation";
    readonly delta: 79.9663;
    readonly description: "Phosphate on Ser, Thr or Tyr.";
}, {
    readonly name: "Acetylation";
    readonly delta: 42.0106;
    readonly description: "N-terminal or lysine acetyl group.";
}, {
    readonly name: "Methylation";
    readonly delta: 14.0157;
    readonly description: "One methyl group.";
}, {
    readonly name: "Amidation (C-terminus)";
    readonly delta: -0.984;
    readonly description: "C-terminal acid replaced by an amide; most GH-secretagogue peptides are amidated.";
}, {
    readonly name: "Disulfide bond formation";
    readonly delta: -2.0157;
    readonly description: "Two hydrogens lost as a cystine bridge closes.";
}, {
    readonly name: "Sodium adduct (+Na −H)";
    readonly delta: 21.9819;
    readonly description: "Sodium replacing a proton, not a covalent change.";
}, {
    readonly name: "Potassium adduct (+K −H)";
    readonly delta: 37.9559;
    readonly description: "Potassium replacing a proton.";
}, {
    readonly name: "Water loss";
    readonly delta: -18.0106;
    readonly description: "Dehydration, often from cyclisation or succinimide formation.";
}, {
    readonly name: "Ammonia loss";
    readonly delta: -17.0265;
    readonly description: "Loss of NH₃, common from N-terminal Gln forming pyroglutamate.";
}, {
    readonly name: "Formylation";
    readonly delta: 27.9949;
    readonly description: "Formyl group, sometimes from residual formic acid.";
}, {
    readonly name: "Carbamidomethylation";
    readonly delta: 57.0215;
    readonly description: "Cysteine alkylated by iodoacetamide during sample prep.";
}, {
    readonly name: "Trifluoroacetate adduct";
    readonly delta: 113.9929;
    readonly description: "Residual TFA from purification riding along.";
}];
/**
 * Modifications whose signed mass shift explains an observed-minus-expected
 * difference.
 *
 * Signed on purpose: a peptide 16 Da lighter than expected is not oxidised.
 */
export declare function explainMassDifference(differenceDa: number, toleranceDa?: number): {
    name: string;
    delta: number;
    description: string;
}[];
/**
 * Radius of gyration of a compact globular chain, in ångström.
 *
 * From the empirical fit R ≈ 0.66·M^(1/3) with M in daltons.
 */
export declare function globularDiameterAngstrom(residues: number): number;
/** Contour length of a fully extended chain, ~3.5 Å per residue. */
export declare function extendedLengthAngstrom(residues: number): number;
/**
 * Henderson-Hasselbalch split of a buffer between its acid and base forms.
 *
 * `capacity` is the Van Slyke buffer capacity in millimoles per litre per pH
 * unit, which peaks at the pKa and falls away either side of it.
 */
export declare function bufferComposition(targetPh: number, pKa: number, totalConcentrationMm: number): {
    baseMm: number;
    acidMm: number;
    ratio: number;
    capacity: number;
};
