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
  head || "(p=" || rank.score || ",f=" || rankflank.score || ")"
  FROM fasta_reads
    JOIN replnk USING(sid)
    JOIN clusterlnk ON rid=repeatid
    JOIN rankflank ON replnk.rid=rankflank.readid
    JOIN rank USING (refid,readid)
  WHERE refid={reference_id}
  {limit}
