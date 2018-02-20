SELECT
  ("readid:" || rid) as ID,
  (head || first || "-" || last) as Info,
  dna as Sequence
  FROM fasta_reads
    JOIN replnk USING(sid)
    JOIN map ON rid=readid
  WHERE refid={reference_id}
  {limit}
