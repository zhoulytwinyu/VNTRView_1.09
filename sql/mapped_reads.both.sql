SELECT
  ("readid:" || rid) as ID,
  (head || " (p=" || ROUND(rank.score,4) || ", f=" || ROUND(rankflank.score,4) || ") " || first || "-" || last) as Info,
  dna as Sequence
  FROM fasta_reads
    JOIN replnk USING(sid)
    JOIN rankflank ON replnk.rid=rankflank.readid
    JOIN rank USING (refid,readid)
  WHERE refid={reference_id}
  {limit}
