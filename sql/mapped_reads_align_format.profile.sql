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
  head || "(p=" || rank.score || ")"
  FROM fasta_reads
    JOIN replnk USING(sid)
    JOIN clusterlnk ON rid=repeatid
    JOIN rank ON replnk.rid=rank.readid
  WHERE refid={reference_id}
  {limit}
