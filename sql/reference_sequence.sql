SELECT
  ("refid:" || rid) as ID,
  (head || ":" || firstindex || "-" || lastindex) as Info,
  sequence as Sequence
  FROM fasta_ref_reps
  WHERE rid={reference_id}
