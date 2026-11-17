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
export const STANDARD_RESIDUES = "ACDEFGHIKLMNPQRSTVWY";
/**
 * Average (chemical) residue masses in daltons: the free amino acid minus one
 * water. Add `WATER_AVERAGE` once for the free N- and C-termini of a chain.
 * Source: IUPAC 2021 standard atomic weights, as tabulated by ExPASy.
 */
export const RESIDUE_MASS_AVERAGE = {
    G: 57.0519,
    A: 71.0788,
    S: 87.0782,
    P: 97.1167,
    V: 99.1326,
    T: 101.1051,
    C: 103.1388,
    L: 113.1594,
    I: 113.1594,
    N: 114.1038,
    D: 115.0886,
    Q: 128.1307,
    K: 128.1741,
    E: 129.1155,
    M: 131.1926,
    H: 137.1411,
    F: 147.1766,
    R: 156.1875,
    Y: 163.176,
    W: 186.2132,
};
/**
 * Monoisotopic residue masses in daltons, for mass spectrometry. These use the
 * mass of the most abundant isotope of each element rather than the isotope
 * average, which is what a high-resolution instrument actually reports.
 */
export const RESIDUE_MASS_MONOISOTOPIC = {
    G: 57.02146,
    A: 71.03711,
    S: 87.03203,
    P: 97.05276,
    V: 99.06841,
    T: 101.04768,
    C: 103.00919,
    L: 113.08406,
    I: 113.08406,
    N: 114.04293,
    D: 115.02694,
    Q: 128.05858,
    K: 128.09496,
    E: 129.04259,
    M: 131.04049,
    H: 137.05891,
    F: 147.06841,
    R: 156.10111,
    Y: 163.06333,
    W: 186.07931,
};
export const WATER_AVERAGE = 18.0153;
export const WATER_MONOISOTOPIC = 18.010565;
/** Mass of a proton (hydrogen atom less one electron), for m/z arithmetic. */
export const PROTON_MASS = 1.007276;
/** Two hydrogens leave when a cystine bridge forms. */
export const DISULFIDE_MASS_LOSS = 2.01565;
export const AMINO_ACIDS = {
    A: { code: "A", three: "Ala", name: "Alanine", freeMass: 89.09, group: "nonpolar", carbons: 3, nitrogens: 1 },
    R: { code: "R", three: "Arg", name: "Arginine", freeMass: 174.2, group: "positive", carbons: 6, nitrogens: 4 },
    N: { code: "N", three: "Asn", name: "Asparagine", freeMass: 132.12, group: "polar", carbons: 4, nitrogens: 2 },
    D: { code: "D", three: "Asp", name: "Aspartic acid", freeMass: 133.1, group: "negative", carbons: 4, nitrogens: 1 },
    C: { code: "C", three: "Cys", name: "Cysteine", freeMass: 121.16, group: "polar", carbons: 3, nitrogens: 1 },
    E: { code: "E", three: "Glu", name: "Glutamic acid", freeMass: 147.13, group: "negative", carbons: 5, nitrogens: 1 },
    Q: { code: "Q", three: "Gln", name: "Glutamine", freeMass: 146.15, group: "polar", carbons: 5, nitrogens: 2 },
    G: { code: "G", three: "Gly", name: "Glycine", freeMass: 75.07, group: "nonpolar", carbons: 2, nitrogens: 1 },
    H: { code: "H", three: "His", name: "Histidine", freeMass: 155.16, group: "positive", carbons: 6, nitrogens: 3 },
    I: { code: "I", three: "Ile", name: "Isoleucine", freeMass: 131.17, group: "nonpolar", carbons: 6, nitrogens: 1 },
    L: { code: "L", three: "Leu", name: "Leucine", freeMass: 131.17, group: "nonpolar", carbons: 6, nitrogens: 1 },
    K: { code: "K", three: "Lys", name: "Lysine", freeMass: 146.19, group: "positive", carbons: 6, nitrogens: 2 },
    M: { code: "M", three: "Met", name: "Methionine", freeMass: 149.21, group: "nonpolar", carbons: 5, nitrogens: 1 },
    F: { code: "F", three: "Phe", name: "Phenylalanine", freeMass: 165.19, group: "aromatic", carbons: 9, nitrogens: 1 },
    P: { code: "P", three: "Pro", name: "Proline", freeMass: 115.13, group: "nonpolar", carbons: 5, nitrogens: 1 },
    S: { code: "S", three: "Ser", name: "Serine", freeMass: 105.09, group: "polar", carbons: 3, nitrogens: 1 },
    T: { code: "T", three: "Thr", name: "Threonine", freeMass: 119.12, group: "polar", carbons: 4, nitrogens: 1 },
    W: { code: "W", three: "Trp", name: "Tryptophan", freeMass: 204.23, group: "aromatic", carbons: 11, nitrogens: 2 },
    Y: { code: "Y", three: "Tyr", name: "Tyrosine", freeMass: 181.19, group: "aromatic", carbons: 9, nitrogens: 1 },
    V: { code: "V", three: "Val", name: "Valine", freeMass: 117.15, group: "nonpolar", carbons: 5, nitrogens: 1 },
};
/**
 * Side-chain and terminal pKa values (EMBOSS / Lehninger set).
 *
 * Several published sets exist and they disagree by up to a pH unit on the
 * termini, which moves a calculated pI by a few tenths. This module uses one set
 * throughout, so the same sequence always gets the same isoelectric point, and
 * the result should be read as an estimate.
 */
