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
export declare function readSequence(raw: string | undefined | null): SequenceRead | null;
/** How many of `residue` the sequence holds. */
export declare function count(read: SequenceRead, residue: string): number;
/** Every position of a two-residue motif, 1-indexed, as the literature cites them. */
export declare function motifPositions(read: SequenceRead, motif: string): number[];
/** "1 Met", "2 Cys and 1 Trp", "3 Asn, 1 Gln and 2 Met". */
export declare function describeResidues(read: SequenceRead, residues: string[]): string;
