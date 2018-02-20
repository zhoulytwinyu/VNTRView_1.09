SELECT
  rid,
  first,
  last,
  dna,
  pattern,
  "0",
  "0",
  direction,
  clusterlnk.reserved,
  clusterlnk.reserved2,
  (head || " (p=" || ROUND(pscore,4) || ", f=" || ROUND(fscore,4) || ") " )
  FROM fasta_reads
    JOIN replnk USING(sid)
    JOIN clusterlnk ON rid=repeatid
    JOIN best_by_both_map ON refid=rid AND replnk.rid=readid
  WHERE rid={reference_id}
  {limit}