export const PKA = {
    nTerminus: 9.69,
    cTerminus: 2.34,
    D: 3.65,
    E: 4.25,
    C: 8.18,
    Y: 10.07,
    H: 6.0,
    K: 10.53,
    R: 12.48,
};
/** Kyte & Doolittle (1982) hydropathy index. */
export const HYDROPATHY_KYTE_DOOLITTLE = {
    A: 1.8, R: -4.5, N: -3.5, D: -3.5, C: 2.5, E: -3.5, Q: -3.5, G: -0.4,
    H: -3.2, I: 4.5, L: 3.8, K: -3.9, M: 1.9, F: 2.8, P: -1.6, S: -0.8,
    T: -0.7, W: -0.9, Y: -1.3, V: 4.2,
};
/** Hopp & Woods (1981) hydrophilicity scale. Higher is more hydrophilic. */
export const HYDROPATHY_HOPP_WOODS = {
    A: -0.5, R: 3.0, N: 0.2, D: 3.0, C: -1.0, E: 3.0, Q: 0.2, G: 0.0,
    H: -0.5, I: -1.8, L: -1.8, K: 3.0, M: -1.3, F: -2.5, P: 0.0, S: 0.3,
    T: -0.4, W: -3.4, Y: -2.3, V: -1.5,
};
/** Eisenberg consensus normalised hydrophobicity scale (1984). */
export const HYDROPATHY_EISENBERG = {
    A: 0.62, R: -2.53, N: -0.78, D: -0.9, C: 0.29, E: -0.74, Q: -0.85, G: 0.48,
    H: -0.4, I: 1.38, L: 1.06, K: -1.5, M: 0.64, F: 1.19, P: 0.12, S: -0.18,
    T: -0.05, W: 0.81, Y: 0.26, V: 1.08,
};
/** Molar absorptivity contributions at 280 nm, Pace et al. (1995). */
export const EXTINCTION_TRP = 5500;
export const EXTINCTION_TYR = 1490;
export const EXTINCTION_CYSTINE = 125;
/** Keep only the twenty standard single-letter codes, upper-cased. */
export function cleanSequence(input) {
    return input.toUpperCase().replace(/[^ACDEFGHIKLMNPQRSTVWY]/g, "");
}
/** Characters that were dropped by `cleanSequence`, de-duplicated, in order. */
export function invalidResidues(input) {
    const seen = new Set();
    const out = [];
    for (const char of input.toUpperCase().replace(/[^A-Z]/g, "")) {
        if (!RESIDUE_MASS_AVERAGE[char] && !seen.has(char)) {
            seen.add(char);
            out.push(char);
        }
    }
    return out;
}
export function countResidue(sequence, residue) {
    let n = 0;
    for (const aa of sequence)
        if (aa === residue)
            n += 1;
    return n;
}
/**
 * Average molecular weight of the linear, unmodified peptide with a free
 * N-terminal amine and a free C-terminal acid.
 *
 * A published catalogue weight often differs from this by a small, explainable
 * amount: an amidated C-terminus is 0.98 Da lighter, an acetylated N-terminus is
 * 42.01 Da heavier, and every disulfide bridge removes 2.02 Da.
 */
