SELECT
  ("readid:" || rid) as ID,
  (head || " (p=" || ROUND(pscore,4) || ") " || first || "-" || last) as Info,
  dna as Sequence
  FROM fasta_reads
    JOIN replnk USING(sid)
    JOIN best_by_profile_map ON rid=readid
  WHERE refid={reference_id}
  {limit}
