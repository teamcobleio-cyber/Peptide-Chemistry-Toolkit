import { AMINO_ACIDS, STANDARD_RESIDUES } from "./chemistry.js";

/**
 * A strict primary-sequence reader.
 *
 * Sequences arrive as prose in several notations: one-letter runs, three-letter
 * hyphenated chains, chains carrying modifications
 * (`Ac-Nle-cyclo[Asp-His-D-Phe-Arg-Trp-Lys]-OH`), placeholders for non-standard
 * residues, and plain description ("37-amino acid cathelicidin peptide").
 *
 * This reader returns a sequence only when every token resolved to one of the
 * twenty standard residues, and null otherwise. Rejecting a partial read is the
 * point: a tolerant reader would report the residues it happened to find, and
 * anything derived from them (an oxidation-labile residue count, a mass) would
 * describe part of a molecule as if it were the whole. A methionine hidden
 * behind a placeholder would produce "no oxidation-labile residue", which is
 * exactly backwards. For modified sequences, use a notation parser instead.
 */
export interface SequenceRead {
  /** One-letter residues, in order. */
  residues: string;
  /** The text this was read out of, for attribution in the UI. */
  source: string;
}

const THREE_TO_ONE: Record<string, string> = Object.fromEntries(
  Object.values(AMINO_ACIDS).map((acid) => [acid.three.toUpperCase(), acid.code])
);

const STANDARD = new Set(STANDARD_RESIDUES.split(""));

/** A bare stereochemistry prefix left behind by splitting `D-Phe` on the hyphen. */
const STEREO_PREFIX = /^[DL]$/;

const ONE_LETTER_RUN = /^[ACDEFGHIKLMNPQRSTVWY]{5,}$/;

/**
 * Five residues is the floor for a one-letter read.
 *
 * Below it, ordinary parenthesised abbreviations start matching: every letter of
 * `HPLC` is a valid one-letter residue code, as are `II`, `CAS` and `MW`. The
 * three-letter path has no such collision, so it takes a lower floor.
 */
function readOneLetter(candidate: string): string | null {
  const compact = candidate.replace(/\s+/g, "");
  return ONE_LETTER_RUN.test(compact) ? compact : null;
}

function readThreeLetter(candidate: string): string | null {
  const tokens = candidate
    .split("-")
    .map((token) => token.trim())
    .filter(Boolean);
  if (tokens.length < 3) return null;

  let residues = "";
  for (const token of tokens) {
    if (STEREO_PREFIX.test(token)) continue;
    const residue = THREE_TO_ONE[token.toUpperCase()];
    // One unrecognised token and the whole read is abandoned. See the note above
    // on why a partial sequence is worse than none.
    if (!residue) return null;
    residues += residue;
  }

  return residues.length >= 3 ? residues : null;
}

function parentheticals(raw: string): string[] {
  return Array.from(raw.matchAll(/\(([^()]+)\)/g)).map((match) => match[1]);
}

export function readSequence(raw: string | undefined | null): SequenceRead | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // A parenthesised one-letter run is the least ambiguous notation the data
  // uses, and it is how the entries that carry both forms present the canonical
  // one: "Gly-Glu-...-Val (GEPPPGKPADDAGLV)".
  for (const segment of [...parentheticals(trimmed), trimmed]) {
    const oneLetter = readOneLetter(segment);
    if (oneLetter) return { residues: oneLetter, source: trimmed };
  }

  for (const segment of [...parentheticals(trimmed), trimmed]) {
    const threeLetter = readThreeLetter(segment);
    if (threeLetter) return { residues: threeLetter, source: trimmed };
  }

  return null;
}

/** How many of `residue` the sequence holds. */
export function count(read: SequenceRead, residue: string): number {
  let total = 0;
  for (const char of read.residues) if (char === residue) total += 1;
  return total;
}

/** Every position of a two-residue motif, 1-indexed, as the literature cites them. */
export function motifPositions(read: SequenceRead, motif: string): number[] {
  const positions: number[] = [];
  for (let i = 0; i + motif.length <= read.residues.length; i += 1) {
    if (read.residues.slice(i, i + motif.length) === motif) positions.push(i + 1);
  }
  return positions;
}

/** "1 Met", "2 Cys and 1 Trp", "3 Asn, 1 Gln and 2 Met". */
export function describeResidues(read: SequenceRead, residues: string[]): string {
  const parts = residues
    .filter((residue) => STANDARD.has(residue))
    .map((residue) => ({ residue, n: count(read, residue) }))
    .filter((entry) => entry.n > 0)
    .map((entry) => `${entry.n} ${AMINO_ACIDS[entry.residue].three}`);

  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0];
  return `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
}
