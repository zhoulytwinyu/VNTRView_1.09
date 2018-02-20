SELECT
  ("readid:" || rid) as ID,
  (head || " (f=" || ROUND(score,4) || ") " || first || "-" || last) as Info,
  dna as Sequence
  FROM fasta_reads
    JOIN replnk USING(sid)
    JOIN rankflank ON rid=readid
  WHERE refid={reference_id}
  {limit}