export function averageMolecularWeight(sequence) {
    const seq = cleanSequence(sequence);
    if (seq.length === 0)
        return 0;
    let mass = WATER_AVERAGE;
    for (const aa of seq)
        mass += RESIDUE_MASS_AVERAGE[aa];
    return mass;
}
/** Monoisotopic mass of the linear, unmodified peptide. */
export function monoisotopicMass(sequence) {
    const seq = cleanSequence(sequence);
    if (seq.length === 0)
        return 0;
    let mass = WATER_MONOISOTOPIC;
    for (const aa of seq)
        mass += RESIDUE_MASS_MONOISOTOPIC[aa];
    return mass;
}
/** Amino acid counts, keyed by single-letter code. */
export function composition(sequence) {
    const counts = {};
    for (const aa of cleanSequence(sequence))
        counts[aa] = (counts[aa] ?? 0) + 1;
    return counts;
}
/**
 * Net charge at a given pH from the Henderson-Hasselbalch equation, treating
 * every ionisable group as independent.
 *
 * Real charge deviates from this because neighbouring groups shift each other's
 * pKa, which is why the result is an estimate.
 */
export function netCharge(sequence, pH) {
    const seq = cleanSequence(sequence);
    if (seq.length === 0)
        return 0;
    let charge = 0;
    charge += 1 / (1 + Math.pow(10, pH - PKA.nTerminus));
    charge -= 1 / (1 + Math.pow(10, PKA.cTerminus - pH));
    charge += countResidue(seq, "K") / (1 + Math.pow(10, pH - PKA.K));
    charge += countResidue(seq, "R") / (1 + Math.pow(10, pH - PKA.R));
    charge += countResidue(seq, "H") / (1 + Math.pow(10, pH - PKA.H));
    charge -= countResidue(seq, "D") / (1 + Math.pow(10, PKA.D - pH));
    charge -= countResidue(seq, "E") / (1 + Math.pow(10, PKA.E - pH));
    charge -= countResidue(seq, "C") / (1 + Math.pow(10, PKA.C - pH));
    charge -= countResidue(seq, "Y") / (1 + Math.pow(10, PKA.Y - pH));
    return charge;
}
/** pH at which `netCharge` crosses zero, found by bisection over pH 0-14. */
export function isoelectricPoint(sequence) {
    const seq = cleanSequence(sequence);
    if (seq.length === 0)
        return 0;
    let low = 0;
    let high = 14;
    for (let i = 0; i < 100; i += 1) {
        const mid = (low + high) / 2;
        if (netCharge(seq, mid) > 0)
            low = mid;
        else
            high = mid;
    }
    return (low + high) / 2;
}
/** Grand average of hydropathy: the mean Kyte-Doolittle value per residue. */
export function gravy(sequence) {
    const seq = cleanSequence(sequence);
    if (seq.length === 0)
        return 0;
    let sum = 0;
    for (const aa of seq)
        sum += HYDROPATHY_KYTE_DOOLITTLE[aa];
    return sum / seq.length;
}
/**
 * Aliphatic index (Ikai 1980): the relative volume occupied by aliphatic side
 * chains, and a documented correlate of thermostability.
 */
export function aliphaticIndex(sequence) {
    const seq = cleanSequence(sequence);
    if (seq.length === 0)
        return 0;
    const mole = (aa) => (countResidue(seq, aa) / seq.length) * 100;
    return mole("A") + 2.9 * mole("V") + 3.9 * (mole("I") + mole("L"));
}
/**
 * Molar extinction coefficient at 280 nm by the Pace method.
 *
 * `cystines` is the number of disulfide bridges. Passing 0 gives the reduced
 * (denatured) value, which is what a sample in DTT or TCEP actually reads.
 */
export function extinctionCoefficient(sequence, cystines) {
    const seq = cleanSequence(sequence);
    const trp = countResidue(seq, "W");
    const tyr = countResidue(seq, "Y");
    const cys = countResidue(seq, "C");
    const bridges = cystines ?? Math.floor(cys / 2);
    const extinction = trp * EXTINCTION_TRP + tyr * EXTINCTION_TYR + bridges * EXTINCTION_CYSTINE;
    const mass = averageMolecularWeight(seq);
    return {
        extinction,
        absorptivity: mass > 0 ? extinction / mass : 0,
        trp,
        tyr,
        cys,
        cystines: bridges,
    };
}
/**
 * Beer-Lambert concentration from an absorbance reading.
 *
 * Returns molar and mass concentration. A molar concentration multiplied by a
 * molecular weight in g/mol is already g/L, and g/L and mg/mL are the same
 * number, so no further factor of 1000 is applied.
 */
