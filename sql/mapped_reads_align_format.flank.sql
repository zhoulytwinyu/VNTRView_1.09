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
  (head || " (f=" || ROUND(fscore,4) || ") " )
  FROM fasta_reads
    JOIN replnk USING(sid)
    JOIN clusterlnk ON rid=repeatid
    JOIN best_by_flank_map ON replnk.rid=readid
  WHERE refid={reference_id}
  {limit}
