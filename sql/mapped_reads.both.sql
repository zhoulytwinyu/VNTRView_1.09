SELECT
  ("readid:" || rid) as ID,
  (head || " (p=" || ROUND(rank.score,4) || ", f=" || ROUND(rankflank.score,4) || ") " || first || "-" || last) as Info,
  dna as Sequence
  FROM fasta_reads
    JOIN replnk USING(sid)
    JOIN rank ON rid=readid
    JOIN rankflank USING (readid,refid)
  WHERE refid={reference_id}
  {limit}