export function beerLambertConcentration(params) {
    const { absorbance, extinction, pathLengthCm, molecularWeight } = params;
    const dilution = params.dilutionFactor && params.dilutionFactor > 0 ? params.dilutionFactor : 1;
    if (!Number.isFinite(absorbance) || !Number.isFinite(pathLengthCm))
        return null;
    if (extinction <= 0 || pathLengthCm <= 0)
        return null;
    const molar = (absorbance * dilution) / (extinction * pathLengthCm);
    return { molar, mgPerMl: molar * molecularWeight };
}
export const COUNTERIONS = [
    {
        id: "free-base",
        name: "Free base (no salt)",
        formula: "none",
        mass: 0,
        typicalContent: [100, 100],
        description: "Peptide with no counterion. Rare for synthetic peptides straight off a purification.",
    },
    {
        id: "acetate",
        name: "Acetate",
        formula: "CH₃COOH",
        mass: 60.05,
        typicalContent: [85, 95],
        description: "The usual salt after an acetate ion-exchange step. Well tolerated in cell work.",
    },
    {
        id: "tfa",
        name: "Trifluoroacetate (TFA)",
        formula: "CF₃COOH",
        mass: 114.02,
        typicalContent: [70, 90],
        description: "Left behind by reverse-phase purification. Cytotoxic above roughly 0.1% in culture.",
    },
    {
        id: "hcl",
        name: "Hydrochloride",
        formula: "HCl",
        mass: 36.46,
        typicalContent: [90, 97],
        description: "Light counterion, so peptide content stays high.",
    },
    {
        id: "sulfate",
        name: "Sulfate",
        formula: "H₂SO₄",
        mass: 98.08,
        typicalContent: [80, 93],
        description: "Divalent; one sulfate can balance two basic sites.",
    },
    {
        id: "citrate",
        name: "Citrate",
        formula: "C₆H₈O₇",
        mass: 192.12,
        typicalContent: [75, 92],
        description: "Heavy trivalent counterion, also used as a buffering excipient.",
    },
    {
        id: "phosphate",
        name: "Phosphate",
        formula: "H₃PO₄",
        mass: 98.0,
        typicalContent: [80, 93],
        description: "Common in formulated products rather than raw synthesis.",
    },
    {
        id: "succinate",
        name: "Succinate",
        formula: "C₄H₆O₄",
        mass: 118.09,
        typicalContent: [80, 93],
        description: "Occasional formulation salt for peptides sensitive to chloride.",
    },
];
export function getCounterion(id) {
    return COUNTERIONS.find((c) => c.id === id) ?? COUNTERIONS[0];
}
/**
 * Fraction of a salt's mass that is peptide, from molecular weights.
 *
 * This is the number a certificate calls "peptide content" when it is derived
 * from the salt stoichiometry rather than measured by amino acid analysis.
 */
export function peptideContentFraction(freeBaseMw, counterion, counterionCount = 1) {
    if (freeBaseMw <= 0)
        return 0;
    const saltMw = freeBaseMw + counterion.mass * Math.max(0, counterionCount);
    return freeBaseMw / saltMw;
}
/**
 * Net peptide in a labelled mass, after purity, salt and water.
 *
 * Each factor removes a different part of the powder, so they multiply. A
 * certificate that already reports "net peptide content" by amino acid analysis
 * has folded the salt and the water in already: applying them again here would
 * double-count, so check which figure the certificate reports first.
 */
export function netPeptideMass(params) {
    const { labelledMass, purityPercent, peptideContentFraction: content } = params;
    const water = params.waterPercent ?? 0;
    if (labelledMass <= 0)
        return 0;
    return labelledMass * (purityPercent / 100) * content * (1 - water / 100);
}
/** Singly- or multiply-protonated m/z from a neutral monoisotopic mass. */
export function mzFromMass(neutralMass, charge) {
    if (charge === 0)
        return neutralMass;
    return (neutralMass + charge * PROTON_MASS) / charge;
}
/**
 * b- and y-ion series for a CID/HCD fragmentation table.
 *
 * b ions keep the N-terminus and carry no extra water; y ions keep the
 * C-terminus and do. Both are returned as neutral masses so the caller decides
 * the charge state.
 */
