import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  averageMolecularWeight, monoisotopicMass, isoelectricPoint, netCharge,
  extinctionCoefficient, fragmentIons, explainMassDifference, readSequence,
  peptideContentFraction, getCounterion, beerLambertConcentration,
} from "../dist/index.js";

const reference = JSON.parse(readFileSync(new URL("../data/reference-peptides.json", import.meta.url), "utf8"));

test("average masses match the published reference masses to 0.06 Da", () => {
  for (const peptide of reference) {
    const read = readSequence(peptide.notation);
    assert.ok(read, `${peptide.name} should read`);
    const mass = averageMolecularWeight(read.residues);
    assert.ok(Math.abs(mass - peptide.referenceAverageMass) < 0.06, `${peptide.name}: ${mass} vs ${peptide.referenceAverageMass}`);
  }
});

test("monoisotopic mass of glycine dipeptide", () => {
  // Gly-Gly, C4H8N2O3: 132.0535 Da.
  assert.ok(Math.abs(monoisotopicMass("GG") - 132.0535) < 0.001);
});

test("net charge falls through zero at the isoelectric point", () => {
  const pI = isoelectricPoint("GEPPPGKPADDAGLV");
  assert.ok(Math.abs(netCharge("GEPPPGKPADDAGLV", pI)) < 1e-6);
  assert.ok(pI > 3 && pI < 4.5);
});

test("extinction coefficient by the Pace method", () => {
  // One Trp, no Tyr, no Cys.
  assert.equal(extinctionCoefficient("WAGGDASGE").extinction, 5500);
  // A peptide with no Trp, Tyr or cystine has no A280 signal.
  assert.equal(extinctionCoefficient("GEPPPGKPADDAGLV").extinction, 0);
});

test("b and y ions sum to the precursor plus one water", () => {
  const ions = fragmentIons("TKPRPGP");
  assert.ok(ions);
  const n = ions.residues.length;
  for (let i = 0; i < n - 1; i += 1) {
    const total = ions.b[i] + ions.y[n - 2 - i];
    assert.ok(Math.abs(total - ions.precursor) < 1e-6);
  }
});

test("a mass difference is explained with its sign", () => {
  assert.ok(explainMassDifference(15.99).some((m) => m.name.startsWith("Oxidation")));
  assert.ok(!explainMassDifference(-15.99).some((m) => m.name.startsWith("Oxidation")));
});

test("the strict reader refuses a modified sequence", () => {
  assert.equal(readSequence("Ac-Nle-cyclo[Asp-His-D-Phe-Arg-Trp-Lys]-NH2"), null);
  assert.equal(readSequence("HPLC"), null);
});

test("counterion and concentration arithmetic", () => {
  const acetate = getCounterion("acetate");
  const f = peptideContentFraction(1419.5, acetate, 1);
  assert.ok(Math.abs(f - 1419.5 / 1479.55) < 1e-9);
  const c = beerLambertConcentration({ absorbance: 0.55, extinction: 5500, pathLengthCm: 1, molecularWeight: 848.8 });
  assert.ok(c && Math.abs(c.molar - 1e-4) < 1e-12);
});
