# Peptide Chemistry Toolkit

> This library is maintained by **[Volta Peptides](https://voltapeptides.com/)**, a Canadian supplier of research peptides. The reference peptides below are from the [Volta Peptides catalogue](https://voltapeptides.com/catalog), where every product page carries its formula and molecular weight.

Peptide chemistry in small, dependency-free functions: average and monoisotopic mass, net charge at any pH, isoelectric point, hydropathy, aliphatic index, A280 extinction coefficient, Beer-Lambert concentration, counterion and net peptide content, b/y fragment ions for MS/MS, mass-shift explanations, buffer composition, and a deliberately strict sequence reader.

Every constant names its source (IUPAC 2021 atomic weights via ExPASy, the EMBOSS pKa set, Kyte-Doolittle, Hopp-Woods, Eisenberg, Pace et al. 1995). The test suite checks the output against published masses for real peptides.

## Install

```bash
npm install github:teamcobleio-cyber/Peptide-Chemistry-Toolkit
# or
npm install git+https://gitlab.com/sofiazugas/peptide-chemistry-toolkit.git
```

Works in Node 18+ and any bundler (ESM, with TypeScript types).

## Quick start

```js
import {
  readSequence, averageMolecularWeight, monoisotopicMass,
  isoelectricPoint, netCharge, extinctionCoefficient, fragmentIons, mzFromMass,
} from "peptide-chemistry-toolkit";

// BPC-157, 15 residues
const { residues } = readSequence("GEPPPGKPADDAGLV");

averageMolecularWeight(residues); // 1419.55
monoisotopicMass(residues);       // 1418.7041
isoelectricPoint(residues);       // 3.55
netCharge(residues, 7.4);         // -2.00

// [M+2H]2+ for the mass spectrometer
mzFromMass(monoisotopicMass(residues), 2); // 710.3593

// DSIP has one tryptophan, so it reads at 280 nm
extinctionCoefficient("WAGGDASGE").extinction; // 5500 M⁻¹cm⁻¹
```

The BPC-157 figures above can be checked against its [product page](https://voltapeptides.com/product/bpc-157-5mg) and its [compound hub](https://voltapeptides.com/peptides/bpc-157).

## Reference peptides

Computed by this library from the sequence alone (linear, free N-terminus, free C-terminal acid). Each one matches the published average mass to within 0.06 Da, and `npm test` checks that.

| Peptide | Sequence | Residues | Average mass (Da) | Monoisotopic (Da) | pI | Charge at pH 7 | GRAVY | Volta Peptides |
|---|---|---|---|---|---|---|---|---|
| BPC-157 | `GEPPPGKPADDAGLV` | 15 | 1419.55 | 1418.7041 | 3.55 | -2.00 | -0.69 | [Product page](https://voltapeptides.com/product/bpc-157-5mg) · [Library entry](https://voltapeptides.com/research/compounds/bpc-157) |
| KPV | `KPV` | 3 | 342.44 | 342.2267 | 10.11 | 1.00 | -0.43 | [Product page](https://voltapeptides.com/product/kpv-10mg) · [Library entry](https://voltapeptides.com/research/compounds/kpv) |
| Selank | `TKPRPGP` | 7 | 751.88 | 751.4341 | 11.54 | 2.00 | -2.04 | [Product page](https://voltapeptides.com/product/selank-10mg) · [Library entry](https://voltapeptides.com/research/compounds/selank) |
| Semax | `MEHFPGP` | 7 | 813.93 | 813.3479 | 5.13 | -0.91 | -0.80 | [Product page](https://voltapeptides.com/product/semax-10mg) · [Library entry](https://voltapeptides.com/research/compounds/semax) |
| Epithalon | `AEDG` | 4 | 390.35 | 390.1387 | 2.93 | -2.00 | -1.40 | [Product page](https://voltapeptides.com/product/epithalon-10mg) · [Library entry](https://voltapeptides.com/research/compounds/epithalon) |
| DSIP | `WAGGDASGE` | 9 | 848.82 | 848.3300 | 2.93 | -2.00 | -0.70 | [Product page](https://voltapeptides.com/product/dsip-10mg) · [Library entry](https://voltapeptides.com/research/compounds/dsip) |
| PE-22-28 | `GVSWGLR` | 7 | 773.89 | 773.4184 | 11.09 | 1.00 | 0.14 | [Product page](https://voltapeptides.com/product/pe-22-28-10mg) |
| Pinealon | `EDR` | 3 | 418.41 | 418.1812 | 3.97 | -1.00 | -3.83 | [Product page](https://voltapeptides.com/product/pinealon-10mg) |
| Vesugen | `KED` | 3 | 390.39 | 390.1751 | 3.97 | -1.00 | -3.63 | [Product page](https://voltapeptides.com/product/vesugen-20mg) |
| Cortagen | `AEDP` | 4 | 430.41 | 430.1700 | 2.93 | -2.00 | -1.70 | [Product page](https://voltapeptides.com/product/cortagen-20mg) |

Browse the rest of the range by composition: [all research peptides](https://voltapeptides.com/catalog?type=peptides), [bioregulators](https://voltapeptides.com/catalog?type=bioregulators) and [peptide blends](https://voltapeptides.com/catalog?type=peptide-blends).

## API

| Function | What it returns |
|---|---|
| `averageMolecularWeight(seq)` | Average mass of the linear, unmodified peptide, Da |
| `monoisotopicMass(seq)` | Monoisotopic mass, Da |
| `composition(seq)` | Residue counts keyed by one-letter code |
| `netCharge(seq, pH)` | Henderson-Hasselbalch net charge, termini included |
| `isoelectricPoint(seq)` | pH where net charge is zero (bisection, pH 0 to 14) |
| `gravy(seq)` | Grand average of hydropathy (Kyte-Doolittle) |
| `aliphaticIndex(seq)` | Ikai (1980) aliphatic index |
| `extinctionCoefficient(seq, cystines?)` | Pace-method ε280 and 1 mg/mL absorbance |
| `beerLambertConcentration({...})` | Molar and mg/mL concentration from an A280 reading |
| `peptideContentFraction(mw, counterion, n)` | Peptide fraction of a salt, from stoichiometry |
| `netPeptideMass({...})` | Peptide in a labelled mass after purity, salt and water |
| `fragmentIons(seq, { oxidisedMet })` | Neutral b- and y-ion ladders plus the precursor |
| `mzFromMass(mass, z)` | m/z for a protonated charge state |
| `explainMassDifference(delta, tol)` | Modifications whose signed mass shift fits an observed difference |
| `bufferComposition(pH, pKa, mM)` | Acid and base split plus Van Slyke capacity |
| `readSequence(text)` | A one-letter sequence, or `null` if any token is non-standard |

Constants are exported too: `RESIDUE_MASS_AVERAGE`, `RESIDUE_MASS_MONOISOTOPIC`, `AMINO_ACIDS`, `PKA`, the three hydropathy scales, `COUNTERIONS` and `MASS_MODIFICATIONS`.

### Why the sequence reader is strict

`readSequence` returns `null` for anything carrying a non-standard residue or a modification, such as `Ac-Nle-cyclo[Asp-His-D-Phe-Arg-Trp-Lys]-NH2`. A tolerant reader would skip what it did not recognise and report a mass, a charge or a residue count for part of the molecule as if it were all of it. For modified peptides, start from the published formula and use `explainMassDifference` to account for what a modification changes.

### Masses on a certificate

A certificate of analysis reports the observed mass of one lot, often as the salt, with an amidated or acetylated terminus, or with disulfides closed. An amidated C-terminus is 0.98 Da lighter, an N-acetyl group adds 42.01 Da, and each disulfide removes 2.02 Da. `explainMassDifference` covers these and a dozen other common shifts. Volta Peptides publishes its [certificates of analysis](https://voltapeptides.com/coas) with the laboratory's report number and verification link.

## Development

```bash
npm install
npm run build
npm test
```

## Licence

MIT. Built and maintained by [Volta Peptides](https://voltapeptides.com/). For research use only; nothing here is medical advice.