export function fragmentIons(sequence, options = {}) {
    const residues = cleanSequence(sequence).split("");
    if (residues.length < 2)
        return null;
    const masses = residues.map((aa) => {
        const base = RESIDUE_MASS_MONOISOTOPIC[aa];
        return options.oxidisedMet && aa === "M" ? base + 15.994915 : base;
    });
    const b = [];
    let runningB = 0;
    for (let i = 0; i < residues.length - 1; i += 1) {
        runningB += masses[i];
        b.push(runningB);
    }
    const y = [];
    let runningY = WATER_MONOISOTOPIC;
    for (let i = residues.length - 1; i > 0; i -= 1) {
        runningY += masses[i];
        y.push(runningY);
    }
    return {
        residues,
        b,
        y,
        precursor: masses.reduce((a, m) => a + m, 0) + WATER_MONOISOTOPIC,
    };
}
/** Common mass shifts seen when an observed mass misses the expected one. */
export const MASS_MODIFICATIONS = [
    { name: "Oxidation (Met, Trp)", delta: 15.9949, description: "One oxygen added; methionine sulfoxide is the usual culprit." },
    { name: "Di-oxidation", delta: 31.9898, description: "Two oxygens, e.g. methionine sulfone or dioxidised tryptophan." },
    { name: "Deamidation (Asn, Gln)", delta: 0.984, description: "Amide hydrolysed to a carboxylic acid; adds one mass unit." },
    { name: "Phosphorylation", delta: 79.9663, description: "Phosphate on Ser, Thr or Tyr." },
    { name: "Acetylation", delta: 42.0106, description: "N-terminal or lysine acetyl group." },
    { name: "Methylation", delta: 14.0157, description: "One methyl group." },
    { name: "Amidation (C-terminus)", delta: -0.9840, description: "C-terminal acid replaced by an amide; most GH-secretagogue peptides are amidated." },
    { name: "Disulfide bond formation", delta: -2.0157, description: "Two hydrogens lost as a cystine bridge closes." },
    { name: "Sodium adduct (+Na −H)", delta: 21.9819, description: "Sodium replacing a proton, not a covalent change." },
    { name: "Potassium adduct (+K −H)", delta: 37.9559, description: "Potassium replacing a proton." },
    { name: "Water loss", delta: -18.0106, description: "Dehydration, often from cyclisation or succinimide formation." },
    { name: "Ammonia loss", delta: -17.0265, description: "Loss of NH₃, common from N-terminal Gln forming pyroglutamate." },
    { name: "Formylation", delta: 27.9949, description: "Formyl group, sometimes from residual formic acid." },
    { name: "Carbamidomethylation", delta: 57.0215, description: "Cysteine alkylated by iodoacetamide during sample prep." },
    { name: "Trifluoroacetate adduct", delta: 113.9929, description: "Residual TFA from purification riding along." },
];
/**
 * Modifications whose signed mass shift explains an observed-minus-expected
 * difference.
 *
 * Signed on purpose: a peptide 16 Da lighter than expected is not oxidised.
 */
export function explainMassDifference(differenceDa, toleranceDa = 0.2) {
    if (!Number.isFinite(differenceDa))
        return [];
    return MASS_MODIFICATIONS.filter((mod) => Math.abs(differenceDa - mod.delta) <= toleranceDa).map((mod) => ({ name: mod.name, delta: mod.delta, description: mod.description }));
}
/**
 * Radius of gyration of a compact globular chain, in ångström.
 *
 * From the empirical fit R ≈ 0.66·M^(1/3) with M in daltons.
 */
export function globularDiameterAngstrom(residues) {
    if (residues <= 0)
        return 0;
    const mass = residues * 110;
    return 2 * 0.66 * Math.cbrt(mass);
}
/** Contour length of a fully extended chain, ~3.5 Å per residue. */
export function extendedLengthAngstrom(residues) {
    return Math.max(0, residues) * 3.5;
}
/**
 * Henderson-Hasselbalch split of a buffer between its acid and base forms.
 *
 * `capacity` is the Van Slyke buffer capacity in millimoles per litre per pH
 * unit, which peaks at the pKa and falls away either side of it.
 */
export function bufferComposition(targetPh, pKa, totalConcentrationMm) {
    const ratio = Math.pow(10, targetPh - pKa);
    const baseMm = (ratio / (1 + ratio)) * totalConcentrationMm;
    return {
        ratio,
        baseMm,
        acidMm: totalConcentrationMm - baseMm,
        capacity: 2.303 * totalConcentrationMm * (ratio / Math.pow(1 + ratio, 2)),
    };
}
