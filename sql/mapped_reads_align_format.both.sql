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
  (head || " (p=" || ROUND(rank.score,4) || ", f=" || ROUND(rankflank.score,4) || ") " )
  FROM fasta_reads
    JOIN replnk USING(sid)
    JOIN clusterlnk ON rid=repeatid
    JOIN rank ON rid=readid
    JOIN rankflank USING (readid,refid)
  WHERE rid={reference_id}
  {limit}
